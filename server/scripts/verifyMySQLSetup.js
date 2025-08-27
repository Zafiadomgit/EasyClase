import dotenv from 'dotenv';
import sequelize, { testConnection } from '../config/database.js';

// Cargar variables de entorno
dotenv.config({ path: '../../.env' });

console.log('🔍 Verificando configuración de MySQL...\n');

const verifySetup = async () => {
  try {
    // 1. Verificar variables de entorno
    console.log('1️⃣ Verificando variables de entorno...');
    
    const requiredVars = [
      'MYSQL_HOST',
      'MYSQL_USER',
      'MYSQL_PASSWORD',
      'MYSQL_DATABASE',
      'MYSQL_PORT'
    ];

    const missingVars = [];
    const config = {};

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        missingVars.push(varName);
      } else {
        config[varName] = varName === 'MYSQL_PASSWORD' ? '***' : value;
      }
    });

    if (missingVars.length > 0) {
      console.log('❌ Variables faltantes:', missingVars);
      console.log('🔧 Configura estas variables en tu archivo .env');
      return;
    }

    console.log('✅ Todas las variables de entorno están configuradas');
    console.log('📊 Configuración actual:');
    Object.entries(config).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // 2. Verificar conexión
    console.log('\n2️⃣ Probando conexión a MySQL...');
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
      console.log('❌ No se pudo conectar a MySQL');
      console.log('\n🔧 Verifica:');
      console.log('   - Que la contraseña sea correcta');
      console.log('   - Que el hostname esté activo');
      console.log('   - Que las credenciales sean válidas');
      return;
    }

    console.log('✅ Conexión a MySQL exitosa');

    // 3. Verificar base de datos
    console.log('\n3️⃣ Verificando base de datos...');
    
    try {
      const [results] = await sequelize.query('SELECT DATABASE() as current_db');
      const currentDb = results[0].current_db;
      console.log(`✅ Base de datos actual: ${currentDb}`);
      
      if (currentDb === process.env.MYSQL_DATABASE) {
        console.log('✅ Base de datos correcta seleccionada');
      } else {
        console.log('⚠️  Base de datos diferente a la configurada');
      }
    } catch (error) {
      console.log('❌ Error verificando base de datos:', error.message);
    }

    // 4. Verificar tablas existentes
    console.log('\n4️⃣ Verificando tablas existentes...');
    
    try {
      const [tables] = await sequelize.query('SHOW TABLES');
      const tableNames = tables.map(row => Object.values(row)[0]);
      
      if (tableNames.length === 0) {
        console.log('📝 No hay tablas creadas aún');
        console.log('💡 Ejecuta "npm run migrate-mysql" para crear las tablas');
      } else {
        console.log(`✅ Tablas encontradas: ${tableNames.length}`);
        tableNames.forEach(table => console.log(`   - ${table}`));
      }
    } catch (error) {
      console.log('❌ Error verificando tablas:', error.message);
    }

    // 5. Verificar permisos de usuario
    console.log('\n5️⃣ Verificando permisos de usuario...');
    
    try {
      const [privileges] = await sequelize.query(`
        SELECT 
          TABLE_SCHEMA,
          PRIVILEGE_TYPE 
        FROM information_schema.SCHEMA_PRIVILEGES 
        WHERE GRANTEE = ?
      `, {
        replacements: [`'${process.env.MYSQL_USER}'@'%'`]
      });

      const hasCreate = privileges.some(p => p.PRIVILEGE_TYPE === 'CREATE');
      const hasAlter = privileges.some(p => p.PRIVILEGE_TYPE === 'ALTER');
      const hasDrop = privileges.some(p => p.PRIVILEGE_TYPE === 'DROP');

      console.log('📋 Permisos del usuario:');
      console.log(`   - CREATE: ${hasCreate ? '✅' : '❌'}`);
      console.log(`   - ALTER: ${hasAlter ? '✅' : '❌'}`);
      console.log(`   - DROP: ${hasDrop ? '✅' : '❌'}`);

      if (!hasCreate || !hasAlter || !hasDrop) {
        console.log('\n⚠️  El usuario no tiene todos los permisos necesarios');
        console.log('🔧 Contacta al administrador de Dreamhost para obtener permisos completos');
      } else {
        console.log('✅ Usuario tiene todos los permisos necesarios');
      }
    } catch (error) {
      console.log('❌ Error verificando permisos:', error.message);
    }

    console.log('\n🎉 Verificación completada');
    console.log('\n📋 Resumen:');
    console.log('✅ Variables de entorno configuradas');
    console.log('✅ Conexión a MySQL exitosa');
    console.log('✅ Base de datos accesible');
    
    if (tableNames && tableNames.length > 0) {
      console.log('✅ Tablas existentes verificadas');
    } else {
      console.log('📝 No hay tablas (normal para nueva instalación)');
    }

    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Ejecutar "npm run migrate-mysql" para crear tablas');
    console.log('   2. Configurar variables en Vercel');
    console.log('   3. Hacer deploy de la aplicación');

  } catch (error) {
    console.error('❌ Error en la verificación:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
};

// Ejecutar verificación
verifySetup();
