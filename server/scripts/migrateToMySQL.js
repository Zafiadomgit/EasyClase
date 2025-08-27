import dotenv from 'dotenv';
import sequelize, { testConnection, syncDatabase } from '../config/database.js';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import Review from '../models/Review.js';
import Servicio from '../models/Servicio.js';
import PerfilEnriquecido from '../models/PerfilEnriquecido.js';
import Transaction from '../models/Transaction.js';

// Cargar variables de entorno
dotenv.config({ path: '../../.env' });

console.log('🚀 Iniciando migración completa a MySQL...\n');

const migrateToMySQL = async () => {
  try {
    // 1. Probar conexión
    console.log('1️⃣ Probando conexión a MySQL...');
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
      console.log('❌ No se pudo conectar a MySQL');
      return;
    }

    // 2. Sincronizar base de datos
    console.log('\n2️⃣ Sincronizando base de datos...');
    const syncTest = await syncDatabase(false); // false = no forzar recreación
    
    if (!syncTest) {
      console.log('❌ Error en la sincronización');
      return;
    }

    // 3. Crear datos de prueba
    console.log('\n3️⃣ Creando datos de prueba...');
    
    // Crear usuarios de prueba
    const testUsers = await Promise.all([
      User.create({
        nombre: 'Profesor de Prueba',
        email: 'profesor@easyclase.com',
        password: 'password123',
        tipo: 'profesor',
        telefono: '+573001234567',
        pais: 'Colombia',
        ciudad: 'Bogotá',
        verificado: true,
        rating: 4.8
      }),
      User.create({
        nombre: 'Estudiante de Prueba',
        email: 'estudiante@easyclase.com',
        password: 'password123',
        tipo: 'estudiante',
        telefono: '+573001234568',
        pais: 'Colombia',
        ciudad: 'Medellín',
        verificado: true
      })
    ]);

    console.log('✅ Usuarios de prueba creados');

    // Crear perfil enriquecido para el profesor
    const perfilEnriquecido = await PerfilEnriquecido.create({
      userId: testUsers[0].id,
      biografia: 'Profesor experimentado en matemáticas y física',
      especialidades: ['Matemáticas', 'Física', 'Cálculo'],
      experiencia: 5,
      educacion: 'Ingeniero de Sistemas - Universidad Nacional',
      certificaciones: ['Certificación en Matemáticas Avanzadas'],
      idiomas: ['Español', 'Inglés'],
      disponibilidad: {
        lunes: ['09:00-12:00', '14:00-17:00'],
        martes: ['09:00-12:00', '14:00-17:00'],
        miercoles: ['09:00-12:00', '14:00-17:00'],
        jueves: ['09:00-12:00', '14:00-17:00'],
        viernes: ['09:00-12:00', '14:00-17:00']
      },
      precioPorHora: 50000,
      moneda: 'COP'
    });

    console.log('✅ Perfil enriquecido creado');

    // Crear servicios
    const servicios = await Promise.all([
      Servicio.create({
        userId: testUsers[0].id,
        titulo: 'Clases de Matemáticas Básicas',
        descripcion: 'Clases personalizadas de matemáticas para estudiantes de secundaria',
        categoria: 'Matemáticas',
        subcategoria: 'Álgebra',
        precio: 50000,
        moneda: 'COP',
        duracion: 60,
        modalidad: 'online',
        estado: 'activo'
      }),
      Servicio.create({
        userId: testUsers[0].id,
        titulo: 'Tutoría en Física',
        descripcion: 'Tutoría especializada en física para estudiantes universitarios',
        categoria: 'Física',
        subcategoria: 'Mecánica',
        precio: 60000,
        moneda: 'COP',
        duracion: 90,
        modalidad: 'online',
        estado: 'activo'
      })
    ]);

    console.log('✅ Servicios creados');

    // Crear clases
    const clases = await Promise.all([
      Clase.create({
        profesorId: testUsers[0].id,
        estudianteId: testUsers[1].id,
        servicioId: servicios[0].id,
        titulo: 'Clase de Matemáticas - Álgebra Básica',
        descripcion: 'Primera clase de introducción al álgebra',
        fecha: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        duracion: 60,
        estado: 'programada',
        precio: 50000,
        moneda: 'COP',
        modalidad: 'online',
        plataforma: 'Zoom'
      })
    ]);

    console.log('✅ Clases creadas');

    // Crear reviews
    const reviews = await Promise.all([
      Review.create({
        claseId: clases[0].id,
        reviewerId: testUsers[1].id,
        reviewedId: testUsers[0].id,
        rating: 5,
        comentario: 'Excelente profesor, muy claro en sus explicaciones',
        fecha: new Date()
      })
    ]);

    console.log('✅ Reviews creados');

    // Crear transacción de prueba
    const transaction = await Transaction.create({
      claseId: clases[0].id,
      compradorId: testUsers[1].id,
      vendedorId: testUsers[0].id,
      monto: 50000,
      moneda: 'COP',
      estado: 'completada',
      metodoPago: 'mercadopago',
      fechaPago: new Date(),
      fechaCompletada: new Date()
    });

    console.log('✅ Transacción creada');

    // 4. Verificar datos creados
    console.log('\n4️⃣ Verificando datos creados...');
    
    const totalUsers = await User.count();
    const totalServicios = await Servicio.count();
    const totalClases = await Clase.count();
    const totalReviews = await Review.count();
    const totalTransactions = await Transaction.count();

    console.log(`📊 Estadísticas de la base de datos:`);
    console.log(`   - Usuarios: ${totalUsers}`);
    console.log(`   - Servicios: ${totalServicios}`);
    console.log(`   - Clases: ${totalClases}`);
    console.log(`   - Reviews: ${totalReviews}`);
    console.log(`   - Transacciones: ${totalTransactions}`);

    // 5. Probar operaciones CRUD
    console.log('\n5️⃣ Probando operaciones CRUD...');
    
    // Buscar usuario por email
    const foundUser = await User.findOne({
      where: { email: 'profesor@easyclase.com' }
    });
    console.log('✅ Búsqueda de usuario exitosa');

    // Actualizar usuario
    await foundUser.update({
      ciudad: 'Cali'
    });
    console.log('✅ Actualización de usuario exitosa');

    // Buscar servicios por categoría
    const mathServices = await Servicio.findAll({
      where: { categoria: 'Matemáticas' }
    });
    console.log(`✅ Búsqueda de servicios exitosa: ${mathServices.length} servicios encontrados`);

    // 6. Limpiar datos de prueba (opcional)
    console.log('\n6️⃣ Limpiando datos de prueba...');
    
    await Promise.all([
      Transaction.destroy({ where: { claseId: clases[0].id } }),
      Review.destroy({ where: { claseId: clases[0].id } }),
      Clase.destroy({ where: { id: clases[0].id } }),
      Servicio.destroy({ where: { userId: testUsers[0].id } }),
      PerfilEnriquecido.destroy({ where: { userId: testUsers[0].id } }),
      User.destroy({ where: { email: 'profesor@easyclase.com' } }),
      User.destroy({ where: { email: 'estudiante@easyclase.com' } })
    ]);

    console.log('✅ Datos de prueba limpiados');

    console.log('\n🎉 ¡Migración a MySQL completada exitosamente!');
    console.log('✅ La base de datos está funcionando correctamente');
    console.log('✅ Todos los modelos están configurados');
    console.log('✅ Las operaciones CRUD funcionan correctamente');
    console.log('✅ La base de datos está lista para producción');
    
    console.log('\n🚀 Próximos pasos:');
    console.log('   - Configurar variables de entorno en Vercel');
    console.log('   - Desplegar la aplicación');
    console.log('   - Migrar datos reales si es necesario');
    console.log('   - Configurar backups automáticos');

  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    // Cerrar conexión
    await sequelize.close();
    console.log('\n🔌 Conexión a MySQL cerrada');
  }
};

// Ejecutar la migración
migrateToMySQL();
