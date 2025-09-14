import fetch from 'node-fetch';

// Función para validar el token de MercadoPago
const validarTokenMercadoPago = async (token) => {
  try {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      return {
        valido: true,
        tipo: token.startsWith('TEST-') ? 'test' : 'produccion',
        usuario: userData.nickname || 'Usuario'
      };
    } else {
      return {
        valido: false,
        error: `Token inválido: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      valido: false,
      error: `Error validando token: ${error.message}`
    };
  }
};

export const crearPagoMercadoPago = async ({ titulo, precio, claseId, estudianteEmail }) => {
  try {
    // Verificar que el token esté disponible
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error('Token de MercadoPago no configurado');
    }
    
    // Validar el token antes de usarlo
    console.log('Validando token de MercadoPago...');
    const validacion = await validarTokenMercadoPago(process.env.MP_ACCESS_TOKEN);
    
    if (!validacion.valido) {
      console.error('Token de MercadoPago inválido:', validacion.error);
      throw new Error(`Token de MercadoPago inválido: ${validacion.error}`);
    }
    
    console.log(`Token válido - Tipo: ${validacion.tipo}, Usuario: ${validacion.usuario}`);
    
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: titulo,
            quantity: 1,
            currency_id: "COP",
            unit_price: precio
          }
        ],
        payer: {
          email: estudianteEmail
        },
        back_urls: {
          success: `${process.env.FRONTEND_SUCCESS_URL}?clase=${claseId}`,
          failure: `${process.env.FRONTEND_FAILURE_URL}?clase=${claseId}`,
          pending: `${process.env.FRONTEND_URL}/pago-pendiente?clase=${claseId}`
        },
        auto_return: "approved",
        notification_url: `${process.env.WEBHOOK_URL}/webhook`,
        external_reference: claseId.toString(),
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        metadata: {
          clase_id: claseId.toString(),
          tipo: 'clase_particular'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de MercadoPago:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Error MercadoPago (${response.status}): ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error creando pago en MercadoPago:', error);
    throw error; // Re-lanzar el error original para mantener el mensaje específico
  }
};

export const verificarPago = async (paymentId) => {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error verificando pago: ${response.status}`);
    }

    const paymentData = await response.json();
    return paymentData;

  } catch (error) {
    console.error('Error verificando pago:', error);
    throw new Error('Error al verificar el pago');
  }
};

// Nueva función para crear retiro de dinero para profesores
export const crearRetiroProfesor = async ({ profesorId, monto, email }) => {
  try {
    // Calcular el monto después de la comisión (asumiendo 20% de comisión)
const comision = 0.20; // 20% de comisión
    const montoNeto = monto * (1 - comision);
    
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: `Retiro de ganancias - EasyClase`,
            quantity: 1,
            currency_id: "COP",
            unit_price: montoNeto
          }
        ],
        payer: {
          email: email
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/dashboard?retiro=exitoso`,
          failure: `${process.env.FRONTEND_URL}/dashboard?retiro=fallido`,
          pending: `${process.env.FRONTEND_URL}/dashboard?retiro=pendiente`
        },
        auto_return: "approved",
        external_reference: `retiro_${profesorId}_${Date.now()}`,
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 1
        },
        metadata: {
          profesor_id: profesorId.toString(),
          tipo: 'retiro_profesor',
          monto_original: monto,
          monto_neto: montoNeto,
          comision: comision
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error de MercadoPago: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      montoNeto,
      comision: monto * comision
    };

  } catch (error) {
    console.error('Error creando retiro en MercadoPago:', error);
    throw new Error('Error al procesar el retiro');
  }
};

// Función para obtener el balance disponible del profesor
export const obtenerBalanceProfesor = async (profesorId) => {
  try {
    // Aquí implementarías la lógica para calcular el balance real
    // Por ahora retornamos datos de ejemplo
    return {
      balanceDisponible: 150000, // Este valor vendría de la base de datos
      comision: 0.20,
      montoMinimoRetiro: 50000
    };
  } catch (error) {
    console.error('Error obteniendo balance:', error);
    throw new Error('Error al obtener el balance');
  }
};