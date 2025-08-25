import apiClient from './api'

export const communicationService = {
  // Reportar una violación de comunicación
  reportViolation: async (violationData) => {
    try {
      const response = await apiClient.post('/communication/violations', {
        userId: violationData.userId,
        violationType: violationData.type,
        detectedContent: violationData.content,
        warningCount: violationData.warningCount,
        timestamp: new Date().toISOString(),
        context: violationData.context || 'chat'
      })
      return response.data
    } catch (error) {
      console.error('Error reportando violación:', error)
      throw error
    }
  },

  // Obtener historial de violaciones de un usuario
  getUserViolations: async (userId) => {
    try {
      const response = await apiClient.get(`/communication/violations/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo violaciones del usuario:', error)
      throw error
    }
  },

  // Enviar notificación de advertencia
  sendWarningNotification: async (userId, warningData) => {
    try {
      const response = await apiClient.post('/communication/warnings', {
        userId,
        warningType: warningData.type,
        message: warningData.message,
        warningCount: warningData.count,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error enviando notificación de advertencia:', error)
      throw error
    }
  },

  // Suspender cuenta temporalmente
  suspendAccount: async (userId, suspensionData) => {
    try {
      const response = await apiClient.post('/communication/suspend', {
        userId,
        reason: suspensionData.reason,
        duration: suspensionData.duration, // en días
        timestamp: new Date().toISOString(),
        violations: suspensionData.violations
      })
      return response.data
    } catch (error) {
      console.error('Error suspendiendo cuenta:', error)
      throw error
    }
  },

  // Banear cuenta permanentemente
  banAccount: async (userId, banData) => {
    try {
      const response = await apiClient.post('/communication/ban', {
        userId,
        reason: banData.reason,
        timestamp: new Date().toISOString(),
        violations: banData.violations,
        finalWarning: banData.finalWarning
      })
      return response.data
    } catch (error) {
      console.error('Error baneando cuenta:', error)
      throw error
    }
  },

  // Obtener estadísticas de violaciones
  getViolationStats: async () => {
    try {
      const response = await apiClient.get('/communication/stats')
      return response.data
    } catch (error) {
      console.error('Error obteniendo estadísticas de violaciones:', error)
      throw error
    }
  },

  // Verificar si un usuario está suspendido
  checkUserStatus: async (userId) => {
    try {
      const response = await apiClient.get(`/communication/status/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error verificando estado del usuario:', error)
      throw error
    }
  },

  // Enviar mensaje de chat (con validación)
  sendChatMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/communication/chat', {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        messageType: 'chat'
      })
      return response.data
    } catch (error) {
      console.error('Error enviando mensaje de chat:', error)
      throw error
    }
  },

  // Obtener historial de chat
  getChatHistory: async (userId1, userId2) => {
    try {
      const response = await apiClient.get(`/communication/chat/${userId1}/${userId2}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo historial de chat:', error)
      throw error
    }
  }
}

export default communicationService
