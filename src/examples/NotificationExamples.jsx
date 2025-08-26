import React from 'react'
import { useNotifications } from '../contexts/NotificationContext'
import { useSystemNotifications } from '../hooks/useSystemNotifications'
import notificationEventService from '../services/notificationEventService'

// Componente de ejemplo para mostrar cómo usar las notificaciones del sistema
export const NotificationExamples = () => {
  const { showSystemNotification, addNotification } = useNotifications()
  const { 
    showPaymentSuccess, 
    showPaymentRejected,
    showClassScheduled,
    showClassConfirmed, 
    showNewMessage, 
    showPaymentReminder,
    showClassStartingSoon
  } = useSystemNotifications()

  const handleShowWelcome = () => {
    showSystemNotification('welcome')
  }

  const handleShowClassReminder = () => {
    showSystemNotification('class_reminder')
  }

  const handleShowPaymentReminder = () => {
    showSystemNotification('payment_reminder')
  }

  const handleShowNewMessage = () => {
    showSystemNotification('new_message')
  }

  const handleShowClassConfirmed = () => {
    showSystemNotification('class_confirmed')
  }

  const handleShowPaymentSuccess = () => {
    showSystemNotification('payment_success')
  }

  const handleShowPaymentRejected = () => {
    showSystemNotification('payment_rejected')
  }

  const handleShowClassScheduled = () => {
    showSystemNotification('class_scheduled')
  }

  const handleShowClassStartingSoon = () => {
    showSystemNotification('class_starting_soon')
  }

  const handleShowToast = () => {
    addNotification({
      type: 'success',
      title: '¡Éxito!',
      message: 'Esta es una notificación temporal (toast)',
      duration: 5000
    })
  }

  const handleShowError = () => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Esta es una notificación de error',
      duration: 8000
    })
  }

  // Funciones para simular eventos automáticos del sistema
  const handleSimulateNewMessage = () => {
    notificationEventService.simulateNewMessage(
      'prof-123',
      'Prof. María García',
      'Hola, ¿tienes disponibilidad para mañana?',
      'est-456'
    )
  }

  const handleSimulateClassScheduled = () => {
    notificationEventService.simulateClassScheduled(
      'clase-789',
      'Matemáticas Avanzadas',
      '2024-12-20',
      '15:00',
      'prof-123',
      'est-456'
    )
  }

  const handleSimulatePaymentSuccess = () => {
    notificationEventService.simulatePaymentProcessed(
      'pago-101',
      150000,
      'success',
      null,
      'est-456',
      'clase-789'
    )
  }

  const handleSimulatePaymentRejected = () => {
    notificationEventService.simulatePaymentProcessed(
      'pago-102',
      150000,
      'rejected',
      'Tarjeta sin fondos',
      'est-456',
      'clase-789'
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-secondary-900 dark:text-gray-100 mb-6">
        Ejemplos de Notificaciones del Sistema
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notificaciones Persistentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-secondary-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            Notificaciones Persistentes (Campanita)
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleShowWelcome}
              className="w-full btn-secondary text-left"
            >
              🎉 Notificación de Bienvenida
            </button>
            <button
              onClick={handleShowClassReminder}
              className="w-full btn-secondary text-left"
            >
              ⏰ Recordatorio de Clase
            </button>
            <button
              onClick={handleShowPaymentReminder}
              className="w-full btn-secondary text-left"
            >
              💳 Recordatorio de Pago
            </button>
            <button
              onClick={handleShowNewMessage}
              className="w-full btn-secondary text-left"
            >
              💬 Nuevo Mensaje
            </button>
            <button
              onClick={handleShowClassConfirmed}
              className="w-full btn-secondary text-left"
            >
              ✅ Clase Confirmada
            </button>
            <button
              onClick={handleShowPaymentSuccess}
              className="w-full btn-secondary text-left"
            >
              💰 Pago Exitoso
            </button>
            <button
              onClick={handleShowPaymentRejected}
              className="w-full btn-secondary text-left"
            >
              ❌ Pago Rechazado
            </button>
            <button
              onClick={handleShowClassScheduled}
              className="w-full btn-secondary text-left"
            >
              📅 Clase Agendada
            </button>
            <button
              onClick={handleShowClassStartingSoon}
              className="w-full btn-secondary text-left"
            >
              ⏰ Clase Comienza en 10 min
            </button>
          </div>
        </div>

        {/* Notificaciones Temporales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-secondary-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            Notificaciones Temporales (Toast)
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleShowToast}
              className="w-full btn-primary"
            >
              🍞 Mostrar Toast de Éxito
            </button>
            <button
              onClick={handleShowError}
              className="w-full btn-danger"
            >
              ❌ Mostrar Toast de Error
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Información
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Las notificaciones persistentes se guardan en la campanita y las temporales 
              aparecen como toast y desaparecen automáticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Eventos Automáticos del Sistema */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-secondary-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          🚀 Eventos Automáticos del Sistema
        </h2>
        <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">
          Estas notificaciones se generan automáticamente cuando ocurren eventos en el sistema:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleSimulateNewMessage}
            className="w-full btn-primary"
          >
            💬 Simular Nuevo Mensaje
          </button>
          <button
            onClick={handleSimulateClassScheduled}
            className="w-full btn-primary"
          >
            📅 Simular Clase Agendada
          </button>
          <button
            onClick={handleSimulatePaymentSuccess}
            className="w-full btn-primary"
          >
            ✅ Simular Pago Exitoso
          </button>
          <button
            onClick={handleSimulatePaymentRejected}
            className="w-full btn-primary"
          >
            ❌ Simular Pago Rechazado
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Cómo Funciona
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Los eventos automáticos se disparan cuando ocurren acciones en el sistema (mensajes, 
            pagos, agendamiento de clases). Las notificaciones aparecen automáticamente en la 
            campanita y se marcan como leídas al hacer click.
          </p>
        </div>
      </div>

      {/* Código de Ejemplo */}
      <div className="mt-8 bg-gray-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Código de Ejemplo</h3>
        <pre className="text-sm text-gray-300 overflow-x-auto">
{`// En cualquier componente
import { useNotifications } from '../contexts/NotificationContext'
import { useSystemNotifications } from '../hooks/useSystemNotifications'

const MyComponent = () => {
  const { showSystemNotification, addNotification } = useNotifications()
  const { showPaymentSuccess, showClassConfirmed } = useSystemNotifications()

  // Notificación persistente
  const handlePaymentSuccess = () => {
    showSystemNotification('payment_success', userId)
  }

  // Notificación temporal
  const handleShowToast = () => {
    addNotification({
      type: 'success',
      title: '¡Éxito!',
      message: 'Operación completada',
      duration: 5000
    })
  }

  return (
    <div>
      <button onClick={handlePaymentSuccess}>Pago Exitoso</button>
      <button onClick={handleShowToast}>Mostrar Toast</button>
    </div>
  )
}`}
        </pre>
      </div>
    </div>
  )
}

export default NotificationExamples
