import { validationResult } from 'express-validator';
import PlantillaClase from '../models/PlantillaClase.js';
import User from '../models/User.js';
import { crearPagoMercadoPago } from '../services/mercadoPagoService.js';

// Crear plantilla de clase
export const crearPlantillaClase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const {
      titulo,
      descripcion,
      materia,
      categoria,
      tipo,
      precio,
      duracion,
      maxEstudiantes,
      requisitos,
      objetivos
    } = req.body;

    // Verificar que el usuario sea profesor
    const usuario = await User.findByPk(req.userId);
    if (!usuario || usuario.tipoUsuario !== 'profesor') {
      return res.status(403).json({
        success: false,
        message: 'Solo los profesores pueden crear clases'
      });
    }

    // Crear la plantilla de clase
    const nuevaPlantilla = await PlantillaClase.create({
      titulo,
      descripcion,
      materia,
      categoria,
      profesor: req.userId,
      tipo,
      precio: parseFloat(precio),
      duracion: parseInt(duracion),
      maxEstudiantes: tipo === 'grupal' ? parseInt(maxEstudiantes) : 1,
      modalidad: 'online',
      requisitos,
      objetivos,
      estado: 'activa'
    });

    res.status(201).json({
      success: true,
      message: 'Clase creada exitosamente',
      data: nuevaPlantilla.getPublicData()
    });

  } catch (error) {
    console.error('Error creando plantilla de clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener plantillas del profesor
export const obtenerMisPlantillas = async (req, res) => {
  try {
    const plantillas = await PlantillaClase.findAll({
      where: { 
        profesor: req.userId,
        estado: 'activa'
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { plantillas }
    });

  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las plantillas (para estudiantes)
export const obtenerPlantillas = async (req, res) => {
  try {
    const { categoria, busqueda, page = 1, limit = 12 } = req.query;

    const filtros = { estado: 'activa' };
    
    if (categoria) {
      filtros.categoria = categoria;
    }

    if (busqueda) {
      filtros[Op.or] = [
        { titulo: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } },
        { materia: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const plantillas = await PlantillaClase.findAndCountAll({
      where: filtros,
      include: [
        {
          model: User,
          as: 'profesorInfo',
          attributes: ['id', 'nombre', 'email', 'precioPorHora']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        plantillas: plantillas.rows,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(plantillas.count / limit),
          total: plantillas.count
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener plantilla por ID
export const obtenerPlantillaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const plantilla = await PlantillaClase.findByPk(id, {
      include: [
        {
          model: User,
          as: 'profesorInfo',
          attributes: ['id', 'nombre', 'email', 'precioPorHora', 'calificacionPromedio']
        }
      ]
    });

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    res.json({
      success: true,
      data: { plantilla: plantilla.getPublicData() }
    });

  } catch (error) {
    console.error('Error obteniendo plantilla:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar plantilla
export const actualizarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plantilla = await PlantillaClase.findOne({
      where: {
        id: id,
        profesor: req.userId
      }
    });

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada o no tienes permisos'
      });
    }

    await plantilla.update(updates);

    res.json({
      success: true,
      message: 'Clase actualizada exitosamente',
      data: plantilla.getPublicData()
    });

  } catch (error) {
    console.error('Error actualizando plantilla:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar plantilla
export const eliminarPlantilla = async (req, res) => {
  try {
    const { id } = req.params;

    const plantilla = await PlantillaClase.findOne({
      where: {
        id: id,
        profesor: req.userId
      }
    });

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada o no tienes permisos'
      });
    }

    // Cambiar estado a inactiva en lugar de eliminar
    await plantilla.update({ estado: 'inactiva' });

    res.json({
      success: true,
      message: 'Clase eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando plantilla:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
