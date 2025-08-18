import express from 'express';
import { 
  buscarProfesores,
  obtenerPerfilProfesor,
  obtenerCategorias,
  obtenerProfesoresDestacados
} from '../controllers/profesorController.js';

const router = express.Router();

// Rutas públicas para buscar profesores
router.get('/', buscarProfesores);
router.get('/destacados', obtenerProfesoresDestacados);
router.get('/categorias', obtenerCategorias);
router.get('/:id', obtenerPerfilProfesor);

export default router;