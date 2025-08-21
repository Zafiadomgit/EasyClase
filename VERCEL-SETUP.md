# 🚀 Configuración de EasyClase en Vercel

## ⚠️ Problema Identificado

Las funcionalidades de **"Mi Perfil"** y **"Mis Clases"** no funcionan en Vercel porque:

1. **Variables de entorno no configuradas**
2. **MongoDB Atlas no conectado**
3. **JWT Secret no configurado**

## 🔧 Solución: Configurar Variables de Entorno en Vercel

### 1. **Ir al Dashboard de Vercel**
- Ve a [vercel.com](https://vercel.com)
- Selecciona tu proyecto `easyclase`
- Ve a **Settings** → **Environment Variables**

### 2. **Configurar Variables Críticas**

#### **Base de Datos (MongoDB Atlas)**
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/easyclase?retryWrites=true&w=majority
```

#### **JWT Secret (Seguridad)**
```
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
```

#### **MercadoPago (Opcional - para pagos)**
```
MP_ACCESS_TOKEN=tu_access_token_de_mercadopago
MP_PUBLIC_KEY=tu_public_key_de_mercadopago
```

#### **URLs del Frontend**
```
FRONTEND_URL=https://easyclase.vercel.app
WEBHOOK_URL=https://easyclase.vercel.app
FRONTEND_SUCCESS_URL=https://easyclase.vercel.app/pago-exitoso
FRONTEND_FAILURE_URL=https://easyclase.vercel.app/pago-fallido
```

### 3. **Re-deploy Después de Configurar Variables**

```bash
# En tu repositorio local
git add .
git commit -m "Configuración para Vercel"
git push origin main
```

Vercel automáticamente hará un nuevo deploy.

## 🧪 Verificar que Funciona

### **1. Verificar API Status**
Visita: `https://easyclase.vercel.app/api/status`

Deberías ver:
```json
{
  "success": true,
  "message": "EasyClase API funcionando correctamente",
  "environment": "production"
}
```

### **2. Verificar Conexión a MongoDB**
En los logs de Vercel deberías ver:
```
✅ Conectado a MongoDB
🌍 Entorno: production
🔗 Base de datos: MongoDB Atlas
```

### **3. Probar Funcionalidades**
- **Login/Registro** ✅
- **Dashboard** ✅
- **Mi Perfil** ✅
- **Mis Clases** ✅
- **Buscar Profesores** ✅

## 🚨 Si Sigue Sin Funcionar

### **Verificar Logs en Vercel:**
1. Ve a tu proyecto en Vercel
2. **Functions** → **server/server.js**
3. Revisa los logs de error

### **Problemas Comunes:**
- **MONGODB_URI inválida** → Verificar conexión a MongoDB Atlas
- **JWT_SECRET faltante** → Token de autenticación no funciona
- **CORS errors** → Frontend no puede conectar con backend

## 📱 Configuración del Frontend

El frontend ya está configurado para usar la API de Vercel. Las llamadas a `/api/*` se redirigen automáticamente al backend.

## 🔄 Flujo de Datos en Vercel

```
Usuario → Frontend (Vercel) → API Routes → Backend (Vercel) → MongoDB Atlas
```

## ✅ Checklist de Verificación

- [ ] Variables de entorno configuradas en Vercel
- [ ] MongoDB Atlas conectado y funcionando
- [ ] JWT Secret configurado
- [ ] Re-deploy realizado después de configurar variables
- [ ] API status responde correctamente
- [ ] Login/Registro funciona
- [ ] Dashboard carga datos
- [ ] Perfil del profesor funciona
- [ ] Mis clases funciona

## 🆘 Soporte

Si después de seguir estos pasos sigue sin funcionar:

1. **Revisar logs de Vercel**
2. **Verificar variables de entorno**
3. **Comprobar conexión a MongoDB Atlas**
4. **Verificar que el re-deploy se completó**

---

**¡Con esta configuración, EasyClase debería funcionar perfectamente en Vercel! 🎉**
