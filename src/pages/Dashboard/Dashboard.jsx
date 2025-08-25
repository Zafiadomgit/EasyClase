import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { 
  Calendar, 
  Clock, 
  Star, 
  BookOpen, 
  DollarSign, 
  Users, 
  TrendingUp,
  MessageCircle,
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  Settings,
  Video,
  Briefcase,
  Plus,
  Bug
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { claseService, servicioService, profesorService } from '../../services/api'
import VideoCallRoom from '../../components/VideoCall/VideoCallRoom'

// Componente de prueba para Sentry
const ErrorButton = () => {
  return (
    <button
      onClick={() => {
        throw new Error('¡Prueba de Sentry - Error generado intencionalmente!')
      }}
      className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
    >
      <Bug className="w-4 h-4 mr-2" />
      Probar Error Sentry
    </button>
  )
}

const Dashboard = () => {
  const { user, isProfesor, isEstudiante } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [clases, setClases] = useState([])
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedClaseId, setSelectedClaseId] = useState(null)
  const [mensajeExito, setMensajeExito] = useState('')
  const [balanceDisponible, setBalanceDisponible] = useState(0)
  const [loadingRetiro, setLoadingRetiro] = useState(false)
  const [showRetiroModal, setShowRetiroModal] = useState(false)
  const [montoRetiro, setMontoRetiro] = useState(0)

  useEffect(() => {
    cargarDatos()
    
    // Verificar si hay un mensaje de éxito desde la navegación
    if (location.state && location.state.mensaje) {
      setMensajeExito(location.state.mensaje)
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setMensajeExito(''), 5000)
    }
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      // Obtener clases del usuario desde la API
      const response = await claseService.obtenerMisClases()
      setClases(response.data?.clases || [])

      // Obtener servicios si el usuario puede ofrecer servicios
      try {
        const serviciosResponse = await servicioService.obtenerMisServicios()
        setServicios(serviciosResponse.data?.servicios || [])
      } catch (serviciosError) {
        // Si falla, solo logueamos, no es crítico
        console.log('Error cargando servicios:', serviciosError)
        setServicios([])
      }

      // Obtener balance si es profesor
      if (isProfesor()) {
        try {
          const balanceResponse = await profesorService.obtenerBalance()
          setBalanceDisponible(balanceResponse.data?.balanceDisponible || 0)
        } catch (balanceError) {
          console.log('Error cargando balance:', balanceError)
          setBalanceDisponible(0)
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Datos de ejemplo para estudiante
  const studentData = {
    proximasClases: [
      {
        id: 1,
        profesor: 'Carlos Mendoza',
        materia: 'Python Básico',
        fecha: '2024-01-20',
        hora: '10:00 AM',
        duracion: '2 horas',
        modalidad: 'Online',
        estado: 'confirmada'
      },
      {
        id: 2,
        profesor: 'María García',
        materia: 'Excel Avanzado',
        fecha: '2024-01-22',
        hora: '2:00 PM',
        duracion: '1 hora',
        modalidad: 'Online',
        estado: 'pendiente'
      }
    ],
    historialClases: [
      {
        profesor: 'Ana Rodríguez',
        materia: 'Inglés Conversacional',
        fecha: '2024-01-15',
        calificacion: 5,
        comentario: 'Excelente clase, muy didáctica'
      }
    ],
    estadisticas: {
      clasesTomadas: 12,
      horasTotales: 18,
      gastoTotal: 450000,
      profesoresFavoritos: 3
    }
  }

  // Datos de ejemplo para profesor
  const teacherData = {
    proximasClases: [
      {
        id: 1,
        estudiante: 'Juan Pérez',
        materia: 'Python Básico',
        fecha: '2024-01-20',
        hora: '10:00 AM',
        duracion: '2 horas',
        modalidad: 'Online',
        estado: 'confirmada'
      }
    ],
    solicitudesPendientes: [
      {
        estudiante: 'Laura Martínez',
        materia: 'Django Framework',
        fechaSolicitud: '2024-01-18',
        fechaPropuesta: '2024-01-25',
        hora: '3:00 PM'
      }
    ],
    estadisticas: {
      clasesImpartidas: 342,
      estudiantesActivos: 89,
      ingresosMes: 2100000,
      calificacionPromedio: 4.9
    }
  }

  // Determinar el tipo de usuario
  const userType = user?.tipoUsuario || 'estudiante'
  const data = userType === 'estudiante' ? studentData : teacherData

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const unirseAClase = (claseId) => {
    setSelectedClaseId(claseId)
    setShowVideoCall(true)
  }

  const salirDeVideoLlamada = () => {
    setShowVideoCall(false)
    setSelectedClaseId(null)
  }

  const handleRetirarDinero = (monto) => {
    setMontoRetiro(monto)
    setShowRetiroModal(true)
  }

  const confirmarRetiro = async () => {
    try {
      setLoadingRetiro(true)
      setShowRetiroModal(false)

      // Crear el retiro
      const response = await profesorService.crearRetiro(montoRetiro)
      
      if (response.success && response.data.init_point) {
        // Redirigir a MercadoPago
        window.open(response.data.init_point, '_blank')
        
        setMensajeExito('Retiro iniciado correctamente. Completa el proceso en MercadoPago.')
      } else {
        throw new Error('Error al crear el retiro')
      }
    } catch (error) {
      console.error('Error retirando dinero:', error)
      setError('Error al procesar el retiro. Intenta nuevamente.')
    } finally {
      setLoadingRetiro(false)
    }
  }

  // Filtrar clases por estado
  const proximasClases = clases.filter(clase => 
    ['solicitada', 'confirmada'].includes(clase.estado) &&
    new Date(clase.fecha) >= new Date()
  )

  const clasesCompletadas = clases.filter(clase => clase.estado === 'completada')

  // Calcular estadísticas básicas
  const serviciosActivos = servicios.filter(servicio => servicio.estado === 'activo')
  const estadisticas = {
    totalClases: clasesCompletadas.length,
    horasTotales: clasesCompletadas.reduce((total, clase) => total + clase.duracion, 0),
    gastoTotal: isEstudiante() ? clasesCompletadas.reduce((total, clase) => total + clase.total, 0) : 0,
    ingresoTotal: isProfesor() ? clasesCompletadas.reduce((total, clase) => total + clase.total, 0) : 0,
    totalServicios: serviciosActivos.length,
    ingresosServicios: servicios.reduce((total, servicio) => total + (servicio.precio * (servicio.totalVentas || 0)), 0)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center">
          <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
          <span className="font-medium">{mensajeExito}</span>
          <button
            onClick={() => setMensajeExito('')}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 font-display">
              ¡Hola, {user?.nombre?.split(' ')[0]}! 👋
            </h1>
            <p className="text-secondary-600 mt-2">
              {isEstudiante() 
                ? 'Gestiona tus clases y revisa tu progreso de aprendizaje'
                : 'Gestiona tus clases y revisa tus estadísticas de enseñanza'
              }
            </p>
          </div>
          {/* Botón de prueba Sentry (solo en desarrollo) */}
          {import.meta.env.DEV && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-2">Herramientas de desarrollo</p>
              <ErrorButton />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={cargarDatos}
            className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estadísticas */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isProfesor() ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-8`}>
        {isEstudiante() ? (
          <>
            <div className="card text-center">
              <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{estadisticas.totalClases}</p>
              <p className="text-secondary-600">Clases Tomadas</p>
            </div>
            <div className="card text-center">
              <Clock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{estadisticas.horasTotales}</p>
              <p className="text-secondary-600">Horas de Estudio</p>
            </div>
            <div className="card text-center">
              <Star className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{user?.calificacionPromedio?.toFixed(1) || '0.0'}</p>
              <p className="text-secondary-600">Tu Progreso</p>
            </div>
            <div className="card text-center">
              <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{proximasClases.length}</p>
              <p className="text-secondary-600">Próximas Clases</p>
            </div>
          </>
        ) : (
          <>
            <div className="card text-center">
              <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{estadisticas.totalClases}</p>
              <p className="text-secondary-600">Clases Impartidas</p>
            </div>
            <div className="card text-center">
              <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{new Set(clasesCompletadas.map(c => c.estudiante)).size}</p>
              <p className="text-secondary-600">Estudiantes Únicos</p>
            </div>
            <div className="card text-center relative">
              <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{formatPrecio(estadisticas.ingresoTotal)}</p>
              <p className="text-secondary-600">Ingresos Totales</p>
              {balanceDisponible > 0 && (
                <div className="mt-2 text-xs text-secondary-500">
                  <p>Disponible: {formatPrecio(balanceDisponible)}</p>
                  <p>Comisión: 20%</p>
                </div>
              )}
              {isProfesor() && (
                <button 
                  onClick={() => handleRetirarDinero(estadisticas.ingresoTotal || balanceDisponible)}
                  disabled={loadingRetiro || (estadisticas.ingresoTotal === 0 && balanceDisponible === 0)}
                  className={`mt-3 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center mx-auto ${
                    loadingRetiro || (estadisticas.ingresoTotal === 0 && balanceDisponible === 0)
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loadingRetiro ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      {estadisticas.ingresoTotal === 0 && balanceDisponible === 0 ? 'Sin fondos disponibles' : 'Retirar Dinero'}
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="card text-center">
              <Star className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{user?.calificacionPromedio?.toFixed(1) || '0.0'}</p>
              <p className="text-secondary-600">Calificación Promedio</p>
            </div>
            <div className="card text-center">
              <Briefcase className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-secondary-900">{estadisticas.totalServicios}</p>
              <p className="text-secondary-600">Servicios Activos</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Próximas clases */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Próximas Clases
            </h2>
            
            {proximasClases.length > 0 ? (
              <div className="space-y-4">
                {proximasClases.map((clase) => (
                  <div key={clase._id} className="border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900">{clase.materia}</h3>
                        <p className="text-secondary-600 text-sm">
                          {isEstudiante() ? `Profesor: ${clase.profesor?.nombre || 'N/A'}` : `Estudiante: ${clase.estudiante?.nombre || 'N/A'}`}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(clase.fecha).toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {clase.horaInicio} ({clase.duracion}h)
                          </span>
                        </div>
                        <p className="text-secondary-500 text-sm mt-1">
                          {formatPrecio(clase.total)} • {clase.modalidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          clase.estado === 'confirmada' 
                            ? 'bg-green-100 text-green-800' 
                            : clase.estado === 'solicitada'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {clase.estado === 'confirmada' ? 'Confirmada' : 
                           clase.estado === 'solicitada' ? 'Solicitada' : clase.estado}
                        </span>
                        <div className="mt-2 space-y-2">
                          {clase.estado === 'confirmada' && (
                            <button 
                              onClick={() => unirseAClase(clase._id)}
                              className="bg-green-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                            >
                              <Video className="w-4 h-4" />
                              <span>Unirse a Clase</span>
                            </button>
                          )}
                          <button className="btn-primary text-sm px-3 py-1">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                <p>No tienes clases programadas próximamente</p>
                <button 
                  className="btn-primary mt-4"
                  onClick={() => navigate(isEstudiante() ? '/buscar' : '/profesor/disponibilidad')}
                >
                  {isEstudiante() ? 'Buscar Clases' : 'Configurar Disponibilidad'}
                </button>
              </div>
            )}
          </div>

          {/* Mis Servicios */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Mis Servicios
              </h2>
              <button 
                onClick={() => navigate('/servicios/crear')}
                className="btn-primary text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuevo Servicio
              </button>
            </div>
            
            {serviciosActivos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviciosActivos.slice(0, 4).map((servicio, index) => (
                  <div key={index} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 text-sm">{servicio.titulo}</h3>
                        <p className="text-secondary-600 text-xs">{servicio.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">{formatPrecio(servicio.precio)}</p>
                        <p className="text-xs text-secondary-500">{servicio.totalVentas || 0} ventas</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        servicio.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                        servicio.estado === 'pausado' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {servicio.estado}
                      </span>
                      <button 
                        onClick={() => navigate(`/servicios/${servicio._id}`)}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                <p className="mb-2">No tienes servicios creados aún</p>
                <p className="text-sm mb-4">Empieza a ofrecer servicios como desarrollo web, tesis, consultoría y más</p>
                <button 
                  onClick={() => navigate('/servicios/crear')}
                  className="btn-primary"
                >
                  Crear Mi Primer Servicio
                </button>
              </div>
            )}
            
            {serviciosActivos.length > 4 && (
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate('/servicios/mis-servicios')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todos mis servicios ({serviciosActivos.length})
                </button>
              </div>
            )}
          </div>

          {/* Solicitudes pendientes (solo para profesores) */}
          {userType === 'profesor' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Solicitudes Pendientes
              </h2>
              
              {data.solicitudesPendientes.length > 0 ? (
                <div className="space-y-4">
                  {data.solicitudesPendientes.map((solicitud, index) => (
                    <div key={index} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-secondary-900">{solicitud.materia}</h3>
                          <p className="text-secondary-600 text-sm">Estudiante: {solicitud.estudiante}</p>
                          <p className="text-secondary-600 text-sm">
                            Solicitud: {solicitud.fechaSolicitud} • Propuesta: {solicitud.fechaPropuesta} a las {solicitud.hora}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-primary text-sm px-3 py-1">Aceptar</button>
                          <button className="btn-secondary text-sm px-3 py-1">Rechazar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-secondary-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                  <p>No tienes solicitudes pendientes</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              {userType === 'estudiante' ? (
                <>
                  <Link
                    to="/buscar"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Explorar Clases
                  </Link>
                  <button
                    onClick={() => navigate('/buscar?filtro=mis-profesores')}
                    className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Mis Profesores
                  </button>
                  <button
                    onClick={() => {/* Confirmar servicios pendientes */}}
                    className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Clases
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/ser-profesor"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Crear Perfil Profesor
                  </Link>
                  <button
                    onClick={() => {/* Aceptar reservaciones */}}
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Aceptar Reservas
                  </button>
                  <button
                    onClick={() => {/* Confirmar completado */}}
                    className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Completado
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Historial reciente */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              {userType === 'estudiante' ? 'Últimas Clases' : 'Actividad Reciente'}
            </h3>
            
            {userType === 'estudiante' && data.historialClases.length > 0 ? (
              <div className="space-y-3">
                {data.historialClases.map((clase, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-secondary-900">{clase.materia}</p>
                    <p className="text-secondary-600">Prof. {clase.profesor}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < clase.calificacion ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-secondary-500">
                <p className="text-sm">No hay actividad reciente</p>
              </div>
            )}
          </div>

          {/* Progreso o métricas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              {userType === 'estudiante' ? 'Tu Progreso' : 'Rendimiento'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">
                    {userType === 'estudiante' ? 'Horas completadas' : 'Meta mensual'}
                  </span>
                  <span className="text-secondary-900">
                    {userType === 'estudiante' ? '18/25' : '85/100'}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: userType === 'estudiante' ? '72%' : '85%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">
                    {userType === 'estudiante' ? 'Objetivos logrados' : 'Satisfacción estudiantes'}
                  </span>
                  <span className="text-secondary-900">
                    {userType === 'estudiante' ? '7/10' : '4.9/5.0'}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: userType === 'estudiante' ? '70%' : '98%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* VideoCall Room Modal */}
      {showVideoCall && (
        <VideoCallRoom 
          claseId={selectedClaseId} 
          onLeave={salirDeVideoLlamada}
        />
      )}

      {/* Modal de Confirmación de Retiro */}
      {showRetiroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Confirmar Retiro de Dinero
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Monto a retirar:</span>
                    <span className="font-semibold">{formatPrecio(montoRetiro)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Comisión (20%):</span>
                    <span className="text-red-600">-{formatPrecio(montoRetiro * 0.20)}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between font-bold">
                    <span className="text-secondary-900">Monto neto:</span>
                    <span className="text-green-600">{formatPrecio(montoRetiro * 0.80)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-secondary-600 mb-6">
                Serás redirigido a MercadoPago para completar el retiro de forma segura.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRetiroModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRetiro}
                  disabled={loadingRetiro}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    loadingRetiro 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loadingRetiro ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Retiro'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard