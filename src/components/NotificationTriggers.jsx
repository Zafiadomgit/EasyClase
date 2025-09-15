import React from 'react'
import { useRealNotifications } from '../hooks/useRealNotifications'
import { useAuth } from '../contexts/AuthContext'

// Componente para demostrar cómo usar las notificaciones reales
const NotificationTriggers = () => {
  const { user } = useAuth()
  const {
    notifyClassCreated,
    notifyClassReserved,
    notifyPaymentConfirmed,
    notifyClassCancelled,
    notifyClassCompleted,
    notifyNewMessage,
    notifyProfileUpdated,
    notifyNewRating,
    notifyMilestone
  } = useRealNotifications()

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const handleClassCreated = () => {
    notifyClassCreated({
      id: 'clase-001',
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-20',
      hora: '15:00',
      precio: 50000
    })
  }

  const handleClassReserved = () => {
    notifyClassReserved('prof-123', {
      id: 'reserva-001',
      estudianteId: user?.id || 'est-456',
      estudianteNombre: user?.nombre || 'María García',
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-20',
      hora: '15:00',
      precio: 50000
    })
  }

  const handlePaymentConfirmed = () => {
    notifyPaymentConfirmed(user?.id || 'est-456', {
      id: 'pago-001',
      claseId: 'clase-001',
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-20',
      hora: '15:00',
      monto: 50000
    })
  }

  const handleClassCancelled = () => {
    notifyClassCancelled(user?.id || 'est-456', {
      id: 'clase-001',
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-20',
      hora: '15:00'
    }, 'Por motivos de fuerza mayor')
  }

  const handleClassCompleted = () => {
    notifyClassCompleted(user?.id || 'est-456', {
      id: 'clase-001',
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-20',
      hora: '15:00'
    })
  }

  const handleNewMessage = () => {
    notifyNewMessage(user?.id || 'est-456', {
      id: 'msg-001',
      senderId: 'prof-123',
      senderName: 'Prof. Carlos Mendoza',
      chatId: 'chat-001',
      preview: 'Hola, ¿cómo estás? ¿Listo para nuestra clase?'
    })
  }

  const handleProfileUpdated = () => {
    notifyProfileUpdated(user?.id || 'est-456', {
      id: 'profile-001',
      changes: ['foto', 'descripción', 'especialidades']
    })
  }

  const handleNewRating = () => {
    notifyNewRating('prof-123', {
      id: 'rating-001',
      claseId: 'clase-001',
      estudianteId: user?.id || 'est-456',
      estudianteNombre: user?.nombre || 'María García',
      rating: 5,
      comment: 'Excelente profesor, muy claro en sus explicaciones'
    })
  }

  const handleMilestone = () => {
    notifyMilestone(user?.id || 'est-456', {
      id: 'milestone-001',
      type: 'classes_completed',
      description: '¡Has completado 10 clases!',
      value: 10
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-600 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        🧪 Notificaciones de Prueba
      </h3>
      <div className="space-y-2">
        <button
          onClick={handleClassCreated}
          className="w-full text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
        >
          📅 Clase Creada
        </button>
        <button
          onClick={handleClassReserved}
          className="w-full text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
        >
          🎯 Clase Reservada
        </button>
        <button
          onClick={handlePaymentConfirmed}
          className="w-full text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
        >
          💰 Pago Confirmado
        </button>
        <button
          onClick={handleClassCancelled}
          className="w-full text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          ❌ Clase Cancelada
        </button>
        <button
          onClick={handleClassCompleted}
          className="w-full text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
        >
          ✅ Clase Completada
        </button>
        <button
          onClick={handleNewMessage}
          className="w-full text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
        >
          💬 Nuevo Mensaje
        </button>
        <button
          onClick={handleProfileUpdated}
          className="w-full text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
        >
          👤 Perfil Actualizado
        </button>
        <button
          onClick={handleNewRating}
          className="w-full text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
        >
          ⭐ Nueva Calificación
        </button>
        <button
          onClick={handleMilestone}
          className="w-full text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
        >
          🏆 Hito Alcanzado
        </button>
      </div>
    </div>
  )
}

export default NotificationTriggers
