import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Clase = sequelize.define('Clase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  materia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaInicio: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 8
    }
  },
  modalidad: {
    type: DataTypes.ENUM('online', 'presencial'),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 5000
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('solicitada', 'confirmada', 'rechazada', 'completada', 'cancelada'),
    defaultValue: 'solicitada'
  },
  // Información de pago
  pagoId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estadoPago: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'reembolsado', 'liberado'),
    defaultValue: 'pendiente'
  },
  montoPagado: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transactions',
      key: 'id'
    }
  },
  // Sistema de Escrow
  escrowStatus: {
    type: DataTypes.ENUM('pending', 'released', 'refunded', 'disputed', 'expired'),
    allowNull: true
  },
  escrowCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escrowExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escrowReleasedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escrowReleasedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  escrowRefundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escrowRefundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  escrowDisputedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  escrowDisputedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  escrowDisputeReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  escrowExpiredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Enlaces para clase online
  enlaceReunion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Confirmaciones de ambas partes
  confirmadoPorProfesor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  confirmadoPorEstudiante: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Fechas importantes
  fechaConfirmacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaComplecion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Notas adicionales
  notasProfesor: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  notasEstudiante: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  // Sistema de descuentos
  descuento_aplicado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  descuento_porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  descuento_montoDescuento: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  descuento_categoria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descuento_asumidoPor: {
    type: DataTypes.ENUM('profesor', 'plataforma'),
    defaultValue: 'profesor'
  }
}, {
  tableName: 'clases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (clase) => {
      // Calcular total antes de crear
      if (clase.precio && clase.duracion) {
        const subtotal = parseFloat(clase.precio) * clase.duracion;
        
        if (clase.descuento_aplicado && clase.descuento_porcentaje > 0) {
          clase.descuento_montoDescuento = (subtotal * parseFloat(clase.descuento_porcentaje)) / 100;
          clase.total = subtotal - parseFloat(clase.descuento_montoDescuento);
        } else {
          clase.total = subtotal;
          clase.descuento_montoDescuento = 0;
        }
      }
    },
    beforeUpdate: async (clase) => {
      // Calcular total antes de actualizar
      if (clase.changed('precio') || clase.changed('duracion') || clase.changed('descuento_aplicado') || clase.changed('descuento_porcentaje')) {
        const subtotal = parseFloat(clase.precio || clase.previous('precio')) * (clase.duracion || clase.previous('duracion'));
        
        if (clase.descuento_aplicado && clase.descuento_porcentaje > 0) {
          clase.descuento_montoDescuento = (subtotal * parseFloat(clase.descuento_porcentaje)) / 100;
          clase.total = subtotal - parseFloat(clase.descuento_montoDescuento);
        } else {
          clase.total = subtotal;
          clase.descuento_montoDescuento = 0;
        }
      }
    }
  }
});

// Métodos de instancia
Clase.prototype.puedeSerCancelada = function() {
  const ahora = new Date();
  const fechaClase = new Date(this.fecha);
  const horasHastaClase = (fechaClase - ahora) / (1000 * 60 * 60);
  
  return horasHastaClase >= 2 && ['solicitada', 'confirmada'].includes(this.estado);
};

Clase.prototype.puedeSerCompletada = function() {
  const ahora = new Date();
  const fechaClase = new Date(this.fecha);
  
  return ahora >= fechaClase && this.estado === 'confirmada';
};

// Métodos estáticos
Clase.findByEstudiante = function(estudianteId) {
  return this.findAll({ where: { estudiante: estudianteId } });
};

Clase.findByProfesor = function(profesorId) {
  return this.findAll({ where: { profesor: profesorId } });
};

Clase.findByEstado = function(estado) {
  return this.findAll({ where: { estado } });
};

Clase.findByEstadoPago = function(estadoPago) {
  return this.findAll({ where: { estadoPago } });
};

Clase.findByEscrowStatus = function(escrowStatus) {
  return this.findAll({ where: { escrowStatus } });
};

export default Clase;