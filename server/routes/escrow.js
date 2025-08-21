import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  crearEscrow, 
  liberarFondos, 
  reembolsarFondos, 
  iniciarDisputa, 
  resolverDisputa,
  obtenerInfoEscrow,
  obtenerEstadisticasEscrow
} from '../services/escrowService.js';
import Clase from '../models/Clase.js';

const router = express.Router();

// Confirmar clase completada (profesor)
router.post('/confirmar-clase/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;
    const { notas } = req.body;

    // Verificar que el usuario sea profesor
    if (req.user.tipoUsuario !== 'profesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los profesores pueden confirmar clases'
      });
    }

    // Buscar la clase
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el profesor sea el dueño de la clase
    if (clase.profesor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para confirmar esta clase'
      });
    }

    // Verificar que la clase esté confirmada y pagada
    if (clase.estado !== 'confirmada' || clase.estadoPago !== 'pagado') {
      return res.status(400).json({
        success: false,
        message: 'La clase debe estar confirmada y pagada'
      });
    }

    // Verificar que la clase pueda ser completada
    if (!clase.puedeSerCompletada()) {
      return res.status(400).json({
        success: false,
        message: 'La clase no puede ser completada aún'
      });
    }

    // Liberar fondos del escrow
    const resultado = await liberarFondos(claseId, 'profesor');

    // Actualizar notas del profesor
    if (notas) {
      clase.notasProfesor = notas;
    }

    clase.confirmadoPorProfesor = true;
    clase.fechaComplecion = new Date();
    await clase.save();

    res.json({
      success: true,
      message: 'Clase confirmada y fondos liberados exitosamente',
      data: {
        amountReleased: resultado.amountReleased,
        fechaComplecion: clase.fechaComplecion
      }
    });

  } catch (error) {
    console.error('Error confirmando clase:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al confirmar la clase'
    });
  }
});

// Confirmar clase completada (estudiante)
router.post('/confirmar-clase-estudiante/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;
    const { notas } = req.body;

    // Verificar que el usuario sea estudiante
    if (req.user.tipoUsuario !== 'estudiante') {
      return res.status(403).json({
        success: false,
        message: 'Solo los estudiantes pueden confirmar clases'
      });
    }

    // Buscar la clase
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el estudiante sea el dueño de la clase
    if (clase.estudiante.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para confirmar esta clase'
      });
    }

    // Verificar que la clase esté confirmada y pagada
    if (clase.estado !== 'confirmada' || clase.estadoPago !== 'pagado') {
      return res.status(400).json({
        success: false,
        message: 'La clase debe estar confirmada y pagada'
      });
    }

    // Verificar que la clase pueda ser completada
    if (!clase.puedeSerCompletada()) {
      return res.status(400).json({
        success: false,
        message: 'La clase no puede ser completada aún'
      });
    }

    // Liberar fondos del escrow
    const resultado = await liberarFondos(claseId, 'estudiante');

    // Actualizar notas del estudiante
    if (notas) {
      clase.notasEstudiante = notas;
    }

    clase.confirmadoPorEstudiante = true;
    clase.fechaComplecion = new Date();
    await clase.save();

    res.json({
      success: true,
      message: 'Clase confirmada y fondos liberados exitosamente',
      data: {
        amountReleased: resultado.amountReleased,
        fechaComplecion: clase.fechaComplecion
      }
    });

  } catch (error) {
    console.error('Error confirmando clase:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al confirmar la clase'
    });
  }
});

// Cancelar clase y reembolsar fondos
router.post('/cancelar-clase/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;
    const { motivo } = req.body;

    // Buscar la clase
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño de la clase
    const esProfesor = clase.profesor.toString() === req.user._id.toString();
    const esEstudiante = clase.estudiante.toString() === req.user._id.toString();
    
    if (!esProfesor && !esEstudiante) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cancelar esta clase'
      });
    }

    // Verificar que la clase pueda ser cancelada
    if (!clase.puedeSerCancelada()) {
      return res.status(400).json({
        success: false,
        message: 'La clase no puede ser cancelada (muy cerca de la fecha)'
      });
    }

    // Verificar que haya un escrow activo
    if (clase.escrowStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No hay fondos en escrow para reembolsar'
      });
    }

    // Reembolsar fondos
    const resultado = await reembolsarFondos(claseId, motivo || 'Cancelación por usuario');

    res.json({
      success: true,
      message: 'Clase cancelada y fondos reembolsados exitosamente',
      data: {
        amountRefunded: resultado.amountRefunded,
        reason: resultado.reason
      }
    });

  } catch (error) {
    console.error('Error cancelando clase:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cancelar la clase'
    });
  }
});

