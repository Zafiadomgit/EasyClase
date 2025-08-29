import { Sequelize } from 'sequelize';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUsers = async () => {
  try {
    // Conectar a MySQL usando Sequelize
    const sequelize = new Sequelize(
      process.env.MYSQL_DATABASE || 'easyclasebd_v2',
      process.env.MYSQL_USER || 'zafiadombd',
      process.env.MYSQL_PASSWORD || 'f9ZrKNH2bNuYT8d',
      {
        host: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
        port: process.env.MYSQL_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );

    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');

    // Sincronizar modelos
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados');

    // Limpiar usuarios de prueba existentes
    await User.destroy({ 
      where: {
        email: [
          'admin@easyclase.com',
          'profesor.prueba@easyclase.com', 
          'estudiante.prueba@easyclase.com'
        ]
      }
    });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    // 1. Usuario Master (Super Administrador)
    const masterUser = await User.create({
      nombre: 'Admin Master',
      email: 'admin@easyclase.com',
      password: 'Admin123!',
      telefono: '+57-300-000-0001',
      tipo: 'admin',
      estado: 'activo',
      emailVerificado: true,
      ultimoAcceso: new Date()
    });
    console.log('✅ Usuario Admin creado:', masterUser.email);

    // 2. Usuario Profesor de Prueba
    const profesorPrueba = await User.create({
      nombre: 'Carlos Mendez',
      email: 'profesor.prueba@easyclase.com',
      password: 'Profesor123!',
      telefono: '+57-300-000-0002',
      tipo: 'profesor',
      estado: 'activo',
      emailVerificado: true,
      ultimoAcceso: new Date()
    });
    console.log('✅ Usuario Profesor creado:', profesorPrueba.email);

    // 3. Usuario Estudiante de Prueba
    const estudiantePrueba = await User.create({
      nombre: 'Ana García',
      email: 'estudiante.prueba@easyclase.com',
      password: 'Estudiante123!',
      telefono: '+57-300-000-0003',
      tipo: 'estudiante',
      estado: 'activo',
      emailVerificado: true,
      ultimoAcceso: new Date()
    });
    console.log('✅ Usuario Estudiante creado:', estudiantePrueba.email);

    console.log('\n🎉 Todos los usuarios de prueba creados exitosamente!');
    console.log('\n📋 Credenciales de Acceso:');
    console.log('👑 Admin: admin@easyclase.com / Admin123!');
    console.log('👨‍🏫 Profesor: profesor.prueba@easyclase.com / Profesor123!');
    console.log('👨‍🎓 Estudiante: estudiante.prueba@easyclase.com / Estudiante123!');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuarios de prueba:', error);
    process.exit(1);
  }
};

createTestUsers();
