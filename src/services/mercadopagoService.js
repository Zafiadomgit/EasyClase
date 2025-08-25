// Servicio para integración con MercadoPago
// Versión funcional sin backend - Simula el proceso completo

class MercadoPagoService {
  constructor() {
    // Credenciales simuladas para desarrollo
    this.publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || 'TEST-12345678-1234-1234-1234-123456789012'
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
  }

  /**
   * Crea una preferencia de pago en MercadoPago (SIMULADO)
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta de MercadoPago
   */
  async createPaymentPreference(paymentData) {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simular respuesta exitosa de MercadoPago
      const preference = {
        id: `pref_${Date.now()}`,
        init_point: `${window.location.origin}/pago/success?payment_id=${Date.now()}&status=approved&external_reference=${paymentData.reservaId}`,
        sandbox_init_point: `${window.location.origin}/pago/success?payment_id=${Date.now()}&status=approved&external_reference=${paymentData.reservaId}`,
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

      console.log('Preferencia creada (simulada):', preference)
      return preference
    } catch (error) {
      console.error('Error en MercadoPago:', error)
      throw new Error('No se pudo procesar el pago. Intenta nuevamente.')
    }
  }

  /**
   * Procesa un pago con tarjeta de crédito/débito (SIMULADO)
   * @param {Object} cardData - Datos de la tarjeta
   * @param {Object} paymentData - Datos del pago
   * @returns {Promise<Object>} - Respuesta del pago
   */
  async processCardPayment(cardData, paymentData) {
    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simular validación de tarjeta
      const cardNumber = cardData.number.replace(/\s/g, '')
      
      // Tarjetas de prueba para simular diferentes resultados
      if (cardNumber.startsWith('4000')) {
        // Tarjeta que simula rechazo
        throw new Error('Tarjeta rechazada. Verifica los datos.')
      } else if (cardNumber.startsWith('5000')) {
        // Tarjeta que simula pago pendiente
        return {
          id: `pay_${Date.now()}`,
          status: 'pending',
          status_detail: 'pending_review',
          external_reference: paymentData.reservaId
        }
      } else {
        // Tarjeta que simula pago exitoso
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
      console.error('Error procesando pago con tarjeta:', error)
      throw error
    }
  }

  /**
   * Obtiene el estado de un pago (SIMULADO)
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async getPaymentStatus(paymentId) {
    try {
      // Simular delay de consulta
      await new Promise(resolve => setTimeout(resolve, 500))

      // Simular respuesta de estado
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
   * Inicializa MercadoPago SDK (SIMULADO)
   * @returns {Promise<Object>} - Instancia de MercadoPago
   */
  async initializeMercadoPago() {
    try {
      // Simular inicialización
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('MercadoPago inicializado (simulado)')
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
   * Crea un token de tarjeta para MercadoPago (SIMULADO)
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {Promise<string>} - Token de la tarjeta
   */
  async createCardToken(cardData) {
    try {
      // Simular delay de tokenización
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validar datos básicos
      const cardNumber = cardData.number.replace(/\s/g, '')
      const cvv = cardData.cvv
      const expiration = cardData.expiration

      if (!cardNumber || cardNumber.length < 13) {
        throw new Error('Número de tarjeta inválido')
      }

      if (!cvv || cvv.length < 3) {
        throw new Error('CVV inválido')
      }

      if (!expiration || !expiration.includes('/')) {
        throw new Error('Fecha de expiración inválida')
      }

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
}

// Instancia singleton del servicio
const mercadopagoService = new MercadoPagoService()

export default mercadopagoService
