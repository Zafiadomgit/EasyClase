import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Preferencias = () => {
  const { user } = useAuth()
  const [testState, setTestState] = useState('Estado inicial')
  const [useEffectTest, setUseEffectTest] = useState('Esperando...')

  // useEffect básico para probar
  useEffect(() => {
    console.log('useEffect ejecutado - usuario:', user)
    setUseEffectTest('useEffect funcionando!')
  }, [user])

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
      </div>
    </div>
  )
}

export default Preferencias
