import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '../../.env' })

// Verificar que mysql2 esté disponible
let sequelize = null

try {
  console.log('🔍 Iniciando configuración de MySQL...')
  console.log('🔍 Variables de entorno MySQL:')
  console.log('  MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'default')
  console.log('  MYSQL_USER:', process.env.MYSQL_USER || 'default')
  console.log('  MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***configurado***' : 'no configurado')
  console.log('  MYSQL_HOST:', process.env.MYSQL_HOST || 'default')
  console.log('  MYSQL_PORT:', process.env.MYSQL_PORT || 'default')
  console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***configurado***' : 'no configurado')
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'no configurado')
  
  // Verificar si las variables críticas están disponibles
  if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_HOST) {
    console.log('❌ Variables críticas de MySQL NO están configuradas')
    console.log('❌ Usando configuración por defecto o mock')
    console.log('❌ MYSQL_DATABASE presente:', !!process.env.MYSQL_DATABASE)
    console.log('❌ MYSQL_USER presente:', !!process.env.MYSQL_USER)
    console.log('❌ MYSQL_PASSWORD presente:', !!process.env.MYSQL_PASSWORD)
    console.log('❌ MYSQL_HOST presente:', !!process.env.MYSQL_HOST)
  } else {
    console.log('✅ Variables críticas de MySQL están configuradas')
    console.log('✅ Intentando conectar a MySQL...')
  }
  
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
  
  console.log('✅ Sequelize inicializado correctamente')
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
      console.log(`⚠️ Usando modelo mock para: ${modelName}`)
      console.log(`⚠️ Atributos del modelo:`, Object.keys(attributes))
      
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
        toPublicJSON: function() { return {} },
        getPublicProfile: function() { return this.toPublicJSON() },
        getTeacherProfile: function() { return this.toPublicJSON() }
      }
      
      // Agregar métodos estáticos si es necesario
      MockModel.findOne = async (options) => {
        console.log('⚠️ MockModel.findOne() llamado con:', options)
        // Simular que no hay usuarios existentes
        return null
      }
      MockModel.findAll = async () => []
      MockModel.create = async (data) => {
        console.log('⚠️ MockModel.create() llamado con:', data)
        // Crear un objeto mock que simule un usuario creado
        const mockUser = {
          id: Math.floor(Math.random() * 1000000),
          ...data,
          tipoUsuario: data.tipoUsuario || 'estudiante',
          comparePassword: async () => false,
          toPublicJSON: function() { 
            const user = { ...this }
            delete user.password
            return user
          },
          getPublicProfile: function() { return this.toPublicJSON() },
          getTeacherProfile: function() { return this.toPublicJSON() }
        }
        return mockUser
      }
      MockModel.update = async () => {}
      MockModel.destroy = async () => {}
      MockModel.findByPk = async (id) => {
        console.log('⚠️ MockModel.findByPk() llamado con:', id)
        return null
      }
      
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
