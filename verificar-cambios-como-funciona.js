import fetch from 'node-fetch';

async function verificarCambios() {
  console.log('🔍 VERIFICANDO CAMBIOS EN "¿CÓMO FUNCIONA?"...\n');

  try {
    const response = await fetch('https://easyclaseapp.com/como-funciona');
    const html = await response.text();
    
    console.log(`✅ Status: ${response.status}`);
    
    // Verificar que NO tenga las líneas problemáticas
    const tieneLineaProblematica = html.includes('bg-primary-200');
    console.log(`🚫 Línea problemática eliminada: ${!tieneLineaProblematica ? '✅' : '❌'}`);
    
    // Verificar que tenga el marco en los números
    const tieneMarcoNumeros = html.includes('bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-bold z-20 backdrop-blur-sm border border-white/30');
    console.log(`🎯 Marco en números: ${tieneMarcoNumeros ? '✅' : '❌'}`);
    
    // Verificar que tenga el diseño premium
    const tieneGradiente = html.includes('bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900');
    console.log(`🎨 Diseño premium: ${tieneGradiente ? '✅' : '❌'}`);
    
    console.log('');
    
    if (!tieneLineaProblematica && tieneMarcoNumeros && tieneGradiente) {
      console.log('🎉 ¡PERFECTO! Todos los cambios se han aplicado correctamente:');
      console.log('   ✅ Líneas horizontales eliminadas');
      console.log('   ✅ Números con marco glassmorphism');
      console.log('   ✅ Diseño premium aplicado');
    } else {
      console.log('⚠️  Algunos cambios no se han aplicado. Necesitas:');
      if (tieneLineaProblematica) {
        console.log('   ❌ Eliminar líneas horizontales');
      }
      if (!tieneMarcoNumeros) {
        console.log('   ❌ Agregar marco a los números');
      }
      if (!tieneGradiente) {
        console.log('   ❌ Aplicar diseño premium');
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

verificarCambios().catch(console.error);
