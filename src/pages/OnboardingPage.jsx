import React from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingFlow from '../components/Onboarding/OnboardingFlow'

const OnboardingPage = () => {
  const navigate = useNavigate()

  const handleOnboardingComplete = (preferences) => {
    // Guardar preferencias y redirigir
    console.log('Onboarding completado con preferencias:', preferences)
    navigate('/buscar', { 
      state: { preferences },
      replace: true 
    })
  }

  const handleOnboardingSkip = () => {
    console.log('Onboarding saltado')
    navigate('/dashboard', { replace: true })
  }

  return (
    <OnboardingFlow 
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingSkip}
    />
  )
}

export default OnboardingPage
