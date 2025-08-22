import mongoose from 'mongoose';

const claseSchema = new mongoose.Schema({
  estudiante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El estudiante es obligatorio']
  },
  profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El profesor es obligatorio']
  },
  materia: {
    type: String,
    required: [true, 'La materia es obligatoria'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    maxLength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria']
  },
  duracion: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    min: [1, 'La duración mínima es 1 hora'],
    max: [8, 'La duración máxima es 8 horas']
  },
  modalidad: {
    type: String,
    enum: ['online', 'presencial'],
    required: [true, 'La modalidad es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [5000, 'El precio mínimo es $5,000 COP']
  },
  total: {
    type: Number,
    required: [true, 'El total es obligatorio']
  },
  estado: {
    type: String,
    enum: ['solicitada', 'confirmada', 'rechazada', 'completada', 'cancelada'],
    default: 'solicitada'
  },
  // Información de pago
  pagoId: {
    type: String,
    default: null
  },
  estadoPago: {
    type: String,
    enum: ['pendiente', 'pagado', 'reembolsado', 'liberado'],
    default: 'pendiente'
  },
  montoPagado: {
    type: Number,
    default: 0
  },
  fechaPago: {
    type: Date,
    default: null
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  // Sistema de Escrow
  escrowStatus: {
    type: String,
    enum: ['pending', 'released', 'refunded', 'disputed', 'expired'],
    default: null
  },
  escrowCreatedAt: {
    type: Date,
    default: null
  },
  escrowExpiresAt: {
    type: Date,
    default: null
  },
  escrowReleasedAt: {
    type: Date,
    default: null
  },
  escrowReleasedBy: {
    type: String,
    default: null
  },
  escrowRefundedAt: {
    type: Date,
    default: null
  },
  escrowRefundReason: {
    type: String,
    default: null
  },
  escrowDisputedAt: {
    type: Date,
    default: null
  },
  escrowDisputedBy: {
    type: String,
    default: null
  },
  escrowDisputeReason: {
    type: String,
    default: null
  },
  escrowExpiredAt: {
    type: Date,
    default: null
  },
  // Enlaces para clase online
  enlaceReunion: {
    type: String,
    default: null
  },
  // Confirmaciones de ambas partes
  confirmadoPorProfesor: {
    type: Boolean,
    default: false
  },
  confirmadoPorEstudiante: {
    type: Boolean,
    default: false
  },
  // Fechas importantes
  fechaConfirmacion: {
    type: Date,
    default: null
  },
  fechaComplecion: {
    type: Date,
    default: null
  },
  // Notas adicionales
  notasProfesor: {
    type: String,
    trim: true,
    maxLength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  notasEstudiante: {
    type: String,
    trim: true,
    maxLength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  // Sistema de descuentos
  descuento: {
    aplicado: {
      type: Boolean,
      default: false
    },
    porcentaje: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    montoDescuento: {
      type: Number,
      default: 0
    },
    categoria: {
      type: String,
      default: null
    },
    asumidoPor: {
      type: String,
      enum: ['profesor', 'plataforma'],
      default: 'profesor'
    }
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
claseSchema.index({ estudiante: 1 });
claseSchema.index({ profesor: 1 });
claseSchema.index({ fecha: 1 });
claseSchema.index({ estado: 1 });
claseSchema.index({ estadoPago: 1 });
claseSchema.index({ escrowStatus: 1 });
claseSchema.index({ escrowExpiresAt: 1 });
claseSchema.index({ transactionId: 1 });

// Middleware para calcular el total antes de guardar
claseSchema.pre('save', function(next) {
  if (this.isModified('precio') || this.isModified('duracion') || this.isModified('descuento')) {
    const subtotal = this.precio * this.duracion;
    
    // Aplicar descuento si está configurado
    if (this.descuento.aplicado && this.descuento.porcentaje > 0) {
      this.descuento.montoDescuento = (subtotal * this.descuento.porcentaje) / 100;
      this.total = subtotal - this.descuento.montoDescuento;
    } else {
      this.total = subtotal;
      this.descuento.montoDescuento = 0;
    }
  }
  next();
});

// Método para verificar si la clase puede ser cancelada
claseSchema.methods.puedeSerCancelada = function() {
  const ahora = new Date();
  const fechaClase = new Date(this.fecha);
  const horasHastaClase = (fechaClase - ahora) / (1000 * 60 * 60);
  
  return horasHastaClase >= 2 && ['solicitada', 'confirmada'].includes(this.estado);
};

// Método para verificar si la clase puede ser confirmada como completada
claseSchema.methods.puedeSerCompletada = function() {
  const ahora = new Date();
  const fechaClase = new Date(this.fecha);
  
  return ahora >= fechaClase && this.estado === 'confirmada';
};

export default mongoose.model('Clase', claseSchema);