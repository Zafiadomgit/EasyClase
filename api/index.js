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
let sequelize, User, Servicio, Transaccion, Plantilla, Disponibilidad, Review, Retiro, dbReady = false, lastDbError = null;

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
      profesorVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
      // ── 2FA (TOTP) ───────────────────────────────────────────────
      twofaSecret: { type: DataTypes.STRING(64), defaultValue: '' },
      twofaEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      twofaBackupCodes: { type: DataTypes.JSON, defaultValue: [] }
    }, { tableName: 'users', timestamps: true });

    // Servicios ofrecidos por los profesores (cursos, asesorías, consultorías).
    // Se usan STRING en vez de ENUM para evitar migraciones de tipos en Postgres.
    Servicio = sequelize.define('Servicio', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: { type: DataTypes.STRING(150), allowNull: false },
      descripcion: { type: DataTypes.TEXT, defaultValue: '' },
      categoria: { type: DataTypes.STRING(80), defaultValue: 'Otros' },
      tipo: { type: DataTypes.STRING(40), defaultValue: 'pregrabada' },
      precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      tiempoPrevistoValor: { type: DataTypes.INTEGER, defaultValue: 0 },
      tiempoPrevistoUnidad: { type: DataTypes.STRING(20), defaultValue: 'horas' },
      modalidad: { type: DataTypes.STRING(20), defaultValue: 'virtual' },
      urlVideo: { type: DataTypes.STRING(400), defaultValue: '' },
      requisitos: { type: DataTypes.TEXT, defaultValue: '' },
      objetivos: { type: DataTypes.TEXT, defaultValue: '' },
      // Materiales del servicio como enlaces: [{ nombre, url }]
      archivos: { type: DataTypes.JSON, defaultValue: [] },
      proveedor: { type: DataTypes.INTEGER, allowNull: false },
      estado: { type: DataTypes.STRING(20), defaultValue: 'activo' },
      premium: { type: DataTypes.BOOLEAN, defaultValue: false },
      calificacionPromedio: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
      totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
      totalVentas: { type: DataTypes.INTEGER, defaultValue: 0 },
      disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { tableName: 'servicios', timestamps: true });

    // Asociación: cada servicio pertenece a un usuario (proveedor).
    Servicio.belongsTo(User, { as: 'proveedorUser', foreignKey: 'proveedor' });

    // Transacciones: registro de cada pago (compra de servicio o reserva de clase).
    // Es la fuente de verdad de "Mis compras" y "Mis reservas".
    Transaccion = sequelize.define('Transaccion', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      usuario: { type: DataTypes.INTEGER, allowNull: true },       // comprador (payer)
      tipo: { type: DataTypes.STRING(20), defaultValue: 'servicio' }, // 'servicio' | 'clase'
      referencia: { type: DataTypes.STRING(120) },                 // external_reference de MP
      titulo: { type: DataTypes.STRING(200), defaultValue: '' },
      descripcion: { type: DataTypes.TEXT, defaultValue: '' },
      categoria: { type: DataTypes.STRING(80), defaultValue: '' },
      precio: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      estado: { type: DataTypes.STRING(20), defaultValue: 'pendiente' }, // pendiente|aprobado|rechazado
      preferenceId: { type: DataTypes.STRING(120), defaultValue: '' },
      paymentId: { type: DataTypes.STRING(120), defaultValue: '' },
      servicioId: { type: DataTypes.INTEGER, allowNull: true },
      profesorId: { type: DataTypes.INTEGER, allowNull: true },
      fecha: { type: DataTypes.STRING(20), defaultValue: '' },
      hora: { type: DataTypes.STRING(20), defaultValue: '' }
    }, { tableName: 'transacciones', timestamps: true, indexes: [{ fields: ['referencia'] }, { fields: ['usuario'] }] });

    // Plantillas de clase creadas por un profesor (clases en vivo ofrecidas).
    Plantilla = sequelize.define('Plantilla', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profesor: { type: DataTypes.INTEGER, allowNull: false },
      titulo: { type: DataTypes.STRING(150), allowNull: false },
      descripcion: { type: DataTypes.TEXT, defaultValue: '' },
      materia: { type: DataTypes.STRING(80), defaultValue: '' },
      categoria: { type: DataTypes.STRING(80), defaultValue: '' },
      tipo: { type: DataTypes.STRING(20), defaultValue: 'individual' },
      precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      duracion: { type: DataTypes.INTEGER, defaultValue: 1 },
      maxEstudiantes: { type: DataTypes.INTEGER, defaultValue: 1 },
      modalidad: { type: DataTypes.STRING(20), defaultValue: 'online' },
      requisitos: { type: DataTypes.TEXT, defaultValue: '' },
      objetivos: { type: DataTypes.TEXT, defaultValue: '' }
    }, { tableName: 'plantillas', timestamps: true, indexes: [{ fields: ['profesor'] }] });

    // Franjas de disponibilidad semanal del profesor.
    Disponibilidad = sequelize.define('Disponibilidad', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profesor: { type: DataTypes.INTEGER, allowNull: false },
      dia: { type: DataTypes.STRING(15), allowNull: false },
      horaInicio: { type: DataTypes.STRING(10), allowNull: false },
      horaFin: { type: DataTypes.STRING(10), allowNull: false },
      disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { tableName: 'disponibilidades', timestamps: true, indexes: [{ fields: ['profesor'] }] });

    // Reseñas de estudiantes sobre profesores.
    Review = sequelize.define('Review', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      autor: { type: DataTypes.INTEGER, allowNull: false },       // estudiante
      autorNombre: { type: DataTypes.STRING(100), defaultValue: '' },
      profesorId: { type: DataTypes.INTEGER, allowNull: false },
      calificacion: { type: DataTypes.INTEGER, defaultValue: 5 },
      comentario: { type: DataTypes.TEXT, defaultValue: '' },
      respuesta: { type: DataTypes.TEXT, defaultValue: '' }
    }, { tableName: 'reviews', timestamps: true, indexes: [{ fields: ['profesorId'] }, { fields: ['autor'] }] });

    // Solicitudes de retiro de dinero de los profesores.
    Retiro = sequelize.define('Retiro', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profesor: { type: DataTypes.INTEGER, allowNull: false },
      monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      comision: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      montoNeto: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      estado: { type: DataTypes.STRING(20), defaultValue: 'pendiente' }, // pendiente|aprobado|pagado|rechazado
      datosPago: { type: DataTypes.JSON, defaultValue: {} }
    }, { tableName: 'retiros', timestamps: true, indexes: [{ fields: ['profesor'] }, { fields: ['estado'] }] });

    await sequelize.authenticate();
    // alter:true añade columnas nuevas (perfil profesor) a la tabla existente
    await User.sync({ alter: true });
    await Servicio.sync({ alter: true });
    await Transaccion.sync({ alter: true });
    await Plantilla.sync({ alter: true });
    await Disponibilidad.sync({ alter: true });
    await Review.sync({ alter: true });
    await Retiro.sync({ alter: true });
    await seedProfesores();
    await seedServicios();
    await seedAdmin();
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

