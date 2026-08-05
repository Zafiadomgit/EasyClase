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

// Monto mínimo cobrable, en COP. Mercado Pago define un mínimo por medio de
// pago y oculta del checkout los que no lo alcanzan: Visa/Mastercard (crédito
// y débito), Amex y Diners exigen $1.000. Por debajo de eso el comprador solo
// ve "saldo en cuenta" y quien no tenga cuenta de Mercado Pago no puede pagar.
// Se puede subir con MONTO_MINIMO_COBRO (por ejemplo a 1600 para incluir PSE).
// Consultar los mínimos vigentes en GET /api/pagos/medios-disponibles.
const MONTO_MINIMO_COBRO = Number(process.env.MONTO_MINIMO_COBRO) || 1000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// ─── DB setup (Neon PostgreSQL) ───────────────────────────────────────────────
let sequelize, User, Servicio, Transaccion, Plantilla, Disponibilidad, Review, Retiro, Notificacion, AccesoVideollamada, MovimientoSaldo, dbReady = false, lastDbError = null;

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
      hora: { type: DataTypes.STRING(20), defaultValue: '' },
      // Duración en horas de la clase reservada. Necesaria para saber qué
      // franjas quedan ocupadas y no permitir que otro alumno las tome.
      duracion: { type: DataTypes.INTEGER, defaultValue: 1 },
      // Decisión del profesor sobre la reserva, independiente del estado del
      // pago: una clase puede estar pagada y aún así ser rechazada.
      estadoProfesor: { type: DataTypes.STRING(20), defaultValue: 'pendiente' }, // pendiente|aceptada|rechazada
      motivoRechazo: { type: DataTypes.TEXT, defaultValue: '' },
      // Parte del precio cubierta con saldo de la billetera del estudiante.
      pagadoConSaldo: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
    }, { tableName: 'transacciones', timestamps: true, indexes: [{ fields: ['referencia'] }, { fields: ['usuario'] }, { fields: ['profesorId'] }] });

    // Notificaciones por usuario. Antes vivían en el localStorage del navegador,
    // así que nunca cruzaban de una cuenta a otra: el profesor no podía ver un
    // aviso generado en el navegador del alumno.
    Notificacion = sequelize.define('Notificacion', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      usuario: { type: DataTypes.INTEGER, allowNull: false },
      titulo: { type: DataTypes.STRING(150), allowNull: false },
      mensaje: { type: DataTypes.TEXT, defaultValue: '' },
      tipo: { type: DataTypes.STRING(40), defaultValue: 'general' },
      icono: { type: DataTypes.STRING(40), defaultValue: 'bell' },
      color: { type: DataTypes.STRING(20), defaultValue: 'blue' },
      url: { type: DataTypes.STRING(200), defaultValue: '' },
      leida: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { tableName: 'notificaciones', timestamps: true, indexes: [{ fields: ['usuario'] }] });

    // Registro de entradas a videollamada, para medir el consumo real.
    // La métrica que factura la mayoría de proveedores de video (Jitsi JaaS,
    // Daily) son los usuarios activos por mes, así que se guarda el mes ya
    // calculado y se cuentan usuarios distintos, no sesiones.
    AccesoVideollamada = sequelize.define('AccesoVideollamada', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      usuario: { type: DataTypes.INTEGER, allowNull: false },
      claseId: { type: DataTypes.INTEGER, allowNull: true },
      mes: { type: DataTypes.STRING(7), allowNull: false } // 'YYYY-MM'
    }, { tableName: 'accesos_videollamada', timestamps: true, indexes: [{ fields: ['mes'] }, { fields: ['usuario'] }] });

    // Billetera del estudiante. Se lleva como movimientos y no como un número
    // suelto: así queda el rastro de por qué se abonó o gastó cada peso, que es
    // lo que permite responder una reclamación.
    //
    // Este saldo NO es retirable por diseño: nace de una clase que el
    // estudiante ya pagó y el profesor rechazó, así que solo sirve para tomar
    // otra clase. No existe ningún endpoint que lo convierta en dinero.
    MovimientoSaldo = sequelize.define('MovimientoSaldo', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      usuario: { type: DataTypes.INTEGER, allowNull: false },
      tipo: { type: DataTypes.STRING(10), allowNull: false }, // credito|debito
      monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      concepto: { type: DataTypes.STRING(200), defaultValue: '' },
      transaccionId: { type: DataTypes.INTEGER, allowNull: true }
    }, { tableName: 'movimientos_saldo', timestamps: true, indexes: [{ fields: ['usuario'] }] });

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
    // alter:true añade columnas nuevas (perfil profesor) a la tabla existente.
    // Se sincronizan en paralelo: en serie eran ocho viajes de ida y vuelta
    // encadenados a la base en cada arranque en frío de la función.
    // En serie a propósito. Se probó en paralelo para acelerar el arranque en
    // frío y fue un error: son 10 sincronizaciones sobre un pool de 2
    // conexiones con 10 s de espera, así que la mayoría expiraba, la conexión
    // quedaba marcada como no lista y todos los endpoints respondían 503.
    for (const modelo of [User, Servicio, Transaccion, Plantilla, Disponibilidad,
                          Review, Retiro, Notificacion, AccesoVideollamada, MovimientoSaldo]) {
      await modelo.sync({ alter: true });
    }
    // Los seeds sí van en orden: los servicios de ejemplo necesitan que los
    // profesores existan.
    // Los seeds de profesores y servicios de demostración se retiraron: creaban
    // usuarios falsos que los estudiantes veían como reales en la búsqueda.
    await seedAdmin();
    await limpiarDatosDemo();
    dbReady = true;
    console.log('✅ Supabase PostgreSQL conectado');
  } catch (e) {
    console.error('❌ Error conectando a DB:', e.message);
    lastDbError = `${e.code ? e.code + ': ' : ''}${e.message}`;
    dbReady = false;
  }
};

