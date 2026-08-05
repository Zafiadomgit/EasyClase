import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, DollarSign, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// Esta pantalla muestra el detalle de una clase ya reservada, que es lo que
// enlaza el panel. Antes pedía un perfil de profesor a un archivo .php que no
// existe en esta API, así que siempre mostraba "Error al cargar el detalle".
const DetalleClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clase, setClase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarDetalleClase = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/clases/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        })
        const data = await response.json()
        const detalle = data.data?.clase || data.clase

        if (data.success && detalle) {
          setClase(detalle)
        } else {
          setError(data.message || 'No se pudo cargar el detalle de la clase')
        }
      } catch (err) {
        console.error('Error:', err)
        setError('No se pudo cargar el detalle de la clase')
      } finally {
        setLoading(false)
      }
    }
    cargarDetalleClase()
  }, [id])

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(precio) || 0)

  const estadoVisual = {
    confirmada: { texto: 'Confirmada', clase: 'bg-green-100 text-green-800', Icono: CheckCircle },
    pendiente: { texto: 'Pago pendiente', clase: 'bg-yellow-100 text-yellow-800', Icono: AlertCircle },
    cancelada: { texto: 'Cancelada', clase: 'bg-red-100 text-red-800', Icono: XCircle }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalle...</p>
        </div>
      </div>
    )
  }

  if (error || !clase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Clase no encontrada'}</p>
          <button
            onClick={() => navigate('/mis-clases')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Volver a mis clases
          </button>
        </div>
      </div>
    )
  }

  const estado = estadoVisual[clase.estado] || estadoVisual.pendiente
  const { Icono } = estado

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clase.titulo}</h1>
              {clase.materia && <p className="text-gray-600 mt-1">{clase.materia}</p>}
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estado.clase}`}>
              <Icono className="w-4 h-4 mr-1" />
              {estado.texto}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">{clase.fecha || 'Por definir'}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Hora y duración</p>
                <p className="font-medium text-gray-900">
                  {clase.hora || '--'} · {clase.duracion || 1}h
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Profesor</p>
                <p className="font-medium text-gray-900">{clase.profesor || 'Profesor'}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 flex items-center">
              <DollarSign className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Total pagado</p>
                <p className="font-medium text-gray-900">{formatPrecio(clase.precio)}</p>
              </div>
            </div>
          </div>

          {clase.descripcion && (
            <div className="border rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
              <p className="text-gray-700 text-sm">{clase.descripcion}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/mis-clases')}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Volver a mis clases
            </button>
            {clase.profesorId && (
              <button
                onClick={() => navigate(`/profesor/${clase.profesorId}`)}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Ver perfil del profesor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleClase
