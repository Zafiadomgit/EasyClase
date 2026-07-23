import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';
import pg from 'pg'; // Import explícito para que Vercel lo incluya en el bundle (Sequelize lo carga con require dinámico)
import crypto from 'crypto';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const app = express();

// ─── Mercado Pago (Checkout Pro) ─────────────────────────────────────────────
// SDK oficial de backend. El Access Token es privado y se toma de las variables
// de entorno (MP_ACCESS_TOKEN; el token de pruebas empieza con el prefijo
// APP_USR). El cliente y los recursos se crean de forma perezosa para que la
// función arranque aunque falte la credencial (otras rutas siguen operativas).
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

let mpClient, mpPreference, mpPayment;
const getMercadoPago = () => {
  if (!MP_ACCESS_TOKEN) return null;
  if (!mpClient) {
    mpClient = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN, options: { timeout: 10000 } });
    mpPreference = new Preference(mpClient);
    mpPayment = new Payment(mpClient);
  }
  return { preference: mpPreference, payment: mpPayment };
};

// URL pública del frontend para construir las back_urls y el webhook.
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://easy-clase-er9o.vercel.app').replace(/\/$/, '');

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// ─── DB setup (Neon PostgreSQL) ───────────────────────────────────────────────
let sequelize, User, dbReady = false, lastDbError = null;

const initDB = async () => {
  if (dbReady) return;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL no configurada');
    return;
  }

  try {
    // Parseamos la URL nosotros mismos: el usuario del pooler de Supabase tiene un
    // punto (postgres.<ref>) y el parser de URI de Sequelize deja el password en null,
    // provocando un error en el login SASL de pg. Pasar campos explícitos lo evita.
    const dbUrl = new URL(connectionString);
    sequelize = new Sequelize(
      dbUrl.pathname.replace(/^\//, '') || 'postgres',
      decodeURIComponent(dbUrl.username),
      decodeURIComponent(dbUrl.password),
      {
        host: dbUrl.hostname,
        port: Number(dbUrl.port) || 5432,
        dialect: 'postgres',
        dialectModule: pg, // Evita "Please install pg package manually" en serverless
        logging: false,
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false }
        },
        pool: { max: 2, min: 0, acquire: 10000, idle: 5000 }
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
      preferencias: { type: DataTypes.JSON, defaultValue: {} },
      // ── Campos de perfil de profesor ─────────────────────────────
      bio: { type: DataTypes.TEXT, defaultValue: '' },
      especialidades: { type: DataTypes.JSON, defaultValue: [] },
      categoria: { type: DataTypes.STRING(80), defaultValue: '' },
      precioPorHora: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      calificacionPromedio: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
      totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
      totalClases: { type: DataTypes.INTEGER, defaultValue: 0 },
      estudiantesAyudados: { type: DataTypes.INTEGER, defaultValue: 0 },
      modalidad: { type: DataTypes.STRING(40), defaultValue: 'Online' },
      ubicacion: { type: DataTypes.STRING(120), defaultValue: '' },
      premium: { type: DataTypes.BOOLEAN, defaultValue: false },
      avatarUrl: { type: DataTypes.STRING(400), defaultValue: '' },
      profesorVisible: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { tableName: 'users', timestamps: true });

    await sequelize.authenticate();
    // alter:true añade columnas nuevas (perfil profesor) a la tabla existente
    await User.sync({ alter: true });
    await seedProfesores();
    dbReady = true;
    console.log('✅ Supabase PostgreSQL conectado');
  } catch (e) {
    console.error('❌ Error conectando a DB:', e.message);
    lastDbError = `${e.code ? e.code + ': ' : ''}${e.message}`;
    dbReady = false;
  }
};

