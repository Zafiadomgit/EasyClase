import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react'

const PagoExitoso = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [reservaData, setReservaData] = useState(null)
  const [estadoPago, setEstadoPago] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mostrar los datos de la reserva guardados antes de ir a pagar.
    const reserva = localStorage.getItem('reservaPendiente')
    let pendiente = null
    if (reserva) {
      try {
        pendiente = JSON.parse(reserva)
        setReservaData(pendiente)
      } catch (error) {
        console.error('Error parseando datos de reserva:', error)
      }
    }

    // Confirmar el estado del pago con el backend si Mercado Pago devolvió el id.
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
    if (paymentId) {
      fetch(`/api/pagos/${paymentId}`)
        .then(r => r.json())
        .then(d => { if (d.success) setEstadoPago(d.data.status) })
        .catch(() => {})
    }

    // Marcar como programadas las clases que estaban pendientes de pago y limpiar
    // la reserva pendiente para no reprocesarla.
    if (pendiente) {
      try {
        const clases = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
        const actualizadas = clases.map(c =>
          c.estado === 'pendiente_pago' ? { ...c, estado: 'programada' } : c
        )
        localStorage.setItem('misClasesEstudiante', JSON.stringify(actualizadas))
      } catch (e) {
        console.error('Error actualizando mis clases:', e)
      }
      localStorage.removeItem('reservaPendiente')
    }

    setLoading(false)
  }, [])

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
            
            <p className="text-gray-600 mb-2">
              Tu pago ha sido procesado correctamente
            </p>
            {estadoPago && (
              <p className="text-sm text-gray-500 mb-8">
                Estado del pago: <strong>{estadoPago === 'approved' ? 'Aprobado' : estadoPago}</strong>
              </p>
            )}

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
