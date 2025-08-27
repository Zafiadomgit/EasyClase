import cron from 'node-cron'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env' })
import EmailService from './emailService.js'
import Clase from '../models/Clase.js'
import User from '../models/User.js'

class NotificationSchedulerService {
  constructor() {
    this.isRunning = false
  }

  // Iniciar el programador de notificaciones
  start() {
    if (this.isRunning) {
      console.log('⚠️ El programador de notificaciones ya está ejecutándose')
      return
    }

    console.log('🚀 Iniciando programador de notificaciones...')

    // Programar recordatorios de clases (cada 5 minutos)
    cron.schedule('*/5 * * * *', () => {
      this.sendClassReminders()
    }, {
      scheduled: false
    }).start()

    // Programar recordatorios diarios (cada día a las 9:00 AM)
    cron.schedule('0 9 * * *', () => {
      this.sendDailyReminders()
    }, {
      scheduled: false
    }).start()

    // Programar limpieza de notificaciones antiguas (cada domingo a las 2:00 AM)
    cron.schedule('0 2 * * 0', () => {
      this.cleanupOldNotifications()
    }, {
      scheduled: false
    }).start()

    this.isRunning = true
    console.log('✅ Programador de notificaciones iniciado correctamente')
  }

  // Detener el programador
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ El programador de notificaciones no está ejecutándose')
      return
    }

    cron.getTasks().forEach(task => task.stop())
    this.isRunning = false
    console.log('🛑 Programador de notificaciones detenido')
  }

  // Enviar recordatorios de clases próximas
  async sendClassReminders() {
    try {
      console.log('📧 Enviando recordatorios de clases...')
      
      const now = new Date()
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const in1Hour = new Date(now.getTime() + 60 * 60 * 1000)
      const in10Minutes = new Date(now.getTime() + 10 * 60 * 1000)

      // Buscar clases que empiecen en las próximas 24 horas
      const upcomingClasses = await Clase.find({
        fecha: {
          $gte: now.toISOString().split('T')[0],
          $lte: in24Hours.toISOString().split('T')[0]
        },
        estado: 'confirmada'
      }).populate('estudiante profesor')

      for (const clase of upcomingClasses) {
        const classDateTime = new Date(`${clase.fecha}T${clase.hora}`)
        const timeDiff = classDateTime.getTime() - now.getTime()
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

        let shouldSendReminder = false
        let timeUntilClass = ''

        // Recordatorio 24 horas antes
        if (timeDiff > 23 * 60 * 60 * 1000 && timeDiff <= 24 * 60 * 60 * 1000) {
          shouldSendReminder = true
          timeUntilClass = '24 horas'
        }
        // Recordatorio 1 hora antes
        else if (timeDiff > 55 * 60 * 1000 && timeDiff <= 65 * 60 * 1000) {
          shouldSendReminder = true
          timeUntilClass = '1 hora'
        }
        // Recordatorio 10 minutos antes
        else if (timeDiff > 5 * 60 * 1000 && timeDiff <= 15 * 60 * 1000) {
          shouldSendReminder = true
          timeUntilClass = '10 minutos'
        }

        if (shouldSendReminder) {
          // Enviar recordatorio al estudiante
          if (clase.estudiante) {
            try {
              const emailService = new EmailService()
              await emailService.sendClassReminderEmail(
                clase.estudiante,
                clase,
                timeUntilClass
              )
              console.log(`✅ Recordatorio enviado a ${clase.estudiante.email} para clase ${clase.tema}`)
            } catch (error) {
              console.error(`❌ Error enviando recordatorio a estudiante:`, error)
            }
          }

          // Enviar recordatorio al profesor
          if (clase.profesor) {
            try {
              const emailService = new EmailService()
              await emailService.sendClassReminderEmail(
                clase.profesor,
                clase,
                timeUntilClass
              )
              console.log(`✅ Recordatorio enviado a ${clase.profesor.email} para clase ${clase.tema}`)
            } catch (error) {
              console.error(`❌ Error enviando recordatorio a profesor:`, error)
            }
          }
        }
      }

      console.log(`📧 Recordatorios procesados: ${upcomingClasses.length} clases`)
    } catch (error) {
      console.error('❌ Error en sendClassReminders:', error)
    }
  }

  // Enviar recordatorios diarios
  async sendDailyReminders() {
    try {
      console.log('📅 Enviando recordatorios diarios...')
      
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      
      // Buscar usuarios con clases programadas para mañana
      const tomorrowClasses = await Clase.find({
        fecha: tomorrow.toISOString().split('T')[0],
        estado: 'confirmada'
      }).populate('estudiante profesor')

      const usersWithClasses = new Set()
      
      tomorrowClasses.forEach(clase => {
        if (clase.estudiante) usersWithClasses.add(clase.estudiante._id.toString())
        if (clase.profesor) usersWithClasses.add(clase.profesor._id.toString())
      })

      // Enviar resumen diario a cada usuario
      for (const userId of usersWithClasses) {
        try {
          const user = await User.findById(userId)
          if (!user) continue

          const userClasses = tomorrowClasses.filter(clase => 
            clase.estudiante?._id.toString() === userId || 
            clase.profesor?._id.toString() === userId
          )

          await this.sendDailySummaryEmail(user, userClasses)
          console.log(`✅ Resumen diario enviado a ${user.email}`)
        } catch (error) {
          console.error(`❌ Error enviando resumen diario:`, error)
        }
      }

      console.log(`📅 Resúmenes diarios enviados: ${usersWithClasses.size} usuarios`)
    } catch (error) {
      console.error('❌ Error en sendDailyReminders:', error)
    }
  }

  // Enviar resumen diario de clases
  async sendDailySummaryEmail(user, classes) {
    const content = `
      <h2>📅 Resumen de Clases para Mañana</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Aquí tienes un resumen de tus clases programadas para mañana:</p>
      
      <div class="info-box">
        <h3>📚 Clases Programadas:</h3>
        ${classes.map(clase => `
          <div style="margin: 15px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <strong>${clase.tema}</strong><br>
            <small>🕐 ${clase.hora} • ⏱️ ${clase.duracion} horas</small><br>
            <small>👤 ${clase.estudiante ? 'Estudiante' : 'Profesor'}</small>
          </div>
        `).join('')}
      </div>

      <div class="highlight">
        <strong>💡 Recordatorio:</strong> Las videollamadas estarán disponibles 10 minutos antes de cada clase.
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Ver mi Dashboard
      </a>

      <p>¡Que tengas un excelente día de aprendizaje!</p>
      <p>El equipo de EasyClase</p>
    `

    const emailService = new EmailService()
    const mailOptions = {
      from: `"EasyClase" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: '📅 Resumen de Clases para Mañana - EasyClase',
      html: emailService.getBaseTemplate(content, 'Resumen Diario')
    }

    return emailService.transporter.sendMail(mailOptions)
  }

  // Limpiar notificaciones antiguas
  async cleanupOldNotifications() {
    try {
      console.log('🧹 Limpiando notificaciones antiguas...')
      
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      // Aquí podrías limpiar logs de notificaciones, historial de emails, etc.
      // Por ahora solo registramos la limpieza
      
      console.log('✅ Limpieza de notificaciones completada')
    } catch (error) {
      console.error('❌ Error en cleanupOldNotifications:', error)
    }
  }

  // Enviar notificación inmediata (para eventos en tiempo real)
  async sendImmediateNotification(type, data) {
    try {
      const emailService = new EmailService()
      
      switch (type) {
        case 'welcome':
          await emailService.sendWelcomeEmail(data.user)
          break
        case 'welcome_professor':
          await emailService.sendWelcomeProfessorEmail(data.profesor)
          break
        case 'login_notification':
          await emailService.sendLoginNotificationEmail(data.user, data.loginInfo)
          break
        case 'reservation_confirmation':
          await emailService.sendReservationConfirmationEmail(data.user, data.clase)
          break
        case 'payment_success':
          await emailService.sendPaymentSuccessEmail(data.user, data.paymentInfo)
          break
        case 'payment_failed':
          await emailService.sendPaymentFailedEmail(data.user, data.clase)
          break
        case 'class_cancellation':
          await emailService.sendClassCancellationEmail(data.user, data.clase, data.reason)
          break
        case 'new_review':
          await emailService.sendNewReviewNotificationEmail(data.profesor, data.review)
          break
        case 'dispute_notification':
          await emailService.sendDisputeNotificationEmail(data.user, data.dispute)
          break
        case 'password_reset':
          await emailService.sendPasswordResetEmail(data.user, data.resetToken)
          break
        case 'class_reminder':
          await emailService.sendClassReminderEmail(data.user, data.clase, data.timeUntilClass)
          break
        default:
          console.warn(`⚠️ Tipo de notificación no reconocido: ${type}`)
      }
    } catch (error) {
      console.error(`❌ Error enviando notificación ${type}:`, error)
      throw error
    }
  }

  // Obtener estado del programador
  getStatus() {
    try {
      const tasks = cron.getTasks()
      const taskArray = Array.from(tasks.values()).map(task => ({
        name: task.name || 'Sin nombre',
        running: task.running,
        nextRun: task.nextDate()
      }))
      
      return {
        isRunning: this.isRunning,
        tasks: taskArray
      }
    } catch (error) {
      return {
        isRunning: this.isRunning,
        tasks: [],
        error: error.message
      }
    }
  }
}

export default new NotificationSchedulerService()