// Seed idempotente de servicios demo, asociados a profesores existentes, para
// que la página de servicios muestre contenido desde el arranque.
const seedServicios = async () => {
  try {
    const count = await Servicio.count();
    if (count > 0) return;
    const profes = await User.findAll({ where: { tipoUsuario: 'profesor' }, limit: 3 });
    if (profes.length === 0) return;
    const demo = [
      { titulo: 'Curso completo de Excel Avanzado', descripcion: 'Domina tablas dinámicas, fórmulas y macros con proyectos reales.', categoria: 'Contabilidad y Finanzas', tipo: 'pregrabada', precio: 60000, tiempoPrevistoValor: 8, tiempoPrevistoUnidad: 'horas', premium: true, calificacionPromedio: 4.8, totalReviews: 42, totalVentas: 120 },
      { titulo: 'Landing page profesional en React', descripcion: 'Construí y desplegá una landing moderna desde cero.', categoria: 'Desarrollo Web', tipo: 'asesoria', precio: 90000, tiempoPrevistoValor: 2, tiempoPrevistoUnidad: 'semanas', premium: false, calificacionPromedio: 4.9, totalReviews: 30, totalVentas: 65 },
      { titulo: 'Asesoría de tesis y trabajos académicos', descripcion: 'Acompañamiento metodológico y de redacción para tu tesis.', categoria: 'Tesis y Trabajos Académicos', tipo: 'consultoria', precio: 45000, tiempoPrevistoValor: 3, tiempoPrevistoUnidad: 'días', premium: false, calificacionPromedio: 4.7, totalReviews: 51, totalVentas: 88 }
    ];
    for (let i = 0; i < demo.length; i++) {
      await Servicio.create({ ...demo[i], proveedor: profes[i % profes.length].id, estado: 'activo', disponible: true });
    }
    console.log('🌱 Servicios demo creados');
  } catch (e) {
    console.warn('⚠️ Seed servicios omitido:', e.message);
  }
};

// Asegura un usuario administrador a partir de variables de entorno, sin dejar
// credenciales en el código (el repo es público). Configurar ADMIN_EMAIL y
// ADMIN_PASSWORD en Vercel y redeployar para poder entrar al panel admin.
const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return; // sin credenciales configuradas no se crea admin
    const hashed = await bcrypt.hash(password, 10);
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      await existing.update({ tipoUsuario: 'admin', password: hashed, activo: true });
    } else {
      await User.create({ nombre: 'Administrador', email, password: hashed, tipoUsuario: 'admin', activo: true });
    }
    console.log('🛡️ Usuario admin asegurado:', email);
  } catch (e) {
    console.warn('⚠️ Seed admin omitido:', e.message);
  }
};

// Forma canónica de servicio para el frontend (incluye _id e id, y el proveedor).
const shapeServicio = (s) => {
  const j = s.toJSON ? s.toJSON() : s;
  const prov = j.proveedorUser || null;
  return {
    _id: String(j.id), id: j.id,
    titulo: j.titulo,
    descripcion: j.descripcion || '',
    categoria: j.categoria || 'Otros',
    tipo: j.tipo || 'pregrabada',
    precio: Number(j.precio) || 0,
    tiempoPrevisto: { valor: j.tiempoPrevistoValor || 0, unidad: j.tiempoPrevistoUnidad || 'horas' },
    modalidad: j.modalidad || 'virtual',
    urlVideo: j.urlVideo || '',
    requisitos: j.requisitos || '',
    objetivos: j.objetivos || '',
    archivos: Array.isArray(j.archivos) ? j.archivos : [],
    estado: j.estado || 'activo',
    premium: !!j.premium, esPremium: !!j.premium,
    calificacionPromedio: Number(j.calificacionPromedio) || 0,
    totalReviews: j.totalReviews || 0,
    totalVentas: j.totalVentas || 0,
    disponible: !!j.disponible,
    proveedor: prov ? { _id: String(prov.id), id: prov.id, nombre: prov.nombre } : { id: j.proveedor },
    proveedorNombre: prov ? prov.nombre : ''
  };
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

// Extrae el userId si viene un token válido, sin bloquear si no lo hay.
// Se usa en el cobro para asociar la transacción al comprador cuando está logueado.
const getUserIdOptional = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_prod').userId;
  } catch {
    return null;
  }
};