// Seed idempotente de profesores demo (para que buscar/perfil tengan datos)
const seedProfesores = async () => {
  try {
    const count = await User.count({ where: { tipoUsuario: 'profesor' } });
    if (count > 0) return;
    const hashed = await bcrypt.hash('demo1234', 10);
    const demo = [
      { nombre: 'Laura Gómez', categoria: 'Programación', especialidades: ['JavaScript', 'React', 'Node.js'], precioPorHora: 45000, bio: 'Ingeniera de software con 6 años enseñando desarrollo web full-stack.', calificacionPromedio: 4.9, totalReviews: 128, totalClases: 340, estudiantesAyudados: 210, modalidad: 'Online', ubicacion: 'Bogotá', premium: true },
      { nombre: 'Carlos Ramírez', categoria: 'Excel & Office', especialidades: ['Excel', 'Tablas dinámicas', 'VBA'], precioPorHora: 30000, bio: 'Analista de datos. Te ayudo a dominar Excel desde cero hasta macros.', calificacionPromedio: 4.7, totalReviews: 86, totalClases: 190, estudiantesAyudados: 150, modalidad: 'Online', ubicacion: 'Medellín', premium: false },
      { nombre: 'Ana Martínez', categoria: 'Idiomas', especialidades: ['Inglés', 'Francés'], precioPorHora: 38000, bio: 'Profesora certificada de idiomas, enfoque conversacional y práctico.', calificacionPromedio: 4.8, totalReviews: 154, totalClases: 420, estudiantesAyudados: 300, modalidad: 'Online', ubicacion: 'Cali', premium: true },
      { nombre: 'Diego Torres', categoria: 'Diseño Gráfico', especialidades: ['Photoshop', 'Illustrator', 'Figma'], precioPorHora: 40000, bio: 'Diseñador UI/UX. Aprende diseño con proyectos reales.', calificacionPromedio: 4.6, totalReviews: 63, totalClases: 120, estudiantesAyudados: 95, modalidad: 'Online', ubicacion: 'Bogotá', premium: false },
      { nombre: 'Valentina Ríos', categoria: 'Apoyo Académico', especialidades: ['Matemáticas', 'Física', 'Química'], precioPorHora: 28000, bio: 'Estudiante de ingeniería, refuerzo escolar y universitario.', calificacionPromedio: 4.9, totalReviews: 97, totalClases: 260, estudiantesAyudados: 180, modalidad: 'Online', ubicacion: 'Barranquilla', premium: false }
    ];
    for (const d of demo) {
      await User.create({ ...d, email: `${d.nombre.toLowerCase().replace(/[^a-z]/g, '')}@demo.easyclase.com`, password: hashed, tipoUsuario: 'profesor', activo: true, profesorVisible: true });
    }
    console.log('🌱 Profesores demo creados');
  } catch (e) {
    console.warn('⚠️ Seed profesores omitido:', e.message);
  }
};

// Forma canónica de profesor: incluye ambos nombres de campo usados por las
// distintas páginas del frontend (precioPorHora/precioHora, premium/esPremium, etc.)
const shapeProfesor = (u) => {
  const j = u.toJSON ? u.toJSON() : u;
  const precio = Number(j.precioPorHora) || 0;
  const rating = Number(j.calificacionPromedio) || 0;
  return {
    _id: String(j.id), id: j.id,
    nombre: j.nombre,
    bio: j.bio || '', descripcion: j.bio || '',
    especialidades: j.especialidades || [],
    categoria: j.categoria || '',
    precioPorHora: precio, precioHora: precio,
    calificacionPromedio: rating,
    totalReviews: j.totalReviews || 0, totalResenas: j.totalReviews || 0,
    totalClases: j.totalClases || 0,
    estudiantesAyudados: j.estudiantesAyudados || 0,
    modalidad: j.modalidad || 'Online',
    ubicacion: j.ubicacion || '',
    premium: !!j.premium, esPremium: !!j.premium,
    avatarUrl: j.avatarUrl || '',
    disponibilidad: {},
    reseñas: []
  };
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

// Status + diagnóstico seguro de DB (no filtra el password; solo host/usuario/longitud/hash corto)
app.get('/api/status', async (req, res) => {
  const out = { status: 'OK', message: 'EasyClase API funcionando', timestamp: new Date().toISOString() };
  const cs = process.env.DATABASE_URL;
  out.hasDatabaseUrl = !!cs;

  if (cs) {
    try {
      const u = new URL(cs);
      out.dbUrl = {
        host: u.hostname,
        port: u.port || '(default)',
        user: decodeURIComponent(u.username),
        database: u.pathname.replace(/^\//, ''),
        passwordLength: u.password ? decodeURIComponent(u.password).length : 0,
        passwordSha8: u.password
          ? crypto.createHash('sha256').update(decodeURIComponent(u.password)).digest('hex').slice(0, 8)
          : null,
        rawLength: cs.length
      };
    } catch (e) {
      out.dbUrl = { parseError: e.message, rawLength: cs.length };
    }
  }

  try {
    await initDB();
    out.dbReady = dbReady;
    if (dbReady) {
      const [rows] = await sequelize.query('select current_user, current_database()');
      out.dbQuery = rows[0];
    } else {
      out.dbError = lastDbError;
    }
  } catch (e) {
    out.dbReady = false;
    out.dbError = `${e.code ? e.code + ': ' : ''}${e.message}`;
  }

  res.json(out);
});

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

// ─── Profesores ──────────────────────────────────────────────────────────────
const requireDB = async (res) => {
  await initDB();
  if (!dbReady || !User) {
    res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    return false;
  }
  return true;
};

// Buscar / listar profesores
app.get('/api/profesores', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const { categoria, q } = req.query;
    const where = { tipoUsuario: 'profesor', activo: true, profesorVisible: true };
    if (categoria) where.categoria = categoria;
    const profes = await User.findAll({
      where,
      order: [['premium', 'DESC'], ['calificacionPromedio', 'DESC']]
    });
    let data = profes.map(shapeProfesor);
    if (q) {
      const s = String(q).toLowerCase();
      data = data.filter(p =>
        p.nombre.toLowerCase().includes(s) ||
        (p.especialidades || []).some(e => String(e).toLowerCase().includes(s)) ||
        p.bio.toLowerCase().includes(s)
      );
    }
    res.json({ success: true, data: { profesores: data }, profesores: data });
  } catch (e) {
    console.error('Error buscando profesores:', e);
    res.status(500).json({ success: false, message: 'Error al buscar profesores' });
  }
});

