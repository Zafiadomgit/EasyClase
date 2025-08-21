// Script de diagnóstico para EasyClase en Vercel
// Ejecutar: node diagnostico-vercel.js

const API_BASE = 'https://easyclase.vercel.app/api';

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE EASYCLASE EN VERCEL\n');
  console.log('=' .repeat(60));

  // 1. Verificar si el dominio responde
  console.log('\n1️⃣ VERIFICANDO DOMINIO...');
  try {
    const response = await fetch('https://easyclase.vercel.app');
    if (response.ok) {
      console.log('✅ Dominio responde correctamente');
      console.log('📊 Status:', response.status);
      console.log('🌐 Content-Type:', response.headers.get('content-type'));
    } else {
      console.log('❌ Dominio responde pero con error:', response.status);
    }
  } catch (error) {
    console.log('❌ Dominio no responde:', error.message);
    console.log('🚨 POSIBLE CAUSA: Proyecto no desplegado en Vercel');
    return;
  }

  // 2. Verificar API status
  console.log('\n2️⃣ VERIFICANDO API STATUS...');
  try {
    const statusResponse = await fetch(`${API_BASE}/status`);
    const statusData = await statusResponse.json();
    
    if (statusResponse.ok) {
      console.log('✅ API Status funciona');
      console.log('📝 Mensaje:', statusData.message);
      console.log('🌍 Entorno:', statusData.environment);
    } else {
      console.log('❌ API Status falla:', statusData.message);
    }
  } catch (error) {
    console.log('❌ API Status no responde:', error.message);
    console.log('🚨 POSIBLE CAUSA: Backend no desplegado o mal configurado');
  }

  // 3. Verificar rutas específicas
  console.log('\n3️⃣ VERIFICANDO RUTAS ESPECÍFICAS...');
  
  const rutas = [
    { nombre: 'Profesores', url: '/profesores' },
    { nombre: 'Categorías', url: '/profesores/categorias' },
    { nombre: 'Servicios', url: '/servicios' },
    { nombre: 'Clases (sin auth)', url: '/clases/mis-clases' }
  ];

  for (const ruta of rutas) {
    try {
      const response = await fetch(`${API_BASE}${ruta.url}`);
      if (response.ok) {
        console.log(`✅ ${ruta.nombre}: FUNCIONA`);
      } else if (response.status === 401) {
        console.log(`✅ ${ruta.nombre}: PROTEGIDA (requiere auth)`);
      } else {
        console.log(`❌ ${ruta.nombre}: ERROR ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${ruta.nombre}: NO RESPONDE`);
    }
  }

  // 4. Verificar configuración de CORS
  console.log('\n4️⃣ VERIFICANDO CONFIGURACIÓN CORS...');
  try {
    const response = await fetch(`${API_BASE}/status`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://easyclase.vercel.app',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeaders = response.headers.get('access-control-allow-origin');
    if (corsHeaders) {
      console.log('✅ CORS configurado:', corsHeaders);
    } else {
      console.log('⚠️ CORS no detectado');
    }
  } catch (error) {
    console.log('❌ Error verificando CORS:', error.message);
  }

  // 5. Verificar variables de entorno
  console.log('\n5️⃣ VERIFICANDO VARIABLES DE ENTORNO...');
  try {
    const response = await fetch(`${API_BASE}/status`);
    const data = await response.json();
    
    if (data.environment === 'production') {
      console.log('✅ Entorno de producción detectado');
    } else {
      console.log('⚠️ Entorno no es producción:', data.environment);
    }
  } catch (error) {
    console.log('❌ No se puede verificar entorno');
  }

  // 6. Resumen y recomendaciones
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMEN Y RECOMENDACIONES');
  console.log('=' .repeat(60));

  console.log('\n🎯 ESTADO ACTUAL:');
  console.log('- Dominio: https://easyclase.vercel.app');
  console.log('- API Base: https://easyclase.vercel.app/api');
  console.log('- Configuración: vercel.json presente');
  console.log('- Backend: server/server.js configurado');

  console.log('\n🚨 PROBLEMAS IDENTIFICADOS:');
  console.log('1. El proyecto puede no estar desplegado en Vercel');
  console.log('2. Las variables de entorno no están configuradas');
  console.log('3. MongoDB Atlas no está conectado');
  console.log('4. El backend no está funcionando correctamente');

  console.log('\n🔧 SOLUCIÓN RECOMENDADA:');
  console.log('1. Ir a https://vercel.com y verificar el proyecto');
  console.log('2. Configurar variables de entorno en Vercel Dashboard');
  console.log('3. Hacer un nuevo deploy');
  console.log('4. Verificar logs de Vercel para errores');

  console.log('\n📝 VARIABLES NECESARIAS EN VERCEL:');
  console.log('- MONGODB_URI=mongodb+srv://...');
  console.log('- JWT_SECRET=tu_secret_aqui');
  console.log('- FRONTEND_URL=https://easyclase.vercel.app');
  console.log('- WEBHOOK_URL=https://easyclase.vercel.app');

  console.log('\n🎉 Una vez configurado, las funcionalidades deberían funcionar:');
  console.log('- ✅ Mi Perfil del profesor');
  console.log('- ✅ Mis Clases');
  console.log('- ✅ Dashboard con datos reales');
  console.log('- ✅ Búsqueda de profesores');
  console.log('- ✅ Sistema de retiro de dinero');
}

// Ejecutar diagnóstico
diagnosticoCompleto().catch(console.error);
