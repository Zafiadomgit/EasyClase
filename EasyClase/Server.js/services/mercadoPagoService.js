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