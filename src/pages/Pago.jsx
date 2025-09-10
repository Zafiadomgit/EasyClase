import React, { useState, useEffect } from 'react'

const Pago = () => {
  const [step, setStep] = useState(1)
  const [reservaData, setReservaData] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    monto: 0
  })

  // Cargar datos de la reserva desde localStorage
  useEffect(() => {
    const reserva = localStorage.getItem('reservaPendiente')
    if (reserva) {
      try {
        const data = JSON.parse(reserva)
        setReservaData(data)
        
        // Calcular el precio total basado en duración y precio por hora
        const duracionHoras = data.duracionHoras || 1 // Por defecto 1 hora
        const precioPorHora = data.precioPorHora || data.precio || 0
        const precioTotal = precioPorHora * duracionHoras
        
        // Pre-llenar el monto con el precio total calculado
        setFormData(prev => ({
          ...prev,
          monto: precioTotal
        }))
        console.log('Datos de reserva cargados:', data)
        console.log(`Cálculo: ${duracionHoras} horas × $${precioPorHora} = $${precioTotal}`)
      } catch (error) {
        console.error('Error al parsear datos de reserva:', error)
      }
    } else {
      console.log('No se encontraron datos de reserva en localStorage')
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePayment = () => {
    setStep(3)
  }

  // Si no hay datos de reserva, mostrar mensaje
  if (!reservaData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ⚠️ No hay reserva pendiente
              </h1>
              <p className="text-gray-600 mb-6">
                No se encontraron datos de reserva. Por favor, regresa a la página de reserva para continuar.
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Volver a la Reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                💳 Proceso de Pago
              </h1>
              <p className="text-gray-600">
                Completa la información para continuar
              </p>
            </div>

            {/* Información de la reserva */}
            {reservaData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  📚 Detalles de la Clase
                </h3>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Servicio:</strong> {reservaData.servicioTitulo || 'Clase General'}</p>
                  <p><strong>Categoría:</strong> {reservaData.servicioCategoria || 'General'}</p>
                  <p><strong>Profesor:</strong> {reservaData.profesorNombre}</p>
                  <p><strong>Fecha:</strong> {reservaData.fecha}</p>
                  <p><strong>Hora:</strong> {reservaData.hora}</p>
                  <p><strong>Tipo:</strong> {reservaData.tipoAgenda === 'individual' ? 'Clase Individual' : 'Clase Grupal'}</p>
                  <p><strong>Duración:</strong> {reservaData.duracionHoras || 1} hora(s)</p>
                  <p><strong>Precio por hora:</strong> ${(reservaData.precioPorHora || reservaData.precio || 0).toLocaleString()}</p>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <p className="font-bold text-lg"><strong>Total a pagar:</strong> ${formData.monto?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto a pagar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`$${formData.monto?.toLocaleString() || '0'}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                    readOnly
                    disabled
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">💰</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Este monto es fijo y no se puede modificar
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar al Pago
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                💳 Resumen del Pago
              </h1>
              <p className="text-gray-600">
                Revisa la información antes de proceder
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Información del Cliente
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Teléfono:</strong> {formData.telefono}</p>
                <p><strong>Monto:</strong> ${formData.monto?.toLocaleString()}</p>
              </div>
            </div>

            {/* Detalles de la clase en el resumen */}
            {reservaData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  📚 Resumen de la Clase
                </h3>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Servicio:</strong> {reservaData.servicioTitulo || 'Clase General'}</p>
                  <p><strong>Categoría:</strong> {reservaData.servicioCategoria || 'General'}</p>
                  <p><strong>Profesor:</strong> {reservaData.profesorNombre}</p>
                  <p><strong>Fecha:</strong> {reservaData.fecha}</p>
                  <p><strong>Hora:</strong> {reservaData.hora}</p>
                  <p><strong>Tipo:</strong> {reservaData.tipoAgenda === 'individual' ? 'Clase Individual' : 'Clase Grupal'}</p>
                  <p><strong>Duración:</strong> {reservaData.duracionHoras || 1} hora(s)</p>
                  <p><strong>Precio por hora:</strong> ${(reservaData.precioPorHora || reservaData.precio || 0).toLocaleString()}</p>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <p className="font-bold text-lg"><strong>Total a pagar:</strong> ${formData.monto?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                ✅ ¡Pago Exitoso!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Tu pago ha sido procesado correctamente
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Detalles del Pago
                </h3>
                <div className="space-y-2 text-green-700">
                  <p><strong>Cliente:</strong> {formData.nombre}</p>
                  <p><strong>Monto:</strong> ${formData.monto}</p>
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                  <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep(1)
                  setFormData({ nombre: '', email: '', telefono: '', monto: 0 })
                }}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Realizar Otro Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Pago
