import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, DollarSign, User, CheckCircle, AlertCircle, XCircle, Video, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// Detalle de una clase reservada. La pantalla se adapta a quién mira: el
// estudiante ve a su profesor y lo que pagó; el profesor ve a su estudiante y
// lo que va a cobrar. Antes mostraba siempre la versión del estudiante, así que
// un profesor se veía a sí mismo como "su profesor".
const DetalleClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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

        if (response.ok && data.success && detalle) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Cargando detalle...</p>
        </div>
      </div>
    )
  }

  if (error || !clase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-purple-100 mb-6">{error || 'Clase no encontrada'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Volver al panel
          </button>
        </div>
      </div>
    )
  }

  // Quién está mirando decide qué se muestra.
  const soyProfesor = Number(user?.id) === Number(clase.profesorId)
  const comision = 0.20
  const importeMostrado = soyProfesor
    ? Math.round((Number(clase.precio) || 0) * (1 - comision))
    : Number(clase.precio) || 0

  const estados = {
    confirmada: { texto: 'Pagada', clase: 'bg-green-500/20 text-green-200 border-green-400/40', Icono: CheckCircle },
    pendiente: { texto: 'Pago pendiente', clase: 'bg-amber-500/20 text-amber-200 border-amber-400/40', Icono: AlertCircle },
    cancelada: { texto: 'Cancelada', clase: 'bg-red-500/20 text-red-200 border-red-400/40', Icono: XCircle }
  }
  const estado = estados[clase.estado] || estados.pendiente
  const { Icono } = estado

  // La decisión del profesor es independiente del estado del pago.
  const decision = clase.estadoProfesor
  const rechazada = decision === 'rechazada'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(soyProfesor ? '/dashboard' : '/mis-clases')}
          className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {soyProfesor ? 'Volver al panel' : 'Volver a mis clases'}
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{clase.titulo}</h1>
              {clase.materia && <p className="text-purple-200 mt-1">{clase.materia}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${estado.clase}`}>
                <Icono className="w-4 h-4 mr-1.5" />
                {estado.texto}
              </span>
              {decision === 'aceptada' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-500/20 text-green-200 border-green-400/40">
                  Confirmada
                </span>
              )}
              {decision === 'pendiente' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-500/20 text-blue-200 border-blue-400/40">
                  {soyProfesor ? 'Pendiente de tu confirmación' : 'Esperando al profesor'}
                </span>
              )}
              {rechazada && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-red-500/20 text-red-200 border-red-400/40">
                  Rechazada
                </span>
              )}
            </div>
          </div>

          {rechazada && clase.motivoRechazo && (
            <div className="mb-8 rounded-xl border border-red-400/40 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-100 mb-1">Motivo del rechazo</p>
              <p className="text-sm text-red-100/90">{clase.motivoRechazo}</p>
              {!soyProfesor && (
                <p className="text-sm text-green-200 mt-3">
                  Se abonaron {formatPrecio(clase.precio)} a tu saldo para que tomes otra clase.
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="border border-white/20 bg-white/5 rounded-xl p-4 flex items-center">
              <Calendar className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <p className="text-xs text-purple-300">Fecha</p>
                <p className="font-medium text-white">{clase.fecha || 'Por definir'}</p>
              </div>
            </div>

            <div className="border border-white/20 bg-white/5 rounded-xl p-4 flex items-center">
              <Clock className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <p className="text-xs text-purple-300">Hora y duración</p>
                <p className="font-medium text-white">
                  {clase.hora || '--'} · {clase.duracion || 1}h
                </p>
              </div>
            </div>

            <div className="border border-white/20 bg-white/5 rounded-xl p-4 flex items-center">
              <User className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <p className="text-xs text-purple-300">{soyProfesor ? 'Estudiante' : 'Profesor'}</p>
                <p className="font-medium text-white">
                  {soyProfesor ? (clase.estudiante || 'Estudiante') : (clase.profesor || 'Profesor')}
                </p>
              </div>
            </div>

            <div className="border border-white/20 bg-white/5 rounded-xl p-4 flex items-center">
              <DollarSign className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <p className="text-xs text-purple-300">
                  {soyProfesor ? 'Recibes (neto)' : 'Total pagado'}
                </p>
                <p className="font-medium text-white">{formatPrecio(importeMostrado)}</p>
                {soyProfesor && (
                  <p className="text-xs text-purple-300 mt-0.5">
                    de {formatPrecio(clase.precio)} · comisión 20%
                  </p>
                )}
              </div>
            </div>
          </div>

          {clase.descripcion && (
            <div className="border border-white/20 bg-white/5 rounded-xl p-4 mb-8">
              <h2 className="font-semibold text-white mb-2">Descripción</h2>
              <p className="text-purple-200 text-sm">{clase.descripcion}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {!rechazada && clase.estado === 'confirmada' && (
              <button
                onClick={() => navigate(`/videollamada/${clase.id}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Video className="w-5 h-5" />
                Entrar a la clase
              </button>
            )}
            {!soyProfesor && clase.profesorId && (
              <button
                onClick={() => navigate(`/profesor/${clase.profesorId}`)}
                className="flex-1 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Ver perfil del profesor
              </button>
            )}
          </div>

          <p className="text-xs text-purple-300 mt-4 text-center">
            La videollamada se abre 10 minutos antes de la hora de la clase.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DetalleClase
