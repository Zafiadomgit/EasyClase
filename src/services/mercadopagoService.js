// Servicio real para integración con MercadoPago
import mercadopago from 'mercadopago'

class MercadoPagoService {
  constructor() {
    // Configurar MercadoPago con credenciales reales
    this.publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || 'TEST-12345678-1234-1234-1234-123456789012'
    this.accessToken = process.env.REACT_APP_MERCADOPAGO_ACCESS_TOKEN || 'TEST-12345678-1234-1234-1234-123456789012'
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
    
    // Configurar MercadoPago SDK
    mercadopago.configure({
      access_token: this.accessToken
    })
  }

  /**
   * Crea una preferencia de pago real en MercadoPago
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta de MercadoPago
   */
  async createPaymentPreference(paymentData) {
    try {
      const preference = {
        items: [{
          id: paymentData.reservaId,
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
        auto_return: 'approved',
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      }

      const response = await mercadopago.preferences.create(preference)
      console.log('Preferencia creada (real):', response)
      return response
    } catch (error) {
      console.error('Error en MercadoPago:', error)
      throw new Error('No se pudo procesar el pago. Intenta nuevamente.')
    }
  }

  /**
   * Procesa un pago con tarjeta de crédito/débito real
   * @param {Object} cardData - Datos de la tarjeta
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta del pago
   */
  async processCardPayment(cardData, paymentData) {
    try {
      // Crear token de tarjeta
      const cardToken = await this.createCardToken(cardData)
      
      // Procesar pago
      const payment = {
        transaction_amount: paymentData.amount,
        token: cardToken,
        description: `Clase con ${paymentData.profesor.nombre}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.paymentMethodId || 'visa',
        payer: {
          email: paymentData.payerEmail
        },
        external_reference: paymentData.reservaId
      }

      const response = await mercadopago.payment.save(payment)
      console.log('Pago procesado (real):', response)
      return response
    } catch (error) {
      console.error('Error procesando pago con tarjeta:', error)
      throw new Error(error.message || 'Error al procesar el pago con tarjeta')
    }
  }

  /**
   * Obtiene el estado real de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await mercadopago.payment.get(paymentId)
      console.log('Estado del pago (real):', response)
      return response
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
      console.log('MercadoPago inicializado (real)')
      return {
        publicKey: this.publicKey,
        initialized: true,
        environment: this.accessToken.startsWith('TEST') ? 'sandbox' : 'production'
      }
    } catch (error) {
      console.error('Error inicializando MercadoPago:', error)
      throw new Error('No se pudo inicializar el sistema de pagos')
    }
  }

  /**
   * Crea un token real de tarjeta para MercadoPago
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Promise<string>} - Token de la tarjeta
   */
  async createCardToken(cardData) {
    try {
      const cardToken = {
        card_number: cardData.number.replace(/\s/g, ''),
        security_code: cardData.cvv,
        expiration_month: cardData.expiration.split('/')[0],
        expiration_year: '20' + cardData.expiration.split('/')[1],
        cardholder: {
          name: cardData.name
        }
      }

      const response = await mercadopago.card_token.create(cardToken)
      console.log('Token creado (real):', response)
      return response.id
    } catch (error) {
      console.error('Error creando token de tarjeta:', error)
      throw new Error(error.message || 'Error al procesar la tarjeta')
    }
  }

  /**
   * Valida datos de tarjeta (REAL)
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Object} - Resultado de validación
   */
  validateCardData(cardData) {
    const errors = []
    
    // Validar número de tarjeta
    const cardNumber = cardData.number.replace(/\s/g, '')
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errors.push('Número de tarjeta inválido')
    }

    // Validar CVV
    const cvv = cardData.cvv
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      errors.push('CVV inválido')
    }

    // Validar fecha de expiración
    const expiration = cardData.expiration
    if (!expiration || !expiration.includes('/')) {
      errors.push('Fecha de expiración inválida')
    } else {
      const [month, year] = expiration.split('/')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.push('Mes de expiración inválido')
      }

      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.push('Tarjeta expirada')
      }
    }

    // Validar nombre del titular
    if (!cardData.name || cardData.name.trim().length < 2) {
      errors.push('Nombre del titular requerido')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Obtiene métodos de pago disponibles
   * @returns {Promise<Array>} - Lista de métodos de pago
   */
  async getPaymentMethods() {
    try {
      const response = await mercadopago.payment_methods.list()
      return response
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error)
      return []
    }
  }

  /**
   * Identifica el tipo de tarjeta basado en el número
   * @param {string} cardNumber - Número de tarjeta
   * @returns {string} - Tipo de tarjeta
   */
  identifyCardType(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    
    if (cleanNumber.startsWith('4')) return 'visa'
    if (cleanNumber.startsWith('5')) return 'mastercard'
    if (cleanNumber.startsWith('3')) return 'amex'
    if (cleanNumber.startsWith('6')) return 'discover'
    
    return 'visa' // Por defecto
  }
}

// Instancia singleton del servicio
const mercadopagoService = new MercadoPagoService()

export default mercadopagoService
