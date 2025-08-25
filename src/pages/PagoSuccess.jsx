import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { formatPrecio } from '../utils/currencyUtils'
import { useAuth } from '../contexts/AuthContext'
import claseServiceLocal from '../services/claseService'

const PagoSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pagoData, setPagoData] = useState(null)
  const [claseGuardada, setClaseGuardada] = useState(false)

  useEffect(() => {
    console.log('🎯 PagoSuccess.jsx cargado')
    console.log('📍 URL actual:', location.search)
    
    // Obtener datos de la URL de MercadoPago
    const urlParams = new URLSearchParams(location.search)
    const paymentId = urlParams.get('payment_id')
    const status = urlParams.get('status')
    const externalReference = urlParams.get('external_reference')

    console.log('📊 Parámetros de URL:')
    console.log('  - payment_id:', paymentId)
    console.log('  - status:', status)
    console.log('  - external_reference:', externalReference)

    if (status === 'approved' && paymentId) {
      // Obtener datos de la reserva desde localStorage o sessionStorage
      console.log('🔍 Buscando datos de reserva en localStorage...')
      const reservaDataRaw = localStorage.getItem('reserva_pendiente')
      console.log('📦 Datos raw de reserva:', reservaDataRaw)
      
      const reservaData = JSON.parse(reservaDataRaw || sessionStorage.getItem('reserva_pendiente') || '{}')
      console.log('✅ Datos de reserva parseados:', reservaData)
      
      // Si no hay datos de reserva, usar datos por defecto
      if (!reservaData.profesor) {
        const reservaDataDefault = {
          profesor: { nombre: 'María González' },
          fecha: new Date().toISOString(),
          hora: '15:00',
          duracion: 1,
          costo: 35000
        }
        setPagoData({
          paymentId,
          status,
          externalReference,
          reserva: reservaDataDefault
        })
        guardarClase(reservaDataDefault)
      } else {
        setPagoData({
          paymentId,
          status,
          externalReference,
          reserva: reservaData
        })
        guardarClase(reservaData)
      }
    } else {
      // Si no hay datos válidos, redirigir
      navigate('/dashboard')
    }
  }, [location, navigate])

  const guardarClase = async (reservaData) => {
    try {
      // Usar un userId consistente
      const userId = user?.id || localStorage.getItem('easyclase_user_id') || 'user_' + Date.now()
      
      // Guardar el userId en localStorage para consistencia
      if (!localStorage.getItem('easyclase_user_id')) {
        localStorage.setItem('easyclase_user_id', userId)
      }
      
      // Crear datos de la clase
      const claseData = {
        userId: userId,
        tema: reservaData.tema || 'Clase de Programación',
        profesorNombre: reservaData.profesor.nombre,
        profesorEspecialidad: reservaData.profesor.especialidad || 'Desarrollo Web',
        fecha: reservaData.fecha.split('T')[0], // Solo la fecha
        hora: reservaData.hora,
        duracion: reservaData.duracion,
        total: reservaData.costo,
        metodoPago: 'MercadoPago',
        notas: 'Clase reservada exitosamente'
      }
      
      console.log('🔍 Guardando clase con datos:', claseData)
      
      // Guardar usando el servicio local
      const claseGuardada = await claseServiceLocal.guardarClase(claseData)
      console.log('✅ Clase guardada exitosamente:', claseGuardada)
      
      // Limpiar datos de reserva pendiente
      localStorage.removeItem('reserva_pendiente')
      console.log('🧹 Datos de reserva pendiente limpiados')
      
      setClaseGuardada(true)
    } catch (error) {
      console.error('Error guardando clase:', error)
    }
  }

  if (!pagoData) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">¡Pago Exitoso!</h1>
          <p className="text-secondary-600">Tu clase ha sido reservada exitosamente</p>
        </div>

        {/* Detalles del pago */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Detalles del pago</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">ID de pago:</span>
              <span className="font-semibold text-secondary-900">{pagoData.paymentId}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Estado:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aprobado
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Monto:</span>
              <span className="font-semibold text-secondary-900">
                {formatPrecio(pagoData.reserva.costo)}
              </span>
            </div>
          </div>
        </div>

        {/* Detalles de la clase */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Detalles de tu clase</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="w-5 h-5 text-primary-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold text-secondary-900">{pagoData.reserva.profesor.nombre}</p>
                <p className="text-secondary-600">Profesor</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold text-secondary-900">
                  {new Date(pagoData.reserva.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-secondary-600">Fecha de la clase</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-primary-600 mr-3 mt-1" />
              <div>
                <p className="font-semibold text-secondary-900">
                  {pagoData.reserva.hora} - {pagoData.reserva.duracion} hora(s)
                </p>
                <p className="text-secondary-600">Horario</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">Información importante</h3>
          
          <div className="space-y-2 text-sm text-green-700">
            <p>✅ Recibirás un email con los detalles de la clase</p>
            <p>✅ El profesor te contactará para confirmar la clase</p>
            <p>✅ Tu dinero se mantendrá seguro hasta que confirmes que recibiste la clase</p>
            <p>✅ Puedes cancelar hasta 24 horas antes sin penalización</p>
            {claseGuardada && (
              <p className="font-semibold text-green-800">✅ Clase guardada en tu dashboard</p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Ir a mi Dashboard
          </button>
          
          <button
            onClick={() => navigate('/buscar')}
            className="flex-1 border-2 border-primary-600 text-primary-600 font-semibold py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Reservar otra clase
          </button>
        </div>

        {/* Volver */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default PagoSuccess
