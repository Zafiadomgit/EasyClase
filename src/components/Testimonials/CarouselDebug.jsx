import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, Bug, Play, Pause } from 'lucide-react'

const CarouselDebug = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [debugInfo, setDebugInfo] = useState({
    totalSlides: 5,
    currentSlide: 0,
    isAutoPlaying: true,
    transformValue: '0%',
    containerHeight: 'h-80',
    slideWidth: '100%'
  })

  const testimonials = [
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

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        updateDebugInfo(newIndex)
        return newIndex
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, testimonials.length])

  const updateDebugInfo = (index) => {
    setDebugInfo({
      totalSlides: testimonials.length,
      currentSlide: index + 1,
      isAutoPlaying,
      transformValue: `${-index * 100}%`,
      containerHeight: 'h-80',
      slideWidth: '100%'
    })
  }

  const nextSlide = () => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    updateDebugInfo(newIndex)
  }

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    updateDebugInfo(newIndex)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    updateDebugInfo(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
    setDebugInfo(prev => ({ ...prev, isAutoPlaying: !isAutoPlaying }))
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
      {/* Panel de depuración */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <Bug className="w-5 h-5 text-yellow-600 mr-2" />
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Panel de Depuración</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Slides totales:</span> {debugInfo.totalSlides}
          </div>
          <div>
            <span className="font-medium">Slide actual:</span> {debugInfo.currentSlide}
          </div>
          <div>
            <span className="font-medium">Auto-play:</span> {debugInfo.isAutoPlaying ? 'ON' : 'OFF'}
          </div>
          <div>
            <span className="font-medium">Transform:</span> {debugInfo.transformValue}
          </div>
        </div>
      </div>

      {/* Título de la sección */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Testimonios - Modo Depuración
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Verificando funcionamiento del carrusel
        </p>
      </div>

      {/* Controles de reproducción automática */}
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleAutoPlay}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
            isAutoPlaying
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAutoPlaying ? 'Pausar' : 'Reproducir'}
        </button>
      </div>

      {/* Carrusel principal */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-2 border-blue-200 dark:border-blue-800">
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

        {/* Contenido del carrusel */}
        <div className="relative h-80 md:h-72">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 p-6 md:p-8 border-r border-gray-200 dark:border-gray-700"
              >
                <div className="max-w-4xl mx-auto text-center h-full flex flex-col justify-center">
                  {/* Indicador de slide */}
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Slide {index + 1}
                  </div>

                  {/* Icono de comillas */}
                  <div className="mb-3">
                    <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto" />
                  </div>

                  {/* Comentario */}
                  <blockquote className="text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Información del usuario */}
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
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
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>

                    {/* Calificación */}
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Categoría */}
                    {testimonial.category && (
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
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
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Modo depuración activo • Carrusel funcional
        </p>
      </div>
    </div>
  )
}

export default CarouselDebug
