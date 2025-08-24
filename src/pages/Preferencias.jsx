import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'
import { Settings, Bell, Globe, Palette, CheckCircle, AlertCircle } from 'lucide-react'

const Preferencias = () => {
  const { user } = useAuth()
  const [testState, setTestState] = useState('Estado inicial')
  const [useEffectTest, setUseEffectTest] = useState('Esperando...')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Estados para preferencias de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    classReminders: true,
    paymentNotifications: true,
    marketingEmails: false
  })

  // Estados para preferencias de idioma y región
  const [languageSettings, setLanguageSettings] = useState({
    language: 'es',
    timezone: 'America/Bogota',
    currency: 'COP',
    dateFormat: 'DD/MM/YYYY'
  })

  // Estados para preferencias de tema
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'default'
  })

  // useEffect básico para probar
  useEffect(() => {
    console.log('useEffect ejecutado - usuario:', user)
    setUseEffectTest('useEffect funcionando!')
  }, [user])

  // useEffect para cargar preferencias
  useEffect(() => {
    if (user && user.id) {
      cargarPreferencias()
    }
  }, [user])

  const cargarPreferencias = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Intentando cargar preferencias...')
      
      const response = await userService.obtenerPreferencias()
      console.log('Respuesta de preferencias:', response)
      
      if (response && response.data) {
        const { notifications, language, theme } = response.data
        
        if (notifications) {
          setNotificationSettings(prev => ({ ...prev, ...notifications }))
        }
        if (language) {
          setLanguageSettings(prev => ({ ...prev, ...language }))
        }
        if (theme) {
          setThemeSettings(prev => ({ ...prev, ...theme }))
        }
      }
    } catch (error) {
      console.error('Error cargando preferencias:', error)
      setError('Error al cargar las preferencias. Usando valores por defecto.')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleLanguageChange = (setting, value) => {
    setLanguageSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleThemeChange = (setting, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const savePreferences = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const preferencias = {
        notifications: notificationSettings,
        language: languageSettings,
        theme: themeSettings
      }
      
      console.log('Guardando preferencias:', preferencias)
      await userService.actualizarPreferencias(preferencias)
      
      setSuccess('Preferencias guardadas exitosamente')
      console.log('Preferencias guardadas correctamente')
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error guardando preferencias:', error)
      setError(error.message || 'Error al guardar las preferencias')
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstado = () => {
    setTestState('Estado cambiado!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="w-8 h-8 text-secondary-600 mr-3" />
          <h1 className="text-3xl font-bold text-secondary-900">Preferencias</h1>
        </div>
        <p className="text-lg text-secondary-600">
          Personaliza tu experiencia y notificaciones
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

      {/* Cajas de prueba */}
      <div className="mb-8 space-y-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">✅ Si ves esto, el componente funciona correctamente</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">🔍 Usuario: {user ? user.name || 'Conectado' : 'No conectado'}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800">🧪 Estado: {testState}</p>
          <button onClick={cambiarEstado} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Cambiar Estado
          </button>
        </div>
        <div className="p-4 bg-purple-100 rounded-lg">
          <p className="text-purple-800">🔄 useEffect: {useEffectTest}</p>
        </div>
        <div className="p-4 bg-orange-100 rounded-lg">
          <p className="text-orange-800">🔔 Notificaciones: {notificationSettings.emailNotifications ? 'Activadas' : 'Desactivadas'}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">📡 API: {loading ? 'Cargando...' : error ? error : 'Cargado correctamente'}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Preferencias de Notificaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center mb-6">
            <Bell className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-secondary-900">Notificaciones</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notificaciones por Email */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Notificaciones por Email</h3>
                <p className="text-xs text-secondary-600">Recibe actualizaciones importantes por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notificaciones Push */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Notificaciones Push</h3>
                <p className="text-xs text-secondary-600">Recibe alertas en tiempo real</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            onClick={savePreferences}
            disabled={loading}
            className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Preferencias'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Preferencias
