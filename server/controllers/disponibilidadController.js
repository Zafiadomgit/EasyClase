import { validationResult } from 'express-validator';
import DisponibilidadProfesor from '../models/DisponibilidadProfesor.js';

// Obtener disponibilidad del profesor
export const obtenerDisponibilidad = async (req, res) => {
  try {
    const disponibilidad = await DisponibilidadProfesor.findAll({
      where: { 
        profesor: req.userId,
        activo: true 
      },
      order: [['diaSemana', 'ASC'], ['horaInicio', 'ASC']]
    });

    res.json({
      success: true,
      data: { disponibilidad }
    });

  } catch (error) {
    console.error('Error obteniendo disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear/actualizar disponibilidad
export const actualizarDisponibilidad = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { disponibilidad } = req.body;

    // Eliminar disponibilidad existente
    await DisponibilidadProfesor.destroy({
      where: { profesor: req.userId }
    });

    // Crear nueva disponibilidad
    const nuevaDisponibilidad = await Promise.all(
      disponibilidad.map(async (disp) => {
        return await DisponibilidadProfesor.create({
          profesor: req.userId,
          diaSemana: disp.diaSemana,
          horaInicio: disp.horaInicio,
          horaFin: disp.horaFin,
          duracionClase: disp.duracionClase || 60,
          tiempoEntreClases: disp.tiempoEntreClases || 15,
          activo: true
        });
      })
    );

    res.json({
      success: true,
      message: 'Disponibilidad actualizada correctamente',
      data: { disponibilidad: nuevaDisponibilidad }
    });

  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener horarios disponibles para una clase específica
export const obtenerHorariosDisponibles = async (req, res) => {
  try {
    const { profesorId, fecha, duracion } = req.query;

    if (!profesorId || !fecha || !duracion) {
      return res.status(400).json({
        success: false,
        message: 'profesorId, fecha y duracion son requeridos'
      });
    }

    // Obtener disponibilidad del profesor
    const disponibilidad = await DisponibilidadProfesor.findAll({
      where: { 
        profesor: profesorId,
        activo: true 
      }
    });

    // Obtener día de la semana de la fecha
    const fechaObj = new Date(fecha);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fechaObj.getDay()];

    // Filtrar disponibilidad para el día específico
    const disponibilidadDia = disponibilidad.filter(disp => disp.diaSemana === diaSemana);

    // Generar horarios disponibles
    const horariosDisponibles = [];
    
    disponibilidadDia.forEach(disp => {
      const horaInicio = new Date(`2000-01-01T${disp.horaInicio}`);
      const horaFin = new Date(`2000-01-01T${disp.horaFin}`);
      const duracionMin = parseInt(duracion);
      
      let horaActual = new Date(horaInicio);
      
      while (horaActual < horaFin) {
        const horaSiguiente = new Date(horaActual.getTime() + duracionMin * 60000);
        
        if (horaSiguiente <= horaFin) {
          horariosDisponibles.push({
            horaInicio: horaActual.toTimeString().slice(0, 5),
            horaFin: horaSiguiente.toTimeString().slice(0, 5),
            disponible: true
          });
        }
        
        // Avanzar con el tiempo entre clases
        horaActual = new Date(horaActual.getTime() + (duracionMin + disp.tiempoEntreClases) * 60000);
      }
    });

    res.json({
      success: true,
      data: { 
        horariosDisponibles,
        fecha,
        duracion: duracionMin
      }
    });

  } catch (error) {
    console.error('Error obteniendo horarios disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
