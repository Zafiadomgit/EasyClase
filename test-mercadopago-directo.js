// Test directo de MercadoPago con las credenciales de producción
import fetch from 'node-fetch';

async function testMercadoPagoDirecto() {
  console.log('🔍 TEST DIRECTO DE MERCADOPAGO');
  console.log('=====================================\n');

  // Credenciales de producción proporcionadas por el usuario
  const accessToken = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
  const publicKey = 'APP_USR-3e36c45d-0048-4aaf-88ea-7df857eb3ea5';

  console.log('📋 CREDENCIALES:');
  console.log(`Access Token: ${accessToken.substring(0, 20)}...`);
  console.log(`Public Key: ${publicKey.substring(0, 20)}...`);
  console.log('');

  try {
    // 1. Verificar que el token es válido
    console.log('1️⃣ VERIFICANDO TOKEN...');
    const userResponse = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Token VÁLIDO');
      console.log(`   - Usuario: ${userData.nickname}`);
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Tipo: ${accessToken.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 'TEST'}`);
    } else {
      console.log('❌ Token INVÁLIDO');
      const errorData = await userResponse.text();
      console.log(`   - Error: ${errorData}`);
      return;
    }

    console.log('');

    // 2. Crear una preferencia de prueba
    console.log('2️⃣ CREANDO PREFERENCIA DE PRUEBA...');
    const preferenceData = {
      items: [
        {
          title: 'Test de Pago - EasyClase',
          quantity: 1,
          unit_price: 1000,
          currency_id: 'COP'
        }
      ],
      back_urls: {
        success: 'https://easyclaseapp.com/pago-exitoso',
        failure: 'https://easyclaseapp.com/pago-fallido',
        pending: 'https://easyclaseapp.com/pago-pendiente'
      },
      auto_return: 'approved',
      external_reference: 'test_' + Date.now(),
      notification_url: 'https://easyclaseapp.com/api/webhook-mercadopago.php'
    };

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    if (preferenceResponse.ok) {
      const preference = await preferenceResponse.json();
      console.log('✅ Preferencia creada EXITOSAMENTE');
      console.log(`   - ID: ${preference.id}`);
      console.log(`   - URL: ${preference.init_point}`);
      console.log('');
      console.log('🎯 RESULTADO: Las credenciales funcionan correctamente');
      console.log('   El problema está en los archivos del servidor');
    } else {
      const errorData = await preferenceResponse.text();
      console.log('❌ Error creando preferencia');
      console.log(`   - Status: ${preferenceResponse.status}`);
      console.log(`   - Error: ${errorData}`);
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.message);
  }
}

testMercadoPagoDirecto();
