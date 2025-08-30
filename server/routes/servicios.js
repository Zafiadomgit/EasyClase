import express from 'express';
import { body } from 'express-validator';
import {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  obtenerMisServicios,
  obtenerCategorias
} from '../controllers/servicioController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Validaciones para crear/actualizar servicio
const servicioValidation = [
  body('titulo')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('La descripción debe tener entre 20 y 2000 caracteres'),
  body('categoria')
    .isIn([
      'Tesis y Trabajos Académicos',
      'Desarrollo Web',
      'Desarrollo de Apps',
      'Diseño Gráfico',
      'Marketing Digital',
      'Consultoría de Negocios',
      'Traducción',
      'Redacción de Contenido',
      'Asesoría Legal',
      'Contabilidad y Finanzas',
      'Fotografía',
      'Video y Edición',
      'Arquitectura y Diseño',
      'Ingeniería',
      'Otros'
    ])
    .withMessage('Categoría no válida'),
  body('precio')
    .isNumeric()
    .isFloat({ min: 10000 })
    .withMessage('El precio debe ser mínimo $10,000 COP'),
  body('tiempoPrevisto.valor')
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage('El tiempo previsto debe ser un número positivo'),
  body('tiempoPrevisto.unidad')
    .isIn(['horas', 'días', 'semanas', 'meses'])
    .withMessage('Unidad de tiempo no válida'),
  body('modalidad')
    .isIn(['presencial', 'virtual', 'mixta'])
    .withMessage('Modalidad no válida'),
  body('requisitos')
    .optional()
    .isArray()
    .withMessage('Los requisitos deben ser un array'),
  body('entregables')
    .optional()
    .isArray()
    .withMessage('Los entregables deben ser un array'),
  body('tecnologias')
    .optional()
    .isArray()
    .withMessage('Las tecnologías deben ser un array'),
  body('revisionesIncluidas')
    .optional()
    .isNumeric()
    .isInt({ min: 0 })
    .withMessage('Las revisiones incluidas debe ser un número no negativo')
];

// Rutas públicas
router.get('/', obtenerServicios);
router.get('/categorias', obtenerCategorias);
router.get('/:id', obtenerServicioPorId);

// Rutas protegidas
router.get('/usuario/mis-servicios', verifyToken, obtenerMisServicios);
router.post('/', verifyToken, servicioValidation, crearServicio);
router.put('/:id', verifyToken, servicioValidation, actualizarServicio);
router.delete('/:id', verifyToken, eliminarServicio);

export default router;
