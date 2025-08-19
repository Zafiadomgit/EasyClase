import { validationResult } from 'express-validator';
import Servicio from '../models/Servicio.js';
import User from '../models/User.js';

// Obtener todos los servicios con filtros
export const obtenerServicios = async (req, res) => {
  try {
    const {
      categoria,
      subcategoria,
      precioMin,
      precioMax,
      modalidad,
      nivelCliente,
      busqueda,
      ordenar = 'recientes',
      premium,
      page = 1,
      limit = 12
    } = req.query;

    // Construir filtros
    const filtros = { estado: 'activo', disponible: true };

    if (categoria) filtros.categoria = categoria;
    if (subcategoria) filtros.subcategoria = new RegExp(subcategoria, 'i');
    if (modalidad) filtros.modalidad = modalidad;
    if (nivelCliente) filtros.nivelCliente = nivelCliente;
    if (premium !== undefined) filtros.premium = premium === 'true';

    // Filtros de precio
    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio.$gte = parseInt(precioMin);
      if (precioMax) filtros.precio.$lte = parseInt(precioMax);
    }

    // Búsqueda por texto
    if (busqueda) {
      filtros.$text = { $search: busqueda };
    }

    // Configurar ordenamiento
    let ordenamiento = {};
    switch (ordenar) {
      case 'precio_asc':
        ordenamiento = { precio: 1 };
        break;
      case 'precio_desc':
        ordenamiento = { precio: -1 };
        break;
      case 'calificacion':
        ordenamiento = { calificacionPromedio: -1 };
        break;
      case 'populares':
        ordenamiento = { totalVentas: -1 };
        break;
      case 'premium':
        ordenamiento = { premium: -1, calificacionPromedio: -1 };
        break;
      default:
        ordenamiento = { createdAt: -1 };
    }

    // Calcular paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar consulta
    const servicios = await Servicio.find(filtros)
      .populate('proveedor', 'nombre foto calificacionPromedio totalReviews verificado premium')
      .sort(ordenamiento)
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total para paginación
    const total = await Servicio.countDocuments(filtros);

    // Generar datos públicos de servicios con comisiones calculadas
    const serviciosConDatos = await Promise.all(
      servicios.map(async (servicio) => await servicio.getPublicData())
    );

    res.json({
      success: true,
      data: {
        servicios: serviciosConDatos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un servicio específico
export const obtenerServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicio.findById(id)
      .populate('proveedor', 'nombre foto descripcion experiencia calificacionPromedio totalReviews verificado premium especialidades ubicacion');

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    const servicioConDatos = await servicio.getPublicData();
    
    res.json({
      success: true,
      data: { servicio: servicioConDatos }
    });

  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear un nuevo servicio
export const crearServicio = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    // Verificar que el usuario existe
    const usuario = await User.findById(req.userId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Crear el servicio
    const nuevoServicio = new Servicio({
      ...req.body,
      proveedor: req.userId
    });

    await nuevoServicio.save();

    // Obtener el servicio completo con el proveedor
    const servicioCompleto = await Servicio.findById(nuevoServicio._id)
      .populate('proveedor', 'nombre foto calificacionPromedio totalReviews verificado premium');

    const servicioConDatos = await servicioCompleto.getPublicData();
    
    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: { servicio: servicioConDatos }
    });

  } catch (error) {
    console.error('Error creando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar un servicio
export const actualizarServicio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Verificar que el servicio existe y pertenece al usuario
    const servicio = await Servicio.findOne({ _id: id, proveedor: req.userId });

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o no tienes permisos para editarlo'
      });
    }

    // Actualizar el servicio
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('proveedor', 'nombre foto calificacionPromedio totalReviews verificado premium');

    const servicioConDatos = await servicioActualizado.getPublicData();
    
    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: { servicio: servicioConDatos }
    });

  } catch (error) {
    console.error('Error actualizando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar un servicio
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el servicio existe y pertenece al usuario
    const servicio = await Servicio.findOne({ _id: id, proveedor: req.userId });

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o no tienes permisos para eliminarlo'
      });
    }

    await Servicio.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener servicios del usuario actual
export const obtenerMisServicios = async (req, res) => {
  try {
    const { estado, page = 1, limit = 10 } = req.query;

    const filtros = { proveedor: req.userId };
    if (estado) filtros.estado = estado;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const servicios = await Servicio.find(filtros)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Servicio.countDocuments(filtros);

    // Generar datos públicos de servicios con comisiones calculadas
    const serviciosConDatos = await Promise.all(
      servicios.map(async (servicio) => await servicio.getPublicData())
    );
    
    res.json({
      success: true,
      data: {
        servicios: serviciosConDatos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mis servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categorías de servicios
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = [
      {
        nombre: 'Tesis y Trabajos Académicos',
        icono: '📚',
        subcategorias: ['Tesis de Grado', 'Tesis de Maestría', 'Tesis Doctoral', 'Ensayos', 'Monografías']
      },
      {
        nombre: 'Desarrollo Web',
        icono: '💻',
        subcategorias: ['Sitios Web', 'E-commerce', 'Aplicaciones Web', 'Landing Pages', 'APIs']
      },
      {
        nombre: 'Desarrollo de Apps',
        icono: '📱',
        subcategorias: ['Apps iOS', 'Apps Android', 'Apps Multiplataforma', 'Apps Web', 'Prototipado']
      },
      {
        nombre: 'Diseño Gráfico',
        icono: '🎨',
        subcategorias: ['Logos', 'Branding', 'Material Publicitario', 'Diseño Web', 'Ilustraciones']
      },
      {
        nombre: 'Marketing Digital',
        icono: '📈',
        subcategorias: ['SEO', 'SEM', 'Redes Sociales', 'Email Marketing', 'Content Marketing']
      },
      {
        nombre: 'Consultoría de Negocios',
        icono: '💼',
        subcategorias: ['Plan de Negocios', 'Estrategia', 'Análisis Financiero', 'Gestión', 'Startups']
      }
    ];

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
