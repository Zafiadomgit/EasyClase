import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar directamente a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase';

const createQuickUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Esquema simple del usuario
    const userSchema = new mongoose.Schema({
      nombre: String,
      email: { type: String, unique: true },
      password: String,
      telefono: String,
      tipoUsuario: String,
      rol: { type: String, default: 'user' },
      verificado: { type: Boolean, default: true },
      activo: { type: Boolean, default: true }
    });

    const User = mongoose.model('User', userSchema);

    // Limpiar usuarios existentes
    await User.deleteMany({ 
      email: { 
        $in: [
          'admin@easyclase.com',
          'profesor.prueba@easyclase.com', 
          'estudiante.prueba@easyclase.com'
        ] 
      } 
    });

    // Crear usuarios con contraseñas hasheadas
    const salt = await bcrypt.genSalt(12);
    
    const users = [
      {
        nombre: 'Admin Master',
        email: 'admin@easyclase.com',
        password: await bcrypt.hash('Admin123!', salt),
        telefono: '+57-300-000-0001',
        tipoUsuario: 'admin',
        rol: 'superadmin'
      },
      {
        nombre: 'Carlos Mendez',
        email: 'profesor.prueba@easyclase.com',
        password: await bcrypt.hash('Profesor123!', salt),
        telefono: '+57-300-000-0002',
        tipoUsuario: 'profesor',
        rol: 'user'
      },
      {
        nombre: 'Ana García',
        email: 'estudiante.prueba@easyclase.com',
        password: await bcrypt.hash('Estudiante123!', salt),
        telefono: '+57-300-000-0003',
        tipoUsuario: 'estudiante',
        rol: 'user'
      }
    ];

    // Insertar usuarios
    await User.insertMany(users);

    console.log('\n🎯 ¡Usuarios creados exitosamente!\n');
    console.log('👑 ADMIN:      admin@easyclase.com / Admin123!');
    console.log('👨‍🏫 PROFESOR:   profesor.prueba@easyclase.com / Profesor123!');
    console.log('👩‍🎓 ESTUDIANTE: estudiante.prueba@easyclase.com / Estudiante123!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createQuickUsers();
