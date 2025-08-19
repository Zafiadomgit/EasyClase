import User from '../models/User.js';
import Clase from '../models/Clase.js';
import Review from '../models/Review.js';
import Servicio from '../models/Servicio.js';
import mongoose from 'mongoose';

// Dashboard principal del admin
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalClasses,
      totalRevenue,
      pendingDisputes,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments({ activo: true }),
      User.countDocuments({ tipoUsuario: 'profesor', activo: true }),
      User.countDocuments({ tipoUsuario: 'estudiante', activo: true }),
      Clase.countDocuments(),
      Clase.aggregate([
        { $match: { estado: 'completada' } },
        { $group: { _id: null, total: { $sum: '$precio' } } }
      ]),
      Clase.countDocuments({ estado: 'disputa' }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    // Estadísticas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          usuarios: { $sum: 1 },
          profesores: {
            $sum: { $cond: [{ $eq: ['$tipoUsuario', 'profesor'] }, 1, 0] }
          },
          estudiantes: {
            $sum: { $cond: [{ $eq: ['$tipoUsuario', 'estudiante'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top profesores por ingresos
    const topTeachers = await Clase.aggregate([
      {
        $match: { estado: 'completada' }
      },
      {
        $group: {
          _id: '$profesorId',
          totalIngresos: { $sum: '$precio' },
          totalClases: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'profesor'
        }
      },
      { $unwind: '$profesor' },
      { $sort: { totalIngresos: -1 } },
      { $limit: 10 },
      {
        $project: {
          nombre: '$profesor.nombre',
          email: '$profesor.email',
          totalIngresos: 1,
          totalClases: 1,
          calificacion: '$profesor.calificacionPromedio'
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTeachers,
          totalStudents,
          totalClasses,
          totalRevenue: totalRevenue[0]?.total || 0,
          pendingDisputes,
          newUsersThisMonth
        },
        monthlyStats,
        topTeachers
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas del dashboard'
    });
  }
};

// Gestión de usuarios
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      tipo = '',
      rol = '',
      activo = ''
    } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tipo) filter.tipoUsuario = tipo;
    if (rol) filter.rol = rol;
    if (activo !== '') filter.activo = activo === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios'
    });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // No permitir cambiar contraseña a través de este endpoint
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando usuario'
    });
  }
};

// Suspender/activar usuario
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { activo, razon } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        activo,
        ...(razon && { razonSuspension: razon })
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: `Usuario ${activo ? 'activado' : 'suspendido'} correctamente`,
      data: { user }
    });

  } catch (error) {
    console.error('Error cambiando estado del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error cambiando estado del usuario'
    });
  }
};

// Gestión de clases
export const getAllClasses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      estado = '',
      search = ''
    } = req.query;

    const filter = {};
    if (estado) filter.estado = estado;
    if (search) {
      filter.$or = [
        { materia: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    const classes = await Clase.find(filter)
      .populate('profesorId', 'nombre email')
      .populate('estudianteId', 'nombre email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Clase.countDocuments(filter);

    res.json({
      success: true,
      data: {
        classes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo clases'
    });
  }
};

// Resolver disputa
export const resolveDispute = async (req, res) => {
  try {
    const { claseId } = req.params;
    const { decision, razon, reembolso } = req.body;

    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }

    if (clase.estado !== 'disputa') {
      return res.status(400).json({
        success: false,
        message: 'Esta clase no está en disputa'
      });
    }

    // Actualizar clase según la decisión
    let nuevoEstado;
    switch (decision) {
      case 'favor_estudiante':
        nuevoEstado = reembolso ? 'reembolsada' : 'cancelada';
        break;
      case 'favor_profesor':
        nuevoEstado = 'completada';
        break;
      case 'parcial':
        nuevoEstado = 'reembolso_parcial';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Decisión inválida'
        });
    }

    clase.estado = nuevoEstado;
    clase.resolucionDisputa = {
      decision,
      razon,
      reembolso,
      fechaResolucion: new Date(),
      resueltoBy: req.user._id
    };

    await clase.save();

    res.json({
      success: true,
      message: 'Disputa resuelta correctamente',
      data: { clase }
    });

  } catch (error) {
    console.error('Error resolviendo disputa:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolviendo disputa'
    });
  }
};

