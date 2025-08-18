import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  verifyToken 
} from '../controllers/authController.js';

const router = express.Router();

// Validaciones para registro
const registerValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('telefono')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('tipoUsuario')
    .isIn(['estudiante', 'profesor'])
    .withMessage('El tipo de usuario debe ser estudiante o profesor')
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

// Validaciones para actualizar perfil
const updateProfileValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('El teléfono debe tener entre 10 y 15 caracteres'),
  body('especialidades')
    .optional()
    .isArray()
    .withMessage('Las especialidades deben ser un array'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('precioPorHora')
    .optional()
    .isNumeric()
    .isFloat({ min: 5000 })
    .withMessage('El precio por hora debe ser mínimo $5,000 COP')
];

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Rutas protegidas
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfileValidation, updateProfile);

export default router;