import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  CreditCard, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Trash2, 
  Edit, 
  Eye, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

const SuperAdminPanelSimple = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [reports, setReports] = useState({})
  const [users, setUsers] = useState([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    password: '',
    tipo_usuario: 'estudiante',
    telefono: '',
    direccion: '',
    bio: ''
  })

  // Verificar acceso
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    if (user.email !== 'admin@easyclase.com') {
      navigate('/dashboard')
      return
    }

    loadDashboardData()
    loadUsers()
  }, [user, isAuthenticated, navigate])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const response = await adminService.getDashboardStats()
      if (response.success) {
        setReports(response.data)
      } else {
        throw new Error(response.message || 'Error cargando estadísticas')
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
      // Datos por defecto en caso de error
      setReports({
        totalUsers: 0,
        totalClasses: 0,
        totalRevenue: 0,
        activeProfesors: 0,
        activeStudents: 0,
        pendingPayments: 0,
        completedClasses: 0,
        cancelledClasses: 0
      })
      
      // Mostrar mensaje de error al usuario
      alert('Error cargando estadísticas del dashboard. Mostrando datos por defecto.')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      if (newUser.id) {
        // Editar usuario existente
        await adminService.updateUser(newUser.id, newUser)
        alert('Usuario actualizado exitosamente')
      } else {
        // Crear nuevo usuario
        await adminService.createUser(newUser)
        alert('Usuario creado exitosamente')
      }
      
      setShowCreateUser(false)
      setNewUser({
        nombre: '',
        email: '',
        password: '',
        tipo_usuario: 'estudiante',
        telefono: '',
        direccion: '',
        bio: ''
      })
      loadUsers() // Recargar lista de usuarios
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await adminService.deleteUser(userId)
        loadUsers() // Recargar lista de usuarios
        alert('Usuario eliminado exitosamente')
      } catch (error) {
        alert('Error eliminando usuario: ' + error.message)
      }
    }
  }

  const handleCleanDatabase = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar la base de datos? Esto eliminará todos los usuarios excepto el admin.')) {
      try {
        await adminService.cleanDatabase()
        loadUsers() // Recargar lista de usuarios
        loadDashboardData() // Recargar estadísticas
        alert('Base de datos limpiada exitosamente')
      } catch (error) {
        alert('Error limpiando base de datos: ' + error.message)
      }
    }
  }

  const exportReportes = () => {
    // Crear datos para exportar
    const data = {
      usuarios: users,
      estadisticas: reports,
      fecha: new Date().toISOString()
    }
    
    // Crear archivo CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Tipo,Valor\n" +
      `Total Usuarios,${reports.totalUsers || 0}\n` +
      `Total Clases,${reports.totalClasses || 0}\n` +
      `Ingresos Totales,${reports.totalRevenue || 0}\n` +
      `Pagos Pendientes,${reports.pendingPayments || 0}\n`
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `reporte_easyclase_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditUser = (user) => {
    setNewUser({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: '',
      tipo_usuario: user.tipo_usuario,
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      bio: user.bio || ''
    })
    setShowCreateUser(true)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{reports.totalUsers?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clases</p>
              <p className="text-2xl font-bold text-gray-900">{reports.totalClasses?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${reports.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{reports.pendingPayments || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowCreateUser(true)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Crear Usuario</p>
          </button>
          <button 
            onClick={() => alert('Funcionalidad de importar datos próximamente')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Importar Datos</p>
          </button>
          <button 
            onClick={() => exportReportes()}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Download className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Exportar Reportes</p>
          </button>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCleanDatabase}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2 inline" />
              Limpiar BD
            </button>
            <button 
              onClick={() => setShowCreateUser(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
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
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter(user => 
                  user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          user.email === 'admin@easyclase.com' 
                            ? 'bg-red-100' 
                            : user.tipo_usuario === 'profesor' 
                            ? 'bg-blue-100' 
                            : 'bg-green-100'
                        }`}>
                          {user.email === 'admin@easyclase.com' ? (
                            <Crown className="w-5 h-5 text-red-600" />
                          ) : user.tipo_usuario === 'profesor' ? (
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Users className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.email === 'admin@easyclase.com'
                        ? 'bg-red-100 text-red-800'
                        : user.tipo_usuario === 'profesor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.email === 'admin@easyclase.com' ? 'Super Admin' : user.tipo_usuario}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.fecha_registro).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => alert(`Ver detalles de ${user.nombre}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.email !== 'admin@easyclase.com' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
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

  const renderSystem = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configuraciones Generales</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Registro de nuevos usuarios</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Notificaciones por email</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" />
                <span className="ml-2 text-sm text-gray-700">Modo mantenimiento</span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configuraciones de Pago</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-700">Comisión por clase (%)</label>
                <input type="number" defaultValue="10" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Monto mínimo de retiro</label>
                <input type="number" defaultValue="50000" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Panel</h1>
              <p className="text-gray-600">Control total del sistema EasyClase</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Conectado como</p>
                <p className="font-medium text-gray-900">{user?.nombre || 'Admin Master'}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'users', name: 'Usuarios', icon: Users },
              { id: 'system', name: 'Sistema', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'system' && renderSystem()}
        </div>
      </div>

      {/* Modal para crear usuario */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {newUser.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    required
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    required={!newUser.id}
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder={newUser.id ? "Dejar vacío para mantener la actual" : "Contraseña"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                  <select
                    value={newUser.tipo_usuario}
                    onChange={(e) => setNewUser({...newUser, tipo_usuario: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    value={newUser.telefono}
                    onChange={(e) => setNewUser({...newUser, telefono: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    value={newUser.direccion}
                    onChange={(e) => setNewUser({...newUser, direccion: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Biografía</label>
                  <textarea
                    value={newUser.bio}
                    onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {newUser.id ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdminPanelSimple
