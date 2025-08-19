const mongoose = require('mongoose')

const perfilEnriquecidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Intereses del usuario
  intereses: [{
    categoria: {
      type: String,
      required: true,
      enum: [
        'Programación', 'Diseño', 'Marketing', 'Idiomas', 'Excel', 
        'Matemáticas', 'Física', 'Química', 'Contabilidad', 'Finanzas',
        'Fotografía', 'Video', 'Música', 'Arte', 'Escritura',
        'Desarrollo Personal', 'Negocios', 'Emprendimiento'
      ]
    },
    nivel: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      default: 'principiante'
    },
    prioridad: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  }],
  
  // Objetivos de aprendizaje
  objetivos: [{
    titulo: {
      type: String,
      required: true,
      maxlength: 100
    },
    descripcion: {
      type: String,
      maxlength: 500
    },
    categoria: {
      type: String,
      required: true
    },
    fechaLimite: {
      type: Date
    },
    estado: {
      type: String,
      enum: ['activo', 'completado', 'pausado'],
      default: 'activo'
    },
    progreso: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  
  // Preferencias de aprendizaje
  preferenciasAprendizaje: {
    modalidadPreferida: {
      type: String,
      enum: ['individual', 'grupal', 'mixta'],
      default: 'individual'
    },
    duracionSesionPreferida: {
      type: Number, // minutos
      min: 30,
      max: 180,
      default: 60
    },
    horarioPreferido: [{
      dia: {
        type: String,
        enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
      },
      horaInicio: String, // formato "HH:mm"
      horaFin: String     // formato "HH:mm"
    }],
    nivelExperiencia: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      default: 'principiante'
    },
    presupuestoMensual: {
      type: Number,
      min: 0
    }
  },
  
  // Historial y métricas
  historialBusquedas: [{
    categoria: String,
    termino: String,
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  
  clasesTomadas: [{
    categoria: String,
    fecha: Date,
    calificacion: Number
  }],
  
  // Sugerencias personalizadas
  sugerenciasActualizadas: {
    type: Date,
    default: Date.now
  },
  
  // Configuración de privacidad
  configuracionPrivacidad: {
    perfilPublico: {
      type: Boolean,
      default: false
    },
    mostrarProgreso: {
      type: Boolean,
      default: true
    },
    recibirSugerencias: {
      type: Boolean,
      default: true
    }
  }
  
}, {
  timestamps: true
})

// Índices para optimizar consultas
perfilEnriquecidoSchema.index({ usuario: 1 })
perfilEnriquecidoSchema.index({ 'intereses.categoria': 1 })
perfilEnriquecidoSchema.index({ sugerenciasActualizadas: 1 })

// Método para generar sugerencias personalizadas
perfilEnriquecidoSchema.methods.generarSugerencias = async function() {
  const Clase = mongoose.model('Clase')
  const User = mongoose.model('User')
  
  const sugerencias = []
  
  // Sugerencias basadas en intereses
  for (const interes of this.intereses) {
    const clasesRelacionadas = await Clase.find({
      categoria: interes.categoria,
      activa: true
    }).limit(3).populate('profesor', 'nombre calificacionPromedio')
    
    if (clasesRelacionadas.length > 0) {
      sugerencias.push({
        tipo: 'interes',
        categoria: interes.categoria,
        clases: clasesRelacionadas,
        razon: `Te interesa ${interes.categoria.toLowerCase()}`
      })
    }
  }
  
  // Sugerencias basadas en objetivos activos
  for (const objetivo of this.objetivos.filter(obj => obj.estado === 'activo')) {
    const clasesRelacionadas = await Clase.find({
      categoria: objetivo.categoria,
      activa: true
    }).limit(2).populate('profesor', 'nombre calificacionPromedio')
    
    if (clasesRelacionadas.length > 0) {
      sugerencias.push({
        tipo: 'objetivo',
        categoria: objetivo.categoria,
        clases: clasesRelacionadas,
        razon: `Para tu objetivo: ${objetivo.titulo}`
      })
    }
  }
  
  return sugerencias
}

// Método para actualizar progreso de objetivos
perfilEnriquecidoSchema.methods.actualizarProgresoObjetivo = function(objetivoId, nuevoProgreso) {
  const objetivo = this.objetivos.id(objetivoId)
  if (objetivo) {
    objetivo.progreso = Math.min(100, Math.max(0, nuevoProgreso))
    if (objetivo.progreso === 100) {
      objetivo.estado = 'completado'
    }
    return this.save()
  }
  return Promise.reject(new Error('Objetivo no encontrado'))
}

// Método para registrar actividad de búsqueda
perfilEnriquecidoSchema.methods.registrarBusqueda = function(categoria, termino) {
  this.historialBusquedas.push({
    categoria,
    termino,
    fecha: new Date()
  })
  
  // Mantener solo las últimas 50 búsquedas
  if (this.historialBusquedas.length > 50) {
    this.historialBusquedas = this.historialBusquedas.slice(-50)
  }
  
  return this.save()
}

const PerfilEnriquecido = mongoose.model('PerfilEnriquecido', perfilEnriquecidoSchema)

module.exports = PerfilEnriquecido
