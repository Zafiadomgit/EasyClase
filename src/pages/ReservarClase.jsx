import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, DollarSign, Shield, Calendar, User, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ChatModal from '../components/Chat/ChatModal'
import { formatPrecio, formatPrecioPorHora } from '../utils/currencyUtils'

const ReservarClase = () => {
  const { profesorId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [profesor, setProfesor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reservando, setReservando] = useState(false)
  const [error, setError] = useState('')
  const [showChat, setShowChat] = useState(false)

  const [reservaData, setReservaData] = useState({
    fecha: '',
    hora: '',
    duracion: 1,
    tema: '',
    notas: ''
  })

  const horasDisponibles = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ]



  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: { pathname: `/reservar/${profesorId}` } }
      })
      return
    }

    // Cargar datos del profesor
    cargarProfesor()
  }, [profesorId, isAuthenticated])

  const cargarProfesor = async () => {
    try {
      setLoading(true)
      // Simular carga de datos del profesor
      // En la implementación real, esto vendría de la API
      const profesorData = {
        id: profesorId,
        nombre: 'María González',
        especialidad: 'Excel Avanzado',
        rating: 4.9,
        reviews: 127,
        tarifa: 35000,
        precioPorHora: 35000, // Agregar para consistencia
        experiencia: '5 años',
        descripcion: 'Especialista en Excel con certificación Microsoft. He ayudado a más de 500 profesionales a dominar las herramientas avanzadas de Excel.',
        foto: '/api/placeholder/150/150',
        disponibilidad: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
        certificaciones: ['Microsoft Excel Expert', 'Google Workspace'],
        idiomas: ['Español', 'Inglés']
      }
      
      console.log('🔍 ReservarClase: Profesor cargado:', profesorData)
      
      setProfesor(profesorData)
    } catch (err) {
      setError('Error al cargar los datos del profesor')
    } finally {
      setLoading(false)
    }
  }

  const handleReserva = async (e) => {
    e.preventDefault()
    setReservando(true)
    setError('')

    try {
      // Validar datos
      if (!reservaData.fecha || !reservaData.hora || !reservaData.tema) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      // Calcular costo total
      const costoTotal = profesor.tarifa * reservaData.duracion
      
      console.log('🔍 ReservarClase: Cálculo del costo:')
      console.log('  - Tarifa por hora:', profesor.tarifa)
      console.log('  - Duración seleccionada:', reservaData.duracion)
      console.log('  - Cálculo:', `${profesor.tarifa} × ${reservaData.duracion} = ${costoTotal}`)
      console.log('  - Tipo de datos - Tarifa:', typeof profesor.tarifa, 'Duración:', typeof reservaData.duracion)

      // Crear reserva
      const reserva = {
        profesorId: profesor.id,
        estudianteId: user.id,
        fecha: reservaData.fecha,
        hora: reservaData.hora,
        duracion: reservaData.duracion,
        tema: reservaData.tema,
        notas: reservaData.notas,
        costo: costoTotal,
        estado: 'pendiente'
      }

      // Aquí se enviaría a la API
      console.log('🔍 ReservarClase: Creando reserva:', reserva)
      console.log('🔍 ReservarClase: Duración:', reserva.duracion)
      console.log('🔍 ReservarClase: Costo total:', reserva.costo)
      console.log('🔍 ReservarClase: Tarifa por hora:', profesor.tarifa)

      // Redirigir al pago
      console.log('🔍 ReservarClase: Navegando a pago con state:', { reserva, profesor })
      navigate('/pago', { 
        state: { 
          reserva,
          profesor: profesor
        }
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setReservando(false)
    }
  }

  const handleChange = (e) => {
    setReservaData({
      ...reservaData,
      [e.target.name]: e.target.value
    })
  }

  const handleSendMessage = async (message) => {
    try {
      // Aquí se implementaría el envío real del mensaje a la API
      console.log('Mensaje enviado:', message)
      // Por ahora solo simulamos el envío exitoso
      return Promise.resolve()
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando información del profesor...</p>
        </div>
      </div>
    )
  }

  if (!profesor) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Profesor no encontrado</h2>
          <p className="text-secondary-600 mb-4">El profesor que buscas no existe o no está disponible.</p>
          <button
            onClick={() => navigate('/buscar')}
            className="btn-primary"
          >
            Buscar otros profesores
          </button>
        </div>
      </div>
    )
  }

  const costoTotal = profesor.tarifa * reservaData.duracion
  
  console.log('🔍 ReservarClase: Resumen renderizado:')
  console.log('  - Profesor:', profesor.nombre)
  console.log('  - Tarifa:', profesor.tarifa)
  console.log('  - Duración:', reservaData.duracion)
  console.log('  - Costo total:', costoTotal)

  return (
    <div className="reservar-clase-page bg-secondary-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">{profesor.nombre}</h1>
              <p className="text-xl text-primary-600 font-semibold mb-2">{profesor.especialidad}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{profesor.rating}</span>
                  <span className="ml-1">({profesor.reviews} reseñas)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{profesor.experiencia} de experiencia</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{formatPrecioPorHora(profesor.tarifa)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de Reserva */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Reservar Clase</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleReserva} className="space-y-6">
                
                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Fecha de la clase *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={reservaData.fecha}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-secondary-700 mb-2">
                      Hora de inicio *
                    </label>
                    <select
                      name="hora"
                      value={reservaData.hora}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    >
                      <option value="">Selecciona una hora</option>
                      {horasDisponibles.map((hora) => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Duración (horas) *
                  </label>
                  <select
                    name="duracion"
                    value={reservaData.duracion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value={1}>1 hora</option>
                    <option value={2}>2 horas</option>
                    <option value={3}>3 horas</option>
                    <option value={4}>4 horas</option>
                  </select>
                </div>

                {/* Tema */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    ¿Qué quieres aprender? *
                  </label>
                  <input
                    type="text"
                    name="tema"
                    value={reservaData.tema}
                    onChange={handleChange}
                    placeholder="Ej: Tablas dinámicas en Excel, Funciones avanzadas, etc."
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>

                {/* Notas adicionales */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notas"
                    value={reservaData.notas}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Información adicional que quieras compartir con el profesor..."
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reservando}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reservando ? 'Procesando...' : `Continuar al Pago (${formatPrecio(costoTotal)})`}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen y Seguridad */}
          <div className="space-y-6">
            
            {/* Resumen de la reserva */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Resumen de tu reserva</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Profesor:</span>
                  <span className="font-semibold">{profesor.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Especialidad:</span>
                  <span className="font-semibold">{profesor.especialidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tarifa por hora:</span>
                  <span className="font-semibold">{formatPrecio(profesor.tarifa)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Duración:</span>
                  <span className="font-semibold">{reservaData.duracion} hora(s)</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold text-primary-600">
                  <span>Total:</span>
                  <span>{formatPrecio(costoTotal)}</span>
                </div>
              </div>
            </div>

            {/* Garantías */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-primary-600 mr-2" />
                Tu dinero está protegido
              </h3>
              
              <div className="space-y-3 text-sm text-secondary-700">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>El pago se libera solo cuando confirmes que recibiste la clase</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Reembolso completo si el profesor no se presenta</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Soporte 24/7 para resolver cualquier problema</span>
                </div>
                                 <div className="flex items-start">
                   <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                   <span>Comisión incluida en el precio - no pagas extra</span>
                 </div>
              </div>
            </div>

            {/* Información del profesor */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">Sobre el profesor</h3>
              <p className="text-sm text-secondary-600 mb-4">{profesor.descripcion}</p>
              
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="font-semibold text-secondary-700">Certificaciones:</span>
                  <p className="text-secondary-600">{profesor.certificaciones.join(', ')}</p>
                </div>
                <div>
                  <span className="font-semibold text-secondary-700">Idiomas:</span>
                  <p className="text-secondary-600">{profesor.idiomas.join(', ')}</p>
                </div>
              </div>

              {/* Botón de Chat */}
              <button
                onClick={() => setShowChat(true)}
                className="w-full flex items-center justify-center space-x-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-4 py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar mensaje al profesor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={handleSendMessage}
          profesor={profesor}
        />
      )}
    </div>
  )
}

export default ReservarClase
