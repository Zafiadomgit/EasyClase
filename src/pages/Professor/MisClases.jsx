import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Calendar, Clock, Users, DollarSign, Video, Settings, Eye, Phone } from 'lucide-react'
import VideoCallAuthService from '../../services/videoCallAuth'

const MisClases = () => {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)
  const [claseActiva, setClaseActiva] = useState(null)

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    try {
      setLoading(true)
      
      // Cargar desde API de plantillas de clases
      const response = await fetch('/api/clases/plantillas-db.php/mis-plantillas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.plantillas) {
          setClases(data.data.plantillas)
        } else {
          setClases([])
        }
      } else {
        console.error('Error cargando clases:', response.status)
        setClases([])
      }
    } catch (error) {
      console.error('Error cargando clases:', error)
      setClases([])
    } finally {
      setLoading(false)
    }
  }

  const iniciarLlamada = (clase) => {
    setClaseActiva(clase)
    
    // Verificar si es el momento correcto para la clase
    const timeCheck = VideoCallAuthService.canJoinNow(clase)
    
    if (!timeCheck.canJoin) {
      alert(timeCheck.reason)
      return
    }
    
    // Navegar al componente de videollamada
    navigate(`/videollamada/${clase.id}`, {
      state: {
        clase: clase,
        duracion: clase.duracion || 1,
        fechaInicio: timeCheck.fechaInicio,
        fechaFin: timeCheck.fechaFin
      }
    })
  }
  
  const canJoinVideoCall = (clase) => {
    const timeCheck = VideoCallAuthService.canJoinNow(clase)
    return timeCheck.canJoin
  }
  
  const getTimeUntilAvailable = (clase) => {
    const timeCheck = VideoCallAuthService.canJoinNow(clase)
    return timeCheck.timeUntilAvailable || 0
  }


  const eliminarClase = async (claseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta clase? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`/api/clases/plantillas-db.php/${claseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Recargar las clases desde la API
            await cargarClases()
            alert('Clase eliminada exitosamente')
          } else {
            alert('Error al eliminar la clase: ' + data.message)
          }
        } else {
          alert('Error al eliminar la clase')
        }
      } catch (error) {
        console.error('Error eliminando clase:', error)
        alert('Error al eliminar la clase')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>
          <p className="text-gray-600">Gestiona tus clases en vivo y disponibilidad</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/profesor/disponibilidad"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Horarios
          </Link>
          <Link
            to="/servicios/crear"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Servicio
          </Link>
          <Link
            to="/clases/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Clase
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Clases Programadas</p>
              <p className="text-2xl font-bold text-gray-900">{clases.filter(c => c.estado === 'programada').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {clases.reduce((acc, clase) => acc + (clase.estudiantesInscritos || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                ${clases.reduce((acc, clase) => acc + (clase.ingresos || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Horas Enseñadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {clases.reduce((acc, clase) => acc + (clase.horasCompletadas || 0), 0)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clases */}
      {clases.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes clases programadas</h3>
          <p className="text-gray-600 mb-6">
            Configura tu disponibilidad y crea clases para empezar a enseñar
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/profesor/disponibilidad"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar Horarios
            </Link>
            <Link
              to="/servicios/crear"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Servicio
            </Link>
            <Link
              to="/clases/crear"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Clase
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Clases Programadas</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {clases.map((clase) => (
              <div key={clase.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{clase.titulo}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        clase.estado === 'programada' 
                          ? 'bg-blue-100 text-blue-800' 
                          : clase.estado === 'en_curso'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {clase.estado === 'programada' ? 'Programada' : 
                         clase.estado === 'en_curso' ? 'En Curso' : 'Completada'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(clase.fecha).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {clase.hora} ({clase.duracion}h)
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {clase.tipo === 'individual' ? 'Individual' : `Grupal (${clase.estudiantesInscritos || 1}/5)`}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${clase.precio?.toLocaleString() || '0'}
                      </div>
                    </div>
                    
                    {/* Información del estudiante */}
                    {clase.estudiante && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm text-gray-700">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="font-medium">Estudiante:</span>
                          <span className="ml-2">{clase.estudiante.nombre}</span>
                          <span className="ml-4 text-gray-500">{clase.estudiante.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => eliminarClase(clase.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      title="Eliminar esta clase"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MisClases
