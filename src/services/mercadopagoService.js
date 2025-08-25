// Servicio para integración con MercadoPago
// En producción, esto se conectaría con el backend que maneja las credenciales de MercadoPago

class MercadoPagoService {
  constructor() {
    // En producción, estas credenciales vendrían del backend
    this.publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || 'TEST-12345678-1234-1234-1234-123456789012'
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
  }

  /**
   * Crea una preferencia de pago en MercadoPago
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta de MercadoPago
   */
  async createPaymentPreference(paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/mercadopago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            title: `Clase con ${paymentData.profesor.nombre}`,
            unit_price: paymentData.amount,
            quantity: 1,
            currency_id: 'COP'
          }],
          payer: {
            name: paymentData.payerName,
            email: paymentData.payerEmail
          },
          external_reference: paymentData.reservaId,
          notification_url: `${this.baseURL}/mercadopago/webhook`,
          back_urls: {
            success: `${window.location.origin}/pago/success`,
            failure: `${window.location.origin}/pago/failure`,
            pending: `${window.location.origin}/pago/pending`
          },
          auto_return: 'approved'
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en MercadoPago:', error)
      throw new Error('No se pudo procesar el pago. Intenta nuevamente.')
    }
  }

  /**
   * Procesa un pago con tarjeta de crédito/débito
   * @param {Object} cardData - Datos de la tarjeta
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta del pago
   */
  async processCardPayment(cardData, paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/mercadopago/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: paymentData.amount,
          token: cardData.token,
          description: `Clase con ${paymentData.profesor.nombre}`,
          installments: cardData.installments || 1,
          payment_method_id: cardData.paymentMethodId,
          payer: {
            email: paymentData.payerEmail
          },
          external_reference: paymentData.reservaId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al procesar el pago')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error procesando pago con tarjeta:', error)
      throw new Error('No se pudo procesar el pago con tarjeta. Verifica los datos e intenta nuevamente.')
    }
  }

  /**
   * Obtiene el estado de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/mercadopago/payment-status/${paymentId}`)
      
      if (!response.ok) {
        throw new Error('Error al obtener el estado del pago')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo estado del pago:', error)
      throw new Error('No se pudo verificar el estado del pago')
    }
  }

  /**
   * Inicializa MercadoPago SDK
   * @returns {Promise<Object>} - Instancia de MercadoPago
   */
  async initializeMercadoPago() {
    try {
      // En producción, esto cargaría el SDK de MercadoPago
      // Por ahora, simulamos la inicialización
      return {
        publicKey: this.publicKey,
        initialized: true
      }
    } catch (error) {
      console.error('Error inicializando MercadoPago:', error)
      throw new Error('No se pudo inicializar el sistema de pagos')
    }
  }

  /**
   * Crea un token de tarjeta para MercadoPago
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Promise<string>} - Token de la tarjeta
   */
  async createCardToken(cardData) {
    try {
      // En producción, esto usaría el SDK de MercadoPago
      // Por ahora, simulamos la creación del token
      const response = await fetch(`${this.baseURL}/mercadopago/create-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_number: cardData.number.replace(/\s/g, ''),
          security_code: cardData.cvv,
          expiration_month: cardData.expiration.split('/')[0],
          expiration_year: '20' + cardData.expiration.split('/')[1],
          cardholder: {
            name: cardData.name
          }
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear el token de la tarjeta')
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error creando token de tarjeta:', error)
      throw new Error('No se pudo procesar la tarjeta. Verifica los datos.')
    }
  }
}

// Instancia singleton del servicio
const mercadopagoService = new MercadoPagoService()

export default mercadopagoService
