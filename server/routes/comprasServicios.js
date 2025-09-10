import express from 'express';
import { body } from 'express-validator';
import { 
  crearCompraServicio,
  obtenerMisCompras,
  obtenerArchivosServicio,
  descargarArchivo
} from '../controllers/compraServicioController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Validaciones
const crearCompraValidation = [
  body('servicioId')
    .isInt({ min: 1 })
    .withMessage('ID de servicio inválido')
];

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de compras de servicios
router.post('/', crearCompraValidation, crearCompraServicio);
router.get('/mis-compras', obtenerMisCompras);
router.get('/:compraId/archivos', obtenerArchivosServicio);
router.get('/:compraId/archivos/:archivoId/descargar', descargarArchivo);

export default router;
