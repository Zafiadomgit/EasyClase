import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  MessageCircle,
  Video,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { formatPrecio } from '../utils/currencyUtils'
import claseServiceLocal from '../services/claseService'

const DetalleClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [clase, setClase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarClase = async () => {
      try {
        setLoading(true)
        
        // Si tenemos datos de la clase en el estado de navegación, usarlos
        if (location.state?.clase) {
          setClase(location.state.clase)
        } else {
          // Si no, intentar cargar desde el servicio local
          const userId = user?.id || localStorage.getItem('easyclase_user_id')
          if (userId) {
            const clases = await claseServiceLocal.obtenerProximasClases(userId)
            const claseEncontrada = clases.find(c => c.id === id)
            if (claseEncontrada) {
              setClase(claseEncontrada)
            } else {
              setError('Clase no encontrada')
            }
          } else {
            setError('Usuario no identificado')
          }
        }
      } catch (error) {
        setError('Error al cargar los detalles de la clase')
      } finally {
        setLoading(false)
      }
    }

    cargarClase()
  }, [id, user, location.state])

  const handleVolver = () => {
    navigate(-1)
  }

  const handleContactar = () => {
    // Aquí podrías implementar la funcionalidad de chat
    navigate('/chat')
  }

  const handleUnirseAClase = () => {
    // Aquí podrías implementar la funcionalidad de videollamada
    navigate('/videollamada', { state: { claseId: id } })
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800'
      case 'solicitada':
        return 'bg-yellow-100 text-yellow-800'
      case 'completada':
        return 'bg-blue-100 text-blue-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'confirmada':
        return <CheckCircle className="w-4 h-4" />
      case 'solicitada':
        return <ClockIcon className="w-4 h-4" />
      case 'completada':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelada':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando detalles de la clase...</p>
        </div>
      </div>
    )
  }

  if (error || !clase) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Clase no encontrada'}</p>
          <button
            onClick={handleVolver}
            className="btn-primary"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleVolver}
            className="inline-flex items-center text-secondary-600 hover:text-secondary-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
                {clase.tema}
              </h1>
              <p className="text-secondary-600 dark:text-gray-400 mt-2">
                Clase programada
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(clase.estado)}`}>
                {getEstadoIcon(clase.estado)}
                <span className="ml-2 capitalize">{clase.estado}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles de la clase */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                Información de la Clase
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      Fecha
                    </p>
                    <p className="text-secondary-600 dark:text-gray-400">
                      {new Date(clase.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      Hora y Duración
                    </p>
                    <p className="text-secondary-600 dark:text-gray-400">
                      {clase.hora} ({clase.duracion} horas)
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      Modalidad
                    </p>
                    <p className="text-secondary-600 dark:text-gray-400">
                      {clase.modalidad || 'Online'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-secondary-500 mr-3" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      Precio Total
                    </p>
                    <p className="text-secondary-600 dark:text-gray-400">
                      {formatPrecio(clase.total)} • {clase.metodoPago}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del participante */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                {user?.tipoUsuario === 'profesor' ? 'Estudiante' : 'Profesor'}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-white text-lg">
                    {user?.tipoUsuario === 'profesor' 
                      ? clase.estudiante?.nombre || 'Estudiante'
                      : clase.profesorNombre || 'Profesor'
                    }
                  </p>
                  <p className="text-secondary-600 dark:text-gray-400">
                    {user?.tipoUsuario === 'profesor' ? 'Estudiante' : 'Profesor'} de la clase
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                Acciones
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {clase.estado === 'confirmada' && (
                  <button
                    onClick={handleUnirseAClase}
                    className="btn-primary flex items-center justify-center"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Unirse a la Clase
                  </button>
                )}
                
                <button
                  onClick={handleContactar}
                  className="btn-secondary flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactar
                </button>
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="space-y-6">
            {/* Resumen */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Resumen
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clase.estado)}`}>
                    {clase.estado}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Duración:</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {clase.duracion} horas
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Precio:</span>
                  <span className="font-medium text-primary-600">
                    {formatPrecio(clase.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recordatorios */}
            {clase.estado === 'confirmada' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Recordatorio
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  La videollamada estará disponible 10 minutos antes del inicio de la clase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleClase
