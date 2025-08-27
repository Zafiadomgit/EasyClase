import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })

class EmailService {
  constructor() {
    // Asegurar que las variables de entorno estén cargadas
    dotenv.config({ path: '../../.env' })
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  // Plantilla base HTML
  getBaseTemplate(content, title = 'EasyClase') {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .content {
            padding: 40px 30px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
          }
          .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
          .info-box {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 EasyClase</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© 2024 EasyClase. Todos los derechos reservados.</p>
            <p>Si tienes alguna pregunta, contáctanos en soporte@easyclase.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Correo de bienvenida para nuevos usuarios
  async sendWelcomeEmail(user) {
    const content = `
      <h2>¡Bienvenido a EasyClase! 🎉</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>¡Nos alegra que te hayas unido a nuestra plataforma de aprendizaje!</p>
      
      <div class="info-box">
        <h3>🚀 ¿Qué puedes hacer ahora?</h3>
        <ul>
          <li>Explorar clases disponibles</li>
          <li>Conectar con profesores expertos</li>
          <li>Reservar clases particulares</li>
          <li>Gestionar tu perfil de aprendizaje</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>💡 Consejo:</strong> Completa tu perfil para obtener recomendaciones personalizadas de clases.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Ir a mi Dashboard
      </a>

      <p>¡Que tengas un excelente día de aprendizaje!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: '¡Bienvenido a EasyClase! 🎓',
      html: this.getBaseTemplate(content, 'Bienvenido a EasyClase')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de bienvenida para nuevos profesores
  async sendWelcomeProfessorEmail(profesor) {
    const content = `
      <h2>¡Bienvenido como Profesor a EasyClase! 👨‍🏫</h2>
      <p>Hola <strong>${profesor.nombre}</strong>,</p>
      <p>¡Felicitaciones! Ahora eres parte de nuestra comunidad de educadores.</p>
      
      <div class="info-box">
        <h3>🎯 Próximos pasos:</h3>
        <ul>
          <li>Completa tu perfil de profesor</li>
          <li>Define tu disponibilidad horaria</li>
          <li>Crea tus primeros servicios</li>
          <li>Conecta con estudiantes</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>💼 Perfil Profesional:</strong> Un perfil completo aumenta tus posibilidades de ser seleccionado por estudiantes.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/profesor/disponibilidad" class="btn">
        Configurar Disponibilidad
      </a>

      <p>¡Gracias por compartir tu conocimiento con nuestra comunidad!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: profesor.email,
      subject: '¡Bienvenido como Profesor a EasyClase! 👨‍🏫',
      html: this.getBaseTemplate(content, 'Bienvenido Profesor')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de notificación de login exitoso
  async sendLoginNotificationEmail(user, loginInfo) {
    const content = `
      <h2>Nuevo Inicio de Sesión 🔐</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Se ha detectado un nuevo inicio de sesión en tu cuenta de EasyClase.</p>
      
      <div class="info-box">
        <h3>📱 Información del acceso:</h3>
        <ul>
          <li><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-ES')}</li>
          <li><strong>Dispositivo:</strong> ${loginInfo.device || 'No especificado'}</li>
          <li><strong>Ubicación:</strong> ${loginInfo.location || 'No especificada'}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>⚠️ Si no fuiste tú:</strong> Cambia tu contraseña inmediatamente y contacta con soporte.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seguridad" class="btn">
        Revisar Seguridad
      </a>

      <p>¡Gracias por mantener tu cuenta segura!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Nuevo Inicio de Sesión - EasyClase 🔐',
      html: this.getBaseTemplate(content, 'Notificación de Seguridad')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de recordatorio de clase
  async sendClassReminderEmail(user, clase, timeUntilClass) {
    const content = `
      <h2>Recordatorio de Clase ⏰</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Tienes una clase programada muy pronto.</p>
      
      <div class="info-box">
        <h3>📚 Detalles de la clase:</h3>
        <ul>
          <li><strong>Tema:</strong> ${clase.tema}</li>
          <li><strong>Fecha:</strong> ${new Date(clase.fecha).toLocaleDateString('es-ES')}</li>
          <li><strong>Hora:</strong> ${clase.hora}</li>
          <li><strong>Duración:</strong> ${clase.duracion} horas</li>
          <li><strong>Modalidad:</strong> ${clase.modalidad || 'Online'}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>⏰ Tiempo restante:</strong> ${timeUntilClass}
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/clase/${clase.id}" class="btn">
        Ver Detalles de la Clase
      </a>

      <p><strong>💡 Recordatorio:</strong> La videollamada estará disponible 10 minutos antes del inicio.</p>
      <p>¡Que tengas una excelente clase!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Recordatorio: Clase de ${clase.tema} en ${timeUntilClass} ⏰`,
      html: this.getBaseTemplate(content, 'Recordatorio de Clase')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de confirmación de reserva
  async sendReservationConfirmationEmail(user, clase) {
    const content = `
      <h2>¡Reserva Confirmada! ✅</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Tu reserva de clase ha sido confirmada exitosamente.</p>
      
      <div class="info-box">
        <h3>📋 Resumen de la reserva:</h3>
        <ul>
          <li><strong>Tema:</strong> ${clase.tema}</li>
          <li><strong>Profesor:</strong> ${clase.profesorNombre}</li>
          <li><strong>Fecha:</strong> ${new Date(clase.fecha).toLocaleDateString('es-ES')}</li>
          <li><strong>Hora:</strong> ${clase.hora}</li>
          <li><strong>Duración:</strong> ${clase.duracion} horas</li>
          <li><strong>Precio:</strong> $${clase.total}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>📱 Próximos pasos:</strong> Recibirás un recordatorio 24 horas antes de la clase.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/clase/${clase.id}" class="btn">
        Ver Detalles de la Clase
      </a>

      <p>¡Nos vemos en la clase!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Reserva Confirmada: ${clase.tema} ✅`,
      html: this.getBaseTemplate(content, 'Reserva Confirmada')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de notificación de pago exitoso
  async sendPaymentSuccessEmail(user, paymentInfo) {
    const content = `
      <h2>¡Pago Exitoso! 💳✅</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Tu pago ha sido procesado exitosamente.</p>
      
      <div class="info-box">
        <h3>💰 Detalles del pago:</h3>
        <ul>
          <li><strong>Monto:</strong> $${paymentInfo.amount}</li>
          <li><strong>Método:</strong> ${paymentInfo.paymentMethod}</li>
          <li><strong>Referencia:</strong> ${paymentInfo.reference}</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>📧 Recibido:</strong> Recibirás un correo de confirmación de reserva en breve.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Ir a mi Dashboard
      </a>

      <p>¡Gracias por confiar en EasyClase!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Pago Exitoso - EasyClase 💳✅',
      html: this.getBaseTemplate(content, 'Pago Exitoso')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de pago fallido
  async sendPaymentFailedEmail(user, clase) {
    const content = `
      <h2>❌ Pago Fallido - EasyClase</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Tu pago no pudo ser procesado correctamente.</p>
      
      <div class="info-box">
        <h3>📚 Detalles de la clase:</h3>
        <ul>
          <li><strong>Materia:</strong> ${clase.materia}</li>
          <li><strong>Duración:</strong> ${clase.duracion} horas</li>
          <li><strong>Modalidad:</strong> ${clase.modalidad}</li>
          <li><strong>Fecha:</strong> ${clase.fecha}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>💡 ¿Qué puedes hacer?</strong>
        <ul>
          <li>Verificar que tu método de pago esté activo</li>
          <li>Intentar nuevamente con otro método de pago</li>
          <li>Contactar a soporte si el problema persiste</li>
        </ul>
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Intentar Nuevamente
      </a>

      <p>Si tienes alguna pregunta, contáctanos en soporte@easyclase.com</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: '❌ Pago Fallido - EasyClase',
      html: this.getBaseTemplate(content, 'Pago Fallido')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de notificación de clase cancelada
  async sendClassCancellationEmail(user, clase, reason) {
    const content = `
      <h2>Clase Cancelada ❌</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Lamentamos informarte que tu clase ha sido cancelada.</p>
      
      <div class="info-box">
        <h3>📚 Clase cancelada:</h3>
        <ul>
          <li><strong>Tema:</strong> ${clase.tema}</li>
          <li><strong>Fecha:</strong> ${new Date(clase.fecha).toLocaleDateString('es-ES')}</li>
          <li><strong>Hora:</strong> ${clase.hora}</li>
          <li><strong>Motivo:</strong> ${reason}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>💡 Alternativas:</strong> Puedes buscar otras clases disponibles o reprogramar con el mismo profesor.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buscar" class="btn">
        Buscar Otras Clases
      </a>

      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Clase Cancelada: ${clase.tema} ❌`,
      html: this.getBaseTemplate(content, 'Clase Cancelada')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de notificación de nueva review
  async sendNewReviewNotificationEmail(profesor, review) {
    const content = `
      <h2>¡Nueva Reseña Recibida! ⭐</h2>
      <p>Hola <strong>${profesor.nombre}</strong>,</p>
      <p>Has recibido una nueva reseña de un estudiante.</p>
      
      <div class="info-box">
        <h3>📝 Detalles de la reseña:</h3>
        <ul>
          <li><strong>Calificación:</strong> ${'⭐'.repeat(review.calificacion)}</li>
          <li><strong>Comentario:</strong> "${review.comentario}"</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>🎯 Importante:</strong> Las reseñas ayudan a otros estudiantes a conocerte mejor.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/perfil" class="btn">
        Ver mi Perfil
      </a>

      <p>¡Sigue así, estás haciendo un excelente trabajo!</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: profesor.email,
      subject: '¡Nueva Reseña Recibida! ⭐',
      html: this.getBaseTemplate(content, 'Nueva Reseña')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de notificación de disputa
  async sendDisputeNotificationEmail(user, dispute) {
    const content = `
      <h2>Notificación de Disputa ⚠️</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Se ha abierto una disputa relacionada con tu cuenta.</p>
      
      <div class="info-box">
        <h3>📋 Detalles de la disputa:</h3>
        <ul>
          <li><strong>ID de disputa:</strong> ${dispute.id}</li>
          <li><strong>Tipo:</strong> ${dispute.tipo}</li>
          <li><strong>Estado:</strong> ${dispute.estado}</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</li>
        </ul>
      </div>

      <div class="highlight">
        <strong>🔍 Acción requerida:</strong> Revisa los detalles y proporciona la información solicitada.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Revisar Disputa
      </a>

      <p>Nuestro equipo de soporte está aquí para ayudarte.</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Notificación de Disputa - EasyClase ⚠️',
      html: this.getBaseTemplate(content, 'Notificación de Disputa')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Correo de recuperación de contraseña
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    const content = `
      <h2>Recuperación de Contraseña 🔑</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Has solicitado restablecer tu contraseña.</p>
      
      <div class="highlight">
        <strong>⚠️ Importante:</strong> Este enlace expira en 1 hora por seguridad.
      </div>

      <a href="${resetUrl}" class="btn">
        Restablecer Contraseña
      </a>

      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>El equipo de EasyClase</p>
    `

    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Recuperación de Contraseña - EasyClase 🔑',
      html: this.getBaseTemplate(content, 'Recuperación de Contraseña')
    }

    return this.transporter.sendMail(mailOptions)
  }

  // Método para probar la conexión SMTP
  async testConnection() {
    try {
      // Recargar variables de entorno y crear un nuevo transporter
      dotenv.config({ path: '../../.env' })
      
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
      
      await testTransporter.verify()
      return true
    } catch (error) {
      console.error('❌ Error en conexión SMTP:', error)
      return false
    }
  }
}

// Exportar la clase en lugar de una instancia
export default EmailService
