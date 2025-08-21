# 🎓 EasyClase - Plataforma Completa de Clases Particulares

Una plataforma moderna y completa para conectar estudiantes con profesores verificados. Desarrollada con React, Node.js, Express, MongoDB y integración con MercadoPago.

## 🚀 ¡Sistema Completamente Funcional!

### ✅ **Lo que está implementado:**

**🎨 Frontend (React + Vite)**
- ✅ Diseño moderno y responsive
- ✅ Autenticación completa (Login/Registro)
- ✅ Dashboard diferenciado para estudiantes y profesores
- ✅ Búsqueda avanzada de profesores con filtros
- ✅ Perfiles detallados de profesores
- ✅ Sistema de reservas integrado
- ✅ Navegación intuitiva y UX optimizada
- ✅ **Sistema de retiro de dinero para profesores** 🆕
- ✅ **Modal de confirmación de retiros** 🆕
- ✅ **Cálculo automático de comisiones** 🆕

**🔧 Backend (Node.js + Express + MongoDB)**
- ✅ API RESTful completa
- ✅ Autenticación JWT segura
- ✅ Modelos de datos robustos (Users, Clases, Reviews)
- ✅ Sistema de roles (Estudiante/Profesor)
- ✅ Integración con MercadoPago
- ✅ Webhooks para pagos
- ✅ **API de retiro de dinero** 🆕
- ✅ **Cálculo de balance disponible** 🆕
- ✅ **Gestión de comisiones automática** 🆕
- ✅ Validaciones y seguridad

**💳 Funcionalidades Principales**
- ✅ Registro de estudiantes y profesores
- ✅ Búsqueda y filtrado de clases
- ✅ Sistema de reservas con escrow
- ✅ Gestión de disponibilidad
- ✅ Dashboard con estadísticas reales
- ✅ Sistema de calificaciones
- ✅ Notificaciones de estado
- ✅ **Retiro de ganancias para profesores** 🆕
- ✅ **Comisión automática del 20%** 🆕
- ✅ **Integración directa con MercadoPago** 🆕

## 📁 Estructura del Proyecto

```
EasyClase/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios API
│   │   ├── contexts/       # Context de autenticación
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── server/                  # Backend Express + MongoDB
    ├── models/             # Modelos de datos
    ├── controllers/        # Lógica de negocio
    ├── routes/            # Rutas de la API
    ├── services/          # Servicios externos (MercadoPago)
    ├── package.json
    └── server.js
```

## 🛠 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB (local o MongoDB Atlas)
- Cuenta de MercadoPago para pagos

### 1. **Instalar Frontend**
```bash
# En la carpeta principal del proyecto
npm install
npm run dev
# Se ejecuta en http://localhost:3001
```

### 2. **Instalar Backend**
```bash
cd server
npm install

# Crear archivo .env con las siguientes variables:
echo "MONGODB_URI=mongodb://localhost:27017/easyclase
JWT_SECRET=easyclase_jwt_secret_super_secreto_2024
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADOPAGO
MP_PUBLIC_KEY=TU_PUBLIC_KEY_DE_MERCADOPAGO
FRONTEND_URL=http://localhost:3001
WEBHOOK_URL=http://localhost:3000
FRONTEND_SUCCESS_URL=http://localhost:3001/pago-exitoso
FRONTEND_FAILURE_URL=http://localhost:3001/pago-fallido
PORT=3000
NODE_ENV=development" > .env

npm run dev
# Se ejecuta en http://localhost:3000
```

### 3. **Base de Datos**
El sistema creará automáticamente las colecciones necesarias al ejecutarse por primera vez.

## 🌟 Funcionalidades Implementadas

### 👨‍🎓 **Para Estudiantes:**
1. **Registro y Login** - Autenticación segura
2. **Búsqueda de Profesores** - Filtros avanzados por materia, precio, calificación
3. **Perfil de Profesor** - Vista detallada con reseñas y disponibilidad
4. **Reservar Clases** - Sistema de reservas con selección de fecha/hora
5. **Dashboard Personal** - Gestión de clases y estadísticas
6. **Sistema de Pagos** - Integración con MercadoPago (escrow)
7. **Calificaciones** - Sistema de reseñas post-clase

### 👨‍🏫 **Para Profesores:**
1. **Registro como Profesor** - Perfil especializado
2. **Gestión de Perfil** - Especialidades, precios, descripción
3. **Dashboard de Profesor** - Estadísticas e ingresos
4. **Gestión de Solicitudes** - Aceptar/rechazar clases
5. **Configurar Disponibilidad** - Horarios y modalidades
6. **Recibir Pagos** - Sistema automático post-confirmación
7. **🆕 Retirar Ganancias** - Sistema de retiro con comisión automática
8. **🆕 Balance en Tiempo Real** - Visualización de ganancias disponibles
9. **🆕 Modal de Confirmación** - Desglose detallado de comisiones

### 🔧 **Funcionalidades Técnicas:**
- **Autenticación JWT** - Segura y escalable
- **API RESTful** - Endpoints organizados y documentados
- **Base de Datos NoSQL** - MongoDB con Mongoose
- **Pagos Seguros** - MercadoPago con webhook verification
- **🆕 Retiros Automáticos** - Integración directa con MercadoPago
- **🆕 Cálculo de Comisiones** - 20% automático en retiros
- **Responsive Design** - Optimizado para móvil y desktop
- **Estado en Tiempo Real** - Actualizaciones automáticas
- **Validaciones** - Cliente y servidor
- **Manejo de Errores** - Robusto y user-friendly

## 💰 **Sistema de Monetización**

### **Comisiones y Retiros:**
- **Comisión por transacción**: 20% automática
- **Retiro mínimo**: $50.000 COP
- **Proceso de retiro**: Integración directa con MercadoPago
- **Tiempo de procesamiento**: 24-48 horas
- **Métodos de pago**: Transferencia bancaria, cuenta MercadoPago

### **Flujo de Retiro:**
1. Profesor accede a su dashboard
2. Ve sus ingresos totales y balance disponible
3. Hace clic en "Retirar Dinero"
4. Modal muestra desglose: monto - comisión = neto
5. Confirma el retiro
6. Se redirige a MercadoPago para completar
7. Recibe confirmación y seguimiento

## 🚀 Ejecutar el Sistema Completo

### Opción 1: Desarrollo (Ambos servicios por separado)
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Opción 2: Producción
```bash
# Build del frontend
npm run build

# Ejecutar solo el backend (sirve el frontend estático)
cd server
npm start
```

## 🔗 URLs Principales

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Status**: http://localhost:3000/api/status

## 📱 Páginas Principales

1. **/** - Página de inicio con propuesta de valor
2. **/login** - Iniciar sesión
3. **/registro** - Crear cuenta
4. **/buscar** - Buscar profesores y clases
5. **/profesor/:id** - Perfil detallado del profesor
6. **/dashboard** - Panel personal (requiere login)
7. **/ser-profesor** - Registro como profesor

## 🎯 Flujos de Usuario Implementados

### 🔄 **Flujo de Estudiante:**
1. Registro → 2. Búsqueda → 3. Selección de Profesor → 4. Reserva → 5. Pago → 6. Clase → 7. Calificación

### 🔄 **Flujo de Profesor:**
1. Registro → 2. Configurar Perfil → 3. Recibir Solicitudes → 4. Aceptar/Rechazar → 5. Dar Clase → 6. Confirmar → 7. Recibir Pago → 8. **🆕 Retirar Ganancias**

## 🔒 Seguridad Implementada

- ✅ Autenticación JWT con expiración
- ✅ Validación de datos (cliente y servidor)
- ✅ Protección CORS configurada
- ✅ Rate limiting para APIs
- ✅ Sanitización de entradas
- ✅ Hashing de contraseñas (bcrypt)
- ✅ Verificación de webhooks de MercadoPago
- ✅ **🆕 Validación de roles para retiros**
- ✅ **🆕 Verificación de balance disponible**

## 📊 Base de Datos

### Colecciones Principales:
- **users** - Estudiantes y profesores
- **clases** - Solicitudes y clases programadas
- **reviews** - Calificaciones y comentarios
- **🆕 retiros** - Historial de retiros de profesores

### Índices Optimizados:
- Búsqueda de profesores por especialidad
- Filtros por calificación y precio
- Consultas de clases por usuario
- **🆕 Consultas de balance por profesor**

## 🎨 Tecnologías Utilizadas

**Frontend:**
- React 18 con Hooks
- Vite (build tool)
- Tailwind CSS (estilos)
- React Router (navegación)
- Context API (estado global)
- Lucide React (iconos)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para passwords
- Validaciones con express-validator
- CORS y Helmet para seguridad

**Integraciones:**
- MercadoPago (pagos y retiros)
- Webhooks (notificaciones)

## 🆕 **Nuevas Funcionalidades (Última Actualización)**

### **Sistema de Retiro de Dinero:**
- ✅ Botón "Retirar Dinero" en dashboard de profesores
- ✅ Modal de confirmación con desglose de comisiones
- ✅ Cálculo automático: monto - 20% comisión = neto
- ✅ Integración directa con MercadoPago
- ✅ Estados de carga y manejo de errores
- ✅ Información de balance disponible en tiempo real

### **Mejoras en UI/UX:**
- ✅ Corrección de rangos de ganancia: "$25.000 - $80.000"
- ✅ Información de comisión visible en dashboard
- ✅ Botones con estados de carga
- ✅ Mensajes de confirmación y error
- ✅ Diseño responsive para todas las funcionalidades

## 🔮 Próximas Mejoras

- [ ] Chat en tiempo real (Socket.io)
- [ ] Notificaciones push
- [ ] Sistema de favoritos
- [ ] Calendario integrado
- [ ] Videollamadas integradas
- [ ] App móvil (React Native)
- [ ] Dashboard de administración
- [ ] Analytics avanzados
- [ ] Sistema de cupones
- [ ] Integración con Google Calendar
- [ ] **🆕 Historial detallado de retiros**
- [ ] **🆕 Notificaciones de retiro completado**
- [ ] **🆕 Múltiples métodos de retiro**

## 🤝 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- 📧 Email: hola@easyclase.com
- 📱 WhatsApp: +57 300 123 4567

---

**EasyClase** - Aprende habilidades útiles, paga por hora, sin riesgos. 🎓✨

**¡Ahora con sistema completo de retiro de ganancias para profesores!** 💰🚀