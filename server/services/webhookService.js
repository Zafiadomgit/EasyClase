import crypto from 'crypto';
import { verificarPago } from './mercadoPagoService.js';
import Clase from '../models/Clase.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import CompraServicio from '../models/CompraServicio.js';
import Servicio from '../models/Servicio.js';
import { crearEscrow } from './escrowService.js';
import notificationScheduler from './notificationSchedulerService.js';

// Verificar la firma del webhook de MercadoPago
const verificarFirmaWebhook = (req) => {
  try {
    const signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];
    const payload = JSON.stringify(req.body);
    
    if (!signature || !timestamp) {
      console.warn('Webhook sin firma o timestamp');
      return false;
    }

    // Crear la firma esperada
    const expectedSignature = crypto
      .createHmac('sha256', process.env.MP_WEBHOOK_SECRET || 'default_secret')
      .update(`${timestamp}.${payload}`)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Error verificando firma del webhook:', error);
    return false;
  }
};

// Procesar pago aprobado
const procesarPagoAprobado = async (paymentData) => {
  try {
    const { external_reference, id: paymentId, transaction_amount, payer, payment_method } = paymentData;
    
    console.log(`🔄 Procesando pago aprobado: ${paymentId} para referencia: ${external_reference}`);

    // Verificar si es una compra de servicio
    if (external_reference.startsWith('servicio_')) {
      return await procesarPagoServicio(paymentData);
    }

    // Buscar la clase
    const clase = await Clase.findById(external_reference);
    if (!clase) {
      console.error(`❌ Clase no encontrada: ${external_reference}`);
      return { success: false, error: 'Clase no encontrada' };
    }

    // Verificar que el pago no haya sido procesado antes
    if (clase.estadoPago === 'pagado') {
      console.log(`⚠️ Pago ya procesado para clase: ${external_reference}`);
      return { success: true, message: 'Pago ya procesado' };
    }

    // Calcular comisión (20%)
    const comision = transaction_amount * 0.20;
    const montoNeto = transaction_amount - comision;

    // Crear registro de transacción
    const transaction = new Transaction({
      transactionId: `TXN_${Date.now()}_${paymentId}`,
      type: 'pago_clase',
      status: 'approved',
      amount: transaction_amount,
      amountNet: montoNeto,
      commission: comision,
      currency: 'COP',
      claseId: external_reference,
      estudianteId: clase.estudiante,
      profesorId: clase.profesor,
      mercadoPagoId: paymentId,
      externalReference: external_reference,
      payer: {
        email: payer?.email,
        name: payer?.name,
        identification: payer?.identification
      },
      paymentMethod: {
        type: payment_method?.type,
        paymentType: payment_method?.payment_type_id,
        installments: payment_method?.installments
      },
      metadata: new Map([
        ['clase_materia', clase.materia],
        ['clase_duracion', clase.duracion.toString()],
        ['clase_modalidad', clase.modalidad]
      ]),
      processedAt: new Date()
    });

    await transaction.save();

    // Actualizar estado de la clase
    clase.estadoPago = 'pagado';
    clase.pagoId = paymentId;
    clase.fechaPago = new Date();
    clase.montoPagado = transaction_amount;
    clase.estado = 'confirmada'; // Confirmar la clase automáticamente
    clase.transactionId = transaction._id;
    
    await clase.save();

    // Crear escrow automáticamente
    try {
      await crearEscrow(external_reference, transaction._id);
      console.log(`🔒 Escrow creado automáticamente para clase: ${external_reference}`);
    } catch (escrowError) {
      console.error('Error creando escrow:', escrowError);
      // No fallar el webhook por error en escrow
    }

    // Enviar correo de confirmación de pago al estudiante
    try {
      // Poblar los datos necesarios para el correo
      await clase.populate([
        { path: 'estudiante', select: 'nombre email' },
        { path: 'profesor', select: 'nombre' }
      ]);

      const paymentInfo = {
        amount: transaction_amount,
        paymentMethod: payment_method?.type || 'No especificado',
        reference: `PAY-${paymentId}`
      };

      await notificationScheduler.sendImmediateNotification('payment_success', {
        user: clase.estudiante,
        paymentInfo
      });

      console.log(`📧 Correo de confirmación de pago enviado a ${clase.estudiante.email}`);
    } catch (emailError) {
      console.error('Error enviando correo de confirmación de pago:', emailError);
      // No fallar el webhook por error en el correo
    }

    // Notificar al profesor (aquí podrías enviar email/notificación)
    console.log(`✅ Clase confirmada, pagada y escrow creado: ${external_reference}`);
    
    return { 
      success: true, 
      message: 'Pago procesado correctamente',
      claseId: external_reference,
      transactionId: transaction._id
    };

  } catch (error) {
    console.error('Error procesando pago aprobado:', error);
    return { success: false, error: error.message };
  }
};

