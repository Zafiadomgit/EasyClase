import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Trash2, MessageCircle, Calendar, CreditCard, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import notificationService from '../services/notificationService'

const NotificationBell = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return

    // Cargar notificaciones iniciales
    loadNotifications()

    // Escuchar eventos de actualización de notificaciones
    const handleNotificationsUpdate = (event) => {
      if (event.detail.userId === user.id) {
        setNotifications(event.detail.notifications)
        setUnreadCount(notificationService.getUnreadCount(user.id))
      }
    }

    window.addEventListener('notificationsUpdated', handleNotificationsUpdate)

    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
    }
  }, [user?.id])

  const loadNotifications = () => {
    if (!user?.id) return
    
    const userNotifications = notificationService.getNotifications(user.id)
    setNotifications(userNotifications)
    setUnreadCount(notificationService.getUnreadCount(user.id))
  }

  const handleMarkAsRead = (notificationId) => {
    if (!user?.id) return
    
    notificationService.markAsRead(user.id, notificationId)
  }

  const handleMarkAllAsRead = () => {
    if (!user?.id) return
    
    notificationService.markAllAsRead(user.id)
  }

  const handleDeleteNotification = (notificationId) => {
    if (!user?.id) return
    
    notificationService.deleteNotification(user.id, notificationId)
  }

  const handleNotificationClick = (notification) => {
    // Marcar como leída
    handleMarkAsRead(notification.id)
    
    // Aquí puedes agregar navegación específica según el tipo de notificación
    switch (notification.type) {
      case 'payment_success':
      case 'upcoming_class':
        // Navegar al dashboard
        window.location.href = '/dashboard'
        break
      case 'new_reservation':
        // Navegar a mis clases (para profesores)
        window.location.href = '/mis-clases'
        break
      case 'new_message':
        // Aquí podrías abrir el chat
        console.log('Abrir chat con:', notification.data.senderName)
        break
      default:
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
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'blue':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'purple':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'orange':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
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
    console.log('🔔 NotificationBell: No user ID, returning null')
    return null
  }

  console.log('🔔 NotificationBell: Rendering with user ID:', user.id, 'isOpen:', isOpen, 'unreadCount:', unreadCount)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la campanita */}
      <button
        onClick={() => {
          console.log('🔔 Bell button clicked! Current isOpen:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        
        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
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
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
                            className="p-1 text-gray-400 hover:text-green-600"
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
                          className="p-1 text-gray-400 hover:text-red-600"
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
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {unreadCount} no leída{unreadCount !== 1 ? 's' : ''} de {notifications.length} total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
