import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar base de datos
console.log('🔍 Iniciando servidor...');
initializeDatabase().then(() => {
  console.log('✅ Base de datos inicializada');
}).catch((error) => {
  console.error('❌ Error inicializando base de datos:', error);
});

// Importar rutas existentes
import authRoutes from './routes/auth.js';
import profesoresRoutes from './routes/profesores.js';
import claseRoutes from './routes/clases.js';
import servicioRoutes from './routes/servicios.js';
import transactionRoutes from './routes/transactions.js';
import reviewRoutes from './routes/reviews.js';
import perfilEnriquecidoRoutes from './routes/perfilEnriquecido.js';
import adminRoutes from './routes/admin.js';
import escrowRoutes from './routes/escrow.js';

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/perfil-enriquecido', perfilEnriquecidoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/escrow', escrowRoutes);

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EasyClase API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba de base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    // Verificar que los modelos estén disponibles
    const models = {
      User: !!sequelize.models.User,
      Servicio: !!sequelize.models.Servicio,
      Clase: !!sequelize.models.Clase,
      Transaction: !!sequelize.models.Transaction,
      PerfilEnriquecido: !!sequelize.models.PerfilEnriquecido,
      Review: !!sequelize.models.Review
    };
    
    // Verificar conexión a la base de datos
    const dbStatus = await sequelize.authenticate();
    
    res.json({
      success: true,
      message: 'Prueba de base de datos',
      timestamp: new Date().toISOString(),
      database: {
        connected: !!dbStatus,
        models: models
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en prueba de base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de prueba para servicios (sin autenticación)
app.get('/api/test-servicios', async (req, res) => {
  try {
    console.log('🔍 /api/test-servicios llamado');
    
    // Verificar que el modelo Servicio esté disponible
    if (!sequelize.models.Servicio) {
      return res.status(500).json({
        success: false,
        message: 'Modelo Servicio no disponible',
        models: Object.keys(sequelize.models)
      });
    }
    
    // Intentar contar servicios
    const totalServicios = await sequelize.models.Servicio.count();
    
    res.json({
      success: true,
      message: 'Prueba de servicios exitosa',
      totalServicios,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en /api/test-servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error en prueba de servicios',
      error: error.message,
      stack: error.stack
    });
  }
});

// Ruta de prueba simple (sin base de datos)
app.get('/api/test-simple', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando sin base de datos',
    timestamp: new Date().toISOString(),
    models: Object.keys(sequelize.models || {})
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('✅ Servidor iniciado correctamente');
  console.log(`🌍 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
});

export default app;