// Elimina de una vez los datos de demostración que dejaron los seeds
// anteriores: cinco profesores inventados y sus servicios. Se identifican por
// el dominio de correo que se les asignó, así que no toca cuentas reales.
const limpiarDatosDemo = async () => {
  try {
    const demo = await User.findAll({
      where: { email: { [Sequelize.Op.like]: '%@demo.easyclase.com' } },
      attributes: ['id']
    });
    if (demo.length === 0) return;
    const ids = demo.map(u => u.id);
    await Servicio.destroy({ where: { proveedor: ids } });
    await Plantilla.destroy({ where: { profesor: ids } });
    await Disponibilidad.destroy({ where: { profesor: ids } });
    await User.destroy({ where: { id: ids } });
    console.log(`🧹 Eliminados ${ids.length} perfiles de demostración`);
  } catch (e) {
    console.warn('⚠️ Limpieza de datos demo omitida:', e.message);
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
    const existing = await User.findOne({ where: { email } });

    // Antes se calculaba el hash de bcrypt en cada arranque en frío, incluso
    // cuando la contraseña no había cambiado; es una operación deliberadamente
    // costosa. Ahora solo se rehashea si hace falta.
    if (existing) {
      const alDia = existing.tipoUsuario === 'admin'
        && existing.activo
        && await bcrypt.compare(password, existing.password || '');
      if (alDia) return;
      await existing.update({
        tipoUsuario: 'admin',
        password: await bcrypt.hash(password, 10),
        activo: true
      });
    } else {
      await User.create({
        nombre: 'Administrador',
        email,
        password: await bcrypt.hash(password, 10),
        tipoUsuario: 'admin',
        activo: true
      });
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

// Un profesor que se registra y publica clases nunca fija el precioPorHora de
// su perfil (queda en 0), porque el precio real lo define en cada clase. Sin
// esto la búsqueda mostraría "$0/hora" y la reserva cobraría el mínimo de
// sandbox. Se toma el precio más bajo de sus clases como precio "desde".
const aplicarPrecioDesdeClases = (profesor) => {
  if (Number(profesor.precioPorHora) > 0) return profesor;
  const precios = (profesor.clases || [])
    .map(c => Number(c.precio))
    .filter(p => Number.isFinite(p) && p > 0);
  if (!precios.length) return profesor;
  const desde = Math.min(...precios);
  profesor.precioPorHora = desde;
  profesor.precioHora = desde;
  profesor.precioDesdeClases = true; // permite mostrar "desde $X" en la UI
  return profesor;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Secreto con el que se firman los tokens de sesión.
//
// Antes había un valor por defecto escrito en el código. Como este repositorio
// es público, cualquiera podía leerlo y, si la variable no estaba configurada,
// firmarse un token con el id de usuario que quisiera: entrar como cualquier
// persona, incluido el administrador. En producción ahora se falla en cerrado
// en vez de aceptar un secreto conocido.
const EN_PRODUCCION = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const JWT_SECRET = process.env.JWT_SECRET || (EN_PRODUCCION ? null : 'dev_secret_solo_desarrollo');
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET no está configurada: la autenticación queda deshabilitada por seguridad.');
}

const sinSecreto = (res) => {
  res.status(503).json({
    success: false,
    message: 'El servidor no está configurado correctamente (falta JWT_SECRET).'
  });
  return true;
};

const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

const authMiddleware = (req, res, next) => {
  if (!JWT_SECRET) return sinSecreto(res);
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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
    if (!JWT_SECRET) return null;
    return jwt.verify(token, JWT_SECRET).userId;
  } catch {
    return null;
  }
};

// Middleware de administrador: exige token válido Y que el usuario sea admin.
const adminMiddleware = async (req, res, next) => {
  if (!JWT_SECRET) return sinSecreto(res);
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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

  // El detalle de la conexión (host, usuario, base y huella de la contraseña)
  // solo se entrega con ?debug=<JWT_SECRET>: es información que ayuda a atacar
  // la base y este endpoint es público porque lo usa el monitor de keep-alive.
  if (cs && JWT_SECRET && req.query.debug === JWT_SECRET) {
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

// RECUPERAR CONTRASEÑA
// El enlace lleva un token firmado con vigencia de 1 hora; no hace falta
// guardarlo en la base. Se incluye un fragmento del hash actual para que el
// enlace deje de servir en cuanto la contraseña cambie (así no se puede
// reutilizar un correo viejo).
const tokenRecuperacion = (user) =>
  jwt.sign(
    { userId: user.id, proposito: 'recuperar', h: String(user.password || '').slice(-10) },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

app.post('/api/auth/recuperar', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    // Se responde siempre igual, exista o no la cuenta: revelar si un correo
    // está registrado permitiría enumerar usuarios.
    const respuestaNeutra = {
      success: true,
      message: 'Si el correo está registrado, te enviamos las instrucciones para restablecer tu contraseña.'
    };
    if (!email) return res.json(respuestaNeutra);

    await initDB();
    if (!dbReady || !User || !JWT_SECRET) return res.json(respuestaNeutra);

    const user = await User.findOne({ where: { email, activo: true } });
    if (user) {
      const enlace = `${FRONTEND_URL}/restablecer-password?token=${encodeURIComponent(tokenRecuperacion(user))}`;
      await enviarCorreo({
        para: user.email,
        asunto: 'Restablece tu contraseña de EasyClase',
        titulo: `Hola, ${user.nombre || ''}`.trim(),
        cuerpo: `Recibimos una solicitud para restablecer tu contraseña. El enlace es válido durante una hora.
                 <br><br>Si no fuiste tú, puedes ignorar este correo: tu contraseña no cambiará.`,
        boton: { texto: 'Restablecer contraseña', url: enlace }
      });
    }
    return res.json(respuestaNeutra);
  } catch (e) {
    console.error('Error en recuperación de contraseña:', e);
    return res.json({
      success: true,
      message: 'Si el correo está registrado, te enviamos las instrucciones para restablecer tu contraseña.'
    });
  }
});

app.post('/api/auth/restablecer', async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token y contraseña son requeridos' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (!JWT_SECRET) {
      return res.status(503).json({ success: false, message: 'Servidor mal configurado' });
    }

    let datos;
    try {
      datos = jwt.verify(String(token), JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, message: 'El enlace expiró o no es válido. Solicita uno nuevo.' });
    }
    if (datos.proposito !== 'recuperar') {
      return res.status(400).json({ success: false, message: 'Enlace no válido' });
    }

    await initDB();
    if (!dbReady || !User) return res.status(503).json({ success: false, message: 'Base de datos no disponible' });

    const user = await User.findByPk(datos.userId);
    if (!user || String(user.password || '').slice(-10) !== datos.h) {
      return res.status(400).json({ success: false, message: 'Este enlace ya fue usado. Solicita uno nuevo.' });
    }

    await user.update({ password: await bcrypt.hash(String(password), 12) });
    await enviarCorreo({
      para: user.email,
      asunto: 'Tu contraseña de EasyClase fue cambiada',
      titulo: 'Contraseña actualizada',
      cuerpo: 'Tu contraseña se cambió correctamente. Si no fuiste tú, responde a este correo de inmediato.'
    });

    res.json({ success: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (e) {
    console.error('Error restableciendo contraseña:', e);
    res.status(500).json({ success: false, message: 'Error al restablecer la contraseña' });
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

// Cachea una respuesta pública en el CDN de Vercel. El navegador la revalida,
// pero el CDN la sirve durante `segundos` y puede seguir entregando la versión
// anterior mientras refresca por detrás, así que los listados dejan de golpear
// la base en cada visita.
const cachePublico = (res, segundos = 60) => {
  res.set('Cache-Control', `public, max-age=0, s-maxage=${segundos}, stale-while-revalidate=300`);
};

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
    const profes = await User.findAll({
      where: { tipoUsuario: 'profesor', activo: true, profesorVisible: true },
      order: [['premium', 'DESC'], ['calificacionPromedio', 'DESC']]
    });
    let data = profes.map(shapeProfesor);

    // Adjuntar las clases (plantillas) de cada profesor para que la búsqueda
    // de estudiantes también encuentre profesores por las clases que ofrecen.
    try {
      const plantillas = await Plantilla.findAll({ where: { profesor: data.map(p => p.id) } });
      const porProfesor = {};
      plantillas.forEach(pl => {
        (porProfesor[pl.profesor] = porProfesor[pl.profesor] || []).push(shapePlantilla(pl));
      });
      data.forEach(p => { p.clases = porProfesor[p.id] || []; aplicarPrecioDesdeClases(p); });
    } catch { data.forEach(p => { p.clases = p.clases || []; }); }

    // El filtro por categoría considera la categoría del perfil, las
    // especialidades y también la categoría/materia de sus clases.
    if (categoria) {
      const c = String(categoria).toLowerCase();
      data = data.filter(p =>
        (p.categoria || '').toLowerCase() === c ||
        (p.especialidades || []).some(e => String(e).toLowerCase() === c) ||
        (p.clases || []).some(cl =>
          (cl.categoria || '').toLowerCase() === c ||
          (cl.materia || '').toLowerCase() === c
        )
      );
    }
    if (q) {
      const s = String(q).toLowerCase();
      data = data.filter(p =>
        p.nombre.toLowerCase().includes(s) ||
        (p.especialidades || []).some(e => String(e).toLowerCase().includes(s)) ||
        p.bio.toLowerCase().includes(s) ||
        (p.categoria || '').toLowerCase().includes(s) ||
        (p.clases || []).some(cl =>
          (cl.titulo || '').toLowerCase().includes(s) ||
          (cl.materia || '').toLowerCase().includes(s) ||
          (cl.categoria || '').toLowerCase().includes(s) ||
          (cl.descripcion || '').toLowerCase().includes(s)
        )
      );
    }
    cachePublico(res, 60);
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
    cachePublico(res, 60);
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

// Monto mínimo para solicitar un retiro, en COP. Evita solicitudes muy
// pequeñas, que hay que procesar a mano y cuestan más de lo que mueven.
const MONTO_MINIMO_RETIRO = Number(process.env.MONTO_MINIMO_RETIRO) || 50000;

// Calcula el balance disponible para retiro de un profesor.
const calcularBalance = async (prof) => {
  // Las clases rechazadas por el profesor no son ingreso suyo: ese importe se
  // le devolvió al estudiante como saldo.
  const claseGross = (await Transaccion.sum('precio', { where: { profesorId: prof.id, tipo: 'clase', estado: 'aprobado', estadoProfesor: ['pendiente', 'aceptada'] } })) || 0;
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
    res.json({ success: true, data: { balanceDisponible: disponible, comision, montoMinimoRetiro: MONTO_MINIMO_RETIRO, totalGanado: Math.round(bruto) } });
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
    if (monto < MONTO_MINIMO_RETIRO) {
      return res.status(400).json({
        success: false,
        message: `El retiro mínimo es de $${MONTO_MINIMO_RETIRO.toLocaleString('es-CO')} COP.`
      });
    }
    if (monto > disponible) return res.status(400).json({ success: false, message: 'El monto supera tu balance disponible' });
    // La comisión ya se descontó al calcular el balance disponible
    // (disponible = bruto × (1 - comisión)), así que el monto solicitado es
    // exactamente lo que el profesor debe recibir. Volver a aplicarla aquí le
    // cobraba la comisión dos veces.
    const retiro = await Retiro.create({
      profesor: prof.id,
      monto,
      comision: 0,
      montoNeto: monto,
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
      aplicarPrecioDesdeClases(profesor);
    } catch { profesor.clases = []; }
    // Adjuntar la disponibilidad semanal para que la reserva solo ofrezca las
    // horas que el profesor realmente habilitó.
    try {
      const horarios = await Disponibilidad.findAll({
        where: { profesor: profe.id, disponible: true },
        order: [['horaInicio', 'ASC']]
      });
      profesor.horarios = horarios.map(shapeHorario);
    } catch { profesor.horarios = []; }
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
    cachePublico(res, 60);
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
    // El precio por hora es la base del cobro, así que debe alcanzar el mínimo
    // que exige Mercado Pago para que el alumno pueda pagar con tarjeta.
    if (!Number.isFinite(precio) || precio < MONTO_MINIMO_COBRO) {
      return res.status(400).json({
        success: false,
        message: `El precio debe ser como mínimo $${MONTO_MINIMO_COBRO.toLocaleString('es-CO')} COP`
      });
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

// ─── Correo transaccional ────────────────────────────────────────────────────
// Se envía con Resend por HTTP, sin añadir dependencias. Si no hay API key
// configurada, el envío se omite en silencio: nunca debe romper el flujo que lo
// origina (un pago no puede fallar porque el correo no salga).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_REMITENTE = process.env.EMAIL_REMITENTE || 'EasyClase <onboarding@resend.dev>';

const plantillaCorreo = (titulo, cuerpo, boton) => `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f5fb;padding:32px 16px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)">
    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:24px 28px">
      <h1 style="margin:0;color:#fff;font-size:20px">EasyClase</h1>
    </div>
    <div style="padding:28px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#111827">${titulo}</h2>
      <div style="color:#4b5563;font-size:15px;line-height:1.6">${cuerpo}</div>
      ${boton ? `<p style="margin:24px 0 0"><a href="${boton.url}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">${boton.texto}</a></p>` : ''}
    </div>
    <div style="padding:16px 28px;background:#faf9fd;color:#9ca3af;font-size:12px">
      Este correo se envió automáticamente desde EasyClase.
    </div>
  </div>
</div>`;

const enviarCorreo = async ({ para, asunto, titulo, cuerpo, boton }) => {
  if (!RESEND_API_KEY) return { ok: false, detalle: 'Falta RESEND_API_KEY' };
  if (!para) return { ok: false, detalle: 'Sin destinatario' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: EMAIL_REMITENTE,
        to: [para],
        subject: asunto,
        html: plantillaCorreo(titulo, cuerpo, boton)
      })
    });
    if (!r.ok) {
      const detalle = await r.text();
      console.warn('⚠️ Resend respondió', r.status, detalle);
      return { ok: false, estado: r.status, detalle };
    }
    return { ok: true };
  } catch (e) {
    console.warn('⚠️ No se pudo enviar el correo:', e.message);
    return { ok: false, detalle: e.message };
  }
};

// Diagnóstico de correo: envía uno de prueba y devuelve el error exacto de
// Resend si falla. Sirve sobre todo para detectar la restricción de las cuentas
// nuevas, que solo pueden escribir a la dirección con la que se registraron
// mientras no se verifique un dominio propio.
app.get('/api/admin/correo/diagnostico', adminMiddleware, async (req, res) => {
  const destino = String(req.query.destino || '').trim();
  if (!destino) {
    return res.status(400).json({ success: false, message: 'Indica ?destino=correo@ejemplo.com' });
  }

  const remitenteEsDePruebas = EMAIL_REMITENTE.includes('resend.dev');
  const resultado = await enviarCorreo({
    para: destino,
    asunto: 'Prueba de configuración de EasyClase',
    titulo: 'El correo está configurado',
    cuerpo: 'Si estás leyendo esto, EasyClase puede enviar correos correctamente.'
  });

  res.json({
    success: resultado.ok,
    data: {
      apiKeyConfigurada: !!RESEND_API_KEY,
      remitente: EMAIL_REMITENTE,
      remitenteEsDePruebas,
      destino,
      enviado: resultado.ok,
      error: resultado.ok ? null : (resultado.detalle || 'desconocido'),
      aviso: remitenteEsDePruebas
        ? 'Con el remitente de pruebas de Resend solo llegan correos a la dirección con la que creaste la cuenta. Verifica un dominio en resend.com/domains y cambia EMAIL_REMITENTE para escribir a tus usuarios.'
        : null
    }
  });
});

// ─── Notificaciones ──────────────────────────────────────────────────────────
const shapeNotificacion = (n) => {
  const j = n.toJSON ? n.toJSON() : n;
  return {
    id: j.id,
    title: j.titulo,
    message: j.mensaje || '',
    type: j.tipo || 'general',
    icon: j.icono || 'bell',
    color: j.color || 'blue',
    actionUrl: j.url || '',
    read: !!j.leida,
    timestamp: j.createdAt
  };
};

// Crea una notificación sin romper el flujo que la origina si algo falla.
const crearNotificacion = async (usuario, datos) => {
  try {
    if (!Notificacion || !usuario) return null;

    // Las notificaciones importantes salen también por correo: si el usuario no
    // entra a la web, dentro de la aplicación no se entera de nada.
    if (datos.correo) {
      try {
        const u = await User.findByPk(usuario, { attributes: ['email', 'nombre'] });
        if (u?.email) {
          await enviarCorreo({
            para: u.email,
            asunto: datos.titulo,
            titulo: datos.titulo,
            cuerpo: datos.mensaje || '',
            boton: datos.url ? { texto: 'Ver en EasyClase', url: `${FRONTEND_URL}${datos.url}` } : null
          });
        }
      } catch (e) {
        console.warn('⚠️ No se pudo enviar el correo de la notificación:', e.message);
      }
    }

    return await Notificacion.create({
      usuario,
      titulo: datos.titulo,
      mensaje: datos.mensaje || '',
      tipo: datos.tipo || 'general',
      icono: datos.icono || 'bell',
      color: datos.color || 'blue',
      url: datos.url || ''
    });
  } catch (e) {
    console.warn('⚠️ No se pudo crear la notificación:', e.message);
    return null;
  }
};

app.get('/api/notificaciones', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const notis = await Notificacion.findAll({
      where: { usuario: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 30
    });
    const data = notis.map(shapeNotificacion);
    const noLeidas = data.filter(n => !n.read).length;
    res.json({ success: true, data: { notificaciones: data, noLeidas }, notificaciones: data });
  } catch (e) {
    console.error('Error obteniendo notificaciones:', e);
    res.status(500).json({ success: false, message: 'Error al obtener las notificaciones' });
  }
});

// Marcar todas como leídas. Va antes de /:id para que no la capture esa ruta.
app.put('/api/notificaciones/leer-todas', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    await Notificacion.update({ leida: true }, { where: { usuario: req.userId, leida: false } });
    res.json({ success: true, message: 'Notificaciones marcadas como leídas' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al marcar las notificaciones' });
  }
});

app.put('/api/notificaciones/:id/leer', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const n = await Notificacion.findByPk(req.params.id);
    if (!n) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    if (n.usuario !== req.userId) return res.status(403).json({ success: false, message: 'No autorizado' });
    await n.update({ leida: true });
    res.json({ success: true, data: { notificacion: shapeNotificacion(n) } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al marcar la notificación' });
  }
});

app.delete('/api/notificaciones', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    await Notificacion.destroy({ where: { usuario: req.userId } });
    res.json({ success: true, message: 'Notificaciones eliminadas' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al eliminar las notificaciones' });
  }
});

// ─── Clases reservadas ───────────────────────────────────────────────────────

// Una reserva es una transacción de tipo 'clase' ya aprobada. Se expone con los
// datos de la contraparte para que cada lado vea con quién es la clase.
const shapeReserva = (t, contraparte) => {
  const j = t.toJSON ? t.toJSON() : t;
  const estado = j.estado === 'aprobado' ? 'confirmada'
    : j.estado === 'rechazado' ? 'cancelada'
    : 'pendiente';
  return {
    id: j.id,
    titulo: j.titulo || 'Clase',
    materia: j.categoria || '',
    categoria: j.categoria || '',
    descripcion: j.descripcion || '',
    fecha: j.fecha || '',
    hora: j.hora || '',
    duracion: j.duracion || 1,
    precio: Number(j.precio) || 0,
    estado,
    estadoProfesor: j.estadoProfesor || 'pendiente',
    motivoRechazo: j.motivoRechazo || '',
    pagadoConSaldo: Number(j.pagadoConSaldo) || 0,
    profesorId: j.profesorId || null,
    estudianteId: j.usuario || null,
    profesor: contraparte?.profesor || '',
    estudiante: contraparte?.estudiante || '',
    created_at: j.createdAt
  };
};

// Resuelve los nombres de los usuarios referenciados por un grupo de reservas.
const nombresDeUsuarios = async (ids) => {
  const limpios = [...new Set(ids.filter(Boolean))];
  if (!limpios.length) return {};
  const users = await User.findAll({ where: { id: limpios }, attributes: ['id', 'nombre'] });
  const mapa = {};
  users.forEach(u => { mapa[u.id] = u.nombre; });
  return mapa;
};

// Clases que el alumno autenticado compró.
app.get('/api/clases/estudiante/mis-clases', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const txs = await Transaccion.findAll({
      where: { usuario: req.userId, tipo: 'clase' },
      order: [['createdAt', 'DESC']]
    });
    const profes = await nombresDeUsuarios(txs.map(t => t.profesorId));
    const clases = txs.map(t => shapeReserva(t, { profesor: profes[t.profesorId] || 'Profesor' }));
    res.json({ success: true, data: { clases }, clases });
  } catch (e) {
    console.error('Error obteniendo clases del estudiante:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus clases' });
  }
});

