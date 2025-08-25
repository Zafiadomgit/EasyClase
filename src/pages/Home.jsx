import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Star, Shield, Clock, Users, BookOpen, Code, Calculator, Globe, MapPin, Filter, ChevronDown, ChevronUp, Briefcase, Zap, Target, Eye, TrendingUp, Crown, Percent, CheckCircle } from 'lucide-react'
import CategoriesModal from '../components/Modal/CategoriesModal'
import SimpleTestimonials from '../components/Testimonials/SimpleTestimonials'
import { useScrollReveal, useScrollRevealStagger } from '../hooks/useScrollReveal'
import { 
  PayPerHourIcon, 
  VerifiedTeacherIcon, 
  FastLearningIcon, 
  SecurityIcon, 
  FlexibilityIcon,
  SupportIcon 
} from '../components/Icons/CustomIcons'

// Componente de barra de búsqueda
const SearchBar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const categorias = [
    'Programación',
    'Excel',
    'Inglés',
    'Matemáticas',
    'Diseño Gráfico',
    'Marketing Digital',
    'Contabilidad',
    'Finanzas',
    'Análisis de Datos'
  ]

  const ubicaciones = [
    'Online',
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Construir la URL con parámetros de búsqueda
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('categoria', selectedCategory)
    if (selectedLocation) params.set('ubicacion', selectedLocation)

    navigate(`/buscar?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-primary-100 dark:border-gray-600">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Campo de búsqueda principal */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué quieres aprender? (Excel, Python, Inglés...)"
            className="w-full pl-14 pr-6 py-4 text-lg border-2 border-secondary-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 placeholder-secondary-400 dark:placeholder-gray-400"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Categoría */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 bg-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          {/* Ubicación */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-secondary-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 bg-white"
            >
              <option value="">Cualquier ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion} value={ubicacion}>
                  {ubicacion}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de búsqueda */}
          <button
            type="submit"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// Componente FAQ Item
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-secondary-200 dark:border-gray-600 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-4 text-left bg-white dark:bg-gray-700 hover:bg-secondary-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between"
      >
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-secondary-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 bg-secondary-50 dark:bg-gray-700">
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  
  // Refs para scroll reveal
  const categoriesRef = useScrollReveal()
  const whyEasyClaseRef = useScrollReveal()
  const servicesRef = useScrollReveal()
  const statsRef = useScrollReveal()
  const faqRef = useScrollReveal()
  const ctaRef = useScrollReveal()
  
  // Ref para animación escalonada de categorías
  const categoriesGridRef = useScrollRevealStagger(150)
  
  const categorias = [
    { 
      icon: <Code className="w-8 h-8" />, 
      nombre: 'Programación', 
      profesores: 45,
      descripcion: 'Python, JavaScript, Java, C++',
      color: 'from-blue-500 to-blue-600',
      premium: false
    },
    { 
      icon: <Calculator className="w-8 h-8" />, 
      nombre: 'Excel', 
      profesores: 32,
      descripcion: 'Tablas dinámicas, macros, análisis',
      color: 'from-green-500 to-green-600',
      premium: true
    },
    { 
      icon: <Globe className="w-8 h-8" />, 
      nombre: 'Inglés', 
      profesores: 28,
      descripcion: 'Conversacional, TOEFL, IELTS',
      color: 'from-purple-500 to-purple-600',
      premium: false
    },
    { 
      icon: <BookOpen className="w-8 h-8" />, 
      nombre: 'Matemáticas', 
      profesores: 21,
      descripcion: 'Álgebra, cálculo, estadística',
      color: 'from-orange-500 to-orange-600',
      premium: false
    },
    { 
      icon: <Star className="w-8 h-8" />, 
      nombre: 'Diseño Gráfico', 
      profesores: 19,
      descripcion: 'Photoshop, Illustrator, Figma',
      color: 'from-pink-500 to-pink-600',
      premium: true
    },
    { 
      icon: <Users className="w-8 h-8" />, 
      nombre: 'Marketing Digital', 
      profesores: 15,
      descripcion: 'SEO, SEM, redes sociales',
      color: 'from-indigo-500 to-indigo-600',
      premium: false
    },
    { 
      icon: <Shield className="w-8 h-8" />, 
      nombre: 'Finanzas', 
      profesores: 12,
      descripcion: 'Inversiones, contabilidad, Excel',
      color: 'from-emerald-500 to-emerald-600',
      premium: true
    },
    { 
      icon: <Clock className="w-8 h-8" />, 
      nombre: 'Análisis de Datos', 
      profesores: 18,
      descripcion: 'Python, R, Power BI, Tableau',
      color: 'from-cyan-500 to-cyan-600',
      premium: false
    }
  ]

  // Función para manejar clicks en categorías
  const handleCategoryClick = (categoria) => {
    // Redirigir a búsqueda filtrada por categoría
    // Ordenar por mejor puntuación y profesores premium
    const params = new URLSearchParams()
    params.set('categoria', categoria.nombre)
    params.set('ordenar', categoria.premium ? 'premium' : 'rating') // Priorizar premium o rating
    navigate(`/buscar?${params.toString()}`)
  }

  const testimonios = [
    {
      nombre: 'María García',
      profesion: 'Estudiante universitaria',
      testimonio: 'Aprendí Excel en solo 3 clases. El profesor fue excelente y muy paciente.',
      rating: 5
    },
    {
      nombre: 'Carlos Mendoza',
      profesion: 'Profesional',
      testimonio: 'Las clases de programación me ayudaron a conseguir un mejor trabajo.',
      rating: 5
    },
    {
      nombre: 'Ana Rodríguez',
      profesion: 'Emprendedora',
      testimonio: 'Flexible, económico y efectivo. Exactamente lo que necesitaba.',
      rating: 5
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8 fade-in" style={{animationDelay: '0.2s'}}>
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
              Conectando estudiantes con profesores expertos
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6 font-display leading-tight slide-up" style={{animationDelay: '0.4s'}}>
              Aprende habilidades útiles,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 block scale-in" style={{animationDelay: '0.6s'}}>
                paga por hora
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-600 mb-10 max-w-4xl mx-auto leading-relaxed fade-in" style={{animationDelay: '0.8s'}}>
              Conectamos personas que quieren aprender habilidades prácticas como Excel o programación 
              con <span className="font-semibold text-primary-600">profesores verificados</span>, de forma rápida, segura y flexible.
            </p>
            
            {/* Barra de búsqueda prominente */}
            <div className="max-w-4xl mx-auto mb-8 slide-up" style={{animationDelay: '1s'}}>
              <SearchBar />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 slide-up" style={{animationDelay: '1.2s'}}>
              <Link
                to="/buscar"
                className="btn-gradient text-lg px-8 py-3 rounded-2xl font-semibold w-full sm:w-auto micro-bounce"
              >
                Ver Todos los Profesores
              </Link>
              <Link
                to="/ser-profesor"
                className="border-2 border-secondary-400 text-secondary-700 hover:bg-secondary-400 hover:text-white text-lg px-8 py-3 rounded-2xl font-semibold transition-all duration-300 w-full sm:w-auto hover-lift micro-bounce"
              >
                Ser Profesor
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-600">500+</span>
                <span className="text-secondary-600 text-sm">Profesores Activos</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-600">2,000+</span>
                <span className="text-secondary-600 text-sm">Estudiantes</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-primary-600">15,000+</span>
                <span className="text-secondary-600 text-sm">Clases Completadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              ¿Por qué elegir EasyClase?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Sin compromisos largos, sin riesgos, sin complicaciones. Aprende a tu ritmo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4 text-center">Pago por Hora</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Solo pagas las horas que necesitas. Sin mensualidades ni compromisos largos.
              </p>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4 text-center">Sin Riesgos</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Tu dinero se libera solo cuando confirmas que recibiste la clase. Garantía total.
              </p>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-primary-50 p-8 rounded-3xl border border-primary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4 text-center">Profesores Verificados</h3>
              <p className="text-secondary-600 text-center leading-relaxed">
                Todos nuestros profesores pasan por un proceso de verificación y tienen excelentes calificaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías populares */}
      <section ref={categoriesRef} className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display slide-up">
              Categorías Populares
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto fade-in" style={{animationDelay: '0.2s'}}>
              Encuentra el profesor perfecto para lo que necesitas aprender
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(categoria)}
                className="group relative bg-white p-6 rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-center cursor-pointer"
              >
                {/* Badge Premium */}
                {categoria.premium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    ⭐ PREMIUM
                  </div>
                )}
                
                <div className={`w-20 h-20 bg-gradient-to-br ${categoria.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                  <div className="text-white">
                    {categoria.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {categoria.nombre}
                </h3>
                
                <p className="text-xs text-secondary-500 mb-2">
                  {categoria.descripcion}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-secondary-400 mr-1" />
                    <span className="text-sm text-secondary-600 font-semibold">
                      {categoria.profesores}
                    </span>
                  </div>
                  {categoria.premium && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-secondary-600">
                        Top Rated
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  {categoria.premium ? 'Ver mejores profesores →' : 'Explorar profesores →'}
                </div>
                
                {/* Hover effect indicator */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-600/10 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setShowCategoriesModal(true)}
              className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Ver todas las categorías
            </button>
          </div>
        </div>
      </section>

      {/* Sistema de Descuentos */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <Percent className="w-4 h-4 mr-2" />
              ¡Nuevo sistema de descuentos!
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              Descuentos Especiales para tu Primera Clase
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Obtén un 10% de descuento en tu primera clase de cada categoría. ¡Y con Premium, todos los descuentos que quieras!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Descuento por categoría */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  10% de Descuento
                </h3>
                <p className="text-green-600 font-semibold">
                  En tu primera clase de cada categoría
                </p>
              </div>
              <ul className="space-y-3 text-secondary-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Una clase con descuento por categoría</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Descuento asumido por el profesor</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Sin costos ocultos</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="text-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Plan Premium
                </h3>
                <p className="text-primary-100 font-semibold">
                  Descuentos ilimitados
                </p>
              </div>
              <ul className="space-y-3 text-primary-100 relative z-10">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                  <span>10% de descuento en todas las clases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                  <span>Descuento asumido por la plataforma</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                  <span>Acceso prioritario a profesores</span>
                </li>
              </ul>
            </div>

            {/* Cómo funciona */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  Cómo Funciona
                </h3>
                <p className="text-blue-600 font-semibold">
                  Proceso simple y transparente
                </p>
              </div>
              <div className="space-y-4 text-secondary-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <span>Elige tu categoría de aprendizaje</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <span>Selecciona tu profesor preferido</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <span>¡Disfruta tu descuento automáticamente!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué EasyClase es diferente */}
      <section ref={whyEasyClaseRef} className="py-20 bg-white scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display slide-up">
              ¿Por qué elegir EasyClase?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto fade-in" style={{animationDelay: '0.2s'}}>
              Una experiencia de aprendizaje diseñada para la vida moderna
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Paga por hora */}
            <div className="text-center group scale-in" style={{animationDelay: '0.4s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <PayPerHourIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Paga Solo por lo que Necesitas
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Sin suscripciones ni compromisos largos. Paga únicamente por las horas de clase que tomes.
              </p>
            </div>
            
            {/* Profesores verificados */}
            <div className="text-center group scale-in" style={{animationDelay: '0.6s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <VerifiedTeacherIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Profesores Verificados
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Todos nuestros profesores pasan por un proceso de verificación para garantizar calidad y experiencia.
              </p>
            </div>
            
            {/* Aprendizaje rápido */}
            <div className="text-center group scale-in" style={{animationDelay: '0.8s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <FastLearningIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Resultados Rápidos
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Aprende habilidades prácticas en sesiones personalizadas que se adaptan a tu ritmo y objetivos.
              </p>
            </div>
            
            {/* Seguridad */}
            <div className="text-center group scale-in" style={{animationDelay: '1s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <SecurityIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Pagos Seguros
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Transacciones protegidas y sistema de calificaciones para una experiencia confiable.
              </p>
            </div>
            
            {/* Flexibilidad */}
            <div className="text-center group scale-in" style={{animationDelay: '1.2s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <FlexibilityIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Horarios Flexibles
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Encuentra clases que se ajusten a tu agenda, incluso en horarios no convencionales.
              </p>
            </div>
            
            {/* Soporte Continuo */}
            <div className="text-center group scale-in" style={{animationDelay: '1.4s'}}>
              <div className="mx-auto mb-6 hover-grow">
                <SupportIcon className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Soporte Continuo
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Acompañamiento personalizado y seguimiento de tu progreso durante todo el proceso de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección de Servicios */}
      <section ref={servicesRef} className="py-20 bg-gradient-to-br from-white to-secondary-50 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              ¿Necesitas Algo Más Que Clases?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Descubre nuestros servicios profesionales: desde desarrollo web hasta tesis universitarias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Servicios destacados */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4 text-center">
                Desarrollo Web & Apps
              </h3>
              <p className="text-secondary-600 text-center mb-6">
                Sitios web profesionales, aplicaciones móviles y sistemas personalizados
              </p>
              <div className="text-center">
                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium: 10% comisión
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4 text-center">
                Tesis & Trabajos Académicos
              </h3>
              <p className="text-secondary-600 text-center mb-6">
                Asesoría completa para tesis, proyectos de grado y trabajos universitarios
              </p>
              <div className="text-center">
                <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4 mr-1" />
                  Más demandado
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4 text-center">
                Consultoría & Marketing
              </h3>
              <p className="text-secondary-600 text-center mb-6">
                Estrategias de negocio, marketing digital y consultoría especializada
              </p>
              <div className="text-center">
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Target className="w-4 h-4 mr-1" />
                  Alto ROI
                </span>
              </div>
            </div>
          </div>

          {/* Beneficios para proveedores Premium */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold mb-4">
                <Crown className="w-5 h-5 mr-2" />
                Beneficios Premium para Servicios
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Maximiza tus Ganancias con Premium
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Solo 10% Comisión</h4>
                <p className="text-sm text-secondary-600">vs 20% estándar</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Mayor Visibilidad</h4>
                <p className="text-sm text-secondary-600">Aparece primero en búsquedas</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Publicación Instant.</h4>
                <p className="text-sm text-secondary-600">Sin espera de aprobación</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => navigate('/servicios')}
                className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Explorar Servicios
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="inline-flex items-center px-8 py-4 border-2 border-amber-400 text-amber-700 hover:bg-amber-400 hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Crown className="w-5 h-5 mr-2" />
                Ser Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <SimpleTestimonials />

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 font-display">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-secondary-600">
              Resolvemos tus dudas sobre EasyClase
            </p>
          </div>

          <div className="space-y-6">
            <FAQItem
              question="¿Cómo funciona el sistema de pagos?"
              answer="Tu dinero se mantiene seguro hasta que confirmes que recibiste la clase. Solo entonces se libera el pago al profesor. Si el profesor no se presenta o no cumple, recibes un reembolso completo."
            />
            
            <FAQItem
              question="¿Qué pasa si no estoy satisfecho con la clase?"
              answer="Tienes 24 horas después de la clase para confirmar el servicio. Si no estás satisfecho, puedes reportar el problema y nuestro equipo de soporte resolverá la situación, incluyendo reembolsos cuando corresponda."
            />
            
            <FAQItem
              question="¿Cómo se verifican los profesores?"
              answer="Todos los profesores pasan por un proceso de verificación que incluye validación de identidad, experiencia profesional, certificaciones y una entrevista inicial. Además, mantenemos un sistema de calificaciones y reseñas."
            />
            
            <FAQItem
              question="¿Puedo cancelar una clase reservada?"
              answer="Sí, puedes cancelar hasta 24 horas antes de la clase sin penalización. Las cancelaciones con menos tiempo pueden tener una tarifa según nuestra política de cancelación."
            />
            
            <FAQItem
              question="¿Qué diferencia hay entre profesores premium y regulares?"
              answer="Los profesores premium han demostrado excelencia consistente, tienen las mejores calificaciones y ofrecen servicios adicionales. Aparecen primero en los resultados de búsqueda y tienen insignias especiales."
            />
            
            <FAQItem
              question="¿EasyClase cobra comisión?"
              answer="Sí, cobramos una pequeña comisión por facilitar la conexión segura entre estudiantes y profesores, manejar los pagos y brindar soporte. Los precios que ves ya incluyen todas las tarifas."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Únete a nuestra comunidad de aprendizaje
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display leading-tight">
            ¿Listo para empezar a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
              aprender?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a miles de estudiantes que ya están transformando sus carreras con EasyClase
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/registro"
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto text-lg"
            >
              Registrarse y Obtener Descuentos
            </Link>
            <Link
              to="/buscar"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-2xl transition-all duration-300 w-full sm:w-auto text-lg"
            >
              Explorar Clases
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-80">
            <div className="flex items-center text-white/80 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              <span>Pagos 100% seguros</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <Users className="w-4 h-4 mr-2" />
              <span>Más de 2,000 estudiantes</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <Star className="w-4 h-4 mr-2 fill-current" />
              <span>4.9/5 calificación promedio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Categorías */}
      <CategoriesModal 
        isOpen={showCategoriesModal} 
        onClose={() => setShowCategoriesModal(false)} 
      />
    </div>
  )
}

export default Home