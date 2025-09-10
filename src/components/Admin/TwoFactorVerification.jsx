import React, { useState, useEffect } from 'react'
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import TwoFactorAuthService from '../../services/twoFactorAuthSimple'

const TwoFactorVerification = ({ onSuccess, onCancel }) => {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [attempts, setAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const maxAttempts = 3

  useEffect(() => {
    // Timer para mostrar tiempo restante
    const timer = setInterval(() => {
      const remaining = TwoFactorAuthService.getTimeRemaining()
      setTimeRemaining(remaining)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerifyToken = async () => {
    if (!token || token.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      return
    }

    if (attempts >= maxAttempts) {
      setError('Demasiados intentos fallidos. Intenta más tarde.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const config = TwoFactorAuthService.get2FAConfig()
      
      if (!config) {
        setError('Configuración 2FA no encontrada')
        return
      }

      const verification = TwoFactorAuthService.verifyToken(config.secret, token)
      
      if (verification.verified) {
        setSuccess('¡Código verificado correctamente!')
        setTimeout(() => {
          onSuccess()
        }, 1000)
      } else {
        setAttempts(prev => prev + 1)
        setError(`Código inválido. Intentos restantes: ${maxAttempts - attempts - 1}`)
        setToken('')
      }
    } catch (error) {
      setError('Error verificando código. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerifyToken()
    }
  }

  const handleBackupCode = () => {
    // Aquí se implementaría la verificación de códigos de respaldo
    alert('Función de códigos de respaldo en desarrollo')
  }

  const refreshTimer = () => {
    setTimeRemaining(30)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-8">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Verificación de Dos Factores
            </h3>
            <p className="text-gray-600">
              Ingresa el código de 6 dígitos de Microsoft Authenticator
            </p>
          </div>

          <div className="space-y-6">
            {/* Input del código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de verificación
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  className="flex-1 px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength="6"
                  disabled={isLoading || attempts >= maxAttempts}
                />
                <div className="text-sm text-gray-500">
                  <div className="font-medium">Tiempo restante:</div>
                  <div className="text-2xl font-mono text-blue-600">
                    {TwoFactorAuthService.formatTimeRemaining(timeRemaining)}s
                  </div>
                </div>
              </div>
            </div>

            {/* Timer refresh button */}
            <div className="text-center">
              <button
                onClick={refreshTimer}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualizar timer
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Backup codes option */}
            <div className="text-center">
              <button
                onClick={handleBackupCode}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                ¿No tienes acceso a tu dispositivo? Usa un código de respaldo
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyToken}
                disabled={!token || token.length !== 6 || isLoading || attempts >= maxAttempts}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </button>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <Shield className="w-4 h-4 inline mr-1" />
              Esta verificación es requerida para acceder al panel de Super Administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorVerification
