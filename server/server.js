import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

// Cargar variables de entorno
// En producción, usar .env, en desarrollo usar env.production
const envPath = process.env.NODE_ENV === 'production' ? './.env' : './env.production';
console.log(`🔧 Cargando variables de entorno desde: ${envPath}`);
console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

// Verificar que las variables críticas estén cargadas
console.log(`🔧 MP_ACCESS_TOKEN configurado: ${!!process.env.MP_ACCESS_TOKEN}`);
console.log(`🔧 MP_PUBLIC_KEY configurado: ${!!process.env.MP_PUBLIC_KEY}`);
if (process.env.MP_ACCESS_TOKEN) {
  console.log(`🔧 Tipo de token: ${process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 'TEST'}`);
}

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api', routes);

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
