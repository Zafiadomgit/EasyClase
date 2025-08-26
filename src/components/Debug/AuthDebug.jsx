import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AuthDebug = () => {
  const { isAuthenticated, user, loading } = useAuth()

  // Mostrar siempre para debug
  // if (process.env.NODE_ENV === 'production') {
  //   return null // No mostrar en producción
  // }

  return (
    <div className="fixed bottom-4 left-4 bg-red-100 border border-red-300 rounded-lg p-3 text-xs max-w-xs z-50">
      <h3 className="font-bold text-red-800 mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1 text-red-700">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
        <div><strong>User ID:</strong> {user?.id || 'null'}</div>
        <div><strong>User Name:</strong> {user?.nombre || 'null'}</div>
        <div><strong>User Type:</strong> {user?.tipoUsuario || 'null'}</div>
        <div><strong>shouldShowUserElements:</strong> {(!loading && isAuthenticated && user) ? 'true' : 'false'}</div>
      </div>
    </div>
  )
}

export default AuthDebug
