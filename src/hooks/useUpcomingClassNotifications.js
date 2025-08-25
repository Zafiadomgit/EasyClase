import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import notificationService from '../services/notificationService'
import claseServiceLocal from '../services/claseService'

export const useUpcomingClassNotifications = () => {
  const { user } = useAuth()
  const intervalRef = useRef(null)
  const notifiedClassesRef = useRef(new Set())

  useEffect(() => {
    if (!user?.id) return

    const checkUpcomingClasses = async () => {
      try {
        const proximasClases = await claseServiceLocal.obtenerProximasClases(user.id)
        const ahora = new Date()
        
        proximasClases.forEach(clase => {
          const fechaClase = new Date(`${clase.fecha}T${clase.hora}`)
          const diffInMinutes = Math.floor((fechaClase - ahora) / (1000 * 60))
          
          // Notificar 10 minutos antes de la clase
          if (diffInMinutes <= 10 && diffInMinutes > 0 && !notifiedClassesRef.current.has(clase.id)) {
            notificationService.createUpcomingClassNotification(user.id, {
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
}
