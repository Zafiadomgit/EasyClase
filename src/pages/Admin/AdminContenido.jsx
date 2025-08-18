import React from 'react'
import { FileText, Image, Video, Settings } from 'lucide-react'

const AdminContenido = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-600">Administra el contenido del sitio web</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Páginas del Sitio</h3>
          <p className="text-gray-600 text-sm mb-4">Editar contenido de páginas principales</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              📄 Página de Inicio
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              ❓ Preguntas Frecuentes
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              📋 Términos y Condiciones
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🔒 Política de Privacidad
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Image className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Medios</h3>
          <p className="text-gray-600 text-sm mb-4">Gestionar imágenes y archivos</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🖼️ Galería de Imágenes
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              📁 Biblioteca de Archivos
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              ⬆️ Subir Nuevos Archivos
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Video className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Videos Promocionales</h3>
          <p className="text-gray-600 text-sm mb-4">Gestionar contenido audiovisual</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🎥 Video de Bienvenida
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🎬 Tutoriales de Uso
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              📺 Testimonios
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Settings className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración SEO</h3>
          <p className="text-gray-600 text-sm mb-4">Optimización para motores de búsqueda</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🔍 Meta Descripciones
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🏷️ Palabras Clave
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🗺️ Sitemap
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Próximamente</h2>
        <p className="text-gray-600">
          Editor de contenido avanzado, gestión de medios y configuración SEO estará disponible próximamente.
        </p>
      </div>
    </div>
  )
}

export default AdminContenido
