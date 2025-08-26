import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import notificationEventService from '../services/notificationEventService'

export const useSystemNotifications = () => {
  const { user } = useAuth()
  const { showSystemNotification } = useNotifications()
  const welcomeShownRef = useRef(false)
  const classReminderRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return

    // Mostrar notificación de bienvenida solo una vez por sesión
    if (!welcomeShownRef.current) {
      setTimeout(() => {
        showSystemNotification('welcome', user.id)
        welcomeShownRef.current = true
      }, 2000) // 2 segundos después del login
    }

    // Escuchar eventos automáticos del sistema
    const handleSystemNotification = (event) => {
      const { type, userId, data } = event.detail
      
      // Solo procesar notificaciones para el usuario actual
      if (userId === user.id) {
        showSystemNotification(type, user.id, data)
      }
    }

    // Escuchar eventos del sistema
    window.addEventListener('systemNotification', handleSystemNotification)

    // Cleanup
    return () => {
      window.removeEventListener('systemNotification', handleSystemNotification)
    }
  }, [user?.id, showSystemNotification])



  // Función para mostrar notificaciones específicas del sistema
  const triggerSystemNotification = (type, data = {}) => {
    if (!user?.id) return
    showSystemNotification(type, user.id, data)
  }

  // Función para mostrar notificación de pago exitoso
  const showPaymentSuccess = (paymentData) => {
    triggerSystemNotification('payment_success', paymentData)
  }

  // Función para mostrar notificación de pago rechazado
  const showPaymentRejected = (paymentData) => {
    triggerSystemNotification('payment_rejected', paymentData)
  }

  // Función para mostrar notificación de clase agendada
  const showClassScheduled = (classData) => {
    triggerSystemNotification('class_scheduled', classData)
  }

  // Función para mostrar notificación de clase confirmada
  const showClassConfirmed = (classData) => {
    triggerSystemNotification('class_confirmed', classData)
  }

  // Función para mostrar notificación de nuevo mensaje
  const showNewMessage = (messageData) => {
    triggerSystemNotification('new_message', messageData)
  }

  // Función para mostrar recordatorio de pago
  const showPaymentReminder = (paymentData) => {
    triggerSystemNotification('payment_reminder', paymentData)
  }

  // Función para mostrar notificación de clase próxima
  const showClassStartingSoon = (classData) => {
    triggerSystemNotification('class_starting_soon', classData)
  }

  return {
    triggerSystemNotification,
    showPaymentSuccess,
    showPaymentRejected,
    showClassScheduled,
    showClassConfirmed,
    showNewMessage,
    showPaymentReminder,
    showClassStartingSoon
  }
}
