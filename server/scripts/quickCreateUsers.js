import mongoose from 'mongoose';
import User from '../models/User.js';

// Usar la misma URI que está en Vercel
const MONGODB_URI = 'mongodb+srv://davidpieters12:yCmfwjC7T2r0ecT8@zafiadombd.g7dgovl.mongodb.net/easyclase';

const createQuickUsers = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si el usuario profesor ya existe
    const existingProfesor = await User.findOne({ email: 'profesor.prueba@easyclase.com' });
    
    if (existingProfesor) {
      console.log('✅ Usuario profesor ya existe');
      console.log(`   Email: profesor.prueba@easyclase.com`);
      console.log(`   Contraseña: Profesor123!`);
    } else {
      console.log('❌ Usuario profesor no existe, creando...');
      
      // Crear usuario profesor
      const profesorPrueba = new User({
        nombre: 'Carlos Mendez',
        email: 'profesor.prueba@easyclase.com',
        password: 'Profesor123!',
        telefono: '+57-300-000-0002',
        tipoUsuario: 'profesor',
        verificado: true,
        activo: true,
        especialidades: ['Programación', 'JavaScript', 'React', 'Node.js'],
        titulo: 'Ingeniero de Software',
        experiencia: '5 años desarrollando aplicaciones web',
        descripcion: 'Profesor experto en desarrollo web moderno.',
        precioPorHora: 50000,
        modalidad: 'ambas',
        ubicacion: 'Bogotá, Colombia',
        totalClases: 127,
        calificacionPromedio: 4.8,
        totalReviews: 89
      });

      await profesorPrueba.save();
      console.log('✅ Usuario profesor creado exitosamente');
    }

    // Verificar si el usuario estudiante ya existe
    const existingEstudiante = await User.findOne({ email: 'estudiante.prueba@easyclase.com' });
    
    if (existingEstudiante) {
      console.log('✅ Usuario estudiante ya existe');
      console.log(`   Email: estudiante.prueba@easyclase.com`);
      console.log(`   Contraseña: Estudiante123!`);
    } else {
      console.log('❌ Usuario estudiante no existe, creando...');
      
      const estudiantePrueba = new User({
        nombre: 'Ana García',
        email: 'estudiante.prueba@easyclase.com',
        password: 'Estudiante123!',
        telefono: '+57-300-000-0003',
        tipoUsuario: 'estudiante',
        verificado: true,
        activo: true,
        ubicacion: 'Medellín, Colombia'
      });

      await estudiantePrueba.save();
      console.log('✅ Usuario estudiante creado exitosamente');
    }

    console.log('\n🔐 CREDENCIALES PARA PRUEBAS:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ PROFESOR:   profesor.prueba@easyclase.com / Profesor123!│');
    console.log('│ ESTUDIANTE: estudiante.prueba@easyclase.com / Estudiante123!│');
    console.log('└─────────────────────────────────────────────────────────┘');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

createQuickUsers();