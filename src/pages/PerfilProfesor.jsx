import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const PerfilProfesor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profesor, setProfesor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarPerfilProfesor()
  }, [id])

  const cargarPerfilProfesor = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profesores/perfil.php?id=${id}`)
      const data = await response.json()
      
      if (data.success) {
        setProfesor(data.data.profesor)
      } else {
        setError('Error al cargar el perfil del profesor')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar el perfil del profesor')
    } finally {
      setLoading(false)
    }
  }

  const reservarClase = () => {
    navigate(`/reservar/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
              </div>
    )
  }

  if (error || !profesor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profesor no encontrado'}</p>
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
        {/* Header del perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={profesor.avatarUrl}
              alt={profesor.nombre}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{profesor.nombre}</h1>
                {profesor.esPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Premium
                      </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  ⭐ {profesor.calificacionPromedio} ({profesor.totalResenas} reseñas)
                </span>
                <span>📚 {profesor.totalClases} clases</span>
                <span>👥 {profesor.estudiantesAyudados} estudiantes</span>
              </div>
              <p className="text-gray-700 mb-4">{profesor.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {profesor.especialidades.map((especialidad, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {especialidad}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  ${profesor.precioHora.toLocaleString()}/hora
                </div>
              <button
                  onClick={reservarClase}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Reservar Clase
              </button>
              </div>
          </div>
        </div>
      </div>

        {/* Disponibilidad */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Disponibilidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(profesor.disponibilidad).map(([dia, horarios]) => (
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

        {/* Reseñas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reseñas</h2>
            <div className="space-y-4">
            {profesor.reseñas.map((reseña) => (
              <div key={reseña.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{reseña.estudiante}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(reseña.calificacion)}
                    </div>
                    <span className="text-sm text-gray-500">{reseña.fecha}</span>
                  </div>
                </div>
                <p className="text-gray-700">{reseña.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilProfesor