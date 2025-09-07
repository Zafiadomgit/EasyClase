import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copiar .htaccess desde public a dist
const sourceFile = path.join(__dirname, '../public/.htaccess');
const destFile = path.join(__dirname, '../dist/.htaccess');

try {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ .htaccess copiado exitosamente a dist/');
} catch (error) {
  console.error('❌ Error al copiar .htaccess:', error.message);
  process.exit(1);
}
