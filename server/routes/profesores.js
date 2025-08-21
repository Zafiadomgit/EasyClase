import express from 'express';
import { 
  buscarProfesores,
  obtenerPerfilProfesor,
  obtenerCategorias,
  obtenerProfesoresDestacados
} from '../controllers/profesorController.js';
import { crearRetiroProfesor, obtenerBalanceProfesor } from '../services/mercadoPagoService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas para buscar profesores
router.get('/', buscarProfesores);
router.get('/destacados', obtenerProfesoresDestacados);
router.get('/categorias', obtenerCategorias);
router.get('/:id', obtenerPerfilProfesor);

// Ruta para obtener el balance disponible del profesor
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const balance = await obtenerBalanceProfesor(req.user.id);
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    console.error('Error obteniendo balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el balance'
    });
  }
});

// Ruta para crear un retiro de dinero
router.post('/retirar', authMiddleware, async (req, res) => {
  try {
    const { monto } = req.body;
    
    if (!monto || monto <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0'
      });
    }

    // Verificar que el usuario sea profesor
    if (req.user.tipoUsuario !== 'profesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los profesores pueden retirar dinero'
      });
    }

    const retiro = await crearRetiroProfesor({
      profesorId: req.user.id,
      monto: parseFloat(monto),
      email: req.user.email
    });

    res.json({
      success: true,
      data: retiro
    });
  } catch (error) {
    console.error('Error creando retiro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el retiro'
    });
  }
});

export default router;