# 📧 Sistema de Correos Electrónicos - EasyClase

## 🚀 Descripción General

EasyClase ahora incluye un sistema completo de correos electrónicos automatizados que mejora la experiencia del usuario y la profesionalidad de la plataforma. El sistema envía notificaciones en momentos clave del ciclo de vida de la aplicación.

## ✨ Funcionalidades Implementadas

### 📨 Tipos de Correos Disponibles

#### **1. Correos de Bienvenida**
- **Nuevos Usuarios**: Información sobre la plataforma y próximos pasos
- **Nuevos Profesores**: Guía específica para educadores
- **Envío**: Automático al registrarse

#### **2. Notificaciones de Seguridad**
- **Login Exitoso**: Información sobre el acceso (dispositivo, ubicación)
- **Envío**: Automático en cada inicio de sesión

#### **3. Gestión de Clases**
- **Confirmación de Reserva**: Detalles de la clase confirmada
- **Recordatorios Automáticos**: 24h, 1h y 10min antes de la clase
- **Resumen Diario**: Clases programadas para el día siguiente
- **Envío**: Automático según programación

#### **4. Transacciones**
- **Pago Exitoso**: Confirmación de transacción
- **Envío**: Automático al procesar el pago

#### **5. Interacciones**
- **Nueva Reseña**: Notificación al profesor sobre calificación
- **Cancelación de Clase**: Información sobre la cancelación
- **Disputas**: Notificaciones sobre casos abiertos

#### **6. Recuperación de Cuenta**
- **Reset de Contraseña**: Enlace seguro para restablecer acceso
- **Envío**: Al solicitar recuperación

## ⚙️ Configuración

### **Variables de Entorno Requeridas**

```bash
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion

# URL del frontend
FRONTEND_URL=http://localhost:3000
```

### **Configuración Gmail (Recomendado)**

1. **Habilitar 2FA** en tu cuenta de Gmail
2. **Generar contraseña de aplicación**:
   - Ve a Configuración de Google
   - Seguridad > Verificación en 2 pasos
   - Contraseñas de aplicación
   - Genera una nueva contraseña para "EasyClase"
3. **Usar la contraseña generada** en `SMTP_PASS`

### **Configuración Alternativa (Outlook, Yahoo, etc.)**

```bash
# Outlook
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587

# Yahoo
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

## 🎯 Programación de Notificaciones

### **Recordatorios de Clases**
- **24 horas antes**: Recordatorio general
- **1 hora antes**: Recordatorio urgente
- **10 minutos antes**: Recordatorio final
- **Frecuencia**: Verificación cada 5 minutos

### **Resúmenes Diarios**
- **Horario**: 9:00 AM cada día
- **Contenido**: Clases programadas para el día siguiente

### **Limpieza Automática**
- **Frecuencia**: Cada domingo a las 2:00 AM
- **Propósito**: Limpiar notificaciones antiguas

## 🧪 Pruebas del Sistema

### **Script de Pruebas**

```bash
cd server
node scripts/testEmailService.js
```

### **Verificación Manual**

1. **Registra un nuevo usuario** → Debe recibir correo de bienvenida
2. **Inicia sesión** → Debe recibir notificación de login
3. **Confirma una clase** → Debe recibir confirmación de reserva
4. **Crea una reseña** → El profesor debe recibir notificación

## 📊 Monitoreo y Logs

### **Logs del Sistema**

```bash
# Inicio del programador
🚀 Iniciando programador de notificaciones...
✅ Programador de notificaciones iniciado correctamente

# Envío de recordatorios
📧 Enviando recordatorios de clases...
✅ Recordatorio enviado a usuario@email.com para clase Matemáticas

