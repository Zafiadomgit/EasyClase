import React, { useState, useEffect } from 'react'
import { Calendar, Clock, DollarSign, User, MessageCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatPrecio, formatPrecioPorHora } from '../../utils/currencyUtils'
import { useAuth } from '../../contexts/AuthContext'

const MisReservas = () => {
  const { user } = useAuth()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      cargarReservas()
    }
  }, [user])

  const cargarReservas = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/reservar-clase.php?estudianteId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setReservas(data.data.reservas || [])
      } else {
        setError(data.message || 'Error al cargar las reservas')
      }
    } catch (error) {
      console.error('Error cargando reservas:', error)
      setError('Error al cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmada':
        return 'bg-green-100 text-green-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      case 'completada':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <AlertCircle className="w-4 h-4" />
      case 'confirmada':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelada':
        return <XCircle className="w-4 h-4" />
      case 'completada':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente de confirmación'
      case 'confirmada':
        return 'Confirmada'
      case 'cancelada':
        return 'Cancelada'
      case 'completada':
        return 'Completada'
      default:
        return estado
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={cargarReservas}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">
            Gestiona y revisa el estado de todas tus reservas de clases
          </p>
        </div>

        {reservas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservas</h3>
            <p className="text-gray-600 mb-6">
              Cuando reserves una clase, aparecerá aquí
            </p>
            <a
              href="/buscar"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Buscar Clases
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {reserva.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {reserva.materia} • {reserva.categoria}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      {reserva.descripcion}
                    </p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getEstadoColor(reserva.estado)}`}>
                    {getEstadoIcon(reserva.estado)}
                    {getEstadoTexto(reserva.estado)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Fecha:</span>
                    <span className="ml-1">{new Date(reserva.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Hora:</span>
                    <span className="ml-1">{reserva.hora}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Precio:</span>
                    <span className="ml-1">{formatPrecioPorHora(reserva.precio)}</span>
                  </div>
                </div>

                {reserva.comentarios && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <MessageCircle className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Comentarios:</p>
                        <p className="text-sm text-gray-600">{reserva.comentarios}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Reserva creada el {new Date(reserva.created_at).toLocaleDateString('es-ES')}
                  </div>
                  
                  {reserva.estado === 'pendiente' && (
                    <div className="text-sm text-gray-600">
                      El profesor revisará tu solicitud pronto
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisReservas
