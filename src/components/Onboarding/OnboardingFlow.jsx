import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, X, Sparkles, Clock, Users, Calendar, CheckCircle } from 'lucide-react'
import WelcomeStep from './steps/WelcomeStep'
import CategoryStep from './steps/CategoryStep'
import LearningModeStep from './steps/LearningModeStep'
import AvailabilityStep from './steps/AvailabilityStep'
import FinalStep from './steps/FinalStep'

const OnboardingFlow = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    categoria: '',
    modalidad: '',
    disponibilidad: {
      dias: [],
      horarios: ''
    },
    experiencia: ''
  })

  const navigate = useNavigate()

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenido',
      component: WelcomeStep
    },
    {
      id: 'category',
      title: 'Intereses',
      component: CategoryStep
    },
    {
      id: 'learning-mode',
      title: 'Modalidad',
      component: LearningModeStep
    },
    {
      id: 'availability',
      title: 'Disponibilidad',
      component: AvailabilityStep
    },
    {
      id: 'final',
      title: 'Listo',
      component: FinalStep
    }
  ]

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Guardar preferencias en localStorage
    localStorage.setItem('userPreferences', JSON.stringify(formData))
    
    // Llamar función de completado si existe
    if (onComplete) {
      onComplete(formData)
    } else {
      // Redirigir a búsqueda con filtros aplicados
      const params = new URLSearchParams()
      if (formData.categoria) {
        params.set('categoria', formData.categoria)
      }
      navigate(`/buscar?${params.toString()}`)
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      navigate('/dashboard')
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 z-50 overflow-hidden">
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-secondary-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Progress */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index < currentStep ? 'bg-primary-600 text-white' :
                    index === currentStep ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600' :
                    'bg-secondary-200 text-secondary-500'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-all duration-300 ${
                      index < currentStep ? 'bg-primary-600' : 'bg-secondary-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step info */}
          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Paso {currentStep + 1} de {steps.length}
            </p>
            <p className="font-semibold text-secondary-900">
              {steps[currentStep].title}
            </p>
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="flex items-center text-secondary-500 hover:text-secondary-700 text-sm transition-colors"
          >
            Saltar
            <X className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-secondary-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentStep === 0
                ? 'text-secondary-400 cursor-not-allowed'
                : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Continuar
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ¡Empezar a Aprender!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-yellow-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  )
}

export default OnboardingFlow
