// Script para probar el archivo PHP simplificado
import fetch from 'node-fetch';

async function testSimplePHP() {
  console.log('🔍 PROBANDO ARCHIVO PHP SIMPLIFICADO');
  console.log('=====================================\n');

  try {
    // Probar archivo simplificado
    console.log('1️⃣ PROBANDO ARCHIVO SIMPLIFICADO...');
    const simpleUrl = 'https://easyclaseapp.com/api/crear-preferencia-mercadopago-SIMPLE.php';
    
    const simpleResponse = await fetch(simpleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test Simplificado',
        precio: 1000,
        descripcion: 'Test de archivo simplificado'
      })
    });

    const simpleData = await simpleResponse.json();
    console.log(`   - Status: ${simpleResponse.status}`);
    console.log(`   - Respuesta:`, JSON.stringify(simpleData, null, 2));

    console.log('');

    // Comparar con archivo original
    console.log('2️⃣ COMPARANDO CON ARCHIVO ORIGINAL...');
    const originalUrl = 'https://easyclaseapp.com/api/crear-preferencia-mercadopago.php';
    
    const originalResponse = await fetch(originalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test Original',
        precio: 1000,
        descripcion: 'Test de archivo original'
      })
    });

    const originalData = await originalResponse.json();
    console.log(`   - Status: ${originalResponse.status}`);
    console.log(`   - Respuesta:`, JSON.stringify(originalData, null, 2));

    console.log('');

    // Análisis
    console.log('3️⃣ ANÁLISIS DE RESULTADOS');
    console.log('==========================');
    
    if (simpleData.success) {
      console.log('✅ Archivo simplificado FUNCIONA');
      console.log('❌ Archivo original tiene problemas');
      console.log('');
      console.log('🔧 SOLUCIÓN:');
      console.log('1. Sube el archivo simplificado a Dreamhost');
      console.log('2. Renómbralo como crear-preferencia-mercadopago.php');
      console.log('3. Esto debería solucionar el problema');
    } else if (originalData.success) {
      console.log('✅ Archivo original FUNCIONA');
      console.log('❌ Archivo simplificado tiene problemas');
    } else {
      console.log('❌ Ambos archivos tienen problemas');
      console.log('🔧 REVISAR:');
      console.log('1. Configuración del servidor PHP');
      console.log('2. Versión de PHP');
      console.log('3. Extensiones de cURL');
    }

  } catch (error) {
    console.log('❌ Error probando archivos:', error.message);
  }
}

testSimplePHP();
