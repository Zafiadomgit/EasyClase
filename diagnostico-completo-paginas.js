import fetch from 'node-fetch';

async function diagnosticoCompletoPaginas() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE TODAS LAS PÁGINAS...\n');

  const paginas = [
    { url: 'https://easyclaseapp.com/', nombre: 'Home' },
    { url: 'https://easyclaseapp.com/buscar', nombre: 'Buscar Clases' },
    { url: 'https://easyclaseapp.com/servicios', nombre: 'Servicios' },
    { url: 'https://easyclaseapp.com/como-funciona', nombre: 'Cómo Funciona' },
    { url: 'https://easyclaseapp.com/ser-profesor', nombre: 'Ser Profesor' },
    { url: 'https://easyclaseapp.com/crear-servicio', nombre: 'Crear Servicio' }
  ];

  for (const pagina of paginas) {
    try {
      console.log(`📄 Verificando: ${pagina.nombre}`);
      const response = await fetch(pagina.url);
      const html = await response.text();
      
      // Verificar diseño premium
      const tieneGradienteOscuro = html.includes('bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900');
      const tieneGlassmorphism = html.includes('bg-white/10 backdrop-blur-xl');
      const tieneTextoBlanco = html.includes('text-white');
      
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   🎨 Gradiente oscuro: ${tieneGradienteOscuro ? '✅' : '❌'}`);
      console.log(`   🔮 Glassmorphism: ${tieneGlassmorphism ? '✅' : '❌'}`);
      console.log(`   ⚪ Texto blanco: ${tieneTextoBlanco ? '✅' : '❌'}`);
      
      // Verificar archivos CSS/JS específicos
      const cssMatch = html.match(/assets\/index-[a-f0-9]+\.css/);
      const jsMatch = html.match(/assets\/index-[a-f0-9]+\.js/);
      
      console.log(`   🎨 CSS: ${cssMatch ? cssMatch[0] : 'NO ENCONTRADO'}`);
      console.log(`   ⚙️  JS: ${jsMatch ? jsMatch[0] : 'NO ENCONTRADO'}`);
      
      if (!tieneGradienteOscuro) {
        console.log(`   ⚠️  PROBLEMA: ${pagina.nombre} NO tiene diseño premium`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('📋 ANÁLISIS DEL PROBLEMA:');
  console.log('');
  console.log('🚨 CAUSA PRINCIPAL:');
  console.log('   Los archivos CSS/JS en el servidor son una mezcla de versiones antiguas y nuevas.');
  console.log('   Algunas páginas cargan archivos nuevos (con diseño premium) y otras cargan archivos antiguos.');
  console.log('');
  console.log('💡 SOLUCIÓN DEFINITIVA:');
  console.log('   1. 🗑️  ELIMINAR COMPLETAMENTE la carpeta assets/ del servidor');
  console.log('   2. 🗑️  ELIMINAR index.html del servidor');
  console.log('   3. ⬆️  SUBIR SOLO los archivos nuevos de dist/:');
  console.log('      - dist/index.html → index.html');
  console.log('      - dist/assets/index-0a79e17c.css → assets/index-0a79e17c.css');
  console.log('      - dist/assets/index-2dffdec4.js → assets/index-2dffdec4.js');
  console.log('   4. ⏰ ESPERAR 10-15 minutos para caché del servidor');
  console.log('   5. 🧹 LIMPIAR caché del navegador (Ctrl+Shift+R)');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   NO subas archivos antiguos. Solo los nuevos de la carpeta dist/.');
  console.log('   Si subes archivos antiguos, volverás al problema anterior.');
}

diagnosticoCompletoPaginas().catch(console.error);
