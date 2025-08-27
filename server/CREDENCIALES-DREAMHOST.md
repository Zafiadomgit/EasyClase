# 🔐 Credenciales de Dreamhost - MySQL

## 📊 **Configuración Confirmada del Panel:**

### **Servidor MySQL:**
- **Hostname:** `mysql.easyclaseapp.com`
- **Ubicación:** US - East (Ashburn, Virginia)
- **Estado:** Activo ✅

### **Base de Datos:**
- **Nombre:** `easyclasebd_v2`
- **Tamaño:** 1.00 KiB
- **Descripción:** MySQL Database
- **Estado:** Activa ✅

### **Usuario:**
- **Username:** `zafiadombd`
- **Estado:** Activo ✅
- **Acceso:** Base de datos `easyclasebd_v2`

## 🔧 **Variables de Entorno para Vercel:**

```bash
# Base de datos MySQL
MYSQL_HOST=mysql.easyclaseapp.com
MYSQL_USER=zafiadombd
MYSQL_PASSWORD=f9ZrKNH2bNuYT8d
MYSQL_DATABASE=easyclasebd_v2
MYSQL_PORT=3306

# Otras variables requeridas
JWT_SECRET=TU_JWT_SECRET_SUPER_SEGURO
MERCADOPAGO_ACCESS_TOKEN=TU_TOKEN_DE_MERCADOPAGO
MERCADOPAGO_PUBLIC_KEY=TU_PUBLIC_KEY_DE_MERCADOPAGO
```

## 🚀 **Pasos para Configurar en Vercel:**

1. **Ir al Dashboard de Vercel**
2. **Seleccionar tu proyecto EasyClase**
3. **Ir a Settings > Environment Variables**
4. **Agregar cada variable con su valor correspondiente**

## ⚠️ **Notas Importantes:**

- **Contraseña:** Necesitas la contraseña real del usuario `zafiadombd`
- **Hostname:** El hostname `mysql.easyclaseapp.com` ya está activo
- **Base de datos:** `easyclasebd_v2` ya existe y está lista para usar
- **Usuario:** `zafiadombd` ya tiene acceso a la base de datos

## 🔍 **Verificación:**

Una vez configuradas las variables en Vercel, puedes verificar la conexión ejecutando:

```bash
cd server
npm run verify-mysql
```

## 📞 **Soporte:**

Si necesitas ayuda con las credenciales:
- **Panel de Dreamhost:** https://panel.dreamhost.com
- **phpMyAdmin:** Disponible desde el panel de Dreamhost
- **Documentación:** https://help.dreamhost.com/hc/en-us

---

**¡La configuración de Dreamhost está lista! Solo necesitas la contraseña del usuario y configurar las variables en Vercel.**