// Crear usuario admin
export const createAdminUser = async (req, res) => {
  try {
    const { nombre, email, password, rol, permisos } = req.body;

    // Solo superadmin puede crear otros admins
    if (!req.user.isSuperAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Solo un super administrador puede crear usuarios admin'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    const adminUser = new User({
      nombre,
      email,
      password,
      tipoUsuario: 'admin',
      rol: rol || 'admin',
      permisos: permisos || [],
      verificado: true,
      telefono: '000-000-0000' // Campo requerido
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuario administrador creado correctamente',
      data: {
        user: adminUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Error creando usuario admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando usuario administrador'
    });
  }
};

// Función helper para convertir datos a CSV
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escapar comillas y envolver en comillas si contiene comas
      return typeof value === 'string' && value.includes(',') 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Exportar reportes de usuarios
export const exportarUsuarios = async (req, res) => {
  try {
    const { formato = 'csv', tipo = 'todos' } = req.query;

    let filtros = { activo: true };
    if (tipo === 'profesores') {
      filtros.tipoUsuario = 'profesor';
    } else if (tipo === 'estudiantes') {
      filtros.tipoUsuario = 'estudiante';
    }

    const usuarios = await User.find(filtros)
      .select('nombre email telefono tipoUsuario verificado calificacionPromedio totalClases totalReviews createdAt')
      .sort({ createdAt: -1 });

    const headers = [
      'nombre', 'email', 'telefono', 'tipoUsuario', 'verificado', 
      'calificacionPromedio', 'totalClases', 'totalReviews', 'fechaRegistro'
    ];

    const data = usuarios.map(user => ({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      tipoUsuario: user.tipoUsuario,
      verificado: user.verificado ? 'Sí' : 'No',
      calificacionPromedio: user.calificacionPromedio || 0,
      totalClases: user.totalClases || 0,
      totalReviews: user.totalReviews || 0,
      fechaRegistro: user.createdAt.toISOString().split('T')[0]
    }));

    if (formato === 'csv') {
      const csvContent = convertToCSV(data, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="usuarios_${tipo}_${new Date().toISOString().split('T')[0]}.csv"`);
      
      return res.send(csvContent);
    }

    // Para Excel, devolvemos JSON que el frontend puede procesar
    res.json({
      success: true,
      data: {
        usuarios: data,
        headers,
        total: data.length
      }
    });

  } catch (error) {
    console.error('Error exportando usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error exportando datos de usuarios'
    });
  }
};

// Exportar reportes de clases
export const exportarClases = async (req, res) => {
  try {
    const { formato = 'csv', estado } = req.query;

    let filtros = {};
    if (estado) {
      filtros.estado = estado;
    }

    const clases = await Clase.find(filtros)
      .populate('estudiante', 'nombre email')
      .populate('profesor', 'nombre email')
      .select('materia descripcion precio estado fechaClase modalidad duracion fechaSolicitud createdAt')
      .sort({ createdAt: -1 });

    const headers = [
      'materia', 'estudiante', 'profesor', 'precio', 'estado', 
      'fechaClase', 'modalidad', 'duracion', 'fechaSolicitud', 'comision'
    ];

    const data = clases.map(clase => ({
      materia: clase.materia,
      estudiante: clase.estudiante?.nombre || 'N/A',
      profesor: clase.profesor?.nombre || 'N/A',
      precio: clase.precio,
      estado: clase.estado,
      fechaClase: clase.fechaClase ? clase.fechaClase.toISOString().split('T')[0] : 'N/A',
      modalidad: clase.modalidad,
      duracion: clase.duracion,
      fechaSolicitud: clase.fechaSolicitud.toISOString().split('T')[0],
      comision: (clase.precio * 0.10).toFixed(0)
    }));

    if (formato === 'csv') {
      const csvContent = convertToCSV(data, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="clases_${estado || 'todas'}_${new Date().toISOString().split('T')[0]}.csv"`);
      
      return res.send(csvContent);
    }

    res.json({
      success: true,
      data: {
        clases: data,
        headers,
        total: data.length
      }
    });

  } catch (error) {
    console.error('Error exportando clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error exportando datos de clases'
    });
  }
};

