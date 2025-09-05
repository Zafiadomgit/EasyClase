import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Star, TrendingUp, Eye, Shield, Clock, Award, ArrowRight, Briefcase, Zap, Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Premium = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('mensual')

  // Debug: Mostrar información del usuario
  console.log('🔍 Premium Debug:', { user, isAuthenticated, loading })

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    )
  }

  // Verificar que es un profesor
  if (!user || user.tipoUsuario !== 'profesor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Solo para Profesores
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              La funcionalidad Premium está disponible únicamente para profesores registrados.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/ser-profesor')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Convertirse en Profesor
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const beneficios = [
    {
      icon: <Eye className="w-6 h-6 text-amber-600" />,
      titulo: "Mayor Visibilidad",
      descripcion: "Aparece en los primeros resultados de búsqueda y páginas destacadas"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      titulo: "Promoción Publicitaria",
      descripcion: "Tu perfil se muestra como anuncio en búsquedas relacionadas"
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-600" />,
      titulo: "Solo 5 Clases de Prueba",
      descripcion: "Menos clases gratuitas requeridas (nosotros las financiamos)"
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      titulo: "Insignia Premium",
      descripcion: "Distintivo dorado que genera más confianza en estudiantes"
    },
    {
      icon: <Star className="w-6 h-6 text-amber-600" />,
      titulo: "Prioridad en Recomendaciones",
      descripcion: "El algoritmo te favorece en sugerencias automáticas"
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      titulo: "Respuesta Prioritaria",
      descripcion: "Soporte técnico y resolución de incidencias en menos de 4 horas"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-amber-600" />,
      titulo: "Servicios Premium",
      descripcion: "Crea servicios destacados con mayor visibilidad y posicionamiento"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      titulo: "Publicación Instantánea",
      descripcion: "Tus servicios se publican sin revisión manual y aparecen inmediatamente"
    },
    {
      icon: <Target className="w-6 h-6 text-amber-600" />,
      titulo: "Comisión Reducida",
      descripcion: "Solo 15% de comisión en servicios (vs 20% estándar)"
    },
    {
      icon: <span className="text-2xl">✏️</span>,
      titulo: "Anotaciones Colaborativas",
      descripcion: "Dibuja y escribe sobre pantalla compartida en tiempo real (exclusivo Premium)"
    }
  ]

  const planes = {
    mensual: {
      precio: 49900,
      periodo: "/mes",
      descripcion: "Perfecto para probar Premium",
      ahorro: ""
    },
    trimestral: {
      precio: 129900,
      periodo: "/3 meses",
      descripcion: "Nuestro plan más popular",
      ahorro: "¡Ahorra $19.800!"
    },
    anual: {
      precio: 479900,
      periodo: "/año",
      descripcion: "La mejor inversión para tu negocio",
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
    setLoading(true)
    // Aquí implementaremos la integración con MercadoPago
    setTimeout(() => {
      setLoading(false)
      // Por ahora, solo mostramos una alerta
      alert('¡Próximamente! La integración con MercadoPago estará lista pronto.')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-yellow-300 mr-2" />
            <span className="text-sm font-medium">Solo para Profesores Verificados</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Desbloquea tu <span className="text-yellow-300">Potencial Premium</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto">
            Multiplica tus ingresos, reduce las clases gratuitas y obtén la visibilidad que mereces
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span>Mayor visibilidad</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span>Menos clases gratuitas</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span>Promoción publicitaria</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Beneficios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir <span className="text-amber-600">Premium</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
                <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {beneficio.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{beneficio.titulo}</h3>
                <p className="text-gray-600">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planes de Precios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Elige tu <span className="text-amber-600">Plan Premium</span>
          </h2>

          {/* Selector de Plan */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-amber-200">
              {Object.keys(planes).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedPlan === plan
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  {plan === 'mensual' && 'Mensual'}
                  {plan === 'trimestral' && 'Trimestral'}
                  {plan === 'anual' && 'Anual'}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Precio */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-amber-300">
              {planes[selectedPlan].ahorro && (
                <div className="text-center mb-4">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                    {planes[selectedPlan].ahorro}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-5xl font-extrabold text-amber-600 mb-2">
                  {formatPrecio(planes[selectedPlan].precio)}
                </div>
                <div className="text-gray-600 text-lg">
                  {planes[selectedPlan].periodo}
                </div>
                <p className="text-gray-500 mt-2">{planes[selectedPlan].descripcion}</p>
              </div>

              <button
                onClick={handleSuscribirse}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  <>
                    Suscribirme Ahora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Sin compromisos • Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>

        {/* Comparación */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Premium vs. Plan Gratuito
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2">Características</th>
                  <th className="text-center py-4 px-2 text-gray-500">Plan Gratuito</th>
                  <th className="text-center py-4 px-2 text-amber-600 font-bold">Plan Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-2 font-medium">Clases de prueba requeridas</td>
                  <td className="py-4 px-2 text-center text-gray-500">15-20 clases</td>
                  <td className="py-4 px-2 text-center text-amber-600 font-bold">Solo 5 clases</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Posición en búsquedas</td>
                  <td className="py-4 px-2 text-center text-gray-500">Orden estándar</td>
                  <td className="py-4 px-2 text-center text-amber-600 font-bold">Primeras posiciones</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Promoción publicitaria</td>
                  <td className="py-4 px-2 text-center text-gray-500">No incluida</td>
                  <td className="py-4 px-2 text-center text-amber-600 font-bold">✓ Incluida</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Insignia especial</td>
                  <td className="py-4 px-2 text-center text-gray-500">No</td>
                  <td className="py-4 px-2 text-center text-amber-600 font-bold">✓ Insignia Premium</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Soporte prioritario</td>
                  <td className="py-4 px-2 text-center text-gray-500">24-48 horas</td>
                  <td className="py-4 px-2 text-center text-amber-600 font-bold">Menos de 4 horas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Premium
