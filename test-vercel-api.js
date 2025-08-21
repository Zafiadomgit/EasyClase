// Script para probar la API de EasyClase en Vercel
// Ejecutar: node test-vercel-api.js

const API_BASE = 'https://easyclase.vercel.app/api';

async function testAPI() {
  console.log('🧪 Probando API de EasyClase en Vercel...\n');

  try {
    // 1. Probar endpoint de estado
    console.log('1️⃣ Probando /api/status...');
    const statusResponse = await fetch(`${API_BASE}/status`);
    const statusData = await statusResponse.json();
    
    if (statusResponse.ok) {
      console.log('✅ Status API:', statusData.message);
      console.log('🌍 Entorno:', statusData.environment);
    } else {
      console.log('❌ Error en Status API:', statusData.message);
    }

    // 2. Probar endpoint de profesores (público)
    console.log('\n2️⃣ Probando /api/profesores...');
    const profesoresResponse = await fetch(`${API_BASE}/profesores`);
    const profesoresData = await profesoresResponse.json();
    
    if (profesoresResponse.ok) {
      console.log('✅ Profesores API:', `Encontrados ${profesoresData.data?.profesores?.length || 0} profesores`);
    } else {
      console.log('❌ Error en Profesores API:', profesoresData.message);
    }

    // 3. Probar endpoint de categorías
    console.log('\n3️⃣ Probando /api/profesores/categorias...');
    const categoriasResponse = await fetch(`${API_BASE}/profesores/categorias`);
    const categoriasData = await categoriasResponse.json();
    
    if (categoriasResponse.ok) {
      console.log('✅ Categorías API:', `Encontradas ${categoriasData.data?.categorias?.length || 0} categorías`);
    } else {
      console.log('❌ Error en Categorías API:', categoriasData.message);
    }

    // 4. Probar endpoint de clases (requiere autenticación)
    console.log('\n4️⃣ Probando /api/clases/mis-clases (sin token)...');
    const clasesResponse = await fetch(`${API_BASE}/clases/mis-clases`);
    const clasesData = await clasesResponse.json();
    
    if (clasesResponse.status === 401) {
      console.log('✅ Clases API: Correctamente protegida (requiere autenticación)');
    } else if (clasesResponse.ok) {
      console.log('⚠️ Clases API: Respondió sin autenticación (problema de seguridad)');
    } else {
      console.log('❌ Error en Clases API:', clasesData.message);
    }

    // 5. Probar endpoint de servicios
    console.log('\n5️⃣ Probando /api/servicios...');
    const serviciosResponse = await fetch(`${API_BASE}/servicios`);
    const serviciosData = await serviciosResponse.json();
    
    if (serviciosResponse.ok) {
      console.log('✅ Servicios API:', `Encontrados ${serviciosData.data?.servicios?.length || 0} servicios`);
    } else {
      console.log('❌ Error en Servicios API:', serviciosData.message);
    }

    console.log('\n🎯 Resumen de la prueba:');
    console.log('✅ Status API:', statusResponse.ok ? 'FUNCIONA' : 'FALLA');
    console.log('✅ Profesores API:', profesoresResponse.ok ? 'FUNCIONA' : 'FALLA');
    console.log('✅ Categorías API:', categoriasResponse.ok ? 'FUNCIONA' : 'FALLA');
    console.log('✅ Clases API:', clasesResponse.status === 401 ? 'PROTEGIDA' : 'PROBLEMA');
    console.log('✅ Servicios API:', serviciosResponse.ok ? 'FUNCIONA' : 'FALLA');

    if (statusResponse.ok && profesoresResponse.ok) {
      console.log('\n🎉 ¡La API está funcionando correctamente en Vercel!');
      console.log('📝 Ahora puedes configurar las variables de entorno para funcionalidades completas.');
    } else {
      console.log('\n🚨 Hay problemas con la API. Verifica la configuración de Vercel.');
    }

  } catch (error) {
    console.error('\n💥 Error durante la prueba:', error.message);
    console.log('\n🔍 Posibles causas:');
    console.log('- El proyecto no está desplegado en Vercel');
    console.log('- La URL de la API es incorrecta');
    console.log('- Problemas de red o CORS');
  }
}

// Ejecutar la prueba
testAPI();
