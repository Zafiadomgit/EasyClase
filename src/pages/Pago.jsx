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
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos de la reserva desde localStorage
  useEffect(() => {
    const reserva = localStorage.getItem('reservaPendiente')
    if (reserva) {
      try {
        const data = JSON.parse(reserva)
        setReservaData(data)
        
        // Calcular el precio total basado en duración y precio por hora
        const duracionHoras = data.duracion || 1 // Usar duracion del objeto
        const precioPorHora = data.precio || 0
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

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      // Crear preferencia de MercadoPago
      const response = await fetch('/api/crear-preferencia-mercadopago-MINIMAL.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
        },
        body: JSON.stringify({
          titulo: reservaData.titulo,
          precio: formData.monto,
          descripcion: `Reserva de clase: ${reservaData.titulo}`,
          reservaData: reservaData
        })
      })

      const data = await response.json()

      if (data.success && data.init_point) {
        // Redirigir a MercadoPago
        window.location.href = data.init_point
      } else {
        alert('Error al crear el pago: ' + (data.message || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error)
      alert('Error al procesar el pago')
    } finally {
      setIsLoading(false)
    }
  }

  // Si no hay datos de reserva, mostrar mensaje
  if (!reservaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              No hay reserva pendiente
              </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
                No se encontraron datos de reserva. Por favor, regresa a la página de reserva para continuar.
              </p>
              <button
                onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Volver a la Reserva
              </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        </div>
        
        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header elegante */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                Información de Pago
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
                Completa tus datos para procesar el pago de forma segura y elegante
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Sidebar elegante */}
              <div className="xl:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sticky top-8 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Detalles de la Clase</h3>
                      <p className="text-purple-200">Resumen de tu reserva</p>
                    </div>
                  </div>

            {reservaData && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Servicio</span>
                        <span className="text-white font-semibold">{reservaData.servicioTitulo || 'Clase General'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Categoría</span>
                        <span className="text-white font-semibold">{reservaData.servicioCategoria || 'General'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Profesor</span>
                        <span className="text-white font-semibold">{reservaData.profesorNombre || 'Por asignar'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Fecha</span>
                        <span className="text-white font-semibold">{reservaData.fecha}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Hora</span>
                        <span className="text-white font-semibold">{reservaData.hora}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Tipo</span>
                        <span className="text-white font-semibold">{reservaData.tipoAgenda === 'individual' ? 'Individual' : 'Grupal'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Duración</span>
                        <span className="text-white font-semibold">{reservaData.duracionHoras || 1} hora(s)</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-purple-200 font-medium">Precio/hora</span>
                        <span className="text-white font-semibold">${(reservaData.precioPorHora || reservaData.precio || 0).toLocaleString()}</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mt-6 border border-purple-400/30">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-white">Total a pagar</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                            ${formData.monto?.toLocaleString()}
                          </span>
                  </div>
                </div>
              </div>
            )}
                </div>
              </div>

              {/* Formulario principal */}
              <div className="xl:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-lg font-semibold text-white mb-4">
                  Nombre completo
                </label>
                        <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="Ingresa tu nombre completo"
                  required
                />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
              </div>

              <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                  Email
                </label>
                        <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="tu@email.com"
                  required
                />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
              </div>

              <div>
                        <label className="block text-lg font-semibold text-white mb-4">
                  Teléfono
                </label>
                        <div className="relative">
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="+57 300 123 4567"
                  required
                />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                        </div>
                      </div>
              </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/30">
                      <label className="block text-lg font-semibold text-white mb-4">
                  Monto a pagar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`$${formData.monto?.toLocaleString() || '0'}`}
                          className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white font-bold text-2xl text-center backdrop-blur-sm"
                    readOnly
                    disabled
                  />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                  </div>
                </div>
                      <p className="text-purple-200 mt-3 text-center">
                  Este monto es fijo y no se puede modificar
                </p>
              </div>

              <button
                type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 px-8 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 hover:scale-105"
              >
                      <span className="flex items-center justify-center">
                Continuar al Pago
                        <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
              </button>
            </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        </div>
        
        <div className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header elegante */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                Resumen del Pago
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
                Revisa toda la información antes de proceder con el pago
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Sidebar elegante */}
              <div className="xl:col-span-1">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sticky top-8 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Información del Cliente</h3>
                      <p className="text-purple-200">Datos de facturación</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-purple-200 font-medium">Nombre</span>
                      <span className="text-white font-semibold">{formData.nombre}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-purple-200 font-medium">Email</span>
                      <span className="text-white font-semibold">{formData.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-purple-200 font-medium">Teléfono</span>
                      <span className="text-white font-semibold">{formData.telefono}</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 mt-6 border border-green-400/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-white">Monto</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          ${formData.monto?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

              {/* Resumen principal */}
              <div className="xl:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
                  {/* Detalles de la clase */}
            {reservaData && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 mb-10 border border-purple-400/30">
                      <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Resumen de la Clase</h3>
                          <p className="text-purple-200">Detalles de tu reserva</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Servicio</span>
                            <span className="text-white font-semibold">{reservaData.servicioTitulo || 'Clase General'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Categoría</span>
                            <span className="text-white font-semibold">{reservaData.servicioCategoria || 'General'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Profesor</span>
                            <span className="text-white font-semibold">{reservaData.profesorNombre || 'Por asignar'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Fecha</span>
                            <span className="text-white font-semibold">{reservaData.fecha}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Hora</span>
                            <span className="text-white font-semibold">{reservaData.hora}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Tipo</span>
                            <span className="text-white font-semibold">{reservaData.tipoAgenda === 'individual' ? 'Individual' : 'Grupal'}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Duración</span>
                            <span className="text-white font-semibold">{reservaData.duracionHoras || 1} hora(s)</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="text-purple-200 font-medium">Precio/hora</span>
                            <span className="text-white font-semibold">${(reservaData.precioPorHora || reservaData.precio || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/20 rounded-2xl p-6 mt-8 border border-white/30">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-white">Total a pagar</span>
                          <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                            ${formData.monto?.toLocaleString()}
                          </span>
                  </div>
                </div>
              </div>
            )}

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setStep(1)}
                      className="flex-1 bg-white/10 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm"
              >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                Volver
                      </span>
              </button>
              <button
                onClick={handlePayment}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                Proceder al Pago
                          <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      )}
              </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center shadow-2xl">
            {/* Icono de éxito animado */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Efecto de ondas */}
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-full mx-auto animate-ping"></div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full mx-auto animate-ping delay-500"></div>
              </div>
              
            {/* Título principal */}
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              ¡Pago Exitoso!
              </h1>
            <p className="text-2xl text-purple-200 mb-12 leading-relaxed">
              Tu reserva ha sido confirmada exitosamente
            </p>
            
            {/* Resumen del pago */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl p-8 mb-12 border border-green-400/30 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-white">Total pagado</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  ${formData.monto?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-center text-purple-200">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">
                  Recibirás un email de confirmación en {formData.email}
                </span>
                </div>
              </div>

            {/* Botones de acción */}
            <div className="space-y-6">
              <button
                onClick={() => navigate('/mis-clases')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-10 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  Ver Mis Clases
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white/10 text-white py-6 px-10 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Volver al Inicio
                </span>
              </button>
            </div>

            {/* Mensaje adicional */}
            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-purple-200 text-lg">
                ¡Gracias por confiar en nosotros! Tu clase está programada y lista para comenzar.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Pago
