import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { validateEmail } from '../../utils/emailValidation'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'estudiante'
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const validateForm = () => {
    // Validar nombre
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }
    
    if (formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return false
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      setError('El nombre solo puede contener letras y espacios')
      return false
    }
    
    // Validar email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.message)
      return false
    }
    
    // Validar teléfono
    if (!formData.telefono.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!phoneRegex.test(formData.telefono.trim())) {
      setError('El teléfono debe tener entre 10 y 15 dígitos')
      return false
    }
    
    // Validar contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    
    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra minúscula')
      return false
    }
    
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('La contraseña debe contener al menos una letra mayúscula')
      return false
    }
    
    if (!/(?=.*\d)/.test(formData.password)) {
      setError('La contraseña debe contener al menos un número')
      return false
    }
    
    if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      setError('La contraseña debe contener al menos un carácter especial (@$!%*?&)')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Usar el AuthContext para registrar
      await register({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        tipoUsuario: formData.tipoUsuario
      })
      
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo al onboarding...')
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        tipoUsuario: 'estudiante'
      })
      
      // Redirigir al onboarding después de 2 segundos
      setTimeout(() => {
        navigate('/onboarding')
      }, 2000)
      
    } catch (error) {
      console.error('Error:', error)
      setError(error.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center mb-6">
            <img 
              src="/Logo_reducido-removebg-preview.png" 
              alt="EasyClase" 
              className="h-20 w-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Qué quieres hacer en EasyClase?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.tipoUsuario === 'estudiante' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="tipoUsuario"
                    value="estudiante"
                    checked={formData.tipoUsuario === 'estudiante'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-sm font-medium">Estudiante</div>
                  <div className="text-xs text-gray-500">Aprender habilidades</div>
                </label>
                
                <label className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.tipoUsuario === 'profesor' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="tipoUsuario"
                    value="profesor"
                    checked={formData.tipoUsuario === 'profesor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-sm font-medium">Profesor</div>
                  <div className="text-xs text-gray-500">Enseñar habilidades</div>
                </label>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="300 123 4567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link to="/terminos" className="text-blue-600 hover:text-blue-700">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacidad" className="text-blue-600 hover:text-blue-700">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
