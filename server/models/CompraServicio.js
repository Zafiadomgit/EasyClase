import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CompraServicio = sequelize.define('CompraServicio', {
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
  servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id'
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'reembolsado'),
    defaultValue: 'pendiente'
  },
  // Información de pago
  pagoId: {
    type: DataTypes.STRING,
    allowNull: true
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
  // Información de acceso
  fechaAcceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaExpiracion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Metadatos
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'compras_servicios',
  timestamps: true,
  indexes: [
    {
      fields: ['estudiante']
    },
    {
      fields: ['servicio']
    },
    {
      fields: ['estado']
    }
  ]
});

// Métodos de instancia
CompraServicio.prototype.getPublicData = function() {
  return {
    id: this.id,
    estudiante: this.estudiante,
    servicio: this.servicio,
    precio: this.precio,
    estado: this.estado,
    fechaPago: this.fechaPago,
    fechaAcceso: this.fechaAcceso,
    fechaExpiracion: this.fechaExpiracion,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default CompraServicio;
