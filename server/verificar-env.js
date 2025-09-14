// Script para verificar que las variables de entorno se carguen correctamente
import dotenv from 'dotenv';

console.log('🔍 Verificando carga de variables de entorno...\n');

// Cargar variables de entorno
dotenv.config({ path: './env.production' });

console.log('=== VARIABLES DE ENTORNO CARGADAS ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '***configurado***' : 'NO configurado');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***configurado***' : 'NO configurado');
console.log('MP_ACCESS_TOKEN:', process.env.MP_ACCESS_TOKEN ? '***configurado***' : 'NO configurado');
console.log('MP_PUBLIC_KEY:', process.env.MP_PUBLIC_KEY ? '***configurado***' : 'NO configurado');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('WEBHOOK_URL:', process.env.WEBHOOK_URL);
console.log('FRONTEND_SUCCESS_URL:', process.env.FRONTEND_SUCCESS_URL);
console.log('FRONTEND_FAILURE_URL:', process.env.FRONTEND_FAILURE_URL);

console.log('\n=== VERIFICACIÓN DE VARIABLES CRÍTICAS ===');
const variablesCriticas = [
  'MP_ACCESS_TOKEN',
  'MP_PUBLIC_KEY',
  'MYSQL_HOST',
  'MYSQL_DATABASE',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'JWT_SECRET'
];

let todasConfiguradas = true;
variablesCriticas.forEach(variable => {
  if (!process.env[variable]) {
    console.log(`❌ ${variable}: NO configurada`);
    todasConfiguradas = false;
  } else {
    console.log(`✅ ${variable}: configurada`);
  }
});

if (todasConfiguradas) {
  console.log('\n🎉 ¡Todas las variables críticas están configuradas!');
} else {
  console.log('\n⚠️  Algunas variables críticas no están configuradas');
}

console.log('\n=== INFORMACIÓN DEL TOKEN DE MERCADOPAGO ===');
if (process.env.MP_ACCESS_TOKEN) {
  console.log('Tipo de token:', process.env.MP_ACCESS_TOKEN.startsWith('TEST-') ? 'TEST' : 'PRODUCCIÓN');
  console.log('Longitud del token:', process.env.MP_ACCESS_TOKEN.length);
  console.log('Primeros 10 caracteres:', process.env.MP_ACCESS_TOKEN.substring(0, 10) + '...');
} else {
  console.log('❌ Token de MercadoPago no configurado');
}
