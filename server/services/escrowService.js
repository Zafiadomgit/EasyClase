import Transaction from '../models/Transaction.js';
import Clase from '../models/Clase.js';
import User from '../models/User.js';

// Estados del escrow
export const ESCROW_STATUS = {
  PENDING: 'pending',           // Fondos retenidos, esperando confirmación
  RELEASED: 'released',         // Fondos liberados al profesor
  REFUNDED: 'refunded',         // Fondos reembolsados al estudiante
  DISPUTED: 'disputed',         // En disputa
  EXPIRED: 'expired'            // Expirado (no se confirmó en tiempo)
};

// Tiempo límite para confirmar clase (24 horas)
const CONFIRMATION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Crear escrow para una clase
export const crearEscrow = async (claseId, transactionId) => {
  try {
    console.log(`🔒 Creando escrow para clase: ${claseId}`);

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Verificar que la transacción esté aprobada
    if (transaction.status !== 'approved') {
      throw new Error('La transacción debe estar aprobada para crear escrow');
    }

    // Actualizar la transacción con estado de escrow
    transaction.metadata.set('escrow_status', ESCROW_STATUS.PENDING);
    transaction.metadata.set('escrow_created_at', new Date().toISOString());
    transaction.metadata.set('escrow_expires_at', new Date(Date.now() + CONFIRMATION_TIMEOUT).toISOString());
    
    await transaction.save();

    // Actualizar la clase
    clase.escrowStatus = ESCROW_STATUS.PENDING;
    clase.escrowCreatedAt = new Date();
    clase.escrowExpiresAt = new Date(Date.now() + CONFIRMATION_TIMEOUT);
    clase.transactionId = transactionId;
    
    await clase.save();

    console.log(`✅ Escrow creado exitosamente para clase: ${claseId}`);
    
    return {
      success: true,
      escrowId: transaction._id,
      status: ESCROW_STATUS.PENDING,
      expiresAt: clase.escrowExpiresAt
    };

  } catch (error) {
    console.error('Error creando escrow:', error);
    throw error;
  }
};

