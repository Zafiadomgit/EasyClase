import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// ─── DB setup ────────────────────────────────────────────────────────────────
let sequelize, User;

const initDB = async () => {
  if (sequelize) return; // already initialized
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'easyclasebd_v2',
    process.env.MYSQL_USER || 'zafiadombd',
    process.env.MYSQL_PASSWORD || 'f9ZrKNH2bNuYT8d',
    {
      host: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
      port: process.env.MYSQL_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: { connectTimeout: 5000 },
      pool: { max: 2, min: 0, acquire: 5000, idle: 1000 }
    }
  );

  User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING(100),
    email: { type: DataTypes.STRING(100), unique: true },
    password: DataTypes.STRING(255),
    tipoUsuario: { type: DataTypes.ENUM('estudiante', 'profesor', 'admin'), defaultValue: 'estudiante' },
    telefono: DataTypes.STRING(20),
    codigoPais: { type: DataTypes.STRING(10), defaultValue: '+57' },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    preferencias: { type: DataTypes.JSON, defaultValue: {} }
  }, { tableName: 'users', timestamps: true });

  try {
    await sequelize.authenticate();
    console.log('✅ DB conectada');
  } catch (e) {
    console.warn('⚠️ DB no disponible:', e.message);
    sequelize = null; // mark as failed
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => res.json({ status: 'OK', message: 'EasyClase API funcionando', timestamp: new Date().toISOString() }));

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });

    await initDB();

    let user = null;
    if (sequelize && User) {
      try {
        user = await User.findOne({ where: { email, activo: true } });
      } catch (e) {
        console.warn('DB query failed:', e.message);
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const token = generateToken(user.id);
    const { password: _, ...userPublic } = user.toJSON();

    return res.json({ success: true, message: 'Login exitoso', data: { user: userPublic, token } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, tipoUsuario, codigoPais, telefono } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ success: false, message: 'Datos incompletos' });

    await initDB();

    if (!sequelize || !User) {
      return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    }

    const existing = await User.findOne({ where: { email } }).catch(() => null);
    if (existing) return res.status(400).json({ success: false, message: 'Ya existe un usuario con este email' });

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await User.create({ nombre, email, password: hashed, tipoUsuario: tipoUsuario || 'estudiante', codigoPais: codigoPais || '+57', telefono });

    const token = generateToken(newUser.id);
    const { password: _, ...userPublic } = newUser.toJSON();

    return res.status(201).json({ success: true, message: 'Usuario registrado', data: { user: userPublic, token } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// PROFILE
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!sequelize || !User) return res.status(503).json({ success: false, message: 'DB no disponible' });
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const { password: _, ...userPublic } = user.toJSON();
    res.json({ success: true, data: { user: userPublic } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error obteniendo perfil' });
  }
});

// 404 fallback
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

export default app;
