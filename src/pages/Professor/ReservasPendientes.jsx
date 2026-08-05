import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, CheckCircle, XCircle, Inbox } from 'lucide-react'

// Solicitudes reales de clase: las que un estudiante ya pagó y esperan que el
// profesor las acepte o rechace. Antes esta pantalla mostraba reservas
// inventadas, que no correspondían a ningún estudiante.
const ReservasPendientes = ({ onCambio }) => {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(null)
  const [rechazando, setRechazando] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  const auth = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` })

  const cargarSolicitudes = async () => {
    try {
      setLoading(true)
      const r = await fetch('/api/clases/profesor/solicitudes', { headers: auth() })
      const d = await r.json()
      setSolicitudes(d.success ? (d.data?.solicitudes || d.solicitudes || []) : [])
    } catch (e) {
      console.error('Error cargando solicitudes:', e)
      setSolicitudes([])
    } finally {
      setLoading(false)
    }
  }

  const aceptar = async (solicitud) => {
    try {
      setProcesando(solicitud.id)
      setError('')
      const r = await fetch(`/api/clases/${solicitud.id}/aceptar`, { method: 'PUT', headers: auth() })
      const d = await r.json()
      if (r.ok && d.success) {
        setSolicitudes(prev => prev.filter(s => s.id !== solicitud.id))
        if (onCambio) onCambio()
      } else {
        setError(d.message || 'No se pudo aceptar la solicitud')
      }
    } catch (e) {
      setError('No se pudo aceptar la solicitud')
    } finally {
      setProcesando(null)
    }
  }

  const confirmarRechazo = async () => {
    if (motivo.trim().length < 10) {
      setError('Explica en al menos 10 caracteres por qué rechazas la clase.')
      return
    }
    try {
      setProcesando(rechazando.id)
      setError('')
      const r = await fetch(`/api/clases/${rechazando.id}/rechazar`, {
        method: 'PUT',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: motivo.trim() })
      })
      const d = await r.json()
      if (r.ok && d.success) {
        setSolicitudes(prev => prev.filter(s => s.id !== rechazando.id))
        setRechazando(null)
        setMotivo('')
        if (onCambio) onCambio()
      } else {
        setError(d.message || 'No se pudo rechazar la solicitud')
      }
    } catch (e) {
      setError('No se pudo rechazar la solicitud')
    } finally {
      setProcesando(null)
    }
  }

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(Number(precio) || 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div>
      {error && !rechazando && (
        <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {solicitudes.length === 0 ? (
        <div className="text-center py-10">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-purple-300/60" />
          <p className="text-purple-200">No tienes solicitudes pendientes</p>
          <p className="text-sm text-purple-300 mt-1">
            Aquí aparecerán las clases que los estudiantes te reserven.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((s) => (
            <div key={s.id} className="border border-white/20 rounded-xl p-4 bg-white/5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{s.titulo}</h3>
                  <div className="mt-2 space-y-1 text-sm text-purple-200">
                    <p className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-purple-300" />
                      {s.estudiante}
                    </p>
                    <p className="flex items-center flex-wrap">
                      <Calendar className="w-4 h-4 mr-2 text-purple-300" />
                      {s.fecha}
                      <Clock className="w-4 h-4 ml-3 mr-2 text-purple-300" />
                      {s.hora} ({s.duracion}h)
                    </p>
                  </div>
                  <p className="mt-2 text-lg font-bold text-white">{formatPrecio(s.precio)}</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => aceptar(s)}
                    disabled={procesando === s.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => { setRechazando(s); setMotivo(''); setError('') }}
                    disabled={procesando === s.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/30 hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* El motivo es obligatorio: el estudiante ya pagó y merece una explicación */}
      {rechazando && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Rechazar esta clase</h3>
            <p className="text-sm text-purple-200 mb-4">
              El estudiante ya pagó <strong className="text-white">{formatPrecio(rechazando.precio)}</strong>.
              Al rechazar, ese importe se abona a su saldo para que tome otra clase
              y se le envía tu explicación.
            </p>

            <label className="block text-sm font-medium text-white mb-2">
              Motivo del rechazo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              placeholder="Ej.: Tuve un imprevisto y no podré dictar la clase a esa hora."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-purple-300 mt-1 mb-4">
              Mínimo 10 caracteres. El estudiante verá este mensaje.
            </p>

            {error && <p className="text-sm text-red-300 mb-3">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setRechazando(null); setMotivo(''); setError('') }}
                className="flex-1 px-4 py-2.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRechazo}
                disabled={procesando === rechazando.id}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {procesando === rechazando.id ? 'Rechazando...' : 'Rechazar y devolver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservasPendientes
