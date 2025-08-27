import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Trash2, MessageCircle, Calendar, CreditCard, Clock, Star, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'

const NotificationBell = () => {
  const { user } = useAuth()
  const { 
    persistentNotifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    loadPersistentNotifications 
  } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return

    // Cargar notificaciones iniciales
    loadPersistentNotifications(user.id)

    // Escuchar eventos de actualización de notificaciones
    const handleNotificationsUpdate = (event) => {
      if (event.detail.userId === user.id) {
        loadPersistentNotifications(user.id)
      }
    }

    window.addEventListener('notificationsUpdated', handleNotificationsUpdate)

    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
    }
  }, [user?.id, loadPersistentNotifications])

  const handleMarkAsRead = (notificationId) => {
    if (!user?.id) return
    
    markAsRead(user.id, notificationId)
  }

  const handleMarkAllAsRead = () => {
    if (!user?.id) return
    
    markAllAsRead(user.id)
  }

  const handleDeleteNotification = (notificationId) => {
    if (!user?.id) return
    
    deleteNotification(user.id, notificationId)
  }

  const handleNotificationClick = (notification) => {
    // Marcar como leída automáticamente al hacer click
    handleMarkAsRead(notification.id)
    
    // Navegación específica según el tipo de notificación
    switch (notification.data?.action) {
      case 'payment_success':
      case 'payment_rejected':
      case 'class_confirmed':
      case 'class_scheduled':
        // Navegar al dashboard
        window.location.href = '/dashboard'
        break
      case 'new_message':
        // Aquí podrías abrir el chat
        // Navegar al chat o abrir modal de chat
        break
      case 'class_starting_soon':
        // Navegar a la clase específica
        if (notification.data.claseId) {
          window.location.href = `/clase/${notification.data.claseId}`
        } else {
          window.location.href = '/mis-clases'
        }
        break
      case 'payment_reminder':
        // Navegar a la página de pagos
        window.location.href = '/pago'
        break
      default:
        // Navegar al dashboard por defecto
        window.location.href = '/dashboard'
        break
    }
    
    setIsOpen(false)
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'message-circle':
        return <MessageCircle className="w-4 h-4" />
      case 'calendar':
        return <Calendar className="w-4 h-4" />
      case 'credit-card':
        return <CreditCard className="w-4 h-4" />
      case 'clock':
        return <Clock className="w-4 h-4" />
      case 'star':
        return <Star className="w-4 h-4" />
      case 'check-circle':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-700'
      case 'blue':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-700'
      case 'purple':
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-700'
      case 'orange':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-700'
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700'
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-700'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-700'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user?.id) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la campanita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        
        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-secondary-200 dark:border-gray-600 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                >
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {persistentNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium">No tienes notificaciones</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Te notificaremos cuando tengas novedades</p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100 dark:divide-gray-700">
                {persistentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-secondary-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-l-2 ${
                      !notification.read 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500' 
                        : 'border-l-transparent'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icono */}
                      <div className={`flex-shrink-0 p-2 rounded-full ${getColorClasses(notification.color)}`}>
                        {getIcon(notification.icon)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-secondary-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-secondary-500 dark:text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-secondary-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex-shrink-0 flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Marcar como leída"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {persistentNotifications.length > 0 && (
            <div className="p-3 border-t border-secondary-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-center space-x-2 text-xs text-secondary-500 dark:text-gray-400">
                <span>{unreadCount} sin leer</span>
                <span>•</span>
                <span>{persistentNotifications.length} total</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
