import React, { useState, useEffect } from 'react'
import { Search, AlertTriangle, CheckCircle, XCircle, Clock, MessageCircle, Eye } from 'lucide-react'

const AdminDisputas = () => {
  const [disputas, setDisputas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todas')

  // Datos de ejemplo
  useEffect(() => {
    const disputasEjemplo = [
      {
        id: 1,
        estudiante: 'Ana García',
        profesor: 'Carlos Mendez',
        clase: 'JavaScript Básico',
        motivo: 'Profesor no se presentó a la clase',
        descripcion: 'El profesor no se conectó a la videollamada en el horario acordado. Esperé 30 minutos.',
        fecha: '2024-01-20',
        estado: 'pendiente',
        prioridad: 'alta',
        monto: 100000
      },
      {
        id: 2,
        estudiante: 'Luis Martinez',
        profesor: 'María López',
        clase: 'Excel Avanzado',
        motivo: 'Contenido no coincide con lo prometido',
        descripcion: 'La clase fue muy básica, no avanzada como se anunció en el perfil.',
        fecha: '2024-01-18',
        estado: 'resuelto',
        prioridad: 'media',
        monto: 50000,
        resolucion: 'Reembolso del 50% otorgado'
      },
      {
        id: 3,
        estudiante: 'Sofia Rodriguez',
        profesor: 'Carlos Mendez',
        clase: 'React Hooks',
        motivo: 'Problemas técnicos',
        descripcion: 'La videollamada se cortó múltiples veces y no se pudo completar la clase.',
        fecha: '2024-01-19',
        estado: 'en_revision',
        prioridad: 'baja',
        monto: 150000
      }
    ]
    
    setTimeout(() => {
      setDisputas(disputasEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDisputas = disputas.filter(disputa => {
    const matchesSearch = 
      disputa.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disputa.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disputa.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterEstado === 'todas' || disputa.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-100 text-red-800'
      case 'en_revision': return 'bg-yellow-100 text-yellow-800'
      case 'resuelto': return 'bg-green-100 text-green-800'
      case 'rechazado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'text-red-600'
      case 'media': return 'text-yellow-600'
      case 'baja': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const estadisticas = {
    total: disputas.length,
    pendientes: disputas.filter(d => d.estado === 'pendiente').length,
    enRevision: disputas.filter(d => d.estado === 'en_revision').length,
    resueltas: disputas.filter(d => d.estado === 'resuelto').length
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Disputas</h1>
        <p className="text-gray-600">Resuelve conflictos entre estudiantes y profesores</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Disputas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En Revisión</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.enRevision}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Resueltas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.resueltas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar disputas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas las disputas</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_revision">En Revisión</option>
              <option value="resuelto">Resueltas</option>
              <option value="rechazado">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disputa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDisputas.map((disputa) => (
                <tr key={disputa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">#{disputa.id}</span>
                        <span className={`ml-2 ${getPrioridadColor(disputa.prioridad)}`}>
                          {disputa.prioridad === 'alta' && '🔴'}
                          {disputa.prioridad === 'media' && '🟡'}
                          {disputa.prioridad === 'baja' && '🟢'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(disputa.fecha).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        👩‍🎓 {disputa.estudiante}
                      </div>
                      <div className="text-sm text-gray-500">
                        👨‍🏫 {disputa.profesor}
                      </div>
                      <div className="text-sm text-gray-500 italic">
                        {disputa.clase}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {disputa.motivo}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {disputa.descripcion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(disputa.estado)}`}>
                      {disputa.estado === 'pendiente' && '⏳'}
                      {disputa.estado === 'en_revision' && '👁️'}
                      {disputa.estado === 'resuelto' && '✅'}
                      {disputa.estado === 'rechazado' && '❌'}
                      <span className="ml-1 capitalize">{disputa.estado.replace('_', ' ')}</span>
                    </span>
                    {disputa.resolucion && (
                      <div className="text-xs text-gray-500 mt-1">
                        {disputa.resolucion}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrecio(disputa.monto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Ver detalles">
                        <Eye className="w-4 h-4" />
                      </button>
                      {disputa.estado === 'pendiente' && (
                        <>
                          <button className="text-green-600 hover:text-green-900" title="Resolver">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Rechazar">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDisputas
