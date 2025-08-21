# 🚀 EasyClase - Instrucciones Rápidas

## ⚡ Configuración Express (5 minutos)

### 1. **Instalar Dependencias**
```bash
npm install
cd server && npm install
```

### 2. **Configurar Variables de Entorno**
```bash
# En la raíz del proyecto
cp env.example .env

# En la carpeta server
cd server
cp ../env.example .env
```

### 3. **Variables Requeridas**
```env
# Frontend (.env en raíz)
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# Backend (server/.env)
MONGODB_URI=mongodb://localhost:27017/easyclase
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
MP_ACCESS_TOKEN=tu_access_token_de_mercadopago
MP_PUBLIC_KEY=tu_public_key_de_mercadopago
FRONTEND_URL=http://localhost:3001
WEBHOOK_URL=http://localhost:3000
FRONTEND_SUCCESS_URL=http://localhost:3001/pago-exitoso
FRONTEND_FAILURE_URL=http://localhost:3001/pago-fallido
PORT=3000
NODE_ENV=development
```

### 4. **Ejecutar Sistema**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🎯 URLs Principales

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Status**: http://localhost:3000/api/status

## 💰 **Nueva Funcionalidad: Retiro de Dinero**

### **Para Profesores:**
1. **Accede al Dashboard** como profesor
2. **Ve la tarjeta "Ingresos Totales"** 
3. **Haz clic en "Retirar Dinero"**
4. **Confirma en el modal** (monto - 20% comisión = neto)
5. **Completa en MercadoPago**

### **Configuración MercadoPago:**
```env
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxx
MP_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxxxxxxxx
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Frontend
cd server && npm run dev       # Backend

# Producción
npm run build                 # Build frontend
cd server && npm start        # Backend

# Deploy Vercel
git add . && git commit -m "Update"
git push origin main
```

## 📱 Funcionalidades Principales

### **Estudiantes:**
- ✅ Registro/Login
- ✅ Búsqueda de profesores
- ✅ Reserva de clases
- ✅ Sistema de pagos
- ✅ Dashboard personal

### **Profesores:**
- ✅ Registro como profesor
- ✅ Gestión de perfil
- ✅ Dashboard con estadísticas
- ✅ **🆕 Retiro de ganancias**
- ✅ **🆕 Comisión automática 20%**

## 🚨 Solución de Problemas

### **Error de Conexión a MongoDB:**
```bash
# Verificar MongoDB
mongod --version
# Si no está instalado: https://docs.mongodb.com/manual/installation/
```

### **Error de MercadoPago:**
```bash
# Verificar variables de entorno
echo $MP_ACCESS_TOKEN
echo $MP_PUBLIC_KEY
```

### **Error de Puerto:**
```bash
# Cambiar puerto en .env
PORT=3001  # Para backend
VITE_PORT=3002  # Para frontend
```

## 📊 Estructura de Archivos

```
EasyClase/
├── src/                    # Frontend React
│   ├── components/        # Componentes
│   ├── pages/            # Páginas
│   ├── services/         # API calls
│   └── contexts/         # Auth context
├── server/               # Backend Node.js
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # MercadoPago service
│   └── server.js        # Main server
├── package.json
└── vercel.json          # Deploy config
```

## 🎯 Próximos Pasos

1. **Configurar MercadoPago** con credenciales reales
2. **Configurar MongoDB Atlas** para producción
3. **Deploy en Vercel** con variables de entorno
4. **Probar flujo completo** de retiro de dinero
5. **Monitorear webhooks** de MercadoPago

## 📞 Soporte

- 📧 Email: hola@easyclase.com
- 📱 WhatsApp: +57 300 123 4567

---

**¡Sistema listo para generar ingresos!** 💰🚀
