import React from 'react'
import { BookOpen, Users, Video, Clock, Star } from 'lucide-react'

const LearningModeStep = ({ preferences, onUpdate, onNext, onBack }) => {
  const learningModes = [
    {
      id: 'individual',
      title: 'Clases Individuales',
      description: 'Atención personalizada 1 a 1 con el profesor',
      icon: BookOpen,
      features: [
        'Atención completamente personalizada',
        'Horario flexible según tu disponibilidad',
        'Ritmo de aprendizaje adaptado a ti',
        'Feedback inmediato y directo'
      ]
    },
    {
      id: 'grupal',
      title: 'Clases Grupales',
      description: 'Aprende con otros estudiantes (máximo 5 personas)',
      icon: Users,
      features: [
        'Interacción con otros estudiantes',
        'Precio más económico',
        'Aprendizaje colaborativo',
        'Máximo 5 estudiantes por grupo'
      ]
    },
    {
      id: 'pregrabada',
      title: 'Clases Pregrabadas',
      description: 'Videos disponibles 24/7 para aprender a tu ritmo',
      icon: Video,
      features: [
        'Acceso ilimitado 24/7',
        'Aprende a tu propio ritmo',
        'Puedes pausar y repetir',
        'Contenido de alta calidad'
      ]
    }
  ]

  const handleModeSelect = (modeId) => {
    onUpdate({ ...preferences, learningMode: modeId })
  }

  const handleNext = () => {
    if (preferences.learningMode) {
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          ¿Cómo prefieres aprender?
        </h2>
        <p className="text-lg text-secondary-600">
          Selecciona el modo de aprendizaje que mejor se adapte a tu estilo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {learningModes.map((mode) => {
          const Icon = mode.icon
          const isSelected = preferences.learningMode === mode.id

          return (
            <div
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-secondary-300 hover:border-primary-300 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
              )}

              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  isSelected ? 'bg-primary-100' : 'bg-secondary-100'
                }`}>
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-primary-600' : 'text-secondary-600'}`} />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {mode.title}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {mode.description}
                </p>
              </div>

              <ul className="space-y-2">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-secondary-700">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary-600" />
          ¿No estás seguro?
        </h4>
        <p className="text-secondary-700 mb-4">
          Puedes cambiar tu preferencia en cualquier momento desde tu perfil. 
          También puedes combinar diferentes modos de aprendizaje según tus necesidades.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Clases individuales: Mayor personalización</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span>Clases grupales: Mejor precio</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            <span>Pregrabadas: Máxima flexibilidad</span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 text-secondary-700 hover:text-secondary-900 transition-colors"
        >
          ← Anterior
        </button>
        
        <button
          onClick={handleNext}
          disabled={!preferences.learningMode}
          className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

export default LearningModeStep
