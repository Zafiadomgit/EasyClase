import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const RegisterSimple = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    tipoUsuario: 'estudiante'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    
    try {
      const response = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      console.log('Respuesta del servidor:', data)
      
      if (data.success) {
        alert('Usuario registrado exitosamente!')
      } else {
        alert('Error: ' + (data.message || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-6">
            <img 
              src="/Logo_reducido-removebg-preview.png" 
              alt="EasyClase" 
              className="h-24 w-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Registro Simple - EasyClase
          </h2>
          <p className="mt-2 text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="300 123 4567"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tipoUsuario}
                onChange={handleChange}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrar Usuario
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterSimple
