import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import realNotificationService from '../services/realNotificationService'
import notificationService from '../services/notificationService'

export const useRealNotifications = () => {
  const { user } = useAuth()
  const intervalRef = useRef(null)
  const notifiedClassesRef = useRef(new Set())

  useEffect(() => {
    if (!user?.id) return

    // Función para verificar clases próximas
    const checkUpcomingClasses = async () => {
      try {
        // Simular obtención de clases próximas (reemplazar con API real)
        const proximasClases = await getUpcomingClasses(user.id)
        const ahora = new Date()
        
        proximasClases.forEach(clase => {
          const fechaClase = new Date(`${clase.fecha}T${clase.hora}`)
          const diffInMinutes = Math.floor((fechaClase - ahora) / (1000 * 60))
          
          // Notificar 10 minutos antes de la clase
          if (diffInMinutes <= 10 && diffInMinutes > 0 && !notifiedClassesRef.current.has(clase.id)) {
            realNotificationService.notifyClassStartingSoon(user.id, {
              id: clase.id,
              tema: clase.tema || 'Clase',
              fecha: clase.fecha,
              hora: clase.hora
            })
            
            // Marcar como notificada para evitar duplicados
            notifiedClassesRef.current.add(clase.id)
          }
        })
      } catch (error) {
        console.error('Error verificando clases próximas:', error)
      }
    }

    // Verificar inmediatamente
    checkUpcomingClasses()

    // Verificar cada minuto
    intervalRef.current = setInterval(checkUpcomingClasses, 60000) // 60 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [user?.id])

  // Limpiar clases notificadas cuando el usuario cambie
  useEffect(() => {
    notifiedClassesRef.current.clear()
  }, [user?.id])

  // Funciones para disparar notificaciones desde componentes
  const notifyClassCreated = (claseData) => {
    if (!user?.id) return
    return realNotificationService.notifyClassCreated(user.id, claseData)
  }

  const notifyClassReserved = (profesorId, reservaData) => {
    return realNotificationService.notifyClassReserved(profesorId, reservaData)
  }

  const notifyPaymentConfirmed = (estudianteId, pagoData) => {
    return realNotificationService.notifyPaymentConfirmed(estudianteId, pagoData)
  }

  const notifyClassCancelled = (userId, claseData, reason) => {
    return realNotificationService.notifyClassCancelled(userId, claseData, reason)
  }

  const notifyClassCompleted = (userId, claseData) => {
    return realNotificationService.notifyClassCompleted(userId, claseData)
  }

  const notifyNewMessage = (userId, messageData) => {
    return realNotificationService.notifyNewMessage(userId, messageData)
  }

  const notifyProfileUpdated = (userId, profileData) => {
    return realNotificationService.notifyProfileUpdated(userId, profileData)
  }

  const notifyNewRating = (profesorId, ratingData) => {
    return realNotificationService.notifyNewRating(profesorId, ratingData)
  }

  const notifyMilestone = (userId, milestoneData) => {
    return realNotificationService.notifyMilestone(userId, milestoneData)
  }

  return {
    notifyClassCreated,
    notifyClassReserved,
    notifyPaymentConfirmed,
    notifyClassCancelled,
    notifyClassCompleted,
    notifyNewMessage,
    notifyProfileUpdated,
    notifyNewRating,
    notifyMilestone
  }
}

// Función temporal para simular clases próximas (reemplazar con API real)
const getUpcomingClasses = async (userId) => {
  // Simular datos de clases próximas
  const ahora = new Date()
  const proximaClase = new Date(ahora.getTime() + 15 * 60000) // 15 minutos en el futuro
  
  return [
    {
      id: 'clase-001',
      tema: 'Matemáticas Avanzadas',
      fecha: proximaClase.toISOString().split('T')[0],
      hora: proximaClase.toTimeString().slice(0, 5),
      profesorId: userId
    }
  ]
}
