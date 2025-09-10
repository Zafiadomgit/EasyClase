import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, CheckCircle, Crown, ShoppingCart, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ServicioCard = ({ servicio, onComprar }) => {
  const { user } = useAuth()
  const [comprando, setComprando] = useState(false)

  const esPremium = servicio.proveedor?.esPremium || false

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const handleComprar = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Debes iniciar sesión para comprar servicios')
      return
    }

    if (user.tipoUsuario === 'profesor' && user.id === servicio.proveedor?.id) {
      alert('No puedes comprar tu propio servicio')
      return
    }

    setComprando(true)
    try {
      await onComprar(servicio.id)
    } catch (error) {
      console.error('Error comprando servicio:', error)
    } finally {
      setComprando(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
      esPremium ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-white' : 'border-secondary-200'
    }`}>
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-secondary-900">
              {formatPrecio(servicio.precio)}
            </p>
            {esPremium && (
              <p className="text-xs text-green-600">
                Solo 15% comisión (vs 20% estándar)
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

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <Link
            to={`/servicios/${servicio.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center text-sm flex items-center justify-center transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Detalles
          </Link>
          
          {user && user.tipoUsuario === 'estudiante' && (
            <button
              onClick={handleComprar}
              disabled={comprando}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-center text-sm flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {comprando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Comprar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServicioCard
