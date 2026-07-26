import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AlertTriangle } from 'lucide-react'

// Restringe una ruta a profesores (y administradores). Los estudiantes que
// intenten acceder por URL directa ven un aviso, no la página de profesor.
const ProfesorRoute = ({ children }) => {
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

  const esProfesor =
    user.tipoUsuario === 'profesor' ||
    user.tipoUsuario === 'admin' ||
    user.tipoUsuario === 'superadmin' ||
    ['admin', 'superadmin'].includes(user.rol)

  if (!esProfesor) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Solo para profesores</h2>
          <p className="text-secondary-600 mb-6">
            Esta sección es exclusiva de los profesores. Si querés enseñar y ofrecer
            servicios, activá tu perfil de profesor.
          </p>
          <div className="space-y-3">
            <a
              href="/ser-profesor"
              className="block w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Quiero ser profesor
            </a>
            <button
              onClick={() => window.history.back()}
              className="block w-full border border-secondary-300 text-secondary-700 py-2 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProfesorRoute
