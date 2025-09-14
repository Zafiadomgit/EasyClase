// Diagnóstico profundo del problema de MercadoPago
import fetch from 'node-fetch';

async function diagnosticoProfundo() {
  console.log('🔍 DIAGNÓSTICO PROFUNDO - MERCADOPAGO');
  console.log('=====================================\n');

  // 1. Verificar múltiples endpoints
  console.log('1️⃣ VERIFICANDO TODOS LOS ENDPOINTS...');
  
  const endpoints = [
    'https://easyclaseapp.com/api/crear-preferencia-mercadopago.php',
    'https://easyclaseapp.com/api/webhook-mercadopago.php',
    'https://easyclaseapp.com/api/mercadopago/crear-preferencia'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Probando: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        },
        body: JSON.stringify({
          titulo: 'Prueba',
          precio: 1000,
          descripcion: 'Test'
        })
      });
      
      const responseText = await response.text();
      console.log(`   Status: ${response.status}`);
      console.log(`   Respuesta: ${responseText.substring(0, 200)}...`);
      
      // Verificar qué token se está usando
      if (responseText.includes('TEST-0aa911c4-cb56-4148-b441-bec40d8f0405')) {
        console.log('   ❌ Usa token de PRUEBA');
      } else if (responseText.includes('APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681')) {
        console.log('   ✅ Usa token de PRODUCCIÓN');
      } else {
        console.log('   ⚠️ No se puede determinar el token');
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // 2. Probar con diferentes métodos
  console.log('\n2️⃣ PROBANDO CON DIFERENTES MÉTODOS...');
  
  try {
    // Probar GET en el endpoint PHP
    const getResponse = await fetch('https://easyclaseapp.com/api/crear-preferencia-mercadopago.php');
    const getText = await getResponse.text();
    console.log(`GET Status: ${getResponse.status}`);
    console.log(`GET Response: ${getText.substring(0, 100)}...`);
  } catch (error) {
    console.log(`GET Error: ${error.message}`);
  }

  // 3. Verificar si hay otros archivos PHP
  console.log('\n3️⃣ VERIFICANDO OTROS ARCHIVOS PHP...');
  
  const otrosArchivos = [
    'https://easyclaseapp.com/api/reservar-clase.php',
    'https://easyclaseapp.com/api/buscar-clases.php',
    'https://easyclaseapp.com/api/disponibilidad-profesor.php',
    'https://easyclaseapp.com/api/plantillas.php'
  ];

  for (const archivo of otrosArchivos) {
    try {
      const response = await fetch(archivo);
      if (response.status === 200) {
        const text = await response.text();
        if (text.includes('TEST-0aa911c4-cb56-4148-b441-bec40d8f0405')) {
          console.log(`❌ ${archivo} - Contiene token de PRUEBA`);
        } else if (text.includes('APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681')) {
          console.log(`✅ ${archivo} - Contiene token de PRODUCCIÓN`);
        }
      }
    } catch (error) {
      // Archivo no existe o no accesible
    }
  }

  // 4. Verificar el token directamente
  console.log('\n4️⃣ VERIFICANDO TOKEN DE PRODUCCIÓN...');
  
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
      console.log(`   Usuario: ${userData.nickname}`);
      console.log(`   Email: ${userData.email}`);
      
      // Probar crear una preferencia directamente
      console.log('\n🧪 Probando creación de preferencia directa...');
      const prefResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [
            {
              title: 'Prueba Directa',
              quantity: 1,
              currency_id: 'COP',
              unit_price: 1000
            }
          ],
          back_urls: {
            success: 'https://easyclaseapp.com/pago-exitoso',
            failure: 'https://easyclaseapp.com/pago-fallido',
            pending: 'https://easyclaseapp.com/pago-pendiente'
          },
          auto_return: 'approved',
          external_reference: 'test_directo_' + Date.now()
        })
      });
      
      if (prefResponse.ok) {
        const prefData = await prefResponse.json();
        console.log('✅ Preferencia creada exitosamente');
        console.log(`   ID: ${prefData.id}`);
        console.log(`   Init Point: ${prefData.init_point}`);
      } else {
        const errorData = await prefResponse.json();
        console.log('❌ Error creando preferencia:');
        console.log(`   Status: ${prefResponse.status}`);
        console.log(`   Error: ${JSON.stringify(errorData, null, 2)}`);
      }
      
    } else {
      console.log('❌ Token de producción INVÁLIDO');
    }
  } catch (error) {
    console.log('❌ Error verificando token:', error.message);
  }

  // 5. Recomendaciones
  console.log('\n5️⃣ RECOMENDACIONES:');
  console.log('===================');
  console.log('');
  console.log('Si el token de producción funciona directamente pero falla en tu servidor:');
  console.log('');
  console.log('1. Verifica que los archivos PHP se subieron correctamente');
  console.log('2. Asegúrate de que no hay espacios extra en los nombres');
  console.log('3. Verifica que el servidor está ejecutando PHP correctamente');
  console.log('4. Revisa los logs de error del servidor');
  console.log('5. Considera usar el endpoint Node.js como alternativa');
  console.log('');
  console.log('Para usar el endpoint Node.js:');
  console.log('- El frontend ya está configurado para usarlo');
  console.log('- Solo necesitas desplegar el servidor Node.js');
  console.log('- Los archivos están en server/routes/mercadopago.js');
}

diagnosticoProfundo();
