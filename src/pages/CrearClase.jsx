import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, DollarSign, FileText, AlertCircle, Video, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const CrearClase = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [claseData, setClaseData] = useState({
    titulo: '',
    descripcion: '',
    materia: '',
    categoria: '',
    tipo: 'individual', // individual, grupal
    precio: '',
    duracion: 1, // en horas
    maxEstudiantes: 1,
    modalidad: 'online', // solo online
    requisitos: '',
    objetivos: ''
  })

  const categorias = [
    'Programación', 'Diseño', 'Marketing', 'Idiomas', 'Excel', 
    'Matemáticas', 'Física', 'Química', 'Contabilidad', 'Finanzas',
    'Fotografía', 'Video', 'Música', 'Arte', 'Escritura',
    'Desarrollo Personal', 'Negocios', 'Emprendimiento'
  ]

  const materias = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'SQL',
    'Excel Avanzado', 'Power BI', 'Tableau', 'Photoshop', 'Illustrator',
    'Inglés Conversacional', 'Matemáticas Básicas', 'Cálculo',
    'Física Mecánica', 'Química Orgánica', 'Contabilidad General',
    'Marketing Digital', 'SEO', 'Redes Sociales', 'Fotografía Digital'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setClaseData(prev => ({
      ...prev,
      [name]: value
    }))

    // Si cambia el tipo, ajustar maxEstudiantes
    if (name === 'tipo') {
      if (value === 'grupal') {
        setClaseData(prev => ({
          ...prev,
          [name]: value,
          maxEstudiantes: 5
        }))
      } else if (value === 'individual') {
        setClaseData(prev => ({
          ...prev,
          [name]: value,
          maxEstudiantes: 1
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validaciones
      if (!claseData.titulo || !claseData.descripcion || !claseData.materia || !claseData.categoria) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      if (!claseData.precio || claseData.precio <= 0) {
        throw new Error('Por favor ingresa un precio válido')
      }

      if (claseData.precio < 10) {
        throw new Error('El precio debe ser mínimo $10 COP')
      }

      // Crear la plantilla de clase
      const response = await fetch('/api/plantillas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock_token_for_testing'}`
        },
        body: JSON.stringify(claseData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Clase creada exitosamente')
        setTimeout(() => {
          navigate('/mis-clases')
        }, 2000)
      } else {
        throw new Error(data.message || 'Error creando la clase')
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header elegante */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Crear Nueva Clase
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Programa una clase en vivo para tus estudiantes
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
          
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-6 py-4 rounded-2xl mb-8 flex items-center backdrop-blur-sm">
              <AlertCircle className="w-6 h-6 mr-3 text-red-300" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm">
              <span className="font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Información básica */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Información de la Clase
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Título de la clase *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={claseData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Clase de JavaScript Avanzado"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-purple-300 backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={claseData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe qué aprenderán los estudiantes en esta clase..."
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-purple-300 backdrop-blur-sm resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Materia *
                  </label>
                  <select
                    name="materia"
                    value={claseData.materia}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white backdrop-blur-sm"
                    required
                  >
                    <option value="" className="bg-slate-800 text-white">Selecciona una materia</option>
                    {materias.map(materia => (
                      <option key={materia} value={materia} className="bg-slate-800 text-white">{materia}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={claseData.categoria}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white backdrop-blur-sm"
                    required
                  >
                    <option value="" className="bg-slate-800 text-white">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria} className="bg-slate-800 text-white">{categoria}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tipo de clase */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Tipo de Clase
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center p-6 bg-white/10 border border-white/20 rounded-2xl cursor-pointer hover:border-purple-400/50 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="tipo"
                    value="individual"
                    checked={claseData.tipo === 'individual'}
                    onChange={handleChange}
                    className="mr-4 w-5 h-5 text-purple-600"
                  />
                  <div>
                    <div className="font-bold text-white text-lg">Clase Individual</div>
                    <div className="text-sm text-purple-200">1 estudiante por sesión</div>
                  </div>
                </label>
                
                <label className="flex items-center p-6 bg-white/10 border border-white/20 rounded-2xl cursor-pointer hover:border-purple-400/50 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm">
                  <input
                    type="radio"
                    name="tipo"
                    value="grupal"
                    checked={claseData.tipo === 'grupal'}
                    onChange={handleChange}
                    className="mr-4 w-5 h-5 text-purple-600"
                  />
                  <div>
                    <div className="font-bold text-white text-lg">Clase Grupal</div>
                    <div className="text-sm text-purple-200">Hasta 5 estudiantes</div>
                  </div>
                </label>
              </div>

              {claseData.tipo === 'grupal' && (
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Máximo de estudiantes (máximo 5)
                  </label>
                  <input
                    type="number"
                    name="maxEstudiantes"
                    value={claseData.maxEstudiantes}
                    onChange={handleChange}
                    min="2"
                    max="5"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white backdrop-blur-sm"
                  />
                </div>
              )}
            </div>

            {/* Precio y duración */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                Precio y Duración
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Precio por hora *
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-300 font-bold text-lg">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={claseData.precio}
                      onChange={handleChange}
                      placeholder="10"
                      className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-purple-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  {claseData.precio && (
                    <p className="text-sm text-purple-200 mt-2 font-medium">
                      {formatPrecio(claseData.precio)} por hora
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Duración (horas) *
                  </label>
                  <select
                    name="duracion"
                    value={claseData.duracion}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white backdrop-blur-sm"
                    required
                  >
                    <option value={1} className="bg-slate-800 text-white">1 hora</option>
                    <option value={2} className="bg-slate-800 text-white">2 horas</option>
                    <option value={3} className="bg-slate-800 text-white">3 horas</option>
                    <option value={4} className="bg-slate-800 text-white">4 horas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de disponibilidad */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Disponibilidad
              </h3>
              
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-sm text-blue-200 font-medium">
                  <strong>ℹ️ Información:</strong> Esta clase estará disponible según los horarios 
                  que tengas configurados en tu perfil. Los estudiantes podrán reservar 
                  horarios específicos dentro de tu disponibilidad.
                </p>
              </div>
            </div>

            {/* Modalidad - Solo Online */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Video className="w-5 h-5 text-white" />
                </div>
                Modalidad
              </h3>
              
              <div className="bg-green-500/20 border border-green-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full mr-4"></div>
                  <span className="font-bold text-green-200 text-lg">Clase Online</span>
                </div>
                <p className="text-sm text-green-200 mt-2 font-medium">
                  La clase se realizará a través de videollamada
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Información Adicional</h3>
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Requisitos previos (opcional)
                </label>
                <textarea
                  name="requisitos"
                  value={claseData.requisitos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué conocimientos previos necesitan los estudiantes?"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-purple-300 backdrop-blur-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Objetivos de aprendizaje (opcional)
                </label>
                <textarea
                  name="objetivos"
                  value={claseData.objetivos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué aprenderán los estudiantes al finalizar?"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300 text-white placeholder-purple-300 backdrop-blur-sm resize-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-6 pt-8">
              <button
                type="button"
                onClick={() => navigate('/mis-clases')}
                className="flex-1 bg-white/10 text-white px-8 py-4 rounded-2xl hover:bg-white/20 font-semibold transition-all duration-300 border border-white/20"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando clase...' : 'Crear Clase'}
              </button>
            </div>
          </form>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  )
}

export default CrearClase
