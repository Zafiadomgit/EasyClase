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
        const proximasClases = await getUpcomingClasses(user)
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

// Clases reales del usuario. Antes esto devolvía siempre una clase inventada
// ("Matemáticas Avanzadas" a 15 minutos vista), así que a cualquier usuario le
// llegaba el aviso de una clase que no existía.
const getUpcomingClasses = async (user) => {
  try {
    const token = localStorage.getItem('token')
    if (!token || !user?.id) return []
    const endpoint = user.tipoUsuario === 'profesor'
      ? '/api/clases/profesor/mis-clases'
      : '/api/clases/estudiante/mis-clases'
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) return []
    const data = await response.json()
    const clases = data?.data?.clases || data?.clases || []
    return clases
      .filter(c => c.estado === 'confirmada' && c.fecha && c.hora)
      .map(c => ({ id: c.id, tema: c.titulo, fecha: c.fecha, hora: c.hora }))
  } catch (error) {
    console.error('Error obteniendo próximas clases:', error)
    return []
  }
}
