import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  toggleUserStatus,
  getAllClasses,
  resolveDispute,
  createAdminUser
} from '../controllers/adminController.js';
import {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  requirePermission,
  requirePermissions
} from '../middleware/adminAuth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// ===== DASHBOARD =====
// Estadísticas generales del dashboard
router.get('/dashboard', requireAdmin, getDashboardStats);

// ===== GESTIÓN DE USUARIOS =====
// Obtener todos los usuarios
router.get('/users', requirePermission('read_users'), getAllUsers);

// Actualizar usuario
router.put('/users/:userId', requirePermission('update_users'), updateUser);

// Suspender/activar usuario
router.patch('/users/:userId/status', requirePermission('update_users'), toggleUserStatus);

// Crear usuario administrador (solo superadmin)
router.post('/users/admin', requireSuperAdmin, createAdminUser);

// ===== GESTIÓN DE CLASES =====
// Obtener todas las clases
router.get('/classes', requirePermission('read_classes'), getAllClasses);

// Resolver disputa
router.patch('/classes/:claseId/resolve-dispute', 
  requirePermission('manage_disputes'), 
  resolveDispute
);

// ===== GESTIÓN DE PAGOS =====
// Rutas para gestión de pagos (se pueden expandir)
router.get('/payments', requirePermission('read_payments'), (req, res) => {
  res.json({
    success: true,
    message: 'Funcionalidad de pagos en desarrollo',
    data: []
  });
});

// ===== GESTIÓN DE CONTENIDO =====
// Rutas para gestión de contenido (se pueden expandir)
router.get('/content', requirePermission('read_content'), (req, res) => {
  res.json({
    success: true,
    message: 'Funcionalidad de gestión de contenido en desarrollo',
    data: []
  });
});

// ===== REPORTES =====
// Rutas para reportes (se pueden expandir)
router.get('/reports', requirePermission('read_reports'), (req, res) => {
  res.json({
    success: true,
    message: 'Funcionalidad de reportes en desarrollo',
    data: []
  });
});

// ===== CONFIGURACIÓN DEL SISTEMA =====
// Solo para superadmin
router.get('/system', requireSuperAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Configuración del sistema',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected'
    }
  });
});

export default router;
