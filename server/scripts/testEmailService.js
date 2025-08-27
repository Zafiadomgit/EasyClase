import dotenv from 'dotenv'

// Cargar variables de entorno ANTES de importar los servicios
dotenv.config({ path: '../.env' })

import EmailService from '../services/emailService.js'
import notificationScheduler from '../services/notificationSchedulerService.js'

// Crear una nueva instancia del EmailService
const emailService = new EmailService()

// Verificar que se creó correctamente
console.log('🔍 Verificando EmailService:')
console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS:', process.env.SMTP_PASS)

const testEmailService = async () => {
  console.log('🧪 Iniciando pruebas del servicio de correos...\n')

  try {
    // 1. Probar conexión SMTP
    console.log('1️⃣ Probando conexión SMTP...')
    const connectionTest = await emailService.testConnection()
    if (connectionTest) {
      console.log('✅ Conexión SMTP exitosa\n')
    } else {
      console.log('❌ Error en conexión SMTP\n')
      return
    }

    // 2. Probar envío de correo de bienvenida
    console.log('2️⃣ Probando correo de bienvenida...')
    const testUser = {
      nombre: 'Usuario de Prueba',
      email: process.env.TEST_EMAIL || 'test@example.com'
    }
    
    try {
      await emailService.sendWelcomeEmail(testUser)
      console.log('✅ Correo de bienvenida enviado exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando correo de bienvenida:', error.message, '\n')
    }

    // 3. Probar correo de bienvenida para profesor
    console.log('3️⃣ Probando correo de bienvenida para profesor...')
    const testProfesor = {
      nombre: 'Profesor de Prueba',
      email: process.env.TEST_EMAIL || 'test@example.com'
    }
    
    try {
      await emailService.sendWelcomeProfessorEmail(testProfesor)
      console.log('✅ Correo de bienvenida para profesor enviado exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando correo de bienvenida para profesor:', error.message, '\n')
    }

    // 4. Probar correo de recordatorio de clase
    console.log('4️⃣ Probando correo de recordatorio de clase...')
    const testClase = {
      tema: 'Matemáticas Avanzadas',
      fecha: '2024-12-25',
      hora: '15:00',
      duracion: 2,
      modalidad: 'Online'
    }
    
    try {
      await emailService.sendClassReminderEmail(testUser, testClase, '1 hora')
      console.log('✅ Correo de recordatorio de clase enviado exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando correo de recordatorio:', error.message, '\n')
    }

    // 5. Probar correo de confirmación de reserva
    console.log('5️⃣ Probando correo de confirmación de reserva...')
    const testClaseReserva = {
      ...testClase,
      id: 'clase_test_123',
      profesorNombre: 'Dr. García',
      total: 50000
    }
    
    try {
      await emailService.sendReservationConfirmationEmail(testUser, testClaseReserva)
      console.log('✅ Correo de confirmación de reserva enviado exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando correo de confirmación:', error.message, '\n')
    }

    // 6. Probar correo de pago exitoso
    console.log('6️⃣ Probando correo de pago exitoso...')
    const testPaymentInfo = {
      amount: 50000,
      paymentMethod: 'Tarjeta de Crédito',
      reference: 'PAY-123456789'
    }
    
    try {
      await emailService.sendPaymentSuccessEmail(testUser, testPaymentInfo)
      console.log('✅ Correo de pago exitoso enviado exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando correo de pago:', error.message, '\n')
    }

    // 7. Probar notificaciones programadas
    console.log('7️⃣ Probando notificaciones programadas...')
    try {
      await notificationScheduler.sendImmediateNotification('welcome', { user: testUser })
      console.log('✅ Notificación inmediata enviada exitosamente\n')
    } catch (error) {
      console.log('❌ Error enviando notificación inmediata:', error.message, '\n')
    }

    console.log('🎉 Todas las pruebas completadas!')
    console.log('\n📧 Verifica tu bandeja de entrada para confirmar la recepción de los correos.')
    console.log('💡 Si no recibes los correos, revisa la carpeta de spam.')

  } catch (error) {
    console.error('❌ Error general en las pruebas:', error)
  }
}

// Ejecutar las pruebas
testEmailService()
