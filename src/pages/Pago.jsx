import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Shield, CreditCard, Lock, CheckCircle, AlertCircle, Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Pago = () => {
  const { profesorId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [reserva, setReserva] = useState(null)
  const [profesor, setProfesor] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [pagoExitoso, setPagoExitoso] = useState(false)

  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [datosTargeta, setDatosTargeta] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: ''
  })

  // Función para formatear precios
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  useEffect(() => {
    // Obtener datos de la reserva desde el state de navegación
    if (location.state && location.state.reserva && location.state.profesor) {
      setReserva(location.state.reserva)
      setProfesor(location.state.profesor)
    } else {
      // Si no hay datos, redirigir de vuelta
      navigate('/buscar')
    }
  }, [location.state, navigate])

  const handlePago = async (e) => {
    e.preventDefault()
    setProcesando(true)
    setError('')

    try {
      // Validar datos de tarjeta
      if (metodoPago === 'tarjeta') {
        if (!datosTargeta.numero || !datosTargeta.nombre || !datosTargeta.expiracion || !datosTargeta.cvv) {
          throw new Error('Por favor completa todos los datos de la tarjeta')
        }
      }

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Crear el pago en el backend
      const pagoData = {
        reservaId: reserva.id || Date.now(), // En producción vendría del backend
        estudianteId: user.id,
        profesorId: profesor.id,
        monto: reserva.costo,
        metodoPago: metodoPago,
        estado: 'completado',
        fecha: new Date().toISOString()
      }

      console.log('Pago procesado:', pagoData)

      // Marcar como exitoso
      setPagoExitoso(true)

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            mensaje: 'Pago realizado exitosamente. Tu clase ha sido reservada.' 
          }
        })
      }, 3000)

    } catch (err) {
      setError(err.message)
    } finally {
      setProcesando(false)
    }
  }

  const handleTargetaChange = (e) => {
    let value = e.target.value
    const name = e.target.name

    // Formatear número de tarjeta
    if (name === 'numero') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      value = value.substring(0, 19) // Limitar a 16 dígitos + espacios
    }

    // Formatear fecha de expiración
    if (name === 'expiracion') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5)
    }

    // Limitar CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4)
    }

    setDatosTargeta({
      ...datosTargeta,
      [name]: value
    })
  }

  if (!reserva || !profesor) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Error en la reserva</h2>
          <p className="text-secondary-600 mb-4">No se encontraron los datos de la reserva.</p>
          <button
            onClick={() => navigate('/buscar')}
            className="btn-primary"
          >
            Volver a buscar
          </button>
        </div>
      </div>
    )
  }

  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">¡Pago Exitoso!</h2>
          <p className="text-secondary-600 mb-6">
            Tu clase con {profesor.nombre} ha sido reservada exitosamente. Recibirás un email con los detalles.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">
              <strong>Recuerda:</strong> Tu dinero se mantendrá seguro hasta que confirmes que recibiste la clase.
            </p>
          </div>
          <p className="text-sm text-secondary-500">Redirigiendo a tu dashboard...</p>
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
                      value="tarjeta"
                      checked={metodoPago === 'tarjeta'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-secondary-600" />
                    <span className="font-medium">Tarjeta de Crédito/Débito</span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="mercadopago"
                      checked={metodoPago === 'mercadopago'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="mr-3"
                    />
                    <div className="w-5 h-5 mr-2 bg-blue-500 rounded"></div>
                    <span className="font-medium">MercadoPago</span>
                  </label>
                </div>
              </div>

              {/* Datos de tarjeta */}
              {metodoPago === 'tarjeta' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Número de tarjeta *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={datosTargeta.numero}
                      onChange={handleTargetaChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Nombre del titular *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={datosTargeta.nombre}
                      onChange={handleTargetaChange}
                      placeholder="Nombre como aparece en la tarjeta"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Expiración *
                      </label>
                      <input
                        type="text"
                        name="expiracion"
                        value={datosTargeta.expiracion}
                        onChange={handleTargetaChange}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={datosTargeta.cvv}
                        onChange={handleTargetaChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    Pagar {formatPrecio(reserva.costo)} de forma segura
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
                    <p className="font-semibold text-secondary-900">{profesor.nombre}</p>
                    <p className="text-secondary-600">{profesor.especialidad}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-secondary-900">
                      {new Date(reserva.fecha).toLocaleDateString('es-ES', {
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
                      {reserva.hora} - {reserva.duracion} hora(s)
                    </p>
                    <p className="text-secondary-600">Horario</p>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-xl p-4">
                  <p className="font-semibold text-secondary-900 mb-1">Tema a aprender:</p>
                  <p className="text-secondary-700">{reserva.tema}</p>
                  {reserva.notas && (
                    <>
                      <p className="font-semibold text-secondary-900 mt-3 mb-1">Notas adicionales:</p>
                      <p className="text-secondary-700">{reserva.notas}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desglose del costo */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Desglose del pago</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tarifa por hora:</span>
                  <span className="font-semibold">{formatPrecio(profesor.tarifa)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Duración:</span>
                  <span className="font-semibold">{reserva.duracion} hora(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrecio(reserva.costo)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Comisión de plataforma:</span>
                  <span className="font-semibold">$0 (gratis por tiempo limitado)</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold text-primary-600">
                  <span>Total a pagar:</span>
                  <span>{formatPrecio(reserva.costo)}</span>
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

export default Pago
