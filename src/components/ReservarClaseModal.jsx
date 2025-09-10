import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, DollarSign, User, AlertCircle } from 'lucide-react'
import { compraService } from '../services/compraService'

const ReservarClaseModal = ({ isOpen, onClose, clase, onReservar }) => {
  const [fecha, setFecha] = useState('')
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && clase) {
      // Establecer fecha mínima (mañana)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFecha(tomorrow.toISOString().split('T')[0])
    }
  }, [isOpen, clase])

  useEffect(() => {
    if (fecha && clase) {
      cargarHorariosDisponibles()
    }
  }, [fecha, clase])

  const cargarHorariosDisponibles = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/reservas-clases/horarios-disponibles?claseId=${clase.id}&fecha=${fecha}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setHorariosDisponibles(data.data.horariosDisponibles || [])
      } else {
        setError(data.message || 'Error cargando horarios')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleReservar = async () => {
    if (!horarioSeleccionado) {
      setError('Selecciona un horario')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/reservas-clases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          claseId: clase.id,
          fecha: fecha,
          horaInicio: horarioSeleccionado.horaInicio,
          duracion: horarioSeleccionado.duracion
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Redirigir a MercadoPago
        window.location.href = data.data.pago.init_point
      } else {
        setError(data.message || 'Error creando reserva')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const formatDuracion = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`
    } else {
      const horas = Math.floor(minutos / 60)
      const mins = minutos % 60
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reservar Clase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información de la clase */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{clase.titulo}</h3>
            <p className="text-gray-600 mb-3">{clase.descripcion}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {clase.profesor?.nombre}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatPrecio(clase.precio)}/hora
              </div>
            </div>
          </div>

          {/* Selección de fecha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de la clase
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Horarios disponibles */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Horarios disponibles
            </label>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando horarios...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
                <button
                  onClick={cargarHorariosDisponibles}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Reintentar
                </button>
              </div>
            ) : horariosDisponibles.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {horariosDisponibles.map((horario, index) => (
                  <button
                    key={index}
                    onClick={() => setHorarioSeleccionado(horario)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      horarioSeleccionado?.horaInicio === horario.horaInicio
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">
                      {horario.horaInicio} - {horario.horaFin}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDuracion(horario.duracion)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resumen de la reserva */}
          {horarioSeleccionado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Resumen de la reserva</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Fecha: {new Date(fecha).toLocaleDateString('es-ES')}</div>
                <div>Hora: {horarioSeleccionado.horaInicio} - {horarioSeleccionado.horaFin}</div>
                <div>Duración: {formatDuracion(horarioSeleccionado.duracion)}</div>
                <div className="font-medium">
                  Precio: {formatPrecio(clase.precio * (horarioSeleccionado.duracion / 60))}
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleReservar}
              disabled={!horarioSeleccionado || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Reservar y Pagar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservarClaseModal
