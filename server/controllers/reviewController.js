import { validationResult } from 'express-validator';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import notificationScheduler from '../services/notificationSchedulerService.js';

// Crear una nueva reseña
export const crearReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { claseId, calificacion, comentario, aspectos, recomendaria } = req.body;

    // Verificar que la clase existe y pertenece al estudiante
    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    if (clase.estudiante.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para calificar esta clase'
      });
    }

    // Verificar que la clase esté completada
    if (clase.estado !== 'completada') {
      return res.status(400).json({
        success: false,
        message: 'Solo puedes calificar clases completadas'
      });
    }

    // Verificar que no haya una reseña existente para esta clase
    const reviewExistente = await Review.findOne({ clase: claseId });
    if (reviewExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya has calificado esta clase'
      });
    }

    // Crear la reseña
    const nuevaReview = new Review({
      clase: claseId,
      estudiante: req.userId,
      profesor: clase.profesor,
      calificacion,
      comentario,
      aspectos,
      recomendaria
    });

    await nuevaReview.save();

    // Actualizar estadísticas del profesor
    await actualizarEstadisticasProfesor(clase.profesor);

    // Enviar notificación al profesor sobre la nueva reseña
    try {
      const profesor = await User.findById(clase.profesor);
      if (profesor) {
        await notificationScheduler.sendImmediateNotification('new_review', {
          profesor,
          review: nuevaReview
        });
      }
    } catch (emailError) {
      console.error('Error enviando notificación de nueva reseña:', emailError);
      // No fallar la creación de la reseña si falla el correo
    }

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: { review: nuevaReview.getPublicReview() }
    });

  } catch (error) {
    console.error('Error creando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener reseñas de un profesor
export const obtenerReviewsProfesor = async (req, res) => {
  try {
    const { profesorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verificar que el profesor existe
    const profesor = await User.findById(profesorId);
    if (!profesor || profesor.tipoUsuario !== 'profesor') {
      return res.status(404).json({
        success: false,
        message: 'Profesor no encontrado'
      });
    }

    // Obtener reseñas con paginación
    const reviews = await Review.find({ profesor: profesorId })
      .populate('estudiante', 'nombre')
      .populate('clase', 'materia fecha')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ profesor: profesorId });

    // Calcular estadísticas de reseñas
    const estadisticas = await Review.aggregate([
      { $match: { profesor: profesor._id } },
      {
        $group: {
          _id: null,
          promedioCalificacion: { $avg: '$calificacion' },
          totalReviews: { $sum: 1 },
          promedioPuntualidad: { $avg: '$aspectos.puntualidad' },
          promedioClaridad: { $avg: '$aspectos.claridad' },
          promedioPaciencia: { $avg: '$aspectos.paciencia' },
          promedioConocimiento: { $avg: '$aspectos.conocimiento' },
          recomendaciones: {
            $sum: { $cond: ['$recomendaria', 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => review.getPublicReview()),
        estadisticas: estadisticas[0] || {
          promedioCalificacion: 0,
          totalReviews: 0,
          promedioPuntualidad: 0,
          promedioClaridad: 0,
          promedioPaciencia: 0,
          promedioConocimiento: 0,
          recomendaciones: 0
        },
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalResults: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Responder a una reseña (profesor)
export const responderReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comentario } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Verificar que el usuario es el profesor de esta reseña
    if (review.profesor.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para responder esta reseña'
      });
    }

    // Verificar que no haya una respuesta existente
    if (review.respuestaProfesor) {
      return res.status(400).json({
        success: false,
        message: 'Ya has respondido a esta reseña'
      });
    }

    // Agregar respuesta
    review.respuestaProfesor = {
      comentario,
      fecha: new Date()
    };

    await review.save();

    res.json({
      success: true,
      message: 'Respuesta agregada exitosamente',
      data: { review: review.getPublicReview() }
    });

  } catch (error) {
    console.error('Error respondiendo reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener reseñas del estudiante
export const obtenerMisReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ estudiante: req.userId })
      .populate('profesor', 'nombre especialidades')
      .populate('clase', 'materia fecha')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ estudiante: req.userId });

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => review.getPublicReview()),
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalResults: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mis reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para actualizar estadísticas del profesor
async function actualizarEstadisticasProfesor(profesorId) {
  try {
    const estadisticas = await Review.aggregate([
      { $match: { profesor: profesorId } },
      {
        $group: {
          _id: null,
          promedioCalificacion: { $avg: '$calificacion' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (estadisticas.length > 0) {
      await User.findByIdAndUpdate(profesorId, {
        calificacionPromedio: Math.round(estadisticas[0].promedioCalificacion * 10) / 10,
        totalReviews: estadisticas[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error actualizando estadísticas del profesor:', error);
  }
}
