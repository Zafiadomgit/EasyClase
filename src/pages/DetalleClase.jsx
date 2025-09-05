import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const DetalleClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clase, setClase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDetalleClase()
  }, [id])

  const cargarDetalleClase = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clases/reservar.php?id=${id}`)
      const data = await response.json()
      
      if (data.success) {
        setClase(data.data.clase)
      } else {
        setError('Error al cargar el detalle de la clase')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar el detalle de la clase')
    } finally {
      setLoading(false)
    }
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
            onClick={() => navigate('/buscar')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a buscar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Detalle de la Clase</h1>
          
          {/* Información del profesor */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profesor</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {clase.profesor.nombre.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{clase.profesor.nombre}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    ⭐ {clase.profesor.calificacionPromedio} ({clase.profesor.totalResenas} reseñas)
                  </span>
                  <span>${clase.profesor.precioHora.toLocaleString()}/hora</span>
                  {clase.profesor.esPremium && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {clase.profesor.especialidades.map((especialidad, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {especialidad}
                </span>
              ))}
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Horarios Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(clase.disponibilidad).map(([dia, horarios]) => (
                <div key={dia} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 capitalize mb-2">{dia}</h3>
                  <div className="space-y-1">
                    {horarios.map((horario, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                      >
                        {horario}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              onClick={() => navigate(`/profesor/${id}`)}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Ver Perfil Completo
            </button>
            <button
              onClick={() => navigate(`/reservar/${id}`)}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Reservar Clase
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleClase