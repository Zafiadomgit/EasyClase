// Script para debuggear el token de MercadoPago específicamente
import fetch from 'node-fetch';

async function debugTokenMercadoPago() {
  console.log('🔍 DEBUG ESPECÍFICO DEL TOKEN MERCADOPAGO');
  console.log('==========================================\n');

  // Token de producción proporcionado por el usuario
  const accessToken = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
  const publicKey = 'APP_USR-3e36c45d-0048-4aaf-88ea-7df857eb3ea5';

  console.log('📋 CREDENCIALES:');
  console.log(`Access Token: ${accessToken}`);
  console.log(`Public Key: ${publicKey}`);
  console.log('');

  try {
    // 1. Verificar que el token es válido
    console.log('1️⃣ VERIFICANDO TOKEN CON API DE MERCADOPAGO...');
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
      console.log(`   - ID: ${userData.id}`);
      console.log(`   - Tipo: ${accessToken.startsWith('APP_USR-') ? 'PRODUCCIÓN' : 'TEST'}`);
    } else {
      console.log('❌ Token INVÁLIDO');
      const errorData = await userResponse.text();
      console.log(`   - Status: ${userResponse.status}`);
      console.log(`   - Error: ${errorData}`);
      return;
    }

    console.log('');

    // 2. Probar crear una preferencia exactamente como lo hace tu servidor
    console.log('2️⃣ CREANDO PREFERENCIA EXACTA COMO TU SERVIDOR...');
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
      external_reference: 'reserva_' + Date.now(),
      notification_url: 'https://easyclaseapp.com/api/webhook-mercadopago.php',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1
      }
    };

    console.log('📤 Enviando preferencia a MercadoPago...');
    console.log('📋 Datos enviados:', JSON.stringify(preferenceData, null, 2));

    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    console.log(`📥 Respuesta de MercadoPago:`);
    console.log(`   - Status: ${preferenceResponse.status}`);
    console.log(`   - Status Text: ${preferenceResponse.statusText}`);

    const responseText = await preferenceResponse.text();
    console.log(`   - Respuesta completa: ${responseText}`);

    if (preferenceResponse.ok) {
      const preference = JSON.parse(responseText);
      console.log('✅ Preferencia creada EXITOSAMENTE');
      console.log(`   - ID: ${preference.id}`);
      console.log(`   - URL: ${preference.init_point}`);
    } else {
      console.log('❌ Error creando preferencia');
      try {
        const errorData = JSON.parse(responseText);
        console.log('   - Error detallado:', errorData);
      } catch (e) {
        console.log('   - Error raw:', responseText);
      }
    }

    console.log('');

    // 3. Probar el endpoint de tu servidor
    console.log('3️⃣ PROBANDO TU SERVIDOR...');
    const serverResponse = await fetch('https://easyclaseapp.com/api/crear-preferencia-mercadopago.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo: 'Test desde debug',
        precio: 1000,
        descripcion: 'Test de debug'
      })
    });

    const serverData = await serverResponse.json();
    console.log(`   - Status: ${serverResponse.status}`);
    console.log(`   - Respuesta:`, serverData);

    console.log('');

    // 4. Análisis del problema
    console.log('4️⃣ ANÁLISIS DEL PROBLEMA');
    console.log('=========================');
    
    if (preferenceResponse.ok) {
      console.log('✅ El token funciona directamente con MercadoPago');
      console.log('❌ El problema está en tu servidor PHP');
      console.log('');
      console.log('🔧 POSIBLES CAUSAS:');
      console.log('1. El servidor PHP no está usando el token correcto');
      console.log('2. Hay un problema con la configuración del servidor');
      console.log('3. El archivo PHP tiene un error de sintaxis');
      console.log('4. Las variables de entorno no se están cargando');
    } else {
      console.log('❌ El token tiene problemas');
      console.log('🔧 REVISAR:');
      console.log('1. Verificar que el token sea correcto');
      console.log('2. Verificar que sea de producción');
      console.log('3. Verificar que no esté vencido');
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.message);
  }
}

debugTokenMercadoPago();
