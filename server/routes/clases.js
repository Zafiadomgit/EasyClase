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

export default router;