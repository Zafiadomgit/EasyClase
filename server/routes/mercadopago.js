import express from 'express';
import { crearPagoMercadoPago, verificarPago } from '../services/mercadoPagoService.js';

const router = express.Router();

// Crear preferencia de pago
router.post('/crear-preferencia', async (req, res) => {
  try {
    const { titulo, precio, descripcion, reservaData } = req.body;
    
    if (!titulo || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Título y precio son requeridos'
      });
    }

    // Crear la preferencia de pago
    const preference = await crearPagoMercadoPago({
      titulo,
      precio: parseFloat(precio),
      claseId: reservaData?.claseId || 'temp_' + Date.now(),
      estudianteEmail: reservaData?.estudianteEmail || 'test@example.com'
    });

    res.json({
      success: true,
      init_point: preference.init_point,
      preference_id: preference.id
    });

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    res.status(500).json({
      success: false,
      message: `Error al crear el pago: ${error.message}`
    });
  }
});

// Verificar estado de pago
router.get('/verificar-pago/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await verificarPago(paymentId);
    
    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Error verificando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el pago'
    });
  }
});

// Webhook de MercadoPago
router.post('/webhook', async (req, res) => {
  try {
    const { type, action, data } = req.body;
    
    console.log('Webhook MercadoPago recibido:', { type, action, data });
    
    if (type === 'payment' && action === 'payment.created') {
      const paymentId = data.id;
      
      // Verificar el pago
      const payment = await verificarPago(paymentId);
      
      if (payment.status === 'approved') {
        // Aquí puedes procesar el pago aprobado
        console.log('Pago aprobado:', paymentId);
        
        // TODO: Actualizar la base de datos con el pago aprobado
        // TODO: Enviar notificaciones por email
        // TODO: Actualizar el estado de la reserva
      }
    }
    
    res.status(200).json({ status: 'ok' });
    
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

export default router;
