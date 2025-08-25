import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react'

const MercadoPagoSimulado = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState('loading') // loading, form, processing, success, error
  const [paymentData, setPaymentData] = useState(null)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiration: '',
    cvv: '',
    email: ''
  })

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setStep('form')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    let value = e.target.value
    const name = e.target.name

    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      value = value.substring(0, 19)
    }

    // Formatear fecha de expiración
    if (name === 'expiration') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5)
    }

    // Limitar CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4)
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('processing')

    // Simular procesamiento
    setTimeout(() => {
      // Simular éxito
      setStep('success')
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/pago/success', {
          state: {
            payment_id: Date.now(),
            status: 'approved',
            external_reference: 'reserva_123'
          }
        })
      }, 3000)
    }, 3000)
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conectando con MercadoPago</h2>
          <p className="text-gray-600">Preparando tu pago seguro...</p>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <span className="font-bold text-lg">MP</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MercadoPago</h1>
            </div>
            <p className="text-gray-600">Pago seguro con tarjetas, efectivo y más</p>
          </div>

          {/* Formulario de pago */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Detalles del pago</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Clase con Profesor</span>
                  <span className="font-semibold">$35.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Comisión</span>
                  <span className="text-gray-500">Incluida</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-lg">$35.000</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de tarjeta *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del titular *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento *
                  </label>
                  <input
                    type="text"
                    name="expiration"
                    value={formData.expiration}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Lock className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Pago seguro</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Tus datos están protegidos con encriptación SSL de 256 bits
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Pagar $35.000
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/pago')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver a métodos de pago
              </button>
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              MercadoPago - Pago seguro y confiable
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Procesando tu pago</h2>
          <p className="text-gray-600">Por favor, no cierres esta ventana...</p>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Pago exitoso!</h2>
          <p className="text-gray-600">Redirigiendo a EasyClase...</p>
        </div>
      </div>
    )
  }

  return null
}

export default MercadoPagoSimulado