// Iniciar disputa
router.post('/disputa/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({
        success: false,
        message: 'El motivo de la disputa es obligatorio'
      });
    }

    // Buscar la clase
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño de la clase
    const esProfesor = clase.profesor.toString() === req.user._id.toString();
    const esEstudiante = clase.estudiante.toString() === req.user._id.toString();
    
    if (!esProfesor && !esEstudiante) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para iniciar una disputa en esta clase'
      });
    }

    // Verificar que haya un escrow activo
    if (clase.escrowStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No hay fondos en escrow para disputar'
      });
    }

    // Iniciar disputa
    const iniciadoPor = esProfesor ? 'profesor' : 'estudiante';
    const resultado = await iniciarDisputa(claseId, iniciadoPor, motivo);

    res.json({
      success: true,
      message: 'Disputa iniciada exitosamente',
      data: {
        status: resultado.status,
        disputedBy: resultado.disputedBy,
        reason: resultado.reason
      }
    });

  } catch (error) {
    console.error('Error iniciando disputa:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al iniciar la disputa'
    });
  }
});

// Obtener información de escrow de una clase
router.get('/info/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;

    // Buscar la clase
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario sea el dueño de la clase
    const esProfesor = clase.profesor.toString() === req.user._id.toString();
    const esEstudiante = clase.estudiante.toString() === req.user._id.toString();
    
    if (!esProfesor && !esEstudiante) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta información'
      });
    }

    // Obtener información de escrow
    const infoEscrow = await obtenerInfoEscrow(claseId);

    res.json({
      success: true,
      data: infoEscrow
    });

  } catch (error) {
    console.error('Error obteniendo información de escrow:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener la información de escrow'
    });
  }
});

// Obtener clases con escrow pendiente del usuario
router.get('/pendientes', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtros según el tipo de usuario
    const filtros = { escrowStatus: 'pending' };
    
    if (req.user.tipoUsuario === 'profesor') {
      filtros.profesor = req.user._id;
    } else if (req.user.tipoUsuario === 'estudiante') {
      filtros.estudiante = req.user._id;
    }

    // Obtener clases
    const clases = await Clase.find(filtros)
      .populate('profesor', 'nombre email')
      .populate('estudiante', 'nombre email')
      .sort({ fecha: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total
    const total = await Clase.countDocuments(filtros);

    res.json({
      success: true,
      data: {
        clases,
        paginacion: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo clases pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las clases pendientes'
    });
  }
});

// Obtener estadísticas de escrow (solo para profesores)
router.get('/estadisticas', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario sea profesor
    if (req.user.tipoUsuario !== 'profesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los profesores pueden ver estadísticas de escrow'
      });
    }

    const estadisticas = await obtenerEstadisticasEscrow(req.user._id);

    res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas de escrow'
    });
  }
});

// Resolver disputa (solo admin)
router.post('/resolver-disputa/:claseId', authMiddleware, async (req, res) => {
  try {
    const { claseId } = req.params;
    const { resolucion } = req.body;

    // Verificar que el usuario sea admin
    if (req.user.tipoUsuario !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden resolver disputas'
      });
    }

    if (!resolucion || !['release', 'refund'].includes(resolucion)) {
      return res.status(400).json({
        success: false,
        message: 'Resolución inválida. Debe ser "release" o "refund"'
      });
    }

    // Resolver disputa
    const resultado = await resolverDisputa(claseId, resolucion, req.user._id);

    res.json({
      success: true,
      message: 'Disputa resuelta exitosamente',
      data: resultado
    });

  } catch (error) {
    console.error('Error resolviendo disputa:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al resolver la disputa'
    });
  }
});

export default router;
