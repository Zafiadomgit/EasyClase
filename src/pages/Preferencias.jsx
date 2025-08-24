import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'

const Preferencias = () => {
  const { user } = useAuth()
  const [testState, setTestState] = useState('Estado inicial')
  const [useEffectTest, setUseEffectTest] = useState('Esperando...')
  const [loading, setLoading] = useState(false)
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

  const cambiarEstado = () => {
    setTestState('Estado cambiado!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Preferencias</h1>
        <p className="text-lg text-gray-600">
          Página de preferencias funcionando correctamente
        </p>
        <div className="mt-8 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">
            ✅ Si ves esto, el componente funciona correctamente
          </p>
        </div>
        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">
            🔍 Usuario: {user ? user.name || 'Conectado' : 'No conectado'}
          </p>
        </div>
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800">
            🧪 Estado: {testState}
          </p>
          <button 
            onClick={cambiarEstado}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Cambiar Estado
          </button>
        </div>
        <div className="mt-4 p-4 bg-purple-100 rounded-lg">
          <p className="text-purple-800">
            🔄 useEffect: {useEffectTest}
          </p>
        </div>
        <div className="mt-4 p-4 bg-orange-100 rounded-lg">
          <p className="text-orange-800">
            🔔 Notificaciones: {notificationSettings.emailNotifications ? 'Activadas' : 'Desactivadas'}
          </p>
        </div>
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">
            📡 API: {loading ? 'Cargando...' : error ? error : 'Cargado correctamente'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Preferencias
