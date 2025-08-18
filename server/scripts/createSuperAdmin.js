import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase');
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un superadmin
    const existingSuperAdmin = await User.findOne({ rol: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Ya existe un usuario Super Administrador:');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      console.log(`   Nombre: ${existingSuperAdmin.nombre}`);
      console.log(`   Creado: ${existingSuperAdmin.createdAt}`);
      
      // Preguntar si quiere crear otro
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('¿Quieres crear otro Super Administrador? (s/n): ', async (respuesta) => {
        if (respuesta.toLowerCase() !== 's' && respuesta.toLowerCase() !== 'si') {
          console.log('Operación cancelada.');
          rl.close();
          process.exit(0);
        }
        rl.close();
        await crearNuevoSuperAdmin();
      });
    } else {
      await crearNuevoSuperAdmin();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const crearNuevoSuperAdmin = async () => {
  try {
    // Datos del super administrador maestro
    const superAdminData = {
      nombre: 'Super Administrador',
      email: 'admin@easyclase.com',
      password: 'EasyClase2024!',
      telefono: '+57-300-000-0000',
      tipoUsuario: 'admin',
      rol: 'superadmin',
      permisos: [
        'read_users', 'create_users', 'update_users', 'delete_users',
        'read_classes', 'create_classes', 'update_classes', 'delete_classes',
        'read_payments', 'update_payments', 'refund_payments',
        'read_content', 'update_content',
        'read_reports', 'manage_disputes',
        'system_admin'
      ],
      verificado: true,
      activo: true
    };

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: superAdminData.email });
    if (existingUser) {
      // Si existe, actualizar a superadmin
      existingUser.rol = 'superadmin';
      existingUser.tipoUsuario = 'admin';
      existingUser.permisos = superAdminData.permisos;
      existingUser.verificado = true;
      existingUser.activo = true;
      
      await existingUser.save();
      
      console.log('✅ Usuario existente actualizado a Super Administrador:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Nombre: ${existingUser.nombre}`);
    } else {
      // Crear nuevo usuario
      const superAdmin = new User(superAdminData);
      await superAdmin.save();
      
      console.log('✅ Super Administrador creado exitosamente:');
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Contraseña: ${superAdminData.password}`);
      console.log(`   Nombre: ${superAdmin.nombre}`);
    }
    
    console.log('\n🎯 Credenciales de acceso:');
    console.log(`   URL: http://localhost:3002/admin`);
    console.log(`   Email: ${superAdminData.email}`);
    console.log(`   Contraseña: ${superAdminData.password}`);
    
    console.log('\n🔐 Permisos asignados:');
    superAdminData.permisos.forEach(permiso => {
      console.log(`   - ${permiso}`);
    });
    
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Cambia la contraseña después del primer login');
    console.log('   - Este usuario tiene acceso COMPLETO al sistema');
    console.log('   - Guarda estas credenciales de forma segura');
    
  } catch (error) {
    console.error('❌ Error creando Super Administrador:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createSuperAdmin();
}

export default createSuperAdmin;
