import mongoose from 'mongoose';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestClases = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase');
    console.log('✅ Conectado a MongoDB');

    // Buscar usuarios de prueba
    const profesor = await User.findOne({ email: 'profesor.prueba@easyclase.com' });
    const estudiante = await User.findOne({ email: 'estudiante.prueba@easyclase.com' });

    if (!profesor || !estudiante) {
      console.log('❌ No se encontraron usuarios de prueba. Ejecuta primero createTestUsers.js');
      return;
    }

    // Limpiar clases de prueba existentes
    await Clase.deleteMany({ 
      $or: [
        { profesor: profesor._id },
        { estudiante: estudiante._id }
      ]
    });
    console.log('🧹 Clases de prueba anteriores eliminadas');

    // Fechas para las clases
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setDate(mañana.getDate() + 1);
    mañana.setHours(10, 0, 0, 0);

    const pasadoMañana = new Date(ahora);
    pasadoMañana.setDate(pasadoMañana.getDate() + 2);
    pasadoMañana.setHours(14, 0, 0, 0);

    const proximaSemana = new Date(ahora);
    proximaSemana.setDate(proximaSemana.getDate() + 7);
    proximaSemana.setHours(16, 0, 0, 0);

    // Clase completada (para historial)
    const fechaAyer = new Date(ahora.getTime() - 86400000);
    const claseCompletada = new Clase({
      estudiante: estudiante._id,
      profesor: profesor._id,
      materia: 'JavaScript Básico',
      descripcion: 'Introducción a JavaScript: variables, funciones y eventos',
      modalidad: 'online',
      fecha: fechaAyer,
      horaInicio: '14:00',
      duracion: 1,
      precio: 50000,
      total: 50000,
      estado: 'completada',
      estadoPago: 'pagado',
      notasProfesor: 'Excelente clase, el estudiante muestra gran interés en aprender',
      enlaceReunion: `https://meet.easyclase.com/room/meeting_completed_${Date.now()}`,
      confirmadoPorProfesor: true,
      confirmadoPorEstudiante: true,
      fechaComplecion: fechaAyer
    });

    // Clase programada para mañana (confirmada y pagada)
    const claseProgramada = new Clase({
      estudiante: estudiante._id,
      profesor: profesor._id,
      materia: 'React Hooks',
      descripcion: 'Aprender useState, useEffect y hooks personalizados en React',
      modalidad: 'online',
      fecha: mañana,
      horaInicio: '10:00',
      duracion: 2,
      precio: 50000,
      total: 100000,
      estado: 'confirmada',
      estadoPago: 'pagado',
      enlaceReunion: `https://meet.easyclase.com/room/meeting_${mañana.getTime()}`,
      confirmadoPorProfesor: true,
      confirmadoPorEstudiante: true,
      fechaConfirmacion: new Date()
    });

    // Clase pendiente de confirmación (pasado mañana)
    const clasePendiente = new Clase({
      estudiante: estudiante._id,
      profesor: profesor._id,
      materia: 'Node.js y Express',
      descripcion: 'Creación de APIs REST con Node.js y Express.js',
      modalidad: 'online',
      fecha: pasadoMañana,
      horaInicio: '14:00',
      duracion: 2,
      precio: 50000,
      total: 100000,
      estado: 'solicitada',
      estadoPago: 'pendiente',
      enlaceReunion: `https://meet.easyclase.com/room/meeting_${pasadoMañana.getTime()}`
    });

    // Clase futura (próxima semana)
    const claseFutura = new Clase({
      estudiante: estudiante._id,
      profesor: profesor._id,
      materia: 'MongoDB y Bases de Datos',
      descripcion: 'Introducción a bases de datos NoSQL con MongoDB',
      modalidad: 'online',
      fecha: proximaSemana,
      horaInicio: '16:00',
      duracion: 2,
      precio: 50000,
      total: 100000,
      estado: 'confirmada',
      estadoPago: 'pagado',
      enlaceReunion: `https://meet.easyclase.com/room/meeting_${proximaSemana.getTime()}`,
      confirmadoPorProfesor: true,
      confirmadoPorEstudiante: true,
      fechaConfirmacion: new Date()
    });

    // Guardar todas las clases
    await claseCompletada.save();
    await claseProgramada.save();
    await clasePendiente.save();
    await claseFutura.save();

    console.log('\n🎯 ¡Clases de prueba creadas exitosamente!\n');
    
    console.log('📚 CLASES CREADAS:');
    console.log('\n1. ✅ CLASE COMPLETADA (Ayer):');
    console.log(`   Materia: JavaScript Básico`);
    console.log(`   Estado: Completada y calificada`);
    console.log(`   Duración: 60 minutos`);
    
    console.log('\n2. 🎥 CLASE PROGRAMADA (Mañana):');
    console.log(`   Materia: React Hooks`);
    console.log(`   Fecha: ${mañana.toLocaleDateString()} a las ${mañana.toLocaleTimeString()}`);
    console.log(`   Estado: Confirmada y pagada`);
    console.log(`   Duración: 90 minutos`);
    console.log(`   🔗 Meeting ID: meeting_${mañana.getTime()}`);
    
    console.log('\n3. ⏳ CLASE PENDIENTE (Pasado mañana):');
    console.log(`   Materia: Node.js y Express`);
    console.log(`   Fecha: ${pasadoMañana.toLocaleDateString()} a las ${pasadoMañana.toLocaleTimeString()}`);
    console.log(`   Estado: Pendiente de confirmación`);
    console.log(`   Duración: 120 minutos`);
    
    console.log('\n4. 📅 CLASE FUTURA (Próxima semana):');
    console.log(`   Materia: MongoDB y Bases de Datos`);
    console.log(`   Fecha: ${proximaSemana.toLocaleDateString()} a las ${proximaSemana.toLocaleTimeString()}`);
    console.log(`   Estado: Confirmada y pagada`);
    console.log(`   Duración: 90 minutos`);

    console.log('\n🔐 PARA PROBAR LA VIDEOLLAMADA:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ 1. Inicia sesión como profesor o estudiante            │');
    console.log('│ 2. Ve al Dashboard                                     │');
    console.log('│ 3. Busca la clase programada para mañana               │');
    console.log('│ 4. Haz clic en "Unirse a videollamada"                │');
    console.log('└─────────────────────────────────────────────────────────┘');

    // Actualizar estadísticas del profesor
    await User.findByIdAndUpdate(profesor._id, {
      totalClases: 128,
      $inc: { totalReviews: 1 }
    });

    console.log('\n📝 CREDENCIALES DE PRUEBA:');
    console.log('👨‍🏫 Profesor: profesor.prueba@easyclase.com / Profesor123!');
    console.log('👩‍🎓 Estudiante: estudiante.prueba@easyclase.com / Estudiante123!');

  } catch (error) {
    console.error('❌ Error creando clases de prueba:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestClases();
}

export default createTestClases;
