import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Shield, 
  CheckCircle, 
  User, 
  MessageCircle,
  Star,
  DollarSign
} from 'lucide-react'

const ComoFunciona = () => {
  const pasoEstudiante = [
    {
      numero: '1',
      titulo: 'Explora categorías',
      descripcion: 'Busca y filtra profesores según tus necesidades',
      icono: <Search className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      numero: '2', 
      titulo: 'Reserva tu clase',
      descripcion: 'Elige fecha, hora y confirma tu reserva',
      icono: <Calendar className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      numero: '3',
      titulo: 'Pago seguro',
      descripcion: 'Tu dinero se mantiene protegido hasta confirmar la clase',
      icono: <Shield className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      numero: '4',
      titulo: 'Recibe tu clase',
      descripcion: 'Aprende con profesores verificados y confirma el servicio',
      icono: <BookOpen className="w-8 h-8" />,
      color: 'bg-orange-500'
    }
  ]

  const pasoProfesor = [
    {
      numero: '1',
      titulo: 'Regístrate y verifica',
      descripcion: 'Completa tu perfil y pasa por nuestro proceso de verificación',
      icono: <User className="w-8 h-8" />,
      color: 'bg-indigo-500'
    },
    {
      numero: '2',
      titulo: 'Acepta reservaciones',
      descripcion: 'Recibe solicitudes de estudiantes y acepta las que te convengan',
      icono: <MessageCircle className="w-8 h-8" />,
      color: 'bg-cyan-500'
    },
    {
      numero: '3',
      titulo: 'Imparte la clase',
      descripcion: 'Enseña tu especialidad y brinda una experiencia de calidad',
      icono: <BookOpen className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      numero: '4',
      titulo: 'Recibe tu pago',
      descripcion: 'Una vez confirmada la clase, recibe tu pago de forma segura',
      icono: <DollarSign className="w-8 h-8" />,
      color: 'bg-emerald-500'
    }
  ]

  const caracteristicas = [
    {
      titulo: 'Pago por hora',
      descripcion: 'Solo pagas las horas que necesitas, sin compromisos a largo plazo',
      icono: <DollarSign className="w-6 h-6" />
    },
    {
      titulo: 'Profesores verificados',
      descripcion: 'Todos nuestros profesores pasan por un proceso de verificación riguroso',
      icono: <CheckCircle className="w-6 h-6" />
    },
    {
      titulo: 'Dinero protegido',
      descripcion: 'Tu pago se libera solo cuando confirmas que recibiste la clase',
      icono: <Shield className="w-6 h-6" />
    },
    {
      titulo: 'Calidad garantizada',
      descripcion: 'Sistema de calificaciones y reseñas para asegurar la mejor experiencia',
      icono: <Star className="w-6 h-6" />
    }
  ]

  return (
    <div className="como-funciona-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 font-display">
            ¿Cómo funciona 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 block">
              EasyClase?
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Un proceso simple y seguro para conectar estudiantes con profesores expertos
          </p>
        </div>
      </section>

      {/* Para Estudiantes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
              Para Estudiantes
            </h2>
            <p className="text-lg text-secondary-600">
              Aprende habilidades prácticas de forma rápida y efectiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasoEstudiante.map((paso, index) => (
              <div key={index} className="text-center group">
                {/* Conexión */}
                {index < pasoEstudiante.length - 1 && (
                  <div className="hidden lg:block absolute w-full h-0.5 bg-primary-200 top-20 left-1/2 transform -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative">
                  {/* Ícono */}
                  <div className={`w-20 h-20 ${paso.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {paso.icono}
                  </div>
                  
                  {/* Número */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                    {paso.numero}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-secondary-900 mb-3">{paso.titulo}</h3>
                <p className="text-secondary-600">{paso.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/buscar"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Comenzar a Aprender
            </Link>
          </div>
        </div>
      </section>

      {/* Para Profesores */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
              Para Profesores
            </h2>
            <p className="text-lg text-secondary-600">
              Comparte tu conocimiento y genera ingresos con horarios flexibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasoProfesor.map((paso, index) => (
              <div key={index} className="text-center group">
                {/* Conexión */}
                {index < pasoProfesor.length - 1 && (
                  <div className="hidden lg:block absolute w-full h-0.5 bg-primary-200 top-20 left-1/2 transform -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative">
                  {/* Ícono */}
                  <div className={`w-20 h-20 ${paso.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {paso.icono}
                  </div>
                  
                  {/* Número */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                    {paso.numero}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-secondary-900 mb-3">{paso.titulo}</h3>
                <p className="text-secondary-600">{paso.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/ser-profesor"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Comenzar a Enseñar
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
              ¿Qué nos hace diferentes?
            </h2>
            <p className="text-lg text-secondary-600">
              Características que garantizan una experiencia segura y efectiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caracteristicas.map((caracteristica, index) => (
              <div key={index} className="text-center group bg-gradient-to-br from-white to-primary-50 p-6 rounded-2xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {caracteristica.icono}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">{caracteristica.titulo}</h3>
                <p className="text-secondary-600 text-sm">{caracteristica.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Final */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a nuestra comunidad de aprendizaje y enseñanza
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Registrarse como Estudiante
            </Link>
            <Link
              to="/ser-profesor"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-xl transition-all duration-300"
            >
              Registrarse como Profesor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ComoFunciona
