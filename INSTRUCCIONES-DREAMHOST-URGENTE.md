# 🚨 INSTRUCCIONES URGENTES PARA DREAMHOST

## ❌ PROBLEMA CONFIRMADO
Los archivos PHP en Dreamhost **NO han sido actualizados** con los tokens de producción correctos.

## 🎯 SOLUCIÓN INMEDIATA

### 📁 ARCHIVOS QUE NECESITAS SUBIR AHORA:

#### **1. Archivo de Prueba**
- **Archivo local**: `public/api/test-token.php`
- **Subir a**: `/api/test-token.php`
- **Propósito**: Verificar que los archivos se suben correctamente

#### **2. Archivo Principal Corregido**
- **Archivo local**: `public/api/crear-preferencia-mercadopago.php`
- **Subir a**: `/api/crear-preferencia-mercadopago.php`
- **Propósito**: Archivo principal con token de producción

#### **3. Webhook Corregido**
- **Archivo local**: `public/api/webhook-mercadopago.php`
- **Subir a**: `/api/webhook-mercadopago.php`
- **Propósito**: Webhook con token de producción

## 🚀 PASOS ESPECÍFICOS EN DREAMHOST:

### **PASO 1: Acceder al Panel**
1. Ve a https://panel.dreamhost.com
2. Inicia sesión con tus credenciales
3. Ve a **"Websites"** > **"Manage Websites"**
4. Selecciona tu dominio `easyclaseapp.com`

### **PASO 2: Administrador de Archivos**
1. Haz clic en **"Files"** > **"File Manager"**
2. Navega a la carpeta raíz de tu dominio
3. Ve a la carpeta `/api/`

### **PASO 3: Subir Archivos**
1. **Sube `test-token.php`** primero (para verificar)
2. **Sube `crear-preferencia-mercadopago.php`** (sobrescribir)
3. **Sube `webhook-mercadopago.php`** (sobrescribir)

### **PASO 4: Verificar**
1. Ve a `https://easyclaseapp.com/api/test-token.php`
2. Deberías ver: `"token_type": "PRODUCCIÓN"`
3. Si ves esto, los archivos se subieron correctamente

## ⚠️ IMPORTANTE:

### **Configuración de Subida:**
- **Modo**: BINARIO (no texto)
- **Sobrescribir**: Sí, siempre sobrescribir
- **Permisos**: 644 (lectura/escritura para propietario, lectura para otros)

### **Verificación Rápida:**
Después de subir, ejecuta:
```bash
node test-dreamhost-upload.js
```

Deberías ver:
- ✅ "Archivo de prueba funciona con token de PRODUCCIÓN"
- ✅ Los pagos funcionarán correctamente

## 🔍 DIAGNÓSTICO ACTUAL:

- **❌ Archivos en Dreamhost**: Tokens de prueba (antiguos)
- **✅ Archivos locales**: Tokens de producción (correctos)
- **❌ Resultado**: Error "invalid_token" en pagos

## 🎯 RESULTADO ESPERADO:

Una vez subidos los archivos:
- ✅ Error "invalid_token" desaparecerá
- ✅ Los pagos funcionarán correctamente
- ✅ MercadoPago procesará pagos reales

---

**🚨 URGENTE: Sube los 3 archivos PHP a Dreamhost para solucionar el problema de pagos.**
