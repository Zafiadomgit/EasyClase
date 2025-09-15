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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
      </div>
      
      <div className="relative z-10">
        {/* Hero */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              ¿Cómo funciona 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 block">
                EasyClase?
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Un proceso simple y seguro para conectar estudiantes con profesores expertos
            </p>
          </div>
        </section>

        {/* Para Estudiantes */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Para Estudiantes
              </h2>
              <p className="text-xl text-purple-200 leading-relaxed">
                Aprende habilidades prácticas de forma rápida y efectiva
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasoEstudiante.map((paso, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  {/* Ícono */}
                  <div className={`w-20 h-20 ${paso.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {paso.icono}
                  </div>
                  
                  {/* Número con marco */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-bold z-20 backdrop-blur-sm border border-white/30">
                    {paso.numero}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{paso.titulo}</h3>
                <p className="text-purple-200">{paso.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/buscar"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Comenzar a Aprender
            </Link>
          </div>
        </div>
      </section>

        {/* Para Profesores */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Para Profesores
              </h2>
              <p className="text-xl text-purple-200 leading-relaxed">
                Comparte tu conocimiento y genera ingresos con horarios flexibles
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pasoProfesor.map((paso, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  {/* Ícono */}
                  <div className={`w-20 h-20 ${paso.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {paso.icono}
                  </div>
                  
                  {/* Número con marco */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-bold z-20 backdrop-blur-sm border border-white/30">
                    {paso.numero}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{paso.titulo}</h3>
                <p className="text-purple-200">{paso.descripcion}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/ser-profesor"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Comenzar a Enseñar
            </Link>
          </div>
        </div>
      </section>

        {/* Características */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                ¿Qué nos hace diferentes?
              </h2>
              <p className="text-xl text-purple-200 leading-relaxed">
                Características que garantizan una experiencia segura y efectiva
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caracteristicas.map((caracteristica, index) => (
              <div key={index} className="text-center group bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {caracteristica.icono}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{caracteristica.titulo}</h3>
                <p className="text-purple-200 text-sm">{caracteristica.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



        {/* CTA Final */}
        <section className="py-20 mb-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-purple-200 mb-8 leading-relaxed">
              Únete a nuestra comunidad de aprendizaje y enseñanza
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/registro"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Registrarse como Estudiante
              </Link>
              <Link
                to="/ser-profesor"
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Registrarse como Profesor
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ComoFunciona
