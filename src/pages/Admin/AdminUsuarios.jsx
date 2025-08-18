import React, { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Edit, Trash2, UserPlus, Shield, Crown } from 'lucide-react'

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')

  // Datos de ejemplo (luego conectaremos con la API)
  useEffect(() => {
    const usuariosEjemplo = [
      {
        id: 1,
        nombre: 'Ana García',
        email: 'estudiante.prueba@easyclase.com',
        tipoUsuario: 'estudiante',
        fechaRegistro: '2024-01-15',
        estado: 'activo',
        ultimoAcceso: '2024-01-20',
        clasesTomadas: 5
      },
      {
        id: 2,
        nombre: 'Carlos Mendez',
        email: 'profesor.prueba@easyclase.com',
        tipoUsuario: 'profesor',
        fechaRegistro: '2024-01-10',
        estado: 'activo',
        ultimoAcceso: '2024-01-19',
        clasesImpartidas: 23,
        premium: true
      },
      {
        id: 3,
        nombre: 'Admin Maestro',
        email: 'admin@easyclase.com',
        tipoUsuario: 'admin',
        fechaRegistro: '2024-01-01',
        estado: 'activo',
        ultimoAcceso: '2024-01-20',
        rol: 'superadmin'
      }
    ]
    
    setTimeout(() => {
      setUsuarios(usuariosEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'todos' || usuario.tipoUsuario === filterType
    return matchesSearch && matchesFilter
  })

  const getTipoUsuarioColor = (tipo) => {
    switch (tipo) {
      case 'estudiante': return 'bg-blue-100 text-blue-800'
      case 'profesor': return 'bg-green-100 text-green-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-yellow-100 text-yellow-800'
      case 'suspendido': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra todos los usuarios de la plataforma</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filter */}
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los usuarios</option>
              <option value="estudiante">Estudiantes</option>
              <option value="profesor">Profesores</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Crown className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Profesores</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.tipoUsuario === 'profesor').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.tipoUsuario === 'estudiante').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {usuarios.filter(u => u.premium).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actividad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {usuario.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                          {usuario.premium && (
                            <Crown className="w-4 h-4 text-amber-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoUsuarioColor(usuario.tipoUsuario)}`}>
                      {usuario.tipoUsuario}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(usuario.estado)}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(usuario.fechaRegistro).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.tipoUsuario === 'estudiante' && usuario.clasesTomadas && (
                      <span>{usuario.clasesTomadas} clases tomadas</span>
                    )}
                    {usuario.tipoUsuario === 'profesor' && usuario.clasesImpartidas && (
                      <span>{usuario.clasesImpartidas} clases impartidas</span>
                    )}
                    {usuario.tipoUsuario === 'admin' && (
                      <span>Acceso: {new Date(usuario.ultimoAcceso).toLocaleDateString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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

export default AdminUsuarios
