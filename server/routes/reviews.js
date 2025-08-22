import express from 'express';
import { body } from 'express-validator';
import { authMiddleware as auth } from '../middleware/auth.js';
import {
  crearReview,
  obtenerReviewsProfesor,
  responderReview,
  obtenerMisReviews
} from '../controllers/reviewController.js';

const router = express.Router();

// Validaciones para crear reseña
const validarCrearReview = [
  body('claseId').isMongoId().withMessage('ID de clase inválido'),
  body('calificacion').isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  body('comentario')
    .isLength({ min: 10, max: 500 })
    .withMessage('El comentario debe tener entre 10 y 500 caracteres'),
  body('aspectos.puntualidad').optional().isInt({ min: 1, max: 5 }),
  body('aspectos.claridad').optional().isInt({ min: 1, max: 5 }),
  body('aspectos.paciencia').optional().isInt({ min: 1, max: 5 }),
  body('aspectos.conocimiento').optional().isInt({ min: 1, max: 5 }),
  body('recomendaria').optional().isBoolean()
];

// Validaciones para responder reseña
const validarResponderReview = [
  body('comentario')
    .isLength({ min: 10, max: 300 })
    .withMessage('La respuesta debe tener entre 10 y 300 caracteres')
];

// Rutas
router.post('/', auth, validarCrearReview, crearReview);
router.get('/profesor/:profesorId', obtenerReviewsProfesor);
router.put('/:reviewId/responder', auth, validarResponderReview, responderReview);
router.get('/mis-reviews', auth, obtenerMisReviews);

export default router;