// Middleware de administrador: exige token válido Y que el usuario sea admin.
const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_prod');
    await initDB();
    if (!dbReady || !User) return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    const user = await User.findByPk(decoded.userId);
    if (!user || !['admin', 'superadmin'].includes(user.tipoUsuario)) {
      return res.status(403).json({ success: false, message: 'Acceso solo para administradores' });
    }
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

// ─── 2FA (persistencia de la config por usuario) ─────────────────────────────
// La generación/verificación TOTP ocurre en el cliente; aquí solo se guarda el
// secreto y los códigos de respaldo asociados al usuario.
app.get('/api/2fa', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!dbReady || !User) return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    const u = await User.findByPk(req.userId);
    if (!u) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    if (!u.twofaEnabled) return res.json({ success: true, enabled: false, config: null });
    res.json({
      success: true,
      enabled: true,
      config: { secret: u.twofaSecret, backupCodes: u.twofaBackupCodes || [], createdAt: u.updatedAt }
    });
  } catch (e) {
    console.error('Error obteniendo 2FA:', e);
    res.status(500).json({ success: false, message: 'Error al obtener la configuración 2FA' });
  }
});

app.post('/api/2fa', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!dbReady || !User) return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    const u = await User.findByPk(req.userId);
    if (!u) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const { secret, backupCodes } = req.body || {};
    if (!secret) return res.status(400).json({ success: false, message: 'Secreto requerido' });
    await u.update({ twofaSecret: String(secret), twofaBackupCodes: Array.isArray(backupCodes) ? backupCodes : [], twofaEnabled: true });
    res.json({ success: true, message: '2FA activado' });
  } catch (e) {
    console.error('Error guardando 2FA:', e);
    res.status(500).json({ success: false, message: 'Error al guardar la configuración 2FA' });
  }
});

app.delete('/api/2fa', authMiddleware, async (req, res) => {
  try {
    await initDB();
    if (!dbReady || !User) return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
    const u = await User.findByPk(req.userId);
    if (!u) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    await u.update({ twofaSecret: '', twofaBackupCodes: [], twofaEnabled: false });
    res.json({ success: true, message: '2FA desactivado' });
  } catch (e) {
    console.error('Error deshabilitando 2FA:', e);
    res.status(500).json({ success: false, message: 'Error al desactivar 2FA' });
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
// Comisión de la plataforma según si el profesor es premium.
const comisionProfesor = (u) => (u?.premium ? 0.15 : 0.20);

// Calcula el balance disponible para retiro de un profesor.
const calcularBalance = async (prof) => {
  const claseGross = (await Transaccion.sum('precio', { where: { profesorId: prof.id, tipo: 'clase', estado: 'aprobado' } })) || 0;
  const misServicios = await Servicio.findAll({ where: { proveedor: prof.id }, attributes: ['id'] });
  const ids = misServicios.map(s => s.id);
  const servicioGross = ids.length ? ((await Transaccion.sum('precio', { where: { servicioId: ids, tipo: 'servicio', estado: 'aprobado' } })) || 0) : 0;
  const bruto = Number(claseGross) + Number(servicioGross);
  const comision = comisionProfesor(prof);
  const neto = bruto * (1 - comision);
  const retirado = (await Retiro.sum('monto', { where: { profesor: prof.id, estado: ['pendiente', 'aprobado', 'pagado'] } })) || 0;
  return { bruto, comision, disponible: Math.max(0, Math.round(neto - Number(retirado))) };
};

// Balance disponible del profesor (antes de /profesores/:id).
app.get('/api/profesores/balance', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const prof = await User.findByPk(req.userId);
    if (!prof) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const { comision, disponible, bruto } = await calcularBalance(prof);
    res.json({ success: true, data: { balanceDisponible: disponible, comision, montoMinimoRetiro: 50000, totalGanado: Math.round(bruto) } });
  } catch (e) {
    console.error('Error calculando balance:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el balance' });
  }
});

// Solicitar un retiro (queda pendiente hasta que el admin lo procese).
app.post('/api/profesores/retirar', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const prof = await User.findByPk(req.userId);
    if (!prof) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const monto = Number(req.body?.monto);
    const { comision, disponible } = await calcularBalance(prof);
    if (!Number.isFinite(monto) || monto <= 0) return res.status(400).json({ success: false, message: 'Monto inválido' });
    if (monto > disponible) return res.status(400).json({ success: false, message: 'El monto supera tu balance disponible' });
    const retiro = await Retiro.create({
      profesor: prof.id,
      monto,
      comision: Math.round(monto * comision),
      montoNeto: Math.round(monto * (1 - comision)),
      estado: 'pendiente',
      datosPago: req.body?.datosPago && typeof req.body.datosPago === 'object' ? req.body.datosPago : {}
    });
    res.status(201).json({ success: true, message: 'Solicitud de retiro enviada', data: { retiro: retiro.toJSON() } });
  } catch (e) {
    console.error('Error creando retiro:', e);
    res.status(500).json({ success: false, message: 'Error al solicitar el retiro' });
  }
});

// Retiros del profesor autenticado.
app.get('/api/profesores/retiros', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const retiros = await Retiro.findAll({ where: { profesor: req.userId }, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: { retiros: retiros.map(r => r.toJSON()) } });
  } catch (e) {
    console.error('Error obteniendo retiros:', e);
    res.status(500).json({ success: false, message: 'Error al obtener los retiros' });
  }
});

