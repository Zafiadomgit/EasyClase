// Script para probar los archivos PHP y diagnosticar el problema
import fetch from 'node-fetch';

async function testPHPFiles() {
  console.log('🔍 PROBANDO ARCHIVOS PHP EN DREAMHOST');
  console.log('=====================================\n');

  const baseUrl = 'https://easyclaseapp.com';
  
  try {
    // 1. Probar archivo de prueba ultra-simple
    console.log('1️⃣ PROBANDO ARCHIVO DE PRUEBA ULTRA-SIMPLE...');
    const testUrl = `${baseUrl}/api/test-server.php`;
    
    const testResponse = await fetch(testUrl);
    const testText = await testResponse.text();
    
    console.log(`   - Status: ${testResponse.status}`);
    console.log(`   - Content-Type: ${testResponse.headers.get('content-type')}`);
    console.log(`   - Respuesta: ${testText.substring(0, 200)}...`);
    
    if (testResponse.status === 200 && testText.includes('"success":true')) {
      console.log('   ✅ Servidor PHP funciona correctamente');
    } else {
      console.log('   ❌ Problema con el servidor PHP');
      console.log(`   - Error: ${testText}`);
    }

    console.log('');

    // 2. Probar archivo minimal
    console.log('2️⃣ PROBANDO ARCHIVO MINIMAL...');
    const minimalUrl = `${baseUrl}/api/crear-preferencia-mercadopago-MINIMAL.php`;
    
    const minimalResponse = await fetch(minimalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test Minimal',
        precio: 1000
      })
    });

    const minimalText = await minimalResponse.text();
    console.log(`   - Status: ${minimalResponse.status}`);
    console.log(`   - Content-Type: ${minimalResponse.headers.get('content-type')}`);
    console.log(`   - Respuesta: ${minimalText.substring(0, 200)}...`);

    console.log('');

    // 3. Probar archivo simple
    console.log('3️⃣ PROBANDO ARCHIVO SIMPLE...');
    const simpleUrl = `${baseUrl}/api/crear-preferencia-mercadopago-SIMPLE.php`;
    
    const simpleResponse = await fetch(simpleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test Simple',
        precio: 1000
      })
    });

    const simpleText = await simpleResponse.text();
    console.log(`   - Status: ${simpleResponse.status}`);
    console.log(`   - Content-Type: ${simpleResponse.headers.get('content-type')}`);
    console.log(`   - Respuesta: ${simpleText.substring(0, 200)}...`);

    console.log('');

    // 4. Instrucciones específicas
    console.log('4️⃣ INSTRUCCIONES ESPECÍFICAS');
    console.log('===============================');
    console.log('');
    console.log('📁 ARCHIVOS PARA SUBIR A DREAMHOST:');
    console.log('');
    console.log('1. public/api/test-server.php');
    console.log('   📍 Subir a: /api/test-server.php');
    console.log('   🎯 Propósito: Verificar que PHP funciona');
    console.log('');
    console.log('2. public/api/crear-preferencia-mercadopago-MINIMAL.php');
    console.log('   📍 Subir a: /api/crear-preferencia-mercadopago-MINIMAL.php');
    console.log('   🎯 Propósito: Versión mínima sin dependencias');
    console.log('');
    console.log('🚀 PASOS EN DREAMHOST:');
    console.log('');
    console.log('1. Accede al Panel de Control de Dreamhost');
    console.log('2. Ve a "Files" > "File Manager"');
    console.log('3. Navega a la carpeta raíz de tu dominio');
    console.log('4. Ve a la carpeta /api/');
    console.log('5. Sube los 2 archivos nuevos');
    console.log('6. Ejecuta este script nuevamente para verificar');
    console.log('');
    console.log('🔍 VERIFICACIÓN MANUAL:');
    console.log('Después de subir, abre en tu navegador:');
    console.log('👉 https://easyclaseapp.com/api/test-server.php');
    console.log('Deberías ver JSON válido, no HTML de error.');

  } catch (error) {
    console.log('❌ Error probando archivos PHP:', error.message);
  }
}

testPHPFiles();
