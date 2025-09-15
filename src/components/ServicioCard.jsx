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
    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      esPremium ? 'border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-white/10' : 'border-white/20'
    }`}>
      <div className="p-6">
        {/* Header con proveedor */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-lg">
                {servicio.proveedor?.nombre?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-lg">{servicio.proveedor?.nombre}</p>
              <div className="flex items-center text-sm text-purple-200">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                {servicio.proveedor?.calificacionPromedio?.toFixed(1) || '0.0'}
                <span className="mx-1">•</span>
                {servicio.proveedor?.totalReviews || 0} reviews
              </div>
            </div>
          </div>
          {esPremium && (
            <div className="flex items-center bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/50">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </div>
          )}
        </div>

        {/* Título y categoría */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {servicio.titulo}
        </h3>
        <p className="text-sm text-purple-300 mb-4 font-medium">{servicio.categoria}</p>

        {/* Descripción */}
        <p className="text-purple-200 text-sm mb-5 line-clamp-3 leading-relaxed">
          {servicio.descripcion}
        </p>

        {/* Detalles */}
        <div className="flex items-center justify-between text-sm text-purple-200 mb-5">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-purple-300" />
            {servicio.tiempoPrevisto?.valor} {servicio.tiempoPrevisto?.unidad}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-purple-300" />
            {servicio.modalidad}
          </div>
          {servicio.totalVentas > 0 && (
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
              {servicio.totalVentas} ventas
            </div>
          )}
        </div>

        {/* Precio y comisión */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-3xl font-bold text-white">
              {formatPrecio(servicio.precio)}
            </p>
            {esPremium && (
              <p className="text-xs text-green-300 font-medium">
                Solo 15% comisión (vs 20% estándar)
              </p>
            )}
          </div>
          <div className="text-right">
            {servicio.calificacionPromedio > 0 && (
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold ml-1 text-white">
                  {servicio.calificacionPromedio.toFixed(1)}
                </span>
              </div>
            )}
            <p className="text-xs text-purple-300">
              {servicio.totalReviews || 0} reviews
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
          <Link
            to={`/servicios/${servicio.id}`}
            className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 text-center text-sm flex items-center justify-center transition-all duration-300 border border-white/20 font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Link>
          
          {user && user.tipoUsuario === 'estudiante' && (
            <button
              onClick={handleComprar}
              disabled={comprando}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 text-center text-sm flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
            >
              {comprando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
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
