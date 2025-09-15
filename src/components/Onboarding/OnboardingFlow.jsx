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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 py-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' :
                    index === currentStep ? 'bg-white/20 text-white ring-2 ring-purple-400' :
                    'bg-white/10 text-purple-300'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step info */}
          <div className="text-center">
            <p className="text-sm text-purple-200">
              Paso {currentStep + 1} de {steps.length}
            </p>
            <p className="font-semibold text-white text-lg">
              {steps[currentStep].title}
            </p>
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="flex items-center text-purple-300 hover:text-white text-sm transition-colors px-3 py-2 rounded-xl hover:bg-white/10"
          >
            Saltar
            <X className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

        {/* Content */}
        <div className="flex-1 py-12 px-4">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
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
        </div>

        {/* Navigation */}
        <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 px-4 py-6 mt-8">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'text-purple-400 cursor-not-allowed opacity-50'
                  : 'text-white hover:text-purple-200 hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  ¡Empezar a Aprender!
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  )
}

export default OnboardingFlow
