import { Sequelize } from 'sequelize';

// ─── Conexión a Supabase PostgreSQL ──────────────────────────────────────────
// Se usa una única variable de entorno DATABASE_URL con el connection string del
// pooler de Supabase (recomendado para entornos serverless):
//   postgresql://postgres.<ref>:<password>@aws-0-us-east-1.pooler.supabase.com:6543/postgres
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // No lanzamos aquí para permitir que el proceso arranque (health checks, etc.),
  // pero la conexión fallará de forma explícita al usarse.
  console.warn('⚠️ DATABASE_URL no está configurada. La base de datos no estará disponible.');
}

const sequelize = new Sequelize(connectionString || '', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  // Pool pequeño: en serverless cada instancia mantiene pocas conexiones vivas.
  pool: { max: 2, min: 0, acquire: 10000, idle: 5000 }
});

// Estado de inicialización (evita re-sincronizar en cada invocación serverless).
let initialized = false;

// Inicializa modelos + asociaciones. Idempotente: seguro de llamar en cada request.
export const initializeDatabase = async () => {
  if (initialized) return true;

  try {
    // Importar modelos (registran su definición sobre la instancia `sequelize`).
    await import('../models/User.js');
    await import('../models/Servicio.js');
    await import('../models/Clase.js');
    await import('../models/Transaction.js');
    await import('../models/PerfilEnriquecido.js');
    await import('../models/Review.js');
    await import('../models/DisponibilidadProfesor.js');
    await import('../models/PlantillaClase.js');
    await import('../models/CompraServicio.js');

    // Configurar asociaciones entre modelos.
    const { setupAssociations } = await import('./associations.js');
    setupAssociations();

    await sequelize.authenticate();
    initialized = true;
    console.log('✅ Conectado a Supabase PostgreSQL');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message);
    initialized = false;
    return false;
  }
};

// Prueba de conexión (usada por scripts de verificación).
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
};

// Sincroniza el esquema con la base de datos.
// Solo debe ejecutarse desde un script de migración manual, NUNCA en cada request.
export const syncDatabase = async (force = false) => {
  try {
    await initializeDatabase();
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Base de datos sincronizada');
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error.message);
    return false;
  }
};

export default sequelize;