// Clases que le reservaron al profesor autenticado. Solo las pagadas, para que
// no vea reservas que quedaron a medio pagar.
app.get('/api/clases/profesor/mis-clases', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const txs = await Transaccion.findAll({
      where: { profesorId: req.userId, tipo: 'clase', estado: 'aprobado' },
      order: [['createdAt', 'DESC']]
    });
    const alumnos = await nombresDeUsuarios(txs.map(t => t.usuario));
    const clases = txs.map(t => shapeReserva(t, { estudiante: alumnos[t.usuario] || 'Estudiante' }));
    res.json({ success: true, data: { clases }, clases });
  } catch (e) {
    console.error('Error obteniendo clases del profesor:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tus clases' });
  }
});

// ─── Billetera del estudiante ────────────────────────────────────────────────
const saldoDisponible = async (usuario) => {
  const creditos = (await MovimientoSaldo.sum('monto', { where: { usuario, tipo: 'credito' } })) || 0;
  const debitos = (await MovimientoSaldo.sum('monto', { where: { usuario, tipo: 'debito' } })) || 0;
  return Math.max(0, Math.round(Number(creditos) - Number(debitos)));
};

app.get('/api/saldo', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const [disponible, movimientos] = await Promise.all([
      saldoDisponible(req.userId),
      MovimientoSaldo.findAll({ where: { usuario: req.userId }, order: [['createdAt', 'DESC']], limit: 20 })
    ]);
    res.json({
      success: true,
      data: {
        disponible,
        // Se deja explícito para que la interfaz no ofrezca retirarlo.
        retirable: false,
        movimientos: movimientos.map(m => {
          const j = m.toJSON();
          return {
            id: j.id,
            tipo: j.tipo,
            monto: Number(j.monto) || 0,
            concepto: j.concepto || '',
            fecha: j.createdAt
          };
        })
      }
    });
  } catch (e) {
    console.error('Error obteniendo el saldo:', e);
    res.status(500).json({ success: false, message: 'Error al obtener tu saldo' });
  }
});

