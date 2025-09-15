import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PlantillaClase = sequelize.define('PlantillaClase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000]
    }
  },
  materia: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('individual', 'grupal'),
    allowNull: false,
    defaultValue: 'individual'
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 10
    }
  },
  duracion: {
    type: DataTypes.INTEGER, // en horas
    allowNull: false,
    validate: {
      min: 1,
      max: 8
    }
  },
  maxEstudiantes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 20
    }
  },
  modalidad: {
    type: DataTypes.ENUM('online', 'presencial'),
    allowNull: false,
    defaultValue: 'online'
  },
  requisitos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objetivos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activa', 'inactiva', 'pausada'),
    allowNull: false,
    defaultValue: 'activa'
  },
  // Metadatos
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'plantillas_clases',
  timestamps: true,
  indexes: [
    {
      fields: ['profesor']
    },
    {
      fields: ['categoria']
    },
    {
      fields: ['estado']
    }
  ]
});

// Métodos de instancia
PlantillaClase.prototype.getPublicData = function() {
  return {
    id: this.id,
    titulo: this.titulo,
    descripcion: this.descripcion,
    materia: this.materia,
    categoria: this.categoria,
    profesor: this.profesor,
    tipo: this.tipo,
    precio: this.precio,
    duracion: this.duracion,
    maxEstudiantes: this.maxEstudiantes,
    modalidad: this.modalidad,
    requisitos: this.requisitos,
    objetivos: this.objetivos,
    estado: this.estado,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default PlantillaClase;
