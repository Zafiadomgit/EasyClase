# 🔧 SOLUCIÓN ERROR MERCADOPAGO "invalid_token"

## 📋 PROBLEMA IDENTIFICADO
El servidor aún está usando el token de **PRUEBA** en lugar del token de **PRODUCCIÓN**.

## ✅ TOKEN DE PRODUCCIÓN VÁLIDO
- ✅ Token verificado y funcionando
- ✅ Usuario: DAVIDPIETERSJUEGOS
- ✅ Email: davidpietersjuegos@gmail.com
- ✅ Tipo: PRODUCCIÓN

## 📁 ARCHIVOS QUE NECESITAS SUBIR

### 1. Archivo: `public/api/crear-preferencia-mercadopago.php`
**📍 Ubicación en servidor:** `/api/crear-preferencia-mercadopago.php`

**🔧 Cambio específico en línea 14:**
```php
// ANTES (token de prueba):
$access_token = 'TEST-0aa911c4-cb56-4148-b441-bec40d8f0405';

// DESPUÉS (token de producción):
$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
```

### 2. Archivo: `public/api/webhook-mercadopago.php`
**📍 Ubicación en servidor:** `/api/webhook-mercadopago.php`

**🔧 Cambio específico en línea 48:**
```php
// ANTES (token de prueba):
$access_token = 'TEST-0aa911c4-cb56-4148-b441-bec40d8f0405';

// DESPUÉS (token de producción):
$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';
```

## 🚀 PASOS PARA SOLUCIONAR

### Opción A: Subir archivos completos
1. Toma el archivo `public/api/crear-preferencia-mercadopago.php` de tu proyecto local
2. Súbelo a tu servidor en `/api/crear-preferencia-mercadopago.php`
3. Toma el archivo `public/api/webhook-mercadopago.php` de tu proyecto local
4. Súbelo a tu servidor en `/api/webhook-mercadopago.php`

### Opción B: Editar directamente en el servidor
1. Abre `/api/crear-preferencia-mercadopago.php` en tu servidor
2. Busca la línea 14 que dice: `$access_token = 'TEST-0aa911c4-cb56-4148-b441-bec40d8f0405';`
3. Cambia por: `$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';`
4. Guarda el archivo
5. Repite lo mismo para `/api/webhook-mercadopago.php` en la línea 48

## 🔍 VERIFICACIÓN
Después de hacer los cambios, ejecuta:
```bash
node diagnostico-mercadopago.js
```

Si todo está correcto, deberías ver:
- ✅ El servidor usa el token de PRODUCCIÓN
- ✅ Los pagos funcionan correctamente

## ⚠️ IMPORTANTE
- Asegúrate de subir los archivos en modo **BINARIO**
- Verifica que no haya espacios extra en los nombres de archivo
- Si usas un panel de control, asegúrate de **guardar** los cambios
- Los cambios deben aplicarse inmediatamente (no hay cache que limpiar)

## 🎯 RESULTADO ESPERADO
Una vez aplicados los cambios, el error "invalid_token" desaparecerá y los pagos funcionarán correctamente con MercadoPago en modo producción.
