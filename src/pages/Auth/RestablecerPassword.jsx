import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'

// Destino del enlace que llega por correo. El token viaja en la URL y lo valida
// el backend: tiene una hora de vigencia y deja de servir en cuanto la
// contraseña cambia, para que un correo viejo no pueda reutilizarse.
const RestablecerPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [repetir, setRepetir] = useState('')
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== repetir) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setLoading(true)
      const r = await fetch('/api/auth/restablecer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const d = await r.json()
      if (r.ok && d.success) {
        setListo(true)
        setTimeout(() => navigate('/login'), 2500)
      } else {
        setError(d.message || 'No se pudo restablecer la contraseña.')
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Enlace no válido</h1>
          <p className="text-purple-200 mb-6">
            Este enlace no incluye el código de verificación. Solicita uno nuevo.
          </p>
          <Link
            to="/recuperar-password"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Solicitar enlace nuevo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        {listo ? (
          <div className="text-center">
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Contraseña actualizada</h1>
            <p className="text-purple-200">Te llevamos al inicio de sesión...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-purple-500/20 border border-purple-400/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-purple-300" />
              </div>
              <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
              <p className="text-purple-200 mt-2 text-sm">
                Elige una contraseña de al menos 8 caracteres.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Repite la contraseña</label>
                <input
                  type="password"
                  value={repetir}
                  onChange={(e) => setRepetir(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-6 inline-flex items-center text-sm text-purple-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default RestablecerPassword
