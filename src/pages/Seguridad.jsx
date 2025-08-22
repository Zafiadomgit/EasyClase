import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

const Seguridad = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Estados para cambio de contraseña
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Estados para configuración de seguridad
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    loginNotifications: true
  })

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Acceso Denegado</h2>
          <p className="text-secondary-600">Debes iniciar sesión para acceder a la configuración de seguridad.</p>
        </div>
      </div>
    )
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      await userService.cambiarContrasena({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setSuccess('Contraseña actualizada exitosamente')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-secondary-900">Seguridad</h1>
        </div>
        <p className="text-lg text-secondary-600">
          Gestiona tu contraseña y configuraciones de seguridad
        </p>
      </div>

      {/* Mensajes de estado */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cambio de Contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center mb-6">
            <Lock className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-secondary-900">Cambiar Contraseña</h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Contraseña Actual */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-secondary-400 hover:text-secondary-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-secondary-400 hover:text-secondary-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-secondary-400 hover:text-secondary-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>

        {/* Configuración de Seguridad */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-secondary-900">Configuración de Seguridad</h2>
          </div>
          
          <div className="space-y-6">
            {/* Autenticación de dos factores */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Autenticación de dos factores</h3>
                <p className="text-xs text-secondary-600">Añade una capa extra de seguridad a tu cuenta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Notificaciones por email */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Notificaciones por email</h3>
                <p className="text-xs text-secondary-600">Recibe alertas importantes por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.emailNotifications}
                  onChange={(e) => handleSecuritySettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Notificaciones de login */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Alertas de inicio de sesión</h3>
                <p className="text-xs text-secondary-600">Te notificamos cuando inicies sesión desde un nuevo dispositivo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.loginNotifications}
                  onChange={(e) => handleSecuritySettingChange('loginNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-secondary-200">
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Seguridad
