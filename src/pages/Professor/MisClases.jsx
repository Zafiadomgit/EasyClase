import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Clock, Users, Trash2, BookOpen, Layers } from 'lucide-react'

const MisClases = ({ embebido = false }) => {
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/plantillas', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })

      if (response.ok) {
        const data = await response.json()
        setClases(data.success ? (data.data?.plantillas || data.plantillas || []) : [])
      } else {
        console.error('Error cargando clases:', response.status)
        setClases([])
      }
    } catch (error) {
      console.error('Error cargando clases:', error)
      setClases([])
    } finally {
      setLoading(false)
    }
  }

  const eliminarClase = async (clase) => {
    if (!window.confirm(`¿Eliminar "${clase.titulo}"? Esta acción no se puede deshacer.`)) return

    try {
      setEliminando(clase.id)
      const response = await fetch(`/api/plantillas/${clase.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      const data = await response.json().catch(() => ({}))

      if (response.ok && data.success) {
        setClases(prev => prev.filter(c => c.id !== clase.id))
        setAviso(`"${clase.titulo}" se eliminó correctamente`)
        setTimeout(() => setAviso(''), 4000)
      } else {
        setAviso(data.message || 'No se pudo eliminar la clase')
      }
    } catch (error) {
      console.error('Error eliminando clase:', error)
      setAviso('No se pudo eliminar la clase')
    } finally {
      setEliminando(null)
    }
  }

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(precio) || 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Cargando tus clases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={embebido
      ? ''
      : 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'}>
      {!embebido && (
        <>
          {/* Halos decorativos, como en el resto de la aplicación */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </>
      )}

      <div className={embebido ? '' : 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}>
        {/* Encabezado con acciones alineadas */}
        <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 ${embebido ? 'mb-6' : 'mb-10'}`}>
          <div>
            {!embebido && (
              <>
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                  Mis Clases
                </h1>
                <p className="text-lg text-purple-200">
                  Gestiona las clases que ofreces a tus estudiantes
                </p>
              </>
            )}
            {clases.length > 0 && (
              <p className="text-sm text-purple-300 mt-2">
                {clases.length} {clases.length === 1 ? 'clase publicada' : 'clases publicadas'}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/servicios/crear"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <Layers className="w-5 h-5" />
              Crear servicio
            </Link>
            <Link
              to="/clases/crear"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Nueva clase
            </Link>
          </div>
        </div>

        {aviso && (
          <div className="mb-6 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-3 text-purple-100">
            {aviso}
          </div>
        )}

        {clases.length === 0 ? (
          <div className={`bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 text-center ${embebido ? 'p-8' : 'p-12 max-w-2xl mx-auto'}`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Todavía no publicas ninguna clase</h3>
            <p className="text-purple-200 mb-8 leading-relaxed">
              Publica tu primera clase para que los estudiantes puedan encontrarte
              en la búsqueda y reservarte.
            </p>
            <Link
              to="/clases/crear"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Crear mi primera clase
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 ${embebido ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
            {clases.map((clase) => (
              <div
                key={clase.id}
                className="group flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:border-purple-400/50 hover:shadow-2xl transition-all duration-300"
              >
                {/* El precio es lo que decide el estudiante: va arriba y destacado */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/10 px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {clase.titulo}
                    </h3>
                    <span className="shrink-0 text-right">
                      <span className="block text-xl font-bold text-white">
                        {formatPrecio(clase.precio)}
                      </span>
                      <span className="block text-xs text-purple-200">por hora</span>
                    </span>
                  </div>
                  {(clase.materia || clase.categoria) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {clase.materia && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-purple-100 border border-white/20">
                          {clase.materia}
                        </span>
                      )}
                      {clase.categoria && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-purple-100 border border-white/20">
                          {clase.categoria}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 px-6 py-5">
                  {clase.descripcion && (
                    <p className="text-sm text-purple-200 leading-relaxed mb-5 line-clamp-3">
                      {clase.descripcion}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-purple-200">
                      <Clock className="w-4 h-4 mr-2 text-purple-300" />
                      <span>{clase.duracion || 1}h</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <Users className="w-4 h-4 mr-2 text-purple-300" />
                      <span>
                        {clase.tipo === 'individual'
                          ? 'Individual'
                          : `Grupal · ${clase.maxEstudiantes || clase.max_estudiantes || 5}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Eliminar es destructivo: discreto hasta que se pasa el ratón */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center text-xs text-green-300">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Visible para estudiantes
                  </span>
                  <button
                    onClick={() => eliminarClase(clase)}
                    disabled={eliminando === clase.id}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-300 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {eliminando === clase.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisClases
