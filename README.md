# 🎓 EasyClase - Plataforma de Clases Particulares

Una plataforma moderna para conectar estudiantes con profesores verificados. Desarrollada con React, Node.js, Express, MongoDB y MercadoPago.

## ✨ Características Principales

### 🎯 **Para Estudiantes:**
- ✅ Búsqueda avanzada de profesores
- ✅ Sistema de reservas integrado
- ✅ Pagos seguros con MercadoPago
- ✅ Sistema de calificaciones
- ✅ Dashboard personal

### 👨‍🏫 **Para Profesores:**
- ✅ Perfil profesional personalizable
- ✅ Gestión de solicitudes de clases
- ✅ Dashboard con estadísticas
- ✅ **🆕 Sistema de retiro de ganancias**
- ✅ **🆕 Comisión automática del 20%**
- ✅ **🆕 Integración directa con MercadoPago**

## 🚀 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/easyclase.git
cd easyclase

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

## 💰 Sistema de Monetización

### **Retiro de Ganancias para Profesores:**
- **Comisión**: 20% automática por transacción
- **Retiro mínimo**: $50.000 COP
- **Proceso**: Integración directa con MercadoPago
- **Tiempo**: 24-48 horas de procesamiento

### **Flujo de Retiro:**
1. Profesor ve sus ingresos en el dashboard
2. Hace clic en "Retirar Dinero"
3. Modal muestra desglose de comisiones
4. Confirma y se redirige a MercadoPago
5. Completa el retiro de forma segura

## 🏆 Sistema de Membresías Premium

### **Para Estudiantes:**
- **Descuento Ilimitado**: 10% de descuento en TODAS las clases mientras el premium esté activo
- **Sin Límite por Categoría**: Pueden usar descuentos en múltiples categorías sin restricciones
- **Descuento Asumido por la Plataforma**: Cuando el estudiante es premium, la plataforma asume el costo del descuento

### **Para Profesores:**
- **Comisión Reducida**: Solo 10% de comisión vs 20% estándar
- **Mayor Visibilidad**: Aparecen primero en búsquedas
- **Publicación Instantánea**: Sin espera de aprobación

### **Lógica de Descuentos:**
- **Estudiante Premium + Profesor Premium**: La plataforma asume el 10% de descuento
- **Estudiante Premium + Profesor Normal**: El profesor asume el 10% de descuento
- **Estudiante Normal**: El profesor asume el 10% de descuento (solo primera clase por categoría)

## 🛠 Tecnologías

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Pagos**: MercadoPago
- **Autenticación**: JWT
- **Deploy**: Vercel

## 📱 Funcionalidades

- 🔐 Autenticación segura
- 🔍 Búsqueda avanzada con filtros
- 💳 Pagos y retiros automáticos
- 📊 Dashboard con estadísticas
- ⭐ Sistema de calificaciones
- 📱 Diseño responsive
- 🔔 Notificaciones en tiempo real

## 🚀 Deploy

El proyecto está configurado para deploy automático en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. ¡Listo! Deploy automático en cada push

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- 📧 Email: hola@easyclase.com
- 📱 WhatsApp: +57 300 123 4567

---

**EasyClase** - Aprende habilidades útiles, paga por hora, sin riesgos. 🎓✨

**¡Ahora con sistema completo de retiro de ganancias!** 💰🚀