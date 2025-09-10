import React, { useState, useEffect } from 'react'
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
import TwoFactorSetup from '../../components/Admin/TwoFactorSetup'
import TwoFactorVerification from '../../components/Admin/TwoFactorVerification'
import TwoFactorAuthService from '../../services/twoFactorAuthSimple'
import SuperAdminGate from '../../components/Admin/SuperAdminGate'

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [show2FAVerification, setShow2FAVerification] = useState(false)
  const [is2FAVerified, setIs2FAVerified] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  // Estados para diferentes secciones
  const [users, setUsers] = useState([])
  const [classes, setClasses] = useState([])
  const [payments, setPayments] = useState([])
  const [reports, setReports] = useState({})

  useEffect(() => {
    check2FAStatus()
    loadDashboardData()
  }, [])

  const check2FAStatus = async () => {
    try {
      const isEnabled = await TwoFactorAuthService.is2FAEnabled()
      setIs2FAEnabled(isEnabled)
      
      if (isEnabled) {
        setShow2FAVerification(true)
      } else {
        setShow2FASetup(true)
      }
    } catch (error) {
      console.error('Error verificando estado 2FA:', error)
      // En caso de error, mostrar configuración
      setShow2FASetup(true)
    }
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Cargar datos del dashboard
      const dashboardData = {
        totalUsers: 1250,
        totalClasses: 3420,
        totalRevenue: 12500000,
        activeProfesors: 89,
        activeStudents: 1161,
        pendingPayments: 12,
        completedClasses: 3208,
        cancelledClasses: 45
      }
      setReports(dashboardData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handle2FASetupComplete = (config) => {
    setShow2FASetup(false)
    setIs2FAEnabled(true)
    setIs2FAVerified(true)
    console.log('2FA configurado:', config)
  }

  const handle2FAVerificationSuccess = () => {
    setShow2FAVerification(false)
    setIs2FAVerified(true)
  }

  const handle2FAVerificationCancel = () => {
    setShow2FAVerification(false)
    // Redirigir al dashboard principal
    window.location.href = '/dashboard'
  }

  const handle2FASetupCancel = () => {
    setShow2FASetup(false)
    // Redirigir al dashboard principal
    window.location.href = '/dashboard'
  }

  const handleBulkAction = (action) => {
    if (!is2FAVerified) {
      alert('Debes verificar tu identidad con 2FA para realizar esta acción')
      return
    }

    if (selectedUsers.length === 0) {
      alert('Selecciona al menos un usuario')
      return
    }

    const actionMessages = {
      activate: '¿Activar los usuarios seleccionados?',
      deactivate: '¿Desactivar los usuarios seleccionados?',
      delete: '¿Eliminar permanentemente los usuarios seleccionados?',
      premium: '¿Dar acceso premium a los usuarios seleccionados?',
      resetPassword: '¿Resetear contraseñas de los usuarios seleccionados?'
    }

    if (confirm(actionMessages[action])) {
      console.log(`Ejecutando acción ${action} en usuarios:`, selectedUsers)
      // Aquí se ejecutaría la acción real
      alert(`Acción ${action} ejecutada en ${selectedUsers.length} usuarios`)
      setSelectedUsers([])
    }
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
              <p className="text-2xl font-bold text-gray-900">{reports.totalUsers?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clases</p>
              <p className="text-2xl font-bold text-gray-900">{reports.totalClasses?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${reports.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{reports.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Crear Usuario</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Importar Datos</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filtros
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2 inline" />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Acciones masivas */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              {selectedUsers.length} usuario(s) seleccionado(s)
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <UserCheck className="w-4 h-4 mr-1 inline" />
                Activar
              </button>
              <button 
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                <UserX className="w-4 h-4 mr-1 inline" />
                Desactivar
              </button>
              <button 
                onClick={() => handleBulkAction('premium')}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                <Crown className="w-4 h-4 mr-1 inline" />
                Premium
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1 inline" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* Usuarios de prueba */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Admin Master</div>
                      <div className="text-sm text-gray-500">admin@easyclase.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Super Admin
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 2 minutos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Carlos Mendez</div>
                      <div className="text-sm text-gray-500">profesor.prueba@easyclase.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Profesor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 1 hora
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Ana García</div>
                      <div className="text-sm text-gray-500">estudiante.prueba@easyclase.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Estudiante
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 30 minutos
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Clases</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Clases Programadas</h4>
            <p className="text-2xl font-bold text-blue-600">1,250</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Clases Completadas</h4>
            <p className="text-2xl font-bold text-green-600">3,208</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Clases Canceladas</h4>
            <p className="text-2xl font-bold text-red-600">45</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Pagos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Ingresos Totales</h4>
            <p className="text-2xl font-bold text-green-600">$12,500,000</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Pagos Pendientes</h4>
            <p className="text-2xl font-bold text-yellow-600">12</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Comisiones</h4>
            <p className="text-2xl font-bold text-blue-600">$1,250,000</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Reembolsos</h4>
            <p className="text-2xl font-bold text-red-600">$125,000</p>
          </div>
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

  return (
    <SuperAdminGate>
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
                <p className="font-medium text-gray-900">Admin Master</p>
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
              { id: 'classes', name: 'Clases', icon: BookOpen },
              { id: 'payments', name: 'Pagos', icon: CreditCard },
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
          {activeTab === 'classes' && renderClasses()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'system' && renderSystem()}
        </div>
      </div>

      {/* Modales de 2FA */}
      {show2FASetup && (
        <TwoFactorSetup
          onComplete={handle2FASetupComplete}
          onCancel={handle2FASetupCancel}
        />
      )}

      {show2FAVerification && (
        <TwoFactorVerification
          onSuccess={handle2FAVerificationSuccess}
          onCancel={handle2FAVerificationCancel}
        />
      )}
      </div>
    </SuperAdminGate>
  )
}

export default SuperAdminPanel
