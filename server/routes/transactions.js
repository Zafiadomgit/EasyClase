import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Clase from '../models/Clase.js';

const router = express.Router();

// Obtener historial de transacciones del usuario
router.get('/historial', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filtros = {};
    
    if (req.user.tipoUsuario === 'profesor') {
      filtros.profesorId = req.user._id;
    } else if (req.user.tipoUsuario === 'estudiante') {
      filtros.estudianteId = req.user._id;
    }

    if (type) {
      filtros.type = type;
    }

    if (status) {
      filtros.status = status;
    }

    // Obtener transacciones
    const transacciones = await Transaction.find(filtros)
      .populate('claseId', 'materia fecha horaInicio duracion modalidad')
      .populate('profesorId', 'nombre email')
      .populate('estudianteId', 'nombre email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de transacciones
    const total = await Transaction.countDocuments(filtros);

    // Calcular estadísticas
    const estadisticas = await Transaction.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: null,
          totalIngresos: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'pago_clase'] },
                '$amountNet',
                0
              ]
            }
          },
          totalRetiros: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'retiro_profesor'] },
                '$amount',
                0
              ]
            }
          },
          totalComisiones: {
            $sum: '$commission'
          },
          transaccionesAprobadas: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'approved'] },
                1,
                0
              ]
            }
          },
          transaccionesPendientes: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        transacciones,
        paginacion: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        },
        estadisticas: estadisticas[0] || {
          totalIngresos: 0,
          totalRetiros: 0,
          totalComisiones: 0,
          transaccionesAprobadas: 0,
          transaccionesPendientes: 0
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo historial de transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de transacciones'
    });
  }
});

// Obtener detalles de una transacción específica
router.get('/:transactionId', authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaccion = await Transaction.findById(transactionId)
      .populate('claseId', 'materia fecha horaInicio duracion modalidad estado')
      .populate('profesorId', 'nombre email telefono')
      .populate('estudianteId', 'nombre email telefono');

    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Verificar que el usuario tenga acceso a esta transacción
    if (req.user.tipoUsuario === 'profesor' && transaccion.profesorId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta transacción'
      });
    }

    if (req.user.tipoUsuario === 'estudiante' && transaccion.estudianteId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta transacción'
      });
    }

    res.json({
      success: true,
      data: transaccion
    });

  } catch (error) {
    console.error('Error obteniendo transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la transacción'
    });
  }
});

// Obtener estadísticas de transacciones (para dashboard)
router.get('/estadisticas/dashboard', authMiddleware, async (req, res) => {
  try {
    const { periodo = '30d' } = req.query;
    
    // Calcular fecha de inicio según el período
    const fechaInicio = new Date();
    switch (periodo) {
      case '7d':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        break;
      case '30d':
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        break;
      case '90d':
        fechaInicio.setDate(fechaInicio.getDate() - 90);
        break;
      case '1y':
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      default:
        fechaInicio.setDate(fechaInicio.getDate() - 30);
    }

    // Construir filtros
    const filtros = {
      createdAt: { $gte: fechaInicio }
    };
    
    if (req.user.tipoUsuario === 'profesor') {
      filtros.profesorId = req.user._id;
    } else if (req.user.tipoUsuario === 'estudiante') {
      filtros.estudianteId = req.user._id;
    }

    // Estadísticas generales
    const estadisticas = await Transaction.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: null,
          totalTransacciones: { $sum: 1 },
          totalIngresos: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'pago_clase'] },
                '$amountNet',
                0
              ]
            }
          },
          totalRetiros: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'retiro_profesor'] },
                '$amount',
                0
              ]
            }
          },
          totalComisiones: { $sum: '$commission' },
          transaccionesAprobadas: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'approved'] },
                1,
                0
              ]
            }
          },
          transaccionesPendientes: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'pending'] },
                1,
                0
              ]
            }
          },
          transaccionesRechazadas: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'rejected'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Transacciones por día (últimos 7 días)
    const transaccionesPorDia = await Transaction.aggregate([
      {
        $match: {
          ...filtros,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 },
          ingresos: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'pago_clase'] },
                '$amountNet',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top materias (solo para profesores)
    let topMaterias = [];
    if (req.user.tipoUsuario === 'profesor') {
      topMaterias = await Transaction.aggregate([
        { $match: { ...filtros, type: 'pago_clase' } },
        {
          $lookup: {
            from: 'clases',
            localField: 'claseId',
            foreignField: '_id',
            as: 'clase'
          }
        },
        { $unwind: '$clase' },
        {
          $group: {
            _id: '$clase.materia',
            totalIngresos: { $sum: '$amountNet' },
            totalClases: { $sum: 1 }
          }
        },
        { $sort: { totalIngresos: -1 } },
        { $limit: 5 }
      ]);
    }

    res.json({
      success: true,
      data: {
        estadisticas: estadisticas[0] || {
          totalTransacciones: 0,
          totalIngresos: 0,
          totalRetiros: 0,
          totalComisiones: 0,
          transaccionesAprobadas: 0,
          transaccionesPendientes: 0,
          transaccionesRechazadas: 0
        },
        transaccionesPorDia,
        topMaterias,
        periodo
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas'
    });
  }
});

// Exportar transacciones (para reportes)
router.get('/exportar/reporte', authMiddleware, async (req, res) => {
  try {
    const { fechaInicio, fechaFin, formato = 'json' } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (fechaInicio && fechaFin) {
      filtros.createdAt = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }
    
    if (req.user.tipoUsuario === 'profesor') {
      filtros.profesorId = req.user._id;
    } else if (req.user.tipoUsuario === 'estudiante') {
      filtros.estudianteId = req.user._id;
    }

    const transacciones = await Transaction.find(filtros)
      .populate('claseId', 'materia fecha horaInicio duracion modalidad')
      .populate('profesorId', 'nombre email')
      .populate('estudianteId', 'nombre email')
      .sort({ createdAt: -1 });

    if (formato === 'csv') {
      // Generar CSV
      const csvHeaders = [
        'Fecha',
        'Tipo',
        'Estado',
        'Monto',
        'Monto Neto',
        'Comisión',
        'Materia',
        'Profesor',
        'Estudiante',
        'Método de Pago'
      ];

      const csvData = transacciones.map(t => [
        t.createdAt.toISOString().split('T')[0],
        t.type,
        t.status,
        t.amount,
        t.amountNet,
        t.commission,
        t.claseId?.materia || 'N/A',
        t.profesorId?.nombre || 'N/A',
        t.estudianteId?.nombre || 'N/A',
        t.paymentMethod?.paymentType || 'N/A'
      ]);

      const csv = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transacciones_${Date.now()}.csv`);
      return res.send(csv);
    }

    // JSON por defecto
    res.json({
      success: true,
      data: transacciones
    });

  } catch (error) {
    console.error('Error exportando transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al exportar las transacciones'
    });
  }
});

export default router;
