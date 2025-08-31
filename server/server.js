import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import profesorRoutes from './routes/profesores.js';
import claseRoutes from './routes/clases.js';
import reviewRoutes from './routes/reviews.js';
import servicioRoutes from './routes/servicios.js';
import perfilEnriquecidoRoutes from './routes/perfilEnriquecido.js';
import adminRoutes from './routes/admin.js';
import escrowRoutes from './routes/escrow.js';
import transactionRoutes from './routes/transactions.js';

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

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EasyClase API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Conectando...'
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'EasyClase API funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ========================================
// MONTAR RUTAS DE LA API
// ========================================

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de profesores
app.use('/api/profesores', profesorRoutes);

// Rutas de clases
app.use('/api/clases', claseRoutes);

// Rutas de reseñas
app.use('/api/reviews', reviewRoutes);

// Rutas de servicios
app.use('/api/servicios', servicioRoutes);

// Rutas de perfil enriquecido
app.use('/api/perfil-enriquecido', perfilEnriquecidoRoutes);

// Rutas de admin
app.use('/api/admin', adminRoutes);

// Rutas de escrow (pagos)
app.use('/api/escrow', escrowRoutes);

// Rutas de transacciones
app.use('/api/transactions', transactionRoutes);

// ========================================
// INICIALIZAR BASE DE DATOS
// ========================================
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  // Solo inicializar en desarrollo local
  initializeDatabase();
}

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

// Iniciar servidor solo en desarrollo local
// En Vercel, el servidor se maneja automáticamente
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor EasyClase corriendo en puerto ${PORT}`);
    console.log(`🔗 API disponible en: ${process.env.FRONTEND_URL || 'https://easyclaseapp.com'}/api`);
    console.log(`🔗 Prueba la API en: ${process.env.FRONTEND_URL || 'https://easyclaseapp.com'}/api/status`);
    console.log(`🔗 Login disponible en: ${process.env.FRONTEND_URL || 'https://easyclaseapp.com'}/api/auth/login`);
  });
} else {
  console.log('🚀 Servidor EasyClase corriendo en Vercel');
  console.log(`🔗 API disponible en: ${process.env.FRONTEND_URL || 'https://easyclaseapp.com'}/api`);
  console.log(`🔗 Login disponible en: ${process.env.FRONTEND_URL || 'https://easyclaseapp.com'}/api/auth/login`);
}

export default app;
