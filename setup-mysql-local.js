import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

console.log('🚀 Configurando MySQL local para EasyClase...\n')

const setupLocalMySQL = async () => {
  try {
    console.log('1️⃣ Conectando a MySQL local...')
    
    // Conectar sin especificar base de datos
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    })

    console.log('✅ Conexión a MySQL local exitosa')
    
    // Crear base de datos si no existe
    console.log('\n2️⃣ Creando base de datos local...')
    await connection.execute('CREATE DATABASE IF NOT EXISTS easyclase_local')
    console.log('✅ Base de datos easyclase_local creada/verificada')
    
    // Usar la base de datos
    await connection.execute('USE easyclase_local')
    console.log('✅ Base de datos easyclase_local seleccionada')
    
    // Verificar tablas existentes
    console.log('\n3️⃣ Verificando tablas existentes...')
    const [tables] = await connection.execute('SHOW TABLES')
    
    if (tables.length > 0) {
      console.log('📋 Tablas existentes:')
      tables.forEach(table => {
        console.log('   -', Object.values(table)[0])
      })
    } else {
      console.log('📋 No hay tablas (base de datos vacía)')
    }
    
    // Cerrar conexión
    await connection.end()
    console.log('\n🔌 Conexión cerrada')
    
    console.log('\n🎉 ¡MySQL local configurado exitosamente!')
    console.log('✅ Base de datos: easyclase_local')
    console.log('✅ Usuario: root (sin contraseña)')
    console.log('✅ Host: localhost:3306')
    
    console.log('\n🚀 Ahora puedes:')
    console.log('   1. Ejecutar la migración de modelos')
    console.log('   2. Probar la aplicación localmente')
    console.log('   3. Desplegar en producción más tarde')
    
    return true
    
  } catch (error) {
    console.error('❌ Error configurando MySQL local:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 MySQL no está ejecutándose. Necesitas:')
      console.log('   1. Instalar XAMPP desde: https://www.apachefriends.org/')
      console.log('   2. Iniciar MySQL desde el panel de control de XAMPP')
      console.log('   3. O instalar MySQL directamente')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 Error de acceso. Verifica:')
      console.log('   1. Que MySQL esté ejecutándose')
      console.log('   2. Que el usuario root no tenga contraseña')
      console.log('   3. O configura una contraseña en el .env')
    }
    
    return false
  }
}

// Ejecutar configuración
setupLocalMySQL()
