import React, { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Crown, ChevronLeft, ChevronRight, Users, Award, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { profesorService } from '../services/api'
import { formatPrecio, formatPrecioPorHora } from '../utils/currencyUtils'

const BuscarClases = () => {
  const [profesores, setProfesores] = useState([])
  const [profesoresFiltrados, setProfesoresFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [profesoresPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Obtener parámetros de la URL
  const categoriaParam = searchParams.get('categoria')
  const queryParam = searchParams.get('q')
  const ubicacionParam = searchParams.get('ubicacion')
  const ordenarParam = searchParams.get('ordenar')

  // Función para manejar la búsqueda
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('q', searchQuery.trim())
      setSearchParams(newParams)
      setCurrentPage(1) // Reset a la primera página
    }
  }

  // Inicializar searchQuery con el parámetro de la URL
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [queryParam])

  // Función para filtrar profesores
  const filtrarProfesores = (profesores) => {
    let filtrados = [...profesores]

    // Filtro por búsqueda de texto
    if (queryParam) {
      const query = queryParam.toLowerCase()
      filtrados = filtrados.filter(profesor => 
        profesor.nombre.toLowerCase().includes(query) ||
        profesor.especialidades.some(esp => esp.toLowerCase().includes(query)) ||
        profesor.descripcion.toLowerCase().includes(query)
      )
    }

    // Filtro por categoría
    if (categoriaParam) {
      filtrados = filtrados.filter(profesor => 
        profesor.categoria === categoriaParam ||
        profesor.especialidades.includes(categoriaParam)
      )
    }

    // Filtro por ubicación
    if (ubicacionParam) {
      filtrados = filtrados.filter(profesor => 
        profesor.ubicacion === ubicacionParam ||
        profesor.modalidad === ubicacionParam
      )
    }

    // Ordenamiento
    if (ordenarParam === 'premium') {
      filtrados.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1
        return b.calificacionPromedio - a.calificacionPromedio
      })
    } else {
      // Ordenamiento por defecto: premium primero, luego por calificación
      filtrados.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1
        if (b.calificacionPromedio !== a.calificacionPromedio) {
          return b.calificacionPromedio - a.calificacionPromedio
        }
        return b.totalReviews - a.totalReviews
      })
    }

    return filtrados
  }

  // Calcular profesores para la página actual
  const getProfesoresPaginaActual = () => {
    const startIndex = (currentPage - 1) * profesoresPerPage
    const endIndex = startIndex + profesoresPerPage
    return profesoresFiltrados.slice(startIndex, endIndex)
  }

  // Calcular total de páginas
  useEffect(() => {
    const filtrados = filtrarProfesores(profesores)
    setProfesoresFiltrados(filtrados)
    setTotalPages(Math.ceil(filtrados.length / profesoresPerPage))
    
    // Si la página actual es mayor que el total de páginas, ir a la última página
    if (currentPage > Math.ceil(filtrados.length / profesoresPerPage)) {
      setCurrentPage(Math.ceil(filtrados.length / profesoresPerPage) || 1)
    }
  }, [profesores, queryParam, categoriaParam, ubicacionParam, ordenarParam])

  // Función para cambiar de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll hacia arriba para mejor UX
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Función para generar números de página
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  useEffect(() => {
    let activo = true
    const cargarProfesores = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await profesorService.buscarProfesores({})
        const lista = response?.data?.profesores || response?.profesores || []
        if (activo) setProfesores(lista)
      } catch (err) {
        if (activo) {
          setError('No se pudieron cargar los profesores. Intenta de nuevo más tarde.')
          setProfesores([])
        }
      } finally {
        if (activo) setLoading(false)
      }
    }
    cargarProfesores()
    return () => { activo = false }
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando profesores...</p>
        </div>
      </div>
    )
  }

  const profesoresPaginaActual = getProfesoresPaginaActual()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10">
        {/* Hero Section Premium */}
        <section className="py-20 overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header elegante */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 shadow-2xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                {categoriaParam ? `Profesores de ${categoriaParam}` : 'Buscar Profesores'}
              </h1>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed mb-8">
                {categoriaParam 
                  ? `Encuentra los mejores profesores especializados en ${categoriaParam}`
                  : 'Conecta con profesores expertos y aprende habilidades prácticas'
                }
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Users className="w-5 h-5 text-purple-300 mr-2" />
                  <span className="text-purple-200 font-medium">{profesoresFiltrados.length} Profesores</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-purple-200 font-medium">4.8+ Calificación</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-purple-200 font-medium">100% Seguro</span>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda mejorada */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar profesores, especialidades..."
                  className="w-full pl-12 pr-20 py-5 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-lg text-white placeholder-purple-300 backdrop-blur-sm shadow-xl"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filtros rápidos */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {['Programación', 'Excel', 'Inglés', 'Matemáticas'].map((categoria) => (
                  <button
                    key={categoria}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams)
                      newParams.set('categoria', categoria)
                      setSearchParams(newParams)
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      categoriaParam === categoria
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Información de resultados mejorada */}
          <div className="mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/50">
                    <TrendingUp className="w-5 h-5 text-purple-300 mr-2" />
                    <span className="text-purple-200 font-medium">
                      {profesoresFiltrados.length} profesores encontrados
                    </span>
                  </div>
                  {categoriaParam && (
                    <div className="flex items-center bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/50">
                      <Award className="w-5 h-5 text-blue-300 mr-2" />
                      <span className="text-blue-200 font-medium">Especialistas en {categoriaParam}</span>
                    </div>
                  )}
                </div>
                
                {/* Filtros de ordenamiento mejorados */}
                <div className="flex items-center gap-3">
                  <span className="text-purple-200 font-medium">Ordenar por:</span>
                  <select
                    value={ordenarParam || 'rating'}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams)
                      newParams.set('ordenar', e.target.value)
                      setSearchParams(newParams)
                      setCurrentPage(1)
                    }}
                    className="p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm shadow-lg"
                  >
                    <option value="rating" className="bg-slate-800 text-white">⭐ Mejor calificación</option>
                    <option value="premium" className="bg-slate-800 text-white">👑 Premium primero</option>
                    <option value="precio-asc" className="bg-slate-800 text-white">💰 Precio menor</option>
                    <option value="precio-desc" className="bg-slate-800 text-white">💎 Precio mayor</option>
                  </select>
                </div>
              </div>
              
              {/* Información detallada */}
              <div className="mt-4 text-sm text-purple-300">
                Mostrando {((currentPage - 1) * profesoresPerPage) + 1} - {Math.min(currentPage * profesoresPerPage, profesoresFiltrados.length)} de {profesoresFiltrados.length} profesores
                {queryParam && ` para "${queryParam}"`}
              </div>
            </div>
          </div>

          {/* Lista de profesores mejorada */}
          <div className="grid gap-8">
            {profesoresPaginaActual.map((profesor, index) => (
              <div key={profesor._id} className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                {/* Header de la tarjeta con gradiente */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {profesor.nombre.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            {profesor.nombre}
                          </h3>
                          {profesor.premium && (
                            <span className="inline-flex items-center bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/50 shadow-lg">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-purple-200">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold">{profesor.calificacionPromedio?.toFixed(1) || '0.0'}</span>
                            <span className="ml-1">({profesor.totalReviews || 0} reseñas)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-green-300 font-medium">Disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Precio destacado */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">
                        {formatPrecio(profesor.precioPorHora || 0)}
                      </div>
                      <div className="text-sm text-purple-200">por hora</div>
                    </div>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Información del profesor */}
                    <div className="flex-1">
                      {/* Especialidades */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profesor.especialidades.map((especialidad, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 border border-purple-400/50 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {especialidad}
                          </span>
                        ))}
                      </div>

                      {/* Modalidad y ubicación */}
                      <div className="flex flex-wrap items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center text-purple-200">
                          <Clock className="w-4 h-4 mr-2 text-purple-300" />
                          <span className="font-medium">{profesor.modalidad || 'Online'}</span>
                        </div>
                        <div className="flex items-center text-purple-200">
                          <MapPin className="w-4 h-4 mr-2 text-purple-300" />
                          <span className="font-medium">{profesor.ubicacion || 'No especificada'}</span>
                        </div>
                      </div>

                      {/* Descripción */}
                      <p className="text-purple-200 text-sm leading-relaxed mb-6">
                        {profesor.descripcion || 'Sin descripción disponible'}
                      </p>

                      {/* Beneficios destacados */}
                      <div className="flex flex-wrap gap-4 text-xs text-purple-300">
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          <span>Clases personalizadas</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          <span>Material incluido</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          <span>Soporte 24/7</span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex-shrink-0 lg:w-48">
                      <div className="space-y-3">
                        <Link
                          to={`/reservar/${profesor._id}`}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center flex items-center justify-center group"
                        >
                          <span>Reservar Clase</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to={`/profesor/${profesor._id}`}
                          className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center backdrop-blur-sm flex items-center justify-center"
                        >
                          <span>Ver Perfil Completo</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Mensaje si no hay resultados mejorado */}
          {profesoresFiltrados.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
                  <Search className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  No encontramos profesores
                </h3>
                <p className="text-purple-200 mb-8 text-lg leading-relaxed">
                  {categoriaParam || queryParam 
                    ? `No hay profesores disponibles para tu búsqueda${categoriaParam ? ` en "${categoriaParam}"` : ''}${queryParam ? ` con "${queryParam}"` : ''}.`
                    : 'No hay profesores disponibles en este momento.'
                  }
                </p>
                <div className="space-y-4">
                  <Link
                    to="/buscar"
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Ver todos los profesores
                  </Link>
                  <div className="pt-4">
                    <Link
                      to="/ser-profesor"
                      className="text-purple-300 hover:text-purple-200 font-medium text-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      ¿Eres experto en este tema? Únete como profesor
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paginación mejorada */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <nav className="flex items-center space-x-2">
                {/* Botón anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-3 text-sm font-medium text-purple-200 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </button>

                {/* Números de página */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all duration-300 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-lg'
                        : page === '...'
                        ? 'text-purple-300 border-white/20 cursor-default'
                        : 'text-purple-200 bg-white/10 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Botón siguiente */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-3 text-sm font-medium text-purple-200 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Sección de confianza adicional */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                ¿Por qué elegir EasyClase?
              </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                Miles de estudiantes confían en nosotros para aprender habilidades prácticas
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">100% Seguro</h3>
                <p className="text-purple-200 leading-relaxed">
                  Todas las transacciones están protegidas y los profesores están verificados
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Aprende Rápido</h3>
                <p className="text-purple-200 leading-relaxed">
                  Clases personalizadas que se adaptan a tu ritmo y objetivos de aprendizaje
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Comunidad Activa</h3>
                <p className="text-purple-200 leading-relaxed">
                  Únete a una comunidad de estudiantes y profesores apasionados por aprender
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default BuscarClases