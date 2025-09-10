import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Video, BookOpen, Users, DollarSign, Edit, Trash2, Eye } from 'lucide-react'

const MisServicios = () => {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarServicios()
  }, [])

  const cargarServicios = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/servicios/usuario/mis-servicios.php')
      const data = await response.json()
      
      if (data.success) {
        setServicios(data.servicios || [])
      }
    } catch (error) {
      console.error('Error cargando servicios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarServicio = async (servicioId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return
    }

    try {
      const response = await fetch(`/api/servicios/eliminar.php?id=${servicioId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setServicios(servicios.filter(s => s.id !== servicioId))
        alert('Servicio eliminado exitosamente')
      } else {
        alert('Error al eliminar el servicio')
      }
    } catch (error) {
      console.error('Error eliminando servicio:', error)
      alert('Error al eliminar el servicio')
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-600">Gestiona tus cursos pregrabados, asesorías y servicios</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/servicios/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Link>
          <Link
            to="/clases/crear"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Clase
          </Link>
        </div>
      </div>

      {/* Lista de Servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes servicios creados</h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer servicio para empezar a vender cursos pregrabados, asesorías y más
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/servicios/crear"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Mi Primer Servicio
            </Link>
            <Link
              to="/clases/crear"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Mi Primera Clase
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Imagen del servicio */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                {servicio.tipo === 'curso' ? (
                  <Video className="w-16 h-16 text-blue-600" />
                ) : servicio.tipo === 'asesoria' ? (
                  <BookOpen className="w-16 h-16 text-green-600" />
                ) : (
                  <Users className="w-16 h-16 text-purple-600" />
                )}
              </div>
              
              {/* Contenido */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {servicio.titulo}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    servicio.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {servicio.descripcion}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${servicio.precio?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {servicio.tipo === 'curso' ? 'Curso' : 
                     servicio.tipo === 'asesoria' ? 'Asesoría' : 'Servicio'}
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="flex space-x-2">
                  <Link
                    to={`/servicios/editar/${servicio.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-center text-sm flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminarServicio(servicio.id)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-center text-sm flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MisServicios
