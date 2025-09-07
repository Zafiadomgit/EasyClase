import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, CreditCard, Lock, CheckCircle, Calendar, Clock, User, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { formatPrecio } from '../utils/currencyUtils'

const PagoFuncional = () => {
  console.log('🚀 PagoFuncional.jsx - Componente iniciado')
  
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [reserva, setReserva] = useState(null)
  const [profesor, setProfesor] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [pagoExitoso, setPagoExitoso] = useState(false)
  const [metodoPago, setMetodoPago] = useState('mercadopago')

  // DATOS DE PRUEBA INMEDIATOS - SIEMPRE DISPONIBLES
  const reservaPrueba = {
    profesorId: 2,
    fecha: '2025-09-08',
    hora: '07:30',
    tipoAgenda: 'individual',
    precio: 45000,
    profesorNombre: 'Ana Rodríguez'
  }
  
  const profesorPrueba = {
    id: 2,
    nombre: 'Ana Rodríguez',
    precioHora: 45000,
    especialidad: 'Desarrollo Web'
  }

  useEffect(() => {
    console.log('PagoFuncional.jsx - useEffect iniciado')
    
    // SIEMPRE establecer datos de prueba inmediatamente
    console.log('PagoFuncional.jsx - Estableciendo datos de prueba')
    setReserva(reservaPrueba)
    setProfesor(profesorPrueba)
    console.log('PagoFuncional.jsx - Datos de prueba establecidos:', reservaPrueba, profesorPrueba)

    // Intentar cargar datos reales de localStorage
    const cargarDatosReales = () => {
      console.log('PagoFuncional.jsx - Buscando reservaPendiente en localStorage')
      const reservaData = localStorage.getItem('reservaPendiente')
      console.log('PagoFuncional.jsx - Datos raw de localStorage:', reservaData)
      
      if (reservaData) {
        try {
          const reservaReal = JSON.parse(reservaData)
          console.log('PagoFuncional.jsx - Reserva real encontrada:', reservaReal)
          setReserva(reservaReal)
          
          // Crear objeto profesor con los datos disponibles
          setProfesor({
            id: reservaReal.profesorId,
            nombre: reservaReal.profesorNombre,
            precioHora: reservaReal.precio,
            especialidad: 'Desarrollo Web'
          })
          console.log('PagoFuncional.jsx - Datos reales establecidos')
        } catch (error) {
          console.error('Error al parsear datos de reserva:', error)
        }
      }
    }

    // Cargar datos reales si existen
    cargarDatosReales()

    // Listener para detectar cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'reservaPendiente' && e.newValue) {
        console.log('PagoFuncional.jsx - Detectado cambio en localStorage, recargando datos')
        cargarDatosReales()
      }
    }

    // Agregar listener
    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handlePago = async (e) => {
    e.preventDefault()
    setProcesando(true)
    setError('')

    try {
      console.log('PagoFuncional.jsx - Iniciando proceso de pago')
      
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Guardar datos de la reserva
      const reservaData = {
        profesor: profesor,
        tema: 'Clase de Programación',
        fecha: reserva.fecha,
        hora: reserva.hora,
        duracion: 60,
        costo: reserva.precio,
        tipoAgenda: reserva.tipoAgenda
      }
      
      localStorage.setItem('reserva_pendiente', JSON.stringify(reservaData))
      
      setPagoExitoso(true)
      console.log('PagoFuncional.jsx - Pago simulado exitoso')
      
      setTimeout(() => {
        navigate('/pago/success?payment_id=TEST_123&status=approved&external_reference=test_ref')
      }, 3000)

    } catch (err) {
      console.error('PagoFuncional.jsx - Error en pago:', err)
      setError(err.message)
    } finally {
      setProcesando(false)
    }
  }

  // SIEMPRE mostrar algo, nunca página en blanco
  console.log('🎯 PagoFuncional.jsx - Renderizando, reserva:', reserva, 'profesor:', profesor)
  
  // Usar datos de prueba si no hay datos reales
  const reservaActual = reserva || reservaPrueba
  const profesorActual = profesor || profesorPrueba
  
  console.log('🎯 PagoFuncional.jsx - Usando datos:', reservaActual, profesorActual)

  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">¡Pago Exitoso!</h2>
          <p className="text-secondary-600 mb-6">
            Tu clase con {profesorActual.nombre} ha sido reservada exitosamente. Recibirás un email con los detalles.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Recuerda:</strong> Tu dinero se mantendrá seguro hasta que confirmes que recibiste la clase.
            </p>
          </div>
          <p className="text-sm text-secondary-500">Redirigiendo a confirmación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pago-page bg-secondary-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Completar Pago</h1>
          <p className="text-secondary-600">Tu dinero estará protegido hasta que confirmes la clase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulario de Pago */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Método de Pago
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handlePago} className="space-y-6">
              
              {/* Selección de método */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-3">
                  Selecciona tu método de pago
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="mercadopago"
                      checked={metodoPago === 'mercadopago'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <div className="w-5 h-5 mr-2 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MP</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">MercadoPago</span>
                      <p className="text-sm text-secondary-600">Pago seguro con tarjetas, efectivo y más</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-secondary-400" />
                  </label>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={procesando}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {procesando ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pagar {formatPrecio(reservaActual.precio)} con MercadoPago
                  </>
                )}
              </button>
            </form>

            {/* Seguridad */}
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <div className="flex items-center text-sm text-secondary-600">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>Pago 100% seguro con encriptación SSL</span>
              </div>
            </div>
          </div>

          {/* Resumen de la Reserva */}
          <div className="space-y-6">
            
            {/* Detalles de la clase */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Detalles de tu clase</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-secondary-900">{profesorActual.nombre}</p>
                    <p className="text-secondary-600">{profesorActual.especialidad}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-secondary-900">
                      {new Date(reservaActual.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-secondary-600">Fecha de la clase</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-secondary-900">
                      {reservaActual.hora} - 1 hora
                    </p>
                    <p className="text-secondary-600">Horario</p>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-xl p-4">
                  <p className="font-semibold text-secondary-900 mb-1">Tema a aprender:</p>
                  <p className="text-secondary-700">Clase de Programación</p>
                </div>
              </div>
            </div>

            {/* Desglose del costo */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Desglose del pago</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tarifa por hora:</span>
                  <span className="font-semibold">{formatPrecio(profesorActual.precioHora)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Duración:</span>
                  <span className="font-semibold">1 hora</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrecio(reservaActual.precio)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Comisión de plataforma:</span>
                  <span className="font-semibold">Incluida en el precio</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold text-primary-600">
                  <span>Total a pagar:</span>
                  <span>{formatPrecio(reservaActual.precio)}</span>
                </div>
              </div>
            </div>

            {/* Garantía */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Garantía de satisfacción
              </h3>
              
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tu dinero se libera solo cuando confirmes que recibiste la clase</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Reembolso completo si el profesor no se presenta</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Soporte 24/7 para resolver cualquier problema</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoFuncional
