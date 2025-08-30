import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
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
    const filtros = { 
      estado: 'activo', 
      disponible: true 
    };

    if (categoria) filtros.categoria = categoria;
    if (subcategoria) filtros.subcategoria = { [Op.like]: `%${subcategoria}%` };
    if (modalidad) filtros.modalidad = modalidad;
    if (nivelCliente) filtros.nivelCliente = nivelCliente;
    if (premium !== undefined) filtros.premium = premium === 'true';

    // Filtros de precio
    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio[Op.gte] = parseInt(precioMin);
      if (precioMax) filtros.precio[Op.lte] = parseInt(precioMax);
    }

    // Búsqueda por texto
    if (busqueda) {
      filtros[Op.or] = [
        { titulo: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    // Configurar ordenamiento
    let ordenamiento = [];
    switch (ordenar) {
      case 'precio_asc':
        ordenamiento = [['precio', 'ASC']];
        break;
      case 'precio_desc':
        ordenamiento = [['precio', 'DESC']];
        break;
      case 'calificacion':
        ordenamiento = [['calificacionPromedio', 'DESC']];
        break;
      case 'populares':
        ordenamiento = [['totalVentas', 'DESC']];
        break;
      case 'premium':
        ordenamiento = [['premium', 'DESC'], ['calificacionPromedio', 'DESC']];
        break;
      default:
        ordenamiento = [['created_at', 'DESC']];
    }

    // Calcular paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar consulta
    const servicios = await Servicio.findAll({
      where: filtros,
      include: [{
        model: User,
        as: 'proveedor',
        attributes: ['nombre', 'foto', 'calificacionPromedio', 'totalReviews', 'verificado', 'premium']
      }],
      order: ordenamiento,
      offset,
      limit: parseInt(limit)
    });

    // Contar total para paginación
    const total = await Servicio.count({ where: filtros });

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

// Obtener servicio por ID
export const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicio.findByPk(id, {
      include: [{
        model: User,
        as: 'proveedor',
        attributes: ['id', 'nombre', 'foto', 'calificacionPromedio', 'totalReviews', 'verificado', 'premium', 'descripcion', 'especialidades']
      }]
    });

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Generar datos públicos del servicio
    const servicioConDatos = await servicio.getPublicData();

    res.json({
      success: true,
      data: servicioConDatos
    });

  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo servicio
export const crearServicio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const {
      titulo,
      descripcion,
      categoria,
      subcategoria,
      precio,
      tiempoPrevisto,
      modalidad,
      requisitos,
      entregables,
      tecnologias,
      nivelCliente,
      revisionesIncluidas,
      premium,
      etiquetas,
      faq,
      fechaLimite
    } = req.body;

    // Verificar que el usuario sea profesor
    const usuario = await User.findByPk(req.userId);
    if (!usuario || usuario.tipoUsuario !== 'profesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los profesores pueden crear servicios'
      });
    }

    // Crear el servicio
    const nuevoServicio = await Servicio.create({
      titulo,
      descripcion,
      categoria,
      subcategoria,
      precio: parseFloat(precio),
      tiempoPrevisto_valor: tiempoPrevisto.valor,
      tiempoPrevisto_unidad: tiempoPrevisto.unidad,
      modalidad,
      proveedor: req.userId,
      requisitos: requisitos || [],
      entregables: entregables || [],
      tecnologias: tecnologias || [],
      nivelCliente,
      revisionesIncluidas: revisionesIncluidas || 2,
      premium: premium || false,
      etiquetas: etiquetas || [],
      faq: faq || [],
      fechaLimite: fechaLimite ? new Date(fechaLimite) : null
    });

    // Generar datos públicos del servicio
    const servicioConDatos = await nuevoServicio.getPublicData();

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: servicioConDatos
    });

  } catch (error) {
    console.error('Error creando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar servicio
export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    // Verificar que el servicio existe y pertenece al usuario
    const servicio = await Servicio.findOne({
      where: { 
        id,
        proveedor: req.userId 
      }
    });

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o no tienes permisos para editarlo'
      });
    }

    // Actualizar el servicio
    const datosActualizados = { ...req.body };
    
    // Convertir tiempoPrevisto si se proporciona
    if (datosActualizados.tiempoPrevisto) {
      datosActualizados.tiempoPrevisto_valor = datosActualizados.tiempoPrevisto.valor;
      datosActualizados.tiempoPrevisto_unidad = datosActualizados.tiempoPrevisto.unidad;
      delete datosActualizados.tiempoPrevisto;
    }

    // Convertir precio a número si se proporciona
    if (datosActualizados.precio) {
      datosActualizados.precio = parseFloat(datosActualizados.precio);
    }

    // Convertir fecha límite si se proporciona
    if (datosActualizados.fechaLimite) {
      datosActualizados.fechaLimite = new Date(datosActualizados.fechaLimite);
    }

    await servicio.update(datosActualizados);

    // Generar datos públicos del servicio actualizado
    const servicioConDatos = await servicio.getPublicData();

    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: servicioConDatos
    });

  } catch (error) {
    console.error('Error actualizando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar servicio
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el servicio existe y pertenece al usuario
    const servicio = await Servicio.findOne({
      where: { 
        id,
        proveedor: req.userId 
      }
    });

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o no tienes permisos para eliminarlo'
      });
    }

    // Eliminar el servicio
    await servicio.destroy();

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

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const servicios = await Servicio.findAll({
      where: filtros,
      order: [['created_at', 'DESC']],
      offset,
      limit: parseInt(limit)
    });

    const total = await Servicio.count({ where: filtros });

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