// ─── Solicitudes de clase (decisión del profesor) ────────────────────────────

// Clases pagadas que esperan que el profesor las acepte o rechace.
app.get('/api/clases/profesor/solicitudes', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const txs = await Transaccion.findAll({
      where: { profesorId: req.userId, tipo: 'clase', estado: 'aprobado', estadoProfesor: 'pendiente' },
      order: [['createdAt', 'ASC']]
    });
    const alumnos = await nombresDeUsuarios(txs.map(t => t.usuario));
    const solicitudes = txs.map(t => shapeReserva(t, { estudiante: alumnos[t.usuario] || 'Estudiante' }));
    res.json({ success: true, data: { solicitudes }, solicitudes });
  } catch (e) {
    console.error('Error obteniendo solicitudes:', e);
    res.status(500).json({ success: false, message: 'Error al obtener las solicitudes' });
  }
});

// Carga una solicitud comprobando que pertenece al profesor y sigue pendiente.
const solicitudDelProfesor = async (id, profesorId, res) => {
  const t = await Transaccion.findByPk(id);
  if (!t || t.tipo !== 'clase') {
    res.status(404).json({ success: false, message: 'Clase no encontrada' });
    return null;
  }
  if (t.profesorId !== profesorId) {
    res.status(403).json({ success: false, message: 'No autorizado' });
    return null;
  }
  if (t.estadoProfesor !== 'pendiente') {
    res.status(409).json({ success: false, message: `Esta solicitud ya fue ${t.estadoProfesor}` });
    return null;
  }
  return t;
};

