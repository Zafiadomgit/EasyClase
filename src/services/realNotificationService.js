// Servicio para manejar notificaciones reales del sistema
import notificationService from './notificationService'

class RealNotificationService {
  constructor() {
    this.eventListeners = new Map()
  }

  /**
   * Notifica cuando se crea una nueva clase
   * @param {string} profesorId - ID del profesor
   * @param {Object} claseData - Datos de la clase
   */
  notifyClassCreated(profesorId, claseData) {
    const fechaFormateada = new Date(claseData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return notificationService.addNotification(profesorId, {
      type: 'class_created',
      title: 'Nueva Clase Creada',
      message: `Has creado una nueva clase de "${claseData.tema}" para ${fechaFormateada} a las ${claseData.hora}`,
      icon: 'calendar-plus',
      color: 'green',
      data: {
        claseId: claseData.id,
        tema: claseData.tema,
        fecha: claseData.fecha,
        hora: claseData.hora,
        precio: claseData.precio
      }
    })
  }

  /**
   * Notifica cuando un estudiante reserva una clase exitosamente
   * @param {string} profesorId - ID del profesor
   * @param {Object} reservaData - Datos de la reserva
   */
  notifyClassReserved(profesorId, reservaData) {
    const fechaFormateada = new Date(reservaData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return notificationService.addNotification(profesorId, {
      type: 'class_reserved',
      title: 'Nueva Reserva',
      message: `${reservaData.estudianteNombre} ha reservado tu clase de "${reservaData.tema}" para ${fechaFormateada} a las ${reservaData.hora}`,
      icon: 'calendar-check',
      color: 'blue',
      data: {
        reservaId: reservaData.id,
        estudianteId: reservaData.estudianteId,
        estudianteNombre: reservaData.estudianteNombre,
        tema: reservaData.tema,
        fecha: reservaData.fecha,
        hora: reservaData.hora,
        precio: reservaData.precio
      }
    })
  }

  /**
   * Notifica cuando se confirma el pago de una clase
   * @param {string} estudianteId - ID del estudiante
   * @param {Object} pagoData - Datos del pago
   */
  notifyPaymentConfirmed(estudianteId, pagoData) {
    const fechaFormateada = new Date(pagoData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return notificationService.addNotification(estudianteId, {
      type: 'payment_confirmed',
      title: '¡Pago Confirmado!',
      message: `Tu pago de $${pagoData.monto.toLocaleString()} ha sido confirmado. Tu clase de "${pagoData.tema}" está programada para ${fechaFormateada} a las ${pagoData.hora}`,
      icon: 'credit-card',
      color: 'green',
      data: {
        pagoId: pagoData.id,
        claseId: pagoData.claseId,
        tema: pagoData.tema,
        fecha: pagoData.fecha,
        hora: pagoData.hora,
        monto: pagoData.monto
      }
    })
  }

  /**
   * Notifica cuando falta poco tiempo para una clase
   * @param {string} userId - ID del usuario (profesor o estudiante)
   * @param {Object} claseData - Datos de la clase
   * @param {number} minutesLeft - Minutos restantes
   */
  notifyClassStartingSoon(userId, claseData, minutesLeft = 10) {
    return notificationService.addNotification(userId, {
      type: 'class_starting_soon',
      title: '¡Tu clase comienza pronto!',
      message: `Tu clase de "${claseData.tema}" comienza en ${minutesLeft} minutos. ¡Prepárate!`,
      icon: 'clock',
      color: 'orange',
      data: {
        claseId: claseData.id,
        tema: claseData.tema,
        fecha: claseData.fecha,
        hora: claseData.hora,
        minutesLeft
      }
    })
  }

  /**
   * Notifica cuando se cancela una clase
   * @param {string} userId - ID del usuario afectado
   * @param {Object} claseData - Datos de la clase cancelada
   * @param {string} reason - Razón de la cancelación
   */
  notifyClassCancelled(userId, claseData, reason = '') {
    const fechaFormateada = new Date(claseData.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return notificationService.addNotification(userId, {
      type: 'class_cancelled',
      title: 'Clase Cancelada',
      message: `Tu clase de "${claseData.tema}" programada para ${fechaFormateada} a las ${claseData.hora} ha sido cancelada${reason ? `: ${reason}` : ''}`,
      icon: 'x-circle',
      color: 'red',
      data: {
        claseId: claseData.id,
        tema: claseData.tema,
        fecha: claseData.fecha,
        hora: claseData.hora,
        reason
      }
    })
  }

  /**
   * Notifica cuando se completa una clase
   * @param {string} userId - ID del usuario
   * @param {Object} claseData - Datos de la clase completada
   */
  notifyClassCompleted(userId, claseData) {
    return notificationService.addNotification(userId, {
      type: 'class_completed',
      title: 'Clase Completada',
      message: `¡Excelente! Has completado tu clase de "${claseData.tema}". ¡Sigue así!`,
      icon: 'check-circle',
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
   * Notifica cuando se recibe un nuevo mensaje
   * @param {string} userId - ID del usuario destinatario
   * @param {Object} messageData - Datos del mensaje
   */
  notifyNewMessage(userId, messageData) {
    return notificationService.addNotification(userId, {
      type: 'new_message',
      title: 'Nuevo Mensaje',
      message: `${messageData.senderName}: ${messageData.preview}`,
      icon: 'message-circle',
      color: 'purple',
      data: {
        messageId: messageData.id,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        chatId: messageData.chatId,
        preview: messageData.preview
      }
    })
  }

  /**
   * Notifica cuando se actualiza el perfil
   * @param {string} userId - ID del usuario
   * @param {Object} profileData - Datos del perfil actualizado
   */
  notifyProfileUpdated(userId, profileData) {
    return notificationService.addNotification(userId, {
      type: 'profile_updated',
      title: 'Perfil Actualizado',
      message: `Tu perfil ha sido actualizado exitosamente. Los cambios ya están visibles para otros usuarios.`,
      icon: 'user-check',
      color: 'blue',
      data: {
        profileId: profileData.id,
        changes: profileData.changes
      }
    })
  }

  /**
   * Notifica cuando se recibe una nueva calificación
   * @param {string} profesorId - ID del profesor
   * @param {Object} ratingData - Datos de la calificación
   */
  notifyNewRating(profesorId, ratingData) {
    return notificationService.addNotification(profesorId, {
      type: 'new_rating',
      title: 'Nueva Calificación',
      message: `${ratingData.estudianteNombre} te ha calificado con ${ratingData.rating} estrellas${ratingData.comment ? `: "${ratingData.comment}"` : ''}`,
      icon: 'star',
      color: 'yellow',
      data: {
        ratingId: ratingData.id,
        claseId: ratingData.claseId,
        estudianteId: ratingData.estudianteId,
        estudianteNombre: ratingData.estudianteNombre,
        rating: ratingData.rating,
        comment: ratingData.comment
      }
    })
  }

  /**
   * Notifica cuando se alcanza un hito (ej: 10 clases completadas)
   * @param {string} userId - ID del usuario
   * @param {Object} milestoneData - Datos del hito
   */
  notifyMilestone(userId, milestoneData) {
    return notificationService.addNotification(userId, {
      type: 'milestone',
      title: '¡Felicidades!',
      message: `Has alcanzado un nuevo hito: ${milestoneData.description}`,
      icon: 'trophy',
      color: 'gold',
      data: {
        milestoneId: milestoneData.id,
        type: milestoneData.type,
        description: milestoneData.description,
        value: milestoneData.value
      }
    })
  }

  /**
   * Simula eventos del sistema para testing
   */
  simulateEvents() {
    // Solo para desarrollo/testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Simulando eventos de notificaciones...')
      
      // Simular nueva reserva
      setTimeout(() => {
        this.notifyClassReserved('prof-123', {
          id: 'reserva-001',
          estudianteId: 'est-456',
          estudianteNombre: 'María García',
          tema: 'Matemáticas Avanzadas',
          fecha: '2024-12-20',
          hora: '15:00',
          precio: 50000
        })
      }, 3000)

      // Simular pago confirmado
      setTimeout(() => {
        this.notifyPaymentConfirmed('est-456', {
          id: 'pago-001',
          claseId: 'clase-001',
          tema: 'Matemáticas Avanzadas',
          fecha: '2024-12-20',
          hora: '15:00',
          monto: 50000
        })
      }, 5000)

      // Simular clase próxima
      setTimeout(() => {
        this.notifyClassStartingSoon('est-456', {
          id: 'clase-001',
          tema: 'Matemáticas Avanzadas',
          fecha: '2024-12-20',
          hora: '15:00'
        }, 10)
      }, 7000)
    }
  }
}

export default new RealNotificationService()
