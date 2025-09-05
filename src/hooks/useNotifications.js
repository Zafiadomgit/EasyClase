import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, isAuthenticated } = useAuth()

  // Simular notificaciones en tiempo real
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    // Notificaciones base según el tipo de usuario
    const getBaseNotifications = () => {
      const now = new Date()
      const notifications = []

      if (user.tipoUsuario === 'estudiante') {
        notifications.push(
          {
            id: 1,
            type: 'payment',
            title: 'Pago confirmado',
            message: 'Tu pago para la clase de Programación con Carlos ha sido confirmado',
            time: '5 min',
            timestamp: new Date(now - 5 * 60 * 1000),
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'class',
            title: 'Clase próxima',
            message: 'Clase de JavaScript en 30 minutos con Carlos Mendez',
            time: '15 min',
            timestamp: new Date(now - 15 * 60 * 1000),
            read: false,
            priority: 'urgent'
          },
          {
            id: 3,
            type: 'reminder',
            title: 'Recordatorio',
            message: 'No olvides preparar las preguntas para tu clase de mañana',
            time: '1 hora',
            timestamp: new Date(now - 60 * 60 * 1000),
            read: true,
            priority: 'medium'
          }
        )
      } else if (user.tipoUsuario === 'profesor') {
        notifications.push(
          {
            id: 1,
            type: 'booking',
            title: 'Nueva reserva',
            message: 'Ana García ha reservado una clase de React para mañana a las 2:00 PM',
            time: '10 min',
            timestamp: new Date(now - 10 * 60 * 1000),
            read: false,
            priority: 'high'
          },
          {
            id: 2,
            type: 'payment',
            title: 'Pago recibido',
            message: 'Has recibido $50,000 por la clase completada con Ana García',
            time: '2 horas',
            timestamp: new Date(now - 2 * 60 * 60 * 1000),
            read: false,
            priority: 'medium'
          },
          {
            id: 3,
            type: 'class',
            title: 'Clase próxima',
            message: 'Clase con Juan Pérez en 45 minutos - Matemáticas Básicas',
            time: '30 min',
            timestamp: new Date(now - 30 * 60 * 1000),
            read: true,
            priority: 'urgent'
          }
        )
      } else if (user.tipoUsuario === 'admin') {
        notifications.push(
          {
            id: 1,
            type: 'system',
            title: 'Nuevo usuario registrado',
            message: '5 nuevos usuarios se han registrado en las últimas 2 horas',
            time: '30 min',
            timestamp: new Date(now - 30 * 60 * 1000),
            read: false,
            priority: 'medium'
          },
          {
            id: 2,
            type: 'dispute',
            title: 'Disputa reportada',
            message: 'Nueva disputa entre estudiante y profesor requiere revisión',
            time: '1 hora',
            timestamp: new Date(now - 60 * 60 * 1000),
            read: false,
            priority: 'high'
          },
          {
            id: 3,
            type: 'system',
            title: 'Reporte diario',
            message: 'Reporte de actividad diaria disponible para revisión',
            time: '3 horas',
            timestamp: new Date(now - 3 * 60 * 60 * 1000),
            read: true,
            priority: 'low'
          }
        )
      }

      return notifications
    }

    setNotifications(getBaseNotifications())

    // Simular notificaciones en tiempo real cada 5 minutos (menos frecuente)
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.9 // 10% de probabilidad (más realista)

      if (shouldAddNotification) {
        const newNotification = generateRandomNotification(user.tipoUsuario)
        if (newNotification) {
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Mantener máximo 10
        }
      }
    }, 300000) // 5 minutos en lugar de 30 segundos

    return () => clearInterval(interval)
  }, [isAuthenticated, user])

  // Actualizar contador de no leídas
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  // Generar notificación aleatoria
  const generateRandomNotification = (userType) => {
    const now = new Date()
    const id = Date.now()

    const templates = {
      estudiante: [
        {
          type: 'class',
          title: 'Recordatorio de clase',
          message: 'Tu clase comienza en 15 minutos',
          priority: 'urgent'
        },
        {
          type: 'payment',
          title: 'Pago procesado',
          message: 'Tu pago ha sido procesado exitosamente',
          priority: 'medium'
        }
      ],
      profesor: [
        {
          type: 'booking',
          title: 'Nueva solicitud',
          message: 'Un estudiante quiere reservar una clase contigo',
          priority: 'high'
        },
        {
          type: 'review',
          title: 'Nueva reseña',
          message: 'Has recibido una nueva reseña de 5 estrellas',
          priority: 'medium'
        }
      ],
      admin: [
        {
          type: 'system',
          title: 'Actividad del sistema',
          message: 'Nuevo pico de actividad detectado',
          priority: 'low'
        }
      ]
    }

    const userTemplates = templates[userType] || []
    if (userTemplates.length === 0) return null

    const template = userTemplates[Math.floor(Math.random() * userTemplates.length)]

    return {
      id,
      ...template,
      time: 'ahora',
      timestamp: now,
      read: false
    }
  }

  // Marcar como leída
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  // Eliminar notificación
  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    )
  }

  // Limpiar todas las notificaciones
  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}

// Función para obtener el icono según el tipo
export const getNotificationIcon = (type) => {
  const icons = {
    payment: '💳',
    class: '📚',
    reminder: '⏰',
    booking: '📅',
    review: '⭐',
    system: '⚙️',
    dispute: '⚠️'
  }
  return icons[type] || '📢'
}

// Función para obtener el color según la prioridad
export const getNotificationColor = (priority) => {
  const colors = {
    urgent: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-blue-500 bg-blue-50',
    low: 'border-gray-500 bg-gray-50'
  }
  return colors[priority] || 'border-gray-500 bg-gray-50'
}