# Resúmenes diarios
📅 Enviando recordatorios diarios...
✅ Resumen diario enviado a usuario@email.com
```

### **Estado del Programador**

```javascript
// Verificar estado
const status = notificationScheduler.getStatus();
console.log(status);
// Output:
// {
//   isRunning: true,
//   tasks: [
//     { name: 'Recordatorios', running: true, nextRun: Date },
//     { name: 'Diarios', running: true, nextRun: Date }
//   ]
// }
```

## 🔧 Personalización

### **Modificar Plantillas**

Las plantillas HTML están en `server/services/emailService.js`:

```javascript
// Ejemplo: Modificar correo de bienvenida
async sendWelcomeEmail(user) {
  const content = `
    <h2>¡Bienvenido a EasyClase! 🎉</h2>
    <p>Hola <strong>${user.nombre}</strong>,</p>
    // ... personalizar contenido
  `;
  // ... resto del código
}
```

### **Agregar Nuevos Tipos de Correo**

1. **Crear método** en `EmailService`
2. **Agregar caso** en `NotificationSchedulerService.sendImmediateNotification()`
3. **Integrar** en el controlador correspondiente

### **Modificar Programación**

```javascript
// En notificationSchedulerService.js
cron.schedule('0 8 * * *', () => {  // 8:00 AM en lugar de 9:00 AM
  this.sendDailyReminders()
}, { scheduled: false }).start();
```

## 🚨 Solución de Problemas

### **Error de Conexión SMTP**

```bash
❌ Error en conexión SMTP: Invalid login
```

**Soluciones:**
1. Verificar credenciales en `.env`
2. Habilitar "Acceso de apps menos seguras" (Gmail)
3. Usar contraseña de aplicación (Recomendado)
4. Verificar configuración de firewall

### **Correos No Recibidos**

1. **Revisar carpeta de spam**
2. **Verificar logs del servidor**
3. **Confirmar configuración SMTP**
4. **Probar con script de pruebas**

### **Programador No Inicia**

```bash
❌ Error iniciando sistema de notificaciones
```

**Soluciones:**
1. Verificar dependencias instaladas (`node-cron`)
2. Revisar permisos de archivos
3. Verificar configuración de base de datos
4. Revisar logs de error completos

## 📈 Métricas y Estadísticas

### **Correos Enviados por Tipo**

```javascript
// Agregar contadores en emailService.js
class EmailService {
  constructor() {
    this.stats = {
      welcome: 0,
      login: 0,
      reminders: 0,
      confirmations: 0,
      total: 0
    };
  }
  
  async sendWelcomeEmail(user) {
    // ... envío del correo
    this.stats.welcome++;
    this.stats.total++;
  }
}
```

### **Tasa de Entrega**

```javascript
// Implementar tracking de entrega
async sendEmail(mailOptions) {
  try {
    const result = await this.transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a ${mailOptions.to}`);
    return result;
  } catch (error) {
    console.error(`❌ Error enviando correo a ${mailOptions.to}:`, error);
    throw error;
  }
}
```

## 🔒 Seguridad

### **Protecciones Implementadas**

1. **Validación de entrada**: Sanitización de datos antes del envío
2. **Rate limiting**: Prevención de spam
3. **Logs de auditoría**: Registro de todos los envíos
4. **Manejo de errores**: No fallar operaciones principales si falla el correo

### **Buenas Prácticas**

1. **No almacenar contraseñas** en logs
2. **Usar variables de entorno** para credenciales
3. **Implementar retry logic** para envíos fallidos
4. **Monitorear métricas** de entrega

## 🚀 Despliegue en Producción

### **Vercel (Recomendado)**

1. **Configurar variables de entorno** en dashboard de Vercel
2. **Verificar configuración SMTP** en producción
3. **Monitorear logs** de despliegue
4. **Probar funcionalidad** en entorno de staging

### **Variables de Entorno en Vercel**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
FRONTEND_URL=https://tu-app.vercel.app
```

### **Monitoreo en Producción**

1. **Logs de Vercel**: Revisar función logs
2. **Métricas de entrega**: Monitorear tasa de éxito
3. **Alertas**: Configurar notificaciones de error
4. **Backup**: Plan de contingencia si falla el sistema

## 📚 Recursos Adicionales

### **Documentación Nodemailer**
- [Guía oficial](https://nodemailer.com/)
- [Configuración SMTP](https://nodemailer.com/smtp/)
- [Plantillas HTML](https://nodemailer.com/message/)

### **Documentación Node-Cron**
- [Sintaxis cron](https://github.com/node-cron/node-cron#cron-syntax)
- [Ejemplos de uso](https://github.com/node-cron/node-cron#examples)

### **Plantillas de Correo**
- [Mailchimp Templates](https://mailchimp.com/resources/email-template-gallery/)
- [Campaign Monitor](https://www.campaignmonitor.com/resources/templates/)

---

## 🎉 ¡Sistema de Correos Configurado!

El sistema de correos electrónicos de EasyClase está completamente implementado y listo para mejorar la experiencia de tus usuarios. 

**Próximos pasos:**
1. Configurar variables de entorno SMTP
2. Probar con el script de pruebas
3. Verificar envío de correos en desarrollo
4. Desplegar en producción
5. Monitorear métricas de entrega

¡Que tengas éxito con tu plataforma de aprendizaje! 🎓