app.put('/api/clases/:id/aceptar', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const t = await solicitudDelProfesor(req.params.id, req.userId, res);
    if (!t) return;

    await t.update({ estadoProfesor: 'aceptada' });

    const cuando = [t.fecha, t.hora].filter(Boolean).join(' a las ');
    await crearNotificacion(t.usuario, {
      titulo: 'Tu clase fue confirmada',
      correo: true,
      mensaje: `El profesor confirmó "${t.titulo}"${cuando ? ` del ${cuando}` : ''}.`,
      tipo: 'reserva',
      icono: 'check',
      color: 'green',
      url: '/mis-clases'
    });

    res.json({ success: true, message: 'Solicitud aceptada' });
  } catch (e) {
    console.error('Error aceptando la solicitud:', e);
    res.status(500).json({ success: false, message: 'Error al aceptar la solicitud' });
  }
});

app.put('/api/clases/:id/rechazar', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;

    // El motivo es obligatorio: el estudiante ya pagó y merece una explicación.
    const motivo = String(req.body?.motivo || '').trim();
    if (motivo.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Explica en al menos 10 caracteres por qué rechazas la clase.'
      });
    }

    const t = await solicitudDelProfesor(req.params.id, req.userId, res);
    if (!t) return;

    await t.update({ estadoProfesor: 'rechazada', motivoRechazo: motivo });

    // El importe vuelve al estudiante como saldo, no como devolución de dinero:
    // así se queda dentro de la plataforma para tomar otra clase.
    const importe = Number(t.precio) || 0;
    if (t.usuario && importe > 0) {
      await MovimientoSaldo.create({
        usuario: t.usuario,
        tipo: 'credito',
        monto: importe,
        concepto: `Clase rechazada: ${t.titulo}`,
        transaccionId: t.id
      });
    }

    await crearNotificacion(t.usuario, {
      titulo: 'Tu clase fue rechazada',
      correo: true,
      mensaje: `El profesor no pudo aceptar "${t.titulo}". Motivo: ${motivo}. Se abonaron $${importe.toLocaleString('es-CO')} a tu saldo para que tomes otra clase.`,
      tipo: 'reserva',
      icono: 'alert',
      color: 'yellow',
      url: '/mis-clases'
    });

    res.json({ success: true, message: 'Solicitud rechazada y saldo devuelto al estudiante' });
  } catch (e) {
    console.error('Error rechazando la solicitud:', e);
    res.status(500).json({ success: false, message: 'Error al rechazar la solicitud' });
  }
});

// Horas ya ocupadas de un profesor en una fecha. Se consulta al reservar para
// no ofrecer una franja que otro alumno ya pagó.
const horasOcupadas = async (profesorId, fecha) => {
  const txs = await Transaccion.findAll({
    where: {
      profesorId, fecha, tipo: 'clase',
      estado: ['aprobado', 'pendiente'],
      // Una clase rechazada por el profesor deja el horario libre otra vez.
      estadoProfesor: ['pendiente', 'aceptada']
    },
    attributes: ['hora', 'duracion', 'estado', 'createdAt']
  });
  const ocupadas = new Set();
  const ahora = Date.now();
  txs.forEach(t => {
    // Una reserva pendiente bloquea la franja solo 30 minutos, el tiempo de
    // completar el pago; si no, un checkout abandonado la dejaría inutilizable.
    if (t.estado === 'pendiente' && ahora - new Date(t.createdAt).getTime() > 30 * 60 * 1000) return;
    const [h, m] = String(t.hora || '').split(':').map(Number);
    if (!Number.isFinite(h)) return;
    const inicio = h * 60 + (Number(m) || 0);
    const horas = Number(t.duracion) || 1;
    for (let x = inicio; x < inicio + horas * 60; x += 30) {
      ocupadas.add(`${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`);
    }
  });
  return [...ocupadas].sort();
};

