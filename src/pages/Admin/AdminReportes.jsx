import React from 'react'
import { BarChart3, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'

const AdminReportes = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p className="text-gray-600">Métricas y estadísticas de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes de Ventas</h3>
          <p className="text-gray-600 text-sm">Análisis de ingresos y transacciones</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Generar Reporte
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Actividad de Usuarios</h3>
          <p className="text-gray-600 text-sm">Registros y comportamiento de usuarios</p>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Ver Análisis
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Clases Programadas</h3>
          <p className="text-gray-600 text-sm">Estadísticas de clases y horarios</p>
          <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            Ver Calendario
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Próximamente</h2>
        <p className="text-gray-600">
          Esta sección estará disponible próximamente con reportes detallados, gráficos interactivos y exportación de datos.
        </p>
      </div>
    </div>
  )
}

export default AdminReportes
