import fetch from 'node-fetch';

async function verificarArchivosServidor() {
  console.log('🔍 VERIFICANDO ARCHIVOS EN EL SERVIDOR...\n');

  const archivos = [
    'https://easyclaseapp.com/',
    'https://easyclaseapp.com/buscar',
    'https://easyclaseapp.com/servicios',
    'https://easyclaseapp.com/como-funciona',
    'https://easyclaseapp.com/ser-profesor'
  ];

  for (const url of archivos) {
    try {
      console.log(`📄 Verificando: ${url}`);
      const response = await fetch(url);
      const html = await response.text();
      
      // Buscar indicadores del diseño premium
      const tieneGradienteOscuro = html.includes('bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900');
      const tieneGlassmorphism = html.includes('bg-white/10 backdrop-blur-xl');
      const tieneTextoBlanco = html.includes('text-white');
      
      console.log(`   ✅ Respuesta: ${response.status}`);
      console.log(`   🎨 Gradiente oscuro: ${tieneGradienteOscuro ? '✅' : '❌'}`);
      console.log(`   🔮 Glassmorphism: ${tieneGlassmorphism ? '✅' : '❌'}`);
      console.log(`   ⚪ Texto blanco: ${tieneTextoBlanco ? '✅' : '❌'}`);
      
      if (!tieneGradienteOscuro) {
        console.log(`   ⚠️  PROBLEMA: Esta página NO tiene el diseño premium aplicado`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('📋 INSTRUCCIONES PARA APLICAR CAMBIOS:');
  console.log('1. Elimina TODOS los archivos antiguos del servidor:');
  console.log('   - index.html');
  console.log('   - assets/index-*.js');
  console.log('   - assets/index-*.css');
  console.log('');
  console.log('2. Sube los nuevos archivos de la carpeta dist/:');
  console.log('   - dist/index.html');
  console.log('   - dist/assets/index-3a976124.js');
  console.log('   - dist/assets/index-04b14318.css');
  console.log('');
  console.log('3. Limpia la caché del navegador:');
  console.log('   - Ctrl+Shift+R (Windows/Linux)');
  console.log('   - Cmd+Shift+R (Mac)');
  console.log('   - O F12 > Network > Disable cache');
}

verificarArchivosServidor().catch(console.error);
