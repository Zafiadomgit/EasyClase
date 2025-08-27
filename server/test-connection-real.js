import { Sequelize } from 'sequelize';

// Configuración directa con credenciales reales para pruebas
const sequelize = new Sequelize(
  'easyclasebd_v2',
  'zafiadombd',
  'f9ZrKNH2bNuYT8d',
  {
    host: 'mysql.easyclaseapp.com',
    port: 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

console.log('🔍 Probando conexión directa a MySQL de Dreamhost...\n');

const testRealConnection = async () => {
  try {
    // 1. Probar conexión
    console.log('1️⃣ Probando conexión...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MySQL de Dreamhost!');
    
    // 2. Verificar base de datos
    console.log('\n2️⃣ Verificando base de datos...');
    const [results] = await sequelize.query('SELECT DATABASE() as current_db');
    const currentDb = results[0].current_db;
    console.log(`✅ Base de datos actual: ${currentDb}`);
    
    // 3. Verificar tablas existentes
    console.log('\n3️⃣ Verificando tablas existentes...');
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    if (tableNames.length === 0) {
      console.log('📝 No hay tablas creadas aún (normal para nueva instalación)');
    } else {
      console.log(`✅ Tablas encontradas: ${tableNames.length}`);
      tableNames.forEach(table => console.log(`   - ${table}`));
    }
    
    // 4. Verificar permisos del usuario
    console.log('\n4️⃣ Verificando permisos del usuario...');
    const [privileges] = await sequelize.query(`
      SELECT 
        PRIVILEGE_TYPE 
      FROM information_schema.SCHEMA_PRIVILEGES 
      WHERE GRANTEE = 'zafiadombd@%' AND TABLE_SCHEMA = 'easyclasebd_v2'
    `);
    
    const privilegeTypes = privileges.map(p => p.PRIVILEGE_TYPE);
    console.log('📋 Privilegios del usuario:');
    privilegeTypes.forEach(priv => console.log(`   - ${priv}`));
    
    const hasCreate = privilegeTypes.includes('CREATE');
    const hasAlter = privilegeTypes.includes('ALTER');
    const hasDrop = privilegeTypes.includes('DROP');
    
    if (hasCreate && hasAlter && hasDrop) {
      console.log('✅ Usuario tiene todos los permisos necesarios');
    } else {
      console.log('⚠️  Usuario no tiene todos los permisos necesarios');
      console.log('🔧 Contacta a Dreamhost para obtener permisos completos');
    }
    
    console.log('\n🎉 ¡Prueba de conexión completada exitosamente!');
    console.log('✅ La base de datos está accesible');
    console.log('✅ Las credenciales son correctas');
    console.log('✅ Puedes proceder con la migración');
    
    console.log('\n🚀 Próximos pasos:');
    console.log('   1. Ejecutar "npm run migrate-mysql" para crear tablas');
    console.log('   2. Configurar variables en Vercel');
    console.log('   3. Hacer deploy de la aplicación');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Posibles soluciones:');
      console.log('   - El hostname puede no estar activo aún (espera algunas horas)');
      console.log('   - Verifica que el servidor MySQL esté activo en Dreamhost');
    } else if (error.message.includes('Access denied')) {
      console.log('\n🔧 Posibles soluciones:');
      console.log('   - Verifica que la contraseña sea correcta');
      console.log('   - Verifica que el usuario tenga acceso a la base de datos');
    }
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
};

// Ejecutar prueba
testRealConnection();
