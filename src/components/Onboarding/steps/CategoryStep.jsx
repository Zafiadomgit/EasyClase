import React, { useState } from 'react'
import { Code, Calculator, Palette, Globe, TrendingUp, BookOpen, Music, Camera, HelpCircle, CheckCircle } from 'lucide-react'

const CategoryStep = ({ formData, updateFormData, onNext }) => {
  const [selectedCategory, setSelectedCategory] = useState(formData.categoria || '')

  const categorias = [
    {
      id: 'programacion',
      nombre: 'Programación',
      icon: <Code className="w-8 h-8" />,
      descripcion: 'JavaScript, Python, React, etc.',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'excel',
      nombre: 'Excel & Office',
      icon: <Calculator className="w-8 h-8" />,
      descripcion: 'Fórmulas, tablas dinámicas, VBA',
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      id: 'diseno',
      nombre: 'Diseño Gráfico',
      icon: <Palette className="w-8 h-8" />,
      descripcion: 'Photoshop, Illustrator, Figma',
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'marketing',
      nombre: 'Marketing Digital',
      icon: <TrendingUp className="w-8 h-8" />,
      descripcion: 'SEO, redes sociales, publicidad',
      color: 'from-orange-500 to-orange-600',
      popular: true
    },
    {
      id: 'idiomas',
      nombre: 'Idiomas',
      icon: <Globe className="w-8 h-8" />,
      descripcion: 'Inglés, francés, alemán, etc.',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'academico',
      nombre: 'Apoyo Académico',
      icon: <BookOpen className="w-8 h-8" />,
      descripcion: 'Matemáticas, física, química',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'musica',
      nombre: 'Música',
      icon: <Music className="w-8 h-8" />,
      descripcion: 'Piano, guitarra, canto, teoría',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'fotografia',
      nombre: 'Fotografía',
      icon: <Camera className="w-8 h-8" />,
      descripcion: 'Técnica, edición, composición',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const handleCategorySelect = (categoria) => {
    setSelectedCategory(categoria.nombre)
    updateFormData({ categoria: categoria.nombre })
  }

  const handleNotSure = () => {
    setSelectedCategory('No estoy seguro')
    updateFormData({ categoria: '' })
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 font-display">
          ¿Qué te interesa aprender?
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Selecciona el área que más te llame la atención para mostrarte profesores especializados
        </p>
      </div>

      {/* Popular badge */}
      <div className="text-center">
        <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          ⭐ Categorías más populares
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((categoria) => {
          const isSelected = selectedCategory === categoria.nombre
          
          return (
            <button
              key={categoria.id}
              onClick={() => handleCategorySelect(categoria)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : 'border-secondary-200 bg-white hover:border-primary-300'
              }`}
            >
              {/* Popular badge */}
              {categoria.popular && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-2 -left-2 bg-primary-600 text-white rounded-full p-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${categoria.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white transition-transform duration-300 ${
                isSelected ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {categoria.icon}
              </div>

              {/* Content */}
              <h3 className={`font-semibold mb-2 transition-colors ${
                isSelected ? 'text-primary-700' : 'text-secondary-900 group-hover:text-primary-600'
              }`}>
                {categoria.nombre}
              </h3>
              <p className="text-xs text-secondary-600">
                {categoria.descripcion}
              </p>
            </button>
          )
        })}
      </div>

      {/* Not sure option */}
      <div className="text-center">
        <button
          onClick={handleNotSure}
          className={`inline-flex items-center px-6 py-3 border-2 border-dashed rounded-xl transition-all duration-300 hover:scale-105 ${
            selectedCategory === 'No estoy seguro'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-secondary-300 text-secondary-600 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          <HelpCircle className="w-5 h-5 mr-2" />
          No estoy seguro, muéstrame clases populares
        </button>
      </div>

      {/* Continue button */}
      {selectedCategory && (
        <div className="text-center animate-fade-in">
          <button
            onClick={handleContinue}
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Continuar
            <CheckCircle className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}

      {/* Help text */}
      <div className="text-center">
        <p className="text-sm text-secondary-500">
          💡 Tip: Puedes cambiar esto después en tu perfil
        </p>
      </div>
    </div>
  )
}

export default CategoryStep
