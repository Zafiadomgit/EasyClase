// Script para verificar qué archivos están realmente en el servidor
import fetch from 'node-fetch';

async function verificarServidor() {
  console.log('🔍 VERIFICANDO ESTADO DEL SERVIDOR');
  console.log('==================================\n');

  const baseUrl = 'https://easyclaseapp.com';
  
  try {
    // 1. Verificar página principal
    console.log('1️⃣ VERIFICANDO PÁGINA PRINCIPAL...');
    const mainResponse = await fetch(baseUrl);
    const mainText = await mainResponse.text();
    
    console.log(`   - Status: ${mainResponse.status}`);
    console.log(`   - Content-Type: ${mainResponse.headers.get('content-type')}`);
    
    // Buscar indicadores del nuevo diseño
    const hasNewDesign = mainText.includes('slate-900') || mainText.includes('purple-900') || mainText.includes('backdrop-blur-xl');
    const hasOldDesign = mainText.includes('bg-gradient-to-br from-blue-50') || mainText.includes('via-white to-indigo-50');
    
    console.log(`   - ¿Tiene nuevo diseño?: ${hasNewDesign ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   - ¿Tiene diseño anterior?: ${hasOldDesign ? '✅ SÍ' : '❌ NO'}`);
    
    if (hasNewDesign) {
      console.log('   🎉 ¡El nuevo diseño está activo!');
    } else if (hasOldDesign) {
      console.log('   ⚠️  El diseño anterior sigue activo');
    } else {
      console.log('   ❓ No se puede determinar el diseño');
    }

    console.log('');

    // 2. Verificar archivos CSS
    console.log('2️⃣ VERIFICANDO ARCHIVOS CSS...');
    const cssMatches = mainText.match(/href="([^"]*\.css[^"]*)"/g);
    if (cssMatches) {
      for (const match of cssMatches) {
        const cssUrl = match.replace('href="', '').replace('"', '');
        const fullCssUrl = cssUrl.startsWith('http') ? cssUrl : `${baseUrl}${cssUrl}`;
        
        try {
          const cssResponse = await fetch(fullCssUrl);
          const cssText = await cssResponse.text();
          
          console.log(`   - CSS: ${cssUrl}`);
          console.log(`     Status: ${cssResponse.status}`);
          
          const hasNewStyles = cssText.includes('slate-900') || cssText.includes('purple-900') || cssText.includes('backdrop-blur-xl');
          console.log(`     ¿Tiene nuevos estilos?: ${hasNewStyles ? '✅ SÍ' : '❌ NO'}`);
        } catch (error) {
          console.log(`   - CSS: ${cssUrl} - ❌ Error: ${error.message}`);
        }
      }
    }

    console.log('');

    // 3. Verificar archivos JS
    console.log('3️⃣ VERIFICANDO ARCHIVOS JS...');
    const jsMatches = mainText.match(/src="([^"]*\.js[^"]*)"/g);
    if (jsMatches) {
      for (const match of jsMatches) {
        const jsUrl = match.replace('src="', '').replace('"', '');
        const fullJsUrl = jsUrl.startsWith('http') ? jsUrl : `${baseUrl}${jsUrl}`;
        
        try {
          const jsResponse = await fetch(fullJsUrl);
          console.log(`   - JS: ${jsUrl} - Status: ${jsResponse.status}`);
        } catch (error) {
          console.log(`   - JS: ${jsUrl} - ❌ Error: ${error.message}`);
        }
      }
    }

    console.log('');

    // 4. Verificar página de pago específicamente
    console.log('4️⃣ VERIFICANDO PÁGINA DE PAGO...');
    try {
      const pagoResponse = await fetch(`${baseUrl}/pago`);
      const pagoText = await pagoResponse.text();
      
      console.log(`   - Status: ${pagoResponse.status}`);
      
      const hasNewPagoDesign = pagoText.includes('slate-900') || pagoText.includes('purple-900') || pagoText.includes('backdrop-blur-xl');
      const hasOldPagoDesign = pagoText.includes('bg-gradient-to-br from-blue-50') || pagoText.includes('via-white to-indigo-50');
      
      console.log(`   - ¿Tiene nuevo diseño de pago?: ${hasNewPagoDesign ? '✅ SÍ' : '❌ NO'}`);
      console.log(`   - ¿Tiene diseño anterior de pago?: ${hasOldPagoDesign ? '✅ SÍ' : '❌ NO'}`);
      
    } catch (error) {
      console.log(`   - ❌ Error accediendo a /pago: ${error.message}`);
    }

    console.log('');

    // 5. Diagnóstico y recomendaciones
    console.log('5️⃣ DIAGNÓSTICO Y RECOMENDACIONES');
    console.log('=================================');
    console.log('');
    
    if (hasNewDesign) {
      console.log('✅ El nuevo diseño está activo en el servidor');
      console.log('   Si no lo ves en el navegador:');
      console.log('   1. Limpia completamente el cache del navegador');
      console.log('   2. Prueba en modo incógnito');
      console.log('   3. Verifica que no haya CDN o cache del servidor');
    } else {
      console.log('❌ El nuevo diseño NO está activo en el servidor');
      console.log('   Posibles causas:');
      console.log('   1. Los archivos no se subieron correctamente');
      console.log('   2. Se subieron a la ubicación incorrecta');
      console.log('   3. El servidor está sirviendo archivos antiguos');
      console.log('   4. Hay un problema con el .htaccess');
      console.log('');
      console.log('🔧 SOLUCIÓN:');
      console.log('   1. Verifica que index.html esté en la raíz del dominio');
      console.log('   2. Verifica que los archivos CSS/JS estén en /assets/');
      console.log('   3. Sube nuevamente TODOS los archivos de la carpeta dist/');
    }

  } catch (error) {
    console.log('❌ Error verificando servidor:', error.message);
  }
}

verificarServidor();
