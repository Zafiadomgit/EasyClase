import React, { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Crown } from 'lucide-react'
import { profesorService } from '../services/api'

const BuscarClases = () => {
  const [profesores, setProfesores] = useState([])
  const [profesoresFiltrados, setProfesoresFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

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
    }
  }

  // Inicializar searchQuery con el parámetro de la URL
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [queryParam])

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
        calificacionPromedio: 4.9,
        totalReviews: 178,
        precioPorHora: 30000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Native English speaker. Certified TEFL teacher with 10+ years experience.',
        premium: false,
        categoria: 'Inglés'
      },

      // Matemáticas
      {
        _id: '6',
        nombre: 'Dr. Luis Pérez',
        especialidades: ['Matemáticas', 'Cálculo', 'Estadística'],
        calificacionPromedio: 4.85,
        totalReviews: 94,
        precioPorHora: 28000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'PhD en Matemáticas. Profesor universitario con 15 años de experiencia.',
        premium: false,
        categoria: 'Matemáticas'
      },

      // Diseño Gráfico
      {
        _id: '7',
        nombre: 'Sofia Martínez',
        especialidades: ['Diseño Gráfico', 'Photoshop', 'Illustrator', 'Figma'],
        calificacionPromedio: 4.92,
        totalReviews: 134,
        precioPorHora: 35000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'Diseñadora senior en Adobe. Especialista en branding y diseño digital.',
        premium: true,
        categoria: 'Diseño Gráfico'
      },

      // Marketing Digital
      {
        _id: '8',
        nombre: 'David Hernández',
        especialidades: ['Marketing Digital', 'SEO', 'Google Ads', 'Facebook Ads'],
        calificacionPromedio: 4.7,
        totalReviews: 67,
        precioPorHora: 32000,
        modalidad: 'online',
        ubicacion: 'Cali',
        descripcion: 'Growth Marketing Manager. Especialista en campañas digitales y analytics.',
        premium: false,
        categoria: 'Marketing Digital'
      },

      // Finanzas
      {
        _id: '9',
        nombre: 'Carlos Investments',
        especialidades: ['Finanzas', 'Inversiones', 'Crypto', 'Trading'],
        calificacionPromedio: 4.88,
        totalReviews: 112,
        precioPorHora: 50000,
        modalidad: 'online',
        ubicacion: 'Online',
        descripcion: 'CFA Charter Holder. 12 años en Wall Street. Especialista en inversiones.',
        premium: true,
        categoria: 'Finanzas'
      }
    ]
    
    setTimeout(() => {
      setProfesores(profesoresEjemplo)
      aplicarFiltros(profesoresEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  // Función para aplicar filtros basados en los parámetros de URL
  const aplicarFiltros = (listaProfesores) => {
    let filtrados = [...listaProfesores]

    // Filtrar por categoría
    if (categoriaParam) {
      filtrados = filtrados.filter(profesor => 
        profesor.categoria?.toLowerCase() === categoriaParam.toLowerCase() ||
        profesor.especialidades.some(esp => 
          esp.toLowerCase().includes(categoriaParam.toLowerCase())
        )
      )
    }

    // Filtrar por query de búsqueda
    if (queryParam) {
      filtrados = filtrados.filter(profesor =>
        profesor.nombre.toLowerCase().includes(queryParam.toLowerCase()) ||
        profesor.especialidades.some(esp => 
          esp.toLowerCase().includes(queryParam.toLowerCase())
        ) ||
        profesor.descripcion.toLowerCase().includes(queryParam.toLowerCase())
      )
    }

    // Filtrar por ubicación
    if (ubicacionParam && ubicacionParam !== 'Online') {
      filtrados = filtrados.filter(profesor =>
        profesor.ubicacion.toLowerCase().includes(ubicacionParam.toLowerCase())
      )
    }

    // Ordenar según el parámetro
    if (ordenarParam === 'premium') {
      // Profesores premium primero, luego por rating
      filtrados.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1
        return b.calificacionPromedio - a.calificacionPromedio
      })
    } else if (ordenarParam === 'rating') {
      // Ordenar por rating más alto
      filtrados.sort((a, b) => b.calificacionPromedio - a.calificacionPromedio)
    } else {
      // Orden por defecto: premium primero, luego rating
      filtrados.sort((a, b) => {
        if (a.premium && !b.premium) return -1
        if (!a.premium && b.premium) return 1
        return b.calificacionPromedio - a.calificacionPromedio
      })
    }

    setProfesoresFiltrados(filtrados)
  }

  // Actualizar filtros cuando cambien los parámetros
  useEffect(() => {
    if (profesores.length > 0) {
      aplicarFiltros(profesores)
    }
  }, [categoriaParam, queryParam, ubicacionParam, ordenarParam, profesores])

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando profesores...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
          Buscar Clases
        </h1>
        <p className="text-lg text-secondary-600 mb-6">
          Encuentra el profesor perfecto para lo que necesitas aprender
        </p>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por profesor, especialidad, tecnología..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full pl-10 pr-12 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <div className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                Buscar
              </div>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Información de filtros activos */}
      {(categoriaParam || queryParam || ubicacionParam) && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-primary-800 mb-2">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {categoriaParam && (
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                📚 {categoriaParam}
              </span>
            )}
            {queryParam && (
              <span className="bg-secondary-600 text-white px-3 py-1 rounded-full text-sm">
                🔍 "{queryParam}"
              </span>
            )}
            {ubicacionParam && (
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                📍 {ubicacionParam}
              </span>
            )}
            {ordenarParam === 'premium' && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                ⭐ Premium First
              </span>
            )}
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-secondary-600">
            {profesoresFiltrados.length} profesores encontrados
            {profesoresFiltrados.length !== profesores.length && (
              <span className="text-secondary-400"> (de {profesores.length} total)</span>
            )}
          </p>
          {ordenarParam === 'premium' && (
            <div className="text-sm text-yellow-600 font-medium">
              ⭐ Mostrando profesores Premium primero
            </div>
          )}
        </div>

        {/* Lista de profesores */}
        {profesoresFiltrados.map((profesor) => (
          <div key={profesor._id} className="card-hover cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto del profesor */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {profesor.nombre.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Información del profesor */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-secondary-900">
                        {profesor.nombre}
                      </h3>
                      {profesor.premium && (
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                          <Crown className="w-3 h-3 mr-1" />
                          PREMIUM
                        </div>
                      )}
                    </div>
                    <p className="text-primary-600 font-medium mb-2">
                      {profesor.especialidades?.join(', ') || 'Especialidades no especificadas'}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-secondary-900">
                          {profesor.calificacionPromedio?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-secondary-600">
                        ({profesor.totalReviews || 0} reseñas)
                      </span>
                    </div>

                    {/* Modalidad y ubicación */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-secondary-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {profesor.modalidad || 'Online'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profesor.ubicacion || 'No especificada'}
                      </div>
                    </div>

                    <p className="text-secondary-600 text-sm mb-3">
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
                    <div className="text-2xl font-bold text-secondary-900 mb-2">
                      {formatPrecio(profesor.precioPorHora || 0)}
                      <span className="text-sm font-normal text-secondary-600">/hora</span>
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
          </div>
        ))}

        {/* Mensaje si no hay resultados */}
        {profesoresFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No encontramos profesores
            </h3>
            <p className="text-secondary-600 mb-6">
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
    </div>
  )
}

export default BuscarClases