import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import sequelize, { testConnection, syncDatabase } from "./config/database.js";

// Importar rutas
import authRoutes from "./routes/auth.js";
import profesorRoutes from "./routes/profesores.js";
import claseRoutes from "./routes/clases.js";
import servicioRoutes from "./routes/servicios.js";
import perfilEnriquecidoRoutes from "./routes/perfilEnriquecido.js";
import adminRoutes from "./routes/admin.js";
import transactionRoutes from "./routes/transactions.js";
import escrowRoutes from "./routes/escrow.js";
import reviewRoutes from "./routes/reviews.js";

// Importar modelos
import User from "./models/User.js";
import Clase from "./models/Clase.js";
import Review from "./models/Review.js";

// Importar servicios
import { verificarPago } from "./services/mercadoPagoService.js";
import notificationScheduler from "./services/notificationSchedulerService.js";

// Configuración específica para Vercel con MySQL
import { vercelConfig, validateConfig } from './vercel-mysql-config.js';

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: '../.env' });

// Validar configuración en producción
if (process.env.NODE_ENV === 'production') {
  validateConfig();
}

const app = express();

// Configurar trust proxy para Vercel
app.set('trust proxy', 1);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: vercelConfig.FRONTEND_URL || process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const PORT = vercelConfig.PORT || process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// CORS configurado para el frontend
app.use(cors({
  origin: vercelConfig.FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting configurado para Vercel
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configurar para funcionar con proxies de Vercel
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});
app.use('/api/', limiter);

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conectar a MySQL
const connectToMySQL = async () => {
  try {
    await testConnection();
    console.log('✅ Conectado a MySQL (Dreamhost)');
    console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');
    console.log('🔗 Base de datos:', process.env.MYSQL_DATABASE || 'easyclasebd');
    
    // Sincronizar modelos
    await syncDatabase(false);
    console.log('✅ Modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Error crítico en producción - Verificar variables de entorno en Vercel');
    }
    process.exit(1);
  }
};

// Inicializar conexión a MySQL
connectToMySQL();

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/perfil-enriquecido', perfilEnriquecidoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/reviews', reviewRoutes);

// Ruta de estado de la API
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'EasyClase API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Importar el servicio de webhooks
import { procesarWebhook } from './services/webhookService.js';

// Webhook de MercadoPago mejorado
app.post("/webhook", procesarWebhook);

// Ruta legacy para crear pago (mantenida por compatibilidad)
app.post("/crear-pago", async (req, res) => {
  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: req.body.titulo,
            quantity: 1,
            currency_id: "COP",
            unit_price: req.body.precio
          }
        ],
        back_urls: {
          success: process.env.FRONTEND_SUCCESS_URL || "http://localhost:3001/pago-exitoso",
          failure: process.env.FRONTEND_FAILURE_URL || "http://localhost:3001/pago-fallido"
        },
        auto_return: "approved",
        notification_url: `${process.env.WEBHOOK_URL || 'http://localhost:3000'}/webhook`
      })
    });

    const data = await response.json();
    res.json({ url: data.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando el pago");
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error del servidor:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Iniciar servidor
// Socket.io para videollamadas
const activeRooms = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala de clase
  socket.on('join-room', ({ roomId, userId, userType }) => {
    socket.join(roomId);
    socket.userId = userId;
    socket.userType = userType;
    socket.roomId = roomId;

    // Actualizar sala activa
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, { users: [], started: false });
    }
    
    const room = activeRooms.get(roomId);
    room.users.push({ socketId: socket.id, userId, userType });
    
    // Notificar a otros usuarios en la sala
    socket.to(roomId).emit('user-joined', { userId, userType });
    
    console.log(`Usuario ${userId} (${userType}) se unió a la sala ${roomId}`);
  });

  // Señalización WebRTC
  socket.on('call-signal', ({ signal, roomId, userId }) => {
    socket.to(roomId).emit('call-signal', { signal, userId });
  });

  // Iniciar llamada
  socket.on('start-call', ({ roomId }) => {
    const room = activeRooms.get(roomId);
    if (room) {
      room.started = true;
      socket.to(roomId).emit('call-started');
    }
  });

  // Terminar llamada
  socket.on('end-call', ({ roomId }) => {
    socket.to(roomId).emit('call-ended');
    activeRooms.delete(roomId);
  });

  // Solicitud de compartir pantalla
  socket.on('screen-share-request', ({ roomId, userId, userType }) => {
    socket.to(roomId).emit('screen-share-request', { fromUserId: userId, fromUserType: userType });
  });

  // Respuesta de compartir pantalla
  socket.on('screen-share-response', ({ toUserId, allowed, roomId }) => {
    socket.to(roomId).emit('screen-share-response', { allowed });
  });

  // Chat en tiempo real
  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message', message);
  });

  // Anotaciones colaborativas (Premium)
  socket.on('annotation-data', ({ roomId, annotationData }) => {
    socket.to(roomId).emit('annotation-data', annotationData);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    
    // Limpiar de salas activas
    if (socket.roomId) {
      const room = activeRooms.get(socket.roomId);
      if (room) {
        room.users = room.users.filter(user => user.socketId !== socket.id);
        if (room.users.length === 0) {
          activeRooms.delete(socket.roomId);
        }
      }
      
      socket.to(socket.roomId).emit('user-left', { userId: socket.userId });
    }
  });
});

// Inicializar servidor
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor EasyClase corriendo en http://localhost:${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
  console.log(`🎥 Socket.io para videollamadas habilitado`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  
  // Iniciar programador de notificaciones
  try {
    notificationScheduler.start();
    console.log(`📧 Sistema de notificaciones por correo iniciado`);
  } catch (error) {
    console.error(`❌ Error iniciando sistema de notificaciones:`, error);
  }
});
