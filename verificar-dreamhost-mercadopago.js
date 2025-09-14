// Script específico para verificar MercadoPago en Dreamhost
import fetch from 'node-fetch';

async function verificarDreamhostMercadoPago() {
  console.log('🔍 VERIFICACIÓN ESPECÍFICA DE DREAMHOST');
  console.log('==========================================\n');

  const baseUrl = 'https://easyclaseapp.com';
  
  try {
    // 1. Verificar el archivo PHP principal
    console.log('1️⃣ VERIFICANDO ARCHIVO PHP PRINCIPAL...');
    const phpUrl = `${baseUrl}/api/crear-preferencia-mercadopago.php`;
    
    const response = await fetch(phpUrl, {
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

    const responseText = await response.text();
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Respuesta: ${responseText}`);

    // Verificar qué token está usando
    if (responseText.includes('TEST-0aa911c4-cb56-4148-b441-bec40d8f0405')) {
      console.log('   ❌ PROBLEMA: El servidor usa token de PRUEBA');
    } else if (responseText.includes('APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681')) {
      console.log('   ✅ CORRECTO: El servidor usa token de PRODUCCIÓN');
    } else {
      console.log('   ⚠️  No se puede determinar qué token usa');
    }

    console.log('');

    // 2. Verificar el webhook
    console.log('2️⃣ VERIFICANDO WEBHOOK...');
    const webhookUrl = `${baseUrl}/api/webhook-mercadopago.php`;
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'payment',
        action: 'payment.created',
        data: { id: 'test' }
      })
    });

    const webhookText = await webhookResponse.text();
    console.log(`   - Status: ${webhookResponse.status}`);
    console.log(`   - Respuesta: ${webhookText}`);

    console.log('');

    // 3. Instrucciones específicas para Dreamhost
    console.log('3️⃣ INSTRUCCIONES PARA DREAMHOST');
    console.log('=====================================');
    console.log('');
    console.log('📁 ARCHIVOS QUE NECESITAS SUBIR A DREAMHOST:');
    console.log('');
    console.log('1. Archivo: public/api/crear-preferencia-mercadopago.php');
    console.log('   📍 Subir a: /api/crear-preferencia-mercadopago.php');
    console.log('   🔧 Cambio: Línea 14 - Token de producción');
    console.log('');
    console.log('2. Archivo: public/api/webhook-mercadopago.php');
    console.log('   📍 Subir a: /api/webhook-mercadopago.php');
    console.log('   🔧 Cambio: Línea 48 - Token de producción');
    console.log('');
    console.log('🚀 PASOS PARA DREAMHOST:');
    console.log('');
    console.log('1. Accede al Panel de Control de Dreamhost');
    console.log('2. Ve a "Archivos" > "Administrador de Archivos"');
    console.log('3. Navega a la carpeta raíz de tu dominio');
    console.log('4. Ve a la carpeta /api/');
    console.log('5. Sube los archivos corregidos (sobrescribir)');
    console.log('6. Verifica que se subieron correctamente');
    console.log('');
    console.log('🔍 VERIFICACIÓN:');
    console.log('Después de subir, ejecuta este script nuevamente');
    console.log('para verificar que el problema se solucionó.');
    console.log('');
    console.log('⚠️  IMPORTANTE PARA DREAMHOST:');
    console.log('- Usa el Administrador de Archivos del panel');
    console.log('- Asegúrate de subir en modo BINARIO');
    console.log('- Verifica que no haya espacios en los nombres');
    console.log('- Los cambios se aplican inmediatamente');

  } catch (error) {
    console.log('❌ Error verificando Dreamhost:', error.message);
  }
}

verificarDreamhostMercadoPago();