// Profesores destacados
app.get('/api/profesores/destacados', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const profes = await User.findAll({
      where: { tipoUsuario: 'profesor', activo: true, profesorVisible: true },
      order: [['premium', 'DESC'], ['calificacionPromedio', 'DESC']],
      limit: 8
    });
    const data = profes.map(shapeProfesor);
    res.json({ success: true, data: { profesores: data }, profesores: data });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener destacados' });
  }
});

// Categorías (derivadas de los profesores existentes)
app.get('/api/profesores/categorias', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const profes = await User.findAll({
      where: { tipoUsuario: 'profesor', activo: true },
      attributes: ['categoria']
    });
    const categorias = [...new Set(profes.map(p => p.categoria).filter(Boolean))];
    res.json({ success: true, data: { categorias }, categorias });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener categorías' });
  }
});

// Perfil de un profesor
app.get('/api/profesores/:id', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const profe = await User.findOne({
      where: { id: req.params.id, tipoUsuario: 'profesor' }
    });
    if (!profe) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
    const profesor = shapeProfesor(profe);
    res.json({ success: true, data: { profesor }, profesor });
  } catch (e) {
    console.error('Error obteniendo profesor:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el profesor' });
  }
});

// ─── Pagos (Checkout Pro) ────────────────────────────────────────────────────

// Crear una preferencia de pago.
// Recibe los datos del ítem a cobrar y devuelve el `init_point` al que se debe
// redirigir al comprador para completar el pago en Mercado Pago.
//
// Body:
//   { titulo, precio, cantidad?, email?, referencia?, descripcion?, metadata? }
app.post('/api/pagos/crear-preferencia', async (req, res) => {
  try {
    const mp = getMercadoPago();
    if (!mp) {
      return res.status(503).json({
        success: false,
        message: 'Mercado Pago no está configurado. Falta la variable de entorno MP_ACCESS_TOKEN.'
      });
    }

    const { titulo, precio, cantidad, email, referencia, descripcion, metadata } = req.body || {};

    // Validaciones mínimas del ítem.
    const unitPrice = Number(precio);
    if (!titulo || !Number.isFinite(unitPrice) || unitPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren un título y un precio válido (mayor a 0).'
      });
    }
    const quantity = Number.isFinite(Number(cantidad)) && Number(cantidad) > 0 ? Math.floor(Number(cantidad)) : 1;

    const preferenceBody = {
      items: [
        {
          title: String(titulo),
          description: descripcion ? String(descripcion) : undefined,
          quantity,
          currency_id: 'COP',
          unit_price: unitPrice
        }
      ],
      back_urls: {
        success: `${FRONTEND_URL}/pago-exitoso`,
        failure: `${FRONTEND_URL}/pago-fallido`,
        pending: `${FRONTEND_URL}/pago-pendiente`
      },
      auto_return: 'approved',
      notification_url: `${FRONTEND_URL}/api/pagos/webhook`,
      ...(email ? { payer: { email: String(email) } } : {}),
      ...(referencia ? { external_reference: String(referencia) } : {}),
      ...(metadata && typeof metadata === 'object' ? { metadata } : {})
    };

    const result = await mp.preference.create({ body: preferenceBody });

    return res.status(201).json({
      success: true,
      data: {
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point
      }
    });
  } catch (error) {
    // El SDK expone el detalle del error de la API en error.message / error.cause.
    console.error('Error creando preferencia de Mercado Pago:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'No se pudo crear la preferencia de pago.',
      error: error?.message
    });
  }
});

// Consultar el estado de un pago por su ID (útil tras la redirección de vuelta
// desde Mercado Pago para confirmar la operación).
app.get('/api/pagos/:id', async (req, res) => {
  try {
    const mp = getMercadoPago();
    if (!mp) {
      return res.status(503).json({
        success: false,
        message: 'Mercado Pago no está configurado. Falta la variable de entorno MP_ACCESS_TOKEN.'
      });
    }

    const payment = await mp.payment.get({ id: req.params.id });
    return res.json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        external_reference: payment.external_reference,
        payment_method_id: payment.payment_method_id,
        date_approved: payment.date_approved
      }
    });
  } catch (error) {
    console.error('Error consultando pago de Mercado Pago:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'No se pudo consultar el estado del pago.',
      error: error?.message
    });
  }
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

export default app;
