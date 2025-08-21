import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Información básica
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Tipo de transacción
  type: {
    type: String,
    enum: ['pago_clase', 'retiro_profesor', 'reembolso'],
    required: true
  },
  
  // Estado de la transacción
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'in_process'],
    required: true
  },
  
  // Montos
  amount: {
    type: Number,
    required: true
  },
  
  amountNet: {
    type: Number,
    required: true
  },
  
  commission: {
    type: Number,
    default: 0
  },
  
  currency: {
    type: String,
    default: 'COP'
  },
  
  // Referencias
  claseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clase',
    required: function() {
      return this.type === 'pago_clase';
    }
  },
  
  profesorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'retiro_profesor';
    }
  },
  
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'pago_clase';
    }
  },
  
  // Información de MercadoPago
  mercadoPagoId: {
    type: String,
    required: true
  },
  
  externalReference: {
    type: String,
    required: true
  },
  
  // Información del pagador
  payer: {
    email: String,
    name: String,
    identification: {
      type: String,
      number: String
    }
  },
  
  // Método de pago
  paymentMethod: {
    type: String,
    paymentType: String,
    installments: Number
  },
  
  // Metadata adicional
  metadata: {
    type: Map,
    of: String
  },
  
  // Fechas
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  processedAt: {
    type: Date
  },
  
  // Información de procesamiento
  processingNotes: {
    type: String
  },
  
  // Para reembolsos
  refundReason: {
    type: String
  },
  
  refundAmount: {
    type: Number
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ mercadoPagoId: 1 });
transactionSchema.index({ externalReference: 1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ profesorId: 1, createdAt: -1 });
transactionSchema.index({ estudianteId: 1, createdAt: -1 });
transactionSchema.index({ claseId: 1 });

// Métodos estáticos
transactionSchema.statics.findByMercadoPagoId = function(mercadoPagoId) {
  return this.findOne({ mercadoPagoId });
};

transactionSchema.statics.findByExternalReference = function(externalReference) {
  return this.findOne({ externalReference });
};

transactionSchema.statics.findByClaseId = function(claseId) {
  return this.find({ claseId }).sort({ createdAt: -1 });
};

transactionSchema.statics.findByProfesorId = function(profesorId, limit = 50) {
  return this.find({ profesorId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

transactionSchema.statics.findByEstudianteId = function(estudianteId, limit = 50) {
  return this.find({ estudianteId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Métodos de instancia
transactionSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.updatedAt = new Date();
  
  if (newStatus === 'approved' || newStatus === 'rejected' || newStatus === 'cancelled') {
    this.processedAt = new Date();
  }
  
  if (notes) {
    this.processingNotes = notes;
  }
  
  return this.save();
};

transactionSchema.methods.addMetadata = function(key, value) {
  if (!this.metadata) {
    this.metadata = new Map();
  }
  this.metadata.set(key, value);
  return this.save();
};

// Middleware para actualizar updatedAt
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual para calcular el porcentaje de comisión
transactionSchema.virtual('commissionPercentage').get(function() {
  if (this.amount === 0) return 0;
  return (this.commission / this.amount) * 100;
});

// Configurar virtuals en JSON
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
