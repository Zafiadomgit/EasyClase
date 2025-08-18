import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUsers = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase');
    console.log('✅ Conectado a MongoDB');

    // Limpiar usuarios de prueba existentes
    await User.deleteMany({ 
      email: { 
        $in: [
          'admin@easyclase.com',
          'profesor.prueba@easyclase.com', 
          'estudiante.prueba@easyclase.com'
        ] 
      } 
    });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    // 1. Usuario Master (Super Administrador)
    const masterUser = new User({
      nombre: 'Admin Master',
      email: 'admin@easyclase.com',
      password: 'Admin123!',
      telefono: '+57-300-000-0001',
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
    });

    // 2. Usuario Profesor de Prueba
    const profesorPrueba = new User({
      nombre: 'Carlos Mendez',
      email: 'profesor.prueba@easyclase.com',
      password: 'Profesor123!',
      telefono: '+57-300-000-0002',
      tipoUsuario: 'profesor',
      rol: 'user',
      verificado: true,
      activo: true,
      // Campos específicos del profesor
      especialidades: ['Programación', 'JavaScript', 'React', 'Node.js'],
      titulo: 'Ingeniero de Software',
      experiencia: '5 años desarrollando aplicaciones web',
      descripcion: 'Profesor experto en desarrollo web moderno. Especializado en JavaScript, React y Node.js. He trabajado en empresas tecnológicas líderes y ahora enseño a la próxima generación de desarrolladores.',
      precioPorHora: 50000,
      modalidad: 'ambas',
      ubicacion: 'Bogotá, Colombia',
      certificaciones: [
        {
          nombre: 'Certified React Developer',
          institucion: 'Meta',
          fecha: new Date('2023-06-15')
        },
        {
          nombre: 'Full Stack Developer',
          institucion: 'FreeCodeCamp',
          fecha: new Date('2022-03-20')
        }
      ],
      disponibilidad: {
        lunes: [{ inicio: '09:00', fin: '17:00' }],
        martes: [{ inicio: '09:00', fin: '17:00' }],
        miercoles: [{ inicio: '09:00', fin: '17:00' }],
        jueves: [{ inicio: '09:00', fin: '17:00' }],
        viernes: [{ inicio: '09:00', fin: '15:00' }],
        sabado: [{ inicio: '10:00', fin: '14:00' }],
        domingo: []
      },
      totalClases: 127,
      calificacionPromedio: 4.8,
      totalReviews: 89
    });

    // 3. Usuario Estudiante de Prueba
    const estudiantePrueba = new User({
      nombre: 'Ana García',
      email: 'estudiante.prueba@easyclase.com',
      password: 'Estudiante123!',
      telefono: '+57-300-000-0003',
      tipoUsuario: 'estudiante',
      rol: 'user',
      verificado: true,
      activo: true,
      ubicacion: 'Medellín, Colombia'
    });

    // Guardar usuarios
    await masterUser.save();
    await profesorPrueba.save();
    await estudiantePrueba.save();

    console.log('\n🎯 ¡Usuarios de prueba creados exitosamente!\n');
    
    console.log('👑 USUARIO MASTER (Super Administrador):');
    console.log(`   Email: admin@easyclase.com`);
    console.log(`   Contraseña: Admin123!`);
    console.log(`   Rol: Super Administrador`);
    console.log(`   Acceso: Panel completo de administración\n`);
    
    console.log('👨‍🏫 USUARIO PROFESOR DE PRUEBA:');
    console.log(`   Nombre: Carlos Mendez`);
    console.log(`   Email: profesor.prueba@easyclase.com`);
    console.log(`   Contraseña: Profesor123!`);
    console.log(`   Especialidades: Programación, JavaScript, React, Node.js`);
    console.log(`   Precio: $50,000 COP/hora`);
    console.log(`   Calificación: 4.8/5 (89 reseñas)`);
    console.log(`   Clases impartidas: 127\n`);
    
    console.log('👩‍🎓 USUARIO ESTUDIANTE DE PRUEBA:');
    console.log(`   Nombre: Ana García`);
    console.log(`   Email: estudiante.prueba@easyclase.com`);
    console.log(`   Contraseña: Estudiante123!`);
    console.log(`   Ubicación: Medellín, Colombia\n`);

    console.log('🔐 CREDENCIALES RÁPIDAS:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ ADMIN:      admin@easyclase.com / Admin123!             │');
    console.log('│ PROFESOR:   profesor.prueba@easyclase.com / Profesor123!│');
    console.log('│ ESTUDIANTE: estudiante.prueba@easyclase.com / Estudiante123!│');
    console.log('└─────────────────────────────────────────────────────────┘');

    console.log('\n📝 NOTAS IMPORTANTES:');
    console.log('• Todos los usuarios están verificados y activos');
    console.log('• El profesor tiene horarios, certificaciones y estadísticas');
    console.log('• El admin tiene todos los permisos del sistema');
    console.log('• Contraseñas seguras con mayúsculas, números y símbolos');

  } catch (error) {
    console.error('❌ Error creando usuarios de prueba:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUsers();
}

export default createTestUsers;
