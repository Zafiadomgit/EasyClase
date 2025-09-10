import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, User, GraduationCap } from 'lucide-react'
import DisponibilidadProfesor from '../../components/DisponibilidadProfesor'

const OnboardingProfesor = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])

  const steps = [
    {
      id: 1,
      title: 'Configurar Disponibilidad',
      description: 'Define los horarios en los que estarás disponible para dar clases',
      icon: Clock,
      component: <DisponibilidadProfesor onComplete={handleStepComplete} isOnboarding={true} />
    },
    {
      id: 2,
      title: 'Completar Perfil',
      description: 'Agrega información adicional sobre tu experiencia y especialidades',
      icon: User,
      component: <div className="text-center py-12">
        <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Completar Perfil</h3>
        <p className="text-gray-600 mb-6">Esta funcionalidad estará disponible próximamente</p>
        <button
          onClick={() => handleStepComplete()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    },
    {
      id: 3,
      title: 'Crear tu Primera Clase',
      description: 'Crea una clase para comenzar a enseñar en la plataforma',
      icon: GraduationCap,
      component: <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Crear tu Primera Clase</h3>
        <p className="text-gray-600 mb-6">Ahora puedes crear clases que los estudiantes podrán reservar</p>
        <button
          onClick={() => navigate('/clases/crear')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mr-4"
        >
          Crear Clase
        </button>
        <button
          onClick={() => handleStepComplete()}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
        >
          Saltar por Ahora
        </button>
      </div>
    }
  ]

  function handleStepComplete() {
    const currentStepData = steps.find(step => step.id === currentStep)
    if (currentStepData && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Onboarding completado
      navigate('/dashboard')
    }
  }

  const currentStepData = steps.find(step => step.id === currentStep)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a EasyClase!
          </h1>
          <p className="text-gray-600">
            Configura tu perfil de profesor en unos simples pasos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : currentStep === step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    completedSteps.includes(step.id) ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Paso {currentStep} de {steps.length}: {currentStepData?.title}
            </h2>
            <p className="text-gray-600">{currentStepData?.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {currentStepData?.component}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="text-sm text-gray-500">
            {completedSteps.length} de {steps.length} pasos completados
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingProfesor
