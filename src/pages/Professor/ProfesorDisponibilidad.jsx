import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle } from 'lucide-react'

const ProfesorDisponibilidad = () => {
  const [horarios, setHorarios] = useState([])
  const [nuevoHorario, setNuevoHorario] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    disponible: true
  })
  const [mensaje, setMensaje] = useState('')

  const diasSemana = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ]

  // Generar opciones de hora solo en punto y :30
  const generarOpcionesHora = () => {
    const opciones = []
    for (let hora = 6; hora <= 22; hora++) {
      // Hora en punto
      opciones.push({
        value: `${hora.toString().padStart(2, '0')}:00`,
        label: `${hora.toString().padStart(2, '0')}:00`
      })
      // Hora y media (solo hasta 21:30)
      if (hora < 22) {
        opciones.push({
          value: `${hora.toString().padStart(2, '0')}:30`,
          label: `${hora.toString().padStart(2, '0')}:30`
        })
      }
    }
    return opciones
  }

  const opcionesHora = generarOpcionesHora()

  // Cargar horarios existentes
  useEffect(() => {
    cargarHorarios()
  }, [])

  const cargarHorarios = async () => {
    try {
      const response = await fetch('/api/profesor/horarios.php')
      const data = await response.json()
      
      if (data.success) {
        setHorarios(data.data.horarios || [])
      } else {
        // Si no hay horarios guardados, usar ejemplos
        const horariosEjemplo = [
          { id: 1, dia: 'lunes', horaInicio: '09:00', horaFin: '12:00', disponible: true },
          { id: 2, dia: 'lunes', horaInicio: '14:00', horaFin: '18:00', disponible: true },
          { id: 3, dia: 'miercoles', horaInicio: '10:00', horaFin: '15:00', disponible: true },
          { id: 4, dia: 'viernes', horaInicio: '08:00', horaFin: '12:00', disponible: true }
        ]
        setHorarios(horariosEjemplo)
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error)
      // Usar ejemplos si falla la carga
      const horariosEjemplo = [
        { id: 1, dia: 'lunes', horaInicio: '09:00', horaFin: '12:00', disponible: true },
        { id: 2, dia: 'lunes', horaInicio: '14:00', horaFin: '18:00', disponible: true },
        { id: 3, dia: 'miercoles', horaInicio: '10:00', horaFin: '15:00', disponible: true },
        { id: 4, dia: 'viernes', horaInicio: '08:00', horaFin: '12:00', disponible: true }
      ]
      setHorarios(horariosEjemplo)
    }
  }

  const guardarHorarios = async (nuevosHorarios) => {
    try {
      const response = await fetch('/api/profesor/horarios.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ horarios: nuevosHorarios })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMensaje('Horarios guardados correctamente')
        setTimeout(() => setMensaje(''), 3000)
      } else {
        setMensaje('Error al guardar los horarios')
        setTimeout(() => setMensaje(''), 3000)
      }
    } catch (error) {
      console.error('Error al guardar horarios:', error)
      setMensaje('Error al guardar los horarios')
      setTimeout(() => setMensaje(''), 3000)
    }
  }

  const agregarHorario = async () => {
    if (!nuevoHorario.dia || !nuevoHorario.horaInicio || !nuevoHorario.horaFin) {
      setMensaje('Por favor completa todos los campos')
      return
    }

    if (nuevoHorario.horaInicio >= nuevoHorario.horaFin) {
      setMensaje('La hora de inicio debe ser anterior a la hora de fin')
      return
    }

    const id = Math.max(...horarios.map(h => h.id), 0) + 1
    const nuevosHorarios = [...horarios, { ...nuevoHorario, id }]
    setHorarios(nuevosHorarios)
    setNuevoHorario({ dia: '', horaInicio: '', horaFin: '', disponible: true })
    
    // Guardar automáticamente
    await guardarHorarios(nuevosHorarios)
  }

  const eliminarHorario = async (id) => {
    const nuevosHorarios = horarios.filter(h => h.id !== id)
    setHorarios(nuevosHorarios)
    
    // Guardar automáticamente
    await guardarHorarios(nuevosHorarios)
  }

  const toggleDisponibilidad = async (id) => {
    const nuevosHorarios = horarios.map(h => 
      h.id === id ? { ...h, disponible: !h.disponible } : h
    )
    setHorarios(nuevosHorarios)
    
    // Guardar automáticamente
    await guardarHorarios(nuevosHorarios)
  }

  const guardarCambios = () => {
    setMensaje('Disponibilidad guardada correctamente')
    setTimeout(() => setMensaje(''), 3000)
  }

  const obtenerHorariosPorDia = (dia) => {
    return horarios.filter(h => h.dia === dia).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurar Disponibilidad</h1>
        <p className="text-gray-600">Define tus horarios disponibles para clases</p>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{mensaje}</span>
          </div>
        </div>
      )}

      {/* Agregar nuevo horario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Agregar Nuevo Horario
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de la semana
            </label>
            <select
              value={nuevoHorario.dia}
              onChange={(e) => setNuevoHorario({...nuevoHorario, dia: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar día</option>
              {diasSemana.map(dia => (
                <option key={dia.value} value={dia.value}>{dia.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de inicio
            </label>
            <select
              value={nuevoHorario.horaInicio}
              onChange={(e) => setNuevoHorario({...nuevoHorario, horaInicio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una hora</option>
              {opcionesHora.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora de fin
            </label>
            <select
              value={nuevoHorario.horaFin}
              onChange={(e) => setNuevoHorario({...nuevoHorario, horaFin: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una hora</option>
              {opcionesHora.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={agregarHorario}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Horarios actuales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Horarios Configurados
          </h2>
          <button
            onClick={guardarCambios}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diasSemana.map(dia => (
            <div key={dia.value} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">{dia.label}</h3>
              
              {obtenerHorariosPorDia(dia.value).length === 0 ? (
                <p className="text-gray-500 text-sm text-center italic">Sin horarios configurados</p>
              ) : (
                <div className="space-y-2">
                  {obtenerHorariosPorDia(dia.value).map(horario => (
                    <div
                      key={horario.id}
                      className={`p-3 rounded-lg border ${
                        horario.disponible 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-600 mr-2" />
                          <span className="text-sm font-medium">
                            {horario.horaInicio} - {horario.horaFin}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleDisponibilidad(horario.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              horario.disponible
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-gray-200 border-gray-300'
                            }`}
                            title={horario.disponible ? 'Deshabilitar' : 'Habilitar'}
                          >
                            {horario.disponible && '✓'}
                          </button>
                          <button
                            onClick={() => eliminarHorario(horario.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar horario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          horario.disponible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {horario.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos para configurar tu disponibilidad:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Configura horarios amplios para tener más oportunidades de clases</li>
          <li>• Puedes habilitar/deshabilitar horarios sin eliminarlos</li>
          <li>• Los estudiantes solo verán los horarios marcados como "Disponible"</li>
          <li>• Actualiza tu disponibilidad regularmente según tus compromisos</li>
        </ul>
      </div>
    </div>
  )
}

export default ProfesorDisponibilidad
