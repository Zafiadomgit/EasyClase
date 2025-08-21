// Configuración de comisiones de EasyClase
export const COMISIONES = {
  // Comisión estándar para usuarios regulares
  ESTANDAR: 0.20, // 20%
  
  // Comisión reducida para usuarios premium
  PREMIUM: 0.15, // 15%
  
  // Comisión para clases (si se implementa en el futuro)
  CLASES: 0.20, // 20%
  
  // Comisión para servicios
  SERVICIOS: {
    ESTANDAR: 0.20, // 20%
    PREMIUM: 0.15   // 15%
  }
};

// Función helper para calcular comisión
export const calcularComision = (precio, esPremium = false) => {
  const porcentaje = esPremium ? COMISIONES.PREMIUM : COMISIONES.ESTANDAR;
  return precio * porcentaje;
};

// Función helper para calcular precio final (después de comisión)
export const calcularPrecioFinal = (precio, esPremium = false) => {
  const comision = calcularComision(precio, esPremium);
  return precio - comision;
};

export default COMISIONES;
