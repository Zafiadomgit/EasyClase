import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Shield, Clock, DollarSign, Users, BookOpen, Check, ArrowRight } from 'lucide-react'

const SerProfesor = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    experiencia: '',
    tarifa: '',
    descripcion: '',
    disponibilidad: []
  })

  const especialidades = [
    'Programación',
    'Excel',
    'Inglés', 
    'Matemáticas',
    'Diseño Gráfico',
    'Marketing Digital',
    'Contabilidad',
    'Otro'
  ]

  const beneficios = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      titulo: 'Establece tu tarifa',
      descripcion: 'Tú decides cuánto cobrar por hora según tu experiencia'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      titulo: 'Horarios flexibles',
      descripcion: 'Enseña cuando quieras, donde quieras'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      titulo: 'Pagos seguros',
      descripcion: 'Recibe tu dinero de forma segura y puntual'
    },
    {
      icon: <Users className="w-8 h-8" />,
      titulo: 'Estudiantes verificados',
      descripcion: 'Todos los estudiantes pasan por verificación'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí implementarías el registro del profesor
    
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="ser-profesor-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8">
              <BookOpen className="w-4 h-4 mr-2" />
              Únete a nuestro equipo de profesores
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6 font-display leading-tight">
              Comparte tu conocimiento,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 block">
                gana dinero
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Enseña habilidades prácticas como <span className="font-semibold text-primary-600">Excel, programación o inglés</span> y genera ingresos con horarios flexibles
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="#registro"
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-lg px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto flex items-center justify-center space-x-3"
              >
                <span>Empezar Ahora</span>
                <ArrowRight className="w-6 h-6" />
              </a>
              <Link
                to="/buscar"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-lg px-10 py-4 rounded-2xl font-bold transition-all duration-300 w-full sm:w-auto"
              >
                Ver Profesores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              ¿Por qué enseñar en EasyClase?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Únete a cientos de profesores que ya están generando ingresos enseñando lo que saben
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-white to-primary-50 p-6 rounded-3xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {beneficio.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">{beneficio.titulo}</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-12 font-display">
            Nuestros profesores están ganando
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">$25.000 - $80.000</div>
              <p className="text-secondary-600">Ganancia promedio por hora</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-secondary-600">Horas de clase por semana</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9★</div>
              <p className="text-secondary-600">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Registro */}
      <section id="registro" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              Regístrate como Profesor
            </h2>
            <p className="text-xl text-secondary-600">
              Completa tu perfil y empieza a recibir solicitudes de clases
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl border border-primary-100 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Especialidad *
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Selecciona una especialidad</option>
                    {especialidades.map((esp, index) => (
                      <option key={index} value={esp}>{esp}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">
                    Tarifa por hora (USD) *
                  </label>
                  <input
                    type="number"
                    name="tarifa"
                    value={formData.tarifa}
                    onChange={handleChange}
                    min="10"
                    max="200"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Años de experiencia *
                </label>
                <input
                  type="number"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Descripción de tu experiencia *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Cuéntanos sobre tu experiencia, certificaciones, logros, etc."
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Enviar Solicitud
                </button>
                <p className="text-sm text-secondary-600 mt-4">
                  Revisaremos tu solicitud en 24-48 horas
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-primary-100">
              En solo 4 pasos estarás enseñando y ganando dinero
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { paso: '1', titulo: 'Regístrate', descripcion: 'Completa tu perfil y experiencia' },
              { paso: '2', titulo: 'Verificación', descripcion: 'Validamos tu información' },
              { paso: '3', titulo: 'Recibe solicitudes', descripcion: 'Los estudiantes te contactan' },
              { paso: '4', titulo: 'Enseña y gana', descripcion: 'Dicta clases y recibe pagos' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{item.paso}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.titulo}</h3>
                <p className="text-primary-100">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SerProfesor
