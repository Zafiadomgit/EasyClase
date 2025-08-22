import mongoose from 'mongoose';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase';

async function createTestReviews() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('\n📝 Creando reseñas de prueba...');

    // Buscar los usuarios de prueba
    const profesorNormal = await User.findOne({ email: 'maria.rodriguez@test.com' });
    const profesorPremium = await User.findOne({ email: 'juan.perez@test.com' });
    const estudianteNormal = await User.findOne({ email: 'ana.garcia@test.com' });
    const estudiantePremium = await User.findOne({ email: 'carlos.lopez@test.com' });

    if (!profesorNormal || !profesorPremium || !estudianteNormal || !estudiantePremium) {
      console.log('❌ No se encontraron todos los usuarios de prueba. Ejecuta primero migrateDescuentos.js');
      return;
    }

    // Crear clases de prueba para las reseñas
    const clasesProfesorNormal = [];
    const clasesProfesorPremium = [];

    // Crear 15 clases para el profesor normal (con diferentes calificaciones)
    for (let i = 0; i < 15; i++) {
      const clase = new Clase({
        estudiante: i % 2 === 0 ? estudianteNormal._id : estudiantePremium._id,
        profesor: profesorNormal._id,
        materia: 'Matemáticas',
        descripcion: `Clase de matemáticas ${i + 1}`,
        fecha: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Días atrás
        horaInicio: '10:00',
        duracion: 2,
        modalidad: 'online',
        precio: 30000,
        estado: 'completada',
        total: 60000
      });
      await clase.save();
      clasesProfesorNormal.push(clase);
    }

    // Crear 25 clases para el profesor premium (con mejores calificaciones)
    for (let i = 0; i < 25; i++) {
      const clase = new Clase({
        estudiante: i % 2 === 0 ? estudianteNormal._id : estudiantePremium._id,
        profesor: profesorPremium._id,
        materia: 'Programación',
        descripcion: `Clase de programación ${i + 1}`,
        fecha: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Días atrás
        horaInicio: '14:00',
        duracion: 2,
        modalidad: 'online',
        precio: 45000,
        estado: 'completada',
        total: 90000
      });
      await clase.save();
      clasesProfesorPremium.push(clase);
    }

    console.log('✅ Clases de prueba creadas');

    // Crear reseñas para el profesor normal (calificaciones variadas)
    const reseñasProfesorNormal = [
      { calificacion: 4, comentario: 'Buen profesor, explica bien los conceptos básicos.' },
      { calificacion: 3, comentario: 'Regular, a veces va muy rápido en las explicaciones.' },
      { calificacion: 5, comentario: 'Excelente profesor! Muy paciente y didáctico.' },
      { calificacion: 4, comentario: 'Muy bueno, las clases son muy útiles.' },
      { calificacion: 3, comentario: 'Bien, pero podría ser más claro en algunos temas.' },
      { calificacion: 4, comentario: 'Profesor competente, explica de manera clara.' },
      { calificacion: 5, comentario: '¡Fantástico! Aprendí mucho en sus clases.' },
      { calificacion: 4, comentario: 'Muy buen profesor, recomendado.' },
      { calificacion: 3, comentario: 'Bien, aunque a veces es difícil seguirle el ritmo.' },
      { calificacion: 4, comentario: 'Profesor dedicado y profesional.' },
      { calificacion: 5, comentario: 'Excelente metodología de enseñanza.' },
      { calificacion: 4, comentario: 'Muy bueno, explica de forma sencilla.' },
      { calificacion: 3, comentario: 'Regular, necesita mejorar en algunos aspectos.' },
      { calificacion: 4, comentario: 'Buen profesor, las clases son productivas.' },
      { calificacion: 5, comentario: '¡Increíble! Muy recomendado para aprender matemáticas.' }
    ];

    // Crear reseñas para el profesor premium (calificaciones más altas)
    const reseñasProfesorPremium = [
      { calificacion: 5, comentario: '¡Profesor excepcional! Explica de manera magistral.' },
      { calificacion: 5, comentario: 'El mejor profesor que he tenido, muy profesional.' },
      { calificacion: 5, comentario: 'Increíble conocimiento y paciencia para enseñar.' },
      { calificacion: 5, comentario: 'Excelente metodología y dominio del tema.' },
      { calificacion: 4, comentario: 'Muy buen profesor, explica de forma clara.' },
      { calificacion: 5, comentario: '¡Fantástico! Aprendí más de lo esperado.' },
      { calificacion: 5, comentario: 'Profesor de primera categoría, muy recomendado.' },
      { calificacion: 5, comentario: 'Excelente en todos los aspectos de la enseñanza.' },
      { calificacion: 4, comentario: 'Muy bueno, las clases son muy productivas.' },
      { calificacion: 5, comentario: '¡Increíble! Dominio total del tema.' },
      { calificacion: 5, comentario: 'El mejor profesor de programación que he conocido.' },
      { calificacion: 5, comentario: 'Excelente pedagogía y conocimiento técnico.' },
      { calificacion: 4, comentario: 'Muy buen profesor, explica de manera sencilla.' },
      { calificacion: 5, comentario: '¡Fantástico! Metodología de enseñanza superior.' },
      { calificacion: 5, comentario: 'Profesor excepcional, muy recomendado.' },
      { calificacion: 5, comentario: 'Increíble dominio del tema y paciencia.' },
      { calificacion: 4, comentario: 'Muy bueno, las clases son muy útiles.' },
      { calificacion: 5, comentario: 'Excelente en todos los sentidos.' },
      { calificacion: 5, comentario: '¡El mejor! Explica de manera magistral.' },
      { calificacion: 5, comentario: 'Profesor de primera, muy profesional.' },
      { calificacion: 5, comentario: 'Increíble conocimiento y metodología.' },
      { calificacion: 4, comentario: 'Muy buen profesor, recomendado.' },
      { calificacion: 5, comentario: '¡Fantástico! Aprendizaje garantizado.' },
      { calificacion: 5, comentario: 'Excelente en todos los aspectos.' },
      { calificacion: 5, comentario: 'El mejor profesor de programación.' },
      { calificacion: 5, comentario: '¡Increíble! Dominio total del tema.' },
      { calificacion: 5, comentario: 'Profesor excepcional, muy recomendado.' },
      { calificacion: 5, comentario: 'Excelente pedagogía y conocimiento.' },
      { calificacion: 5, comentario: '¡El mejor! Metodología superior.' },
      { calificacion: 5, comentario: 'Profesor de primera categoría.' }
    ];

    // Crear reseñas para el profesor normal
    for (let i = 0; i < clasesProfesorNormal.length; i++) {
      const reseña = reseñasProfesorNormal[i];
      const review = new Review({
        clase: clasesProfesorNormal[i]._id,
        estudiante: clasesProfesorNormal[i].estudiante,
        profesor: profesorNormal._id,
        calificacion: reseña.calificacion,
        comentario: reseña.comentario,
        aspectos: {
          puntualidad: reseña.calificacion,
          claridad: reseña.calificacion,
          paciencia: reseña.calificacion,
          conocimiento: reseña.calificacion
        },
        recomendaria: reseña.calificacion >= 4
      });
      await review.save();
    }

    // Crear reseñas para el profesor premium
    for (let i = 0; i < clasesProfesorPremium.length; i++) {
      const reseña = reseñasProfesorPremium[i];
      const review = new Review({
        clase: clasesProfesorPremium[i]._id,
        estudiante: clasesProfesorPremium[i].estudiante,
        profesor: profesorPremium._id,
        calificacion: reseña.calificacion,
        comentario: reseña.comentario,
        aspectos: {
          puntualidad: reseña.calificacion,
          claridad: reseña.calificacion,
          paciencia: reseña.calificacion,
          conocimiento: reseña.calificacion
        },
        recomendaria: reseña.calificacion >= 4
      });
      await review.save();
    }

    console.log('✅ Reseñas de prueba creadas');

    // Actualizar estadísticas de los profesores
    console.log('\n📊 Actualizando estadísticas de profesores...');

    // Función para actualizar estadísticas
    async function actualizarEstadisticasProfesor(profesorId) {
      const estadisticas = await Review.aggregate([
        { $match: { profesor: profesorId } },
        {
          $group: {
            _id: null,
            promedioCalificacion: { $avg: '$calificacion' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      if (estadisticas.length > 0) {
        await User.findByIdAndUpdate(profesorId, {
          calificacionPromedio: Math.round(estadisticas[0].promedioCalificacion * 10) / 10,
          totalReviews: estadisticas[0].totalReviews
        });
      }
    }

    await actualizarEstadisticasProfesor(profesorNormal._id);
    await actualizarEstadisticasProfesor(profesorPremium._id);

    console.log('✅ Estadísticas actualizadas');

    // Mostrar resumen
    const profesorNormalActualizado = await User.findById(profesorNormal._id);
    const profesorPremiumActualizado = await User.findById(profesorPremium._id);

    console.log('\n📋 Resumen de calificaciones:');
    console.log(`   Profesor Normal (${profesorNormalActualizado.nombre}):`);
    console.log(`     - Calificación promedio: ${profesorNormalActualizado.calificacionPromedio}/5`);
    console.log(`     - Total de reseñas: ${profesorNormalActualizado.totalReviews}`);
    console.log(`     - Estado premium: ${profesorNormalActualizado.premium.activo ? 'Sí' : 'No'}`);
    
    console.log(`   Profesor Premium (${profesorPremiumActualizado.nombre}):`);
    console.log(`     - Calificación promedio: ${profesorPremiumActualizado.calificacionPromedio}/5`);
    console.log(`     - Total de reseñas: ${profesorPremiumActualizado.totalReviews}`);
    console.log(`     - Estado premium: ${profesorPremiumActualizado.premium.activo ? 'Sí' : 'No'}`);

    console.log('\n🎉 ¡Reseñas de prueba creadas exitosamente!');
    console.log('\n🧪 Ahora puedes probar el sistema de búsqueda:');
    console.log('   - Los profesores premium aparecerán primero');
    console.log('   - Entre premium, los mejor calificados aparecen primero');
    console.log('   - Entre no premium, los mejor calificados aparecen primero');

  } catch (error) {
    console.error('❌ Error creando reseñas de prueba:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar script
createTestReviews();
