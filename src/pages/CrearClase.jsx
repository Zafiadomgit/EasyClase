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

      // Crear la plantilla de clase
      const response = await fetch('/api/clases/plantillas-db.php', {
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
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Crear Nueva Clase</h1>
          <p className="text-secondary-600">Programa una clase en vivo para tus estudiantes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Información de la Clase
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Título de la clase *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={claseData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Clase de JavaScript Avanzado"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={claseData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe qué aprenderán los estudiantes en esta clase..."
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Materia *
                  </label>
                  <select
                    name="materia"
                    value={claseData.materia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Selecciona una materia</option>
                    {materias.map(materia => (
                      <option key={materia} value={materia}>{materia}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={claseData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tipo de clase */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Tipo de Clase
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="individual"
                    checked={claseData.tipo === 'individual'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Clase Individual</div>
                    <div className="text-sm text-secondary-600">1 estudiante por sesión</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="grupal"
                    checked={claseData.tipo === 'grupal'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Clase Grupal</div>
                    <div className="text-sm text-secondary-600">Hasta 5 estudiantes</div>
                  </div>
                </label>
              </div>

              {claseData.tipo === 'grupal' && (
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Máximo de estudiantes (máximo 5)
                  </label>
                  <input
                    type="number"
                    name="maxEstudiantes"
                    value={claseData.maxEstudiantes}
                    onChange={handleChange}
                    min="2"
                    max="5"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Precio y duración */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Precio y Duración
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Precio por hora *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={claseData.precio}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full pl-8 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  {claseData.precio && (
                    <p className="text-sm text-secondary-600 mt-1">
                      {formatPrecio(claseData.precio)} por hora
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Duración (horas) *
                  </label>
                  <select
                    name="duracion"
                    value={claseData.duracion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value={1}>1 hora</option>
                    <option value={2}>2 horas</option>
                    <option value={3}>3 horas</option>
                    <option value={4}>4 horas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de disponibilidad */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Disponibilidad
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Información:</strong> Esta clase estará disponible según los horarios 
                  que tengas configurados en tu perfil. Los estudiantes podrán reservar 
                  horarios específicos dentro de tu disponibilidad.
                </p>
              </div>
            </div>

            {/* Modalidad - Solo Online */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Modalidad
              </h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-green-800">Clase Online</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  La clase se realizará a través de videollamada
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Información Adicional</h3>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Requisitos previos (opcional)
                </label>
                <textarea
                  name="requisitos"
                  value={claseData.requisitos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué conocimientos previos necesitan los estudiantes?"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Objetivos de aprendizaje (opcional)
                </label>
                <textarea
                  name="objetivos"
                  value={claseData.objetivos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué aprenderán los estudiantes al finalizar?"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/mis-clases')}
                className="flex-1 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando clase...' : 'Crear Clase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CrearClase