app.get('/api/profesores/:id', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const profe = await User.findOne({
      where: { id: req.params.id, tipoUsuario: 'profesor' }
    });
    if (!profe) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
    const profesor = shapeProfesor(profe);
    // Adjuntar reseñas reales del profesor.
    try {
      const reviews = await Review.findAll({ where: { profesorId: profe.id }, order: [['createdAt', 'DESC']] });
      profesor.reseñas = reviews.map(shapeReview);
    } catch { profesor.reseñas = []; }
    // Adjuntar las clases (plantillas) que ofrece el profesor.
    try {
      const clases = await Plantilla.findAll({ where: { profesor: profe.id }, order: [['createdAt', 'DESC']] });
      profesor.clases = clases.map(shapePlantilla);
    } catch { profesor.clases = []; }
    res.json({ success: true, data: { profesor }, profesor });
  } catch (e) {
    console.error('Error obteniendo profesor:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el profesor' });
  }
});

// ─── Reseñas ─────────────────────────────────────────────────────────────────
const shapeReview = (r) => {
  const j = r.toJSON ? r.toJSON() : r;
  return {
    id: j.id,
    estudiante: j.autorNombre || 'Estudiante',
    calificacion: j.calificacion || 5,
    comentario: j.comentario || '',
    respuesta: j.respuesta || '',
    fecha: j.createdAt ? new Date(j.createdAt).toLocaleDateString('es-ES') : ''
  };
};

// Recalcula el promedio y total de reseñas del profesor.
const recomputarRatingProfesor = async (profesorId) => {
  const reviews = await Review.findAll({ where: { profesorId } });
  const total = reviews.length;
  const prom = total ? reviews.reduce((a, r) => a + (r.calificacion || 0), 0) / total : 0;
  await User.update(
    { calificacionPromedio: Math.round(prom * 100) / 100, totalReviews: total },
    { where: { id: profesorId } }
  );
};

// Reseñas de un profesor (antes de /reviews/:id...).
app.get('/api/reviews/profesor/:id', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const reviews = await Review.findAll({ where: { profesorId: req.params.id }, order: [['createdAt', 'DESC']] });
    const data = reviews.map(shapeReview);
    res.json({ success: true, data: { reviews: data }, reviews: data });
  } catch (e) {
    console.error('Error obteniendo reseñas:', e);
    res.status(500).json({ success: false, message: 'Error al obtener las reseñas' });
  }
});

// Reseñas escritas por el estudiante autenticado.
app.get('/api/reviews/mis-reviews', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const reviews = await Review.findAll({ where: { autor: req.userId }, order: [['createdAt', 'DESC']] });
    const data = reviews.map(shapeReview);
    res.json({ success: true, data: { reviews: data }, reviews: data });
  } catch (e) {
    console.error('Error obteniendo mis reseñas:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus reseñas' });
  }
});

// Crear una reseña sobre un profesor.
app.post('/api/reviews', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const b = req.body || {};
    const profesorId = Number(b.profesorId);
    const calificacion = Number(b.calificacion);
    if (!Number.isFinite(profesorId)) {
      return res.status(400).json({ success: false, message: 'Profesor inválido' });
    }
    if (!Number.isFinite(calificacion) || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ success: false, message: 'La calificación debe estar entre 1 y 5' });
    }
    const autorUser = await User.findByPk(req.userId);
    const nueva = await Review.create({
      autor: req.userId,
      autorNombre: autorUser?.nombre || 'Estudiante',
      profesorId,
      calificacion: Math.round(calificacion),
      comentario: b.comentario ? String(b.comentario) : ''
    });
    await recomputarRatingProfesor(profesorId);
    res.status(201).json({ success: true, message: 'Reseña publicada', data: { review: shapeReview(nueva) } });
  } catch (e) {
    console.error('Error creando reseña:', e);
    res.status(500).json({ success: false, message: 'Error al publicar la reseña' });
  }
});

// Responder a una reseña (el profesor dueño).
app.put('/api/reviews/:id/responder', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const r = await Review.findByPk(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    if (r.profesorId !== req.userId) return res.status(403).json({ success: false, message: 'No autorizado' });
    await r.update({ respuesta: req.body?.comentario ? String(req.body.comentario) : '' });
    res.json({ success: true, message: 'Respuesta guardada', data: { review: shapeReview(r) } });
  } catch (e) {
    console.error('Error respondiendo reseña:', e);
    res.status(500).json({ success: false, message: 'Error al responder la reseña' });
  }
});

// ─── Servicios ───────────────────────────────────────────────────────────────
const CATEGORIAS_SERVICIOS = [
  'Tesis y Trabajos Académicos', 'Desarrollo Web', 'Desarrollo de Apps',
  'Diseño Gráfico', 'Marketing Digital', 'Consultoría de Negocios', 'Traducción',
  'Redacción de Contenido', 'Asesoría Legal', 'Contabilidad y Finanzas',
  'Fotografía', 'Video y Edición', 'Arquitectura y Diseño', 'Ingeniería', 'Otros'
];
const incluirProveedor = () => [{ model: User, as: 'proveedorUser', attributes: ['id', 'nombre'] }];

// Normaliza la lista de materiales (enlaces) del servicio: [{ nombre, url }].
const sanitizeArchivos = (arr) => Array.isArray(arr)
  ? arr.filter(a => a && a.url).map(a => ({ nombre: String(a.nombre || 'Material'), url: String(a.url) })).slice(0, 30)
  : [];

// Categorías disponibles (lista fija). Debe ir antes de /servicios/:id.
app.get('/api/servicios/categorias', (req, res) => {
  res.json({ success: true, data: { categorias: CATEGORIAS_SERVICIOS }, categorias: CATEGORIAS_SERVICIOS });
});

// Servicios del usuario autenticado. Debe ir antes de /servicios/:id.
app.get('/api/servicios/usuario/mis-servicios', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const servicios = await Servicio.findAll({
      where: { proveedor: req.userId },
      include: incluirProveedor(),
      order: [['createdAt', 'DESC']]
    });
    const data = servicios.map(shapeServicio);
    res.json({ success: true, data: { servicios: data }, servicios: data });
  } catch (e) {
    console.error('Error obteniendo mis servicios:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus servicios' });
  }
});

// Buscar / listar servicios activos.
app.get('/api/servicios', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const { categoria, q } = req.query;
    const where = { estado: 'activo', disponible: true };
    if (categoria) where.categoria = categoria;
    const servicios = await Servicio.findAll({
      where,
      include: incluirProveedor(),
      order: [['premium', 'DESC'], ['createdAt', 'DESC']]
    });
    let data = servicios.map(shapeServicio);
    if (q) {
      const s = String(q).toLowerCase();
      data = data.filter(x =>
        x.titulo.toLowerCase().includes(s) ||
        x.descripcion.toLowerCase().includes(s) ||
        x.categoria.toLowerCase().includes(s)
      );
    }
    res.json({ success: true, data: { servicios: data }, servicios: data });
  } catch (e) {
    console.error('Error buscando servicios:', e);
    res.status(500).json({ success: false, message: 'Error al buscar servicios' });
  }
});

// Detalle de un servicio.
app.get('/api/servicios/:id', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const s = await Servicio.findByPk(req.params.id, { include: incluirProveedor() });
    if (!s) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    const servicio = shapeServicio(s);
    res.json({ success: true, data: { servicio }, servicio });
  } catch (e) {
    console.error('Error obteniendo servicio:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el servicio' });
  }
});

// Crear un servicio (proveedor autenticado).
app.post('/api/servicios', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const b = req.body || {};
    const precio = Number(b.precio);
    if (!b.titulo || !b.descripcion || !b.categoria) {
      return res.status(400).json({ success: false, message: 'Título, descripción y categoría son obligatorios' });
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      return res.status(400).json({ success: false, message: 'El precio debe ser un número mayor a 0' });
    }
    const tp = b.tiempoPrevisto || {};
    const nuevo = await Servicio.create({
      titulo: b.titulo,
      descripcion: b.descripcion,
      categoria: b.categoria,
      tipo: b.tipo || 'pregrabada',
      precio,
      tiempoPrevistoValor: Number(tp.valor) || 0,
      tiempoPrevistoUnidad: tp.unidad || 'horas',
      modalidad: b.modalidad || 'virtual',
      urlVideo: b.urlVideo || '',
      requisitos: b.requisitos || '',
      objetivos: b.objetivos || '',
      archivos: sanitizeArchivos(b.archivos),
      proveedor: req.userId,
      estado: 'activo',
      disponible: true
    });
    const conProveedor = await Servicio.findByPk(nuevo.id, { include: incluirProveedor() });
    res.status(201).json({ success: true, message: 'Servicio creado', data: { servicio: shapeServicio(conProveedor) } });
  } catch (e) {
    console.error('Error creando servicio:', e);
    res.status(500).json({ success: false, message: 'Error al crear el servicio' });
  }
});

// Actualizar un servicio (solo el proveedor dueño).
app.put('/api/servicios/:id', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const s = await Servicio.findByPk(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    if (s.proveedor !== req.userId) return res.status(403).json({ success: false, message: 'No autorizado' });

    const b = req.body || {};
    const updates = {};
    ['titulo', 'descripcion', 'categoria', 'tipo', 'modalidad', 'urlVideo', 'requisitos', 'objetivos', 'estado'].forEach(k => {
      if (b[k] !== undefined) updates[k] = b[k];
    });
    if (b.archivos !== undefined) updates.archivos = sanitizeArchivos(b.archivos);
    if (b.precio !== undefined) {
      const precio = Number(b.precio);
      if (Number.isFinite(precio) && precio > 0) updates.precio = precio;
    }
    if (b.tiempoPrevisto) {
      if (b.tiempoPrevisto.valor !== undefined) updates.tiempoPrevistoValor = Number(b.tiempoPrevisto.valor) || 0;
      if (b.tiempoPrevisto.unidad !== undefined) updates.tiempoPrevistoUnidad = b.tiempoPrevisto.unidad;
    }
    await s.update(updates);
    const conProveedor = await Servicio.findByPk(s.id, { include: incluirProveedor() });
    res.json({ success: true, message: 'Servicio actualizado', data: { servicio: shapeServicio(conProveedor) } });
  } catch (e) {
    console.error('Error actualizando servicio:', e);
    res.status(500).json({ success: false, message: 'Error al actualizar el servicio' });
  }
});

// Eliminar un servicio (solo el proveedor dueño).
app.delete('/api/servicios/:id', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const s = await Servicio.findByPk(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    if (s.proveedor !== req.userId) return res.status(403).json({ success: false, message: 'No autorizado' });
    await s.destroy();
    res.json({ success: true, message: 'Servicio eliminado' });
  } catch (e) {
    console.error('Error eliminando servicio:', e);
    res.status(500).json({ success: false, message: 'Error al eliminar el servicio' });
  }
});

