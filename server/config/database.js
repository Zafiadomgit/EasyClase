import { Sequelize } from 'sequelize';

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'easyclasebd_v2',
  process.env.MYSQL_USER || 'zafiadombd',
  process.env.MYSQL_PASSWORD || 'f9ZrKNH2bNuYT8d',
  {
    host: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Desactivar logging de SQL en producción
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+00:00'
  }
);

// Función para inicializar la base de datos
export const initializeDatabase = async () => {
  try {
    console.log('🔍 Iniciando configuración de MySQL...');
    
    // Verificar variables de entorno
    console.log('🔍 Variables de entorno MySQL:');
    console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
    console.log('MYSQL_USER:', process.env.MYSQL_USER);
    console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***configurado***' : 'NO configurado');
    console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
    console.log('MYSQL_PORT:', process.env.MYSQL_PORT);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***configurado***' : 'NO configurado');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Verificar variables críticas
    if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_HOST) {
      throw new Error('Variables de entorno MySQL no configuradas');
    }
    
    console.log('✅ Variables críticas de MySQL están configuradas');
    
    // Intentar conectar a MySQL
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL (Dreamhost)');
    
    // Importar modelos dinámicamente para evitar problemas de importación circular
    console.log('🔍 Importando modelos...');
    
    // Importar modelos
    await import('../models/User.js');
    await import('../models/Servicio.js');
    await import('../models/Clase.js');
    await import('../models/Transaction.js');
    await import('../models/PerfilEnriquecido.js');
    await import('../models/Review.js');
    
    console.log('✅ Modelos importados correctamente');
    
    // Configurar asociaciones entre modelos
    console.log('🔍 Configurando asociaciones...');
    const { setupAssociations } = await import('./associations.js');
    setupAssociations();
    console.log('✅ Asociaciones configuradas correctamente');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados correctamente');
    
    console.log('🌍 Entorno:', process.env.NODE_ENV);
    console.log('🔗 Base de datos:', process.env.MYSQL_DATABASE);
    
  } catch (error) {
    console.error('❌ Error inicializando Sequelize:', error.message);
    console.error('❌ Stack trace:', error.stack);
    
    // Si es error de mysql2, mostrar instrucción clara
    if (error.message.includes('mysql2')) {
      console.error('❌ ERROR CRÍTICO: mysql2 NO está disponible');
      console.error('❌ El sistema NO puede conectar a MySQL');
      console.error('❌ Usando modelos mock como fallback');
    }
    
    // Crear modelos mock como fallback
    console.log('⚠️ Creando modelos mock como fallback...');
    
    const MockModel = sequelize.define('MockModel', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: Sequelize.STRING,
      email: Sequelize.STRING,
      tipoUsuario: Sequelize.STRING
    });
    
    // Mock de métodos
    MockModel.create = async (data) => {
      console.log('⚠️ MockModel.create() llamado con:', data);
      const mockUser = {
        id: Math.floor(Math.random() * 1000000),
        ...data,
        tipoUsuario: data.tipoUsuario || 'estudiante',
        comparePassword: async () => false,
        toPublicJSON: function() {
          return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            tipoUsuario: this.tipoUsuario
          };
        },
        getPublicProfile: function() {
          return this.toPublicJSON();
        },
        getTeacherProfile: function() {
          return this.toPublicJSON();
        }
      };
      return mockUser;
    };
    
    MockModel.findOne = async (options) => {
      console.log('⚠️ MockModel.findOne() llamado con:', options);
      return null;
    };
    
    MockModel.findByPk = async (id) => {
      console.log('⚠️ MockModel.findByPk() llamado con:', id);
      return null;
    };
    
    // Agregar MockModel a sequelize.models
    sequelize.models.MockModel = MockModel;
    
    console.log('⚠️ Modelos mock creados como fallback');
  }
};

// Inicializar base de datos
initializeDatabase();

// Funciones de utilidad para testing
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    return false;
  }
};

export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Base de datos sincronizada');
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error.message);
    return false;
  }
};

export default sequelize;
