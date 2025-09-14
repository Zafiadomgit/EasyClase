// Script de diagnóstico completo para MercadoPago
import fetch from 'node-fetch';

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE MERCADOPAGO');
  console.log('=====================================\n');

  // 1. Verificar el token de producción
  console.log('1️⃣ VERIFICANDO TOKEN DE PRODUCCIÓN...');
  const token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
  
  try {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ Token de producción VÁLIDO');
      console.log(`   - Usuario: ${userData.nickname}`);
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Tipo: PRODUCCIÓN\n`);
    } else {
      console.log('❌ Token de producción INVÁLIDO\n');
    }
  } catch (error) {
    console.log('❌ Error verificando token:', error.message, '\n');
  }

  // 2. Probar el endpoint PHP actual
  console.log('2️⃣ PROBANDO ENDPOINT PHP EN EL SERVIDOR...');
  try {
    const response = await fetch('https://easyclaseapp.com/api/crear-preferencia-mercadopago.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      },
      body: JSON.stringify({
        titulo: 'Prueba de Clase',
        precio: 5000,
        descripcion: 'Prueba de pago',
        reservaData: {
          claseId: 'test_123',
          estudianteId: 'test_user',
          fecha: '2025-01-15',
          hora: '10:00',
          comentarios: 'Prueba'
        }
      })
    });
    
    const responseText = await response.text();
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Respuesta: ${responseText}`);
    
    if (responseText.includes('TEST-0aa911c4-cb56-4148-b441-bec40d8f0405')) {
      console.log('❌ PROBLEMA: El servidor aún usa el token de PRUEBA\n');
    } else if (responseText.includes('APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681')) {
      console.log('✅ El servidor usa el token de PRODUCCIÓN\n');
    } else {
      console.log('⚠️ No se puede determinar qué token usa el servidor\n');
    }
    
  } catch (error) {
    console.log('❌ Error probando endpoint:', error.message, '\n');
  }

  // 3. Instrucciones específicas
  console.log('3️⃣ INSTRUCCIONES PARA SOLUCIONAR:');
  console.log('=====================================');
  console.log('');
  console.log('📁 ARCHIVOS QUE NECESITAS SUBIR AL SERVIDOR:');
  console.log('');
  console.log('1. Archivo: public/api/crear-preferencia-mercadopago.php');
  console.log('   📍 Subir a: /api/crear-preferencia-mercadopago.php');
  console.log('   🔧 Cambio: Línea 14 - Token de producción');
  console.log('');
  console.log('2. Archivo: public/api/webhook-mercadopago.php');
  console.log('   📍 Subir a: /api/webhook-mercadopago.php');
  console.log('   🔧 Cambio: Línea 48 - Token de producción');
  console.log('');
  console.log('🚀 PASOS A SEGUIR:');
  console.log('');
  console.log('1. Abre tu cliente FTP o panel de control del hosting');
  console.log('2. Navega a la carpeta raíz de tu sitio web');
  console.log('3. Ve a la carpeta /api/');
  console.log('4. Reemplaza crear-preferencia-mercadopago.php');
  console.log('5. Reemplaza webhook-mercadopago.php');
  console.log('6. Verifica que los archivos se subieron correctamente');
  console.log('7. Prueba el pago nuevamente');
  console.log('');
  console.log('🔍 VERIFICACIÓN:');
  console.log('Después de subir los archivos, ejecuta este script nuevamente');
  console.log('para verificar que el problema se solucionó.');
  console.log('');
  console.log('⚠️ IMPORTANTE:');
  console.log('- Asegúrate de subir los archivos en modo BINARIO');
  console.log('- Verifica que no haya espacios extra en los nombres');
  console.log('- Si usas un panel de control, asegúrate de guardar los cambios');
}

diagnosticoCompleto();
