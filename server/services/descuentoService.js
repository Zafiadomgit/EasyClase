import User from '../models/User.js';
import Clase from '../models/Clase.js';

// Constante para el porcentaje de descuento
const PORCENTAJE_DESCUENTO = 10;

/**
 * Verifica si un estudiante puede aplicar descuento en una categoría específica
 * @param {string} estudianteId - ID del estudiante
 * @param {string} profesorId - ID del profesor
 * @param {string} categoria - Categoría de la clase
 * @returns {Promise<Object>} - Objeto con información sobre el descuento
 */
export const verificarDescuentoDisponible = async (estudianteId, profesorId, categoria) => {
  try {
    const estudiante = await User.findById(estudianteId);
    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const profesor = await User.findById(profesorId);
    if (!profesor) {
      throw new Error('Profesor no encontrado');
    }

    const puedeUsarDescuento = estudiante.puedeUsarDescuento(categoria);
    const estudianteTienePremium = estudiante.tienePremiumActivo();
    const profesorTienePremium = profesor.tienePremiumActivo();

    // La plataforma asume el descuento SOLO si ambos (estudiante y profesor) son premium
    const asumidoPor = (estudianteTienePremium && profesorTienePremium) ? 'plataforma' : 'profesor';

    return {
      puedeAplicar: puedeUsarDescuento,
      estudianteTienePremium,
      profesorTienePremium,
      porcentajeDescuento: PORCENTAJE_DESCUENTO,
      asumidoPor
    };
  } catch (error) {
    console.error('Error verificando descuento:', error);
    throw error;
  }
};

/**
 * Aplica descuento a una clase
 * @param {string} claseId - ID de la clase
 * @param {string} estudianteId - ID del estudiante
 * @param {string} profesorId - ID del profesor
 * @param {string} categoria - Categoría de la clase
 * @returns {Promise<Object>} - Clase actualizada con descuento
 */
export const aplicarDescuento = async (claseId, estudianteId, profesorId, categoria) => {
  try {
    const estudiante = await User.findById(estudianteId);
    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const clase = await Clase.findById(claseId);
    if (!clase) {
      throw new Error('Clase no encontrada');
    }

    // Verificar si puede usar descuento
    const infoDescuento = await verificarDescuentoDisponible(estudianteId, profesorId, categoria);
    if (!infoDescuento.puedeAplicar) {
      throw new Error('No se puede aplicar descuento en esta categoría');
    }

    // Aplicar descuento a la clase
    clase.descuento = {
      aplicado: true,
      porcentaje: PORCENTAJE_DESCUENTO,
      categoria,
      asumidoPor: infoDescuento.asumidoPor
    };

    await clase.save();

    // Registrar el uso del descuento
    await estudiante.registrarDescuento(categoria, claseId);

    return {
      clase,
      descuentoAplicado: true,
      montoDescuento: clase.descuento.montoDescuento,
      totalConDescuento: clase.total
    };
  } catch (error) {
    console.error('Error aplicando descuento:', error);
    throw error;
  }
};

/**
 * Calcula el descuento para una clase sin aplicarlo
 * @param {number} precio - Precio por hora
 * @param {number} duracion - Duración en horas
 * @param {string} estudianteId - ID del estudiante
 * @param {string} profesorId - ID del profesor
 * @param {string} categoria - Categoría de la clase
 * @returns {Promise<Object>} - Información del descuento calculado
 */
export const calcularDescuento = async (precio, duracion, estudianteId, profesorId, categoria) => {
  try {
    const subtotal = precio * duracion;
    const infoDescuento = await verificarDescuentoDisponible(estudianteId, profesorId, categoria);

    if (!infoDescuento.puedeAplicar) {
      return {
        puedeAplicar: false,
        subtotal,
        total: subtotal,
        montoDescuento: 0,
        porcentajeDescuento: 0
      };
    }

    const montoDescuento = (subtotal * PORCENTAJE_DESCUENTO) / 100;
    const total = subtotal - montoDescuento;

    return {
      puedeAplicar: true,
      subtotal,
      total,
      montoDescuento,
      porcentajeDescuento: PORCENTAJE_DESCUENTO,
      asumidoPor: infoDescuento.asumidoPor,
      estudianteTienePremium: infoDescuento.estudianteTienePremium,
      profesorTienePremium: infoDescuento.profesorTienePremium
    };
  } catch (error) {
    console.error('Error calculando descuento:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de descuentos de un estudiante
 * @param {string} estudianteId - ID del estudiante
 * @returns {Promise<Object>} - Historial de descuentos por categoría
 */
export const obtenerHistorialDescuentos = async (estudianteId) => {
  try {
    const estudiante = await User.findById(estudianteId);
    if (!estudiante) {
      throw new Error('Estudiante no encontrado');
    }

    const descuentosPorCategoria = estudiante.getDescuentosUtilizados();
    const tienePremium = estudiante.tienePremiumActivo();

    return {
      descuentosPorCategoria,
      tienePremium,
      premiumInfo: estudiante.premium
    };
  } catch (error) {
    console.error('Error obteniendo historial de descuentos:', error);
    throw error;
  }
};
