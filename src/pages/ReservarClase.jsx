import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

const ReservarClase = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const servicioId = searchParams.get('servicio')
  
  const [clase, setClase] = useState(null)
  const [servicio, setServicio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horaSeleccionada, setHoraSeleccionada] = useState('')
  const [tipoAgenda, setTipoAgenda] = useState('') // 'individual' o 'grupal'
  const [cantidadHoras, setCantidadHoras] = useState(1) // Cantidad de horas que quiere comprar
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
  const [disponibilidadMultiple, setDisponibilidadMultiple] = useState(null) // Para verificar múltiples horas
  const [maxHorasDisponibles, setMaxHorasDisponibles] = useState(4)

  useEffect(() => {
    cargarInformacionClase()
    if (servicioId) {
      cargarInformacionServicio()
    }
  }, [id, servicioId])

  // Verificar estado del horario cuando se selecciona
  useEffect(() => {
    if (fechaSeleccionada && horaSeleccionada) {
      verificarEstadoHorario()
      verificarDisponibilidadMultiple()
    }
  }, [fechaSeleccionada, horaSeleccionada])

  const cargarInformacionClase = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clases/reservar.php?id=${id}`)
      const data = await response.json()
      
      if (data.success) {
        setClase(data.data.clase)
        console.log('Datos de clase cargados:', data.data.clase)
        console.log('Nombre del profesor:', data.data.clase.profesor.nombre)
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

  const cargarInformacionServicio = async () => {
    try {
      const response = await fetch(`/api/servicios/detalle.php?id=${servicioId}`)
      const data = await response.json()
      
      if (data.success) {
        setServicio(data.data.servicio)
        // Si el servicio permite ambos tipos, no establecer uno por defecto
        if (data.data.servicio.tipo && data.data.servicio.tipo !== 'ambos') {
          setTipoAgenda(data.data.servicio.tipo)
        }
      }
    } catch (error) {
      console.error('Error al cargar servicio:', error)
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

  const verificarDisponibilidadMultiple = async () => {
    try {
      const response = await fetch(`/api/clases/verificar-disponibilidad-multiple.php?profesorId=${clase?.profesor?.id}&fecha=${fechaSeleccionada}&horaInicio=${horaSeleccionada}&cantidadHoras=4`)
      const data = await response.json()
      
      if (data.success) {
        setDisponibilidadMultiple(data.data)
        setMaxHorasDisponibles(data.data.maxHorasDisponibles)
        
        // Si la cantidad de horas seleccionada es mayor a la disponible, ajustarla
        if (cantidadHoras > data.data.maxHorasDisponibles) {
          setCantidadHoras(data.data.maxHorasDisponibles)
        }
      } else {
        setDisponibilidadMultiple(null)
        setMaxHorasDisponibles(4)
      }
    } catch (error) {
      console.error('Error verificando disponibilidad múltiple:', error)
      setDisponibilidadMultiple(null)
      setMaxHorasDisponibles(4)
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
        let precioPorHora = 0
        if (servicio) {
          // Usar precios del servicio según el tipo seleccionado
          if (tipoAgenda === 'individual') {
            precioPorHora = servicio.precioIndividual || servicio.precio || 10
          } else if (tipoAgenda === 'grupal') {
            precioPorHora = servicio.precioGrupal || servicio.precio || 10
          }
        } else {
          // Fallback para clases sin servicio específico
          precioPorHora = tipoAgenda === 'individual' ? clase?.profesor?.precioHora : Math.round((clase?.profesor?.precioHora || 10) * 0.7)
        }
        
        // Asegurar precio mínimo de $10 COP para pruebas
        precioPorHora = Math.max(precioPorHora, 10)
        
        const duracionHoras = cantidadHoras // Usar la cantidad de horas seleccionada por el estudiante
        const precioTotal = precioPorHora * duracionHoras
        
        const reservaData = {
          profesorId: id,
          servicioId: servicioId,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          tipoAgenda: tipoAgenda,
          duracionHoras: duracionHoras,
          precioPorHora: precioPorHora,
          precio: precioTotal,
          profesorNombre: clase?.profesor?.nombre || 'Profesor Especializado',
          servicioTitulo: servicio?.titulo || 'Clase General',
          servicioCategoria: servicio?.categoria || 'General'
        }
        
        // Guardar datos de reserva en localStorage para el pago
        console.log('Guardando reserva en localStorage:', reservaData)
        localStorage.setItem('reservaPendiente', JSON.stringify(reservaData))
        console.log('Reserva guardada, verificando:', localStorage.getItem('reservaPendiente'))
        
        // También guardar en localStorage del estudiante para "Mis Clases"
        const claseEstudiante = {
          id: `clase_estudiante_${Date.now()}`,
          titulo: servicio?.titulo || 'Clase General',
          profesor: {
            nombre: clase?.profesor?.nombre || 'Profesor Especializado',
            email: clase?.profesor?.email || 'profesor@easyclase.com'
          },
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          duracion: duracionHoras,
          tipo: tipoAgenda,
          precio: precioTotal,
          estado: 'pendiente_aprobacion',
          fechaReserva: new Date().toISOString(),
          linkLlamada: null // Se asignará cuando el profesor acepte
        }
        
        const clasesExistentes = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
        clasesExistentes.push(claseEstudiante)
        localStorage.setItem('misClasesEstudiante', JSON.stringify(clasesExistentes))
        
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header elegante */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Reservar Clase
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Selecciona la fecha y hora para tu clase con {clase.profesor.nombre}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Sidebar elegante - Información del profesor */}
            <div className="xl:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sticky top-8 shadow-2xl">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Información del Profesor</h3>
                    <p className="text-purple-200">Detalles de tu instructor</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-purple-200 font-medium">Nombre</span>
                    <span className="text-white font-semibold">{clase.profesor.nombre}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-purple-200 font-medium">Calificación</span>
                    <span className="text-white font-semibold">⭐ {clase.profesor.calificacionPromedio}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-purple-200 font-medium">Reseñas</span>
                    <span className="text-white font-semibold">{clase.profesor.totalResenas}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-purple-200 font-medium">Precio/hora</span>
                    <span className="text-white font-semibold">${clase.profesor.precioHora.toLocaleString()}</span>
                  </div>
                  
                  {clase.profesor.esPremium && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-yellow-200 font-semibold">Profesor Premium</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-3">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {clase.profesor.especialidades.map((especialidad, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/20 text-purple-200 text-xs font-medium px-3 py-1 rounded-full border border-purple-400/30"
                        >
                          {especialidad}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido principal - Formulario */}
            <div className="xl:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">

                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        Fecha de la clase
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={fechaSeleccionada}
                          onChange={(e) => setFechaSeleccionada(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        Hora de la clase
                      </label>
                      <div className="relative">
                        <select
                          value={horaSeleccionada}
                          onChange={(e) => setHoraSeleccionada(e.target.value)}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none"
                          required
                        >
                          <option value="" className="text-gray-800">Selecciona una hora</option>
                          {opcionesHora.map(opcion => (
                            <option key={opcion.value} value={opcion.value} className="text-gray-800">
                              {opcion.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selector de tipo de agenda */}
                  {fechaSeleccionada && horaSeleccionada && (
                    <div className="space-y-6">
                      <label className="block text-lg font-semibold text-white mb-4">
                        Tipo de Clase
                      </label>
                      
                      {/* Estado del horario */}
                      {estadoHorario && (
                        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                          {estadoHorario === 'disponible' && (
                            <div className="text-green-300 font-medium flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Horario disponible - Eres el primero en agendar
                            </div>
                          )}
                          {estadoHorario === 'individual' && (
                            <div className="text-red-300 font-medium flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Horario ocupado - Ya fue reservado como individual
                            </div>
                          )}
                          {estadoHorario === 'grupal' && (
                            <div className="text-blue-300 font-medium flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-5.523-4.477-10-10-10S-3 12.477-3 18v2m20 0H7" />
                              </svg>
                              Clase grupal - {alumnosInscritos}/5 alumnos inscritos
                            </div>
                          )}
                        </div>
                      )}

                      {/* Opciones de tipo */}
                      <div className="space-y-4">
                        {/* Individual */}
                        <label className={`flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                          tipoAgenda === 'individual' 
                            ? 'border-purple-500 bg-purple-500/20 shadow-lg' 
                            : estadoHorario === 'individual' 
                              ? 'border-white/20 bg-white/5 cursor-not-allowed opacity-50'
                              : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
                        }`}>
                          <input
                            type="radio"
                            name="tipoAgenda"
                            value="individual"
                            checked={tipoAgenda === 'individual'}
                            onChange={(e) => setTipoAgenda(e.target.value)}
                            disabled={estadoHorario === 'individual'}
                            className="mr-4 w-5 h-5 text-purple-600"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-white text-lg">Clase Individual</div>
                            <div className="text-purple-200 mt-1">
                              Clase privada de 1 hora - ${clase?.profesor?.precioHora?.toLocaleString() || '0'}/hora
                            </div>
                          </div>
                        </label>

                        {/* Grupal */}
                        <label className={`flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                          tipoAgenda === 'grupal' 
                            ? 'border-purple-500 bg-purple-500/20 shadow-lg' 
                            : estadoHorario === 'individual' 
                              ? 'border-white/20 bg-white/5 cursor-not-allowed opacity-50'
                              : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10'
                        }`}>
                          <input
                            type="radio"
                            name="tipoAgenda"
                            value="grupal"
                            checked={tipoAgenda === 'grupal'}
                            onChange={(e) => setTipoAgenda(e.target.value)}
                            disabled={estadoHorario === 'individual' || (estadoHorario === 'grupal' && alumnosInscritos >= 5)}
                            className="mr-4 w-5 h-5 text-purple-600"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-white text-lg">Clase Grupal</div>
                            <div className="text-purple-200 mt-1">
                              Clase compartida (máx 5 alumnos) - ${Math.round((clase?.profesor?.precioHora || 0) * 0.7).toLocaleString()}/hora
                            </div>
                            {estadoHorario === 'grupal' && (
                              <div className="text-blue-300 text-sm mt-2">
                                {alumnosInscritos} de 5 alumnos inscritos
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Selector de cantidad de horas */}
                  {tipoAgenda && (
                    <div className="space-y-6">
                      <label className="block text-lg font-semibold text-white mb-4">
                        Cantidad de Horas
                      </label>
                      
                      {/* Mostrar información de disponibilidad */}
                      {disponibilidadMultiple && (
                        <div className="bg-blue-500/20 rounded-2xl p-4 border border-blue-400/30">
                          <div className="text-sm text-blue-200">
                            <strong>Disponibilidad:</strong> Puedes reservar hasta {maxHorasDisponibles} hora{maxHorasDisponibles > 1 ? 's' : ''} consecutiva{maxHorasDisponibles > 1 ? 's' : ''}
                          </div>
                          {disponibilidadMultiple.horariosDisponibles && (
                            <div className="mt-2 text-xs text-blue-300">
                              {disponibilidadMultiple.horariosDisponibles.map((horario, index) => (
                                <span key={index} className={`mr-2 ${horario.disponible ? 'text-green-300' : 'text-red-300'}`}>
                                  {horario.hora} {horario.disponible ? '✅' : '❌'}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(horas => {
                          const disponible = horas <= maxHorasDisponibles
                          return (
                            <button
                              key={horas}
                              type="button"
                              onClick={() => disponible && setCantidadHoras(horas)}
                              disabled={!disponible}
                              className={`p-4 border rounded-2xl text-center transition-all duration-300 ${
                                !disponible
                                  ? 'border-white/20 bg-white/5 text-gray-400 cursor-not-allowed opacity-50'
                                  : cantidadHoras === horas
                                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-lg'
                                    : 'border-white/20 bg-white/5 text-white hover:border-purple-400/50 hover:bg-purple-500/10'
                              }`}
                            >
                              <div className="font-bold text-lg">
                                {horas} hora{horas > 1 ? 's' : ''}
                                {!disponible && ' ❌'}
                              </div>
                              <div className="text-sm text-purple-200 mt-1">
                                {disponible ? (
                                  servicio ? (
                                    tipoAgenda === 'individual' 
                                      ? `$${((servicio.precioIndividual || servicio.precio || 0) * horas).toLocaleString()}`
                                      : `$${((servicio.precioGrupal || servicio.precio || 0) * horas).toLocaleString()}`
                                  ) : (
                                    tipoAgenda === 'individual'
                                      ? `$${((clase?.profesor?.precioHora || 0) * horas).toLocaleString()}`
                                      : `$${(Math.round((clase?.profesor?.precioHora || 0) * 0.7) * horas).toLocaleString()}`
                                  )
                                ) : (
                                  'No disponible'
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-sm text-purple-200 mt-2">
                        💡 Solo se muestran las horas consecutivas disponibles
                      </p>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex space-x-6 pt-8">
                    <button
                      onClick={() => navigate('/buscar')}
                      className="flex-1 bg-white/10 text-white px-8 py-4 rounded-2xl hover:bg-white/20 font-semibold transition-all duration-300 border border-white/20"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={reservar}
                      disabled={reservando || !fechaSeleccionada || !horaSeleccionada || !tipoAgenda || !cantidadHoras || estadoHorario === 'individual' || cantidadHoras > maxHorasDisponibles}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {reservando ? 'Reservando...' : (
                        tipoAgenda && cantidadHoras ? 
                          (() => {
                            let precioTotal = 0
                            if (servicio) {
                              const precioPorHora = tipoAgenda === 'individual' 
                                ? (servicio.precioIndividual || servicio.precio || 0)
                                : (servicio.precioGrupal || servicio.precio || 0)
                              precioTotal = precioPorHora * cantidadHoras
                            } else {
                              const precioPorHora = tipoAgenda === 'individual' 
                                ? (clase?.profesor?.precioHora || 0)
                                : Math.round((clase?.profesor?.precioHora || 0) * 0.7)
                              precioTotal = precioPorHora * cantidadHoras
                            }
                            return `Reservar ${cantidadHoras} hora${cantidadHoras > 1 ? 's' : ''} ${tipoAgenda === 'individual' ? 'Individual' : 'Grupal'} - $${precioTotal.toLocaleString()}`
                          })() :
                          'Reservar Clase'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservarClase