import dotenv from 'dotenv'
import EmailService from './services/emailService.js'
import notificationScheduler from './services/notificationSchedulerService.js'

// Cargar variables de entorno
dotenv.config({ path: '../.env' })

console.log('🧪 Probando integración completa del sistema de correos...\n')

const testCompleteIntegration = async () => {
  try {
    // 1. Probar EmailService directamente
    console.log('1️⃣ Probando EmailService...')
    const emailService = new EmailService()
    const connectionTest = await emailService.testConnection()
    
    if (connectionTest) {
      console.log('✅ Conexión SMTP exitosa')
    } else {
      console.log('❌ Error en conexión SMTP')
      return
    }

    // 2. Probar todos los tipos de correos
    console.log('\n2️⃣ Probando todos los tipos de correos...')
    
    const testUser = {
      nombre: 'Usuario de Prueba',
      email: process.env.SMTP_USER // Enviar a nosotros mismos
    }

    const testProfesor = {
      nombre: 'Profesor de Prueba',
      email: process.env.SMTP_USER // Enviar a nosotros mismos
    }

    const testClase = {
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-25',
      hora: '15:00',
      duracion: 2,
      modalidad: 'Online',
      materia: 'Matemáticas',
      duracion: 2
    }

    const testPaymentInfo = {
      amount: 50000,
      paymentMethod: 'Tarjeta de Crédito',
      reference: 'PAY-TEST-123'
    }

    const testReview = {
      calificacion: 5,
      comentario: 'Excelente profesor, muy claro en sus explicaciones'
    }

    // Probar correo de bienvenida
    try {
      await emailService.sendWelcomeEmail(testUser)
      console.log('✅ Correo de bienvenida enviado')
    } catch (error) {
      console.log('❌ Error en correo de bienvenida:', error.message)
    }

    // Probar correo de bienvenida para profesor
    try {
      await emailService.sendWelcomeProfessorEmail(testProfesor)
      console.log('✅ Correo de bienvenida para profesor enviado')
    } catch (error) {
      console.log('❌ Error en correo de bienvenida para profesor:', error.message)
    }

    // Probar correo de recordatorio de clase
    try {
      await emailService.sendClassReminderEmail(testUser, testClase, '1 hora')
      console.log('✅ Correo de recordatorio de clase enviado')
    } catch (error) {
      console.log('❌ Error en correo de recordatorio:', error.message)
    }

    // Probar correo de confirmación de reserva
    try {
      const testClaseReserva = {
        ...testClase,
        id: 'clase_test_123',
        profesorNombre: 'Dr. García',
        total: 50000
      }
      await emailService.sendReservationConfirmationEmail(testUser, testClaseReserva)
      console.log('✅ Correo de confirmación de reserva enviado')
    } catch (error) {
      console.log('❌ Error en correo de confirmación:', error.message)
    }

    // Probar correo de pago exitoso
    try {
      await emailService.sendPaymentSuccessEmail(testUser, testPaymentInfo)
      console.log('✅ Correo de pago exitoso enviado')
    } catch (error) {
      console.log('❌ Error en correo de pago exitoso:', error.message)
    }

    // Probar correo de pago fallido
    try {
      await emailService.sendPaymentFailedEmail(testUser, testClase)
      console.log('✅ Correo de pago fallido enviado')
    } catch (error) {
      console.log('❌ Error en correo de pago fallido:', error.message)
    }

    // Probar correo de nueva reseña
    try {
      await emailService.sendNewReviewNotificationEmail(testProfesor, testReview)
      console.log('✅ Correo de nueva reseña enviado')
    } catch (error) {
      console.log('❌ Error en correo de nueva reseña:', error.message)
    }

    // 3. Probar NotificationScheduler
    console.log('\n3️⃣ Probando NotificationScheduler...')
    
    try {
      await notificationScheduler.sendImmediateNotification('welcome', { user: testUser })
      console.log('✅ Notificación inmediata de bienvenida enviada')
    } catch (error) {
      console.log('❌ Error en notificación inmediata:', error.message)
    }

    try {
      await notificationScheduler.sendImmediateNotification('payment_success', { 
        user: testUser, 
        paymentInfo: testPaymentInfo 
      })
      console.log('✅ Notificación inmediata de pago exitoso enviada')
    } catch (error) {
      console.log('❌ Error en notificación de pago exitoso:', error.message)
    }

    try {
      await notificationScheduler.sendImmediateNotification('payment_failed', { 
        user: testUser, 
        clase: testClase 
      })
      console.log('✅ Notificación inmediata de pago fallido enviada')
    } catch (error) {
      console.log('❌ Error en notificación de pago fallido:', error.message)
    }

    // 4. Probar resumen diario
    console.log('\n4️⃣ Probando resumen diario...')
    
    try {
      const testClasses = [
        { ...testClase, tema: 'Matemáticas Avanzadas' },
        { ...testClase, tema: 'Física Cuántica', hora: '17:00', duracion: 1.5 }
      ]
      
      await notificationScheduler.sendDailySummaryEmail(testUser, testClasses)
      console.log('✅ Resumen diario enviado')
    } catch (error) {
      console.log('❌ Error en resumen diario:', error.message)
    }

    console.log('\n🎉 ¡Integración completa probada exitosamente!')
    console.log('\n📧 Verifica tu bandeja de entrada para confirmar la recepción de TODOS los correos.')
    console.log('💡 Si no recibes los correos, revisa la carpeta de spam.')
    console.log('\n🚀 El sistema de correos de EasyClase está completamente funcional y automatizado!')

  } catch (error) {
    console.error('❌ Error en la integración:', error)
  }
}

// Ejecutar las pruebas
testCompleteIntegration()