// Exportar reportes de servicios
export const exportarServicios = async (req, res) => {
  try {
    const { formato = 'csv', categoria } = req.query;

    let filtros = {};
    if (categoria) {
      filtros.categoria = categoria;
    }

    const servicios = await Servicio.find(filtros)
      .populate('proveedor', 'nombre email')
      .select('titulo categoria precio estado totalVentas calificacionPromedio createdAt')
      .sort({ createdAt: -1 });

    const headers = [
      'titulo', 'categoria', 'proveedor', 'precio', 'estado', 
      'totalVentas', 'calificacionPromedio', 'fechaCreacion', 'comisionTotal'
    ];

    const data = servicios.map(servicio => ({
      titulo: servicio.titulo,
      categoria: servicio.categoria,
      proveedor: servicio.proveedor?.nombre || 'N/A',
      precio: servicio.precio,
      estado: servicio.estado,
      totalVentas: servicio.totalVentas || 0,
      calificacionPromedio: servicio.calificacionPromedio || 0,
      fechaCreacion: servicio.createdAt.toISOString().split('T')[0],
      comisionTotal: ((servicio.precio * 0.10) * (servicio.totalVentas || 0)).toFixed(0)
    }));

    if (formato === 'csv') {
      const csvContent = convertToCSV(data, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="servicios_${categoria || 'todos'}_${new Date().toISOString().split('T')[0]}.csv"`);
      
      return res.send(csvContent);
    }

    res.json({
      success: true,
      data: {
        servicios: data,
        headers,
        total: data.length
      }
    });

  } catch (error) {
    console.error('Error exportando servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error exportando datos de servicios'
    });
  }
};

// Reporte financiero general
export const exportarReporteFinanciero = async (req, res) => {
  try {
    const { formato = 'csv', fechaInicio, fechaFin } = req.query;

    const filtroFecha = {};
    if (fechaInicio) {
      filtroFecha.$gte = new Date(fechaInicio);
    }
    if (fechaFin) {
      filtroFecha.$lte = new Date(fechaFin);
    }

    // Reporte de clases completadas
    const clasesCompletadas = await Clase.find({
      estado: 'completada',
      ...(Object.keys(filtroFecha).length > 0 && { fechaClase: filtroFecha })
    })
    .populate('estudiante', 'nombre')
    .populate('profesor', 'nombre')
    .select('materia precio fechaClase createdAt');

    // Reporte de servicios vendidos (simulado, necesitaríamos un modelo de Pedidos)
    const serviciosVendidos = await Servicio.find({
      totalVentas: { $gt: 0 },
      ...(Object.keys(filtroFecha).length > 0 && { createdAt: filtroFecha })
    })
    .populate('proveedor', 'nombre')
    .select('titulo precio totalVentas createdAt');

    const headers = [
      'tipo', 'concepto', 'cliente', 'proveedor', 'monto', 
      'comision', 'ganancia', 'fecha'
    ];

    const data = [];

    // Agregar clases
    clasesCompletadas.forEach(clase => {
      data.push({
        tipo: 'Clase',
        concepto: clase.materia,
        cliente: clase.estudiante?.nombre || 'N/A',
        proveedor: clase.profesor?.nombre || 'N/A',
        monto: clase.precio,
        comision: (clase.precio * 0.10).toFixed(0),
        ganancia: (clase.precio * 0.10).toFixed(0),
        fecha: clase.fechaClase.toISOString().split('T')[0]
      });
    });

    // Agregar servicios
    serviciosVendidos.forEach(servicio => {
      const montoTotal = servicio.precio * servicio.totalVentas;
      const comisionTotal = montoTotal * 0.10;
      
      data.push({
        tipo: 'Servicio',
        concepto: servicio.titulo,
        cliente: 'Múltiples',
        proveedor: servicio.proveedor?.nombre || 'N/A',
        monto: montoTotal,
        comision: comisionTotal.toFixed(0),
        ganancia: comisionTotal.toFixed(0),
        fecha: servicio.createdAt.toISOString().split('T')[0]
      });
    });

    if (formato === 'csv') {
      const csvContent = convertToCSV(data, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="reporte_financiero_${new Date().toISOString().split('T')[0]}.csv"`);
      
      return res.send(csvContent);
    }

    // Calcular totales
    const totalMonto = data.reduce((sum, item) => sum + parseFloat(item.monto), 0);
    const totalComision = data.reduce((sum, item) => sum + parseFloat(item.comision), 0);

    res.json({
      success: true,
      data: {
        transacciones: data,
        headers,
        resumen: {
          totalTransacciones: data.length,
          totalMonto: totalMonto.toFixed(0),
          totalComision: totalComision.toFixed(0)
        }
      }
    });

  } catch (error) {
    console.error('Error exportando reporte financiero:', error);
    res.status(500).json({
      success: false,
      message: 'Error exportando reporte financiero'
    });
  }
};
