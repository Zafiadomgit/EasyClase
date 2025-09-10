// Servicio para validar acceso a videollamadas
class VideoCallAuthService {
  // Verificar si un usuario puede acceder a una videollamada
  static canAccessVideoCall(claseId, userId, userType) {
    try {
      // Cargar clases del localStorage
      const misClases = JSON.parse(localStorage.getItem('misClases') || '[]')
      const misClasesEstudiante = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
      
      // Buscar la clase en las clases del profesor
      const claseProfesor = misClases.find(clase => clase.id === claseId)
      if (claseProfesor && userType === 'profesor') {
        return {
          canAccess: true,
          clase: claseProfesor,
          role: 'profesor'
        }
      }
      
      // Buscar la clase en las clases del estudiante
      const claseEstudiante = misClasesEstudiante.find(clase => clase.id === claseId)
      if (claseEstudiante && userType === 'estudiante') {
        return {
          canAccess: true,
          clase: claseEstudiante,
          role: 'estudiante'
        }
      }
      
      // Si no se encuentra en ninguna lista, no tiene acceso
      return {
        canAccess: false,
        clase: null,
        role: null
      }
    } catch (error) {
      console.error('Error verificando acceso a videollamada:', error)
      return {
        canAccess: false,
        clase: null,
        role: null
      }
    }
  }
  
  // Verificar si es el momento correcto para unirse (10 min antes)
  static canJoinNow(clase) {
    if (!clase || !clase.fecha || !clase.hora) {
      return { canJoin: false, reason: 'Información de clase incompleta' }
    }
    
    const ahora = new Date()
    const fechaClase = new Date(clase.fecha)
    const horaClase = clase.hora.split(':')
    const fechaHoraClase = new Date(fechaClase)
    fechaHoraClase.setHours(parseInt(horaClase[0]), parseInt(horaClase[1]), 0, 0)
    
    // Permitir unirse 10 minutos antes
    const diezMinutosAntes = new Date(fechaHoraClase.getTime() - 10 * 60 * 1000)
    
    // Calcular tiempo de finalización
    const duracionHoras = clase.duracion || 1
    const fechaFinClase = new Date(fechaHoraClase.getTime() + (duracionHoras * 60 * 60 * 1000))
    
    if (ahora < diezMinutosAntes) {
      const minutosRestantes = Math.ceil((diezMinutosAntes.getTime() - ahora.getTime()) / (1000 * 60))
      return { 
        canJoin: false, 
        reason: `La videollamada estará disponible en ${minutosRestantes} minutos`,
        timeUntilAvailable: minutosRestantes
      }
    }
    
    if (ahora > fechaFinClase) {
      return { 
        canJoin: false, 
        reason: 'Esta clase ya ha terminado' 
      }
    }
    
    return { 
      canJoin: true, 
      reason: 'Puedes unirte ahora',
      fechaInicio: fechaHoraClase,
      fechaFin: fechaFinClase
    }
  }
  
  // Obtener información de la clase para la videollamada
  static getClassInfo(claseId) {
    try {
      // Buscar en clases del profesor
      const misClases = JSON.parse(localStorage.getItem('misClases') || '[]')
      const claseProfesor = misClases.find(clase => clase.id === claseId)
      if (claseProfesor) {
        return {
          ...claseProfesor,
          source: 'profesor'
        }
      }
      
      // Buscar en clases del estudiante
      const misClasesEstudiante = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
      const claseEstudiante = misClasesEstudiante.find(clase => clase.id === claseId)
      if (claseEstudiante) {
        return {
          ...claseEstudiante,
          source: 'estudiante'
        }
      }
      
      return null
    } catch (error) {
      console.error('Error obteniendo información de clase:', error)
      return null
    }
  }
}

export default VideoCallAuthService
