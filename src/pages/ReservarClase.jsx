import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ReservarClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [clase, setClase] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [tipoAgenda, setTipoAgenda] = useState('') // 'individual' o 'grupal'
  const [reservando, setReservando] = useState(false)

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

  // Estado del horario seleccionado
  const [estadoHorario, setEstadoHorario] = useState(null) // null, 'disponible', 'individual', 'grupal'
  const [alumnosInscritos, setAlumnosInscritos] = useState(0)

  useEffect(() => {
    cargarInformacionClase()
  }, [id])

  // Verificar estado del horario cuando se selecciona
  useEffect(() => {
    if (fechaSeleccionada && horaSeleccionada) {
      verificarEstadoHorario()
    }
  }, [fechaSeleccionada, horaSeleccionada])

  const cargarInformacionClase = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clases/reservar.php?id=${id}`)
      const data = await response.json()
      
      if (data.success) {
        setClase(data.data.clase)
      } else {
        setError('Error al cargar la información de la clase')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar la información de la clase')
    } finally {
      setLoading(false)
    }
  }

  const verificarEstadoHorario = async () => {
    try {
      const response = await fetch(`/api/clases/verificar-horario.php?profesorId=${clase?.profesor?.id}&fecha=${fechaSeleccionada}&hora=${horaSeleccionada}`)
      const data = await response.json()
      
      if (data.success) {
        setEstadoHorario(data.data.estado) // 'disponible', 'individual', 'grupal'
        setAlumnosInscritos(data.data.alumnosInscritos || 0)
      } else {
        setEstadoHorario('disponible')
        setAlumnosInscritos(0)
      }
    } catch (error) {
      console.error('Error al verificar horario:', error)
      setEstadoHorario('disponible')
      setAlumnosInscritos(0)
    }
  }

  const reservar = async () => {
    if (!fechaSeleccionada || !horaSeleccionada || !tipoAgenda) {
      alert('Por favor completa todos los campos')
      return
    }

    // Validar según el estado del horario
    if (estadoHorario === 'individual' && tipoAgenda !== 'individual') {
      alert('Este horario ya fue reservado como individual')
      return
    }
    
    if (estadoHorario === 'grupal' && tipoAgenda !== 'grupal') {
      alert('Este horario ya fue reservado como grupal')
      return
    }

    if (estadoHorario === 'grupal' && alumnosInscritos >= 5) {
      alert('Este horario grupal ya está completo (máximo 5 alumnos)')
      return
    }

    try {
      setReservando(true)
      const response = await fetch('/api/clases/reservar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profesorId: id,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          tipoAgenda: tipoAgenda
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Redirigir al sistema de pagos en lugar de reservar directamente
        const reservaData = {
          profesorId: id,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          tipoAgenda: tipoAgenda,
          precio: tipoAgenda === 'individual' ? clase?.profesor?.precioHora : Math.round((clase?.profesor?.precioHora || 0) * 0.7),
          profesorNombre: clase?.profesor?.nombre
        }
        
        // Guardar datos de reserva en localStorage para el pago
        console.log('Guardando reserva en localStorage:', reservaData)
        localStorage.setItem('reservaPendiente', JSON.stringify(reservaData))
        console.log('Reserva guardada, verificando:', localStorage.getItem('reservaPendiente'))
        
        // Redirigir a la página de pago
        navigate('/pago')
      } else {
        alert('Error al procesar la reserva: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al reservar la clase')
    } finally {
      setReservando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error || !clase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Clase no encontrada'}</p>
          <button
            onClick={() => navigate('/buscar')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a buscar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Reservar Clase</h1>
          
          {/* Información del profesor */}
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{clase.profesor.nombre}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                ⭐ {clase.profesor.calificacionPromedio} ({clase.profesor.totalResenas} reseñas)
              </span>
              <span>${clase.profesor.precioHora.toLocaleString()}/hora</span>
              {clase.profesor.esPremium && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Premium
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {clase.profesor.especialidades.map((especialidad, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                >
                  {especialidad}
                </span>
              ))}
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <select
                value={horaSeleccionada}
                onChange={(e) => setHoraSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una hora</option>
                {opcionesHora.map(opcion => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de tipo de agenda */}
            {fechaSeleccionada && horaSeleccionada && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Clase
                </label>
                
                {/* Estado del horario */}
                {estadoHorario && (
                  <div className="mb-4 p-3 rounded-lg border">
                    {estadoHorario === 'disponible' && (
                      <div className="text-green-600 font-medium">
                        ✅ Horario disponible - Eres el primero en agendar
                      </div>
                    )}
                    {estadoHorario === 'individual' && (
                      <div className="text-red-600 font-medium">
                        ❌ Horario ocupado - Ya fue reservado como individual
                      </div>
                    )}
                    {estadoHorario === 'grupal' && (
                      <div className="text-blue-600 font-medium">
                        👥 Clase grupal - {alumnosInscritos}/5 alumnos inscritos
                      </div>
                    )}
                  </div>
                )}

                {/* Opciones de tipo */}
                <div className="space-y-3">
                  {/* Individual */}
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    tipoAgenda === 'individual' 
                      ? 'border-blue-500 bg-blue-50' 
                      : estadoHorario === 'individual' 
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="tipoAgenda"
                      value="individual"
                      checked={tipoAgenda === 'individual'}
                      onChange={(e) => setTipoAgenda(e.target.value)}
                      disabled={estadoHorario === 'individual'}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Clase Individual</div>
                      <div className="text-sm text-gray-600">
                        Clase privada de 1 hora - ${clase?.profesor?.precioHora?.toLocaleString() || '0'}/hora
                      </div>
                    </div>
                  </label>

                  {/* Grupal */}
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    tipoAgenda === 'grupal' 
                      ? 'border-blue-500 bg-blue-50' 
                      : estadoHorario === 'individual' 
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="tipoAgenda"
                      value="grupal"
                      checked={tipoAgenda === 'grupal'}
                      onChange={(e) => setTipoAgenda(e.target.value)}
                      disabled={estadoHorario === 'individual' || (estadoHorario === 'grupal' && alumnosInscritos >= 5)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Clase Grupal</div>
                      <div className="text-sm text-gray-600">
                        Clase compartida (máx 5 alumnos) - ${Math.round((clase?.profesor?.precioHora || 0) * 0.7).toLocaleString()}/hora
                      </div>
                      {estadoHorario === 'grupal' && (
                        <div className="text-xs text-blue-600 mt-1">
                          {alumnosInscritos} de 5 alumnos inscritos
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => navigate('/buscar')}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={reservar}
                disabled={reservando || !fechaSeleccionada || !horaSeleccionada || !tipoAgenda || estadoHorario === 'individual'}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reservando ? 'Reservando...' : (
                  tipoAgenda ? 
                    `Reservar Clase ${tipoAgenda === 'individual' ? 'Individual' : 'Grupal'} - $${tipoAgenda === 'individual' ? clase?.profesor?.precioHora?.toLocaleString() || '0' : Math.round((clase?.profesor?.precioHora || 0) * 0.7).toLocaleString()}` :
                    'Reservar Clase'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservarClase