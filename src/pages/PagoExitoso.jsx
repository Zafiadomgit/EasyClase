import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react'

const PagoExitoso = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [reservaData, setReservaData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar datos de la reserva desde localStorage
    const reserva = localStorage.getItem('reservaPendiente')
    if (reserva) {
      try {
        const data = JSON.parse(reserva)
        setReservaData(data)
        
        // Crear la reserva en la base de datos
        crearReserva(data)
      } catch (error) {
        console.error('Error parseando datos de reserva:', error)
      }
    }
    setLoading(false)
  }, [])

  const crearReserva = async (data) => {
    try {
      const response = await fetch('/api/reservar-clase.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
        },
        body: JSON.stringify({
          claseId: data.claseId,
          estudianteId: data.estudianteId,
          fecha: data.fecha,
          hora: data.hora,
          comentarios: data.comentarios
        })
      })

      const result = await response.json()

      if (result.success) {
        // Limpiar datos de reserva pendiente
        localStorage.removeItem('reservaPendiente')
        console.log('Reserva creada exitosamente')
      } else {
        console.error('Error creando reserva:', result.message)
      }
    } catch (error) {
      console.error('Error creando reserva:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Tu pago ha sido procesado correctamente
            </p>

            {reservaData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles de tu Reserva
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      <strong>Clase:</strong> {reservaData.titulo}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      <strong>Fecha:</strong> {new Date(reservaData.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      <strong>Hora:</strong> {reservaData.hora}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      <strong>Precio:</strong> ${reservaData.precio.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-600">
                El profesor te contactará pronto para coordinar los detalles de la clase.
              </p>
              
              <button
                onClick={() => navigate('/mis-reservas')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

export default PagoExitoso
