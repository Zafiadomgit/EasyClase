import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título del servicio es obligatorio'],
    trim: true,
    maxLength: [100, 'El título no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del servicio es obligatoria'],
    trim: true,
    maxLength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría del servicio es obligatoria'],
    enum: [
      'Tesis y Trabajos Académicos',
      'Desarrollo Web',
      'Desarrollo de Apps',
      'Diseño Gráfico',
      'Marketing Digital',
      'Consultoría de Negocios',
      'Traducción',
      'Redacción de Contenido',
      'Asesoría Legal',
      'Contabilidad y Finanzas',
      'Fotografía',
      'Video y Edición',
      'Arquitectura y Diseño',
      'Ingeniería',
      'Otros'
    ]
  },
  subcategoria: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio del servicio es obligatorio'],
    min: [10000, 'El precio mínimo es $10,000 COP']
  },
  tiempoPrevisto: {
    valor: {
      type: Number,
      required: true
    },
    unidad: {
      type: String,
      required: true,
      enum: ['horas', 'días', 'semanas', 'meses']
    }
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'mixta']
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Requisitos específicos para el servicio
  requisitos: [{
    type: String,
    trim: true
  }],
  // Entregables del servicio
  entregables: [{
    type: String,
    trim: true
  }],
  // Tecnologías o herramientas que usa
  tecnologias: [{
    type: String,
    trim: true
  }],
  // Portfolio o ejemplos de trabajos anteriores
  portfolio: [{
    titulo: String,
    descripcion: String,
    imagen: String,
    enlace: String
  }],
  // Estado del servicio
  estado: {
    type: String,
    enum: ['activo', 'pausado', 'inactivo'],
    default: 'activo'
  },
  // Nivel de experiencia requerido del cliente
  nivelCliente: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado', 'cualquiera'],
    default: 'cualquiera'
  },
  // Número de revisiones incluidas
  revisionesIncluidas: {
    type: Number,
    default: 2,
    min: 0
  },
  // Si es un servicio premium
  premium: {
    type: Boolean,
    default: false
  },
  // Calificaciones del servicio
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  // Contador de servicios vendidos
  totalVentas: {
    type: Number,
    default: 0
  },
  // Etiquetas para búsqueda
  etiquetas: [{
    type: String,
    trim: true
  }],
  // Preguntas frecuentes sobre el servicio
  faq: [{
    pregunta: String,
    respuesta: String
  }],
  // Disponibilidad
  disponible: {
    type: Boolean,
    default: true
  },
  // Fecha límite para solicitar el servicio
  fechaLimite: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
servicioSchema.index({ categoria: 1 });
servicioSchema.index({ proveedor: 1 });
servicioSchema.index({ estado: 1 });
servicioSchema.index({ calificacionPromedio: -1 });
servicioSchema.index({ precio: 1 });
servicioSchema.index({ titulo: 'text', descripcion: 'text', etiquetas: 'text' });

// Middleware para calcular comisión
servicioSchema.methods.calcularComision = async function() {
  // Obtener el usuario proveedor para verificar si es premium
  await this.populate('proveedor', 'premium');
  const esPremium = this.proveedor?.premium || false;
  
  // Comisión: 7% para premium, 10% para usuarios regulares
  const porcentajeComision = esPremium ? 0.07 : 0.10;
  return this.precio * porcentajeComision;
};

servicioSchema.methods.calcularPrecioFinal = async function() {
  const comision = await this.calcularComision();
  return this.precio - comision;
};

// Método para obtener datos públicos del servicio
servicioSchema.methods.getPublicData = async function() {
  const servicio = this.toObject();
  const comision = await this.calcularComision();
  const precioFinal = await this.calcularPrecioFinal();
  
  return {
    ...servicio,
    comision,
    precioFinal,
    esPremium: this.proveedor?.premium || false
  };
};

export default mongoose.model('Servicio', servicioSchema);
