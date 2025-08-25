// Servicio para manejar las clases del usuario
class ClaseService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
  }

  /**
   * Guarda una nueva clase después del pago exitoso
   * @param {Object} claseData - Datos de la clase
   * @returns {Promise<Object>} - Clase guardada
   */
  async guardarClase(claseData) {
    try {
      console.log('Guardando clase:', claseData)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Crear ID único para la clase
      const claseId = `clase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const claseGuardada = {
        id: claseId,
        ...claseData,
        estado: 'confirmada',
        fechaCreacion: new Date().toISOString(),
        proximaVideollamada: this.calcularProximaVideollamada(claseData.fecha, claseData.hora)
      }
      
      // Guardar en localStorage para persistencia
      this.guardarClaseEnLocalStorage(claseGuardada)
      
      console.log('Clase guardada exitosamente:', claseGuardada)
      return claseGuardada
    } catch (error) {
      console.error('Error guardando clase:', error)
      throw new Error('No se pudo guardar la clase')
    }
  }

  /**
   * Obtiene todas las clases del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de clases
   */
  async obtenerClasesUsuario(userId) {
    try {
      console.log('Obteniendo clases para usuario:', userId)
      
      // Obtener desde localStorage
      const clases = this.obtenerClasesDeLocalStorage(userId)
      
      // Ordenar por fecha (más recientes primero)
      return clases.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    } catch (error) {
      console.error('Error obteniendo clases:', error)
      return []
    }
  }

  /**
   * Obtiene las próximas clases del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de próximas clases
   */
  async obtenerProximasClases(userId) {
    try {
      console.log('🔍 Obteniendo próximas clases para userId:', userId)
      
      const todasLasClases = await this.obtenerClasesUsuario(userId)
      console.log('📋 Todas las clases obtenidas:', todasLasClases)
      
      const ahora = new Date()
      console.log('⏰ Fecha actual:', ahora.toISOString())
      
      // Filtrar clases futuras
      const clasesFuturas = todasLasClases.filter(clase => {
        const fechaClase = new Date(`${clase.fecha}T${clase.hora}`)
        const esFutura = fechaClase > ahora
        const esConfirmada = clase.estado === 'confirmada'
        
        console.log(`📅 Clase ${clase.id}: fecha=${clase.fecha}, hora=${clase.hora}, estado=${clase.estado}, esFutura=${esFutura}, esConfirmada=${esConfirmada}`)
        
        return esFutura && esConfirmada
      })
      
      console.log('✅ Clases futuras y confirmadas:', clasesFuturas)
      
      const clasesOrdenadas = clasesFuturas.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
      console.log('📊 Clases ordenadas por fecha:', clasesOrdenadas)
      
      return clasesOrdenadas
    } catch (error) {
      console.error('❌ Error obteniendo próximas clases:', error)
      return []
    }
  }

  /**
   * Verifica si una clase está próxima a comenzar (15-10 minutos antes)
   * @param {Object} clase - Datos de la clase
   * @returns {boolean} - True si está próxima a comenzar
   */
  verificarClaseProxima(clase) {
    const ahora = new Date()
    const fechaClase = new Date(`${clase.fecha}T${clase.hora}`)
    const diferenciaMinutos = (fechaClase - ahora) / (1000 * 60)
    
    // Entre 15 y 10 minutos antes
    return diferenciaMinutos >= 10 && diferenciaMinutos <= 15
  }

  /**
   * Calcula la URL de la videollamada para una clase
   * @param {string} fecha - Fecha de la clase
   * @param {string} hora - Hora de la clase
   * @returns {Object} - Información de la videollamada
   */
  calcularProximaVideollamada(fecha, hora) {
    const fechaClase = new Date(`${fecha}T${hora}`)
    const disponibleDesde = new Date(fechaClase.getTime() - 10 * 60 * 1000) // 10 min antes
    const disponibleHasta = new Date(fechaClase.getTime() + 60 * 60 * 1000) // 1 hora después
    
    return {
      url: `https://meet.google.com/easyclase-${Date.now()}`,
      disponibleDesde: disponibleDesde.toISOString(),
      disponibleHasta: disponibleHasta.toISOString()
    }
  }

  /**
   * Guarda una clase en localStorage
   * @param {Object} clase - Datos de la clase
   */
  guardarClaseEnLocalStorage(clase) {
    try {
      console.log('🔍 Guardando clase en localStorage para userId:', clase.userId)
      const clasesExistentes = this.obtenerClasesDeLocalStorage(clase.userId)
      console.log('📋 Clases existentes antes de agregar:', clasesExistentes)
      
      clasesExistentes.push(clase)
      console.log('➕ Clase agregada. Total de clases:', clasesExistentes.length)
      
      const key = `clases_${clase.userId}`
      localStorage.setItem(key, JSON.stringify(clasesExistentes))
      console.log('💾 Clase guardada en localStorage con key:', key)
      console.log('📦 Datos guardados:', JSON.stringify(clasesExistentes))
    } catch (error) {
      console.error('❌ Error guardando clase en localStorage:', error)
    }
  }

  /**
   * Obtiene clases desde localStorage
   * @param {string} userId - ID del usuario
   * @returns {Array} - Lista de clases
   */
  obtenerClasesDeLocalStorage(userId) {
    try {
      const key = `clases_${userId}`
      console.log('🔍 Buscando clases en localStorage con key:', key)
      
      const clases = localStorage.getItem(key)
      console.log('📦 Datos raw de localStorage:', clases)
      
      if (clases) {
        const clasesParsed = JSON.parse(clases)
        console.log('✅ Clases parseadas exitosamente:', clasesParsed)
        return clasesParsed
      } else {
        console.log('📭 No hay clases guardadas para este userId')
        return []
      }
    } catch (error) {
      console.error('❌ Error obteniendo clases de localStorage:', error)
      return []
    }
  }

  /**
   * Actualiza el estado de una clase
   * @param {string} claseId - ID de la clase
   * @param {string} nuevoEstado - Nuevo estado
   * @param {string} userId - ID del usuario
   */
  async actualizarEstadoClase(claseId, nuevoEstado, userId) {
    try {
      const clases = this.obtenerClasesDeLocalStorage(userId)
      const claseIndex = clases.findIndex(c => c.id === claseId)
      
      if (claseIndex !== -1) {
        clases[claseIndex].estado = nuevoEstado
        localStorage.setItem(`clases_${userId}`, JSON.stringify(clases))
        console.log(`Estado de clase ${claseId} actualizado a: ${nuevoEstado}`)
      }
    } catch (error) {
      console.error('Error actualizando estado de clase:', error)
    }
  }

  /**
   * Cancela una clase
   * @param {string} claseId - ID de la clase
   * @param {string} userId - ID del usuario
   * @param {string} motivo - Motivo de cancelación
   */
  async cancelarClase(claseId, userId, motivo = 'Cancelada por el usuario') {
    try {
      await this.actualizarEstadoClase(claseId, 'cancelada', userId)
      
      // Agregar motivo de cancelación
      const clases = this.obtenerClasesDeLocalStorage(userId)
      const claseIndex = clases.findIndex(c => c.id === claseId)
      
      if (claseIndex !== -1) {
        clases[claseIndex].motivoCancelacion = motivo
        clases[claseIndex].fechaCancelacion = new Date().toISOString()
        localStorage.setItem(`clases_${userId}`, JSON.stringify(clases))
      }
      
      console.log(`Clase ${claseId} cancelada: ${motivo}`)
    } catch (error) {
      console.error('Error cancelando clase:', error)
    }
  }
}

export default new ClaseService()
