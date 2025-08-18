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

**🔧 Backend (Node.js + Express + MongoDB)**
- ✅ API RESTful completa
- ✅ Autenticación JWT segura
- ✅ Modelos de datos robustos (Users, Clases, Reviews)
- ✅ Sistema de roles (Estudiante/Profesor)
- ✅ Integración con MercadoPago
- ✅ Webhooks para pagos
- ✅ Validaciones y seguridad

**💳 Funcionalidades Principales**
- ✅ Registro de estudiantes y profesores
- ✅ Búsqueda y filtrado de clases
- ✅ Sistema de reservas con escrow
- ✅ Gestión de disponibilidad
- ✅ Dashboard con estadísticas reales
- ✅ Sistema de calificaciones
- ✅ Notificaciones de estado

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
└── Server.js/               # Backend Express + MongoDB
    ├── models/             # Modelos de datos
    ├── controllers/        # Lógica de negocio
    ├── routes/            # Rutas de la API
    ├── services/          # Servicios externos
    ├── package.json
    └── server.js
```

## 🛠 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB (local o MongoDB Atlas)
- Cuenta de MercadoPago para pagos (opcional para desarrollo)

### 1. **Instalar Frontend**
```bash
# En la carpeta principal del proyecto
npm install
npm run dev
# Se ejecuta en http://localhost:3001
```

### 2. **Instalar Backend**
```bash
cd Server.js
npm install

# Crear archivo .env con las siguientes variables:
echo "MONGODB_URI=mongodb://localhost:27017/easyclase
JWT_SECRET=easyclase_jwt_secret_super_secreto_2024
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADOPAGO
FRONTEND_URL=http://localhost:3001
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

### 🔧 **Funcionalidades Técnicas:**
- **Autenticación JWT** - Segura y escalable
- **API RESTful** - Endpoints organizados y documentados
- **Base de Datos NoSQL** - MongoDB con Mongoose
- **Pagos Seguros** - MercadoPago con webhook verification
- **Responsive Design** - Optimizado para móvil y desktop
- **Estado en Tiempo Real** - Actualizaciones automáticas
- **Validaciones** - Cliente y servidor
- **Manejo de Errores** - Robusto y user-friendly

## 🚀 Ejecutar el Sistema Completo

### Opción 1: Desarrollo (Ambos servicios por separado)
```bash
# Terminal 1 - Backend
cd Server.js
npm run dev

# Terminal 2 - Frontend  
npm run dev
```

### Opción 2: Producción
```bash
# Build del frontend
npm run build

# Ejecutar solo el backend (sirve el frontend estático)
cd Server.js
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

## 🎯 Flujos de Usuario Implementados

### 🔄 **Flujo de Estudiante:**
1. Registro → 2. Búsqueda → 3. Selección de Profesor → 4. Reserva → 5. Pago → 6. Clase → 7. Calificación

### 🔄 **Flujo de Profesor:**
1. Registro → 2. Configurar Perfil → 3. Recibir Solicitudes → 4. Aceptar/Rechazar → 5. Dar Clase → 6. Confirmar → 7. Recibir Pago

## 🔒 Seguridad Implementada

- ✅ Autenticación JWT con expiración
- ✅ Validación de datos (cliente y servidor)
- ✅ Protección CORS configurada
- ✅ Rate limiting para APIs
- ✅ Sanitización de entradas
- ✅ Hashing de contraseñas (bcrypt)
- ✅ Verificación de webhooks de MercadoPago

## 📊 Base de Datos

### Colecciones Principales:
- **users** - Estudiantes y profesores
- **clases** - Solicitudes y clases programadas
- **reviews** - Calificaciones y comentarios

### Índices Optimizados:
- Búsqueda de profesores por especialidad
- Filtros por calificación y precio
- Consultas de clases por usuario

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
- MercadoPago (pagos)
- Webhooks (notificaciones)

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

## 🤝 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- 📧 Email: hola@easyclase.com
- 📱 WhatsApp: +57 300 123 4567

---

**EasyClase** - Aprende habilidades útiles, paga por hora, sin riesgos. 🎓✨