// Avisa a las dos partes cuando una reserva queda pagada. El alumno recibe la
// confirmación del pago y el profesor, el aviso de que le reservaron la clase.
const notificarReservaPagada = async (tx) => {
  const j = tx.toJSON ? tx.toJSON() : tx;
  const cuando = [j.fecha, j.hora].filter(Boolean).join(' a las ');
  const esClase = j.tipo === 'clase';

  if (j.usuario) {
    await crearNotificacion(j.usuario, {
      titulo: 'Pago confirmado',
      correo: true,
      mensaje: esClase
        ? `Tu clase "${j.titulo}"${cuando ? ` del ${cuando}` : ''} quedó confirmada.`
        : `Tu compra de "${j.titulo}" quedó confirmada.`,
      tipo: 'pago',
      icono: 'check',
      color: 'green',
      url: esClase ? '/mis-clases' : '/mis-compras'
    });
  }

  if (esClase && j.profesorId) {
    let alumno = 'Un estudiante';
    try {
      const u = j.usuario ? await User.findByPk(j.usuario, { attributes: ['nombre'] }) : null;
      if (u?.nombre) alumno = u.nombre;
    } catch { /* se usa el genérico */ }
    await crearNotificacion(j.profesorId, {
      titulo: 'Te reservaron una clase',
      correo: true,
      mensaje: `${alumno} reservó y pagó "${j.titulo}"${cuando ? ` para el ${cuando}` : ''}.`,
      tipo: 'reserva',
      icono: 'calendar',
      color: 'blue',
      url: '/mis-clases'
    });
  }
};

app.get('/api/clases/horarios-ocupados', async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const profesorId = Number(req.query.profesorId);
    const fecha = String(req.query.fecha || '');
    if (!Number.isFinite(profesorId) || !fecha) {
      return res.status(400).json({ success: false, message: 'Se requieren profesorId y fecha' });
    }
    const ocupadas = await horasOcupadas(profesorId, fecha);
    res.json({ success: true, data: { ocupadas }, ocupadas });
  } catch (e) {
    console.error('Error obteniendo horarios ocupados:', e);
    res.status(500).json({ success: false, message: 'Error al obtener los horarios ocupados' });
  }
});

// Detalle de una reserva. Solo la ven el alumno que la compró y el profesor que
// la dicta. Va al final del bloque para no capturar las rutas fijas anteriores
// de /api/clases, que Express evalúa en orden.
app.get('/api/clases/:id', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const t = await Transaccion.findByPk(req.params.id);
    if (!t || t.tipo !== 'clase') {
      return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    }
    if (t.usuario !== req.userId && t.profesorId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    const nombres = await nombresDeUsuarios([t.usuario, t.profesorId]);
    const clase = shapeReserva(t, {
      profesor: nombres[t.profesorId] || 'Profesor',
      estudiante: nombres[t.usuario] || 'Estudiante'
    });
    res.json({ success: true, data: { clase }, clase });
  } catch (e) {
    console.error('Error obteniendo el detalle de la clase:', e);
    res.status(500).json({ success: false, message: 'Error al obtener la clase' });
  }
});

// ─── Videollamada ────────────────────────────────────────────────────────────
// La sala se aloja en Jitsi Meet, que no requiere servidor propio ni cuenta.
// Como cualquiera con el nombre de la sala podría entrar, el nombre se deriva
// con HMAC de un secreto del servidor: es impredecible y solo se le entrega a
// las dos personas autorizadas, dentro de la ventana horaria de la clase.
const SALA_SECRET = JWT_SECRET || 'sala_sin_secreto';

// Proveedor de video, configurable sin tocar código:
//   - Por defecto, la instancia pública meet.jit.si: gratis, sin cuota de
//     usuarios, pero sin garantía de servicio.
//   - Con JITSI_TENANT (el "magic cookie" de Jitsi JaaS) se usa 8x8.vc, que sí
//     ofrece soporte y SLA, con 25 usuarios activos al mes en el plan gratuito.
// El tenant viaja en el HTML del navegador, así que no es un secreto; aun así
// se toma del entorno para no fijarlo en un repositorio público.
const JITSI_TENANT = (process.env.JITSI_TENANT || '').trim();
const JITSI_DOMINIO = JITSI_TENANT ? '8x8.vc' : 'meet.jit.si';

const scriptJitsi = () => JITSI_TENANT
  ? `https://8x8.vc/${JITSI_TENANT}/external_api.js`
  : 'https://meet.jit.si/external_api.js';

// El nombre es impredecible: se deriva con HMAC de un secreto del servidor.
// En JaaS toda sala debe ir prefijada por el tenant.
const nombreSala = (claseId) => {
  const sala = 'easyclase-' + crypto.createHmac('sha256', SALA_SECRET)
    .update(`clase:${claseId}`).digest('hex').slice(0, 24);
  return JITSI_TENANT ? `${JITSI_TENANT}/${sala}` : sala;
};

// Ventana de acceso: desde 10 minutos antes hasta que termina la clase (con 15
// minutos de gracia). Se calcula en el servidor porque el navegador es
// manipulable y esto es lo que protege el acceso a la sala.
const ventanaClase = (tx) => {
  const [anio, mes, dia] = String(tx.fecha || '').split('-').map(Number);
  const [hh, mm] = String(tx.hora || '').split(':').map(Number);
  if (!Number.isFinite(anio) || !Number.isFinite(hh)) return null;
  // Las horas se guardan en hora local de Colombia (UTC-5), sin cambio horario.
  const inicioUTC = Date.UTC(anio, (mes || 1) - 1, dia || 1, hh + 5, mm || 0);
  const duracion = (Number(tx.duracion) || 1) * 60 * 60 * 1000;
  return {
    abre: inicioUTC - 10 * 60 * 1000,
    cierra: inicioUTC + duracion + 15 * 60 * 1000
  };
};