// ─── Panel de profesor: plantillas de clase ──────────────────────────────────
const shapePlantilla = (p) => {
  const j = p.toJSON ? p.toJSON() : p;
  return {
    id: j.id,
    titulo: j.titulo,
    descripcion: j.descripcion || '',
    materia: j.materia || '',
    categoria: j.categoria || '',
    tipo: j.tipo || 'individual',
    precio: Number(j.precio) || 0,
    duracion: j.duracion || 1,
    maxEstudiantes: j.maxEstudiantes || 1,
    max_estudiantes: j.maxEstudiantes || 1,
    modalidad: j.modalidad || 'online'
  };
};

// Plantillas del profesor autenticado.
app.get('/api/plantillas', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const plantillas = await Plantilla.findAll({ where: { profesor: req.userId }, order: [['createdAt', 'DESC']] });
    const data = plantillas.map(shapePlantilla);
    res.json({ success: true, data: { plantillas: data }, plantillas: data });
  } catch (e) {
    console.error('Error obteniendo plantillas:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus clases' });
  }
});

// Crear una plantilla de clase.
app.post('/api/plantillas', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const b = req.body || {};
    const precio = Number(b.precio);
    if (!b.titulo || !b.descripcion || !b.materia || !b.categoria) {
      return res.status(400).json({ success: false, message: 'Título, descripción, materia y categoría son obligatorios' });
    }
    if (!Number.isFinite(precio) || precio < 10) {
      return res.status(400).json({ success: false, message: 'El precio debe ser como mínimo $10' });
    }
    const tipo = b.tipo === 'grupal' ? 'grupal' : 'individual';
    const nueva = await Plantilla.create({
      profesor: req.userId,
      titulo: b.titulo,
      descripcion: b.descripcion,
      materia: b.materia,
      categoria: b.categoria,
      tipo,
      precio,
      duracion: Number(b.duracion) || 1,
      maxEstudiantes: tipo === 'grupal' ? (Number(b.maxEstudiantes) || 5) : 1,
      modalidad: b.modalidad || 'online',
      requisitos: b.requisitos || '',
      objetivos: b.objetivos || ''
    });
    res.status(201).json({ success: true, message: 'Clase creada', data: { plantilla: shapePlantilla(nueva) } });
  } catch (e) {
    console.error('Error creando plantilla:', e);
    res.status(500).json({ success: false, message: 'Error al crear la clase' });
  }
});

// Eliminar una plantilla (solo el profesor dueño).
app.delete('/api/plantillas/:id', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const p = await Plantilla.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    if (p.profesor !== req.userId) return res.status(403).json({ success: false, message: 'No autorizado' });
    await p.destroy();
    res.json({ success: true, message: 'Clase eliminada' });
  } catch (e) {
    console.error('Error eliminando plantilla:', e);
    res.status(500).json({ success: false, message: 'Error al eliminar la clase' });
  }
});

// ─── Panel de profesor: disponibilidad ───────────────────────────────────────
const shapeHorario = (h) => {
  const j = h.toJSON ? h.toJSON() : h;
  return { id: j.id, dia: j.dia, horaInicio: j.horaInicio, horaFin: j.horaFin, disponible: !!j.disponible };
};

// Horarios del profesor autenticado.
app.get('/api/profesor/horarios', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const horarios = await Disponibilidad.findAll({ where: { profesor: req.userId }, order: [['dia', 'ASC'], ['horaInicio', 'ASC']] });
    const data = horarios.map(shapeHorario);
    res.json({ success: true, data: { horarios: data }, horarios: data });
  } catch (e) {
    console.error('Error obteniendo horarios:', e);
    res.status(500).json({ success: false, message: 'Error al obtener los horarios' });
  }
});

// Guardar (reemplazar) el set completo de horarios del profesor.
app.post('/api/profesor/horarios', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const horarios = Array.isArray(req.body?.horarios) ? req.body.horarios : [];
    // Reemplazo total: se borran los del profesor y se recrean.
    await Disponibilidad.destroy({ where: { profesor: req.userId } });
    const filas = horarios
      .filter(h => h && h.dia && h.horaInicio && h.horaFin)
      .map(h => ({
        profesor: req.userId,
        dia: String(h.dia),
        horaInicio: String(h.horaInicio),
        horaFin: String(h.horaFin),
        disponible: h.disponible !== false
      }));
    const creados = filas.length ? await Disponibilidad.bulkCreate(filas) : [];
    const data = creados.map(shapeHorario);
    res.json({ success: true, message: 'Horarios guardados', data: { horarios: data }, horarios: data });
  } catch (e) {
    console.error('Error guardando horarios:', e);
    res.status(500).json({ success: false, message: 'Error al guardar los horarios' });
  }
});

// ─── Mis compras / Mis reservas (transacciones) ──────────────────────────────

// Servicios comprados por el usuario autenticado.
app.get('/api/compras-servicios/mis-compras', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const txs = await Transaccion.findAll({
      where: { usuario: req.userId, tipo: 'servicio' },
      order: [['createdAt', 'DESC']]
    });
    // Traer los servicios comprados para adjuntar sus materiales.
    const servicioIds = [...new Set(txs.map(t => t.servicioId).filter(Boolean))];
    const servicios = servicioIds.length ? await Servicio.findAll({ where: { id: servicioIds } }) : [];
    const servMap = {};
    servicios.forEach(s => { servMap[s.id] = s.toJSON(); });

    const compras = txs.map(t => {
      const j = t.toJSON();
      const estado = j.estado === 'aprobado' ? 'pagado' : j.estado === 'rechazado' ? 'reembolsado' : 'pendiente';
      const serv = servMap[j.servicioId];
      // Solo se entregan los materiales si el pago está aprobado.
      const archivos = (estado === 'pagado' && serv && Array.isArray(serv.archivos)) ? serv.archivos : [];
      return {
        id: j.id,
        estado,
        precio: Number(j.precio) || 0,
        createdAt: j.createdAt,
        servicioInfo: { titulo: j.titulo, descripcion: j.descripcion || '' },
        archivos
      };
    });
    res.json({ success: true, data: { compras }, compras });
  } catch (e) {
    console.error('Error obteniendo mis compras:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus compras' });
  }
});

// Reservas de clase del usuario autenticado.
app.get('/api/reservas/mis-reservas', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const txs = await Transaccion.findAll({
      where: { usuario: req.userId, tipo: 'clase' },
      order: [['createdAt', 'DESC']]
    });
    const reservas = txs.map(t => {
      const j = t.toJSON();
      const estado = j.estado === 'aprobado' ? 'confirmada' : j.estado === 'rechazado' ? 'cancelada' : 'pendiente';
      return {
        id: j.id,
        titulo: j.titulo,
        categoria: j.categoria || '',
        materia: j.categoria || '',
        descripcion: j.descripcion || '',
        estado,
        fecha: j.fecha || '',
        hora: j.hora || '',
        precio: Number(j.precio) || 0,
        comentarios: '',
        created_at: j.createdAt
      };
    });
    res.json({ success: true, data: { reservas }, reservas });
  } catch (e) {
    console.error('Error obteniendo mis reservas:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus reservas' });
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

    // Registrar la transacción (best-effort) para "Mis compras" / "Mis reservas".
    // No bloquea el cobro si la base falla.
    try {
      await initDB();
      if (Transaccion) {
        const b = req.body || {};
        await Transaccion.create({
          usuario: getUserIdOptional(req),
          tipo: b.tipo === 'clase' ? 'clase' : 'servicio',
          referencia: referencia ? String(referencia) : String(result.id),
          titulo: String(titulo),
          descripcion: descripcion ? String(descripcion) : '',
          categoria: b.categoria ? String(b.categoria) : '',
          precio: unitPrice * quantity,
          estado: 'pendiente',
          preferenceId: result.id,
          servicioId: Number.isFinite(Number(b.servicioId)) ? Number(b.servicioId) : null,
          profesorId: Number.isFinite(Number(b.profesorId)) ? Number(b.profesorId) : null,
          fecha: b.fecha ? String(b.fecha) : '',
          hora: b.hora ? String(b.hora) : ''
        });
      }
    } catch (e) {
      console.warn('⚠️ No se pudo registrar la transacción:', e.message);
    }

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

// ─── Admin ───────────────────────────────────────────────────────────────────
const mapEstadoPago = (e) => e === 'aprobado' ? 'completado' : e === 'rechazado' ? 'fallido' : 'pendiente';

// Mapa userId -> nombre para resolver comprador/profesor en listados.
const nombreMapUsuarios = async () => {
  const map = {};
  const users = await User.findAll({ attributes: ['id', 'nombre'] });
  users.forEach(u => { map[u.id] = u.nombre; });
  return map;
};

// Dashboard: métricas generales + top profesores.
app.get('/api/admin/dashboard', adminMiddleware, async (req, res) => {
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0);

    const [totalUsers, totalTeachers, totalClasses, totalRevenue, newUsersThisMonth] = await Promise.all([
      User.count(),
      User.count({ where: { tipoUsuario: 'profesor' } }),
      Transaccion.count(),
      Transaccion.sum('precio', { where: { estado: 'aprobado' } }),
      User.count({ where: { createdAt: { [Sequelize.Op.gte]: inicioMes } } })
    ]);

    const profes = await User.findAll({
      where: { tipoUsuario: 'profesor' },
      order: [['totalClases', 'DESC']],
      limit: 5
    });
    const topTeachers = profes.map(p => {
      const j = p.toJSON();
      return {
        _id: String(j.id),
        nombre: j.nombre,
        email: j.email,
        totalClases: j.totalClases || 0,
        totalIngresos: Math.round((Number(j.precioPorHora) || 0) * (j.totalClases || 0)),
        calificacion: Number(j.calificacionPromedio) || 0
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTeachers,
          totalClasses,
          totalRevenue: Number(totalRevenue) || 0,
          newUsersThisMonth,
          pendingDisputes: 0
        },
        topTeachers
      }
    });
  } catch (e) {
    console.error('Error en admin dashboard:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el dashboard' });
  }
});

// Lista de usuarios.
app.get('/api/admin/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    const usuarios = users.map(u => {
      const j = u.toJSON();
      return {
        id: j.id,
        nombre: j.nombre,
        email: j.email,
        tipoUsuario: j.tipoUsuario,
        fechaRegistro: j.createdAt,
        estado: j.activo === false ? 'bloqueado' : 'activo',
        ultimoAcceso: j.updatedAt,
        premium: !!j.premium,
        clasesImpartidas: j.totalClases || 0,
        clasesTomadas: 0
      };
    });
    res.json({ success: true, data: { usuarios }, usuarios });
  } catch (e) {
    console.error('Error en admin users:', e);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

// Bloquear / desbloquear usuario.
app.put('/api/admin/users/:id/estado', adminMiddleware, async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id);
    if (!u) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const activo = req.body?.activo !== false && req.body?.estado !== 'bloqueado';
    await u.update({ activo });
    res.json({ success: true, message: activo ? 'Usuario activado' : 'Usuario bloqueado' });
  } catch (e) {
    console.error('Error cambiando estado de usuario:', e);
    res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
  }
});

