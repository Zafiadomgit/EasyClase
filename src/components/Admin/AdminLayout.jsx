import React from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Home,
  Users, 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  Settings,
  FileText,
  BarChart3,
  Shield,
  LogOut
} from 'lucide-react'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, exact: true },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Clases', href: '/admin/classes', icon: BookOpen },
    { name: 'Pagos', href: '/admin/payments', icon: DollarSign },
    { name: 'Disputas', href: '/admin/disputes', icon: AlertTriangle },
    { name: 'Reportes', href: '/admin/reports', icon: BarChart3 },
    { name: 'Contenido', href: '/admin/content', icon: FileText },
    { name: 'Sistema', href: '/admin/system', icon: Settings },
  ]

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-secondary-200">
        {/* Logo */}
        <div className="p-6 border-b border-secondary-200">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/Logo_reducido-removebg-preview.png" 
              alt="EasyClase" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="text-lg font-bold text-secondary-900">EasyClase</h2>
              <p className="text-xs text-secondary-600">Panel Admin</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.nombre || 'Admin'}
              </p>
              <p className="text-xs text-secondary-600 capitalize">
                {user?.rol || 'admin'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        active ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'
                      }`}
                    />
                    {item.name}
                    {item.name === 'Disputas' && (
                      <span className="ml-auto bg-red-100 text-red-800 text-xs rounded-full px-2 py-1">
                        3
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-secondary-200">
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900 rounded-lg transition-colors"
            >
              <Home className="mr-3 h-5 w-5 text-secondary-400" />
              Ver Sitio Web
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-900 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-400" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
