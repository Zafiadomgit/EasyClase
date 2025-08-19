import React, { useEffect } from 'react'
import { X, Star, Users, Code, Calculator, Globe, Palette, TrendingUp, DollarSign, PieChart, BarChart, Target, Heart, Camera, Music, Pen, Briefcase, Wrench, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const CategoriesModal = ({ isOpen, onClose, highlightCategory = null }) => {
  if (!isOpen) return null

  // Todas las categorías organizadas por popularidad
  const categorias = [
    // Más buscadas
    {
      icon: <Code className="w-6 h-6" />,
      nombre: 'Programación',
      profesores: 245,
      descripcion: 'Python, JavaScript, Java, React, Node.js',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      destacada: true
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      nombre: 'Matemáticas',
      profesores: 189,
      descripcion: 'Álgebra, Cálculo, Estadística, Geometría',
      color: 'from-purple-500 to-purple-600',
      popular: true,
      destacada: true
    },
    {
      icon: <Globe className="w-6 h-6" />,
      nombre: 'Inglés',
      profesores: 167,
      descripcion: 'Conversacional, TOEFL, IELTS, Business',
      color: 'from-green-500 to-green-600',
      popular: true,
      destacada: true
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      nombre: 'Excel',
      profesores: 89,
      descripción: 'Tablas dinámicas, macros, análisis de datos',
      color: 'from-emerald-500 to-emerald-600',
      popular: false,
      destacada: true
    },
    {
      icon: <Palette className="w-6 h-6" />,
      nombre: 'Diseño Gráfico',
      profesores: 76,
      descripcion: 'Photoshop, Illustrator, Branding, UI/UX',
      color: 'from-pink-500 to-pink-600',
      popular: false,
      destacada: true
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      nombre: 'Marketing',
      profesores: 54,
      descripcion: 'Digital, SEO, SEM, Redes Sociales, Analytics',
      color: 'from-orange-500 to-orange-600',
      popular: false,
      destacada: true
    },

    // Otras categorías
    {
      icon: <DollarSign className="w-6 h-6" />,
      nombre: 'Finanzas',
      profesores: 42,
      descripcion: 'Inversiones, Trading, Contabilidad',
      color: 'from-indigo-500 to-indigo-600',
      popular: false,
      destacada: false
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      nombre: 'Análisis de Datos',
      profesores: 38,
      descripcion: 'Power BI, Tableau, SQL, Python',
      color: 'from-cyan-500 to-cyan-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Target className="w-6 h-6" />,
      nombre: 'Negocios',
      profesores: 35,
      descripcion: 'Administración, Emprendimiento, MBA',
      color: 'from-red-500 to-red-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Heart className="w-6 h-6" />,
      nombre: 'Salud y Bienestar',
      profesores: 29,
      descripcion: 'Nutrición, Fitness, Yoga, Mindfulness',
      color: 'from-rose-500 to-rose-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Camera className="w-6 h-6" />,
      nombre: 'Fotografía',
      profesores: 26,
      descripcion: 'Digital, Retrato, Paisaje, Edición',
      color: 'from-yellow-500 to-yellow-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Music className="w-6 h-6" />,
      nombre: 'Música',
      profesores: 23,
      descripcion: 'Piano, Guitarra, Canto, Producción',
      color: 'from-violet-500 to-violet-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Pen className="w-6 h-6" />,
      nombre: 'Escritura',
      profesores: 21,
      descripcion: 'Creativa, Técnica, Copywriting, Blogs',
      color: 'from-slate-500 to-slate-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      nombre: 'Desarrollo Personal',
      profesores: 18,
      descripcion: 'Liderazgo, Comunicación, Productividad',
      color: 'from-amber-500 to-amber-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      nombre: 'Tecnología',
      profesores: 16,
      descripcion: 'Redes, Sistemas, Ciberseguridad',
      color: 'from-gray-500 to-gray-600',
      popular: false,
      destacada: false
    },
    {
      icon: <Zap className="w-6 h-6" />,
      nombre: 'Ciencias',
      profesores: 14,
      descripcion: 'Física, Química, Biología, Ingeniería',
      color: 'from-teal-500 to-teal-600',
      popular: false,
      destacada: false
    }
  ]

  // Separar categorías destacadas y otras
  const categoriasDestacadas = categorias.filter(cat => cat.destacada)
  const otrasCategories = categorias.filter(cat => !cat.destacada)

  const handleCategoryClick = (categoria) => {
    onClose()
  }

  const handleBackdropClick = (e) => {
    // Cerrar solo si se hace clic exactamente en el backdrop, no en el contenido
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] overflow-y-auto shadow-2xl mx-auto mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-secondary-200 px-4 py-3 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-secondary-900 font-display">
                Todas las Categorías
              </h2>
              <p className="text-secondary-600 text-sm mt-1">
                Encuentra el profesor perfecto para lo que necesitas aprender
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-secondary-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-white min-h-[400px]">
          {/* Categorías más buscadas */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-secondary-900 mb-2 flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              Más Buscadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoriasDestacadas.length > 0 ? categoriasDestacadas.map((categoria, index) => {
                const isHighlighted = highlightCategory && categoria.nombre.toLowerCase() === highlightCategory.toLowerCase()
                return (
                <Link
                  key={index}
                  to={`/buscar?categoria=${encodeURIComponent(categoria.nombre)}`}
                  onClick={() => handleCategoryClick(categoria)}
                  className={`group relative bg-white border-2 ${isHighlighted ? 'border-primary-300 bg-primary-50' : 'border-secondary-100 hover:border-primary-200'} rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isHighlighted ? 'ring-2 ring-primary-200' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${categoria.color} rounded-lg text-white`}>
                      {categoria.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                          {categoria.nombre}
                        </h4>
                        {categoria.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
                        {categoria.descripcion}
                      </p>
                      <div className="flex items-center text-xs text-secondary-500">
                        <Users className="w-3 h-3 mr-1" />
                        {categoria.profesores} profesores
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/5 group-hover:to-primary-600/10 rounded-xl transition-all duration-300"></div>
                </Link>
                )
              }) : (
                <div className="col-span-full p-4 bg-red-100 text-red-700 rounded-lg">
                  No hay categorías destacadas
                </div>
              )}
            </div>
          </div>

          {/* Otras categorías */}
          <div>
            <h3 className="text-base font-semibold text-secondary-900 mb-2">
              Otras Categorías
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otrasCategories.length > 0 ? otrasCategories.map((categoria, index) => {
                const isHighlighted = highlightCategory && categoria.nombre.toLowerCase() === highlightCategory.toLowerCase()
                return (
                <Link
                  key={index}
                  to={`/buscar?categoria=${encodeURIComponent(categoria.nombre)}`}
                  onClick={() => handleCategoryClick(categoria)}
                  className={`group relative bg-white border ${isHighlighted ? 'border-primary-300 bg-primary-50' : 'border-secondary-200 hover:border-primary-200'} rounded-lg p-3 transition-all duration-300 hover:shadow-md ${isHighlighted ? 'ring-2 ring-primary-200' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 bg-gradient-to-r ${categoria.color} rounded-md text-white`}>
                      {categoria.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors text-sm">
                        {categoria.nombre}
                      </h4>
                      <div className="flex items-center text-xs text-secondary-500 mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        {categoria.profesores} profesores
                      </div>
                    </div>
                  </div>
                </Link>
                )
              }) : (
                <div className="col-span-full p-4 bg-red-100 text-red-700 rounded-lg">
                  No hay otras categorías
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 px-4 py-3 bg-secondary-50 rounded-b-2xl">
          <p className="text-sm text-secondary-600 text-center">
            ¿No encuentras lo que buscas? {' '}
            <Link 
              to="/buscar" 
              onClick={onClose}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Busca profesores por palabras clave
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoriesModal
