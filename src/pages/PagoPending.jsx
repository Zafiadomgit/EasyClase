import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft, CheckCircle } from 'lucide-react'

const PagoPending = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(location.search)
    const paymentId = urlParams.get('payment_id')
    const status = urlParams.get('status')
    const externalReference = urlParams.get('external_reference')

    if (paymentId) {
      setPaymentDetails({
        paymentId,
        status,
        externalReference
      })
    }
  }, [location])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Clock className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Pago en Proceso
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {paymentDetails && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Detalles del Pago
                </h3>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">ID del Pago:</span>
                    <span className="text-sm text-gray-900">{paymentDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className="text-sm text-yellow-600 font-medium">{paymentDetails.status}</span>
                  </div>
                  {paymentDetails.externalReference && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Referencia:</span>
                      <span className="text-sm text-gray-900">{paymentDetails.externalReference}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  ¿Qué significa esto?
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Tu pago está siendo revisado por el banco</li>
                  <li>• Puede tomar hasta 24 horas en procesarse</li>
                  <li>• Recibirás una notificación cuando se complete</li>
                  <li>• Tu clase se confirmará automáticamente</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      No te preocupes
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Tu dinero está seguro y la clase se reservará automáticamente cuando el pago se confirme.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoDashboard}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ir al Dashboard
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Si tienes preguntas, contacta a nuestro soporte técnico
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagoPending
