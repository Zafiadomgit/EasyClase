import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'
import { User, Edit, Calendar, Star, Crown, Shield, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const Perfil = () => {
  const { user, logout, updateProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      cargarDatosUsuario()
    }
  }, [user])

  const cargarDatosUsuario = async () => {
    try {
      setLoading(true)
      const response = await userService.obtenerPerfil()
      setUserData(response.data)
      
      // Inicializar datos de edición
      setEditData({
        nombre: response.data?.nombre || user?.nombre || '',
        telefono: response.data?.telefono || user?.telefono || '',
        direccion: response.data?.direccion || user?.direccion || '',
        bio: response.data?.bio || user?.bio || ''
      })
    } catch (error) {
      // Error silencioso para no interrumpir el flujo
      // Usar datos del contexto si falla la API
      setUserData(user)
      setEditData({
        nombre: user?.nombre || '',
        telefono: user?.telefono || '',
        direccion: user?.direccion || '',
        bio: user?.bio || ''
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await updateProfile(editData)
      setShowEditModal(false)
      // Recargar datos del usuario
      await cargarDatosUsuario()
      alert('Perfil actualizado exitosamente')
    } catch (error) {
      alert('Error al actualizar el perfil: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Acceso Denegado</h2>
          <p className="text-secondary-600">Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del Perfil */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mr-6">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {userData?.nombre || user?.nombre || 'Mi Perfil'}
              </h1>
              <p className="text-lg text-secondary-600 mb-3">
                {userData?.email || user?.email}
              </p>
              <div className="flex items-center space-x-4">
                {userData?.premium?.activo && (
                  <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                )}
                <div className="flex items-center text-secondary-600">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span className="font-medium">
                    {userData?.calificacionPromedio?.toFixed(1) || '0.0'}
                  </span>
                  <span className="ml-1">
                    ({userData?.totalReviews || 0} reseñas)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleEditClick}
              className="flex items-center px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Información Personal</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Nombre:</span>
                <span className="font-medium">{userData?.nombre || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Email:</span>
                <span className="font-medium">{userData?.email || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Teléfono:</span>
                <span className="font-medium">{userData?.telefono || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Rol:</span>
                <span className="font-medium capitalize">{userData?.rol || 'Usuario'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Clases tomadas:</span>
                <span className="font-medium">{userData?.clasesTomadas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Clases impartidas:</span>
                <span className="font-medium">{userData?.clasesImpartidas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Servicios creados:</span>
                <span className="font-medium">{userData?.serviciosCreados || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Miembro desde:</span>
                <span className="font-medium">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/mis-clases" className="block">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-secondary-900">Mis Clases</h3>
            </div>
            <p className="text-secondary-600 text-sm mb-4">
              Revisa el historial de tus clases y próximas sesiones
            </p>
            <span className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Ver Clases →
            </span>
          </div>
        </Link>

        <Link to="/seguridad" className="block">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-secondary-900">Seguridad</h3>
            </div>
            <p className="text-secondary-600 text-sm mb-4">
              Gestiona tu contraseña y configuraciones de seguridad
            </p>
            <span className="text-green-600 hover:text-green-700 font-medium text-sm">
              Configurar →
            </span>
          </div>
        </Link>

        <Link to="/preferencias" className="block">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-secondary-600 mr-3" />
              <h3 className="text-lg font-semibold text-secondary-900">Preferencias</h3>
            </div>
            <p className="text-secondary-600 text-sm mb-4">
              Personaliza tu experiencia y notificaciones
            </p>
            <span className="text-secondary-600 hover:text-secondary-700 font-medium text-sm">
              Configurar →
            </span>
          </div>
        </Link>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Perfil</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={editData.nombre}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={editData.telefono}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={editData.direccion}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Biografía</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={editData.bio}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Perfil
