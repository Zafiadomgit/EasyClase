import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Star, Clock, DollarSign, Users, BookOpen, Calendar, MessageCircle } from 'lucide-react'
import { formatPrecio, formatPrecioPorHora } from '../utils/currencyUtils'
import { useAuth } from '../contexts/AuthContext'

const BuscarClasesNuevo = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showReservarModal, setShowReservarModal] = useState(false)
  const [claseSeleccionada, setClaseSeleccionada] = useState(null)
  const [fechaReserva, setFechaReserva] = useState('')
  const [horaReserva, setHoraReserva] = useState('')
  const [comentariosReserva, setComentariosReserva] = useState('')
  const [reservando, setReservando] = useState(false)

  // Obtener parámetros de la URL
  const categoriaParam = searchParams.get('categoria')
  const queryParam = searchParams.get('q')

  // Cargar clases al montar el componente
  useEffect(() => {
    cargarClases()
  }, [])

  // Inicializar searchQuery con el parámetro de la URL
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [queryParam])

  const cargarClases = async () => {
    try {
      setLoading(true)
      
      // Construir URL con parámetros
      const params = new URLSearchParams()
      if (categoriaParam) params.set('categoria', categoriaParam)
      if (queryParam) params.set('busqueda', queryParam)
      
      const url = `/api/buscar-clases.php${params.toString() ? '?' + params.toString() : ''}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setClases(data.data.clases || [])
      } else {
        setError(data.message || 'Error al cargar las clases')
      }
    } catch (error) {
      console.error('Error cargando clases:', error)
      setError('Error al cargar las clases')
    } finally {
      setLoading(false)
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('q', searchQuery.trim())
      setSearchParams(newParams)
      cargarClases() // Recargar con nuevos parámetros
    }
  }

  // Función para abrir modal de reserva
  const abrirModalReserva = (clase) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setClaseSeleccionada(clase)
    setShowReservarModal(true)
    
    // Establecer fecha mínima como mañana
    const mañana = new Date()
    mañana.setDate(mañana.getDate() + 1)
    setFechaReserva(mañana.toISOString().split('T')[0])
    setHoraReserva('09:00')
  }

  // Función para cerrar modal de reserva
  const cerrarModalReserva = () => {
    setShowReservarModal(false)
    setClaseSeleccionada(null)
    setFechaReserva('')
    setHoraReserva('')
    setComentariosReserva('')
  }

  // Función para crear reserva
  const crearReserva = async () => {
    if (!claseSeleccionada || !fechaReserva || !horaReserva) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      setReservando(true)
      
      // En lugar de crear la reserva directamente, redirigir al pago
      const reservaData = {
        claseId: claseSeleccionada.id,
        estudianteId: user.id,
        fecha: fechaReserva,
        hora: horaReserva,
        comentarios: comentariosReserva,
        titulo: claseSeleccionada.titulo,
        precio: claseSeleccionada.precio,
        duracion: claseSeleccionada.duracion
      }
      
      // Guardar datos de reserva en localStorage para el proceso de pago
      localStorage.setItem('reservaPendiente', JSON.stringify(reservaData))
      
      // Redirigir a la página de pago
      navigate('/pago', { 
        state: { 
          tipo: 'clase',
          datos: reservaData 
        } 
      })
      
    } catch (error) {
      console.error('Error preparando reserva:', error)
      alert('Error al preparar la reserva')
    } finally {
      setReservando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={cargarClases}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de búsqueda */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoriaParam ? `Clases de ${categoriaParam}` : 'Buscar Clases'}
              </h1>
              <p className="text-gray-600 mt-1">
                {clases.length} clases encontradas
                {categoriaParam && ` en ${categoriaParam}`}
                {queryParam && ` para "${queryParam}"`}
              </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar clases..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clases</h3>
            <p className="text-gray-600 mb-6">
              {queryParam 
                ? `No hay clases que coincidan con "${queryParam}"`
                : 'No hay clases disponibles en este momento'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchParams({})
                cargarClases()
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Ver todas las clases
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clases.map((clase) => (
              <div key={clase.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {clase.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {clase.materia} • {clase.categoria}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {clase.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {clase.duracion}h
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {clase.tipo === 'individual' ? 'Individual' : `Grupal (${clase.maxEstudiantes})`}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {clase.profesor?.calificacionPromedio || 4.5}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrecioPorHora(clase.precio)}
                    </div>
                    <button
                      onClick={() => abrirModalReserva(clase)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Reservar Clase
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Profesor:</span>
                      <span className="ml-2">{clase.profesor?.nombre || 'Profesor Demo'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      {showReservarModal && claseSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reservar Clase
              </h3>
              <button
                onClick={cerrarModalReserva}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {claseSeleccionada.titulo}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {claseSeleccionada.materia} • {claseSeleccionada.categoria}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {formatPrecioPorHora(claseSeleccionada.precio)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de la clase
                </label>
                <input
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de la clase
                </label>
                <input
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={comentariosReserva}
                  onChange={(e) => setComentariosReserva(e.target.value)}
                  placeholder="¿Hay algo específico que quieras aprender?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={cerrarModalReserva}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={reservando}
              >
                Cancelar
              </button>
              <button
                onClick={crearReserva}
                disabled={reservando || !fechaReserva || !horaReserva}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reservando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Reservando...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Reservar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuscarClasesNuevo
