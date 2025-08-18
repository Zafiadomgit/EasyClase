import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Shield, AlertTriangle } from 'lucide-react'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Verificar si el usuario es admin
  const isAdmin = user.tipoUsuario === 'admin' || 
                  ['admin', 'superadmin'].includes(user.rol)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-secondary-600 mb-6">
            No tienes permisos para acceder al panel de administración. 
            Solo los administradores pueden ver esta sección.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              Volver Atrás
            </button>
            <a
              href="/"
              className="block w-full px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Ir al Inicio
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">
              ¿Necesitas acceso administrativo?
            </p>
            <a 
              href="mailto:admin@easyclase.com" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contacta al administrador
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-area">
      {/* Indicador visual de que está en área admin */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-sm font-medium z-50">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>PANEL DE ADMINISTRACIÓN - {user.rol?.toUpperCase()}</span>
        </div>
      </div>
      <div className="pt-8">
        {children}
      </div>
    </div>
  )
}

export default AdminRoute
