import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { claseService } from '../services/api'
import { Calendar, Clock, MapPin, User, Star, CheckCircle, XCircle, Clock3 } from 'lucide-react'

const MisClases = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [clases, setClases] = useState([])
  const [filtro, setFiltro] = useState('todas') // todas, proximas, completadas, canceladas

  useEffect(() => {
    if (user) {
      cargarMisClases()
    }
  }, [user])

  const cargarMisClases = async () => {
    try {
      setLoading(true)
      const response = await claseService.obtenerMisClases()
      setClases(response.data?.clases || [])
    } catch (error) {
      // Error silencioso para no interrumpir el flujo
    } finally {
      setLoading(false)
    }
  }

  const filtrarClases = () => {
    if (filtro === 'todas') return clases
    
    const ahora = new Date()
    
    switch (filtro) {
      case 'proximas':
        return clases.filter(clase => 
          new Date(clase.fecha) > ahora && clase.estado === 'confirmada'
        )
      case 'completadas':
        return clases.filter(clase => clase.estado === 'completada')
      case 'canceladas':
        return clases.filter(clase => clase.estado === 'cancelada')
      default:
        return clases
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-blue-100 text-blue-800'
      case 'completada':
        return 'bg-green-100 text-green-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'confirmada':
        return <Clock3 className="w-4 h-4" />
      case 'completada':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelada':
        return <XCircle className="w-4 h-4" />
      case 'pendiente':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando mis clases...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Acceso Denegado</h2>
          <p className="text-secondary-600">Debes iniciar sesión para ver tus clases.</p>
        </div>
      </div>
    )
  }

  const clasesFiltradas = filtrarClases()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
          Mis Clases
        </h1>
        <p className="text-lg text-secondary-600">
          Gestiona y revisa el historial de todas tus clases
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-secondary-700">Filtrar por:</span>
          {['todas', 'proximas', 'completadas', 'canceladas'].map((opcion) => (
            <button
              key={opcion}
              onClick={() => setFiltro(opcion)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === opcion
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {opcion === 'todas' && 'Todas'}
              {opcion === 'proximas' && 'Próximas'}
              {opcion === 'completadas' && 'Completadas'}
              {opcion === 'canceladas' && 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Clases */}
      {clasesFiltradas.length > 0 ? (
        <div className="space-y-6">
          {clasesFiltradas.map((clase) => (
            <div
              key={clase._id}
              className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                {/* Información Principal */}
                <div className="flex-1 mb-4 lg:mb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        {clase.titulo || 'Clase sin título'}
                      </h3>
                      <p className="text-secondary-600 mb-3">
                        {clase.descripcion || 'Sin descripción disponible'}
                      </p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(clase.estado)}`}>
                      {getEstadoIcono(clase.estado)}
                      <span className="ml-2 capitalize">
                        {clase.estado === 'confirmada' && 'Confirmada'}
                        {clase.estado === 'completada' && 'Completada'}
                        {clase.estado === 'cancelada' && 'Cancelada'}
                        {clase.estado === 'pendiente' && 'Pendiente'}
                        {clase.estado || 'Desconocido'}
                      </span>
                    </div>
                  </div>

                  {/* Detalles de la Clase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatFecha(clase.fecha)}</span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{clase.duracion} minutos</span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-green-600 font-medium">Online</span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>
                        {user.rol === 'estudiante' 
                          ? `Prof. ${clase.profesor?.nombre || 'No especificado'}`
                          : `Est. ${clase.estudiante?.nombre || 'No especificado'}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Categoría y Precio */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-primary-600 font-medium">
                        {clase.categoria || 'Sin categoría'}
                      </span>
                      {clase.descuento?.aplicado && (
                        <span className="text-sm text-green-600 font-medium">
                          🎉 {clase.descuento.porcentaje}% descuento aplicado
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-secondary-900">
                        {formatPrecio(clase.total || clase.precio)}
                      </p>
                      {clase.descuento?.aplicado && (
                        <p className="text-sm text-secondary-500 line-through">
                          {formatPrecio(clase.precio)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-between pt-4 border-t border-secondary-200 mt-6">
                <div className="flex items-center space-x-2">
                  {clase.estado === 'completada' && (
                    <button className="flex items-center px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      Calificar
                    </button>
                  )}
                  {clase.estado === 'confirmada' && (
                    <button className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium">
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancelar
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors text-sm">
                    Ver Detalles
                  </button>
                  {clase.estado === 'confirmada' && (
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                      Unirse a Clase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No tienes clases {filtro !== 'todas' ? filtro : ''}
          </h3>
          <p className="text-secondary-600 mb-4">
            {filtro === 'todas' && 'Comienza a tomar clases para verlas aquí'}
            {filtro === 'proximas' && 'No tienes clases programadas próximamente'}
            {filtro === 'completadas' && 'Aún no has completado ninguna clase'}
            {filtro === 'canceladas' && 'No tienes clases canceladas'}
          </p>
          {filtro !== 'todas' && (
            <button
              onClick={() => setFiltro('todas')}
              className="btn-primary"
            >
              Ver Todas las Clases
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MisClases
