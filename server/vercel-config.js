// Configuración específica para Vercel
export const vercelConfig = {
  // MongoDB Atlas URI (debe estar configurada en Vercel)
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/easyclase',
  
  // JWT Secret (debe estar configurado en Vercel)
  JWT_SECRET: process.env.JWT_SECRET || 'easyclase_jwt_secret_super_secreto_2024',
  
  // MercadoPago (debe estar configurado en Vercel)
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN || '',
  MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY || '',
  
  // URLs para Vercel
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://easyclase.vercel.app',
  WEBHOOK_URL: process.env.WEBHOOK_URL || 'https://easyclase.vercel.app',
  FRONTEND_SUCCESS_URL: process.env.FRONTEND_SUCCESS_URL || 'https://easyclase.vercel.app/pago-exitoso',
  FRONTEND_FAILURE_URL: process.env.FRONTEND_FAILURE_URL || 'https://easyclase.vercel.app/pago-fallido',
  
  // Puerto (Vercel maneja esto automáticamente)
  PORT: process.env.PORT || 3000,
  
  // Entorno
  NODE_ENV: process.env.NODE_ENV || 'production'
};

// Función para verificar que las variables críticas estén configuradas
export const validateConfig = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter(key => !vercelConfig[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes en Vercel:', missing);
    console.error('Por favor, configura estas variables en el dashboard de Vercel');
    return false;
  }
  
  console.log('✅ Configuración de Vercel válida');
  return true;
};
