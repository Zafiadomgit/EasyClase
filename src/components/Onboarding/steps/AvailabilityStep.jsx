import React, { useState } from 'react'
import { Clock, Calendar, Sun, Moon, Coffee, CheckCircle, Users } from 'lucide-react'

const AvailabilityStep = ({ formData, updateFormData, onNext }) => {
  const [selectedDays, setSelectedDays] = useState(formData.disponibilidad?.dias || [])
  const [selectedTime, setSelectedTime] = useState(formData.disponibilidad?.horarios || '')

  const diasSemana = [
    { id: 'lunes', nombre: 'Lunes', short: 'L' },
    { id: 'martes', nombre: 'Martes', short: 'M' },
    { id: 'miercoles', nombre: 'Miércoles', short: 'M' },
    { id: 'jueves', nombre: 'Jueves', short: 'J' },
    { id: 'viernes', nombre: 'Viernes', short: 'V' },
    { id: 'sabado', nombre: 'Sábado', short: 'S' },
    { id: 'domingo', nombre: 'Domingo', short: 'D' }
  ]

  const horariosPopulares = [
    {
      id: 'manana',
      nombre: 'Mañanas',
      horario: '8:00 AM - 12:00 PM',
      icon: <Sun className="w-6 h-6" />,
      description: 'Ideal para empezar el día productivo',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'tarde',
      nombre: 'Tardes',
      horario: '2:00 PM - 6:00 PM',
      icon: <Coffee className="w-6 h-6" />,
      description: 'Perfecto después del almuerzo',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      popular: true
    },
    {
      id: 'noche',
      nombre: 'Noches',
      horario: '7:00 PM - 10:00 PM',
      icon: <Moon className="w-6 h-6" />,
      description: 'Para después del trabajo/estudio',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300'
    },
    {
      id: 'flexible',
      nombre: 'Flexible',
      horario: 'Cualquier horario',
      icon: <Clock className="w-6 h-6" />,
      description: 'Me adapto a la disponibilidad del profesor',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    }
  ]

  const handleDayToggle = (dia) => {
    const newDays = selectedDays.includes(dia)
      ? selectedDays.filter(d => d !== dia)
      : [...selectedDays, dia]
    
    setSelectedDays(newDays)
    updateFormData({ 
      disponibilidad: { 
        dias: newDays, 
        horarios: selectedTime 
      } 
    })
  }

  const handleTimeSelect = (horario) => {
    setSelectedTime(horario.id)
    updateFormData({ 
      disponibilidad: { 
        dias: selectedDays, 
        horarios: horario.id 
      } 
    })
  }

  const handleContinue = () => {
    onNext()
  }

  const isFormValid = selectedDays.length > 0 && selectedTime

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 font-display">
          ¿Cuándo estás disponible?
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Ayúdanos a encontrar profesores que coincidan con tu horario ideal
        </p>
      </div>

      {/* Days selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          ¿Qué días prefieres?
        </h3>
        
        <div className="grid grid-cols-7 gap-3">
          {diasSemana.map((dia) => {
            const isSelected = selectedDays.includes(dia.id)
            
            return (
              <button
                key={dia.id}
                onClick={() => handleDayToggle(dia.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 bg-white hover:border-primary-300 text-secondary-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 mx-auto ${
                    isSelected ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                  }`}>
                    {dia.short}
                  </div>
                  <span className="text-xs font-medium">{dia.nombre}</span>
                </div>
                
                {isSelected && (
                  <div className="mt-2 flex justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {selectedDays.length > 0 && (
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              ✅ Has seleccionado {selectedDays.length} día{selectedDays.length > 1 ? 's' : ''} de la semana
            </p>
          </div>
        )}
      </div>

      {/* Time selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary-600" />
          ¿En qué horario?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {horariosPopulares.map((horario) => {
            const isSelected = selectedTime === horario.id
            
            return (
              <button
                key={horario.id}
                onClick={() => handleTimeSelect(horario)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left ${
                  isSelected
                    ? `${horario.borderColor} ${horario.bgColor} shadow-lg scale-105`
                    : 'border-secondary-200 bg-white hover:border-primary-300'
                }`}
              >
                {/* Popular badge */}
                {horario.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -left-2 bg-primary-600 text-white rounded-full p-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${horario.color} rounded-xl flex items-center justify-center text-white transition-transform duration-300 ${
                    isSelected ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {horario.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 transition-colors ${
                      isSelected ? 'text-primary-700' : 'text-secondary-900 group-hover:text-primary-600'
                    }`}>
                      {horario.nombre}
                    </h4>
                    <p className="text-sm font-medium text-secondary-700 mb-1">
                      {horario.horario}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {horario.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      {selectedDays.length > 0 && selectedTime && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-200">
          <div className="flex items-center justify-center space-x-6 text-center">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-primary-700">150+</p>
                <p className="text-xs text-primary-600">Profesores disponibles</p>
              </div>
            </div>
            <div className="w-px h-12 bg-primary-200"></div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-primary-700">4.8★</p>
                <p className="text-xs text-primary-600">Promedio de satisfacción</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue button */}
      {isFormValid && (
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
          💡 Tip: Puedes reservar clases fuera de estos horarios si el profesor está disponible
        </p>
      </div>
    </div>
  )
}

export default AvailabilityStep
