import React, { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Crown, ChevronLeft, ChevronRight } from 'lucide-react'
import { profesorService } from '../services/api'

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
    // Datos de ejemplo ampliados con profesores premium
    const profesoresEjemplo = [
      // Programación
      {
        _id: '1',
        nombre: 'Carlos Mendoza',
        especialidades: ['Programación', 'Python', 'JavaScript'],
        calificacionPromedio: 4.9,
        totalReviews: 127,
        precioPorHora: 35000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'Ingeniero de software con 8 años de experiencia. Especialista en Python, Django y desarrollo web.',
        premium: false,
        categoria: 'Programación'
      },
      {
        _id: '2',
        nombre: 'Ana Rodríguez',
        especialidades: ['Programación', 'React', 'Node.js'],
        calificacionPromedio: 5.0,
        totalReviews: 203,
        precioPorHora: 45000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Senior Developer en Google. Especializada en React, Node.js y arquitectura de software.',
        premium: true,
        categoria: 'Programación'
      },
      
      // Excel
      {
        _id: '3',
        nombre: 'María García',
        especialidades: ['Excel', 'Análisis de datos', 'Power BI'],
        calificacionPromedio: 4.8,
        totalReviews: 89,
        precioPorHora: 25000,
        modalidad: 'online',
        ubicacion: 'Medellín',
        descripcion: 'Contadora pública especializada en análisis de datos y automatización con Excel.',
        premium: false,
        categoria: 'Excel'
      },
      {
        _id: '4',
        nombre: 'Roberto Silva',
        especialidades: ['Excel', 'Macros', 'VBA', 'Power Query'],
        calificacionPromedio: 4.95,
        totalReviews: 156,
        precioPorHora: 40000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Microsoft Excel MVP. Especialista en automatización y macros avanzadas.',
        premium: true,
        categoria: 'Excel'
      },

      // Inglés
      {
        _id: '5',
        nombre: 'Jennifer Thompson',
        especialidades: ['Inglés', 'TOEFL', 'Business English'],
        calificacionPromedio: 4.7,
        totalReviews: 78,
        precioPorHora: 30000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Profesora nativa de inglés con certificación CELTA. Especialista en preparación para exámenes internacionales.',
        premium: false,
        categoria: 'Inglés'
      },
      {
        _id: '6',
        nombre: 'David Wilson',
        especialidades: ['Inglés', 'Conversacional', 'IELTS'],
        calificacionPromedio: 4.9,
        totalReviews: 134,
        precioPorHora: 38000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'Profesor bilingüe con 10 años de experiencia. Especialista en inglés conversacional y preparación IELTS.',
        premium: true,
        categoria: 'Inglés'
      },

      // Matemáticas
      {
        _id: '7',
        nombre: 'Luis Hernández',
        especialidades: ['Matemáticas', 'Cálculo', 'Álgebra'],
        calificacionPromedio: 4.6,
        totalReviews: 92,
        precioPorHora: 28000,
        modalidad: 'online',
        ubicacion: 'Cali',
        descripcion: 'Matemático con maestría en educación. Especialista en cálculo diferencial e integral.',
        premium: false,
        categoria: 'Matemáticas'
      },
      {
        _id: '8',
        nombre: 'Carmen Vega',
        especialidades: ['Matemáticas', 'Estadística', 'Probabilidad'],
        calificacionPromedio: 4.8,
        totalReviews: 67,
        precioPorHora: 32000,
        modalidad: 'online',
        ubicacion: 'Medellín',
        descripcion: 'Estadística con experiencia en investigación. Especialista en análisis estadístico y probabilidad.',
        premium: false,
        categoria: 'Matemáticas'
      },

      // Diseño Gráfico
      {
        _id: '9',
        nombre: 'Sofia Martínez',
        especialidades: ['Diseño Gráfico', 'Photoshop', 'Illustrator'],
        calificacionPromedio: 4.7,
        totalReviews: 45,
        precioPorHora: 35000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'Diseñadora gráfica freelance con 6 años de experiencia. Especialista en Adobe Creative Suite.',
        premium: false,
        categoria: 'Diseño Gráfico'
      },
      {
        _id: '10',
        nombre: 'Alejandro Torres',
        especialidades: ['Diseño Gráfico', 'Figma', 'UI/UX'],
        calificacionPromedio: 4.9,
        totalReviews: 89,
        precioPorHora: 42000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Diseñador UI/UX senior. Especialista en Figma y diseño de interfaces digitales.',
        premium: true,
        categoria: 'Diseño Gráfico'
      },

      // Marketing Digital
      {
        _id: '11',
        nombre: 'Valentina Ruiz',
        especialidades: ['Marketing Digital', 'SEO', 'Google Ads'],
        calificacionPromedio: 4.5,
        totalReviews: 56,
        precioPorHora: 30000,
        modalidad: 'online',
        ubicacion: 'Barranquilla',
        descripcion: 'Especialista en marketing digital con experiencia en agencias. Especialista en SEO y publicidad online.',
        premium: false,
        categoria: 'Marketing Digital'
      },
      {
        _id: '12',
        nombre: 'Ricardo Morales',
        especialidades: ['Marketing Digital', 'Redes Sociales', 'Content Marketing'],
        calificacionPromedio: 4.8,
        totalReviews: 78,
        precioPorHora: 38000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Consultor de marketing digital. Especialista en estrategias de redes sociales y content marketing.',
        premium: true,
        categoria: 'Marketing Digital'
      },

      // Contabilidad
      {
        _id: '13',
        nombre: 'Patricia López',
        especialidades: ['Contabilidad', 'Excel', 'SAP'],
        calificacionPromedio: 4.6,
        totalReviews: 34,
        precioPorHora: 28000,
        modalidad: 'online',
        ubicacion: 'Cartagena',
        descripcion: 'Contadora pública con experiencia en sistemas ERP. Especialista en contabilidad y finanzas.',
        premium: false,
        categoria: 'Contabilidad'
      },

      // Finanzas
      {
        _id: '14',
        nombre: 'Fernando Castro',
        especialidades: ['Finanzas', 'Inversiones', 'Análisis Financiero'],
        calificacionPromedio: 4.9,
        totalReviews: 112,
        precioPorHora: 45000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'Analista financiero senior. Especialista en inversiones y análisis de mercado.',
        premium: true,
        categoria: 'Finanzas'
      },

      // Análisis de Datos
      {
        _id: '15',
        nombre: 'Laura Jiménez',
        especialidades: ['Análisis de Datos', 'Python', 'Power BI'],
        calificacionPromedio: 4.7,
        totalReviews: 67,
        precioPorHora: 40000,
        modalidad: 'online',
        ubicacion: 'Medellín',
        descripcion: 'Data Scientist con experiencia en empresas tecnológicas. Especialista en Python y visualización de datos.',
        premium: true,
        categoria: 'Análisis de Datos'
      }
    ]

    setProfesores(profesoresEjemplo)
    setLoading(false)
  }, [])

  // Función para formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de búsqueda */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoriaParam ? `Profesores de ${categoriaParam}` : 'Buscar Profesores'}
              </h1>
              <p className="text-gray-600 mt-1">
                {profesoresFiltrados.length} profesores encontrados
                {categoriaParam && ` en ${categoriaParam}`}
                {queryParam && ` para "${queryParam}"`}
              </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar profesores..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-1 rounded-md hover:bg-primary-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de resultados */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * profesoresPerPage) + 1} - {Math.min(currentPage * profesoresPerPage, profesoresFiltrados.length)} de {profesoresFiltrados.length} profesores
          </div>
          
          {/* Filtros de ordenamiento */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select
              value={ordenarParam || 'rating'}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams)
                newParams.set('ordenar', e.target.value)
                setSearchParams(newParams)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="rating">Mejor calificación</option>
              <option value="premium">Premium primero</option>
              <option value="precio-asc">Precio menor</option>
              <option value="precio-desc">Precio mayor</option>
            </select>
          </div>
        </div>

        {/* Lista de profesores */}
        <div className="space-y-6">
          {profesoresPaginaActual.map((profesor) => (
            <div key={profesor._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Información del profesor */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {profesor.nombre}
                          </h3>
                          {profesor.premium && (
                            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profesor.especialidades.map((especialidad, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {especialidad}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {profesor.calificacionPromedio?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({profesor.totalReviews || 0} reseñas)
                      </span>
                    </div>

                    {/* Modalidad y ubicación */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {profesor.modalidad || 'Online'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profesor.ubicacion || 'No especificada'}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {profesor.descripcion || 'Sin descripción disponible'}
                    </p>

                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">
                        Disponible
                      </span>
                    </div>
                  </div>

                  {/* Precio y acciones */}
                  <div className="flex-shrink-0 text-right mt-4 md:mt-0 md:ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatPrecio(profesor.precioPorHora || 0)}
                      <span className="text-sm font-normal text-gray-600">/hora</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/reservar/${profesor._id}`}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                      >
                        Reservar Clase
                      </Link>
                      <Link
                        to={`/profesor/${profesor._id}`}
                        className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 text-center"
                      >
                        Ver Perfil
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Mensaje si no hay resultados */}
          {profesoresFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No encontramos profesores
              </h3>
              <p className="text-gray-600 mb-6">
                {categoriaParam || queryParam 
                  ? `No hay profesores disponibles para tu búsqueda${categoriaParam ? ` en "${categoriaParam}"` : ''}${queryParam ? ` con "${queryParam}"` : ''}.`
                  : 'No hay profesores disponibles en este momento.'
                }
              </p>
              <div className="space-y-3">
                <Link
                  to="/buscar"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Ver todos los profesores
                </Link>
                <div>
                  <Link
                    to="/ser-profesor"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ¿Eres experto en este tema? Únete como profesor →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              {/* Botón anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </button>

              {/* Números de página */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                    page === currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : page === '...'
                      ? 'text-gray-400 border-gray-200 cursor-default'
                      : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Botón siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuscarClases