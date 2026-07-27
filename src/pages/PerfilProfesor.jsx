import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const PerfilProfesor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profesor, setProfesor] = useState(null)
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviandoReview, setEnviandoReview] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  useEffect(() => {
    cargarPerfilProfesor()
  }, [id])

  const cargarPerfilProfesor = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profesores/${id}`)
      const data = await response.json()

      if (data.success) {
        setProfesor(data.data.profesor)
        // Cargar servicios del profesor
        await cargarServiciosProfesor()
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

  const cargarServiciosProfesor = async () => {
    // Los servicios se habilitan en una fase posterior; por ahora no hay endpoint.
    setServicios([])
  }

  const reservarServicio = (servicioId) => {
    navigate(`/reservar/${id}?servicio=${servicioId}`)
  }

  const enviarResena = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) { setReviewMsg('Debes iniciar sesión para dejar una reseña'); return }
    try {
      setEnviandoReview(true)
      setReviewMsg('')
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ profesorId: id, calificacion: nuevaCalificacion, comentario: nuevoComentario })
      })
      const data = await response.json()
      if (data.success) {
        setNuevoComentario('')
        setNuevaCalificacion(5)
        setReviewMsg('¡Gracias por tu reseña!')
        await cargarPerfilProfesor()
      } else {
        setReviewMsg(data.message || 'No se pudo publicar la reseña')
      }
    } catch (err) {
      setReviewMsg('Error al publicar la reseña')
    } finally {
      setEnviandoReview(false)
    }
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
              </div>
          </div>
        </div>
      </div>

        {/* Clases del Profesor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎥 Clases Disponibles</h2>
          {(profesor.clases && profesor.clases.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profesor.clases.map((clase) => (
                <div key={clase.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{clase.titulo}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {clase.tipo === 'grupal' ? 'Grupal' : 'Individual'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{clase.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${clase.precio?.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">/hora</span>
                    </span>
                    <button
                      onClick={() => navigate(`/reservar/${id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Este profesor todavía no publicó clases.</p>
          )}
        </div>

        {/* Servicios del Profesor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Servicios Disponibles</h2>
          {servicios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{servicio.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-2">{servicio.categoria}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{servicio.descripcion}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <span className="mr-1">⏱️</span>
                        Por hora
                      </span>
                      <span className="flex items-center text-gray-600">
                        <span className="mr-1">👥</span>
                        {servicio.tipo === 'individual' ? 'Individual' : 
                         servicio.tipo === 'grupal' ? `Grupal (max ${servicio.maxEstudiantes})` : 
                         'Individual y Grupal'}
                      </span>
                    </div>
                  </div>

                  {/* Precios según el tipo */}
                  {servicio.tipo === 'individual' && (
                    <div className="mb-3">
                      <div className="text-lg font-bold text-green-600">
                        ${servicio.precioIndividual?.toLocaleString() || servicio.precio?.toLocaleString()} por hora
                      </div>
                    </div>
                  )}

                  {servicio.tipo === 'grupal' && (
                    <div className="mb-3">
                      <div className="text-lg font-bold text-green-600">
                        ${servicio.precioGrupal?.toLocaleString() || servicio.precio?.toLocaleString()} por hora
                      </div>
                    </div>
                  )}

                  {servicio.tipo === 'ambos' && (
                    <div className="mb-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Individual:</span>
                        <span className="font-bold text-green-600">
                          ${servicio.precioIndividual?.toLocaleString() || 'No definido'} por hora
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Grupal:</span>
                        <span className="font-bold text-green-600">
                          ${servicio.precioGrupal?.toLocaleString() || 'No definido'} por hora
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => reservarServicio(servicio.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Reservar este Servicio
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Este profesor aún no ha creado servicios disponibles.</p>
            </div>
          )}
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

          {/* Formulario para dejar una reseña (usuarios logueados) */}
          {localStorage.getItem('token') && (
            <form onSubmit={enviarResena} className="mb-6 border-b pb-6">
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm font-medium text-gray-700">Tu calificación:</label>
                <select
                  value={nuevaCalificacion}
                  onChange={(e) => setNuevaCalificacion(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-2 py-1"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                  ))}
                </select>
              </div>
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows="3"
                placeholder="Escribí tu experiencia con este profesor..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={enviandoReview}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {enviandoReview ? 'Publicando...' : 'Publicar reseña'}
                </button>
                {reviewMsg && <span className="text-sm text-gray-600">{reviewMsg}</span>}
              </div>
            </form>
          )}

            <div className="space-y-4">
            {(profesor.reseñas || []).length === 0 && (
              <p className="text-gray-500 text-sm">Este profesor todavía no tiene reseñas.</p>
            )}
            {(profesor.reseñas || []).map((reseña) => (
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