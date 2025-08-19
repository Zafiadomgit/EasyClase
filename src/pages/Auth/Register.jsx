import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import TermsModal from '../../components/Modal/TermsModal'
import PrivacyModal from '../../components/Modal/PrivacyModal'


const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'estudiante', // estudiante o profesor
    aceptaTerminos: false,
    aceptaPrivacidad: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { register, isAuthenticated } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleModalAccept = (type) => {
    if (type === 'terms') {
      setFormData({
        ...formData,
        aceptaTerminos: true
      })
    } else if (type === 'privacy') {
      setFormData({
        ...formData,
        aceptaPrivacidad: true
      })
    }
  }

  const openTermsModal = (e) => {
    e.preventDefault()
    setShowTermsModal(true)
  }

  const openPrivacyModal = (e) => {
    e.preventDefault()
    setShowPrivacyModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }
    
    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones')
      setIsLoading(false)
      return
    }
    
    if (!formData.aceptaPrivacidad) {
      setError('Debes aceptar la política de privacidad')
      setIsLoading(false)
      return
    }
    
    try {
      // Preparar datos para el registro (sin confirmPassword y flags de aceptación)
      const { confirmPassword, aceptaTerminos, aceptaPrivacidad, ...registerData } = formData
      
      await register(registerData)
      
      // Redirigir según el tipo de usuario
      console.log('Registro exitoso, tipo de usuario:', formData.tipoUsuario)
      if (formData.tipoUsuario === 'estudiante') {
        console.log('Redirigiendo estudiante a onboarding')
        navigate('/onboarding', { replace: true })
      } else {
        // Profesores van directo al dashboard
        console.log('Redirigiendo profesor al dashboard')
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      setError(error.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary-600 font-display">
              EasyClase
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-secondary-900 font-display">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-secondary-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Tipo de usuario */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                ¿Qué quieres hacer en EasyClase?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer p-3 border-2 rounded-lg text-center transition-colors ${
                  formData.tipoUsuario === 'estudiante' 
                    ? 'border-primary-600 bg-primary-50 text-primary-700' 
                    : 'border-secondary-300 hover:border-secondary-400'
                }`}>
                  <input
                    type="radio"
                    name="tipoUsuario"
                    value="estudiante"
                    checked={formData.tipoUsuario === 'estudiante'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-sm font-medium">Tomar Clases</div>
                  <div className="text-xs text-secondary-600">Estudiante</div>
                </label>
                <label className={`cursor-pointer p-3 border-2 rounded-lg text-center transition-colors ${
                  formData.tipoUsuario === 'profesor' 
                    ? 'border-primary-600 bg-primary-50 text-primary-700' 
                    : 'border-secondary-300 hover:border-secondary-400'
                }`}>
                  <input
                    type="radio"
                    name="tipoUsuario"
                    value="profesor"
                    checked={formData.tipoUsuario === 'profesor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-sm font-medium">Enseñar</div>
                  <div className="text-xs text-secondary-600">Profesor</div>
                </label>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-secondary-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  className="input-field pl-10"
                  placeholder="300 123 4567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-secondary-700">
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={openTermsModal}
                      className="text-primary-600 hover:text-primary-700 font-medium underline"
                    >
                      términos y condiciones
                    </button>
                    {formData.aceptaTerminos && (
                      <span className="ml-2 text-green-600 font-medium">✓</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="aceptaPrivacidad"
                    name="aceptaPrivacidad"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    checked={formData.aceptaPrivacidad}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-secondary-700">
                    Acepto la{' '}
                    <button
                      type="button"
                      onClick={openPrivacyModal}
                      className="text-primary-600 hover:text-primary-700 font-medium underline"
                    >
                      política de privacidad
                    </button>
                    {formData.aceptaPrivacidad && (
                      <span className="ml-2 text-green-600 font-medium">✓</span>
                    )}
                  </label>
                </div>
              </div>

              {(!formData.aceptaTerminos || !formData.aceptaPrivacidad) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Debes leer y aceptar ambos documentos para continuar
                  </p>
                </div>
              )}
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        {/* Modales */}
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={handleModalAccept}
        />
        
        <PrivacyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          onAccept={handleModalAccept}
        />
      </div>
    </div>
  )
}

export default Register