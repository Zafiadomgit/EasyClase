import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Star, Crown, TrendingUp, Eye, Shield, Clock, ArrowRight, CheckCircle } from 'lucide-react'

const PremiumModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('mensual')

  // Verificación más robusta
  if (!isOpen) return null
  if (!user) return null
  if (user.tipoUsuario !== 'profesor') return null

  const beneficios = [
    {
      icon: <Eye className="w-5 h-5 text-amber-600" />,
      texto: "Mayor visibilidad en búsquedas"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      texto: "Promoción publicitaria"
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-600" />,
      texto: "Solo 5 clases de prueba (vs 15-20)"
    },
    {
      icon: <Crown className="w-5 h-5 text-amber-600" />,
      texto: "Insignia Premium dorada"
    }
  ]

  const planes = {
    mensual: {
      precio: 49900,
      periodo: "/mes",
      ahorro: ""
    },
    trimestral: {
      precio: 129900,
      periodo: "/3 meses",
      ahorro: "¡Ahorra $19.800!"
    },
    anual: {
      precio: 479900,
      periodo: "/año",
      ahorro: "¡Ahorra $118.900!"
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const handleSuscribirse = () => {
    onClose()
    navigate('/premium')
  }

  const handleMasTarde = () => {
    // Guardar en localStorage que ya vio el modal para no mostrarlo por un tiempo
    localStorage.setItem('premiumModalShown', Date.now().toString())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              ¡Hola {user.nombre?.split(' ')[0]}! 👋
            </h2>
            <p className="text-amber-100">
              Multiplica tus ingresos con Premium
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Beneficios */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              ¿Por qué Premium? 🚀
            </h3>
            <div className="space-y-3">
              {beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-amber-50 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    {beneficio.icon}
                  </div>
                  <span className="text-gray-700 text-sm">{beneficio.texto}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selector de Plan */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Elige tu plan:</h4>
            <div className="space-y-2">
              {Object.keys(planes).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPlan === plan
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${selectedPlan === plan ? 'text-amber-700' : 'text-gray-900'}`}>
                        {plan === 'mensual' && 'Plan Mensual'}
                        {plan === 'trimestral' && 'Plan Trimestral ⭐'}
                        {plan === 'anual' && 'Plan Anual 🎯'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrecio(planes[plan].precio)}{planes[plan].periodo}
                      </div>
                    </div>
                    {planes[plan].ahorro && (
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {planes[plan].ahorro}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSuscribirse}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center"
            >
              <span>Obtener Premium Ahora</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <button
              onClick={handleMasTarde}
              className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tal vez más tarde
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Sin compromisos
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Cancela cuando quieras
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumModal
