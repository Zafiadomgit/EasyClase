import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Award,
  Users,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Percent
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { claseService } from '../services/api.js'

const PerfilProfesor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('resumen')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(1)
  const [descuentoInfo, setDescuentoInfo] = useState(null)
  const [loadingDescuento, setLoadingDescuento] = useState(false)

  // Datos del profesor (normalmente vendrían de una API)
  const profesor = {
    id: 1,
    nombre: 'Carlos Mendoza',
    especialidad: 'Programación Python',
    titulo: 'Ingeniero de Software',
    experiencia: '8 años',
    rating: 4.9,
    reviewsCount: 127,
    precio: 25000,
    modalidad: 'Online',
    ubicacion: 'Bogotá, Colombia',
    foto: '/api/placeholder/200/200',
    descripcion: 'Soy un ingeniero de software con más de 8 años de experiencia desarrollando aplicaciones web con Python y Django. Me especializo en enseñar programación de forma práctica y divertida, adaptándome al nivel de cada estudiante.',
    certificaciones: [
      'Certificación Python Professional',
      'AWS Solutions Architect',
      'Google Cloud Professional'
    ],
    habilidades: ['Python', 'Django', 'Flask', 'SQL', 'Git', 'AWS', 'Docker'],
    disponibilidad: 'Lunes a Viernes 8:00 AM - 6:00 PM',
    clasesCompletadas: 342,
    estudiantesActivos: 89,
    responseTime: '< 2 horas'
  }

  const resenas = [
    {
      estudiante: 'María García',
      rating: 5,
      fecha: '2024-01-15',
      comentario: 'Excelente profesor! Me ayudó a entender conceptos complejos de Python de manera muy clara.'
    },
    {
      estudiante: 'Juan Pérez',
      rating: 5,
      fecha: '2024-01-10',
      comentario: 'Muy paciente y didáctico. Las clases están muy bien estructuradas.'
    },
    {
      estudiante: 'Ana Rodríguez',
      rating: 4,
      fecha: '2024-01-08',
      comentario: 'Buen profesor, aunque a veces va un poco rápido. Pero siempre está dispuesto a repetir.'
    }
  ]

  const horariosDisponibles = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  // Cargar información de descuentos
  useEffect(() => {
    const cargarDescuentoInfo = async () => {
      if (!user) return;
      
      setLoadingDescuento(true);
      try {
        const response = await claseService.obtenerInfoDescuentos(profesor.especialidad, profesor.id);
        setDescuentoInfo(response.data);
      } catch (error) {
        console.error('Error cargando información de descuentos:', error);
      } finally {
        setLoadingDescuento(false);
      }
    };

    cargarDescuentoInfo();
  }, [user, profesor.especialidad, profesor.id]);

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const handleReservarClase = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora')
      return
    }
    
    // Calcular total con descuento si aplica
    const subtotal = profesor.precio * duration
    let total = subtotal
    
    if (descuentoInfo && descuentoInfo.puedeAplicar) {
      total = descuentoInfo.total
    }
    
    const data = {
      profesorId: profesor.id,
      fecha: selectedDate,
      hora: selectedTime,
      duracion: duration,
      total: total,
      costo: subtotal, // Precio sin descuento
      categoria: profesor.especialidad, // Usar la especialidad como categoría
      descuento: descuentoInfo && descuentoInfo.puedeAplicar ? {
        aplicado: true,
        porcentaje: descuentoInfo.porcentajeDescuento,
        montoDescuento: descuentoInfo.montoDescuento,
        asumidoPor: descuentoInfo.asumidoPor
      } : null
    }
    
    console.log('Reservando clase:', data)
    navigate('/pago', { state: { reserva: data, profesor } })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del perfil */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Foto y info básica */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-secondary-200 rounded-2xl overflow-hidden mx-auto lg:mx-0">
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                {profesor.nombre.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-1">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2 font-display">
                {profesor.nombre}
              </h1>
              <p className="text-xl text-primary-600 font-medium mb-2">
                {profesor.especialidad}
              </p>
              <p className="text-secondary-600 mb-4">
                {profesor.titulo} • {profesor.experiencia} de experiencia
              </p>

              {/* Rating y stats */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold text-secondary-900">{profesor.rating}</span>
                  <span className="text-secondary-600 ml-1">({profesor.reviewsCount} reseñas)</span>
                </div>
                <div className="flex items-center text-secondary-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profesor.ubicacion}
                </div>
                <div className="flex items-center text-secondary-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {profesor.modalidad}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{profesor.clasesCompletadas}</p>
                  <p className="text-sm text-secondary-600">Clases completadas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{profesor.estudiantesActivos}</p>
                  <p className="text-sm text-secondary-600">Estudiantes activos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">{profesor.responseTime}</p>
                  <p className="text-sm text-secondary-600">Tiempo de respuesta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de reserva */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="border border-secondary-200 rounded-xl p-6 bg-secondary-50">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-secondary-900">
                  {formatPrecio(profesor.precio)}
                  <span className="text-lg font-normal text-secondary-600">/hora</span>
                </div>
                
                {/* Información de descuento */}
                {descuentoInfo && descuentoInfo.puedeAplicar && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center text-green-700 mb-1">
                      <Percent className="w-4 h-4 mr-1" />
                      <span className="text-sm font-semibold">
                        ¡{descuentoInfo.porcentajeDescuento}% de descuento disponible!
                      </span>
                    </div>
                    <p className="text-xs text-green-600 text-center">
                      {descuentoInfo.tienePremium 
                        ? 'Descuento asumido por la plataforma' 
                        : 'Descuento asumido por el profesor'}
                    </p>
                  </div>
                )}
                
                {descuentoInfo && !descuentoInfo.puedeAplicar && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      Ya has usado tu descuento en esta categoría
                    </p>
                  </div>
                )}
              </div>

              {/* Selector de fecha */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Selector de hora */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Hora
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {horariosDisponibles.map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setSelectedTime(hora)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === hora
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-secondary-300 text-secondary-700 hover:border-primary-300'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duración */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Duración (horas)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="input-field"
                >
                  <option value={1}>1 hora</option>
                  <option value={2}>2 horas</option>
                  <option value={3}>3 horas</option>
                  <option value={4}>4 horas</option>
                </select>
              </div>

              {/* Total */}
              <div className="mb-6 p-3 bg-white rounded-lg border border-secondary-200">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-700">Total:</span>
                  <span className="text-xl font-bold text-secondary-900">
                    {formatPrecio(profesor.precio * duration)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReservarClase}
                className="w-full btn-primary py-3 text-lg font-medium"
              >
                Reservar Clase
              </button>

              <button className="w-full btn-outline mt-3">
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8">
            {[
              { id: 'resumen', label: 'Resumen' },
              { id: 'resenas', label: 'Reseñas' },
              { id: 'experiencia', label: 'Experiencia' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {selectedTab === 'resumen' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Acerca de mí</h3>
                <p className="text-secondary-700 leading-relaxed">
                  {profesor.descripcion}
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profesor.habilidades.map((habilidad, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {habilidad}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Disponibilidad</h3>
                <p className="text-secondary-700">{profesor.disponibilidad}</p>
              </div>
            </div>
          )}

          {selectedTab === 'resenas' && (
            <div className="space-y-4">
              {resenas.map((resena, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-secondary-900">{resena.estudiante}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < resena.rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-secondary-500">{resena.fecha}</span>
                  </div>
                  <p className="text-secondary-700">{resena.comentario}</p>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'experiencia' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Certificaciones</h3>
                <ul className="space-y-2">
                  {profesor.certificaciones.map((cert, index) => (
                    <li key={index} className="flex items-center">
                      <Award className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-secondary-700">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar con info adicional */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Datos Verificados</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-secondary-700">Identidad verificada</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-secondary-700">Email verificado</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-secondary-700">Teléfono verificado</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Políticas</h3>
            <div className="space-y-3 text-sm text-secondary-700">
              <p><strong>Cancelación:</strong> Hasta 2 horas antes sin penalización</p>
              <p><strong>Reprogramación:</strong> Permitida con 4 horas de anticipación</p>
              <p><strong>Reembolso:</strong> 100% si no estás satisfecho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilProfesor