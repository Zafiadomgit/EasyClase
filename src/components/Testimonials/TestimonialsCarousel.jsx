import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const TestimonialsCarousel = ({ testimonials = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Testimonios por defecto si no se proporcionan
  const defaultTestimonials = [
    {
      id: 1,
      name: 'María García',
      role: 'Estudiante universitaria',
      rating: 5,
      comment: 'Aprendí Excel en solo 3 clases. El profesor fue excelente y muy paciente.',
      avatar: null,
      category: 'Excel'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      role: 'Profesional',
      rating: 5,
      comment: 'Las clases de programación me ayudaron a conseguir un mejor trabajo.',
      avatar: null,
      category: 'Programación'
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      role: 'Emprendedora',
      rating: 5,
      comment: 'Flexible, económico y efectivo. Exactamente lo que necesitaba.',
      avatar: null,
      category: 'General'
    },
    {
      id: 4,
      name: 'Luis Pérez',
      role: 'Estudiante',
      rating: 5,
      comment: 'Excelente plataforma. Los profesores son muy profesionales y las clases son muy útiles.',
      avatar: null,
      category: 'Matemáticas'
    },
    {
      id: 5,
      name: 'Sofia López',
      role: 'Desarrolladora',
      rating: 5,
      comment: 'Las clases de React fueron increíbles. Ahora puedo crear aplicaciones web modernas.',
      avatar: null,
      category: 'React'
    }
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, interval, displayTestimonials.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayTestimonials.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

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
    <div className="relative max-w-6xl mx-auto px-4">
      {/* Título de la sección */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Lo que dicen nuestros estudiantes
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Descubre por qué miles de estudiantes confían en EasyClase para aprender nuevas habilidades
        </p>
      </div>

      {/* Controles de reproducción automática */}
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleAutoPlay}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isAutoPlaying
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {isAutoPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
        </button>
      </div>

      {/* Carrusel principal - VERSIÓN MEJORADA */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Contenido del carrusel - VERSIÓN MEJORADA */}
        <div className="relative h-96 md:h-80">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 p-8 md:p-12"
              >
                <div className="max-w-4xl mx-auto text-center h-full flex flex-col justify-center">
                  {/* Icono de comillas */}
                  <div className="mb-6">
                    <Quote className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto" />
                  </div>

                  {/* Comentario */}
                  <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-gray-100 mb-8 leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Información del usuario */}
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        testimonial.name.charAt(0)
                      )}
                    </div>

                    {/* Nombre y rol */}
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Categoría */}
                    {testimonial.category && (
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-full">
                        {testimonial.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores de puntos */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Más de 1,000 estudiantes satisfechos • 4.9/5 calificación promedio
        </p>
      </div>
    </div>
  )
}

export default TestimonialsCarousel
