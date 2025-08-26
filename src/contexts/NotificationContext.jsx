import React, { createContext, useContext, useState, useEffect } from 'react'
import { CheckCircle, X, Bell } from 'lucide-react'
import notificationService from '../services/notificationService'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [persistentNotifications, setPersistentNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Función para cargar notificaciones persistentes del usuario actual
  const loadPersistentNotifications = (userId) => {
    if (!userId) return
    
    const userNotifications = notificationService.getNotifications(userId)
    setPersistentNotifications(userNotifications)
    setUnreadCount(notificationService.getUnreadCount(userId))
  }

  // Función para agregar notificación persistente
  const addPersistentNotification = (userId, notification) => {
    if (!userId) return
    
    const newNotification = notificationService.addNotification(userId, notification)
    if (newNotification) {
      setPersistentNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    }
  }

  // Función para marcar como leída
  const markAsRead = (userId, notificationId) => {
    if (!userId) return
    
    notificationService.markAsRead(userId, notificationId)
    setPersistentNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Función para marcar todas como leídas
  const markAllAsRead = (userId) => {
    if (!userId) return
    
    notificationService.markAllAsRead(userId)
    setPersistentNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }

  // Función para eliminar notificación
  const deleteNotification = (userId, notificationId) => {
    if (!userId) return
    
    notificationService.deleteNotification(userId, notificationId)
    setPersistentNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
    // Recalcular conteo no leído
    const updatedNotifications = notificationService.getNotifications(userId)
    setUnreadCount(updatedNotifications.filter(n => !n.read).length)
  }

  // Función para mostrar notificaciones temporales (toast)
  const addNotification = (notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: notification.type || 'success',
      title: notification.title || 'Notificación',
      message: notification.message,
      duration: notification.duration || 5000,
      timestamp: new Date()
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)

    return id
  }

  // Función para mostrar notificaciones del sistema automáticamente
  const showSystemNotification = (type, userId = null, customData = {}) => {
    const systemNotifications = {
      welcome: {
        type: 'info',
        title: '¡Bienvenido a Easy Clase!',
        message: 'Tu plataforma de aprendizaje personalizado está lista para ti',
        icon: 'star',
        color: 'blue',
        data: { action: 'welcome', ...customData }
      },
      class_reminder: {
        type: 'reminder',
        title: 'Recordatorio de Clase',
        message: 'Tu clase comienza en 30 minutos. ¡Prepárate!',
        icon: 'clock',
        color: 'orange',
        data: { action: 'class_reminder', ...customData }
      },
      payment_reminder: {
        type: 'payment',
        title: 'Recordatorio de Pago',
        message: 'Tu próxima clase requiere confirmación de pago',
        icon: 'credit-card',
        color: 'yellow',
        data: { action: 'payment_reminder', ...customData }
      },
      new_message: {
        type: 'message',
        title: 'Nuevo Mensaje',
        message: customData.senderName 
          ? `Nuevo mensaje de ${customData.senderName}`
          : 'Tienes un nuevo mensaje en tu chat',
        icon: 'message-circle',
        color: 'purple',
        data: { action: 'new_message', ...customData }
      },
      class_confirmed: {
        type: 'success',
        title: 'Clase Confirmada',
        message: customData.tema 
          ? `Tu clase de "${customData.tema}" ha sido confirmada`
          : 'Tu clase ha sido confirmada exitosamente',
        icon: 'check-circle',
        color: 'green',
        data: { action: 'class_confirmed', ...customData }
      },
      payment_success: {
        type: 'success',
        title: '¡Pago Exitoso!',
        message: customData.amount 
          ? `Tu pago de $${customData.amount} ha sido procesado correctamente`
          : 'Tu pago ha sido procesado correctamente',
        icon: 'credit-card',
        color: 'green',
        data: { action: 'payment_success', ...customData }
      },
      payment_rejected: {
        type: 'error',
        title: 'Pago Rechazado',
        message: customData.reason 
          ? `Tu pago fue rechazado: ${customData.reason}`
          : 'Tu pago fue rechazado. Por favor, intenta nuevamente',
        icon: 'credit-card',
        color: 'red',
        data: { action: 'payment_rejected', ...customData }
      },
      class_scheduled: {
        type: 'success',
        title: 'Clase Agendada',
        message: customData.tema 
          ? `Tu clase de "${customData.tema}" ha sido agendada para ${customData.fecha} a las ${customData.hora}`
          : 'Tu clase ha sido agendada exitosamente',
        icon: 'calendar',
        color: 'blue',
        data: { action: 'class_scheduled', ...customData }
      },
      class_starting_soon: {
        type: 'reminder',
        title: '¡Tu clase comienza pronto!',
        message: customData.tema 
          ? `Tu clase de "${customData.tema}" comienza en 10 minutos`
          : 'Tu clase comienza en 10 minutos. ¡Prepárate!',
        icon: 'clock',
        color: 'orange',
        data: { action: 'class_starting_soon', ...customData }
      }
    }

    const notification = systemNotifications[type]
    if (notification && userId) {
      addPersistentNotification(userId, notification)
    } else if (notification) {
      // Si no hay userId, mostrar como notificación temporal
      addNotification(notification)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const showPaymentSuccess = (fecha, hora) => {
    const message = `Tu pago fue exitoso, tu próxima clase es ${fecha} a las ${hora}`
    return addNotification({
      type: 'success',
      title: '¡Pago Exitoso!',
      message: message,
      duration: 8000
    })
  }

  const showClassAdded = (tema, fecha, hora) => {
    const message = `Clase "${tema}" agregada para ${fecha} a las ${hora}`
    return addNotification({
      type: 'success',
      title: 'Clase Agregada',
      message: message,
      duration: 6000
    })
  }

  const value = {
    // Notificaciones temporales (pop-up)
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showPaymentSuccess,
    showClassAdded,
    showSystemNotification,
    
    // Notificaciones persistentes (campanita)
    persistentNotifications,
    unreadCount,
    addPersistentNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadPersistentNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white border-l-4 shadow-lg rounded-lg p-4 transform transition-all duration-300 ease-in-out ${
            notification.type === 'success' 
              ? 'border-green-500' 
              : notification.type === 'error'
              ? 'border-red-500'
              : notification.type === 'warning'
              ? 'border-yellow-500'
              : 'border-blue-500'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {notification.type === 'error' && (
                <X className="h-5 w-5 text-red-500" />
              )}
              {notification.type === 'warning' && (
                <Bell className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationProvider
