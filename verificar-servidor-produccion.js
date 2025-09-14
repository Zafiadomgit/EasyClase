// Script para verificar el servidor de producción
import fetch from 'node-fetch';

const API_URL = 'https://easyclaseapp.com/api';

async function verificarServidor() {
  console.log('🔍 Verificando servidor de producción...\n');
  
  try {
    // Probar endpoint de estado
    console.log('1. Probando endpoint de estado...');
    const statusResponse = await fetch(`${API_URL}/status`);
    if (statusResponse.ok) {
      const status = await statusResponse.json();
      console.log('✅ Servidor respondiendo');
      console.log('Estado:', status.status);
      console.log('Timestamp:', status.timestamp);
    } else {
      console.log('❌ Servidor no responde correctamente');
      return;
    }
    
    // Probar endpoint de verificación de token
    console.log('\n2. Verificando configuración de MercadoPago...');
    const tokenResponse = await fetch(`${API_URL}/verificar-token`);
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      console.log('✅ Endpoint de verificación responde');
      
      const diag = tokenData.diagnostico;
      console.log('\n📊 DIAGNÓSTICO DEL SERVIDOR:');
      console.log('NODE_ENV:', diag.nodeEnv);
      console.log('MP_ACCESS_TOKEN configurado:', diag.mpAccessToken.configurado);
      console.log('Tipo de token:', diag.mpAccessToken.tipo);
      console.log('Primeros 10 caracteres:', diag.mpAccessToken.primeros10);
      console.log('MP_PUBLIC_KEY configurado:', diag.mpPublicKey.configurado);
      console.log('Tipo de public key:', diag.mpPublicKey.tipo);
      
      if (diag.tokenTest) {
        console.log('\n🧪 PRUEBA DE TOKEN:');
        if (diag.tokenTest.valido) {
          console.log('✅ Token válido en el servidor');
          console.log('Usuario:', diag.tokenTest.usuario);
          console.log('Site ID:', diag.tokenTest.tipo);
        } else {
          console.log('❌ Token inválido en el servidor');
          console.log('Error:', diag.tokenTest.error);
        }
      }
      
    } else {
      console.log('❌ No se puede verificar la configuración del token');
      console.log('Status:', tokenResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
  }
}

verificarServidor();

