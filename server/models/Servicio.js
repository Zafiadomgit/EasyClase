import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Servicio = sequelize.define('Servicio', {
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
      len: [1, 2000]
    }
  },
  categoria: {
    type: DataTypes.ENUM(
      'Tesis y Trabajos Académicos',
      'Desarrollo Web',
      'Desarrollo de Apps',
      'Diseño Gráfico',
      'Marketing Digital',
      'Consultoría de Negocios',
      'Traducción',
      'Redacción de Contenido',
      'Asesoría Legal',
      'Contabilidad y Finanzas',
      'Fotografía',
      'Video y Edición',
      'Arquitectura y Diseño',
      'Ingeniería',
      'Otros'
    ),
    allowNull: false
  },
  subcategoria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 10
    }
  },
  tiempoPrevisto_valor: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tiempoPrevisto_unidad: {
    type: DataTypes.ENUM('horas', 'días', 'semanas', 'meses'),
    allowNull: false
  },
  modalidad: {
    type: DataTypes.ENUM('presencial', 'virtual', 'mixta'),
    allowNull: false
  },
  proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Requisitos específicos para el servicio
  requisitos: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Entregables del servicio
  entregables: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Tecnologías o herramientas que usa
  tecnologias: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Portfolio o ejemplos de trabajos anteriores
  portfolio: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Estado del servicio
  estado: {
    type: DataTypes.ENUM('activo', 'pausado', 'inactivo'),
    defaultValue: 'activo'
  },
  // Nivel de experiencia requerido del cliente
  nivelCliente: {
    type: DataTypes.ENUM('principiante', 'intermedio', 'avanzado', 'cualquiera'),
    defaultValue: 'cualquiera'
  },
  // Número de revisiones incluidas
  revisionesIncluidas: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    validate: {
      min: 0
    }
  },
  // Si es un servicio premium
  premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Calificaciones del servicio
  calificacionPromedio: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Contador de servicios vendidos
  totalVentas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Etiquetas para búsqueda
  etiquetas: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Preguntas frecuentes sobre el servicio
  faq: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Disponibilidad
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Fecha límite para solicitar el servicio
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'servicios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['categoria']
    },
    {
      fields: ['proveedor']
    },
    {
      fields: ['estado']
    },
    {
      fields: ['calificacionPromedio']
    },
    {
      fields: ['precio']
    }
  ]
});

// Métodos de instancia
Servicio.prototype.calcularComision = async function() {
  // Obtener el usuario proveedor para verificar si es premium
  const User = sequelize.models.User;
  const proveedor = await User.findByPk(this.proveedor);
  const esPremium = proveedor?.premium || false;
  
  // Comisión: 15% para premium, 20% para usuarios regulares
  const porcentajeComision = esPremium ? 0.15 : 0.20;
  return parseFloat(this.precio) * porcentajeComision;
};

Servicio.prototype.calcularPrecioFinal = async function() {
  const comision = await this.calcularComision();
  return parseFloat(this.precio) - comision;
};

// Método para obtener datos públicos del servicio
Servicio.prototype.getPublicData = async function() {
  const servicio = this.toJSON();
  const comision = await this.calcularComision();
  const precioFinal = await this.calcularPrecioFinal();
  
  return {
    ...servicio,
    comision,
    precioFinal,
    esPremium: this.premium || false
  };
};

// Métodos estáticos
Servicio.findByCategoria = function(categoria) {
  return this.findAll({ where: { categoria } });
};

Servicio.findByProveedor = function(proveedorId) {
  return this.findAll({ where: { proveedor: proveedorId } });
};

Servicio.findByEstado = function(estado) {
  return this.findAll({ where: { estado } });
};

Servicio.findByPrecio = function(precioMin, precioMax) {
  return this.findAll({
    where: {
      precio: {
        [sequelize.Op.between]: [precioMin, precioMax]
      }
    }
  });
};

export default Servicio;