// Lista de pagos (transacciones).
app.get('/api/admin/payments', adminMiddleware, async (req, res) => {
  try {
    const [txs, nombres] = await Promise.all([
      Transaccion.findAll({ order: [['createdAt', 'DESC']] }),
      nombreMapUsuarios()
    ]);
    const pagos = txs.map(t => {
      const j = t.toJSON();
      return {
        id: j.id,
        estudiante: nombres[j.usuario] || 'Usuario',
        profesor: nombres[j.profesorId] || (j.tipo === 'servicio' ? 'Servicio' : '—'),
        clase: j.titulo,
        monto: Number(j.precio) || 0,
        fecha: j.createdAt,
        estado: mapEstadoPago(j.estado),
        metodo: 'mercadopago',
        transactionId: j.paymentId || j.preferenceId || String(j.id)
      };
    });
    res.json({ success: true, data: { pagos }, pagos });
  } catch (e) {
    console.error('Error en admin payments:', e);
    res.status(500).json({ success: false, message: 'Error al obtener pagos' });
  }
});

// Lista de clases/reservas.
app.get('/api/admin/clases', adminMiddleware, async (req, res) => {
  try {
    const [txs, nombres] = await Promise.all([
      Transaccion.findAll({ where: { tipo: 'clase' }, order: [['createdAt', 'DESC']] }),
      nombreMapUsuarios()
    ]);
    const clases = txs.map(t => {
      const j = t.toJSON();
      return {
        id: j.id,
        estudiante: nombres[j.usuario] || 'Usuario',
        profesor: nombres[j.profesorId] || '—',
        materia: j.titulo,
        fecha: j.fecha || j.createdAt,
        hora: j.hora || '—',
        duracion: 1,
        precio: Number(j.precio) || 0,
        estado: j.estado === 'aprobado' ? 'confirmada' : j.estado === 'rechazado' ? 'cancelada' : 'pendiente',
        modalidad: 'online'
      };
    });
    res.json({ success: true, data: { clases }, clases });
  } catch (e) {
    console.error('Error en admin clases:', e);
    res.status(500).json({ success: false, message: 'Error al obtener clases' });
  }
});

// Lista de solicitudes de retiro (admin).
app.get('/api/admin/retiros', adminMiddleware, async (req, res) => {
  try {
    const [retiros, nombres] = await Promise.all([
      Retiro.findAll({ order: [['createdAt', 'DESC']] }),
      nombreMapUsuarios()
    ]);
    const data = retiros.map(r => {
      const j = r.toJSON();
      return { ...j, profesorNombre: nombres[j.profesor] || 'Profesor' };
    });
    res.json({ success: true, data: { retiros: data }, retiros: data });
  } catch (e) {
    console.error('Error en admin retiros:', e);
    res.status(500).json({ success: false, message: 'Error al obtener los retiros' });
  }
});

// Actualizar el estado de un retiro (aprobar / pagar / rechazar).
app.put('/api/admin/retiros/:id/estado', adminMiddleware, async (req, res) => {
  try {
    const r = await Retiro.findByPk(req.params.id);
    if (!r) return res.status(404).json({ success: false, message: 'Retiro no encontrado' });
    const estados = ['pendiente', 'aprobado', 'pagado', 'rechazado'];
    const estado = estados.includes(req.body?.estado) ? req.body.estado : r.estado;
    await r.update({ estado });
    res.json({ success: true, message: 'Retiro actualizado', data: { retiro: r.toJSON() } });
  } catch (e) {
    console.error('Error actualizando retiro:', e);
    res.status(500).json({ success: false, message: 'Error al actualizar el retiro' });
  }
});

// Webhook de notificaciones de Mercado Pago.
// Mercado Pago llama a esta URL cuando cambia el estado de un pago. Puede
// enviar los datos por query (?type=payment&data.id=123 o ?topic=payment&id=123)
// o en el body. Confirmamos el pago consultando la API (nunca confiar solo en
// la notificación) y respondemos 200 para que MP no reintente.
app.post('/api/pagos/webhook', async (req, res) => {
  try {
    const type = req.query.type || req.query.topic || req.body?.type || req.body?.action?.split('.')[0];
    const paymentId = req.query['data.id'] || req.query.id || req.body?.data?.id;

    if (type === 'payment' && paymentId) {
      const mp = getMercadoPago();
      if (mp) {
        const payment = await mp.payment.get({ id: paymentId });
        console.log('🔔 Webhook MP:', {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          external_reference: payment.external_reference,
          amount: payment.transaction_amount
        });

        // Actualizar la transacción por external_reference de forma idempotente.
        try {
          await initDB();
          if (Transaccion && payment.external_reference) {
            const nuevoEstado = payment.status === 'approved' ? 'aprobado'
              : payment.status === 'rejected' ? 'rechazado'
              : 'pendiente';
            await Transaccion.update(
              { estado: nuevoEstado, paymentId: String(payment.id) },
              { where: { referencia: String(payment.external_reference) } }
            );
          }
        } catch (e) {
          console.warn('⚠️ No se pudo actualizar la transacción desde el webhook:', e.message);
        }
      }
    }

    // Siempre 200: MP reintenta ante cualquier otro código.
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error?.message || error);
    // Aun ante error respondemos 200 para no entrar en bucle de reintentos;
    // el detalle queda en logs para diagnóstico.
    return res.status(200).json({ received: true });
  }
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));

export default app;
