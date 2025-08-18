import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  clase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clase',
    required: [true, 'La clase es obligatoria']
  },
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
  calificacion: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  comentario: {
    type: String,
    required: [true, 'El comentario es obligatorio'],
    trim: true,
    minLength: [10, 'El comentario debe tener al menos 10 caracteres'],
    maxLength: [500, 'El comentario no puede exceder 500 caracteres']
  },
  aspectos: {
    puntualidad: {
      type: Number,
      min: 1,
      max: 5
    },
    claridad: {
      type: Number,
      min: 1,
      max: 5
    },
    paciencia: {
      type: Number,
      min: 1,
      max: 5
    },
    conocimiento: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  recomendaria: {
    type: Boolean,
    default: true
  },
  // Respuesta del profesor (opcional)
  respuestaProfesor: {
    comentario: String,
    fecha: Date
  }
}, {
  timestamps: true
});

// Índices
reviewSchema.index({ profesor: 1 });
reviewSchema.index({ estudiante: 1 });
reviewSchema.index({ clase: 1 }, { unique: true }); // Una reseña por clase
reviewSchema.index({ calificacion: -1 });

// Método para obtener reseña pública
reviewSchema.methods.getPublicReview = function() {
  const review = this.toObject();
  return {
    ...review,
    estudiante: {
      nombre: review.estudiante.nombre,
      // No incluir datos sensibles del estudiante
    }
  };
};

export default mongoose.model('Review', reviewSchema);