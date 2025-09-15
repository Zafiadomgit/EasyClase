import fetch from 'node-fetch';

async function forzarActualizacion() {
  console.log('🚀 FORZANDO ACTUALIZACIÓN DEL SERVIDOR...\n');

  try {
    // Hacer múltiples requests para forzar la actualización
    const urls = [
      'https://easyclaseapp.com/',
      'https://easyclaseapp.com/buscar',
      'https://easyclaseapp.com/servicios',
      'https://easyclaseapp.com/como-funciona',
      'https://easyclaseapp.com/ser-profesor'
    ];

    console.log('🔄 Haciendo requests con headers anti-caché...');
    
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const html = await response.text();
        const tieneGradiente = html.includes('bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900');
        
        console.log(`   ${url}: ${tieneGradiente ? '✅' : '❌'} Gradiente`);
        
      } catch (error) {
        console.log(`   ${url}: ❌ Error - ${error.message}`);
      }
    }
    
    console.log('');
    console.log('📋 INSTRUCCIONES ESPECÍFICAS PARA DREAMHOST:');
    console.log('');
    console.log('1. 🗑️  ELIMINAR COMPLETAMENTE estos archivos del servidor:');
    console.log('   - index.html');
    console.log('   - assets/index-04b14318.css');
    console.log('   - assets/index-3a976124.js');
    console.log('   - assets/ (carpeta completa)');
    console.log('');
    console.log('2. 📁 VERIFICAR que estés en la carpeta correcta:');
    console.log('   - Debe ser la carpeta raíz del dominio (easyclaseapp.com)');
    console.log('   - NO debe ser una subcarpeta como /public o /dist');
    console.log('');
    console.log('3. ⬆️  SUBIR los archivos NUEVOS de tu carpeta dist/:');
    console.log('   - dist/index.html → index.html');
    console.log('   - dist/assets/index-04b14318.css → assets/index-04b14318.css');
    console.log('   - dist/assets/index-3a976124.js → assets/index-3a976124.js');
    console.log('');
    console.log('4. 🔧 VERIFICAR permisos:');
    console.log('   - Archivos: 644');
    console.log('   - Carpetas: 755');
    console.log('');
    console.log('5. ⏰ ESPERAR 5-10 minutos para que el caché del servidor se actualice');
    console.log('');
    console.log('6. 🧹 LIMPIAR caché del navegador:');
    console.log('   - Ctrl+Shift+R (Windows/Linux)');
    console.log('   - Cmd+Shift+R (Mac)');
    console.log('   - O F12 > Network > Disable cache');
    console.log('');
    console.log('7. 📞 Si sigue sin funcionar, contactar soporte de Dreamhost:');
    console.log('   - Pedir que limpien el caché del servidor');
    console.log('   - Mencionar que los archivos CSS/JS no se están actualizando');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

forzarActualizacion().catch(console.error);