app.get('/api/clases/:id/videollamada', authMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const t = await Transaccion.findByPk(req.params.id);
    if (!t || t.tipo !== 'clase') {
      return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    }
    if (t.usuario !== req.userId && t.profesorId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta clase' });
    }
    if (t.estado !== 'aprobado') {
      return res.status(402).json({ success: false, message: 'La clase todavía no está pagada' });
    }

    const ventana = ventanaClase(t);
    if (!ventana) {
      return res.status(400).json({ success: false, message: 'La clase no tiene fecha y hora válidas' });
    }
    const ahora = Date.now();
    if (ahora < ventana.abre) {
      const minutos = Math.ceil((ventana.abre - ahora) / 60000);
      return res.status(425).json({
        success: false,
        message: minutos > 60
          ? `La videollamada se abre 10 minutos antes de la clase.`
          : `La videollamada se abre en ${minutos} minuto(s).`,
        disponibleEn: minutos
      });
    }
    if (ahora > ventana.cierra) {
      return res.status(410).json({ success: false, message: 'Esta clase ya terminó' });
    }

    const usuario = await User.findByPk(req.userId, { attributes: ['nombre'] });

    // Se registra la entrada para poder medir los usuarios activos del mes.
    // Es best-effort: si falla, la clase debe poder empezar igual.
    try {
      await AccesoVideollamada.create({
        usuario: req.userId,
        claseId: t.id,
        mes: new Date().toISOString().slice(0, 7)
      });
    } catch (e) {
      console.warn('⚠️ No se pudo registrar el acceso a la videollamada:', e.message);
    }

    res.json({
      success: true,
      data: {
        sala: nombreSala(t.id),
        dominio: JITSI_DOMINIO,
        script: scriptJitsi(),
        nombreUsuario: usuario?.nombre || 'Participante',
        esProfesor: t.profesorId === req.userId,
        titulo: t.titulo,
        // Milisegundos que quedan, para cerrar la sala al terminar la clase.
        terminaEn: ventana.cierra - ahora
      }
    });
  } catch (e) {
    console.error('Error autorizando videollamada:', e);
    res.status(500).json({ success: false, message: 'Error al abrir la videollamada' });
  }
});

// Consumo de videollamadas: usuarios distintos que entraron a una sala en cada
// mes. Es la métrica con la que facturan los proveedores de video, así que sirve
// para saber con antelación cuándo conviene pasar a un plan de pago.
//
// La instancia pública de Jitsi que usamos hoy no cobra por usuarios, pero
// tampoco ofrece garantía de servicio; el umbral de referencia es el del plan
// gratuito de Jitsi JaaS (25 usuarios activos al mes), configurable con
// LIMITE_USUARIOS_VIDEO.
const LIMITE_USUARIOS_VIDEO = Number(process.env.LIMITE_USUARIOS_VIDEO) || 25;

app.get('/api/admin/videollamadas/uso', adminMiddleware, async (req, res) => {
  try {
    if (!(await requireDB(res))) return;
    const mesActual = new Date().toISOString().slice(0, 7);

    // Usuarios distintos por mes, en una sola consulta.
    const [filas] = await sequelize.query(
      `SELECT mes,
              COUNT(DISTINCT usuario) AS usuarios,
              COUNT(*) AS sesiones
         FROM accesos_videollamada
        GROUP BY mes
        ORDER BY mes DESC
        LIMIT 12`
    );

    const historico = filas.map(f => ({
      mes: f.mes,
      usuariosActivos: Number(f.usuarios),
      sesiones: Number(f.sesiones)
    }));
    const actual = historico.find(h => h.mes === mesActual)
      || { mes: mesActual, usuariosActivos: 0, sesiones: 0 };
    const porcentaje = Math.round((actual.usuariosActivos / LIMITE_USUARIOS_VIDEO) * 100);

    res.json({
      success: true,
      data: {
        mes: mesActual,
        usuariosActivos: actual.usuariosActivos,
        sesiones: actual.sesiones,
        limite: LIMITE_USUARIOS_VIDEO,
        porcentaje,
        // Aviso escalonado para no enterarse el día que se rompe.
        nivel: porcentaje >= 100 ? 'superado' : porcentaje >= 80 ? 'critico' : porcentaje >= 50 ? 'atencion' : 'ok',
        proveedor: JITSI_TENANT ? 'Jitsi JaaS (8x8.vc)' : 'meet.jit.si (instancia pública)',
        // En JaaS el límite es real y se factura; en la instancia pública es
        // solo una referencia de volumen, porque no hay cuota de usuarios.
        limiteFacturable: !!JITSI_TENANT,
        historico
      }
    });
  } catch (e) {
    console.error('Error obteniendo el uso de videollamadas:', e);
    res.status(500).json({ success: false, message: 'Error al obtener el uso de videollamadas' });
  }
});

// ─── Pagos (Checkout Pro) ────────────────────────────────────────────────────

