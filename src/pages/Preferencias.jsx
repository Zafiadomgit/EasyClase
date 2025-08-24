import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Preferencias = () => {
  const { user } = useAuth()

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
      </div>
    </div>
  )
}

export default Preferencias
