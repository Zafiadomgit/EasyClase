import React, { useState, useEffect } from 'react'
import { Clock, Plus, Trash2, Save, Calendar } from 'lucide-react'

const DisponibilidadProfesor = ({ onComplete, isOnboarding = false }) => {
  const [disponibilidad, setDisponibilidad] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const diasSemana = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ]

  const duracionOpciones = [
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1.5 horas' },
    { value: 120, label: '2 horas' }
  ]

  const tiempoEntreOpciones = [
    { value: 0, label: 'Sin descanso' },
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' }
  ]

  useEffect(() => {
    cargarDisponibilidad()
  }, [])

  const cargarDisponibilidad = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/disponibilidad', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setDisponibilidad(data.data.disponibilidad || [])
      }
    } catch (error) {
      console.error('Error cargando disponibilidad:', error)
    } finally {
      setLoading(false)
    }
  }

  const agregarHorario = () => {
    setDisponibilidad([...disponibilidad, {
      diaSemana: 'lunes',
      horaInicio: '09:00',
      horaFin: '17:00',
      duracionClase: 60,
      tiempoEntreClases: 15
    }])
  }

  const eliminarHorario = (index) => {
    setDisponibilidad(disponibilidad.filter((_, i) => i !== index))
  }

  const actualizarHorario = (index, campo, valor) => {
    const nuevaDisponibilidad = [...disponibilidad]
    nuevaDisponibilidad[index][campo] = valor
    setDisponibilidad(nuevaDisponibilidad)
  }

  const guardarDisponibilidad = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/disponibilidad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ disponibilidad })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Disponibilidad guardada correctamente')
        if (onComplete) {
          onComplete()
        }
      } else {
        alert(data.message || 'Error guardando disponibilidad')
      }
    } catch (error) {
      console.error('Error guardando disponibilidad:', error)
      alert('Error guardando disponibilidad')
    } finally {
      setSaving(false)
    }
  }

  const validarHorarios = () => {
    for (let i = 0; i < disponibilidad.length; i++) {
      const horario = disponibilidad[i]
      if (horario.horaInicio >= horario.horaFin) {
        alert(`El horario ${i + 1} tiene hora de inicio mayor o igual a la hora de fin`)
        return false
      }
    }
    return true
  }

  const handleGuardar = () => {
    if (disponibilidad.length === 0) {
      alert('Debes agregar al menos un horario de disponibilidad')
      return
    }

    if (!validarHorarios()) {
      return
    }

    guardarDisponibilidad()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isOnboarding && (
        <div className="mb-8 text-center">
          <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configura tu Disponibilidad</h1>
          <p className="text-gray-600">
            Define los horarios en los que estarás disponible para dar clases
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Horarios de Disponibilidad
          </h2>
          <button
            onClick={agregarHorario}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Horario
          </button>
        </div>

        {disponibilidad.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tienes horarios configurados</p>
            <p className="text-sm">Haz clic en "Agregar Horario" para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disponibilidad.map((horario, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  {/* Día de la semana */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Día
                    </label>
                    <select
                      value={horario.diaSemana}
                      onChange={(e) => actualizarHorario(index, 'diaSemana', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {diasSemana.map(dia => (
                        <option key={dia.value} value={dia.value}>
                          {dia.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hora de inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio
                    </label>
                    <input
                      type="time"
                      value={horario.horaInicio}
                      onChange={(e) => actualizarHorario(index, 'horaInicio', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Hora de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin
                    </label>
                    <input
                      type="time"
                      value={horario.horaFin}
                      onChange={(e) => actualizarHorario(index, 'horaFin', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Duración de clase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración
                    </label>
                    <select
                      value={horario.duracionClase}
                      onChange={(e) => actualizarHorario(index, 'duracionClase', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {duracionOpciones.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tiempo entre clases */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entre clases
                    </label>
                    <select
                      value={horario.tiempoEntreClases}
                      onChange={(e) => actualizarHorario(index, 'tiempoEntreClases', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {tiempoEntreOpciones.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botón eliminar */}
                  <div>
                    <button
                      onClick={() => eliminarHorario(index)}
                      className="w-full bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGuardar}
            disabled={saving || disponibilidad.length === 0}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Disponibilidad
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisponibilidadProfesor
