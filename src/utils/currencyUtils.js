// Utilidades para el manejo de moneda en pesos colombianos

/**
 * Formatea un precio en pesos colombianos
 * @param {number} precio - El precio en pesos colombianos (ej: 35000)
 * @returns {string} - Precio formateado (ej: "$ 35.000")
 */
export const formatPrecio = (precio) => {
  if (!precio || precio === 0) return '$ 0'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio)
}

/**
 * Formatea un precio sin el símbolo de moneda
 * @param {number} precio - El precio en pesos colombianos
 * @returns {string} - Precio formateado sin símbolo (ej: "35.000")
 */
export const formatPrecioSinSimbolo = (precio) => {
  if (!precio || precio === 0) return '0'
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio)
}

/**
 * Convierte un precio de centavos a pesos colombianos
 * @param {number} centavos - El precio en centavos
 * @returns {number} - El precio en pesos colombianos
 */
export const centavosAPesos = (centavos) => {
  return centavos / 100
}

/**
 * Convierte un precio de pesos colombianos a centavos
 * @param {number} pesos - El precio en pesos colombianos
 * @returns {number} - El precio en centavos
 */
export const pesosACentavos = (pesos) => {
  return pesos * 100
}

/**
 * Valida si un precio es válido para pesos colombianos
 * @param {number} precio - El precio a validar
 * @returns {boolean} - True si es válido
 */
export const esPrecioValido = (precio) => {
  return typeof precio === 'number' && precio >= 0 && precio <= 999999999
}

/**
 * Obtiene el símbolo de moneda para pesos colombianos
 * @returns {string} - El símbolo de moneda
 */
export const getSimboloMoneda = () => {
  return '$'
}

/**
 * Formatea un rango de precios
 * @param {number} precioMin - Precio mínimo
 * @param {number} precioMax - Precio máximo
 * @returns {string} - Rango formateado
 */
export const formatRangoPrecio = (precioMin, precioMax) => {
  if (precioMin === precioMax) {
    return formatPrecio(precioMin)
  }
  return `${formatPrecio(precioMin)} - ${formatPrecio(precioMax)}`
}

/**
 * Formatea un precio por hora
 * @param {number} precio - El precio por hora
 * @returns {string} - Precio formateado por hora
 */
export const formatPrecioPorHora = (precio) => {
  return `${formatPrecio(precio)}/hora`
}

/**
 * Formatea un descuento como porcentaje
 * @param {number} descuento - El descuento en porcentaje
 * @returns {string} - Descuento formateado
 */
export const formatDescuento = (descuento) => {
  return `${descuento}%`
}

/**
 * Calcula el precio con descuento
 * @param {number} precioOriginal - Precio original
 * @param {number} descuento - Descuento en porcentaje
 * @returns {number} - Precio con descuento
 */
export const calcularPrecioConDescuento = (precioOriginal, descuento) => {
  return precioOriginal * (1 - descuento / 100)
}

/**
 * Formatea el precio con descuento
 * @param {number} precioOriginal - Precio original
 * @param {number} descuento - Descuento en porcentaje
 * @returns {object} - Objeto con precio original, descuento y precio final
 */
export const formatPrecioConDescuento = (precioOriginal, descuento) => {
  const precioFinal = calcularPrecioConDescuento(precioOriginal, descuento)
  
  return {
    precioOriginal: formatPrecio(precioOriginal),
    descuento: formatDescuento(descuento),
    precioFinal: formatPrecio(precioFinal),
    ahorro: formatPrecio(precioOriginal - precioFinal)
  }
}

/**
 * Calcula la comisión que se descuenta al profesor
 * @param {number} precio - El precio que paga el alumno
 * @param {boolean} esPremium - Si el profesor es premium
 * @returns {number} - Comisión que se descuenta al profesor
 */
export const calcularComisionProfesor = (precio, esPremium = false) => {
  if (!precio) return 0
  
  const porcentajeComision = esPremium ? 10 : 20
  return precio * (porcentajeComision / 100)
}

/**
 * Calcula cuánto recibe el profesor después de la comisión
 * @param {number} precio - El precio que paga el alumno
 * @param {boolean} esPremium - Si el profesor es premium
 * @returns {number} - Cantidad que recibe el profesor
 */
export const calcularGananciaProfesor = (precio, esPremium = false) => {
  if (!precio) return 0
  
  const comision = calcularComisionProfesor(precio, esPremium)
  return precio - comision
}

/**
 * Formatea la información de comisión para mostrar al profesor
 * @param {number} precio - El precio que paga el alumno
 * @param {boolean} esPremium - Si el profesor es premium
 * @returns {object} - Objeto con información de comisión
 */
export const obtenerInfoComision = (precio, esPremium = false) => {
  const comision = calcularComisionProfesor(precio, esPremium)
  const ganancia = calcularGananciaProfesor(precio, esPremium)
  const porcentaje = esPremium ? 10 : 20
  
  return {
    precioAlumno: precio,
    comision: comision,
    gananciaProfesor: ganancia,
    porcentajeComision: porcentaje,
    esPremium: esPremium
  }
}
