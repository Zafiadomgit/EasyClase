import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Verificando dependencias para Vercel...\n');

const requiredDependencies = [
  'mysql2',
  'sequelize',
  'express',
  'cors',
  'helmet',
  'bcryptjs',
  'jsonwebtoken',
  'nodemailer'
];

const checkDependencies = () => {
  try {
    // Verificar que node_modules existe
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Instalando dependencias...');
      execSync('npm install', { stdio: 'inherit' });
    }

    // Verificar dependencias específicas
    console.log('🔍 Verificando dependencias críticas...');
    
    requiredDependencies.forEach(dep => {
      try {
        require.resolve(dep);
        console.log(`✅ ${dep} - Instalado`);
      } catch (error) {
        console.log(`❌ ${dep} - NO encontrado, instalando...`);
        try {
          execSync(`npm install ${dep}`, { stdio: 'inherit' });
          console.log(`✅ ${dep} - Instalado correctamente`);
        } catch (installError) {
          console.error(`❌ Error instalando ${dep}:`, installError.message);
        }
      }
    });

    // Verificar mysql2 específicamente
    console.log('\n🔍 Verificando mysql2...');
    try {
      const mysql2 = require('mysql2');
      console.log('✅ mysql2 - Funcionando correctamente');
      
      // Probar conexión básica
      const connection = mysql2.createConnection({
        host: process.env.MYSQL_HOST || 'mysql.easyclaseapp.com',
        user: process.env.MYSQL_USER || 'zafiadombd',
        password: process.env.MYSQL_PASSWORD || 'f9ZrKNH2bNuYT8d',
        database: process.env.MYSQL_DATABASE || 'easyclasebd_v2'
      });
      
      connection.connect((err) => {
        if (err) {
          console.log('⚠️  mysql2 instalado pero no puede conectar (normal en Vercel)');
        } else {
          console.log('✅ mysql2 - Conexión de prueba exitosa');
          connection.end();
        }
      });
      
    } catch (error) {
      console.error('❌ Error con mysql2:', error.message);
    }

    console.log('\n🎉 Verificación de dependencias completada');
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error);
  }
};

checkDependencies();
