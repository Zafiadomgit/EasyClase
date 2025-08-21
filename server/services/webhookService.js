import crypto from 'crypto';
import { verificarPago } from './mercadoPagoService.js';
import Clase from '../models/Clase.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { crearEscrow } from './escrowService.js';

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
    
    console.log(`🔄 Procesando pago aprobado: ${paymentId} para clase: ${external_reference}`);

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
