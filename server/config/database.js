import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '../../.env' })

// Verificar que mysql2 esté disponible
let sequelize = null

try {
  // Configuración de la base de datos MySQL
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'easyclasebd_v2',
    process.env.MYSQL_USER || 'zafiadombd',
    process.env.MYSQL_PASSWORD || 'tu_contraseña_aqui',
    {
      host: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
      port: process.env.MYSQL_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  )
} catch (error) {
  console.error('❌ Error inicializando Sequelize:', error.message)
  
  // Si es error de mysql2, mostrar instrucción clara
  if (error.message.includes('mysql2')) {
    console.error('💡 SOLUCIÓN: Instalar mysql2 con: npm install mysql2')
    console.error('💡 O verificar que esté en package.json')
  }
  
  // Crear un objeto mock más completo para evitar crash
  sequelize = {
    authenticate: async () => { throw new Error('MySQL no disponible - mysql2 no instalado') },
    sync: async () => { throw new Error('MySQL no disponible - mysql2 no instalado') },
    define: (modelName, attributes, options) => {
      // Crear un modelo mock con prototipo básico
      const MockModel = function() {}
      MockModel.prototype = {
        sync: async () => {},
        findOne: async () => null,
        findAll: async () => [],
        create: async () => {},
        update: async () => {},
        destroy: async () => {},
        comparePassword: async () => false,
        toPublicJSON: function() { return {} }
      }
      
      // Agregar métodos estáticos si es necesario
      MockModel.findOne = async () => null
      MockModel.findAll = async () => []
      MockModel.create = async () => {}
      MockModel.update = async () => {}
      MockModel.destroy = async () => {}
      
      return MockModel
    },
    transaction: async () => ({
      commit: async () => {},
      rollback: async () => {}
    })
  }
}

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a MySQL establecida correctamente')
    return true
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message)
    return false
  }
}

// Función para sincronizar los modelos
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force })
    console.log('✅ Base de datos sincronizada correctamente')
    return true
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error.message)
    return false
  }
}

export default sequelize
