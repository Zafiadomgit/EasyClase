import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PerfilEnriquecido = sequelize.define('PerfilEnriquecido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Intereses del usuario
  intereses: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  // Objetivos de aprendizaje
  objetivos: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  // Preferencias de aprendizaje
  preferenciasAprendizaje: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  // Historial y métricas
  historialBusquedas: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  clasesTomadas: {
    type: DataTypes.JSON,
    allowNull: true
  },
  
  // Sugerencias personalizadas
  sugerenciasActualizadas: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  // Configuración de privacidad
  configuracionPrivacidad: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'perfiles_enriquecidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['usuario']
    },
    {
      fields: ['sugerenciasActualizadas']
    }
  ]
});

// Método para generar sugerencias personalizadas
PerfilEnriquecido.prototype.generarSugerencias = async function() {
  const Clase = sequelize.models.Clase;
  const User = sequelize.models.User;
  
  const sugerencias = [];
  
  // Sugerencias basadas en intereses
  if (this.intereses) {
    for (const interes of this.intereses) {
      const clasesRelacionadas = await Clase.findAll({
        where: {
          materia: interes.categoria,
          estado: 'activa'
        },
        limit: 3,
        include: [{
          model: User,
          as: 'profesor',
          attributes: ['nombre', 'calificacionPromedio']
        }]
      });
      
      if (clasesRelacionadas.length > 0) {
        sugerencias.push({
          tipo: 'interes',
          categoria: interes.categoria,
          clases: clasesRelacionadas,
          razon: `Te interesa ${interes.categoria.toLowerCase()}`
        });
      }
    }
  }
  
  // Sugerencias basadas en objetivos activos
  if (this.objetivos) {
    const objetivosActivos = this.objetivos.filter(obj => obj.estado === 'activo');
    
    for (const objetivo of objetivosActivos) {
      const clasesRelacionadas = await Clase.findAll({
        where: {
          materia: objetivo.categoria,
          estado: 'activa'
        },
        limit: 2,
        include: [{
          model: User,
          as: 'profesor',
          attributes: ['nombre', 'calificacionPromedio']
        }]
      });
      
      if (clasesRelacionadas.length > 0) {
        sugerencias.push({
          tipo: 'objetivo',
          categoria: objetivo.categoria,
          clases: clasesRelacionadas,
          razon: `Para tu objetivo: ${objetivo.titulo}`
        });
      }
    }
  }
  
  return sugerencias;
};

// Método para actualizar progreso de objetivos
PerfilEnriquecido.prototype.actualizarProgresoObjetivo = function(objetivoId, nuevoProgreso) {
  if (this.objetivos) {
    const objetivo = this.objetivos.find(obj => obj.id === objetivoId);
    if (objetivo) {
      objetivo.progreso = Math.min(100, Math.max(0, nuevoProgreso));
      if (objetivo.progreso === 100) {
        objetivo.estado = 'completado';
      }
      return this.save();
    }
  }
  return Promise.reject(new Error('Objetivo no encontrado'));
};

// Método para registrar actividad de búsqueda
PerfilEnriquecido.prototype.registrarBusqueda = function(categoria, termino) {
  if (!this.historialBusquedas) {
    this.historialBusquedas = [];
  }
  
  this.historialBusquedas.push({
    categoria,
    termino,
    fecha: new Date()
  });
  
  // Mantener solo las últimas 50 búsquedas
  if (this.historialBusquedas.length > 50) {
    this.historialBusquedas = this.historialBusquedas.slice(-50);
  }
  
  return this.save();
};

// Métodos estáticos
PerfilEnriquecido.findByUsuario = function(usuarioId) {
  return this.findOne({ where: { usuario: usuarioId } });
};

PerfilEnriquecido.findByInteres = function(categoria) {
  return this.findAll({
    where: sequelize.literal(`JSON_CONTAINS(intereses, '{"categoria": "${categoria}"}')`)
  });
};

export default PerfilEnriquecido;
