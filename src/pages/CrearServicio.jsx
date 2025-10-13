import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Video, Users, DollarSign, Calendar, Clock, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { servicioService } from '../services/api'

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
    tiempoPrevisto: {
      valor: '',
      unidad: 'horas'
    },
    archivos: [], // Múltiples archivos
    urlVideo: '',
    requisitos: '',
    objetivos: '',
    modalidad: 'virtual' // virtual para servicios online
  })

  const categorias = [
    'Tesis y Trabajos Académicos',
    'Desarrollo Web',
    'Desarrollo de Apps',
    'Diseño Gráfico',
    'Marketing Digital',
    'Consultoría de Negocios',
    'Traducción',
    'Redacción de Contenido',
    'Asesoría Legal',
    'Contabilidad y Finanzas',
    'Fotografía',
    'Video y Edición',
    'Arquitectura y Diseño',
    'Ingeniería',
    'Otros'
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

      // Validar tiempo previsto si se proporciona
      if (servicioData.tiempoPrevisto.valor && (!servicioData.tiempoPrevisto.valor || servicioData.tiempoPrevisto.valor <= 0)) {
        throw new Error('El tiempo previsto debe ser un número positivo')
      }

      // Preparar datos para envío (sin archivos por ahora)
      const datosParaEnviar = {
        ...servicioData,
        archivos: undefined // No enviar archivos por ahora
      }

      console.log('🚀 Enviando datos del servicio:', datosParaEnviar)
      console.log('🔑 Token de usuario:', localStorage.getItem('token'))

      // Enviar a la API usando el servicio centralizado
      const response = await servicioService.crearServicio(datosParaEnviar)
      
      console.log('📡 Respuesta de la API:', response)
      
      if (response.success) {
        setSuccess('Servicio creado exitosamente')
      } else {
        throw new Error(response.message || 'Error al crear el servicio')
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Crear Nuevo Servicio</h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">Crea cursos pregrabados, asesorías y servicios con materiales incluidos</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
          
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
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-300" />
                Información del Servicio
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Título del servicio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={servicioData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Curso completo de Excel Avanzado"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={servicioData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe detalladamente qué aprenderán los estudiantes..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={servicioData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white backdrop-blur-sm"
                  required
                >
                  <option value="" className="bg-slate-800 text-white">Selecciona una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria} className="bg-slate-800 text-white">{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tipo de servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-300" />
                Tipo de Servicio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  servicioData.tipo === 'pregrabada' 
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg' 
                    : 'border-white/20 bg-white/10 hover:border-purple-400'
                } backdrop-blur-sm`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="pregrabada"
                    checked={servicioData.tipo === 'pregrabada'}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-medium text-white">Curso Pregrabado</div>
                    <div className="text-sm text-purple-100">Videos, documentos, materiales</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  servicioData.tipo === 'asesoria' 
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg' 
                    : 'border-white/20 bg-white/10 hover:border-purple-400'
                } backdrop-blur-sm`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="asesoria"
                    checked={servicioData.tipo === 'asesoria'}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-medium text-white">Asesoría</div>
                    <div className="text-sm text-purple-100">Consultoría personalizada</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                  servicioData.tipo === 'consultoria' 
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg' 
                    : 'border-white/20 bg-white/10 hover:border-purple-400'
                } backdrop-blur-sm`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="consultoria"
                    checked={servicioData.tipo === 'consultoria'}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="font-medium text-white">Consultoría</div>
                    <div className="text-sm text-purple-100">Servicios profesionales</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Precio del servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-300" />
                Precio del Servicio
              </h3>
              
              <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <p className="text-sm text-blue-200">
                  <strong>ℹ️ Información:</strong> Define el precio total del servicio. 
                  Los estudiantes comprarán el servicio completo con todos los materiales incluidos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Precio del servicio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={servicioData.precio}
                      onChange={handleChange}
                      placeholder="10"
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                  {servicioData.precio && (
                    <p className="text-sm text-purple-200 mt-1">
                      {formatPrecio(servicioData.precio)} por el servicio completo
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Duración estimada (opcional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="tiempoPrevisto.valor"
                      value={servicioData.tiempoPrevisto.valor}
                      onChange={(e) => {
                        const { value } = e.target
                        setServicioData(prev => ({
                          ...prev,
                          tiempoPrevisto: {
                            ...prev.tiempoPrevisto,
                            valor: value
                          }
                        }))
                      }}
                      placeholder="3"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                    />
                    <select
                      name="tiempoPrevisto.unidad"
                      value={servicioData.tiempoPrevisto.unidad}
                      onChange={(e) => {
                        const { value } = e.target
                        setServicioData(prev => ({
                          ...prev,
                          tiempoPrevisto: {
                            ...prev.tiempoPrevisto,
                            unidad: value
                          }
                        }))
                      }}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white backdrop-blur-sm"
                    >
                      <option value="horas" className="bg-slate-800 text-white">Horas</option>
                      <option value="días" className="bg-slate-800 text-white">Días</option>
                      <option value="semanas" className="bg-slate-800 text-white">Semanas</option>
                      <option value="meses" className="bg-slate-800 text-white">Meses</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Subida de archivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Upload className="w-5 h-5 mr-2 text-purple-300" />
                Archivos del Servicio
              </h3>
              
              <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <p className="text-sm text-green-200">
                  <strong>📁 Archivos:</strong> Sube videos, documentos, presentaciones y otros materiales. 
                  Máximo 100MB por archivo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Subir archivos *
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-white/5 backdrop-blur-sm">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".mp4,.avi,.mov,.pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white mb-2">
                      Haz clic para subir archivos
                    </p>
                    <p className="text-sm text-purple-200">
                      Videos, PDFs, presentaciones, documentos (máx. 100MB cada uno)
                    </p>
                  </label>
                </div>
                
                {/* Lista de archivos subidos */}
                {servicioData.archivos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-purple-200">Archivos seleccionados:</p>
                    {servicioData.archivos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-purple-300 mr-2" />
                          <span className="text-sm text-white">{file.name}</span>
                          <span className="text-xs text-purple-200 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center text-purple-300">
                <span className="text-sm">o</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  URL de video (opcional)
                </label>
                <input
                  type="url"
                  name="urlVideo"
                  value={servicioData.urlVideo}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                />
                <p className="text-xs text-purple-200 mt-1">
                  Si prefieres usar un video de YouTube, Vimeo u otra plataforma
                </p>
              </div>
            </div>

            {/* Modalidad - Solo Online */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-300" />
                Modalidad
              </h3>
              
              <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-green-200">Clases Online</span>
                </div>
                <p className="text-sm text-green-200 mt-1">
                  Todas las clases se realizan de forma online a través de videollamadas
                </p>
              </div>
            </div>


            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-300" />
                Información Adicional
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Requisitos previos (opcional)
                </label>
                <textarea
                  name="requisitos"
                  value={servicioData.requisitos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué conocimientos previos necesitan los estudiantes?"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Objetivos de aprendizaje (opcional)
                </label>
                <textarea
                  name="objetivos"
                  value={servicioData.objetivos}
                  onChange={handleChange}
                  rows="3"
                  placeholder="¿Qué aprenderán los estudiantes al finalizar?"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white placeholder-purple-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-white/20 text-purple-200 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando servicio...' : 'Crear Servicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default CrearServicio
