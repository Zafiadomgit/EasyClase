import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar que el usuario esté autenticado
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'easyclase_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar que el usuario sea admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: Permisos de administrador requeridos'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando permisos de administrador'
    });
  }
};

// Middleware para verificar que el usuario sea superadmin
export const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!req.user.isSuperAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: Permisos de super administrador requeridos'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verificando permisos de super administrador'
    });
  }
};

// Middleware para verificar permisos específicos
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      if (!req.user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado: Permiso '${permission}' requerido`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando permisos'
      });
    }
  };
};

// Middleware para verificar múltiples permisos (AND logic)
export const requirePermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const hasAllPermissions = permissions.every(permission => 
        req.user.hasPermission(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado: Permisos requeridos: ${permissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando permisos múltiples'
      });
    }
  };
};

// Middleware para verificar al menos uno de múltiples permisos (OR logic)
export const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const hasAnyPermission = permissions.some(permission => 
        req.user.hasPermission(permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado: Se requiere al menos uno de estos permisos: ${permissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verificando permisos alternativos'
      });
    }
  };
};