// Procesar pago rechazado
const procesarPagoRechazado = async (paymentData) => {
  try {
    const { external_reference, id: paymentId } = paymentData;
    
    console.log(`❌ Procesando pago rechazado: ${paymentId} para clase: ${external_reference}`);

    const clase = await Clase.findById(external_reference);
    if (!clase) {
      console.error(`❌ Clase no encontrada: ${external_reference}`);
      return { success: false, error: 'Clase no encontrada' };
    }

    // Actualizar estado de la clase
    clase.estadoPago = 'rechazado';
    clase.pagoId = paymentId;
    clase.fechaPago = new Date();
    clase.estado = 'cancelada';
    
    await clase.save();

    // Enviar correo de pago rechazado al estudiante
    try {
      await clase.populate([
        { path: 'estudiante', select: 'nombre email' }
      ]);

      await notificationScheduler.sendImmediateNotification('payment_failed', {
        user: clase.estudiante,
        clase: clase
      });

      console.log(`📧 Correo de pago rechazado enviado a ${clase.estudiante.email}`);
    } catch (emailError) {
      console.error('Error enviando correo de pago rechazado:', emailError);
    }

    // Notificar al estudiante sobre el pago rechazado
    console.log(`✅ Clase cancelada por pago rechazado: ${external_reference}`);
    
    return { 
      success: true, 
      message: 'Pago rechazado procesado',
      claseId: external_reference
    };

  } catch (error) {
    console.error('Error procesando pago rechazado:', error);
    return { success: false, error: error.message };
  }
};

// Procesar pago pendiente
const procesarPagoPendiente = async (paymentData) => {
  try {
    const { external_reference, id: paymentId } = paymentData;
    
    console.log(`⏳ Procesando pago pendiente: ${paymentId} para clase: ${external_reference}`);

    const clase = await Clase.findById(external_reference);
    if (!clase) {
      console.error(`❌ Clase no encontrada: ${external_reference}`);
      return { success: false, error: 'Clase no encontrada' };
    }

    // Actualizar estado de la clase
    clase.estadoPago = 'pendiente';
    clase.pagoId = paymentId;
    clase.fechaPago = new Date();
    
    await clase.save();

    console.log(`✅ Estado de pago actualizado a pendiente: ${external_reference}`);
    
    return { 
      success: true, 
      message: 'Pago pendiente procesado',
      claseId: external_reference
    };

  } catch (error) {
    console.error('Error procesando pago pendiente:', error);
    return { success: false, error: error.message };
  }
};

// Procesar retiro de profesor
const procesarRetiroProfesor = async (paymentData) => {
  try {
    const { external_reference, id: paymentId, transaction_amount, metadata } = paymentData;
    
    console.log(`💰 Procesando retiro de profesor: ${paymentId}`);

    // Extraer información del metadata
    const { profesor_id, monto_original, monto_neto, comision } = metadata || {};

    // Aquí podrías actualizar el balance del profesor
    // Por ahora solo logueamos la información
    console.log(`✅ Retiro procesado para profesor ${profesor_id}: $${monto_neto} (comisión: $${comision})`);
    
    return { 
      success: true, 
      message: 'Retiro procesado correctamente',
      profesorId: profesor_id,
      montoNeto: monto_neto
    };

  } catch (error) {
    console.error('Error procesando retiro de profesor:', error);
    return { success: false, error: error.message };
  }
};

