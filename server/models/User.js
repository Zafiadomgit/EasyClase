import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import bcrypt from 'bcryptjs'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('estudiante', 'profesor', 'admin'),
    defaultValue: 'estudiante'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  zonaHoraria: {
    type: DataTypes.STRING(50),
    defaultValue: 'America/Bogota'
  },
  idioma: {
    type: DataTypes.STRING(10),
    defaultValue: 'es'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    defaultValue: 'activo'
  },
  emailVerificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  telefonoVerificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ultimoAcceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preferencias: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12)
      }
    }
  }
})

// Método para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Método para obtener datos públicos (sin contraseña)
User.prototype.toPublicJSON = function() {
  const user = this.toJSON()
  delete user.password
  return user
}

export default User