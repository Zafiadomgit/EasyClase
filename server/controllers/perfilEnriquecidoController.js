const PerfilEnriquecido = require('../models/PerfilEnriquecido')
const User = require('../models/User')
const { validationResult } = require('express-validator')

// Obtener perfil enriquecido del usuario
const obtenerPerfil = async (req, res) => {
  try {
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
      .populate('usuario', 'nombre email tipoUsuario')
    
    // Si no existe, crear uno vacío
    if (!perfil) {
      perfil = new PerfilEnriquecido({
        usuario: req.user.id,
        intereses: [],
        objetivos: [],
        preferenciasAprendizaje: {},
        historialBusquedas: [],
        clasesTomadas: []
      })
      await perfil.save()
      await perfil.populate('usuario', 'nombre email tipoUsuario')
    }
    
    res.json({
      success: true,
      perfil
    })
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar intereses del usuario
const actualizarIntereses = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      })
    }
    
    const { intereses } = req.body
    
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      perfil = new PerfilEnriquecido({ usuario: req.user.id })
    }
    
    perfil.intereses = intereses
    await perfil.save()
    
    res.json({
      success: true,
      message: 'Intereses actualizados correctamente',
      intereses: perfil.intereses
    })
  } catch (error) {
    console.error('Error al actualizar intereses:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar objetivos del usuario
const actualizarObjetivos = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      })
    }
    
    const { objetivos } = req.body
    
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      perfil = new PerfilEnriquecido({ usuario: req.user.id })
    }
    
    perfil.objetivos = objetivos
    await perfil.save()
    
    res.json({
      success: true,
      message: 'Objetivos actualizados correctamente',
      objetivos: perfil.objetivos
    })
  } catch (error) {
    console.error('Error al actualizar objetivos:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar preferencias de aprendizaje
const actualizarPreferencias = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      })
    }
    
    const { preferenciasAprendizaje } = req.body
    
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      perfil = new PerfilEnriquecido({ usuario: req.user.id })
    }
    
    perfil.preferenciasAprendizaje = { ...perfil.preferenciasAprendizaje, ...preferenciasAprendizaje }
    await perfil.save()
    
    res.json({
      success: true,
      message: 'Preferencias actualizadas correctamente',
      preferenciasAprendizaje: perfil.preferenciasAprendizaje
    })
  } catch (error) {
    console.error('Error al actualizar preferencias:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Obtener sugerencias personalizadas
const obtenerSugerencias = async (req, res) => {
  try {
    const perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil || !perfil.configuracionPrivacidad.recibirSugerencias) {
      return res.json({
        success: true,
        sugerencias: []
      })
    }
    
    // Verificar si necesitamos regenerar sugerencias (cada 24 horas)
    const ahora = new Date()
    const ultimaActualizacion = perfil.sugerenciasActualizadas
    const diferencia = ahora.getTime() - ultimaActualizacion.getTime()
    const horas24 = 24 * 60 * 60 * 1000
    
    let sugerencias = []
    
    if (diferencia > horas24 || !perfil.sugerencias) {
      // Generar nuevas sugerencias
      sugerencias = await perfil.generarSugerencias()
      perfil.sugerenciasActualizadas = ahora
      await perfil.save()
    }
    
    res.json({
      success: true,
      sugerencias
    })
  } catch (error) {
    console.error('Error al obtener sugerencias:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar progreso de objetivo
const actualizarProgreso = async (req, res) => {
  try {
    const { objetivoId } = req.params
    const { progreso } = req.body
    
    const perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: 'Perfil no encontrado'
      })
    }
    
    await perfil.actualizarProgresoObjetivo(objetivoId, progreso)
    
    res.json({
      success: true,
      message: 'Progreso actualizado correctamente',
      objetivos: perfil.objetivos
    })
  } catch (error) {
    console.error('Error al actualizar progreso:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    })
  }
}

// Registrar búsqueda para mejorar recomendaciones
const registrarBusqueda = async (req, res) => {
  try {
    const { categoria, termino } = req.body
    
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      perfil = new PerfilEnriquecido({ usuario: req.user.id })
    }
    
    await perfil.registrarBusqueda(categoria, termino)
    
    res.json({
      success: true,
      message: 'Búsqueda registrada'
    })
  } catch (error) {
    console.error('Error al registrar búsqueda:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

// Actualizar configuración de privacidad
const actualizarPrivacidad = async (req, res) => {
  try {
    const { configuracionPrivacidad } = req.body
    
    let perfil = await PerfilEnriquecido.findOne({ usuario: req.user.id })
    
    if (!perfil) {
      perfil = new PerfilEnriquecido({ usuario: req.user.id })
    }
    
    perfil.configuracionPrivacidad = { ...perfil.configuracionPrivacidad, ...configuracionPrivacidad }
    await perfil.save()
    
    res.json({
      success: true,
      message: 'Configuración de privacidad actualizada',
      configuracionPrivacidad: perfil.configuracionPrivacidad
    })
  } catch (error) {
    console.error('Error al actualizar privacidad:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

module.exports = {
  obtenerPerfil,
  actualizarIntereses,
  actualizarObjetivos,
  actualizarPreferencias,
  obtenerSugerencias,
  actualizarProgreso,
  registrarBusqueda,
  actualizarPrivacidad
}
