import { validationResult } from 'express-validator';
import CompraServicio from '../models/CompraServicio.js';
import Servicio from '../models/Servicio.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { crearPagoMercadoPago } from '../services/mercadoPagoService.js';

// Crear compra de servicio
export const crearCompraServicio = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { servicioId } = req.body;

    // Verificar que el servicio existe
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Verificar que el usuario no sea el mismo que creó el servicio
    if (req.userId === servicio.proveedor) {
      return res.status(400).json({
        success: false,
        message: 'No puedes comprar tu propio servicio'
      });
    }

    // Verificar si ya existe una compra pendiente o pagada
    const compraExistente = await CompraServicio.findOne({
      where: {
        estudiante: req.userId,
        servicio: servicioId,
        estado: ['pendiente', 'pagado']
      }
    });

    if (compraExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una compra de este servicio'
      });
    }

    // Crear la compra
    const nuevaCompra = await CompraServicio.create({
      estudiante: req.userId,
      servicio: servicioId,
      precio: servicio.precio,
      estado: 'pendiente',
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    });

    // Crear pago con MercadoPago
    const pagoData = {
      transaction_amount: parseFloat(servicio.precio),
      description: `Compra de servicio: ${servicio.titulo}`,
      payment_method_id: 'pse',
      payer: {
        email: req.user.email
      },
      external_reference: `servicio_${nuevaCompra.id}`,
      metadata: {
        tipo: 'compra_servicio',
        servicioId: servicioId,
        compraId: nuevaCompra.id
      }
    };

    const pago = await crearPagoMercadoPago(pagoData);

    // Actualizar la compra con el ID del pago
    nuevaCompra.pagoId = pago.id;
    await nuevaCompra.save();

    res.status(201).json({
      success: true,
      message: 'Compra creada exitosamente',
      data: {
        compra: nuevaCompra.getPublicData(),
        pago: {
          id: pago.id,
          init_point: pago.init_point,
          status: pago.status
        }
      }
    });

  } catch (error) {
    console.error('Error creando compra de servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener compras del estudiante
export const obtenerMisCompras = async (req, res) => {
  try {
    const compras = await CompraServicio.findAll({
      where: { estudiante: req.userId },
      include: [
        {
          model: Servicio,
          as: 'servicioInfo',
          attributes: ['id', 'titulo', 'descripcion', 'categoria', 'precio', 'proveedor']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { compras }
    });

  } catch (error) {
    console.error('Error obteniendo compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener archivos de un servicio comprado
export const obtenerArchivosServicio = async (req, res) => {
  try {
    const { compraId } = req.params;

    // Verificar que la compra existe y pertenece al usuario
    const compra = await CompraServicio.findOne({
      where: {
        id: compraId,
        estudiante: req.userId,
        estado: 'pagado'
      },
      include: [
        {
          model: Servicio,
          as: 'servicioInfo'
        }
      ]
    });

    if (!compra) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada o no tienes acceso'
      });
    }

    // Verificar que no haya expirado
    if (compra.fechaExpiracion && new Date() > compra.fechaExpiracion) {
      return res.status(403).json({
        success: false,
        message: 'El acceso a este servicio ha expirado'
      });
    }

    // Obtener archivos del servicio
    const archivos = await obtenerArchivosDelServicio(compra.servicio);

    res.json({
      success: true,
      data: {
        servicio: compra.servicioInfo,
        archivos: archivos
      }
    });

  } catch (error) {
    console.error('Error obteniendo archivos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Descargar archivo específico
export const descargarArchivo = async (req, res) => {
  try {
    const { compraId, archivoId } = req.params;

    // Verificar que la compra existe y pertenece al usuario
    const compra = await CompraServicio.findOne({
      where: {
        id: compraId,
        estudiante: req.userId,
        estado: 'pagado'
      }
    });

    if (!compra) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada o no tienes acceso'
      });
    }

    // Verificar que no haya expirado
    if (compra.fechaExpiracion && new Date() > compra.fechaExpiracion) {
      return res.status(403).json({
        success: false,
        message: 'El acceso a este servicio ha expirado'
      });
    }

    // Obtener archivo específico
    const archivo = await obtenerArchivoDelServicio(compra.servicio, archivoId);

    if (!archivo) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre}"`);
    res.setHeader('Content-Type', archivo.tipo);
    res.setHeader('Content-Length', archivo.tamaño);

    // Enviar archivo
    res.send(archivo.contenido);

  } catch (error) {
    console.error('Error descargando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para obtener archivos del servicio
const obtenerArchivosDelServicio = async (servicioId) => {
  // Esta función debería conectarse al sistema de almacenamiento de archivos
  // Por ahora retornamos datos de ejemplo
  return [
    {
      id: 1,
      nombre: 'video_introduccion.mp4',
      tipo: 'video/mp4',
      tamaño: 15728640, // 15MB
      url: `/api/servicios/${servicioId}/archivos/1/descargar`
    },
    {
      id: 2,
      nombre: 'presentacion.pdf',
      tipo: 'application/pdf',
      tamaño: 2097152, // 2MB
      url: `/api/servicios/${servicioId}/archivos/2/descargar`
    }
  ];
};

// Función auxiliar para obtener archivo específico
const obtenerArchivoDelServicio = async (servicioId, archivoId) => {
  // Esta función debería obtener el archivo real del almacenamiento
  // Por ahora retornamos datos de ejemplo
  return {
    id: archivoId,
    nombre: `archivo_${archivoId}.pdf`,
    tipo: 'application/pdf',
    tamaño: 2097152,
    contenido: Buffer.from('Contenido del archivo...') // En producción sería el archivo real
  };
};
