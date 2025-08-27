import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Star,
  Crown,
  Calendar
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error cargando estadísticas del dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Error</h2>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    )
  }

  const { overview, topTeachers } = stats

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Panel de Administración</h1>
              <p className="text-secondary-600 mt-1">Gestiona toda la plataforma EasyClase</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Super Admin
              </span>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Usuarios */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-secondary-900">{overview.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{overview.newUsersThisMonth} este mes
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Profesores */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Profesores</p>
                <p className="text-3xl font-bold text-secondary-900">{overview.totalTeachers}</p>
                <p className="text-sm text-secondary-500 mt-1">
                  {Math.round((overview.totalTeachers / overview.totalUsers) * 100)}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Clases */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Clases Totales</p>
                <p className="text-3xl font-bold text-secondary-900">{overview.totalClasses}</p>
                <p className="text-sm text-secondary-500 mt-1">
                  En toda la plataforma
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Ingresos Totales */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-secondary-900">
                  ${overview.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-secondary-500 mt-1">
                  COP
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas y acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Disputas pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Disputas Pendientes</h3>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{overview.pendingDisputes}</p>
              <p className="text-sm text-secondary-600 mt-1">Requieren atención</p>
              <Link 
                to="/admin/disputes"
                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Resolver Disputas
              </Link>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link 
                to="/admin/users"
                className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <span className="text-secondary-700">Gestionar Usuarios</span>
                <Users className="w-4 h-4 text-secondary-400" />
              </Link>
              <Link 
                to="/admin/classes"
                className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <span className="text-secondary-700">Ver Clases</span>
                <BookOpen className="w-4 h-4 text-secondary-400" />
              </Link>
              <Link 
                to="/admin/payments"
                className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <span className="text-secondary-700">Gestionar Pagos</span>
                <DollarSign className="w-4 h-4 text-secondary-400" />
              </Link>
            </div>
          </div>

          {/* Sistema */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Base de Datos</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">API</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Funcionando</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-600">Pagos</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Activo</span>
              </div>
              <Link 
                to="/admin/system"
                className="mt-4 inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm"
              >
                Ver Detalles
              </Link>
            </div>
          </div>
        </div>

        {/* Top Profesores */}
        {topTeachers && topTeachers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900">Top Profesores por Ingresos</h3>
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Profesor</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Clases</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Ingresos</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {topTeachers.map((teacher, index) => (
                    <tr key={teacher._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-secondary-900">{teacher.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-secondary-600">{teacher.email}</td>
                      <td className="py-3 px-4 text-secondary-900">{teacher.totalClases}</td>
                      <td className="py-3 px-4 text-secondary-900 font-medium">
                        ${teacher.totalIngresos.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-secondary-900">{teacher.calificacion || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
