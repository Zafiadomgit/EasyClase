import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar el usuario en la base de datos
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Agregar el usuario al request
      req.user = user;
      next();
      
    } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware opcional para rutas que pueden ser públicas o privadas
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      req.user = user || null;
      next();
      
    } catch (error) {
      req.user = null;
      next();
    }
    
  } catch (error) {
    req.user = null;
    next();
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado'
      });
    }

    if (!roles.includes(req.user.tipoUsuario)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

// Middleware específico para profesores
export const requireProfesor = requireRole(['profesor']);

// Middleware específico para estudiantes
export const requireEstudiante = requireRole(['estudiante']);

// Middleware para verificar que el usuario es el propietario del recurso
export const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado'
      });
    }

    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (req.user._id.toString() !== resourceUserId && req.user.tipoUsuario !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};