// Liberar fondos al profesor (confirmar clase completada)
export const liberarFondos = async (claseId, confirmadoPor = 'profesor') => {
  try {
    console.log(`💰 Liberando fondos para clase: ${claseId}`);

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    if (clase.escrowStatus !== ESCROW_STATUS.PENDING) {
      throw new Error('El escrow no está en estado pendiente');
    }

    // Verificar que no haya expirado
    if (new Date() > clase.escrowExpiresAt) {
      throw new Error('El escrow ha expirado');
    }

    const transaction = await Transaction.findById(clase.transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Actualizar transacción
    transaction.metadata.set('escrow_status', ESCROW_STATUS.RELEASED);
    transaction.metadata.set('escrow_released_at', new Date().toISOString());
    transaction.metadata.set('escrow_released_by', confirmadoPor);
    
    await transaction.save();

    // Actualizar clase
    clase.escrowStatus = ESCROW_STATUS.RELEASED;
    clase.escrowReleasedAt = new Date();
    clase.escrowReleasedBy = confirmadoPor;
    clase.estado = 'completada';
    
    await clase.save();

    // Actualizar balance del profesor
    await actualizarBalanceProfesor(clase.profesor, transaction.amountNet);

    console.log(`✅ Fondos liberados exitosamente para clase: ${claseId}`);
    
    return {
      success: true,
      amountReleased: transaction.amountNet,
      status: ESCROW_STATUS.RELEASED
    };

  } catch (error) {
    console.error('Error liberando fondos:', error);
    throw error;
  }
};

// Reembolsar fondos al estudiante
export const reembolsarFondos = async (claseId, motivo = 'cancelación') => {
  try {
    console.log(`💸 Reembolsando fondos para clase: ${claseId}`);

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    if (clase.escrowStatus !== ESCROW_STATUS.PENDING) {
      throw new Error('El escrow no está en estado pendiente');
    }

    const transaction = await Transaction.findById(clase.transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Actualizar transacción
    transaction.metadata.set('escrow_status', ESCROW_STATUS.REFUNDED);
    transaction.metadata.set('escrow_refunded_at', new Date().toISOString());
    transaction.metadata.set('escrow_refund_reason', motivo);
    
    await transaction.save();

    // Actualizar clase
    clase.escrowStatus = ESCROW_STATUS.REFUNDED;
    clase.escrowRefundedAt = new Date();
    clase.escrowRefundReason = motivo;
    clase.estado = 'cancelada';
    
    await clase.save();

    console.log(`✅ Fondos reembolsados exitosamente para clase: ${claseId}`);
    
    return {
      success: true,
      amountRefunded: transaction.amount,
      status: ESCROW_STATUS.REFUNDED,
      reason: motivo
    };

  } catch (error) {
    console.error('Error reembolsando fondos:', error);
    throw error;
  }
};

// Iniciar disputa
export const iniciarDisputa = async (claseId, iniciadoPor, motivo) => {
  try {
    console.log(`⚠️ Iniciando disputa para clase: ${claseId}`);

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    if (clase.escrowStatus !== ESCROW_STATUS.PENDING) {
      throw new Error('El escrow no está en estado pendiente');
    }

    const transaction = await Transaction.findById(clase.transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Actualizar transacción
    transaction.metadata.set('escrow_status', ESCROW_STATUS.DISPUTED);
    transaction.metadata.set('escrow_disputed_at', new Date().toISOString());
    transaction.metadata.set('escrow_disputed_by', iniciadoPor);
    transaction.metadata.set('escrow_dispute_reason', motivo);
    
    await transaction.save();

    // Actualizar clase
    clase.escrowStatus = ESCROW_STATUS.DISPUTED;
    clase.escrowDisputedAt = new Date();
    clase.escrowDisputedBy = iniciadoPor;
    clase.escrowDisputeReason = motivo;
    
    await clase.save();

    console.log(`✅ Disputa iniciada exitosamente para clase: ${claseId}`);
    
    return {
      success: true,
      status: ESCROW_STATUS.DISPUTED,
      disputedBy: iniciadoPor,
      reason: motivo
    };

  } catch (error) {
    console.error('Error iniciando disputa:', error);
    throw error;
  }
};

// Resolver disputa (admin)
export const resolverDisputa = async (claseId, resolucion, resueltoPor = 'admin') => {
  try {
    console.log(`🔧 Resolviendo disputa para clase: ${claseId}`);

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    if (clase.escrowStatus !== ESCROW_STATUS.DISPUTED) {
      throw new Error('El escrow no está en disputa');
    }

    let resultado;

    if (resolucion === 'release') {
      // Liberar fondos al profesor
      resultado = await liberarFondos(claseId, resueltoPor);
    } else if (resolucion === 'refund') {
      // Reembolsar al estudiante
      resultado = await reembolsarFondos(claseId, 'Resuelto por admin');
    } else {
      throw new Error('Resolución inválida');
    }

    // Actualizar metadata con la resolución
    const transaction = await Transaction.findById(clase.transactionId);
    transaction.metadata.set('escrow_resolved_at', new Date().toISOString());
    transaction.metadata.set('escrow_resolved_by', resueltoPor);
    transaction.metadata.set('escrow_resolution', resolucion);
    
    await transaction.save();

    console.log(`✅ Disputa resuelta exitosamente para clase: ${claseId}`);
    
    return {
      success: true,
      resolution: resolucion,
      resolvedBy: resueltoPor,
      ...resultado
    };

  } catch (error) {
    console.error('Error resolviendo disputa:', error);
    throw error;
  }
};

// Verificar escrows expirados (ejecutar periódicamente)
export const verificarEscrowsExpirados = async () => {
  try {
    console.log('🕐 Verificando escrows expirados...');

    const escrowsExpirados = await Clase.find({
      escrowStatus: ESCROW_STATUS.PENDING,
      escrowExpiresAt: { $lt: new Date() }
    });

    console.log(`📊 Encontrados ${escrowsExpirados.length} escrows expirados`);

    for (const clase of escrowsExpirados) {
      try {
        // Marcar como expirado
        clase.escrowStatus = ESCROW_STATUS.EXPIRED;
        clase.escrowExpiredAt = new Date();
        await clase.save();

        // Actualizar transacción
        const transaction = await Transaction.findById(clase.transactionId);
        if (transaction) {
          transaction.metadata.set('escrow_status', ESCROW_STATUS.EXPIRED);
          transaction.metadata.set('escrow_expired_at', new Date().toISOString());
          await transaction.save();
        }

        console.log(`⏰ Escrow expirado para clase: ${clase._id}`);

        // Aquí podrías enviar notificaciones a los usuarios
        // await enviarNotificacionExpiracion(clase);

      } catch (error) {
        console.error(`Error procesando escrow expirado ${clase._id}:`, error);
      }
    }

    return {
      success: true,
      expiredCount: escrowsExpirados.length
    };

  } catch (error) {
    console.error('Error verificando escrows expirados:', error);
    throw error;
  }
};

// Obtener estadísticas de escrow
export const obtenerEstadisticasEscrow = async (profesorId = null) => {
  try {
    const filtros = {};
    if (profesorId) {
      filtros.profesor = profesorId;
    }

    const estadisticas = await Clase.aggregate([
      { $match: { ...filtros, escrowStatus: { $exists: true } } },
      {
        $group: {
          _id: '$escrowStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$montoPagado' }
        }
      }
    ]);

    return estadisticas;

  } catch (error) {
    console.error('Error obteniendo estadísticas de escrow:', error);
    throw error;
  }
};

// Actualizar balance del profesor
const actualizarBalanceProfesor = async (profesorId, monto) => {
  try {
    const profesor = await User.findById(profesorId);
    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }

    // Actualizar balance disponible
    profesor.balanceDisponible = (profesor.balanceDisponible || 0) + monto;
    profesor.ingresosTotales = (profesor.ingresosTotales || 0) + monto;
    
    await profesor.save();

    console.log(`💰 Balance actualizado para profesor ${profesorId}: +$${monto}`);

  } catch (error) {
    console.error('Error actualizando balance del profesor:', error);
    throw error;
  }
};

// Obtener información de escrow para una clase
export const obtenerInfoEscrow = async (claseId) => {
  try {
    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    const transaction = await Transaction.findById(clase.transactionId);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    return {
      claseId: clase._id,
      status: clase.escrowStatus,
      amount: transaction.amount,
      amountNet: transaction.amountNet,
      commission: transaction.commission,
      createdAt: clase.escrowCreatedAt,
      expiresAt: clase.escrowExpiresAt,
      releasedAt: clase.escrowReleasedAt,
      refundedAt: clase.escrowRefundedAt,
      disputedAt: clase.escrowDisputedAt,
      expiredAt: clase.escrowExpiredAt,
      timeRemaining: clase.escrowExpiresAt ? 
        Math.max(0, clase.escrowExpiresAt.getTime() - Date.now()) : 0
    };

  } catch (error) {
    console.error('Error obteniendo información de escrow:', error);
    throw error;
  }
};
