# 🚀 INSTRUCCIONES DE DESPLIEGUE URGENTE

## ✅ BUILD COMPLETADO EXITOSAMENTE

El build de producción se ha generado correctamente con el nuevo diseño premium.

## 📁 ARCHIVOS PARA SUBIR A DREAMHOST

### 1. **ARCHIVOS DEL FRONTEND (Nuevo Diseño Premium)**

**Ubicación local:** `dist/` (carpeta completa)
**Ubicación en Dreamhost:** Carpeta raíz de tu dominio

**Archivos principales:**
- `dist/index.html` → `/index.html`
- `dist/assets/index-2839c890.js` → `/assets/index-2839c890.js`
- `dist/assets/index-6945ff1c.css` → `/assets/index-6945ff1c.css`
- `dist/.htaccess` → `/.htaccess`

### 2. **ARCHIVOS PHP (Corrección del Token)**

**Ubicación local:** `public/api/`
**Ubicación en Dreamhost:** `/api/`

**Archivos para subir:**
- `public/api/test-server.php` → `/api/test-server.php`
- `public/api/crear-preferencia-mercadopago-MINIMAL.php` → `/api/crear-preferencia-mercadopago-MINIMAL.php`

## 🎯 PASOS EN DREAMHOST

### **Paso 1: Subir Frontend**
1. Accede al Panel de Control de Dreamhost
2. Ve a "Files" > "File Manager"
3. Navega a la carpeta raíz de tu dominio (`easyclaseapp.com`)
4. **Sube TODA la carpeta `dist/`** (o sus contenidos individuales)
5. Asegúrate de que `index.html` esté en la raíz

### **Paso 2: Subir Archivos PHP**
1. Ve a la carpeta `/api/` en tu dominio
2. Sube los 2 archivos PHP nuevos
3. Verifica que se suban correctamente

### **Paso 3: Verificar**
1. Abre `https://easyclaseapp.com/api/test-server.php`
2. Deberías ver JSON válido, no HTML de error
3. Abre `https://easyclaseapp.com/pago`
4. Deberías ver el nuevo diseño premium (fondo oscuro, efectos de cristal)

## 🔍 CAMBIOS VISUALES ESPERADOS

### **ANTES (Diseño actual):**
- Fondo blanco/gris claro
- Diseño básico y simple
- Sin efectos visuales

### **DESPUÉS (Nuevo diseño premium):**
- **Fondo oscuro** (slate-900 a purple-900)
- **Efectos de cristal** (backdrop-blur)
- **Gradientes sofisticados** (purple-pink-blue)
- **Animaciones suaves** y efectos hover
- **Tipografía grande** y elegante
- **Elementos flotantes** animados

## ⚠️ IMPORTANTE

1. **Sube TODOS los archivos** de la carpeta `dist/`
2. **No olvides los archivos PHP** para corregir el token
3. **Verifica** que ambos problemas se solucionen:
   - ✅ Diseño premium visible
   - ✅ Pagos funcionando

## 🆘 SI ALGO FALLA

Ejecuta este comando para verificar:
```bash
node test-php-files.js
```

Y revisa:
- `https://easyclaseapp.com/api/test-server.php` (debe mostrar JSON)
- `https://easyclaseapp.com/pago` (debe mostrar diseño oscuro premium)
