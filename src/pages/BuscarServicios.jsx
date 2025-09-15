import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Crown, Briefcase, CheckCircle, Eye } from 'lucide-react'
import { servicioService } from '../services/api'
import { compraService } from '../services/compraService'
import ServicioCard from '../components/ServicioCard'
import { useAuth } from '../contexts/AuthContext'

const BuscarServicios = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [servicios, setServicios] = useState([])
  const [serviciosFiltrados, setServiciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    precioMin: '',
    precioMax: '',
    premium: false
  })

  const [ordenamiento, setOrdenamiento] = useState('recientes')

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [serviciosPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Inicializar con parámetros de la URL
    const categoria = searchParams.get('categoria') || ''
    const busqueda = searchParams.get('q') || ''
    
    setFiltros(prev => ({ ...prev, categoria }))
    setSearchQuery(busqueda)
    
    cargarServicios()
  }, [searchParams])

  useEffect(() => {
    aplicarFiltros()
  }, [servicios, filtros, ordenamiento, searchQuery])

  const cargarServicios = async () => {
    try {
      setLoading(true)
      const response = await servicioService.obtenerServicios()
      setServicios(response.data?.servicios || [])
          } catch (error) {
        setError('Error al cargar los servicios')
      } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let resultado = [...servicios]

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      resultado = resultado.filter(servicio =>
        servicio.titulo.toLowerCase().includes(query) ||
        servicio.descripcion.toLowerCase().includes(query) ||
        servicio.categoria.toLowerCase().includes(query) ||
        servicio.proveedor?.nombre.toLowerCase().includes(query)
      )
    }

    // Filtro por categoría
    if (filtros.categoria) {
      resultado = resultado.filter(servicio => servicio.categoria === filtros.categoria)
    }

    // Filtro por precio
    if (filtros.precioMin) {
      resultado = resultado.filter(servicio => servicio.precio >= parseInt(filtros.precioMin))
    }
    if (filtros.precioMax) {
      resultado = resultado.filter(servicio => servicio.precio <= parseInt(filtros.precioMax))
    }

    // Filtro premium
    if (filtros.premium) {
      resultado = resultado.filter(servicio => servicio.premium || servicio.proveedor?.premium)
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case 'precio_asc':
          return a.precio - b.precio
        case 'precio_desc':
          return b.precio - a.precio
        case 'calificacion':
          return (b.calificacionPromedio || 0) - (a.calificacionPromedio || 0)
        case 'populares':
          return (b.totalVentas || 0) - (a.totalVentas || 0)
        case 'premium':
          const aPremium = a.premium || a.proveedor?.premium || false
          const bPremium = b.premium || b.proveedor?.premium || false
          if (aPremium && !bPremium) return -1
          if (!aPremium && bPremium) return 1
          return (b.calificacionPromedio || 0) - (a.calificacionPromedio || 0)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    setServiciosFiltrados(resultado)
    
    // Calcular total de páginas para paginación
    const nuevasPaginas = Math.ceil(resultado.length / serviciosPerPage)
    setTotalPages(nuevasPaginas)
    
    // Siempre ir a la primera página al aplicar filtros
    setCurrentPage(1)
  }

  // Calcular servicios para la página actual
  const getServiciosPaginaActual = () => {
    const startIndex = (currentPage - 1) * serviciosPerPage
    const endIndex = startIndex + serviciosPerPage
    return serviciosFiltrados.slice(startIndex, endIndex)
  }

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('q', searchQuery.trim())
      setSearchParams(newParams)
    }
  }

  const handleComprar = async (servicioId) => {
    try {
      const response = await compraService.crearCompra(servicioId)
      
      if (response.success) {
        // Redirigir a MercadoPago
        window.location.href = response.data.pago.init_point
      }
    } catch (error) {
      alert(error.message || 'Error procesando la compra')
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const categorias = [
    'Tesis y Trabajos Académicos',
    'Desarrollo Web',
    'Desarrollo de Apps',
    'Diseño Gráfico',
    'Marketing Digital',
    'Consultoría de Negocios',
    'Traducción',
    'Redacción de Contenido',
    'Otros'
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando servicios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header elegante */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Buscar Servicios
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Encuentra servicios profesionales de desarrollo, tesis, consultoría y más
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-purple-300" />
              </div>
              <input
                type="text"
                placeholder="Buscar servicios, desarrolladores, consultores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-12 pr-16 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-lg text-white placeholder-purple-300 backdrop-blur-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold">
                  Buscar
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

          {error && (
            <div className="mb-8 p-6 bg-red-500/20 border border-red-400/50 rounded-2xl backdrop-blur-sm">
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filtros */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sticky top-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                  Filtros
                  {((filtros.categoria || filtros.precioMin || filtros.precioMax || filtros.premium) && (
                    <span className="ml-3 bg-purple-500/20 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-400/50">
                      Activos
                    </span>
                  ))}
                </h3>

                {/* Categoría */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white mb-3">
                    Categoría
                  </label>
                  <select
                    value={filtros.categoria}
                    onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm"
                  >
                    <option value="" className="bg-slate-800 text-white">Todas las categorías</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria} className="bg-slate-800 text-white">{categoria}</option>
                    ))}
                  </select>
                </div>

                {/* Modalidad */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white mb-3">
                    Modalidad
                  </label>
                  <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-sm text-blue-200 font-medium">Todas las modalidades son Online</span>
                    </div>
                    <p className="text-xs text-blue-200 mt-2">
                      Garantizamos tu seguridad y prevenimos fraudes
                    </p>
                  </div>
                </div>

                {/* Rango de precios */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-white mb-3">
                    Rango de Precios
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={filtros.precioMin}
                      onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                      className="p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300 backdrop-blur-sm"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filtros.precioMax}
                      onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                      className="p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Solo Premium */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.premium}
                      onChange={(e) => setFiltros({ ...filtros, premium: e.target.checked })}
                      className="mr-3 w-5 h-5 text-purple-600"
                    />
                    <Crown className="w-5 h-5 text-amber-400 mr-2" />
                    <span className="text-sm text-white font-medium">Solo Premium</span>
                  </label>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-3 pt-4 border-t border-white/20">
                  <button
                    onClick={() => aplicarFiltros()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    🔍 Aplicar Filtros
                  </button>
                  <button
                    onClick={() => {
                      setFiltros({
                        categoria: '',
                        precioMin: '',
                        precioMax: '',
                        premium: false
                      })
                      setSearchQuery('')
                      setSearchParams({})
                      setCurrentPage(1) // Resetear a la primera página
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
                  >
                    🗑️ Limpiar Filtros
                  </button>
                </div>
          </div>
        </div>

            {/* Resultados */}
            <div className="lg:col-span-3">
              {/* Controles de ordenamiento */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-purple-200 font-medium">
                  Mostrando {((currentPage - 1) * serviciosPerPage) + 1} - {Math.min(currentPage * serviciosPerPage, serviciosFiltrados.length)} de {serviciosFiltrados.length} servicios encontrados
                </p>
                <select
                  value={ordenamiento}
                  onChange={(e) => setOrdenamiento(e.target.value)}
                  className="p-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-sm"
                >
                  <option value="recientes" className="bg-slate-800 text-white">Más recientes</option>
                  <option value="premium" className="bg-slate-800 text-white">Premium primero</option>
                  <option value="precio_asc" className="bg-slate-800 text-white">Menor precio</option>
                  <option value="precio_desc" className="bg-slate-800 text-white">Mayor precio</option>
                  <option value="calificacion" className="bg-slate-800 text-white">Mejor calificados</option>
                  <option value="populares" className="bg-slate-800 text-white">Más populares</option>
                </select>
              </div>

              {/* Grid de servicios */}
              {serviciosFiltrados.length > 0 ? (
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {getServiciosPaginaActual().map((servicio) => (
                      <ServicioCard
                        key={servicio._id}
                        servicio={servicio}
                        onComprar={handleComprar}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                    <Briefcase className="w-10 h-10 text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    No se encontraron servicios
                  </h3>
                  <p className="text-purple-200 mb-8 text-lg">
                    Intenta ajustar los filtros o búsqueda
                  </p>
                  <button
                    onClick={() => {
                      setFiltros({
                        categoria: '',
                        precioMin: '',
                        precioMax: '',
                        premium: false
                      })
                      setSearchQuery('')
                      setSearchParams({})
                      setCurrentPage(1) // Resetear a la primera página
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-12 mb-24 flex items-center justify-center">
              <nav className="flex items-center space-x-2">
                {/* Botón anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
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
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      {/* Espaciado adicional para separar del footer */}
      <div className="h-16"></div>
    </div>
  )
}

export default BuscarServicios
