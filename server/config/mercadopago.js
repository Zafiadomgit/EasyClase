// ─── Inicialización del SDK de Mercado Pago ──────────────────────────────────
// SDK oficial de backend para operaciones del lado del servidor: crear y
// gestionar preferencias de pago, procesar transacciones, etc.
//
// El Access Token es una credencial privada y NUNCA debe exponerse en el
// frontend ni versionarse. Se toma de las variables de entorno.
//   • Pruebas:    el token comienza con el prefijo APP_USR (credenciales de test)
//   • Producción: credenciales de producción de "Tus integraciones"
//
// Configúralo en tu archivo .env como MP_ACCESS_TOKEN (se acepta también
// MERCADOPAGO_ACCESS_TOKEN por compatibilidad).
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const accessToken =
  process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  // No lanzamos aquí para permitir que el proceso arranque (health checks,
  // rutas que no dependen de pagos, etc.); las operaciones de pago fallarán de
  // forma explícita al intentar usarse sin credencial.
  console.warn(
    '⚠️ MP_ACCESS_TOKEN no está configurado. Las operaciones de Mercado Pago no estarán disponibles.'
  );
}

// Cliente configurado con las credenciales de la aplicación. Se reutiliza en
// toda la app para instanciar los distintos recursos del SDK.
export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: accessToken || '',
  options: { timeout: 10000 }
});

// Recursos listos para usar sobre el cliente configurado.
export const preferenceClient = new Preference(mercadoPagoClient);
export const paymentClient = new Payment(mercadoPagoClient);

export default mercadoPagoClient;
