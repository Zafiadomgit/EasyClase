import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const AdminRetiros = () => {
  const [retiros, setRetiros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/admin/retiros', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
      })
      const data = await res.json()
      if (data.success) setRetiros(data.data?.retiros || data.retiros || [])
      else setError(data.message || 'Error cargando retiros')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstado = async (id, estado) => {
    try {
      const res = await fetch(`/api/admin/retiros/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ estado })
      })
      const data = await res.json()
      if (data.success) await cargar()
      else alert(data.message || 'No se pudo actualizar')
    } catch {
      alert('Error de conexión')
    }
  }

  const formatPrecio = (n) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(n || 0)

  const color = (e) =>
    e === 'pagado' ? 'bg-green-100 text-green-800'
      : e === 'aprobado' ? 'bg-blue-100 text-blue-800'
        : e === 'rechazado' ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retiros</h1>
          <p className="text-gray-600">Solicitudes de retiro de los profesores</p>
        </div>
        <button onClick={cargar} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <RefreshCw className="w-4 h-4" /> Refrescar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">{error}</div>
      )}

      {retiros.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay solicitudes de retiro.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Profesor', 'Monto', 'Comisión', 'Neto', 'Estado', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {retiros.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{r.profesorNombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatPrecio(r.monto)}</td>
                  <td className="px-4 py-3 text-sm text-red-600">-{formatPrecio(r.comision)}</td>
                  <td className="px-4 py-3 text-sm text-green-600">{formatPrecio(r.montoNeto)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${color(r.estado)}`}>{r.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      {r.estado !== 'aprobado' && r.estado !== 'pagado' && (
                        <button onClick={() => cambiarEstado(r.id, 'aprobado')} className="text-blue-600 hover:text-blue-800 flex items-center gap-1" title="Aprobar">
                          <CheckCircle className="w-4 h-4" /> Aprobar
                        </button>
                      )}
                      {r.estado !== 'pagado' && (
                        <button onClick={() => cambiarEstado(r.id, 'pagado')} className="text-green-600 hover:text-green-800 text-xs font-medium">
                          Marcar pagado
                        </button>
                      )}
                      {r.estado !== 'rechazado' && r.estado !== 'pagado' && (
                        <button onClick={() => cambiarEstado(r.id, 'rechazado')} className="text-red-600 hover:text-red-800 flex items-center gap-1" title="Rechazar">
                          <XCircle className="w-4 h-4" /> Rechazar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminRetiros
