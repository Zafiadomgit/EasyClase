import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Clock, DollarSign, Crown, Briefcase, CheckCircle, Eye } from 'lucide-react'
import { servicioService } from '../services/api'

const BuscarServicios = () => {
  const [servicios, setServicios] = useState([])
  const [serviciosFiltrados, setServiciosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    modalidad: '',
    precioMin: '',
    precioMax: '',
    premium: false
  })

  const [ordenamiento, setOrdenamiento] = useState('recientes')

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
      console.error('Error cargando servicios:', error)
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

    // Filtro por modalidad
    if (filtros.modalidad) {
      resultado = resultado.filter(servicio => servicio.modalidad === filtros.modalidad)
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
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('q', searchQuery.trim())
      setSearchParams(newParams)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
          Buscar Servicios
        </h1>
        <p className="text-lg text-secondary-600 mb-6">
          Encuentra servicios profesionales de desarrollo, tesis, consultoría y más
        </p>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar servicios, desarrolladores, consultores..."
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </h3>

            {/* Categoría */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Categoría
              </label>
              <select
                value={filtros.categoria}
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
                className="w-full p-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            {/* Modalidad */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Modalidad
              </label>
              <select
                value={filtros.modalidad}
                onChange={(e) => setFiltros({ ...filtros, modalidad: e.target.value })}
                className="w-full p-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas</option>
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
                <option value="mixta">Mixta</option>
              </select>
            </div>

            {/* Rango de precios */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Rango de Precios
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filtros.precioMin}
                  onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                  className="p-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={filtros.precioMax}
                  onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                  className="p-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="mr-2"
                />
                <Crown className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-sm text-secondary-700">Solo Premium</span>
              </label>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-3">
          {/* Controles de ordenamiento */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-secondary-600">
              {serviciosFiltrados.length} servicios encontrados
            </p>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="p-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recientes">Más recientes</option>
              <option value="premium">Premium primero</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
              <option value="calificacion">Mejor calificados</option>
              <option value="populares">Más populares</option>
            </select>
          </div>

          {/* Grid de servicios */}
          {serviciosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviciosFiltrados.map((servicio) => {
                const esPremium = servicio.premium || servicio.proveedor?.premium || false
                
                return (
                  <Link
                    key={servicio._id}
                    to={`/servicios/${servicio._id}`}
                    className={`block bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      esPremium ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-white' : 'border-secondary-200'
                    }`}
                  >
                    <div className="p-6">
                      {/* Header con proveedor */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold">
                              {servicio.proveedor?.nombre?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{servicio.proveedor?.nombre}</p>
                            <div className="flex items-center text-sm text-secondary-600">
                              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                              {servicio.proveedor?.calificacionPromedio?.toFixed(1) || '0.0'}
                              <span className="mx-1">•</span>
                              {servicio.proveedor?.totalReviews || 0} reviews
                            </div>
                          </div>
                        </div>
                        {esPremium && (
                          <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </div>
                        )}
                      </div>

                      {/* Título y categoría */}
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                        {servicio.titulo}
                      </h3>
                      <p className="text-sm text-primary-600 mb-3">{servicio.categoria}</p>

                      {/* Descripción */}
                      <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                        {servicio.descripcion}
                      </p>

                      {/* Detalles */}
                      <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {servicio.tiempoPrevisto?.valor} {servicio.tiempoPrevisto?.unidad}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {servicio.modalidad}
                        </div>
                        {servicio.totalVentas > 0 && (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                            {servicio.totalVentas} ventas
                          </div>
                        )}
                      </div>

                      {/* Precio y comisión */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-secondary-900">
                            {formatPrecio(servicio.precio)}
                          </p>
                          {esPremium && (
                            <p className="text-xs text-green-600">
                              Solo 7% comisión (vs 10% estándar)
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {servicio.calificacionPromedio > 0 && (
                            <div className="flex items-center mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">
                                {servicio.calificacionPromedio.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-secondary-500">
                            {servicio.totalReviews || 0} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No se encontraron servicios
              </h3>
              <p className="text-secondary-600 mb-4">
                Intenta ajustar los filtros o búsqueda
              </p>
              <button
                onClick={() => {
                  setFiltros({
                    categoria: '',
                    modalidad: '',
                    precioMin: '',
                    precioMax: '',
                    premium: false
                  })
                  setSearchQuery('')
                  setSearchParams({})
                }}
                className="btn-primary"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuscarServicios
