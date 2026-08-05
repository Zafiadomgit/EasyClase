// Servicio para manejar notificaciones persistentes
class NotificationService {
  constructor() {
    this.storageKey = 'easyclase_notifications'
  }

  /**
   * Obtiene todas las notificaciones del usuario
   * @param {string} userId - ID del usuario
   * @returns {Array} - Lista de notificaciones
   */
  getNotifications(userId) {
    try {
      const notifications = localStorage.getItem(`${this.storageKey}_${userId}`)
      if (notifications) {
        const parsed = JSON.parse(notifications)
        // Limitar a máximo 10 notificaciones para evitar spam
        return parsed.slice(0, 10)
      }
      return []
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      return []
    }
  }

  /**
   * Notificaciones guardadas en el servidor. Son las que cruzan de una cuenta a
   * otra (pago confirmado, clase reservada), imposibles de lograr solo con
   * localStorage porque cada navegador ve únicamente su propio almacenamiento.
   * @returns {Promise<Array>}
   */
  async getServerNotifications() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return []
      const response = await fetch('/api/notificaciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) return []
      const data = await response.json()
      const lista = data?.data?.notificaciones || data?.notificaciones || []
      return lista.map(n => ({ ...n, origen: 'servidor' }))
    } catch (error) {
      console.error('Error obteniendo notificaciones del servidor:', error)
      return []
    }
  }

  /**
   * Combina las del servidor con las locales (recordatorios de este navegador),
   * ordenadas de más reciente a más antigua.
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getAllNotifications(userId) {
    const [servidor, locales] = [await this.getServerNotifications(), this.getNotifications(userId)]
    return [...servidor, ...locales]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
  }

  /**
   * Agrega una nueva notificación
   * @param {string} userId - ID del usuario
   * @param {Object} notification - Datos de la notificación
   */
  addNotification(userId, notification) {
    try {
      const notifications = this.getNotifications(userId)
      const newNotification = {
        id: Date.now() + Math.random(),
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
      }
      
      notifications.unshift(newNotification) // Agregar al inicio
      
      // Mantener solo las últimas 20 notificaciones (más realista)
      const limitedNotifications = notifications.slice(0, 20)
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(limitedNotifications))
      
      // Disparar evento personalizado para actualizar la UI
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { userId, notifications: limitedNotifications } 
      }))
      
      return newNotification
    } catch (error) {
      console.error('Error agregando notificación:', error)
    }
  }

  /**
   * Marca una notificación como leída
   * @param {string} userId - ID del usuario
   * @param {string} notificationId - ID de la notificación
   */
  /**
   * Marca como leída en el servidor. Las notificaciones del servidor tienen id
   * entero; las locales usan Date.now() + Math.random(), que es decimal.
   * @param {number} notificationId
   */
  async markServerAsRead(notificationId) {
    try {
      const token = localStorage.getItem('token')
      if (!token || !Number.isInteger(notificationId)) return
      await fetch(`/api/notificaciones/${notificationId}/leer`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error marcando notificación en el servidor:', error)
    }
  }

  async markAllServerAsRead() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      await fetch('/api/notificaciones/leer-todas', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error marcando notificaciones en el servidor:', error)
    }
  }

  async clearServerNotifications() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      await fetch('/api/notificaciones', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error eliminando notificaciones del servidor:', error)
    }
  }

  markAsRead(userId, notificationId) {
    try {
      const notifications = this.getNotifications(userId)
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(updatedNotifications))
      
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { userId, notifications: updatedNotifications } 
      }))
    } catch (error) {
      console.error('Error marcando notificación como leída:', error)
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   * @param {string} userId - ID del usuario
   */
  markAllAsRead(userId) {
    try {
      const notifications = this.getNotifications(userId)
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }))
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(updatedNotifications))
      
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { userId, notifications: updatedNotifications } 
      }))
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error)
    }
  }

  /**
   * Elimina una notificación
   * @param {string} userId - ID del usuario
   * @param {string} notificationId - ID de la notificación
   */
  deleteNotification(userId, notificationId) {
    try {
      const notifications = this.getNotifications(userId)
      const updatedNotifications = notifications.filter(notification => 
        notification.id !== notificationId
      )
      
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(updatedNotifications))
      
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { userId, notifications: updatedNotifications } 
      }))
    } catch (error) {
      console.error('Error eliminando notificación:', error)
    }
  }

  /**
   * Limpia todas las notificaciones del usuario
   * @param {string} userId - ID del usuario
   */
  clearAllNotifications(userId) {
    try {
      localStorage.removeItem(`${this.storageKey}_${userId}`)
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { 
        detail: { userId, notifications: [] } 
      }))
      
      return []
    } catch (error) {
      console.error('Error limpiando notificaciones:', error)
    }
  }

  /**
   * Obtiene el número de notificaciones no leídas
   * @param {string} userId - ID del usuario
   * @returns {number} - Número de notificaciones no leídas
   */
  getUnreadCount(userId) {
    try {
      const notifications = this.getNotifications(userId)
      return notifications.filter(notification => !notification.read).length
    } catch (error) {
      console.error('Error obteniendo conteo de notificaciones:', error)
      return 0
    }
  }

  /**
   * Crea una notificación de pago exitoso
   * @param {string} userId - ID del usuario
   * @param {Object} claseData - Datos de la clase
   */
  createPaymentSuccessNotification(userId, claseData) {
    const fechaFormateada = new Date(claseData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    return this.addNotification(userId, {
      type: 'payment_success',
      title: '¡Pago Exitoso!',
      message: `Tu pago fue exitoso, tu próxima clase es ${fechaFormateada} a las ${claseData.hora}`,
      icon: 'credit-card',
      color: 'green',
      data: {
        claseId: claseData.id,
        tema: claseData.tema,
        fecha: claseData.fecha,
        hora: claseData.hora
      }
    })
  }

  /**
   * Crea una notificación de nueva reserva para profesor
   * @param {string} profesorId - ID del profesor
   * @param {Object} reservaData - Datos de la reserva
   */
  createNewReservationNotification(profesorId, reservaData) {
    const fechaFormateada = new Date(reservaData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    return this.addNotification(profesorId, {
      type: 'new_reservation',
      title: 'Nueva Reserva',
      message: `${reservaData.estudianteNombre} ha reservado una clase de ${reservaData.tema} para ${fechaFormateada} a las ${reservaData.hora}`,
      icon: 'calendar',
      color: 'blue',
      data: {
        reservaId: reservaData.id,
        estudianteId: reservaData.estudianteId,
        estudianteNombre: reservaData.estudianteNombre,
        tema: reservaData.tema,
        fecha: reservaData.fecha,
        hora: reservaData.hora
      }
    })
  }

  /**
   * Crea una notificación de nuevo mensaje
   * @param {string} userId - ID del usuario
   * @param {Object} messageData - Datos del mensaje
   */
  createNewMessageNotification(userId, messageData) {
    return this.addNotification(userId, {
      type: 'new_message',
      title: 'Nuevo Mensaje',
      message: `${messageData.senderName}: ${messageData.preview}`,
      icon: 'message-circle',
      color: 'purple',
      data: {
        messageId: messageData.id,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        chatId: messageData.chatId
      }
    })
  }

  /**
   * Crea una notificación de clase próxima
   * @param {string} userId - ID del usuario
   * @param {Object} claseData - Datos de la clase
   */
  createUpcomingClassNotification(userId, claseData) {
    return this.addNotification(userId, {
      type: 'upcoming_class',
      title: 'Clase Próxima',
      message: `Tu clase de ${claseData.tema} comienza en 10 minutos`,
      icon: 'clock',
      color: 'orange',
      data: {
        claseId: claseData.id,
        tema: claseData.tema,
        fecha: claseData.fecha,
        hora: claseData.hora
      }
    })
  }
}

export default new NotificationService()
