import React, { useState, useEffect } from 'react'
import { Download, Calendar, Clock, DollarSign, FileText, Video, AlertCircle, CheckCircle } from 'lucide-react'

const MisServiciosComprados = () => {
  const [compras, setCompras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarMisCompras()
  }, [])

  const cargarMisCompras = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/compras-servicios/mis-compras', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCompras(data.data.compras || [])
      } else {
        setError(data.message || 'Error cargando compras')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const descargarArchivo = async (compraId, archivoId, nombreArchivo) => {
    try {
      const response = await fetch(`/api/compras-servicios/${compraId}/archivos/${archivoId}/descargar`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = nombreArchivo
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error descargando archivo')
      }
    } catch (error) {
      console.error('Error descargando archivo:', error)
      alert('Error descargando archivo')
    }
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio)
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagado':
        return 'bg-green-100 text-green-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'reembolsado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'pagado':
        return <CheckCircle className="w-4 h-4" />
      case 'pendiente':
        return <Clock className="w-4 h-4" />
      case 'reembolsado':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Servicios Comprados</h1>
          <p className="text-gray-600">Accede a todos tus cursos y servicios adquiridos</p>
        </div>
      </div>

      {/* Lista de Servicios Comprados */}
      {compras.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes servicios comprados</h3>
          <p className="text-gray-600 mb-6">
            Explora nuestros servicios y comienza a aprender
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Header del servicio */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {compra.servicioInfo?.titulo || 'Servicio sin título'}
                  </h3>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(compra.estado)}`}>
                    {getEstadoIcono(compra.estado)}
                    <span className="ml-1 capitalize">
                      {compra.estado === 'pagado' ? 'Pagado' : 
                       compra.estado === 'pendiente' ? 'Pendiente' : 'Reembolsado'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {compra.servicioInfo?.descripcion || 'Sin descripción'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatPrecio(compra.precio)}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatFecha(compra.createdAt)}
                  </span>
                </div>
              </div>

              {/* Contenido del servicio */}
              {compra.estado === 'pagado' && (
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Archivos disponibles:</h4>
                  <div className="space-y-2">
                    {/* Lista de archivos de ejemplo */}
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Video className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700">video_introduccion.mp4</span>
                      </div>
                      <button
                        onClick={() => descargarArchivo(compra.id, 1, 'video_introduccion.mp4')}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-gray-700">presentacion.pdf</span>
                      </div>
                      <button
                        onClick={() => descargarArchivo(compra.id, 2, 'presentacion.pdf')}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {compra.estado === 'pendiente' && (
                <div className="p-6 text-center">
                  <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Pago pendiente de confirmación</p>
                </div>
              )}

              {compra.estado === 'reembolsado' && (
                <div className="p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Servicio reembolsado</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MisServiciosComprados
