import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '../../.env' })

// Configuración de la base de datos MySQL
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'easyclasebd',
  process.env.MYSQL_USER || 'zafiadom',
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
