import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase';

// Preferencias por defecto
const preferenciasPorDefecto = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    classReminders: true,
    paymentNotifications: true,
    marketingEmails: false
  },
  language: {
    language: 'es',
    timezone: 'America/Bogota',
    currency: 'COP',
    dateFormat: 'DD/MM/YYYY'
  },
  theme: {
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'default'
  }
};

async function migrarPreferencias() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar usuarios sin preferencias
    const usuariosSinPreferencias = await User.find({
      $or: [
        { preferencias: { $exists: false } },
        { preferencias: null }
      ]
    });

    console.log(`📊 Encontrados ${usuariosSinPreferencias.length} usuarios sin preferencias`);

    if (usuariosSinPreferencias.length === 0) {
      console.log('🎉 Todos los usuarios ya tienen preferencias configuradas');
      return;
    }

    // Actualizar usuarios
    const resultado = await User.updateMany(
      {
        $or: [
          { preferencias: { $exists: false } },
          { preferencias: null }
        ]
      },
      {
        $set: { preferencias: preferenciasPorDefecto }
      }
    );

    console.log(`✅ Migración completada: ${resultado.modifiedCount} usuarios actualizados`);

    // Verificar que se aplicaron las preferencias
    const usuariosVerificados = await User.find({
      'preferencias.notifications.emailNotifications': { $exists: true }
    });

    console.log(`🔍 Verificación: ${usuariosVerificados.length} usuarios tienen preferencias configuradas`);

    // Mostrar ejemplo de un usuario actualizado
    if (usuariosVerificados.length > 0) {
      const usuarioEjemplo = usuariosVerificados[0];
      console.log('\n📋 Ejemplo de usuario con preferencias:');
      console.log(`   Nombre: ${usuarioEjemplo.nombre}`);
      console.log(`   Email: ${usuarioEjemplo.email}`);
      console.log(`   Preferencias:`, JSON.stringify(usuarioEjemplo.preferencias, null, 2));
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar migración
migrarPreferencias()
  .then(() => {
    console.log('🚀 Migración de preferencias completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
