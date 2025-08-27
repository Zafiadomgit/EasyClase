import dotenv from 'dotenv'
import { testConnection, syncDatabase } from './config/database.js'

// Cargar variables de entorno
dotenv.config({ path: '../.env' })

console.log('🧪 Probando conexión a MySQL...\n')

console.log('📊 Configuración de base de datos:')
console.log('Host:', process.env.MYSQL_HOST)
console.log('Usuario:', process.env.MYSQL_USER)
console.log('Base de datos:', process.env.MYSQL_DATABASE)
console.log('Puerto:', process.env.MYSQL_PORT)
console.log('')

// Probar conexión
console.log('1️⃣ Probando conexión...')
const connectionTest = await testConnection()

if (connectionTest) {
  console.log('\n2️⃣ Probando sincronización...')
  const syncTest = await syncDatabase(false) // false = no forzar recreación
  
  if (syncTest) {
    console.log('\n🎉 ¡Conexión a MySQL exitosa!')
    console.log('✅ La base de datos está lista para usar')
    console.log('\n💡 Ahora puedes:')
    console.log('   - Crear las tablas necesarias')
    console.log('   - Migrar datos existentes')
    console.log('   - Probar la aplicación completa')
  } else {
    console.log('\n❌ Error en la sincronización de la base de datos')
  }
} else {
  console.log('\n❌ No se pudo conectar a MySQL')
  console.log('\n🔧 Verifica:')
  console.log('   - Que la contraseña esté correcta en .env')
  console.log('   - Que el hostname esté activo (puede tomar algunas horas)')
  console.log('   - Que las credenciales sean correctas')
}
