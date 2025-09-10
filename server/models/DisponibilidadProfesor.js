import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DisponibilidadProfesor = sequelize.define('DisponibilidadProfesor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  diaSemana: {
    type: DataTypes.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    allowNull: false
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  horaFin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Configuración adicional
  duracionClase: {
    type: DataTypes.INTEGER, // en minutos
    defaultValue: 60
  },
  tiempoEntreClases: {
    type: DataTypes.INTEGER, // en minutos
    defaultValue: 15
  },
  // Metadatos
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'disponibilidad_profesores',
  timestamps: true,
  indexes: [
    {
      fields: ['profesor']
    },
    {
      fields: ['diaSemana']
    },
    {
      fields: ['activo']
    }
  ]
});

// Métodos de instancia
DisponibilidadProfesor.prototype.getPublicData = function() {
  return {
    id: this.id,
    profesor: this.profesor,
    diaSemana: this.diaSemana,
    horaInicio: this.horaInicio,
    horaFin: this.horaFin,
    activo: this.activo,
    duracionClase: this.duracionClase,
    tiempoEntreClases: this.tiempoEntreClases,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default DisponibilidadProfesor;
