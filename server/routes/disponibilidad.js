import express from 'express';
import { body } from 'express-validator';
import { 
  obtenerDisponibilidad,
  actualizarDisponibilidad,
  obtenerHorariosDisponibles
} from '../controllers/disponibilidadController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Validaciones
const actualizarDisponibilidadValidation = [
  body('disponibilidad')
    .isArray({ min: 1 })
    .withMessage('La disponibilidad debe ser un array con al menos un elemento'),
  body('disponibilidad.*.diaSemana')
    .isIn(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'])
    .withMessage('Día de la semana inválido'),
  body('disponibilidad.*.horaInicio')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de inicio inválida (formato HH:MM)'),
  body('disponibilidad.*.horaFin')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Hora de fin inválida (formato HH:MM)')
];

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de disponibilidad
router.get('/', obtenerDisponibilidad);
router.post('/', actualizarDisponibilidadValidation, actualizarDisponibilidad);
router.get('/horarios-disponibles', obtenerHorariosDisponibles);

export default router;
