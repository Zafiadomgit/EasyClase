#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Instalando dependencias para Vercel...');

try {
  // Verificar que estamos en el directorio correcto
  const currentDir = process.cwd();
  console.log('📁 Directorio actual:', currentDir);
  
  // Verificar que package.json existe
  const packageJsonPath = path.join(currentDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json no encontrado');
  }
  
  console.log('✅ package.json encontrado');
  
  // Instalar dependencias con npm
  console.log('📦 Instalando dependencias con npm...');
  execSync('npm install --production=false --force', { 
    stdio: 'inherit',
    cwd: currentDir 
  });
  
  console.log('✅ Dependencias instaladas correctamente');
  
  // Verificar que mysql2 se instaló
  const mysql2Path = path.join(currentDir, 'node_modules', 'mysql2');
  if (fs.existsSync(mysql2Path)) {
    console.log('✅ mysql2 instalado correctamente');
  } else {
    console.log('⚠️ mysql2 no encontrado, intentando instalación específica...');
    execSync('npm install mysql2@^3.14.3 --force', { 
      stdio: 'inherit',
      cwd: currentDir 
    });
  }
  
  // Verificar que sequelize se instaló
  const sequelizePath = path.join(currentDir, 'node_modules', 'sequelize');
  if (fs.existsSync(sequelizePath)) {
    console.log('✅ sequelize instalado correctamente');
  } else {
    console.log('⚠️ sequelize no encontrado, instalando...');
    execSync('npm install sequelize@^6.37.7 --force', { 
      stdio: 'inherit',
      cwd: currentDir 
    });
  }
  
  console.log('🎉 Instalación completada exitosamente');
  
} catch (error) {
  console.error('❌ Error durante la instalación:', error.message);
  process.exit(1);
}
