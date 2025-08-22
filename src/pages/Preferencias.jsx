import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'
import { Settings, Bell, Globe, Palette, CheckCircle, AlertCircle } from 'lucide-react'

const Preferencias = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
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

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Acceso Denegado</h2>
          <p className="text-secondary-600">Debes iniciar sesión para acceder a tus preferencias.</p>
        </div>
      </div>
    )
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
      
      // Aquí iría la llamada a la API para guardar las preferencias
      // await userService.actualizarPreferencias({
      //   notifications: notificationSettings,
      //   language: languageSettings,
      //   theme: themeSettings
      // })
      
      setSuccess('Preferencias guardadas exitosamente')
    } catch (error) {
      setError(error.message || 'Error al guardar las preferencias')
    } finally {
      setLoading(false)
    }
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

            {/* Recordatorios de Clases */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Recordatorios de Clases</h3>
                <p className="text-xs text-secondary-600">Te avisamos antes de tus clases</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.classReminders}
                  onChange={(e) => handleNotificationChange('classReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notificaciones de Pagos */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-secondary-900">Notificaciones de Pagos</h3>
                <p className="text-xs text-secondary-600">Información sobre transacciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.paymentNotifications}
                  onChange={(e) => handleNotificationChange('paymentNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferencias de Idioma y Región */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-secondary-900">Idioma y Región</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Idioma
              </label>
              <select
                value={languageSettings.language}
                onChange={(e) => handleLanguageChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Zona Horaria */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Zona Horaria
              </label>
              <select
                value={languageSettings.timezone}
                onChange={(e) => handleLanguageChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="America/Bogota">Colombia (GMT-5)</option>
                <option value="America/Mexico_City">México (GMT-6)</option>
                <option value="America/New_York">Nueva York (GMT-5)</option>
                <option value="Europe/Madrid">España (GMT+1)</option>
              </select>
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Moneda
              </label>
              <select
                value={languageSettings.currency}
                onChange={(e) => handleLanguageChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="COP">Peso Colombiano (COP)</option>
                <option value="USD">Dólar Estadounidense (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="MXN">Peso Mexicano (MXN)</option>
              </select>
            </div>

            {/* Formato de Fecha */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Formato de Fecha
              </label>
              <select
                value={languageSettings.dateFormat}
                onChange={(e) => handleLanguageChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferencias de Tema */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center mb-6">
            <Palette className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-secondary-900">Apariencia</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tema
              </label>
              <select
                value={themeSettings.theme}
                onChange={(e) => handleThemeChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            {/* Tamaño de Fuente */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tamaño de Fuente
              </label>
              <select
                value={themeSettings.fontSize}
                onChange={(e) => handleThemeChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>

            {/* Esquema de Colores */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Esquema de Colores
              </label>
              <select
                value={themeSettings.colorScheme}
                onChange={(e) => handleThemeChange('colorScheme', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="default">Predeterminado</option>
                <option value="highContrast">Alto Contraste</option>
                <option value="colorBlind">Daltónico</option>
              </select>
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
