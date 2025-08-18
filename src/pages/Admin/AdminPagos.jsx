import React, { useState, useEffect } from 'react'
import { Search, Filter, DollarSign, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react'

const AdminPagos = () => {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')

  // Datos de ejemplo
  useEffect(() => {
    const pagosEjemplo = [
      {
        id: 1,
        estudiante: 'Ana García',
        profesor: 'Carlos Mendez',
        clase: 'JavaScript Básico',
        monto: 100000,
        fecha: '2024-01-20',
        estado: 'completado',
        metodo: 'mercadopago',
        transactionId: 'MP123456789'
      },
      {
        id: 2,
        estudiante: 'Luis Martinez',
        profesor: 'María López',
        clase: 'Excel Avanzado',
        monto: 50000,
        fecha: '2024-01-21',
        estado: 'pendiente',
        metodo: 'mercadopago',
        transactionId: 'MP987654321'
      },
      {
        id: 3,
        estudiante: 'Sofia Rodriguez',
        profesor: 'Carlos Mendez',
        clase: 'React Hooks',
        monto: 150000,
        fecha: '2024-01-22',
        estado: 'fallido',
        metodo: 'mercadopago',
        transactionId: 'MP555666777'
      }
    ]
    
    setTimeout(() => {
      setPagos(pagosEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPagos = pagos.filter(pago => {
    const matchesSearch = 
      pago.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.clase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterEstado === 'todos' || pago.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'fallido': return 'bg-red-100 text-red-800'
      case 'reembolsado': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
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
    total: pagos.length,
    completados: pagos.filter(p => p.estado === 'completado').length,
    pendientes: pagos.filter(p => p.estado === 'pendiente').length,
    ingresoTotal: pagos
      .filter(p => p.estado === 'completado')
      .reduce((sum, p) => sum + p.monto, 0)
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
        <p className="text-gray-600">Administra todas las transacciones de la plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Pagos</p>
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
              <p className="text-sm font-medium text-gray-500">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.completados}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
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
                placeholder="Buscar pagos..."
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
              <option value="todos">Todos los estados</option>
              <option value="completado">Completados</option>
              <option value="pendiente">Pendientes</option>
              <option value="fallido">Fallidos</option>
              <option value="reembolsado">Reembolsados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transacción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{pago.id}</div>
                      <div className="text-sm text-gray-500">{pago.transactionId}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(pago.fecha).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        👩‍🎓 {pago.estudiante}
                      </div>
                      <div className="text-sm text-gray-500">
                        👨‍🏫 {pago.profesor}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pago.clase}</div>
                    <div className="text-sm text-gray-500 capitalize">{pago.metodo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrecio(pago.monto)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pago.estado)}`}>
                      {pago.estado === 'completado' && '✅'}
                      {pago.estado === 'pendiente' && '⏳'}
                      {pago.estado === 'fallido' && '❌'}
                      {pago.estado === 'reembolsado' && '💰'}
                      <span className="ml-1 capitalize">{pago.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      {pago.estado === 'completado' && (
                        <button className="text-red-600 hover:text-red-900" title="Reembolsar">
                          <RefreshCw className="w-4 h-4" />
                        </button>
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

export default AdminPagos
