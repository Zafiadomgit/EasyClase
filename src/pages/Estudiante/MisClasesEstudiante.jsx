import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, DollarSign, Video, Phone, CheckCircle } from 'lucide-react'
import VideoCallAuthService from '../../services/videoCallAuth'

const MisClasesEstudiante = () => {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    try {
      setLoading(true)
      
      // Cargar desde localStorage (clases reservadas)
      const clasesLocales = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
      
      // También intentar cargar desde API si existe
      try {
        const response = await fetch('/api/clases/estudiante/mis-clases.php')
        const data = await response.json()
        
        if (data.success && data.clases) {
          // Combinar clases de API con las locales
          const clasesCombinadas = [...clasesLocales, ...data.clases]
          setClases(clasesCombinadas)
        } else {
          setClases(clasesLocales)
        }
      } catch (apiError) {
        // Si falla la API, usar solo las locales
        console.log('API no disponible, usando clases locales')
        setClases(clasesLocales)
      }
    } catch (error) {
      console.error('Error cargando clases:', error)
      setClases([])
    } finally {
      setLoading(false)
    }
  }

  const unirseALlamada = (clase) => {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>
        <p className="text-gray-600">Gestiona tus clases reservadas y únete a las sesiones</p>
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
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{clases.filter(c => c.estado === 'completada').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Horas Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {clases.reduce((acc, clase) => acc + (clase.duracion || 0), 0)}h
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Invertido</p>
              <p className="text-2xl font-bold text-gray-900">
                ${clases.reduce((acc, clase) => acc + (clase.precio || 0), 0).toLocaleString()}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes clases reservadas</h3>
          <p className="text-gray-600 mb-6">
            Explora las clases disponibles y reserva tu primera sesión
          </p>
          <a
            href="/buscar"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <Video className="w-4 h-4 mr-2" />
            Buscar Clases
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Clases Reservadas</h3>
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
                        {clase.tipo === 'individual' ? 'Individual' : `Grupal`}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${clase.precio?.toLocaleString() || '0'}
                      </div>
                    </div>
                    
                    {/* Información del profesor */}
                    {clase.profesor && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-sm text-gray-700">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="font-medium">Profesor:</span>
                          <span className="ml-2">{clase.profesor.nombre}</span>
                          <span className="ml-4 text-gray-500">{clase.profesor.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {clase.estado === 'programada' && (
                      <>
                        {canJoinVideoCall(clase) ? (
                          <button 
                            onClick={() => unirseALlamada(clase)}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            title="Unirse a la videollamada"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" title={`Disponible en ${getTimeUntilAvailable(clase)} minutos`}>
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                      </>
                    )}
                    {clase.estado === 'en_curso' && (
                      <button 
                        onClick={() => unirseALlamada(clase)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Unirse Ahora
                      </button>
                    )}
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

export default MisClasesEstudiante
