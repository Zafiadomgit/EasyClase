// Endpoint para verificar el token de MercadoPago en producción
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const diagnostico = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      mpAccessToken: {
        configurado: !!process.env.MP_ACCESS_TOKEN,
        tipo: process.env.MP_ACCESS_TOKEN?.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 
              process.env.MP_ACCESS_TOKEN?.startsWith('TEST-') ? 'TEST' : 'DESCONOCIDO',
        longitud: process.env.MP_ACCESS_TOKEN?.length || 0,
        primeros10: process.env.MP_ACCESS_TOKEN?.substring(0, 10) || 'NO_CONFIGURADO'
      },
      mpPublicKey: {
        configurado: !!process.env.MP_PUBLIC_KEY,
        tipo: process.env.MP_PUBLIC_KEY?.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 
              process.env.MP_PUBLIC_KEY?.startsWith('TEST-') ? 'TEST' : 'DESCONOCIDO',
        longitud: process.env.MP_PUBLIC_KEY?.length || 0,
        primeros10: process.env.MP_PUBLIC_KEY?.substring(0, 10) || 'NO_CONFIGURADO'
      },
      urls: {
        frontend: process.env.FRONTEND_URL,
        webhook: process.env.WEBHOOK_URL,
        success: process.env.FRONTEND_SUCCESS_URL,
        failure: process.env.FRONTEND_FAILURE_URL
      }
    };

    // Probar el token directamente
    if (process.env.MP_ACCESS_TOKEN) {
      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.mercadopago.com/users/me', {
          headers: {
            'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          diagnostico.tokenTest = {
            valido: true,
            usuario: userData.nickname || 'Usuario',
            tipo: userData.site_id || 'Desconocido'
          };
        } else {
          const errorData = await response.json().catch(() => ({}));
          diagnostico.tokenTest = {
            valido: false,
            error: `Error ${response.status}: ${response.statusText}`,
            detalles: errorData
          };
        }
      } catch (error) {
        diagnostico.tokenTest = {
          valido: false,
          error: `Error de conexión: ${error.message}`
        };
      }
    } else {
      diagnostico.tokenTest = {
        valido: false,
        error: 'Token no configurado'
      };
    }

    res.status(200).json({
      success: true,
      diagnostico
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

