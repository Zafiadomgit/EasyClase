// Verificar dependencias instaladas
console.log('🔍 Verificando dependencias del servidor...')

try {
  const mysql2 = require('mysql2')
  console.log('✅ mysql2 está instalado correctamente')
  console.log('✅ Versión:', mysql2.version)
} catch (error) {
  console.log('❌ mysql2 NO está instalado:', error.message)
}

try {
  const { Sequelize } = require('sequelize')
  console.log('✅ Sequelize está instalado correctamente')
  console.log('✅ Versión:', Sequelize.version)
} catch (error) {
  console.log('❌ Sequelize NO está instalado:', error.message)
}

try {
  const bcrypt = require('bcryptjs')
  console.log('✅ bcryptjs está instalado correctamente')
} catch (error) {
  console.log('❌ bcryptjs NO está instalado:', error.message)
}

console.log('🔍 Verificación de dependencias completada')
