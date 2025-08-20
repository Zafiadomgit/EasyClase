import apiClient from './api'

export const perfilEnriquecidoService = {
  // Obtener perfil completo
  obtenerPerfil: async () => {
    try {
      const response = await apiClient.get('/perfil-enriquecido')
      return response.data
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      throw error
    }
  },

  // Actualizar intereses
  actualizarIntereses: async (intereses) => {
    try {
      const response = await apiClient.put('/perfil-enriquecido/intereses', {
        intereses
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar intereses:', error)
      throw error
    }
  },

  // Actualizar objetivos
  actualizarObjetivos: async (objetivos) => {
    try {
      const response = await apiClient.put('/perfil-enriquecido/objetivos', {
        objetivos
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar objetivos:', error)
      throw error
    }
  },

  // Actualizar preferencias de aprendizaje
  actualizarPreferencias: async (preferenciasAprendizaje) => {
    try {
      const response = await apiClient.put('/perfil-enriquecido/preferencias', {
        preferenciasAprendizaje
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar preferencias:', error)
      throw error
    }
  },

  // Obtener sugerencias personalizadas
  obtenerSugerencias: async () => {
    try {
      const response = await apiClient.get('/perfil-enriquecido/sugerencias')
      return response.data
    } catch (error) {
      console.error('Error al obtener sugerencias:', error)
      throw error
    }
  },

  // Actualizar progreso de objetivo
  actualizarProgreso: async (objetivoId, progreso) => {
    try {
      const response = await apiClient.put(
        `/perfil-enriquecido/objetivos/${objetivoId}/progreso`,
        { progreso }
      )
      return response.data
    } catch (error) {
      console.error('Error al actualizar progreso:', error)
      throw error
    }
  },

  // Registrar búsqueda para mejorar recomendaciones
  registrarBusqueda: async (categoria, termino) => {
    try {
      const response = await apiClient.post('/perfil-enriquecido/busqueda', {
        categoria,
        termino
      })
      return response.data
    } catch (error) {
      console.error('Error al registrar búsqueda:', error)
      throw error
    }
  },

  // Actualizar configuración de privacidad
  actualizarPrivacidad: async (configuracionPrivacidad) => {
    try {
      const response = await apiClient.put('/perfil-enriquecido/privacidad', {
        configuracionPrivacidad
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar privacidad:', error)
      throw error
    }
  }
}
