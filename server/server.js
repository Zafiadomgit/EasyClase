import express from 'express';
import cors from 'cors';

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

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
