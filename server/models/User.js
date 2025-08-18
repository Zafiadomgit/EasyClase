import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxLength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minLength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  tipoUsuario: {
    type: String,
    enum: ['estudiante', 'profesor', 'admin'],
    required: [true, 'El tipo de usuario es obligatorio']
  },
  rol: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'superadmin'],
    default: 'user'
  },
  permisos: {
    type: [String],
    default: [],
    enum: [
      'read_users', 'create_users', 'update_users', 'delete_users',
      'read_classes', 'create_classes', 'update_classes', 'delete_classes',
      'read_payments', 'update_payments', 'refund_payments',
      'read_content', 'update_content',
      'read_reports', 'manage_disputes',
      'system_admin'
    ]
  },
  foto: {
    type: String,
    default: null
  },
  verificado: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  },
  // Campos específicos para profesores
  especialidades: [{
    type: String,
    trim: true
  }],
  titulo: {
    type: String,
    trim: true
  },
  experiencia: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    maxLength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  precioPorHora: {
    type: Number,
    min: [5000, 'El precio mínimo es $5,000 COP']
  },
  modalidad: {
    type: String,
    enum: ['online', 'presencial', 'ambas'],
    default: 'online'
  },
  ubicacion: {
    type: String,
    trim: true
  },
  certificaciones: [{
    nombre: String,
    institucion: String,
    fecha: Date
  }],
  disponibilidad: {
    lunes: [{ inicio: String, fin: String }],
    martes: [{ inicio: String, fin: String }],
    miercoles: [{ inicio: String, fin: String }],
    jueves: [{ inicio: String, fin: String }],
    viernes: [{ inicio: String, fin: String }],
    sabado: [{ inicio: String, fin: String }],
    domingo: [{ inicio: String, fin: String }]
  },
  // Estadísticas para profesores
  totalClases: {
    type: Number,
    default: 0
  },
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
userSchema.index({ email: 1 });
userSchema.index({ tipoUsuario: 1 });
userSchema.index({ especialidades: 1 });
userSchema.index({ calificacionPromedio: -1 });
userSchema.index({ precioPorHora: 1 });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Método para obtener perfil de profesor
userSchema.methods.getTeacherProfile = function() {
  if (this.tipoUsuario !== 'profesor') return null;
  
  const profile = this.getPublicProfile();
  return {
    ...profile,
    estadisticas: {
      clasesImpartidas: this.totalClases,
      calificacionPromedio: this.calificacionPromedio,
      totalReviews: this.totalReviews
    }
  };
};

// Método para verificar si el usuario tiene un permiso específico
userSchema.methods.hasPermission = function(permission) {
  if (this.rol === 'superadmin') return true;
  return this.permisos.includes(permission);
};

// Método para verificar si el usuario es admin
userSchema.methods.isAdmin = function() {
  return ['admin', 'superadmin'].includes(this.rol);
};

// Método para verificar si el usuario es superadmin
userSchema.methods.isSuperAdmin = function() {
  return this.rol === 'superadmin';
};

// Método para obtener todos los permisos según el rol
userSchema.methods.getAllPermissions = function() {
  if (this.rol === 'superadmin') {
    return [
      'read_users', 'create_users', 'update_users', 'delete_users',
      'read_classes', 'create_classes', 'update_classes', 'delete_classes',
      'read_payments', 'update_payments', 'refund_payments',
      'read_content', 'update_content',
      'read_reports', 'manage_disputes',
      'system_admin'
    ];
  }
  return this.permisos;
};

export default mongoose.model('User', userSchema);