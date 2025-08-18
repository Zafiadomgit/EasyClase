import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, Clock, DollarSign, Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

const AdminClases = () => {
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todas')

  // Datos de ejemplo
  useEffect(() => {
    const clasesEjemplo = [
      {
        id: 1,
        estudiante: 'Ana García',
        profesor: 'Carlos Mendez',
        materia: 'JavaScript Básico',
        fecha: '2024-01-20',
        hora: '10:00',
        duracion: 2,
        precio: 100000,
        estado: 'completada',
        modalidad: 'online',
        calificacion: 5
      },
      {
        id: 2,
        estudiante: 'Luis Martinez',
        profesor: 'María López',
        materia: 'Excel Avanzado',
        fecha: '2024-01-21',
        hora: '14:00',
        duracion: 1,
        precio: 50000,
        estado: 'confirmada',
        modalidad: 'online'
      },
      {
        id: 3,
        estudiante: 'Sofia Rodriguez',
        profesor: 'Carlos Mendez',
        materia: 'React Hooks',
        fecha: '2024-01-22',
        hora: '16:00',
        duracion: 3,
        precio: 150000,
        estado: 'pendiente',
        modalidad: 'online'
      },
      {
        id: 4,
        estudiante: 'Pedro Gutierrez',
        profesor: 'Ana Herrera',
        materia: 'Inglés Conversacional',
        fecha: '2024-01-18',
        hora: '09:00',
        duracion: 1,
        precio: 45000,
        estado: 'cancelada',
        modalidad: 'online',
        motivoCancelacion: 'Profesor enfermo'
      }
    ]
    
    setTimeout(() => {
      setClases(clasesEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClases = clases.filter(clase => {
    const matchesSearch = 
      clase.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clase.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clase.materia.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterEstado === 'todas' || clase.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800'
      case 'confirmada': return 'bg-blue-100 text-blue-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada': return <CheckCircle className="w-4 h-4" />
      case 'confirmada': return <Clock className="w-4 h-4" />
      case 'pendiente': return <AlertCircle className="w-4 h-4" />
      case 'cancelada': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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
    total: clases.length,
    completadas: clases.filter(c => c.estado === 'completada').length,
    pendientes: clases.filter(c => c.estado === 'pendiente').length,
    ingresoTotal: clases
      .filter(c => c.estado === 'completada')
      .reduce((sum, c) => sum + c.precio, 0)
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clases</h1>
        <p className="text-gray-600">Administra todas las clases de la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Clases</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.completadas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrecio(estadisticas.ingresoTotal)}
              </p>
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
                placeholder="Buscar clases..."
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
              <option value="todas">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha & Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClases.map((clase) => (
                <tr key={clase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{clase.materia}</div>
                      <div className="text-sm text-gray-500">
                        {clase.duracion}h • {clase.modalidad}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        👩‍🎓 {clase.estudiante}
                      </div>
                      <div className="text-sm text-gray-500">
                        👨‍🏫 {clase.profesor}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(clase.fecha).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{clase.hora}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(clase.estado)}`}>
                      {getEstadoIcon(clase.estado)}
                      <span className="ml-1 capitalize">{clase.estado}</span>
                    </span>
                    {clase.estado === 'cancelada' && clase.motivoCancelacion && (
                      <div className="text-xs text-gray-500 mt-1">
                        {clase.motivoCancelacion}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrecio(clase.precio)}
                    </div>
                    {clase.calificacion && (
                      <div className="text-sm text-gray-500">
                        ⭐ {clase.calificacion}/5
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </button>
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

export default AdminClases
