import mongoose from 'mongoose';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase';

async function migrateDescuentos() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🔄 Iniciando migración del sistema de descuentos...');

    // 1. Actualizar usuarios existentes con campos premium
    console.log('\n📝 Actualizando usuarios existentes...');
    const usuariosActualizados = await User.updateMany(
      { premium: { $exists: false } },
      {
        $set: {
          premium: {
            activo: false,
            fechaInicio: null,
            fechaFin: null,
            plan: null
          },
          descuentosUtilizados: []
        }
      }
    );
    console.log(`✅ ${usuariosActualizados.modifiedCount} usuarios actualizados`);

    // 2. Actualizar clases existentes con campo descuento
    console.log('\n📝 Actualizando clases existentes...');
    const clasesActualizadas = await Clase.updateMany(
      { descuento: { $exists: false } },
      {
        $set: {
          descuento: {
            aplicado: false,
            porcentaje: 0,
            montoDescuento: 0,
            categoria: null,
            asumidoPor: 'profesor'
          }
        }
      }
    );
    console.log(`✅ ${clasesActualizadas.modifiedCount} clases actualizadas`);

    // 3. Crear usuarios de prueba
    console.log('\n👥 Creando usuarios de prueba...');

    // Estudiantes de prueba
    const estudianteNormal = new User({
      nombre: 'Ana García',
      email: 'ana.garcia@test.com',
      codigoPais: '+57',
      telefono: '3001234567',
      password: '$2b$10$test.hash.for.testing',
      tipoUsuario: 'estudiante',
      premium: {
        activo: false,
        fechaInicio: null,
        fechaFin: null,
        plan: null
      },
      descuentosUtilizados: []
    });

    const estudiantePremium = new User({
      nombre: 'Carlos López',
      email: 'carlos.lopez@test.com',
      codigoPais: '+57',
      telefono: '3001234568',
      password: '$2b$10$test.hash.for.testing',
      tipoUsuario: 'estudiante',
      premium: {
        activo: true,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        plan: 'mensual'
      },
      descuentosUtilizados: []
    });

    // Profesores de prueba
    const profesorNormal = new User({
      nombre: 'María Rodríguez',
      email: 'maria.rodriguez@test.com',
      codigoPais: '+57',
      telefono: '3001234569',
      password: '$2b$10$test.hash.for.testing',
      tipoUsuario: 'profesor',
      especialidades: ['Matemáticas'],
      precioPorHora: 30000,
      premium: {
        activo: false,
        fechaInicio: null,
        fechaFin: null,
        plan: null
      },
      descuentosUtilizados: []
    });

    const profesorPremium = new User({
      nombre: 'Dr. Juan Pérez',
      email: 'juan.perez@test.com',
      codigoPais: '+57',
      telefono: '3001234570',
      password: '$2b$10$test.hash.for.testing',
      tipoUsuario: 'profesor',
      especialidades: ['Programación', 'Ingeniería'],
      precioPorHora: 45000,
      premium: {
        activo: true,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        plan: 'mensual'
      },
      descuentosUtilizados: []
    });

    // Guardar usuarios de prueba
    await estudianteNormal.save();
    await estudiantePremium.save();
    await profesorNormal.save();
    await profesorPremium.save();

    console.log('✅ Usuarios de prueba creados:');
    console.log('   - Estudiante Normal: ana.garcia@test.com');
    console.log('   - Estudiante Premium: carlos.lopez@test.com');
    console.log('   - Profesor Normal: maria.rodriguez@test.com');
    console.log('   - Profesor Premium: juan.perez@test.com');

    // 4. Crear clases de prueba con diferentes escenarios de descuento
    console.log('\n📚 Creando clases de prueba...');

    // Clase sin descuento
    const claseSinDescuento = new Clase({
      estudiante: estudianteNormal._id,
      profesor: profesorNormal._id,
      materia: 'Matemáticas Básicas',
      descripcion: 'Clase de matemáticas sin descuento',
      fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      horaInicio: '10:00',
      duracion: 2,
      modalidad: 'online',
      precio: 30000,
      estado: 'confirmada',
      descuento: {
        aplicado: false,
        porcentaje: 0,
        montoDescuento: 0,
        categoria: 'Matemáticas',
        asumidoPor: 'profesor'
      },
      total: 60000
    });

    // Clase con descuento asumido por profesor (estudiante normal)
    const claseDescuentoProfesor = new Clase({
      estudiante: estudianteNormal._id,
      profesor: profesorNormal._id,
      materia: 'Matemáticas Avanzadas',
      descripcion: 'Clase con descuento asumido por profesor',
      fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
      horaInicio: '14:00',
      duracion: 1.5,
      modalidad: 'online',
      precio: 30000,
      estado: 'confirmada',
      descuento: {
        aplicado: true,
        porcentaje: 10,
        montoDescuento: 4500,
        categoria: 'Matemáticas',
        asumidoPor: 'profesor'
      },
      total: 40500
    });

    // Clase con descuento asumido por plataforma (ambos premium)
    const claseDescuentoPlataforma = new Clase({
      estudiante: estudiantePremium._id,
      profesor: profesorPremium._id,
      materia: 'Programación Python',
      descripcion: 'Clase con descuento asumido por plataforma',
      fecha: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 días
      horaInicio: '16:00',
      duracion: 2,
      modalidad: 'online',
      precio: 45000,
      estado: 'confirmada',
      descuento: {
        aplicado: true,
        porcentaje: 10,
        montoDescuento: 9000,
        categoria: 'Programación',
        asumidoPor: 'plataforma'
      },
      total: 81000
    });

    // Clase con descuento asumido por profesor (estudiante premium, profesor normal)
    const claseDescuentoProfesorEstudiantePremium = new Clase({
      estudiante: estudiantePremium._id,
      profesor: profesorNormal._id,
      materia: 'Matemáticas para Programadores',
      descripcion: 'Clase con descuento asumido por profesor (estudiante premium)',
      fecha: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 días
      horaInicio: '18:00',
      duracion: 1,
      modalidad: 'online',
      precio: 30000,
      estado: 'confirmada',
      descuento: {
        aplicado: true,
        porcentaje: 10,
        montoDescuento: 3000,
        categoria: 'Matemáticas',
        asumidoPor: 'profesor'
      },
      total: 27000
    });

    // Guardar clases de prueba
    await claseSinDescuento.save();
    await claseDescuentoProfesor.save();
    await claseDescuentoPlataforma.save();
    await claseDescuentoProfesorEstudiantePremium.save();

    console.log('✅ Clases de prueba creadas:');
    console.log('   - Clase sin descuento');
    console.log('   - Clase con descuento asumido por profesor (estudiante normal)');
    console.log('   - Clase con descuento asumido por plataforma (ambos premium)');
    console.log('   - Clase con descuento asumido por profesor (estudiante premium, profesor normal)');

    // 5. Registrar descuentos utilizados
    console.log('\n📊 Registrando descuentos utilizados...');

    // Registrar descuento para estudiante normal
    await estudianteNormal.registrarDescuento('Matemáticas', claseDescuentoProfesor._id);

    // Registrar descuento para estudiante premium
    await estudiantePremium.registrarDescuento('Programación', claseDescuentoPlataforma._id);
    await estudiantePremium.registrarDescuento('Matemáticas', claseDescuentoProfesorEstudiantePremium._id);

    console.log('✅ Descuentos registrados en historial de usuarios');

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📋 Resumen de la migración:');
    console.log(`   - ${usuariosActualizados.modifiedCount} usuarios actualizados`);
    console.log(`   - ${clasesActualizadas.modifiedCount} clases actualizadas`);
    console.log('   - 4 usuarios de prueba creados');
    console.log('   - 4 clases de prueba creadas');
    console.log('   - Descuentos registrados en historial');

    console.log('\n🧪 Datos de prueba disponibles:');
    console.log('   - Escenarios de descuento probados');
    console.log('   - Usuarios premium y normales');
    console.log('   - Diferentes combinaciones de descuento');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar migración
migrateDescuentos();
