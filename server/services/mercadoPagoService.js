import fetch from 'node-fetch';

export const crearPagoMercadoPago = async ({ titulo, precio, claseId, estudianteEmail }) => {
  try {
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
      throw new Error(`Error de MercadoPago: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error creando pago en MercadoPago:', error);
    throw new Error('Error al procesar el pago');
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
    // Calcular el monto después de la comisión (asumiendo 10% de comisión)
    const comision = 0.10; // 10% de comisión
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
      comision: 0.10,
      montoMinimoRetiro: 50000
    };
  } catch (error) {
    console.error('Error obteniendo balance:', error);
    throw new Error('Error al obtener el balance');
  }
};