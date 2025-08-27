import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Video, Users, DollarSign, Calendar, Clock, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const CrearServicio = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [servicioData, setServicioData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    tipo: 'individual', // individual, grupal, pregrabada
    precio: '',
    duracion: 1,
    maxEstudiantes: 1,
    archivo: null,
    urlVideo: '',
    requisitos: '',
    objetivos: '',
    modalidad: 'online' // online, presencial, mixta
  })

  const categorias = [
    'Programación', 'Diseño', 'Marketing', 'Idiomas', 'Excel', 
    'Matemáticas', 'Física', 'Química', 'Contabilidad', 'Finanzas',
    'Fotografía', 'Video', 'Música', 'Arte', 'Escritura',
    'Desarrollo Personal', 'Negocios', 'Emprendimiento'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setServicioData(prev => ({
      ...prev,
      [name]: value
    }))

    // Si cambia el tipo, ajustar maxEstudiantes
    if (name === 'tipo') {
      if (value === 'grupal') {
        setServicioData(prev => ({
          ...prev,
          [name]: value,
          maxEstudiantes: 5
        }))
      } else {
        setServicioData(prev => ({
          ...prev,
          [name]: value,
          maxEstudiantes: 1
        }))
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamaño (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 100MB.')
        return
      }
      setServicioData(prev => ({
        ...prev,
        archivo: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validaciones
      if (!servicioData.titulo || !servicioData.descripcion || !servicioData.categoria || !servicioData.precio) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      if (servicioData.tipo === 'pregrabada' && !servicioData.archivo && !servicioData.urlVideo) {
        throw new Error('Para clases pregrabadas debes subir un archivo o proporcionar una URL de video')
      }

      if (servicioData.tipo === 'grupal' && servicioData.maxEstudiantes > 5) {
        throw new Error('El máximo de estudiantes para clases grupales es 5')
      }

      // Crear FormData para enviar archivo
      const formData = new FormData()
      Object.keys(servicioData).forEach(key => {
        if (key === 'archivo' && servicioData[key]) {
          formData.append(key, servicioData[key])
        } else {
          formData.append(key, servicioData[key])
        }
      })

      // Aquí se enviaría a la API


      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess('Servicio creado exitosamente')
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)

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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Crear Nuevo Servicio</h1>
          <p className="text-secondary-600">Comparte tu conocimiento y gana dinero enseñando</p>
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
                Información del Servicio
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Título del servicio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={servicioData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Curso completo de Excel Avanzado"
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
                  value={servicioData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe detalladamente qué aprenderán los estudiantes..."
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={servicioData.categoria}
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

            {/* Tipo de servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Tipo de Servicio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="individual"
                    checked={servicioData.tipo === 'individual'}
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
                    checked={servicioData.tipo === 'grupal'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Clase Grupal</div>
                    <div className="text-sm text-secondary-600">Hasta 5 estudiantes</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="pregrabada"
                    checked={servicioData.tipo === 'pregrabada'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Clase Pregrabada</div>
                    <div className="text-sm text-secondary-600">Video disponible 24/7</div>
                  </div>
                </label>
              </div>

              {servicioData.tipo === 'grupal' && (
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Máximo de estudiantes (máximo 5)
                  </label>
                  <input
                    type="number"
                    name="maxEstudiantes"
                    value={servicioData.maxEstudiantes}
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
                    Precio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={servicioData.precio}
                      onChange={handleChange}
                      placeholder="35000"
                      className="w-full pl-8 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  {servicioData.precio && (
                    <p className="text-sm text-secondary-600 mt-1">
                      {formatPrecio(servicioData.precio)} {servicioData.tipo === 'pregrabada' ? 'por video' : 'por hora'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Duración (horas)
                  </label>
                  <input
                    type="number"
                    name="duracion"
                    value={servicioData.duracion}
                    onChange={handleChange}
                    min="0.5"
                    step="0.5"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Modalidad */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Modalidad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="modalidad"
                    value="online"
                    checked={servicioData.modalidad === 'online'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-medium">Online</span>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="modalidad"
                    value="presencial"
                    checked={servicioData.modalidad === 'presencial'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-medium">Presencial</span>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="modalidad"
                    value="mixta"
                    checked={servicioData.modalidad === 'mixta'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <span className="font-medium">Mixta</span>
                </label>
              </div>
            </div>

            {/* Contenido para clases pregrabadas */}
            {servicioData.tipo === 'pregrabada' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Contenido de la Clase
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Subir archivo de video (máximo 100MB)
                  </label>
                  <div className="border-2 border-dashed border-secondary-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="video/*,.mp4,.avi,.mov,.mkv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-medium">Haz clic para subir</span>
                      <span className="text-secondary-600"> o arrastra el archivo aquí</span>
                    </label>
                    {servicioData.archivo && (
                      <p className="text-sm text-secondary-600 mt-2">
                        Archivo seleccionado: {servicioData.archivo.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    O URL del video (YouTube, Vimeo, etc.)
                  </label>
                  <input
                    type="url"
                    name="urlVideo"
                    value={servicioData.urlVideo}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900">Información Adicional</h3>
              
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Requisitos previos (opcional)
                </label>
                <textarea
                  name="requisitos"
                  value={servicioData.requisitos}
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
                  value={servicioData.objetivos}
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
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-secondary-300 text-secondary-700 rounded-xl hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando servicio...' : 'Crear Servicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CrearServicio
