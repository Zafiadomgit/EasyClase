import React from 'react'
import { Server, Database, Shield, Settings, Activity, AlertTriangle } from 'lucide-react'

const AdminSistema = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600">Configuraciones técnicas y del servidor</p>
      </div>

      {/* Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Server className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Servidor</p>
              <p className="text-lg font-bold text-green-600">Online</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Base de Datos</p>
              <p className="text-lg font-bold text-green-600">Conectada</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Socket.io</p>
              <p className="text-lg font-bold text-blue-600">Activo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Server className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración del Servidor</h3>
          <p className="text-gray-600 text-sm mb-4">Ajustes técnicos del backend</p>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Puerto:</span>
              <span className="text-sm font-medium">3000</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Entorno:</span>
              <span className="text-sm font-medium">Development</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Node.js:</span>
              <span className="text-sm font-medium">v18.x</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Memoria Usada:</span>
              <span className="text-sm font-medium">245 MB</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Database className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Base de Datos</h3>
          <p className="text-gray-600 text-sm mb-4">Información de MongoDB Atlas</p>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className="text-sm font-medium text-green-600">Conectada</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Cluster:</span>
              <span className="text-sm font-medium">MongoDB Atlas</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Usuarios:</span>
              <span className="text-sm font-medium">3</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Clases:</span>
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Shield className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguridad</h3>
          <p className="text-gray-600 text-sm mb-4">Configuraciones de seguridad</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🔒 Configurar HTTPS
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🛡️ Firewall Rules
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🔑 Gestión de Tokens JWT
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🚨 Rate Limiting
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Settings className="w-8 h-8 text-orange-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración General</h3>
          <p className="text-gray-600 text-sm mb-4">Ajustes de la aplicación</p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              💰 Configurar MercadoPago
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              📧 Configurar SMTP
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🎥 Configurar Socket.io
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              🌐 Variables de Entorno
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Logs del Sistema</h2>
        </div>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div>[2024-01-20 16:56:11] 🚀 Servidor EasyClase corriendo en http://localhost:3000</div>
          <div>[2024-01-20 16:56:11] 📚 API disponible en http://localhost:3000/api</div>
          <div>[2024-01-20 16:56:11] 🎥 Socket.io para videollamadas habilitado</div>
          <div>[2024-01-20 16:56:11] ✅ Conectado a MongoDB</div>
          <div>[2024-01-20 16:56:15] 👤 Usuario conectado: socket_id_12345</div>
          <div>[2024-01-20 16:56:20] 📝 Nueva clase creada: ID #123</div>
        </div>
      </div>
    </div>
  )
}

export default AdminSistema
