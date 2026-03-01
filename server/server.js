import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import authRoutes from './routes/auth.js';

// Cargar variables de entorno (funciona tanto local como en Vercel)
dotenv.config();

const app = express();

// CORS abierto — necesario para Vercel serverless
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static('../public'));

// Rutas de la API
app.use('/api', routes);
app.use('/api/auth', authRoutes);

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EasyClase API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de login simple
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña son requeridos'
    });
  }
  
  // Mock de respuesta
  res.json({
    success: true,
    message: 'Login exitoso (modo test)',
    data: {
      user: {
        id: 1,
        nombre: 'Usuario Test',
        email: email,
        tipoUsuario: 'estudiante'
      },
      token: 'mock_jwt_token_123'
    }
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'EasyClase API funcionando',
    timestamp: new Date().toISOString()
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app;
