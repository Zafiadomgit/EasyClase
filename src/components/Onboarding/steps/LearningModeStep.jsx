import React, { useState } from 'react'
import { User, Users, Video, CheckCircle, Clock, DollarSign, Star } from 'lucide-react'

const LearningModeStep = ({ formData, updateFormData, onNext }) => {
  const [selectedMode, setSelectedMode] = useState(formData.modalidad || '')

  const modalidades = [
    {
      id: 'individual',
      nombre: 'Clase Individual',
      icon: <User className="w-10 h-10" />,
      descripcion: 'Atención personalizada 1 a 1',
      beneficios: [
        'Atención personalizada completa',
        'Ritmo adaptado a ti',
        'Flexibilidad total de horarios',
        'Enfoque en tus necesidades específicas'
      ],
      precio: 'Desde $30,000/hora',
      popularidad: 'Más popular',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
      popular: true
    },
    {
      id: 'grupo',
      nombre: 'Grupo Pequeño',
      icon: <Users className="w-10 h-10" />,
      descripcion: 'Aprende con 2-4 estudiantes más',
      beneficios: [
        'Interacción con otros estudiantes',
        'Costo compartido más económico',
        'Aprendizaje colaborativo',
        'Ambiente dinámico y divertido'
      ],
      precio: 'Desde $15,000/hora',
      popularidad: 'Económico',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    },
    {
      id: 'grabada',
      nombre: 'Sesión Grabada',
      icon: <Video className="w-10 h-10" />,
      descripcion: 'Contenido pre-grabado de calidad',
      beneficios: [
        'Ve las clases cuando quieras',
        'Repite el contenido las veces que necesites',
        'Precio fijo más accesible',
        'Ideal para aprender a tu ritmo'
      ],
      precio: 'Desde $10,000/curso',
      popularidad: 'Flexible',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700'
    }
  ]

  const handleModeSelect = (modalidad) => {
    setSelectedMode(modalidad.id)
    updateFormData({ modalidad: modalidad.id })
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 font-display">
          ¿Cómo prefieres aprender?
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Cada modalidad tiene sus ventajas. Elige la que mejor se adapte a tu estilo y disponibilidad
        </p>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modalidades.map((modalidad) => {
          const isSelected = selectedMode === modalidad.id
          
          return (
            <button
              key={modalidad.id}
              onClick={() => handleModeSelect(modalidad)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl text-left ${
                isSelected
                  ? `${modalidad.borderColor} ${modalidad.bgColor} shadow-xl scale-105`
                  : 'border-secondary-200 bg-white hover:border-primary-300'
              }`}
            >
              {/* Popular badge */}
              {modalidad.popular && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ Más popular
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -left-2 bg-primary-600 text-white rounded-full p-1.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}

              {/* Icon and header */}
              <div className="mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${modalidad.color} rounded-2xl flex items-center justify-center text-white mb-4 transition-transform duration-300 ${
                  isSelected ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {modalidad.icon}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 transition-colors ${
                  isSelected ? modalidad.textColor : 'text-secondary-900 group-hover:text-primary-600'
                }`}>
                  {modalidad.nombre}
                </h3>
                
                <p className="text-secondary-600 text-sm mb-3">
                  {modalidad.descripcion}
                </p>

                {/* Popularidad badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  modalidad.popular ? 'bg-yellow-100 text-yellow-800' :
                  modalidad.id === 'grupo' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  <Star className="w-3 h-3 mr-1" />
                  {modalidad.popularidad}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center text-secondary-700">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-semibold text-sm">{modalidad.precio}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                {modalidad.beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{beneficio}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Continue button */}
      {selectedMode && (
        <div className="text-center animate-fade-in">
          <button
            onClick={handleContinue}
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Continuar
            <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {/* Help text */}
      <div className="text-center">
        <p className="text-sm text-secondary-500">
          💡 Tip: Siempre puedes probar diferentes modalidades según el tema
        </p>
      </div>
    </div>
  )
}

export default LearningModeStep
