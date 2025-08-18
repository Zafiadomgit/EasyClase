import React, { useState, useEffect } from 'react'
import { Search, Filter, Star, MapPin, Clock, DollarSign } from 'lucide-react'
import { profesorService } from '../services/api'

const BuscarClases = () => {
  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Datos de ejemplo mientras el backend se conecta
    const profesoresEjemplo = [
      {
        _id: '1',
        nombre: 'Carlos Mendoza',
        especialidades: ['Programación', 'Python'],
        calificacionPromedio: 4.9,
        totalReviews: 127,
        precioPorHora: 25000,
        modalidad: 'online',
        ubicacion: 'Bogotá',
        descripcion: 'Ingeniero de software con 8 años de experiencia. Especialista en Python, Django y desarrollo web.'
      },
      {
        _id: '2',
        nombre: 'María García',
        especialidades: ['Excel', 'Análisis de datos'],
        calificacionPromedio: 4.8,
        totalReviews: 89,
        precioPorHora: 20000,
        modalidad: 'presencial',
        ubicacion: 'Medellín',
        descripcion: 'Contadora pública especializada en análisis de datos y automatización con Excel.'
      }
    ]
    
    setTimeout(() => {
      setProfesores(profesoresEjemplo)
      setLoading(false)
    }, 1000)
  }, [])

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando profesores...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 font-display">
          Buscar Clases
        </h1>
        <p className="text-lg text-secondary-600">
          Encuentra el profesor perfecto para lo que necesitas aprender
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-secondary-600">
            {profesores.length} profesores encontrados
          </p>
        </div>

        {/* Lista de profesores */}
        {profesores.map((profesor) => (
          <div key={profesor._id} className="card-hover cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto del profesor */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-secondary-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {profesor.nombre.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Información del profesor */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                      {profesor.nombre}
                    </h3>
                    <p className="text-primary-600 font-medium mb-2">
                      {profesor.especialidades?.join(', ') || 'Especialidades no especificadas'}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-secondary-900">
                          {profesor.calificacionPromedio?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-secondary-600">
                        ({profesor.totalReviews || 0} reseñas)
                      </span>
                    </div>

                    {/* Modalidad y ubicación */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-secondary-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {profesor.modalidad || 'Online'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profesor.ubicacion || 'No especificada'}
                      </div>
                    </div>

                    <p className="text-secondary-600 text-sm mb-3">
                      {profesor.descripcion || 'Sin descripción disponible'}
                    </p>

                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-600 font-medium">
                        Disponible
                      </span>
                    </div>
                  </div>

                  {/* Precio y acciones */}
                  <div className="flex-shrink-0 text-right mt-4 md:mt-0 md:ml-6">
                    <div className="text-2xl font-bold text-secondary-900 mb-2">
                      {formatPrecio(profesor.precioPorHora || 0)}
                      <span className="text-sm font-normal text-secondary-600">/hora</span>
                    </div>
                    <button 
                      className="btn-primary w-full md:w-auto px-6"
                      onClick={() => window.location.href = `/profesor/${profesor._id}`}
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuscarClases
