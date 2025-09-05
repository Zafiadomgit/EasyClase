import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X, Check, Trash2, MessageCircle, Calendar, CreditCard, Clock, Star, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'

const NotificationBell = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
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

  const handleClearAll = () => {
    if (!user?.id) return
    
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
      // Importar el servicio de notificaciones
      import('../services/notificationService').then(({ default: notificationService }) => {
        notificationService.clearAllNotifications(user.id)
        loadPersistentNotifications(user.id)
      })
    }
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
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Notificaciones
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Action buttons */}
            {(unreadCount > 0 || persistentNotifications.length > 0) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Marcar todas
                    </button>
                  )}
                  {persistentNotifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Limpiar todas
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {persistentNotifications.length} notificación{persistentNotifications.length !== 1 ? 'es' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto">
            {persistentNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No tienes notificaciones
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Te notificaremos cuando tengas novedades
                </p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-100 dark:divide-gray-700">
                {persistentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border-l-3 ${
                      !notification.read 
                        ? 'bg-blue-50/30 dark:bg-blue-900/5 border-l-blue-500' 
                        : 'border-l-transparent hover:border-l-gray-200 dark:hover:border-l-gray-600'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-2.5">
                      {/* Icono */}
                      <div className={`flex-shrink-0 p-1.5 rounded-lg ${getColorClasses(notification.color)}`}>
                        {getIcon(notification.icon)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 leading-tight">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1.5 ml-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {notification.message}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-all duration-200"
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
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                          title="Eliminar notificación"
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
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></div>
                    {unreadCount} sin leer
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span>{persistentNotifications.length} total</span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                >
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
