import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Clase from '../models/Clase.js';
import Review from '../models/Review.js';

// Buscar profesores con filtros
export const buscarProfesores = async (req, res) => {
  try {
    const { 
      busqueda, 
      categoria, 
      modalidad, 
      precioMin, 
      precioMax, 
      calificacion, 
      ordenarPor = 'calificacionPromedio',
      orden = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Construir filtros
    const filtros = { 
      tipoUsuario: 'profesor',
      activo: true,
      verificado: true
    };

    if (busqueda) {
      filtros.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { especialidades: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } }
      ];
    }

    if (categoria) {
      filtros.especialidades = { $regex: categoria, $options: 'i' };
    }

    if (modalidad && modalidad !== 'todas') {
      if (modalidad === 'ambas') {
        filtros.modalidad = 'ambas';
      } else {
        filtros.$or = [
          { modalidad: modalidad },
          { modalidad: 'ambas' }
        ];
      }
    }

    if (precioMin || precioMax) {
      filtros.precioPorHora = {};
      if (precioMin) filtros.precioPorHora.$gte = Number(precioMin);
      if (precioMax) filtros.precioPorHora.$lte = Number(precioMax);
    }

    if (calificacion) {
      filtros.calificacionPromedio = { $gte: Number(calificacion) };
    }

    // Opciones de paginación y ordenamiento
    const options = {
      page: Number(page),
      limit: Number(limit)
    };

    // Ejecutar búsqueda con ordenamiento inteligente
    // 1. Primero los premium (activo: true)
    // 2. Entre premium, ordenar por calificación y número de reseñas
    // 3. Entre no premium, ordenar por calificación y número de reseñas
    const profesores = await User.find(filtros)
      .select('-password -__v')
      .sort([
        { 'premium.activo': -1 }, // Premium primero (true = 1, false = 0)
        { calificacionPromedio: -1 }, // Mejor calificación primero
        { totalReviews: -1 }, // Más reseñas primero
        { createdAt: -1 } // Más recientes como desempate
      ])
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await User.countDocuments(filtros);

    res.json({
      success: true,
      data: {
        profesores,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(total / options.limit),
          totalResults: total,
          hasNext: options.page < Math.ceil(total / options.limit),
          hasPrev: options.page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error buscando profesores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil detallado de un profesor
export const obtenerPerfilProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    const profesor = await User.findOne({ 
      _id: id, 
      tipoUsuario: 'profesor',
      activo: true 
    }).select('-password -__v');

    if (!profesor) {
      return res.status(404).json({
        success: false,
        message: 'Profesor no encontrado'
      });
    }

    // Obtener reseñas del profesor
    const reviews = await Review.find({ profesor: id })
      .populate('estudiante', 'nombre')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calcular estadísticas adicionales
    const estadisticas = {
      clasesImpartidas: profesor.totalClases,
      calificacionPromedio: profesor.calificacionPromedio,
      totalReviews: profesor.totalReviews,
      estudiantesActivos: await Clase.distinct('estudiante', { 
        profesor: id, 
        estado: 'completada',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 días
      }).length
    };

    res.json({
      success: true,
      data: {
        profesor: profesor.getTeacherProfile(),
        reviews: reviews.map(review => review.getPublicReview()),
        estadisticas
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil del profesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categorías/especialidades disponibles
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await User.aggregate([
      { $match: { tipoUsuario: 'profesor', activo: true } },
      { $unwind: '$especialidades' },
      { 
        $group: { 
          _id: '$especialidades',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: { categorias }
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener profesores destacados
export const obtenerProfesoresDestacados = async (req, res) => {
  try {
    const profesores = await User.find({
      tipoUsuario: 'profesor',
      activo: true,
      verificado: true,
      calificacionPromedio: { $gte: 4.5 },
      totalReviews: { $gte: 10 }
    })
    .select('-password -__v')
    .sort([
      { 'premium.activo': -1 }, // Premium primero
      { calificacionPromedio: -1 }, // Mejor calificación primero
      { totalReviews: -1 }, // Más reseñas primero
      { createdAt: -1 } // Más recientes como desempate
    ])
    .limit(8);

    res.json({
      success: true,
      data: { profesores }
    });

  } catch (error) {
    console.error('Error obteniendo profesores destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};