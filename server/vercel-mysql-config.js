// Configuración específica para Vercel con MySQL
export const vercelConfig = {
  // Base de datos MySQL
  MYSQL_HOST: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
  MYSQL_USER: process.env.MYSQL_USER || 'zafiadombd',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'easyclasebd_v2',
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,
  
  // Servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://easyclaseapp.com',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // MercadoPago
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  MERCADOPAGO_PUBLIC_KEY: process.env.MERCADOPAGO_PUBLIC_KEY,
  
  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100
};

// Validar configuración en producción
export const validateConfig = () => {
  const requiredVars = [
    'MYSQL_HOST',
    'MYSQL_USER', 
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
    'JWT_SECRET',
    'MERCADOPAGO_ACCESS_TOKEN',
    'MERCADOPAGO_PUBLIC_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !vercelConfig[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars);
    console.error('🚨 Configura estas variables en Vercel para continuar');
    process.exit(1);
  }
  
  console.log('✅ Todas las variables de entorno requeridas están configuradas');
};

// Función para obtener la configuración de la base de datos
export const getDatabaseConfig = () => ({
  host: vercelConfig.MYSQL_HOST,
  user: vercelConfig.MYSQL_USER,
  password: vercelConfig.MYSQL_PASSWORD,
  database: vercelConfig.MYSQL_DATABASE,
  port: vercelConfig.MYSQL_PORT
});
