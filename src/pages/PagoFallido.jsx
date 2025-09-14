import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

const PagoFallido = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pago Fallido
            </h1>
            
            <p className="text-gray-600 mb-8">
              No se pudo procesar tu pago. Por favor, intenta nuevamente.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/buscar')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a Buscar Clases
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoFallido
