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
      const response = await fetch('/api/plantillas.php', {
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
    
    if (timeCheck.canJoin) {
      // Iniciar la llamada
      VideoCallAuthService.startCall(clase)
    } else {
      alert(timeCheck.message)
    }
  }

  const eliminarClase = async (claseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta clase? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`/api/plantillas.php/${claseId}`, {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Clases</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus clases en vivo y disponibilidad
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-8">
          <Link
            to="/servicios/crear"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Servicio
          </Link>
          <Link
            to="/clases/crear"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Clase
          </Link>
        </div>

        {/* Lista de clases */}
        {clases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes clases</h3>
            <p className="text-gray-600 mb-6">
              Crea tu primera clase para empezar a enseñar
            </p>
            <Link
              to="/clases/crear"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Crear Primera Clase
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clases.map((clase) => (
              <div key={clase.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {clase.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {clase.materia} • {clase.categoria}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      {clase.descripcion}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{clase.duracion}h</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{clase.tipo === 'individual' ? 'Individual' : `Grupal (${clase.max_estudiantes})`}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span>${clase.precio}/hora</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => eliminarClase(clase.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisClases
