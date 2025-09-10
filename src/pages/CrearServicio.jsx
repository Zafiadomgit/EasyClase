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
    tipo: 'pregrabada', // pregrabada, asesoria, consultoria
    precio: '',
    duracion: '', // Duración estimada del contenido
    archivos: [], // Múltiples archivos
    urlVideo: '',
    requisitos: '',
    objetivos: '',
    modalidad: 'online' // solo online
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
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Validar cada archivo
    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        setError(`El archivo ${file.name} es demasiado grande. Máximo 100MB por archivo.`)
        return
      }
    }
    
    setServicioData(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...files]
    }))
  }

  const removeFile = (index) => {
    setServicioData(prev => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validaciones
      if (!servicioData.titulo || !servicioData.descripcion || !servicioData.categoria) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      if (!servicioData.precio || servicioData.precio <= 0) {
        throw new Error('Por favor ingresa un precio válido para el servicio')
      }

      if (servicioData.tipo === 'pregrabada' && servicioData.archivos.length === 0 && !servicioData.urlVideo) {
        throw new Error('Para servicios pregrabados debes subir archivos o proporcionar una URL de video')
      }

      // Crear FormData para enviar archivos
      const formData = new FormData()
      Object.keys(servicioData).forEach(key => {
        if (key === 'archivos' && servicioData[key].length > 0) {
          servicioData[key].forEach((file, index) => {
            formData.append(`archivo_${index}`, file)
          })
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
          <p className="text-secondary-600">Crea cursos pregrabados, asesorías y servicios con materiales incluidos</p>
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
                    value="pregrabada"
                    checked={servicioData.tipo === 'pregrabada'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Curso Pregrabado</div>
                    <div className="text-sm text-secondary-600">Videos, documentos, materiales</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="asesoria"
                    checked={servicioData.tipo === 'asesoria'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Asesoría</div>
                    <div className="text-sm text-secondary-600">Consultoría personalizada</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-secondary-300 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="radio"
                    name="tipo"
                    value="consultoria"
                    checked={servicioData.tipo === 'consultoria'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-secondary-900">Consultoría</div>
                    <div className="text-sm text-secondary-600">Servicios profesionales</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Precio del servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Precio del Servicio
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Información:</strong> Define el precio total del servicio. 
                  Los estudiantes comprarán el servicio completo con todos los materiales incluidos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Precio del servicio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={servicioData.precio}
                      onChange={handleChange}
                      placeholder="150000"
                      className="w-full pl-8 pr-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  {servicioData.precio && (
                    <p className="text-sm text-secondary-600 mt-1">
                      {formatPrecio(servicioData.precio)} por el servicio completo
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Duración estimada (opcional)
                  </label>
                  <input
                    type="text"
                    name="duracion"
                    value={servicioData.duracion}
                    onChange={handleChange}
                    placeholder="Ej: 3 horas, 2 semanas, 1 mes"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Subida de archivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Archivos del Servicio
              </h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>📁 Archivos:</strong> Sube videos, documentos, presentaciones y otros materiales. 
                  Máximo 100MB por archivo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Subir archivos *
                </label>
                <div className="border-2 border-dashed border-secondary-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".mp4,.avi,.mov,.pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-secondary-900 mb-2">
                      Haz clic para subir archivos
                    </p>
                    <p className="text-sm text-secondary-600">
                      Videos, PDFs, presentaciones, documentos (máx. 100MB cada uno)
                    </p>
                  </label>
                </div>
                
                {/* Lista de archivos subidos */}
                {servicioData.archivos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-secondary-700">Archivos seleccionados:</p>
                    {servicioData.archivos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-secondary-500 mr-2" />
                          <span className="text-sm text-secondary-700">{file.name}</span>
                          <span className="text-xs text-secondary-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center text-secondary-500">
                <span className="text-sm">o</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  URL de video (opcional)
                </label>
                <input
                  type="url"
                  name="urlVideo"
                  value={servicioData.urlVideo}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Si prefieres usar un video de YouTube, Vimeo u otra plataforma
                </p>
              </div>
            </div>

            {/* Modalidad - Solo Online */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Modalidad
              </h3>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-green-800">Clases Online</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Todas las clases se realizan de forma online a través de videollamadas
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
