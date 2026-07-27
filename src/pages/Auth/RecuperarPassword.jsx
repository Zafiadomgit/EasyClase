import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

const RecuperarPassword = () => {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Nota: el envío real de email requiere un servicio SMTP configurado.
    // Por ahora se muestra el mensaje estándar (no revela si el correo existe).
    setTimeout(() => {
      setEnviado(true)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Ingresá tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
        </div>

        {enviado ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm mb-6">
              Si el correo <strong>{email}</strong> está registrado, te enviaremos las
              instrucciones para restablecer tu contraseña.
            </div>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver a iniciar sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default RecuperarPassword
