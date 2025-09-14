// Diagnóstico completo del sistema EasyClase
import dotenv from 'dotenv';
import fetch from 'node-fetch';

console.log('🔍 DIAGNÓSTICO COMPLETO DE EASYCLASE\n');

// Cargar variables de entorno
dotenv.config({ path: './env.production' });

// Función para validar token de MercadoPago
const validarTokenMercadoPago = async (token) => {
  try {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      return {
        valido: true,
        tipo: token.startsWith('TEST-') ? 'test' : 'produccion',
        usuario: userData.nickname || 'Usuario',
        datos: userData
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        valido: false,
        error: `Token inválido: ${response.status} ${response.statusText}`,
        detalles: errorData
      };
    }
  } catch (error) {
    return {
      valido: false,
      error: `Error validando token: ${error.message}`
    };
  }
};

// Función para probar creación de preferencia
const probarCreacionPreferencia = async (token) => {
  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          {
            title: "Prueba de Clase - EasyClase",
            quantity: 1,
            currency_id: "COP",
            unit_price: 1000
          }
        ],
        payer: {
          email: "test@easyclaseapp.com"
        },
        back_urls: {
          success: "https://easyclaseapp.com/pago/success",
          failure: "https://easyclaseapp.com/pago/failure",
          pending: "https://easyclaseapp.com/pago-pendiente"
        },
        auto_return: "approved",
        external_reference: "test_" + Date.now()
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        exito: true,
        preferenciaId: data.id,
        initPoint: data.init_point
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        exito: false,
        error: `Error ${response.status}: ${response.statusText}`,
        detalles: errorData
      };
    }
  } catch (error) {
    return {
      exito: false,
      error: `Error de conexión: ${error.message}`
    };
  }
};

async function ejecutarDiagnostico() {
  console.log('=== 1. VERIFICACIÓN DE VARIABLES DE ENTORNO ===');
  const variablesCriticas = [
    'MP_ACCESS_TOKEN',
    'MP_PUBLIC_KEY',
    'MYSQL_HOST',
    'MYSQL_DATABASE',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'JWT_SECRET'
  ];

  let todasConfiguradas = true;
  variablesCriticas.forEach(variable => {
    if (!process.env[variable]) {
      console.log(`❌ ${variable}: NO configurada`);
      todasConfiguradas = false;
    } else {
      console.log(`✅ ${variable}: configurada`);
    }
  });

  if (!todasConfiguradas) {
    console.log('\n⚠️  Algunas variables críticas no están configuradas. Abortando diagnóstico.');
    return;
  }

  console.log('\n=== 2. VERIFICACIÓN DEL TOKEN DE MERCADOPAGO ===');
  if (!process.env.MP_ACCESS_TOKEN) {
    console.log('❌ Token de MercadoPago no configurado');
    return;
  }

  console.log('Validando token...');
  const validacion = await validarTokenMercadoPago(process.env.MP_ACCESS_TOKEN);
  
  if (validacion.valido) {
    console.log(`✅ Token válido - Tipo: ${validacion.tipo}, Usuario: ${validacion.usuario}`);
  } else {
    console.log(`❌ Token inválido: ${validacion.error}`);
    if (validacion.detalles) {
      console.log('Detalles del error:', JSON.stringify(validacion.detalles, null, 2));
    }
    return;
  }

  console.log('\n=== 3. PRUEBA DE CREACIÓN DE PREFERENCIA ===');
  console.log('Probando creación de preferencia de pago...');
  const prueba = await probarCreacionPreferencia(process.env.MP_ACCESS_TOKEN);
  
  if (prueba.exito) {
    console.log(`✅ Preferencia creada exitosamente`);
    console.log(`ID: ${prueba.preferenciaId}`);
    console.log(`URL: ${prueba.initPoint}`);
  } else {
    console.log(`❌ Error creando preferencia: ${prueba.error}`);
    if (prueba.detalles) {
      console.log('Detalles del error:', JSON.stringify(prueba.detalles, null, 2));
    }
  }

  console.log('\n=== 4. RESUMEN ===');
  if (todasConfiguradas && validacion.valido && prueba.exito) {
    console.log('🎉 ¡Sistema completamente funcional!');
    console.log('✅ Variables de entorno configuradas');
    console.log('✅ Token de MercadoPago válido');
    console.log('✅ Creación de preferencias funcionando');
  } else {
    console.log('⚠️  Sistema con problemas:');
    if (!todasConfiguradas) console.log('❌ Variables de entorno faltantes');
    if (!validacion.valido) console.log('❌ Token de MercadoPago inválido');
    if (!prueba.exito) console.log('❌ Error en creación de preferencias');
  }
}

// Ejecutar diagnóstico
ejecutarDiagnostico().catch(console.error);
