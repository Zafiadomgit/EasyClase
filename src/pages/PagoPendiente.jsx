import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'

const PagoPendiente = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pago Pendiente
            </h1>
            
            <p className="text-gray-600 mb-8">
              Tu pago está siendo procesado. Te notificaremos cuando se complete.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/mis-reservas')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Ver Mis Reservas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoPendiente
