import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Información básica
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  // Tipo de transacción
  type: {
    type: DataTypes.ENUM('pago_clase', 'retiro_profesor', 'reembolso'),
    allowNull: false
  },
  
  // Estado de la transacción
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'in_process'),
    allowNull: false
  },
  
  // Montos
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  amountNet: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'COP'
  },
  
  // Referencias
  claseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'clases',
      key: 'id'
    }
  },
  
  profesorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  estudianteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Información de MercadoPago
  mercadoPagoId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  externalReference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Información del pagador
  payer_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  payer_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  payer_identification_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  payer_identification_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  
  // Método de pago
  paymentMethod_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  paymentMethod_paymentType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  paymentMethod_installments: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // Metadata adicional
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  // Fechas
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Información de procesamiento
  processingNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Para reembolsos
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeUpdate: async (transaction) => {
      transaction.updated_at = new Date();
      
      if (['approved', 'rejected', 'cancelled'].includes(transaction.status)) {
        transaction.processedAt = new Date();
      }
    }
  }
});

// Métodos estáticos
Transaction.findByMercadoPagoId = function(mercadoPagoId) {
  return this.findOne({ where: { mercadoPagoId } });
};

Transaction.findByExternalReference = function(externalReference) {
  return this.findOne({ where: { externalReference } });
};

Transaction.findByClaseId = function(claseId) {
  return this.findAll({ 
    where: { claseId },
    order: [['created_at', 'DESC']]
  });
};

Transaction.findByProfesorId = function(profesorId, limit = 50) {
  return this.findAll({
    where: { profesorId },
    order: [['created_at', 'DESC']],
    limit
  });
};

Transaction.findByEstudianteId = function(estudianteId, limit = 50) {
  return this.findAll({
    where: { estudianteId },
    order: [['created_at', 'DESC']],
    limit
  });
};

// Métodos de instancia
Transaction.prototype.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.updated_at = new Date();
  
  if (['approved', 'rejected', 'cancelled'].includes(newStatus)) {
    this.processedAt = new Date();
  }
  
  if (notes) {
    this.processingNotes = notes;
  }
  
  return this.save();
};

Transaction.prototype.addMetadata = function(key, value) {
  if (!this.metadata) {
    this.metadata = {};
  }
  this.metadata[key] = value;
  return this.save();
};

// Virtual para calcular el porcentaje de comisión
Transaction.prototype.getCommissionPercentage = function() {
  if (parseFloat(this.amount) === 0) return 0;
  return (parseFloat(this.commission) / parseFloat(this.amount)) * 100;
};

export default Transaction;
