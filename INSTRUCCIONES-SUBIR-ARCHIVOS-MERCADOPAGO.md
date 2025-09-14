# 🚀 INSTRUCCIONES PARA SUBIR ARCHIVOS CORREGIDOS

## ✅ ARCHIVOS LISTOS PARA SUBIR

He corregido los archivos PHP con el token de producción correcto. Ahora necesitas subir estos 2 archivos a tu servidor:

### 📁 ARCHIVO 1: `public/api/crear-preferencia-mercadopago.php`
**📍 Ubicación en servidor:** `/api/crear-preferencia-mercadopago.php`

### 📁 ARCHIVO 2: `public/api/webhook-mercadopago.php`  
**📍 Ubicación en servidor:** `/api/webhook-mercadopago.php`

## 🔧 CAMBIOS REALIZADOS

### En `crear-preferencia-mercadopago.php`:
- ✅ Línea 14: Token de producción confirmado
- ✅ Comentario actualizado para claridad

### En `webhook-mercadopago.php`:
- ✅ Línea 48: Token de producción confirmado  
- ✅ Comentario actualizado para claridad

## 📋 PASOS PARA SUBIR

### Opción A: Subir archivos completos (RECOMENDADO)
1. **Accede a tu panel de control del servidor** (Dreamhost, cPanel, etc.)
2. **Navega a la carpeta `/api/`** en tu servidor
3. **Sube el archivo** `public/api/crear-preferencia-mercadopago.php` 
   - Sobrescribe el archivo existente
4. **Sube el archivo** `public/api/webhook-mercadopago.php`
   - Sobrescribe el archivo existente
5. **Verifica** que ambos archivos se subieron correctamente

### Opción B: Editar directamente en el servidor
1. **Abre** `/api/crear-preferencia-mercadopago.php` en el editor del servidor
2. **Busca la línea 14** que contiene el token
3. **Asegúrate** que diga: `$access_token = 'APP_USR-5890608562147325-082512-c5909ffb078ebcb8d07406452753cbed-345306681';`
4. **Guarda** el archivo
5. **Repite** lo mismo para `/api/webhook-mercadopago.php` en la línea 48

## ⚠️ IMPORTANTE
- **Sube en modo BINARIO** si usas FTP
- **Verifica** que no haya espacios extra en los nombres
- **Los cambios se aplican inmediatamente** (no hay cache que limpiar)

## 🎯 RESULTADO ESPERADO
Una vez subidos los archivos:
- ❌ El error "invalid_token" desaparecerá
- ✅ Los pagos funcionarán correctamente
- ✅ MercadoPago procesará pagos reales

## 🔍 VERIFICACIÓN
Después de subir, prueba hacer un pago en tu sitio web. Debería funcionar sin el error "invalid_token".

---
**📅 Fecha:** $(date)
**👤 Preparado por:** Asistente AI
**🎯 Estado:** LISTO PARA SUBIR
