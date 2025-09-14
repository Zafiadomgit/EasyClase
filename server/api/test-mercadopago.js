// Endpoint para probar la configuración de MercadoPago
import { crearPagoMercadoPago } from '../services/mercadoPagoService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Datos de prueba
    const testData = {
      titulo: 'Clase de Prueba - EasyClase',
      precio: 1000, // $1,000 COP
      claseId: 'test_' + Date.now(),
      estudianteEmail: 'test@easyclaseapp.com'
    };

    console.log('Iniciando prueba de MercadoPago...');
    const resultado = await crearPagoMercadoPago(testData);

    res.status(200).json({
      success: true,
      message: 'Prueba de MercadoPago exitosa',
      data: {
        pagoId: resultado.id,
        initPoint: resultado.init_point,
        sandboxInitPoint: resultado.sandbox_init_point
      }
    });

  } catch (error) {
    console.error('Error en prueba de MercadoPago:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la prueba de MercadoPago',
      error: error.message
    });
  }
}
