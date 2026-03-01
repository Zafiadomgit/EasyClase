import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// ─── DB setup (Neon PostgreSQL) ───────────────────────────────────────────────
let sequelize, User, dbReady = false;

const initDB = async () => {
  if (dbReady) return;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL no configurada');
    return;
  }

  try {
    sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
      },
      pool: { max: 2, min: 0, acquire: 10000, idle: 5000 }
    });

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

    await sequelize.authenticate();
    // Crear tabla si no existe
    await User.sync({ force: false });
    dbReady = true;
    console.log('✅ Neon PostgreSQL conectado');
  } catch (e) {
    console.error('❌ Error conectando a DB:', e.message);
    dbReady = false;
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'dev_secret_change_in_prod', { expiresIn: '7d' });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_prod');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// ─── Rutas ───────────────────────────────────────────────────────────────────

// Status
app.get('/api/status', (req, res) =>
  res.json({ status: 'OK', message: 'EasyClase API funcionando', db: dbReady, timestamp: new Date().toISOString() })
);

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });

    await initDB();

    if (!dbReady || !User)
      return res.status(503).json({ success: false, message: 'Base de datos no disponible. Por favor intenta más tarde.' });

    const user = await User.findOne({ where: { email, activo: true } });
    if (!user)
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

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
    if (!nombre || !email || !password)
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son requeridos' });

    await initDB();

    if (!dbReady || !User)
      return res.status(503).json({ success: false, message: 'Base de datos no disponible' });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ success: false, message: 'Ya existe un usuario con este email' });

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      nombre, email, password: hashed,
      tipoUsuario: tipoUsuario || 'estudiante',
      codigoPais: codigoPais || '+57',
      telefono
    });

    const token = generateToken(newUser.id);
    const { password: _, ...userPublic } = newUser.toJSON();

    return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: { user: userPublic, token } });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// PROFILE
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!dbReady || !User)
      return res.status(503).json({ success: false, message: 'DB no disponible' });

    const user = await User.findByPk(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const { password: _, ...userPublic } = user.toJSON();
    res.json({ success: true, data: { user: userPublic } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error obteniendo perfil' });
  }
});

// UPDATE PROFILE
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!dbReady || !User)
      return res.status(503).json({ success: false, message: 'DB no disponible' });

    const user = await User.findByPk(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const allowed = ['nombre', 'telefono', 'codigoPais', 'ciudad', 'pais', 'descripcion', 'preferencias'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    await user.update(updates);
    const { password: _, ...userPublic } = user.toJSON();
    res.json({ success: true, message: 'Perfil actualizado', data: { user: userPublic } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error actualizando perfil' });
  }
});

// Preferencias GET
app.get('/api/auth/preferencias', authMiddleware, async (req, res) => {
  try {
    await initDB();
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ success: true, data: user.preferencias || {} });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

export default app;
