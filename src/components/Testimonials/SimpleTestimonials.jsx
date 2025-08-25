import React from 'react'
import { Star } from 'lucide-react'

const SimpleTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'María García',
      role: 'Estudiante universitaria',
      rating: 5,
      comment: 'Aprendí Excel en solo 3 clases. El profesor fue excelente y muy paciente.',
      category: 'Excel'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      role: 'Profesional',
      rating: 5,
      comment: 'Las clases de programación me ayudaron a conseguir un mejor trabajo.',
      category: 'Programación'
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      role: 'Emprendedora',
      rating: 5,
      comment: 'Flexible, económico y efectivo. Exactamente lo que necesitaba.',
      category: 'General'
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre por qué miles de estudiantes confían en EasyClase para aprender nuevas habilidades
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              {/* Calificación */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Comentario */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.comment}"
              </blockquote>

              {/* Información del usuario */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full mt-1">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Más de 1,000 estudiantes satisfechos • 4.9/5 calificación promedio
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleTestimonials
