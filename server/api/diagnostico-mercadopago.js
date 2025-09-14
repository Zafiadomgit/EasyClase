// Endpoint de diagnóstico para verificar la configuración de MercadoPago
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const diagnostico = {
      nodeEnv: process.env.NODE_ENV,
      mpAccessToken: {
        configurado: !!process.env.MP_ACCESS_TOKEN,
        tipo: process.env.MP_ACCESS_TOKEN?.startsWith('TEST-') ? 'Test' : 'Producción',
        longitud: process.env.MP_ACCESS_TOKEN?.length || 0
      },
      mpPublicKey: {
        configurado: !!process.env.MP_PUBLIC_KEY,
        longitud: process.env.MP_PUBLIC_KEY?.length || 0
      },
      urls: {
        frontend: process.env.FRONTEND_URL,
        webhook: process.env.WEBHOOK_URL,
        success: process.env.FRONTEND_SUCCESS_URL,
        failure: process.env.FRONTEND_FAILURE_URL
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      diagnostico
    });
  } catch (error) {
    console.error('Error en diagnóstico:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
