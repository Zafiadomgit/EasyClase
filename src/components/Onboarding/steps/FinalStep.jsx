import React from 'react'
import { Sparkles, CheckCircle, Calendar, BookOpen, Users, ArrowRight, Star, Gift } from 'lucide-react'

const FinalStep = ({ formData, onNext }) => {
  const getModalidadName = (modalidad) => {
    switch(modalidad) {
      case 'individual': return 'Clases Individuales'
      case 'grupo': return 'Grupos Pequeños'
      case 'grabada': return 'Sesiones Grabadas'
      default: return 'Flexible'
    }
  }

  const getDisponibilidadText = () => {
    const { dias = [], horarios = '' } = formData.disponibilidad || {}
    const diasText = dias.length > 0 ? `${dias.length} días/semana` : 'Flexible'
    const horariosMap = {
      'manana': 'Mañanas',
      'tarde': 'Tardes',
      'noche': 'Noches',
      'flexible': 'Horario flexible'
    }
    const horariosText = horariosMap[horarios] || 'Flexible'
    
    return `${diasText}, ${horariosText}`
  }

  return (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Success Icon */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-900" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 font-display">
          ¡Perfecto! 🎉
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-600">
          Tu perfil está configurado
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Basándote en tus preferencias, te mostraremos los profesores más adecuados para ti
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center justify-center">
          <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
          Tu perfil de aprendizaje
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categoría */}
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-1">Interés</h4>
            <p className="text-sm text-secondary-600">
              {formData.categoria || 'Explorar todas las áreas'}
            </p>
          </div>

          {/* Modalidad */}
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-1">Modalidad</h4>
            <p className="text-sm text-secondary-600">
              {getModalidadName(formData.modalidad)}
            </p>
          </div>

          {/* Disponibilidad */}
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-1">Disponibilidad</h4>
            <p className="text-sm text-secondary-600">
              {getDisponibilidadText()}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-secondary-900 mb-2">Matches Personalizados</h4>
          <p className="text-sm text-secondary-600">
            Te mostraremos solo profesores que coincidan con tus preferencias
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-secondary-900 mb-2">Reserva Fácil</h4>
          <p className="text-sm text-secondary-600">
            Reserva clases en segundos con profesores pre-filtrados
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6 text-yellow-600" />
          </div>
          <h4 className="font-semibold text-secondary-900 mb-2">Ofertas Especiales</h4>
          <p className="text-sm text-secondary-600">
            Acceso a descuentos y promociones exclusivas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 max-w-lg mx-auto">
        <div className="flex items-center justify-center space-x-8 text-center">
          <div>
            <p className="text-2xl font-bold text-green-700">89%</p>
            <p className="text-xs text-green-600">Satisfacción estudiantes</p>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <p className="text-2xl font-bold text-green-700">24h</p>
            <p className="text-xs text-green-600">Respuesta promedio</p>
          </div>
          <div className="w-px h-12 bg-green-300"></div>
          <div>
            <p className="text-2xl font-bold text-green-700">500+</p>
            <p className="text-xs text-green-600">Profesores activos</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <button
          onClick={onNext}
          className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xl font-bold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 shadow-xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          ¡Empezar a Aprender!
          <ArrowRight className="w-6 h-6 ml-3" />
        </button>
        
        <p className="text-sm text-secondary-500">
          Te redirigiremos a clases que coincidan con tu perfil
        </p>
      </div>

      {/* Welcome message */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 max-w-lg mx-auto">
        <p className="text-yellow-800 font-medium">
          🎁 <strong>¡Bienvenido a EasyClase!</strong><br/>
          <span className="text-sm">Como nuevo usuario, tienes acceso a una clase de prueba gratuita</span>
        </p>
      </div>
    </div>
  )
}

export default FinalStep
