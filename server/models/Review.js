import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clase: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'clases',
      key: 'id'
    }
  },
  estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  },
  aspectos: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recomendaria: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Respuesta del profesor (opcional)
  respuestaProfesor_comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  respuestaProfesor_fecha: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['profesor']
    },
    {
      fields: ['estudiante']
    },
    {
      fields: ['clase'],
      unique: true
    },
    {
      fields: ['calificacion']
    }
  ]
});

// Método para obtener reseña pública
Review.prototype.getPublicReview = function() {
  const review = this.toJSON();
  return {
    ...review,
    estudiante: {
      nombre: review.estudiante?.nombre,
      // No incluir datos sensibles del estudiante
    }
  };
};

// Métodos estáticos
Review.findByProfesor = function(profesorId) {
  return this.findAll({ where: { profesor: profesorId } });
};

Review.findByEstudiante = function(estudianteId) {
  return this.findAll({ where: { estudiante: estudianteId } });
};

Review.findByClase = function(claseId) {
  return this.findOne({ where: { clase: claseId } });
};

Review.findByCalificacion = function(calificacion) {
  return this.findAll({ where: { calificacion } });
};

Review.findByCalificacionRange = function(min, max) {
  return this.findAll({
    where: {
      calificacion: {
        [sequelize.Op.between]: [min, max]
      }
    }
  });
};

// Método para calcular calificación promedio de un profesor
Review.calcularCalificacionPromedio = async function(profesorId) {
  const result = await this.findOne({
    where: { profesor: profesorId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('calificacion')), 'promedio'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'total']
    ]
  });
  
  return {
    promedio: parseFloat(result?.dataValues?.promedio || 0),
    total: parseInt(result?.dataValues?.total || 0)
  };
};

export default Review;