// Función principal para procesar webhooks
export const procesarWebhook = async (req, res) => {
  try {
    console.log("📨 Webhook recibido:", {
      type: req.body.type,
      data: req.body.data,
      timestamp: new Date().toISOString()
    });

    // Verificar firma del webhook (en producción)
    if (process.env.NODE_ENV === 'production') {
      const firmaValida = verificarFirmaWebhook(req);
      if (!firmaValida) {
        console.warn('⚠️ Webhook con firma inválida');
        return res.status(401).json({ error: 'Firma inválida' });
      }
    }

    const { data, type } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Verificar el pago con MercadoPago
      const paymentData = await verificarPago(paymentId);
      
      if (!paymentData) {
        console.error(`❌ No se pudo verificar el pago: ${paymentId}`);
        return res.status(400).json({ error: 'Pago no encontrado' });
      }

      let resultado;

      // Procesar según el estado del pago
      switch (paymentData.status) {
        case 'approved':
          // Verificar si es un retiro de profesor o pago de clase
          if (paymentData.metadata?.tipo === 'retiro_profesor') {
            resultado = await procesarRetiroProfesor(paymentData);
          } else {
            resultado = await procesarPagoAprobado(paymentData);
          }
          break;

        case 'rejected':
        case 'cancelled':
          resultado = await procesarPagoRechazado(paymentData);
          break;

        case 'pending':
        case 'in_process':
          resultado = await procesarPagoPendiente(paymentData);
          break;

        default:
          console.log(`ℹ️ Estado de pago no manejado: ${paymentData.status}`);
          resultado = { success: true, message: 'Estado no manejado' };
      }

      if (resultado.success) {
        console.log(`✅ Webhook procesado exitosamente: ${resultado.message}`);
        return res.status(200).json({ success: true, message: resultado.message });
      } else {
        console.error(`❌ Error procesando webhook: ${resultado.error}`);
        return res.status(500).json({ error: resultado.error });
      }
    }

    // Otros tipos de webhook (puedes agregar más según necesites)
    console.log(`ℹ️ Tipo de webhook no manejado: ${type}`);
    return res.status(200).json({ success: true, message: 'Webhook recibido' });

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para reenviar webhooks fallidos
export const reenviarWebhookFallido = async (paymentId) => {
  try {
    console.log(`🔄 Reenviando webhook fallido para pago: ${paymentId}`);
    
    const paymentData = await verificarPago(paymentId);
    if (!paymentData) {
      throw new Error('Pago no encontrado');
    }

    // Simular el webhook
    const webhookData = {
      type: 'payment',
      data: { id: paymentId }
    };

    // Procesar como si fuera un webhook real
    const resultado = await procesarWebhook({ body: webhookData }, { status: () => ({ json: () => {} }) });
    
    console.log(`✅ Webhook reenviado exitosamente: ${paymentId}`);
    return resultado;

  } catch (error) {
    console.error('❌ Error reenviando webhook:', error);
    throw error;
  }
};

// Procesar pago de servicio
const procesarPagoServicio = async (paymentData) => {
  try {
    const { external_reference, id: paymentId, transaction_amount, payer, payment_method } = paymentData;
    
    console.log(`🔄 Procesando pago de servicio: ${paymentId} para compra: ${external_reference}`);

    // Extraer ID de compra del external_reference (formato: servicio_123)
    const compraId = external_reference.replace('servicio_', '');
    
    // Buscar la compra
    const compra = await CompraServicio.findByPk(compraId);
    if (!compra) {
      console.error(`❌ Compra no encontrada: ${compraId}`);
      return { success: false, error: 'Compra no encontrada' };
    }

    // Verificar que el pago no haya sido procesado antes
    if (compra.estado === 'pagado') {
      console.log(`⚠️ Pago ya procesado para compra: ${compraId}`);
      return { success: true, message: 'Pago ya procesado' };
    }

    // Obtener el servicio
    const servicio = await Servicio.findByPk(compra.servicio);
    if (!servicio) {
      console.error(`❌ Servicio no encontrado: ${compra.servicio}`);
      return { success: false, error: 'Servicio no encontrado' };
    }

    // Calcular comisión (20%)
    const comision = transaction_amount * 0.20;
    const montoNeto = transaction_amount - comision;

    // Crear registro de transacción
    const transaction = new Transaction({
      transactionId: `TXN_${Date.now()}_${paymentId}`,
      type: 'pago_servicio',
      status: 'approved',
      amount: transaction_amount,
      amountNet: montoNeto,
      commission: comision,
      currency: 'COP',
      servicioId: compra.servicio,
      estudianteId: compra.estudiante,
      profesorId: servicio.proveedor,
      mercadoPagoId: paymentId,
      externalReference: external_reference,
      payer: {
        email: payer?.email,
        name: payer?.name,
        identification: payer?.identification
      },
      paymentMethod: {
        type: payment_method?.type,
        paymentType: payment_method?.payment_type_id,
        installments: payment_method?.installments
      },
      metadata: new Map([
        ['servicio_titulo', servicio.titulo],
        ['servicio_categoria', servicio.categoria],
        ['servicio_tipo', servicio.tipo]
      ]),
      processedAt: new Date()
    });

    await transaction.save();

    // Actualizar estado de la compra
    compra.estado = 'pagado';
    compra.pagoId = paymentId;
    compra.fechaPago = new Date();
    compra.fechaAcceso = new Date();
    compra.transactionId = transaction._id;
    
    await compra.save();

    // Actualizar balance del profesor
    await actualizarBalanceProfesor(servicio.proveedor, montoNeto);

    // Enviar correo de confirmación al estudiante
    try {
      const estudiante = await User.findByPk(compra.estudiante);
      if (estudiante) {
        await notificationScheduler.sendImmediateNotification('service_purchase_success', {
          user: estudiante,
          serviceInfo: {
            title: servicio.titulo,
            amount: transaction_amount
          }
        });
        console.log(`📧 Correo de confirmación de compra enviado a ${estudiante.email}`);
      }
    } catch (emailError) {
      console.error('Error enviando correo de confirmación de compra:', emailError);
    }

    console.log(`✅ Servicio comprado exitosamente: ${compraId}`);
    
    return { 
      success: true, 
      message: 'Pago de servicio procesado correctamente',
      compraId: compraId,
      transactionId: transaction._id
    };

  } catch (error) {
    console.error('Error procesando pago de servicio:', error);
    return { success: false, error: error.message };
  }
};
