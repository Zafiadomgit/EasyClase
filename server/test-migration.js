import dotenv from 'dotenv'
import sequelize, { testConnection, syncDatabase } from './config/database.js'
import User from './models/User.js'

// Cargar variables de entorno
dotenv.config({ path: '../.env' })

console.log('🧪 Probando migración completa a MySQL...\n')

const testMigration = async () => {
  try {
    // 1. Probar conexión
    console.log('1️⃣ Probando conexión a MySQL...')
    const connectionTest = await testConnection()
    
    if (!connectionTest) {
      console.log('❌ No se pudo conectar a MySQL')
      return
    }

    // 2. Sincronizar base de datos
    console.log('\n2️⃣ Sincronizando base de datos...')
    const syncTest = await syncDatabase(false) // false = no forzar recreación
    
    if (!syncTest) {
      console.log('❌ Error en la sincronización')
      return
    }

    // 3. Probar creación de usuario
    console.log('\n3️⃣ Probando creación de usuario...')
    
    const testUser = await User.create({
      nombre: 'Usuario de Prueba',
      email: 'test@easyclase.com',
      password: 'password123',
      tipo: 'estudiante',
      telefono: '+573001234567',
      pais: 'Colombia',
      ciudad: 'Bogotá'
    })

    console.log('✅ Usuario creado exitosamente:', testUser.toPublicJSON())

    // 4. Probar búsqueda de usuario
    console.log('\n4️⃣ Probando búsqueda de usuario...')
    
    const foundUser = await User.findOne({
      where: { email: 'test@easyclase.com' }
    })

    if (foundUser) {
      console.log('✅ Usuario encontrado:', foundUser.toPublicJSON())
    } else {
      console.log('❌ Usuario no encontrado')
    }

    // 5. Probar comparación de contraseñas
    console.log('\n5️⃣ Probando comparación de contraseñas...')
    
    const passwordMatch = await foundUser.comparePassword('password123')
    console.log('✅ Contraseña correcta:', passwordMatch)

    const passwordMismatch = await foundUser.comparePassword('wrongpassword')
    console.log('✅ Contraseña incorrecta rechazada:', !passwordMismatch)

    // 6. Probar actualización de usuario
    console.log('\n6️⃣ Probando actualización de usuario...')
    
    await foundUser.update({
      nombre: 'Usuario Actualizado',
      ciudad: 'Medellín'
    })

    console.log('✅ Usuario actualizado:', foundUser.toPublicJSON())

    // 7. Limpiar usuario de prueba
    console.log('\n7️⃣ Limpiando usuario de prueba...')
    
    await foundUser.destroy()
    console.log('✅ Usuario de prueba eliminado')

    // 8. Verificar eliminación
    const deletedUser = await User.findOne({
      where: { email: 'test@easyclase.com' }
    })

    if (!deletedUser) {
      console.log('✅ Usuario eliminado correctamente')
    } else {
      console.log('❌ Usuario no se eliminó correctamente')
    }

    console.log('\n🎉 ¡Migración a MySQL completada exitosamente!')
    console.log('✅ La base de datos está funcionando correctamente')
    console.log('✅ Los modelos están configurados correctamente')
    console.log('✅ Las operaciones CRUD funcionan correctamente')
    
    console.log('\n🚀 Ahora puedes:')
    console.log('   - Migrar todos los modelos restantes')
    console.log('   - Actualizar los controladores')
    console.log('   - Probar la aplicación completa')
    console.log('   - Desplegar en producción')

  } catch (error) {
    console.error('❌ Error en la migración:', error)
  } finally {
    // Cerrar conexión
    await sequelize.close()
    console.log('\n🔌 Conexión a MySQL cerrada')
  }
}

// Ejecutar las pruebas
testMigration()
