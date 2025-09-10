import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import TwoFactorVerification from './TwoFactorVerification'
import TwoFactorAuthService from '../../services/twoFactorAuthSimple'
import { useAuth } from '../../contexts/AuthContext'

const SuperAdminGate = ({ children }) => {
  const [is2FAVerified, setIs2FAVerified] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [show2FAVerification, setShow2FAVerification] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    checkAccess()
  }, [user, isAuthenticated])

  const checkAccess = async () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    // Verificar si es el admin correcto
    if (user.email !== 'admin@easyclase.com') {
      setLoading(false)
      return // Mostrar mensaje de acceso denegado
    }

    try {
      const enabled = await TwoFactorAuthService.is2FAEnabled()
      setIs2FAEnabled(enabled)
      
      if (enabled) {
        setShow2FAVerification(true)
      } else {
        // Si 2FA no está habilitado, permitir acceso directo
        setIs2FAVerified(true)
      }
    } catch (error) {
      console.error('Error verificando estado 2FA:', error)
      // En caso de error, permitir acceso
      setIs2FAVerified(true)
    } finally {
      setLoading(false)
    }
  }

  const handle2FAVerificationSuccess = () => {
    setIs2FAVerified(true)
    setShow2FAVerification(false)
  }

  const handle2FAVerificationCancel = () => {
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (show2FAVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              Super Admin Panel
            </h1>
            <p className="text-red-700">
              Verificación de seguridad requerida
            </p>
          </div>

          {/* 2FA Verification */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <TwoFactorVerification
              onSuccess={handle2FAVerificationSuccess}
              onCancel={handle2FAVerificationCancel}
            />
          </div>

          {/* Back to Dashboard */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Verificar si el usuario no es admin
  if (!loading && (!user || user.email !== 'admin@easyclase.com')) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-secondary-600 mb-6">
            No tienes permisos para acceder al Super Admin Panel. 
            Solo el administrador principal puede acceder a esta sección.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              Volver al Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!is2FAVerified) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-secondary-600 mb-6">
            No tienes permisos para acceder al Super Admin Panel.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default SuperAdminGate
