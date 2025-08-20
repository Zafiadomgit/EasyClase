import express from 'express'
import { body } from 'express-validator'
import {
  obtenerPerfil,
  actualizarIntereses,
  actualizarObjetivos,
  actualizarPreferencias,
  obtenerSugerencias,
  actualizarProgreso,
  registrarBusqueda,
  actualizarPrivacidad
} from '../controllers/perfilEnriquecidoController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Middleware de autenticación para todas las rutas
router.use(requireAuth)

// Validaciones
const interesesValidation = [
  body('intereses').isArray().withMessage('Los intereses deben ser un array'),
  body('intereses.*.categoria')
    .isIn([
      'Programación', 'Diseño', 'Marketing', 'Idiomas', 'Excel', 
      'Matemáticas', 'Física', 'Química', 'Contabilidad', 'Finanzas',
      'Fotografía', 'Video', 'Música', 'Arte', 'Escritura',
      'Desarrollo Personal', 'Negocios', 'Emprendimiento'
    ])
    .withMessage('Categoría de interés no válida'),
  body('intereses.*.nivel')
    .optional()
    .isIn(['principiante', 'intermedio', 'avanzado'])
    .withMessage('Nivel debe ser principiante, intermedio o avanzado'),
  body('intereses.*.prioridad')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La prioridad debe ser un número entre 1 y 5')
]

const objetivosValidation = [
  body('objetivos').isArray().withMessage('Los objetivos deben ser un array'),
  body('objetivos.*.titulo')
    .isLength({ min: 1, max: 100 })
    .withMessage('El título del objetivo debe tener entre 1 y 100 caracteres'),
  body('objetivos.*.descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('objetivos.*.categoria')
    .notEmpty()
    .withMessage('La categoría del objetivo es obligatoria'),
  body('objetivos.*.fechaLimite')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe tener formato válido'),
  body('objetivos.*.estado')
    .optional()
    .isIn(['activo', 'completado', 'pausado'])
    .withMessage('Estado debe ser activo, completado o pausado'),
  body('objetivos.*.progreso')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('El progreso debe ser un número entre 0 y 100')
]

const preferenciasValidation = [
  body('preferenciasAprendizaje.modalidadPreferida')
    .optional()
    .isIn(['individual', 'grupal', 'mixta'])
    .withMessage('Modalidad debe ser individual, grupal o mixta'),
  body('preferenciasAprendizaje.duracionSesionPreferida')
    .optional()
    .isInt({ min: 30, max: 180 })
    .withMessage('Duración debe ser entre 30 y 180 minutos'),
  body('preferenciasAprendizaje.nivelExperiencia')
    .optional()
    .isIn(['principiante', 'intermedio', 'avanzado'])
    .withMessage('Nivel debe ser principiante, intermedio o avanzado'),
  body('preferenciasAprendizaje.presupuestoMensual')
    .optional()
    .isNumeric()
    .withMessage('El presupuesto debe ser un número válido')
]

// Rutas del perfil enriquecido
router.get('/', obtenerPerfil)
router.put('/intereses', interesesValidation, actualizarIntereses)
router.put('/objetivos', objetivosValidation, actualizarObjetivos)
router.put('/preferencias', preferenciasValidation, actualizarPreferencias)
router.get('/sugerencias', obtenerSugerencias)
router.put('/objetivos/:objetivoId/progreso', 
  body('progreso').isInt({ min: 0, max: 100 }).withMessage('Progreso debe ser entre 0 y 100'),
  actualizarProgreso
)
router.post('/busqueda', 
  body('categoria').optional().notEmpty().withMessage('Categoría requerida'),
  body('termino').notEmpty().withMessage('Término de búsqueda requerido'),
  registrarBusqueda
)
router.put('/privacidad',
  body('configuracionPrivacidad.perfilPublico').optional().isBoolean(),
  body('configuracionPrivacidad.mostrarProgreso').optional().isBoolean(),
  body('configuracionPrivacidad.recibirSugerencias').optional().isBoolean(),
  actualizarPrivacidad
)

export default router
