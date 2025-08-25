import React, { createContext, useContext, useState, useEffect } from 'react'
import { CheckCircle, X, Bell } from 'lucide-react'

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
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showPaymentSuccess,
    showClassAdded
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
