// Servicio temporal para integración con MercadoPago
// Versión sin SDK para evitar errores de inicialización

class MercadoPagoService {
  constructor() {
    // Configurar MercadoPago con credenciales reales
    this.publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || 'TEST-0aa911c4-cb56-4148-b441-bec40d8f0405'
    this.accessToken = process.env.REACT_APP_MERCADOPAGO_ACCESS_TOKEN || 'TEST-5890608562147325-082512-ab2c8c1761c7ffcca8d35bf967f57d58-345306681'
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
    
    console.log('MercadoPago Service inicializado (modo simulación)')
  }

  /**
   * Crea una preferencia de pago simulada
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta simulada
   */
  async createPaymentPreference(paymentData) {
    try {
      console.log('Creando preferencia de pago simulada:', paymentData)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Para simular mejor MercadoPago, vamos a crear una página intermedia
      // que simule el proceso de pago real
      return {
        id: `pref_${Date.now()}`,
        init_point: `${window.location.origin}/pago/mercadopago-simulado?payment_id=${Date.now()}&status=pending&external_reference=${paymentData.reservaId}`,
        sandbox_init_point: `${window.location.origin}/pago/mercadopago-simulado?payment_id=${Date.now()}&status=pending&external_reference=${paymentData.reservaId}`,
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
        auto_return: 'approved'
      }
    } catch (error) {
      console.error('Error creando preferencia:', error)
      throw new Error('No se pudo crear la preferencia de pago')
    }
  }

  /**
   * Procesa un pago con tarjeta simulado
   * @param {Object} cardData - Datos de la tarjeta
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta simulada
   */
  async processCardPayment(cardData, paymentData) {
    try {
      console.log('Procesando pago con tarjeta simulado:', { cardData, paymentData })
      
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular diferentes resultados basados en el número de tarjeta
      const cardNumber = cardData.number ? cardData.number.replace(/\s/g, '') : ''
      
      if (cardNumber.startsWith('4000')) {
        throw new Error('Tarjeta rechazada. Verifica los datos.')
      } else if (cardNumber.startsWith('5000')) {
        return {
          id: `pay_${Date.now()}`,
          status: 'pending',
          status_detail: 'pending_review',
          external_reference: paymentData.reservaId
        }
      } else {
        return {
          id: `pay_${Date.now()}`,
          status: 'approved',
          status_detail: 'accredited',
          external_reference: paymentData.reservaId,
          transaction_amount: paymentData.amount,
          payment_method: {
            type: 'credit_card',
            id: 'visa'
          }
        }
      }
    } catch (error) {
      console.error('Error procesando pago:', error)
      throw error
    }
  }

  /**
   * Obtiene estado simulado del pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado simulado
   */
  async getPaymentStatus(paymentId) {
    try {
      console.log('Obteniendo estado del pago:', paymentId)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 35000,
        payment_method: {
          type: 'credit_card',
          id: 'visa'
        }
      }
    } catch (error) {
      console.error('Error obteniendo estado del pago:', error)
      throw new Error('No se pudo verificar el estado del pago')
    }
  }

  /**
   * Inicializa MercadoPago (simulado)
   * @returns {Promise<Object>} - Instancia simulada
   */
  async initializeMercadoPago() {
    try {
      console.log('MercadoPago inicializado (modo simulación)')
      return {
        publicKey: this.publicKey,
        initialized: true,
        environment: 'sandbox'
      }
    } catch (error) {
      console.error('Error inicializando MercadoPago:', error)
      throw new Error('No se pudo inicializar el sistema de pagos')
    }
  }

  /**
   * Crea token simulado de tarjeta
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Promise<string>} - Token simulado
   */
  async createCardToken(cardData) {
    try {
      console.log('Creando token de tarjeta simulado:', cardData)
      
      // Validar datos básicos
      const cardNumber = cardData.number ? cardData.number.replace(/\s/g, '') : ''
      const cvv = cardData.cvv || ''
      const expiration = cardData.expiration || ''

      if (!cardNumber || cardNumber.length < 13) {
        throw new Error('Número de tarjeta inválido')
      }

      if (!cvv || cvv.length < 3) {
        throw new Error('CVV inválido')
      }

      if (!expiration || !expiration.includes('/')) {
        throw new Error('Fecha de expiración inválida')
      }

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simular token exitoso
      const token = `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Token creado (simulado):', token)
      return token
    } catch (error) {
      console.error('Error creando token de tarjeta:', error)
      throw error
    }
  }

  /**
   * Valida datos de tarjeta
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Object} - Resultado de validación
   */
  validateCardData(cardData) {
    const errors = []
    
    // Validar que cardData existe y tiene las propiedades necesarias
    if (!cardData) {
      errors.push('Datos de tarjeta requeridos')
      return { isValid: false, errors }
    }
    
    // Validar número de tarjeta
    const cardNumber = cardData.number ? cardData.number.replace(/\s/g, '') : ''
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errors.push('Número de tarjeta inválido')
    }

    // Validar CVV
    const cvv = cardData.cvv || ''
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      errors.push('CVV inválido')
    }

    // Validar fecha de expiración
    const expiration = cardData.expiration || ''
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
   * Obtiene métodos de pago disponibles (simulado)
   * @returns {Promise<Array>} - Lista vacía
   */
  async getPaymentMethods() {
    return []
  }

  /**
   * Identifica el tipo de tarjeta basado en el número
   * @param {string} cardNumber - Número de tarjeta
   * @returns {string} - Tipo de tarjeta
   */
  identifyCardType(cardNumber) {
    if (!cardNumber) return 'visa'
    
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