// Diagnóstico: medios de pago habilitados para la cuenta vendedora, con el
// monto mínimo que exige cada uno. Sirve para saber por qué el checkout no
// ofrece tarjeta: si el importe del cobro es menor que min_allowed_amount,
// Mercado Pago oculta ese medio de pago. No expone el access token.
app.get('/api/pagos/medios-disponibles', adminMiddleware, async (req, res) => {
  try {
    if (!MP_ACCESS_TOKEN) {
      return res.status(503).json({ success: false, message: 'Falta la variable de entorno MP_ACCESS_TOKEN.' });
    }
    const r = await fetch('https://api.mercadopago.com/v1/payment_methods', {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
    });
    if (!r.ok) {
      return res.status(502).json({ success: false, message: `Mercado Pago respondió ${r.status}` });
    }
    const metodos = await r.json();

    // Datos de la cuenta que recibe el dinero. Sirven para descartar dos causas
    // habituales de que el botón "Pagar" quede deshabilitado: intentar pagarse
    // a uno mismo (Mercado Pago no lo permite) y mezclar credenciales de
    // producción con datos de prueba. El email se enmascara y el token nunca
    // se expone.
    let cuentaVendedora = null;
    try {
      const ru = await fetch('https://api.mercadopago.com/users/me', {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
      });
      if (ru.ok) {
        const u = await ru.json();
        const email = String(u.email || '');
        cuentaVendedora = {
          id: u.id,
          nickname: u.nickname,
          pais: u.site_id,
          emailEnmascarado: email ? `${email.slice(0, 2)}***@${email.split('@')[1] || ''}` : '',
          // Los tokens de prueba empiezan por TEST-; los productivos por APP_USR-.
          credencial: MP_ACCESS_TOKEN.startsWith('TEST-') ? 'prueba' : 'produccion'
        };
      }
    } catch { cuentaVendedora = null; }
    const lista = (Array.isArray(metodos) ? metodos : []).map(m => ({
      id: m.id,
      nombre: m.name,
      tipo: m.payment_type_id,
      estado: m.status,
      montoMinimo: m.min_allowed_amount,
      montoMaximo: m.max_allowed_amount
    }));
    // Agrupado por tipo para leerlo de un vistazo.
    const porTipo = {};
    lista.forEach(m => { (porTipo[m.tipo] = porTipo[m.tipo] || []).push(m); });
    const tarjetas = lista.filter(m => ['credit_card', 'debit_card'].includes(m.tipo));
    res.json({
      success: true,
      data: {
        cuentaVendedora,
        totalMedios: lista.length,
        tarjetaHabilitada: tarjetas.some(m => m.estado === 'active'),
        // El mínimo a cobrar para que aparezca al menos una tarjeta.
        montoMinimoTarjeta: tarjetas.length
          ? Math.min(...tarjetas.filter(m => m.estado === 'active').map(m => Number(m.montoMinimo) || 0))
          : null,
        porTipo
      }
    });
  } catch (e) {
    console.error('Error consultando medios de pago:', e);
    res.status(500).json({ success: false, message: 'Error al consultar los medios de pago' });
  }
});

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

    const b = req.body || {};
    const { titulo, precio, cantidad, email, referencia, descripcion, metadata } = b;

    // Validaciones mínimas del ítem.
    const unitPrice = Number(precio);
    if (!titulo || !Number.isFinite(unitPrice) || unitPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren un título y un precio válido (mayor a 0).'
      });
    }
    const quantity = Number.isFinite(Number(cantidad)) && Number(cantidad) > 0 ? Math.floor(Number(cantidad)) : 1;

    // Si el total no alcanza el mínimo, Mercado Pago ocultaría las tarjetas y
    // el comprador solo podría pagar con saldo en cuenta. Se corta antes de
    // crear la preferencia para no llevarlo a un checkout sin salida.
    if (unitPrice * quantity < MONTO_MINIMO_COBRO) {
      return res.status(400).json({
        success: false,
        message: `El total debe ser de al menos $${MONTO_MINIMO_COBRO.toLocaleString('es-CO')} COP para poder pagar con tarjeta.`
      });
    }

    // Al reservar una clase, comprobar que la franja siga libre. La validación
    // del navegador no basta: dos alumnos pueden llegar al pago a la vez.
    const profesorIdNum = Number(b.profesorId);
    const duracionHoras = Number(b.duracion) > 0 ? Math.floor(Number(b.duracion)) : 1;
    if (b.tipo === 'clase' && Number.isFinite(profesorIdNum) && b.fecha && b.hora) {
      try {
        await initDB();
        if (dbReady) {
          const ocupadas = await horasOcupadas(profesorIdNum, String(b.fecha));
          if (ocupadas.includes(String(b.hora))) {
            return res.status(409).json({
              success: false,
              message: 'Ese horario acaba de ser reservado por otro estudiante. Elige otra hora.'
            });
          }
        }
      } catch (e) {
        console.warn('⚠️ No se pudo verificar el horario:', e.message);
      }
    }

    // ── Pago con saldo de la billetera ───────────────────────────────────────
    // Solo se admite cubrir el total: el saldo se descuenta en el momento y la
    // compra queda cerrada. Un pago parcial obligaría a descontar antes de que
    // Mercado Pago confirme, y un checkout abandonado dejaría al estudiante sin
    // saldo y sin clase.
    const usuarioId = getUserIdOptional(req);
    const total = unitPrice * quantity;
    if (b.usarSaldo && usuarioId) {
      await initDB();
      if (dbReady) {
        const saldo = await saldoDisponible(usuarioId);
        if (saldo < total) {
          return res.status(400).json({
            success: false,
            message: `Tu saldo ($${saldo.toLocaleString('es-CO')}) no cubre el total ($${total.toLocaleString('es-CO')}). Puedes pagar la diferencia con tarjeta sin usar el saldo.`,
            saldoDisponible: saldo
          });
        }

        const nueva = await Transaccion.create({
          usuario: usuarioId,
          tipo: b.tipo === 'clase' ? 'clase' : 'servicio',
          referencia: referencia ? String(referencia) : `saldo_${Date.now()}`,
          titulo: String(titulo),
          descripcion: descripcion ? String(descripcion) : '',
          categoria: b.categoria ? String(b.categoria) : '',
          precio: total,
          estado: 'aprobado',
          paymentId: 'saldo',
          servicioId: Number.isFinite(Number(b.servicioId)) ? Number(b.servicioId) : null,
          profesorId: Number.isFinite(profesorIdNum) ? profesorIdNum : null,
          fecha: b.fecha ? String(b.fecha) : '',
          hora: b.hora ? String(b.hora) : '',
          duracion: duracionHoras,
          pagadoConSaldo: total
        });

        await MovimientoSaldo.create({
          usuario: usuarioId,
          tipo: 'debito',
          monto: total,
          concepto: `Clase pagada con saldo: ${titulo}`,
          transaccionId: nueva.id
        });

        await notificarReservaPagada(nueva);

        return res.status(201).json({
          success: true,
          message: 'Clase pagada con tu saldo',
          data: { pagadoConSaldo: true, transaccionId: nueva.id, saldoRestante: await saldoDisponible(usuarioId) }
        });
      }
    }

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
      // Medios de pago. Se dejan sin exclusiones para que el checkout ofrezca
      // tarjeta de crédito/débito además de la cuenta de Mercado Pago.
      //
      // IMPORTANTE: no agregar `purpose: 'wallet_purchase'`. Ese valor obliga a
      // que el comprador inicie sesión con una cuenta de Mercado Pago y oculta
      // el pago como invitado con tarjeta. Al omitirlo, el pago como invitado
      // queda habilitado, que es el comportamiento por defecto de Checkout Pro.
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12,
        default_installments: 1
      },
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
        await Transaccion.create({
          usuario: usuarioId,
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
          hora: b.hora ? String(b.hora) : '',
          duracion: duracionHoras
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
// Solo el comprador de esa transacción (o un administrador) puede consultarla:
// siendo pública, cualquiera podía recorrer ids y ver importes y referencias.
app.get('/api/pagos/:id', authMiddleware, async (req, res) => {
  try {
    const mp = getMercadoPago();
    if (!mp) {
      return res.status(503).json({
        success: false,
        message: 'Mercado Pago no está configurado. Falta la variable de entorno MP_ACCESS_TOKEN.'
      });
    }

    await initDB();
    if (dbReady && Transaccion) {
      const propia = await Transaccion.findOne({
        where: { paymentId: String(req.params.id), usuario: req.userId }
      });
      if (!propia) {
        const quien = await User.findByPk(req.userId, { attributes: ['tipoUsuario'] });
        if (!['admin', 'superadmin'].includes(quien?.tipoUsuario)) {
          return res.status(403).json({ success: false, message: 'No autorizado' });
        }
      }
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
            const referencia = String(payment.external_reference);
            // Se mira el estado previo para no volver a notificar si Mercado
            // Pago reenvía la misma notificación (los webhooks se reintentan).
            const previa = await Transaccion.findOne({ where: { referencia } });
            const yaEstabaAprobada = previa?.estado === 'aprobado';

            await Transaccion.update(
              { estado: nuevoEstado, paymentId: String(payment.id) },
              { where: { referencia } }
            );

            if (nuevoEstado === 'aprobado' && previa && !yaEstabaAprobada) {
              await notificarReservaPagada(previa);
            }
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
