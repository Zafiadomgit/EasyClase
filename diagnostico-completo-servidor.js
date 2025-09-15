import fetch from 'node-fetch';

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DEL SERVIDOR...\n');

  try {
    // Verificar la página principal
    console.log('📄 Verificando página principal...');
    const response = await fetch('https://easyclaseapp.com/');
    const html = await response.text();
    
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📏 Tamaño HTML: ${html.length} caracteres`);
    
    // Buscar archivos CSS y JS específicos
    const cssMatch = html.match(/assets\/index-[a-f0-9]+\.css/);
    const jsMatch = html.match(/assets\/index-[a-f0-9]+\.js/);
    
    console.log(`   🎨 CSS encontrado: ${cssMatch ? cssMatch[0] : 'NO ENCONTRADO'}`);
    console.log(`   ⚙️  JS encontrado: ${jsMatch ? jsMatch[0] : 'NO ENCONTRADO'}`);
    
    // Verificar si los archivos CSS y JS existen
    if (cssMatch) {
      try {
        const cssResponse = await fetch(`https://easyclaseapp.com/${cssMatch[0]}`);
        console.log(`   🎨 CSS Status: ${cssResponse.status}`);
        
        if (cssResponse.status === 200) {
          const cssContent = await cssResponse.text();
          const tieneGradiente = cssContent.includes('bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900');
          console.log(`   🎨 CSS tiene gradiente: ${tieneGradiente ? '✅' : '❌'}`);
        }
      } catch (error) {
        console.log(`   🎨 CSS Error: ${error.message}`);
      }
    }
    
    if (jsMatch) {
      try {
        const jsResponse = await fetch(`https://easyclaseapp.com/${jsMatch[0]}`);
        console.log(`   ⚙️  JS Status: ${jsResponse.status}`);
      } catch (error) {
        console.log(`   ⚙️  JS Error: ${error.message}`);
      }
    }
    
    console.log('');
    
    // Verificar si hay algún archivo .htaccess o configuración especial
    try {
      const htaccessResponse = await fetch('https://easyclaseapp.com/.htaccess');
      console.log(`   📋 .htaccess Status: ${htaccessResponse.status}`);
    } catch (error) {
      console.log(`   📋 .htaccess: No encontrado`);
    }
    
    console.log('');
    
    // Verificar headers de respuesta
    console.log('📋 HEADERS DE RESPUESTA:');
    console.log(`   Server: ${response.headers.get('server') || 'No especificado'}`);
    console.log(`   Cache-Control: ${response.headers.get('cache-control') || 'No especificado'}`);
    console.log(`   Last-Modified: ${response.headers.get('last-modified') || 'No especificado'}`);
    console.log(`   ETag: ${response.headers.get('etag') || 'No especificado'}`);
    
    console.log('');
    
    // Verificar si hay algún problema con la estructura de archivos
    console.log('🔍 VERIFICANDO ESTRUCTURA DE ARCHIVOS...');
    
    const archivosParaVerificar = [
      'index.html',
      'assets/',
      'dist/',
      'public/'
    ];
    
    for (const archivo of archivosParaVerificar) {
      try {
        const testResponse = await fetch(`https://easyclaseapp.com/${archivo}`);
        console.log(`   📁 ${archivo}: Status ${testResponse.status}`);
      } catch (error) {
        console.log(`   📁 ${archivo}: Error - ${error.message}`);
      }
    }
    
    console.log('');
    console.log('🚨 POSIBLES CAUSAS DEL PROBLEMA:');
    console.log('1. Los archivos se subieron a una carpeta incorrecta');
    console.log('2. El servidor tiene caché agresivo');
    console.log('3. Hay un archivo .htaccess que redirige');
    console.log('4. Los archivos tienen permisos incorrectos');
    console.log('5. El servidor está sirviendo desde una ubicación diferente');
    
    console.log('');
    console.log('💡 SOLUCIONES A PROBAR:');
    console.log('1. Verificar que los archivos estén en la carpeta raíz del dominio');
    console.log('2. Contactar soporte de Dreamhost para limpiar caché del servidor');
    console.log('3. Verificar permisos de archivos (644 para archivos, 755 para carpetas)');
    console.log('4. Probar subir los archivos con nombres diferentes');
    console.log('5. Verificar si hay algún archivo de configuración que esté interfiriendo');
    
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

diagnosticoCompleto().catch(console.error);
