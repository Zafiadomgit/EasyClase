import express from 'express';
import { body } from 'express-validator';
import { 
  solicitarClase,
  obtenerMisClases,
  responderSolicitud,
  confirmarClaseCompletada,
  cancelarClase,
  crearPagoClase,
  obtenerInfoDescuentos,
  obtenerHistorialDescuentos
} from '../controllers/claseController.js';
import {
  crearPlantillaClase,
  obtenerMisPlantillas,
  obtenerPlantillas,
  obtenerPlantillaPorId,
  actualizarPlantilla,
  eliminarPlantilla
} from '../controllers/plantillaClaseController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Validaciones para solicitar clase
const solicitarClaseValidation = [
  body('profesorId')
    .isMongoId()
    .withMessage('ID de profesor inválido'),
  body('materia')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('La materia debe tener entre 3 y 100 caracteres'),
  body('fecha')
    .isISO8601()
    .toDate()
    .withMessage('Fecha inválida'),
  body('horaInicio')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora inválida (formato HH:MM)'),
  body('duracion')
    .isInt({ min: 1, max: 8 })
    .withMessage('La duración debe ser entre 1 y 8 horas'),
  body('modalidad')
    .isIn(['online'])
    .withMessage('Solo se acepta modalidad online')
];

// Validaciones para crear plantilla de clase
const crearPlantillaValidation = [
  body('titulo')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('La descripción debe tener entre 20 y 1000 caracteres'),
  body('materia')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('La materia debe tener entre 3 y 100 caracteres'),
  body('categoria')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('La categoría debe tener entre 3 y 50 caracteres'),
  body('tipo')
    .isIn(['individual', 'grupal'])
    .withMessage('Tipo debe ser individual o grupal'),
  body('precio')
    .isNumeric()
    .isFloat({ min: 5000 })
    .withMessage('El precio debe ser mínimo $5,000 COP'),
  body('duracion')
    .isInt({ min: 1, max: 8 })
    .withMessage('La duración debe ser entre 1 y 8 horas'),
  body('maxEstudiantes')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Máximo de estudiantes debe ser entre 1 y 20')
];

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de clases
router.post('/', solicitarClaseValidation, solicitarClase);
router.get('/mis-clases', obtenerMisClases);
router.put('/:id/responder', responderSolicitud);
router.put('/:id/completar', confirmarClaseCompletada);
router.put('/:id/cancelar', cancelarClase);
router.post('/:id/pagar', crearPagoClase);

// Rutas de descuentos
router.get('/descuentos/info', obtenerInfoDescuentos);
router.get('/descuentos/historial', obtenerHistorialDescuentos);

// Rutas de plantillas de clases
router.post('/plantillas', crearPlantillaValidation, crearPlantillaClase);
router.get('/plantillas', obtenerPlantillas);
router.get('/plantillas/mis-plantillas', obtenerMisPlantillas);
router.get('/plantillas/:id', obtenerPlantillaPorId);
router.put('/plantillas/:id', actualizarPlantilla);
router.delete('/plantillas/:id', eliminarPlantilla);

export default router;