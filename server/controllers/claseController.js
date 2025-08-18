import { validationResult } from 'express-validator';
import Clase from '../models/Clase.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { crearPagoMercadoPago } from '../services/mercadoPagoService.js';

// Solicitar una nueva clase
export const solicitarClase = async (req, res) => {
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
      profesorId, 
      materia, 
      descripcion, 
      fecha, 
      horaInicio, 
      duracion, 
      modalidad 
    } = req.body;

    // Verificar que el profesor existe
    const profesor = await User.findById(profesorId);
    if (!profesor || profesor.tipoUsuario !== 'profesor') {
      return res.status(404).json({
        success: false,
        message: 'Profesor no encontrado'
      });
    }

    // Verificar que el estudiante no sea el mismo profesor
    if (req.userId === profesorId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes solicitar una clase contigo mismo'
      });
    }

    // Calcular precio total
    const precio = profesor.precioPorHora;
    const total = precio * duracion;

    // Crear la solicitud de clase
    const nuevaClase = new Clase({
      estudiante: req.userId,
      profesor: profesorId,
      materia,
      descripcion,
      fecha,
      horaInicio,
      duracion,
      modalidad,
      precio,
      total
    });

    await nuevaClase.save();

    // Poblar los datos para la respuesta
    await nuevaClase.populate([
      { path: 'estudiante', select: 'nombre email telefono' },
      { path: 'profesor', select: 'nombre email especialidades' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Solicitud de clase creada exitosamente',
      data: { clase: nuevaClase }
    });

  } catch (error) {
    console.error('Error solicitando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener clases del usuario (estudiante o profesor)
export const obtenerMisClases = async (req, res) => {
  try {
    const { estado, tipo = 'todas' } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (tipo === 'estudiante' || tipo === 'todas') {
      filtros.estudiante = req.userId;
    }
    if (tipo === 'profesor' || tipo === 'todas') {
      filtros.profesor = req.userId;
    }

    if (estado && estado !== 'todas') {
      filtros.estado = estado;
    }

    const clases = await Clase.find(filtros)
      .populate('estudiante', 'nombre email telefono')
      .populate('profesor', 'nombre email especialidades')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      data: { clases }
    });

  } catch (error) {
    console.error('Error obteniendo clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Responder a una solicitud de clase (profesor)
export const responderSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { accion, mensaje } = req.body; // 'aceptar' o 'rechazar'

    const clase = await Clase.findById(id);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario es el profesor de esta clase
    if (clase.profesor.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para responder esta solicitud'
      });
    }

    // Verificar que la clase esté en estado solicitada
    if (clase.estado !== 'solicitada') {
      return res.status(400).json({
        success: false,
        message: 'Esta solicitud ya fue respondida'
      });
    }

    if (accion === 'aceptar') {
      clase.estado = 'confirmada';
      clase.confirmadoPorProfesor = true;
      clase.fechaConfirmacion = new Date();
    } else if (accion === 'rechazar') {
      clase.estado = 'rechazada';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Acción inválida'
      });
    }

    if (mensaje) {
      clase.notasProfesor = mensaje;
    }

    await clase.save();

    res.json({
      success: true,
      message: `Solicitud ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} exitosamente`,
      data: { clase }
    });

  } catch (error) {
    console.error('Error respondiendo solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Confirmar que una clase fue completada
export const confirmarClaseCompletada = async (req, res) => {
  try {
    const { id } = req.params;
    const { notas } = req.body;

    const clase = await Clase.findById(id);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario es parte de esta clase
    const esEstudiante = clase.estudiante.toString() === req.userId;
    const esProfesor = clase.profesor.toString() === req.userId;

    if (!esEstudiante && !esProfesor) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para confirmar esta clase'
      });
    }

    // Verificar que la clase pueda ser completada
    if (!clase.puedeSerCompletada()) {
      return res.status(400).json({
        success: false,
        message: 'Esta clase no puede ser marcada como completada aún'
      });
    }

    // Marcar confirmación según el tipo de usuario
    if (esEstudiante) {
      clase.confirmadoPorEstudiante = true;
      if (notas) clase.notasEstudiante = notas;
    } else {
      clase.confirmadoPorProfesor = true;
      if (notas) clase.notasProfesor = notas;
    }

    // Si ambos confirmaron, marcar como completada
    if (clase.confirmadoPorEstudiante && clase.confirmadoPorProfesor) {
      clase.estado = 'completada';
      clase.fechaComplecion = new Date();
      clase.estadoPago = 'liberado';

      // Actualizar estadísticas del profesor
      await User.findByIdAndUpdate(clase.profesor, {
        $inc: { totalClases: 1 }
      });
    }

    await clase.save();

    res.json({
      success: true,
      message: 'Confirmación registrada exitosamente',
      data: { clase }
    });

  } catch (error) {
    console.error('Error confirmando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cancelar una clase
export const cancelarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const clase = await Clase.findById(id);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario es parte de esta clase
    const esEstudiante = clase.estudiante.toString() === req.userId;
    const esProfesor = clase.profesor.toString() === req.userId;

    if (!esEstudiante && !esProfesor) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cancelar esta clase'
      });
    }

    // Verificar que la clase puede ser cancelada
    if (!clase.puedeSerCancelada()) {
      return res.status(400).json({
        success: false,
        message: 'Esta clase no puede ser cancelada (debe ser con al menos 2 horas de anticipación)'
      });
    }

    clase.estado = 'cancelada';
    if (motivo) {
      if (esEstudiante) {
        clase.notasEstudiante = motivo;
      } else {
        clase.notasProfesor = motivo;
      }
    }

    // Si había pago, marcar para reembolso
    if (clase.estadoPago === 'pagado') {
      clase.estadoPago = 'reembolsado';
    }

    await clase.save();

    res.json({
      success: true,
      message: 'Clase cancelada exitosamente',
      data: { clase }
    });

  } catch (error) {
    console.error('Error cancelando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear pago para una clase
export const crearPagoClase = async (req, res) => {
  try {
    const { id } = req.params;

    const clase = await Clase.findById(id)
      .populate('estudiante', 'nombre email')
      .populate('profesor', 'nombre');

    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    // Verificar que el usuario es el estudiante
    if (clase.estudiante._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para pagar esta clase'
      });
    }

    // Verificar que la clase esté confirmada
    if (clase.estado !== 'confirmada') {
      return res.status(400).json({
        success: false,
        message: 'La clase debe estar confirmada para proceder al pago'
      });
    }

    // Crear preferencia de pago con MercadoPago
    const pagoData = await crearPagoMercadoPago({
      titulo: `Clase de ${clase.materia} con ${clase.profesor.nombre}`,
      precio: clase.total,
      claseId: clase._id,
      estudianteEmail: clase.estudiante.email
    });

    // Actualizar clase con ID de pago
    clase.pagoId = pagoData.id;
    await clase.save();

    res.json({
      success: true,
      data: {
        pagoUrl: pagoData.init_point,
        pagoId: pagoData.id
      }
    });

  } catch (error) {
    console.error('Error creando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando el pago'
    });
  }
};