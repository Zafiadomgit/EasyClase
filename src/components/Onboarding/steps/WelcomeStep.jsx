import React from 'react'
import { BookOpen, Sparkles, Users, Clock, Star } from 'lucide-react'

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Hero Icon */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-900" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 font-display">
          ¡Bienvenido a{' '}
          <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            EasyClase
          </span>
          !
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
          Aprende lo que necesitas, cuando lo necesitas. Te ayudamos a encontrar el profesor perfecto para ti.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">Profesores Expertos</h3>
          <p className="text-sm text-secondary-600">Más de 500 profesores verificados en todas las áreas</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">Horarios Flexibles</h3>
          <p className="text-sm text-secondary-600">Clases cuando te convenga, 7 días a la semana</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-secondary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-2">Calidad Garantizada</h3>
          <p className="text-sm text-secondary-600">4.8/5 promedio de satisfacción de estudiantes</p>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <button
          onClick={onNext}
          className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 shadow-xl"
        >
          <Sparkles className="w-5 h-5 mr-3" />
          ¡Empezar!
        </button>
        <p className="text-sm text-secondary-500">
          Solo te tomará 2 minutos personalizar tu experiencia
        </p>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 max-w-lg mx-auto border border-primary-200">
        <div className="flex items-center justify-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-sm text-secondary-700 italic mb-3">
          "Encontré el profesor perfecto en menos de 5 minutos. ¡Increíble!"
        </p>
        <p className="text-xs text-secondary-500 font-medium">
          - María, estudiante universitaria
        </p>
      </div>
    </div>
  )
}

export default WelcomeStep
