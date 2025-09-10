import React, { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertCircle, Copy, Download, Eye, EyeOff } from 'lucide-react'
import QRCode from 'react-qr-code'
import TwoFactorAuthService from '../../services/twoFactorAuthSimple'

const TwoFactorSetup = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1) // 1: Setup, 2: Verify, 3: Backup codes
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [testToken, setTestToken] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)

  useEffect(() => {
    // Generar secreto al montar el componente
    const userEmail = 'admin@easyclase.com' // Super admin email
    const twoFAData = TwoFactorAuthService.generateSecret(userEmail)
    
    setSecret(twoFAData.secret)
    setQrCodeUrl(twoFAData.qrCodeUrl)
    
    // Generar códigos de respaldo
    const codes = TwoFactorAuthService.generateBackupCodes()
    setBackupCodes(codes)
  }, [])

  // Timer para mostrar tiempo restante
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = TwoFactorAuthService.getTimeRemaining()
      setTimeRemaining(remaining)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerifyToken = () => {
    if (!testToken || testToken.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      return
    }

    const verification = TwoFactorAuthService.verifyToken(secret, testToken)
    
    if (verification.verified) {
      setSuccess('¡Código verificado correctamente!')
      setError('')
      setStep(3) // Mostrar códigos de respaldo
    } else {
      setError('Código inválido. Intenta nuevamente.')
      setTestToken('')
    }
  }

  const handleCompleteSetup = () => {
    // Guardar configuración 2FA
    const config = TwoFactorAuthService.save2FAConfig('admin', secret, backupCodes)
    
    setSuccess('¡2FA configurado exitosamente!')
    setTimeout(() => {
      onComplete(config)
    }, 2000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copiado al portapapeles')
    setTimeout(() => setSuccess(''), 3000)
  }

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n')
    const blob = new Blob([codesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'easyclase-2fa-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Configurar Autenticación de Dos Factores
        </h3>
        <p className="text-gray-600">
          Escanea el código QR con Microsoft Authenticator para agregar una capa extra de seguridad
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Paso 1: Escanea el código QR</h4>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <QRCode 
                value={qrCodeUrl}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Instrucciones:</h5>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Abre Microsoft Authenticator en tu dispositivo</li>
                <li>Toca "Agregar cuenta"</li>
                <li>Selecciona "Cuenta profesional o educativa"</li>
                <li>Escanea este código QR</li>
                <li>O ingresa manualmente la clave secreta</li>
              </ol>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clave secreta (si prefieres ingresar manualmente):
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={secret}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-r-md hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Verificar Configuración
        </h3>
        <p className="text-gray-600">
          Ingresa el código de 6 dígitos que aparece en Microsoft Authenticator
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de verificación
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={testToken}
              onChange={(e) => setTestToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="flex-1 px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="6"
            />
            <div className="text-sm text-gray-500">
              <div className="font-medium">Tiempo restante:</div>
              <div className="text-2xl font-mono text-blue-600">
                {TwoFactorAuthService.formatTimeRemaining(timeRemaining)}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Atrás
        </button>
        <button
          onClick={handleVerifyToken}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Verificar
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Códigos de Respaldo
        </h3>
        <p className="text-gray-600">
          Guarda estos códigos en un lugar seguro. Úsalos si pierdes acceso a tu dispositivo
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
          <p className="text-sm text-yellow-700">
            <strong>Importante:</strong> Cada código solo se puede usar una vez. 
            Descarga y guarda estos códigos en un lugar seguro.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-900">Códigos de respaldo</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={downloadBackupCodes}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-white p-3 rounded border text-center font-mono text-sm">
              {showBackupCodes ? code : '••••••'}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCompleteSetup}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Completar Configuración
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TwoFactorSetup
