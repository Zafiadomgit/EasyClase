import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
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
import { servicioService, profesorService } from '../../services/api'
import { formatPrecio } from '../../utils/currencyUtils'

const DashboardSimple = () => {
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
      
      // Obtener servicios si el usuario puede ofrecer servicios
      try {
        const serviciosResponse = await servicioService.obtenerMisServicios()
        setServicios(serviciosResponse.data?.servicios || [])
      } catch (serviciosError) {
        // Si falla, solo logueamos, no es crítico
        setServicios([])
      }

      // Obtener balance si es profesor
      if (isProfesor()) {
        try {
          const balanceResponse = await profesorService.obtenerBalance()
          setBalanceDisponible(balanceResponse.data?.balanceDisponible || 0)
        } catch (balanceError) {
          setBalanceDisponible(0)
        }
      }
    } catch (error) {
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar clase de prueba
  const agregarClasePrueba = () => {
    const nuevaClase = {
      id: Date.now(),
      titulo: 'Clase de Prueba',
      profesor: 'Prof. Test',
      fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
      duracion: 60,
      precio: 50000,
      estado: 'confirmada',
      modalidad: 'virtual'
    }
    
    setClases(prevClases => [...prevClases, nuevaClase])
    alert('Clase de prueba agregada! 🎉')
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
            
            {clases.length > 0 ? (
              <div className="space-y-4">
                {clases.map((clase) => (
                  <div key={clase.id} className="border border-secondary-200 rounded-lg p-4 hover:bg-secondary-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900">{clase.tema}</h3>
                        <p className="text-secondary-600 text-sm">
                          {isEstudiante() ? `Profesor: ${clase.profesorNombre || 'N/A'}` : `Estudiante: ${clase.estudiante?.nombre || 'N/A'}`}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(clase.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {clase.hora} ({clase.duracion}h)
                          </span>
                        </div>
                        <p className="text-secondary-500 text-sm mt-1">
                          {formatPrecio(clase.total)} • {clase.metodoPago}
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
                          <button 
                            onClick={() => navigate(`/clase/${clase.id}`, { state: { clase } })}
                            className="btn-primary text-sm px-3 py-1"
                          >
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
                <div className="space-y-3 mt-4">
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(isEstudiante() ? '/buscar' : '/profesor/disponibilidad')}
                  >
                    {isEstudiante() ? 'Buscar Clases' : 'Configurar Disponibilidad'}
                  </button>
                  <div className="pt-2">
                    <button 
                      onClick={agregarClasePrueba}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🧪 Agregar Clase de Prueba
                    </button>
                  </div>
                </div>
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              {isEstudiante() ? (
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
                </>
              )}
            </div>
          </div>

          {/* Botón de logout */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Sesión</h3>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSimple
