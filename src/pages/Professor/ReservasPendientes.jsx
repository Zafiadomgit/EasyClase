import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react'

const ReservasPendientes = () => {
  const { user } = useAuth()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(null)

  useEffect(() => {
    cargarReservasPendientes()
  }, [])

  const cargarReservasPendientes = async () => {
    try {
      setLoading(true)
      // Simular datos de reservas pendientes
      const reservasSimuladas = [
        {
          id: 1,
          estudiante: {
            nombre: 'Ana García',
            email: 'ana@email.com',
            telefono: '3001234567'
          },
          servicio: {
            titulo: 'Curso de Excel Avanzado',
            categoria: 'Excel',
            duracion: 2,
            precio: 50000
          },
          fecha: '2024-01-20',
          hora: '14:00',
          tipo: 'individual',
          total: 100000,
          estado: 'pendiente',
          fechaSolicitud: '2024-01-18T10:30:00Z'
        },
        {
          id: 2,
          estudiante: {
            nombre: 'Carlos López',
            email: 'carlos@email.com',
            telefono: '3007654321'
          },
          servicio: {
            titulo: 'Programación en React',
            categoria: 'Programación',
            duracion: 1.5,
            precio: 60000
          },
          fecha: '2024-01-22',
          hora: '16:30',
          tipo: 'grupal',
          total: 90000,
          estado: 'pendiente',
          fechaSolicitud: '2024-01-19T15:45:00Z'
        }
      ]
      
      setReservas(reservasSimuladas)
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      setError('Error al cargar las reservas pendientes')
    } finally {
      setLoading(false)
    }
  }

  const aceptarReserva = async (reservaId) => {
    try {
      setProcesando(reservaId)
      
      // Simular aceptación de reserva
      const reserva = reservas.find(r => r.id === reservaId)
      if (!reserva) return
      
      // Crear clase en "Mis Clases"
      const nuevaClase = {
        id: `clase_${reservaId}_${Date.now()}`,
        titulo: reserva.servicio.titulo,
        estudiante: reserva.estudiante,
        fecha: reserva.fecha,
        hora: reserva.hora,
        duracion: reserva.servicio.duracion,
        tipo: reserva.tipo,
        precio: reserva.total,
        estado: 'programada',
        fechaCreacion: new Date().toISOString()
      }
      
      // Guardar en localStorage para "Mis Clases"
      const clasesExistentes = JSON.parse(localStorage.getItem('misClases') || '[]')
      clasesExistentes.push(nuevaClase)
      localStorage.setItem('misClases', JSON.stringify(clasesExistentes))
      
      // También actualizar la clase del estudiante con el mismo ID
      const clasesEstudiante = JSON.parse(localStorage.getItem('misClasesEstudiante') || '[]')
      const claseEstudianteActualizada = clasesEstudiante.find(c => c.id === `clase_estudiante_${reservaId}`)
      if (claseEstudianteActualizada) {
        claseEstudianteActualizada.id = nuevaClase.id
        claseEstudianteActualizada.estado = 'programada'
        localStorage.setItem('misClasesEstudiante', JSON.stringify(clasesEstudiante))
      }
      
      // Actualizar estado de reserva
      setReservas(prev => prev.map(reserva => 
        reserva.id === reservaId 
          ? { ...reserva, estado: 'aceptada' }
          : reserva
      ))
      
      // Notificar al estudiante (simulado)
      console.log(`Reserva ${reservaId} aceptada y clase creada`)
      alert('Reserva aceptada exitosamente. La clase ha sido agregada a "Mis Clases"')
      
    } catch (error) {
      console.error('Error al aceptar reserva:', error)
      alert('Error al aceptar la reserva')
    } finally {
      setProcesando(null)
    }
  }

  const rechazarReserva = async (reservaId) => {
    try {
      // Simular rechazo de reserva
      setReservas(prev => prev.map(reserva => 
        reserva.id === reservaId 
          ? { ...reserva, estado: 'rechazada' }
          : reserva
      ))
      
      // Aquí se enviaría la notificación al estudiante
      console.log(`Reserva ${reservaId} rechazada`)
    } catch (error) {
      console.error('Error al rechazar reserva:', error)
    }
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatHora = (hora) => {
    return hora
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando reservas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente')
  const reservasAceptadas = reservas.filter(r => r.estado === 'aceptada')
  const reservasRechazadas = reservas.filter(r => r.estado === 'rechazada')

  return (
    <div className="space-y-6">
      {/* Reservas Pendientes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-yellow-500" />
          Reservas Pendientes ({reservasPendientes.length})
        </h3>
        
        {reservasPendientes.length > 0 ? (
          <div className="space-y-4">
            {reservasPendientes.map((reserva) => (
              <div key={reserva.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{reserva.servicio.titulo}</h4>
                    <p className="text-sm text-gray-600">{reserva.servicio.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${reserva.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{reserva.servicio.duracion}h - {reserva.tipo}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{reserva.estudiante.nombre}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📧</span>
                      {reserva.estudiante.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📱</span>
                      {reserva.estudiante.telefono}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {formatFecha(reserva.fecha)}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {formatHora(reserva.hora)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Solicitado: {new Date(reserva.fechaSolicitud).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => aceptarReserva(reserva.id)}
                    disabled={procesando === reserva.id}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {procesando === reserva.id ? 'Procesando...' : 'Aceptar'}
                  </button>
                  <button
                    onClick={() => rechazarReserva(reserva.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tienes reservas pendientes</p>
          </div>
        )}
      </div>

      {/* Reservas Aceptadas */}
      {reservasAceptadas.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Reservas Aceptadas ({reservasAceptadas.length})
          </h3>
          
          <div className="space-y-3">
            {reservasAceptadas.map((reserva) => (
              <div key={reserva.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{reserva.servicio.titulo}</p>
                    <p className="text-sm text-gray-600">
                      {reserva.estudiante.nombre} - {formatFecha(reserva.fecha)} a las {formatHora(reserva.hora)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${reserva.total.toLocaleString()}</p>
                    <p className="text-xs text-green-600">✓ Aceptada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservas Rechazadas */}
      {reservasRechazadas.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            Reservas Rechazadas ({reservasRechazadas.length})
          </h3>
          
          <div className="space-y-3">
            {reservasRechazadas.map((reserva) => (
              <div key={reserva.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{reserva.servicio.titulo}</p>
                    <p className="text-sm text-gray-600">
                      {reserva.estudiante.nombre} - {formatFecha(reserva.fecha)} a las {formatHora(reserva.hora)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-500">${reserva.total.toLocaleString()}</p>
                    <p className="text-xs text-red-600">✗ Rechazada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservasPendientes
