// Script para probar si los archivos se subieron correctamente a Dreamhost
import fetch from 'node-fetch';

async function testDreamhostUpload() {
  console.log('🔍 PROBANDO ARCHIVOS EN DREAMHOST');
  console.log('===================================\n');

  const baseUrl = 'https://easyclaseapp.com';
  
  try {
    // 1. Probar archivo de prueba
    console.log('1️⃣ PROBANDO ARCHIVO DE PRUEBA...');
    const testUrl = `${baseUrl}/api/test-token.php`;
    
    const testResponse = await fetch(testUrl);
    const testData = await testResponse.json();
    
    console.log(`   - Status: ${testResponse.status}`);
    console.log(`   - Respuesta:`, testData);
    
    if (testData.token_type === 'PRODUCCIÓN') {
      console.log('   ✅ Archivo de prueba funciona con token de PRODUCCIÓN');
    } else {
      console.log('   ❌ Archivo de prueba no tiene token de PRODUCCIÓN');
    }

    console.log('');

    // 2. Probar archivo principal con debug
    console.log('2️⃣ PROBANDO ARCHIVO PRINCIPAL CON DEBUG...');
    const debugUrl = `${baseUrl}/api/crear-preferencia-mercadopago-DEBUG.php`;
    
    const debugResponse = await fetch(debugUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test de Verificación',
        precio: 1000,
        descripcion: 'Verificación de tokens'
      })
    });

    const debugData = await debugResponse.json();
    console.log(`   - Status: ${debugResponse.status}`);
    console.log(`   - Respuesta:`, debugData);

    console.log('');

    // 3. Probar archivo original
    console.log('3️⃣ PROBANDO ARCHIVO ORIGINAL...');
    const originalUrl = `${baseUrl}/api/crear-preferencia-mercadopago.php`;
    
    const originalResponse = await fetch(originalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test de Verificación',
        precio: 1000,
        descripcion: 'Verificación de tokens'
      })
    });

    const originalData = await originalResponse.json();
    console.log(`   - Status: ${originalResponse.status}`);
    console.log(`   - Respuesta:`, originalData);

    console.log('');

    // 4. Instrucciones específicas
    console.log('4️⃣ INSTRUCCIONES ESPECÍFICAS');
    console.log('===============================');
    console.log('');
    console.log('📁 ARCHIVOS PARA SUBIR A DREAMHOST:');
    console.log('');
    console.log('1. public/api/test-token.php');
    console.log('   📍 Subir a: /api/test-token.php');
    console.log('   🎯 Propósito: Verificar que los archivos se suben correctamente');
    console.log('');
    console.log('2. public/api/crear-preferencia-mercadopago-DEBUG.php');
    console.log('   📍 Subir a: /api/crear-preferencia-mercadopago-DEBUG.php');
    console.log('   🎯 Propósito: Versión con logging detallado');
    console.log('');
    console.log('3. public/api/crear-preferencia-mercadopago.php');
    console.log('   📍 Subir a: /api/crear-preferencia-mercadopago.php');
    console.log('   🎯 Propósito: Archivo principal corregido');
    console.log('');
    console.log('🚀 PASOS EN DREAMHOST:');
    console.log('');
    console.log('1. Accede al Panel de Control de Dreamhost');
    console.log('2. Ve a "Archivos" > "Administrador de Archivos"');
    console.log('3. Navega a la carpeta raíz de tu dominio');
    console.log('4. Ve a la carpeta /api/');
    console.log('5. Sube los 3 archivos (sobrescribir)');
    console.log('6. Ejecuta este script nuevamente para verificar');
    console.log('');
    console.log('🔍 VERIFICACIÓN:');
    console.log('Si el archivo test-token.php muestra "PRODUCCIÓN",');
    console.log('entonces los archivos se están subiendo correctamente.');

  } catch (error) {
    console.log('❌ Error probando Dreamhost:', error.message);
  }
}

testDreamhostUpload();
