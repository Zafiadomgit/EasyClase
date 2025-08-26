import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Search, User, BookOpen, LogOut, Bell, ChevronDown, Star, Crown, Code, Calculator, Globe, FileText, Palette, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import ThemeToggle from '../UI/ThemeToggle'
import CategoriesModal from '../Modal/CategoriesModal'
import NotificationBell from '../NotificationBell'
// import { useNotifications, getNotificationIcon, getNotificationColor } from '../../hooks/useNotifications'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const categoriesRef = useRef(null)
  const notificationsRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, loading } = useAuth()
  const { addPersistentNotification } = useNotifications()
  
  // Evitar renderizar elementos de usuario mientras se verifica autenticación
  const shouldShowUserElements = !loading && isAuthenticated && user;
  
  console.log('🔔 Header: shouldShowUserElements:', shouldShowUserElements, 'loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user?.id)
  console.log('🔔 Header: User object:', user)
  console.log('🔔 Header: Auth context details:', { loading, isAuthenticated, user: user ? { id: user.id, nombre: user.nombre, tipoUsuario: user.tipoUsuario } : null })
  
  // Función para mostrar notificaciones del sistema
  const showSystemNotification = (type, title, message) => {
    if (!user?.id) return
    
    const systemNotifications = {
      welcome: {
        type: 'info',
        title: '¡Bienvenido a Easy Clase!',
        message: 'Tu plataforma de aprendizaje personalizado',
        icon: 'star',
        color: 'blue'
      },
      class_reminder: {
        type: 'reminder',
        title: 'Recordatorio de Clase',
        message: 'Tu clase comienza en 30 minutos',
        icon: 'clock',
        color: 'orange'
      },
      payment_reminder: {
        type: 'payment',
        title: 'Recordatorio de Pago',
        message: 'Tu próxima clase requiere confirmación de pago',
        icon: 'credit-card',
        color: 'yellow'
      }
    }
    
    const notification = systemNotifications[type]
    if (notification) {
      addPersistentNotification(user.id, notification)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      payment: '💳',
      class: '📚',
      reminder: '⏰'
    }
    return icons[type] || '📢'
  }
  
  const getNotificationColor = (priority) => {
    return 'border-gray-500 bg-gray-50'
  }

  // Categorías con popularidad
  const categorias = [
    { 
      name: 'Programación', 
      icon: <Code className="w-5 h-5" />, 
      popular: true,
      profesores: 245
    },
    { 
      name: 'Matemáticas', 
      icon: <Calculator className="w-5 h-5" />, 
      popular: true,
      profesores: 189
    },
    { 
      name: 'Inglés', 
      icon: <Globe className="w-5 h-5" />, 
      popular: true,
      profesores: 167
    },
    { 
      name: 'Excel', 
      icon: <FileText className="w-5 h-5" />, 
      popular: false,
      profesores: 89
    },
    { 
      name: 'Diseño Gráfico', 
      icon: <Palette className="w-5 h-5" />, 
      popular: false,
      profesores: 76
    },
    { 
      name: 'Marketing', 
      icon: <TrendingUp className="w-5 h-5" />, 
      popular: false,
      profesores: 54
    }
  ]

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
    setIsNotificationsOpen(false) // Cerrar notificaciones si están abiertas
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    setIsCategoriesOpen(false) // Cerrar categorías si están abiertas
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const handleCategoryClick = (categoria) => {
    navigate(`/buscar?categoria=${encodeURIComponent(categoria)}`)
    setIsCategoriesOpen(false)
  }



  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-secondary-100 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img 
                src="/Logo_reducido-removebg-preview.png" 
                alt="EasyClase" 
                className="h-16 w-auto object-contain hover:opacity-90 transition-opacity duration-200"
                onError={(e) => {
                  // Fallback al logo reducido original
                  e.target.src = '/Logo reducido.png';
                  e.target.onerror = () => {
                    // Fallback al Logo1
                    e.target.src = '/Logo1.png';
                  };
                }}
              />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/buscar"
              className="text-secondary-700 hover:text-primary-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              Buscar Clases
            </Link>
            <Link
              to="/servicios"
              className="text-secondary-700 hover:text-primary-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              Servicios
            </Link>
            
            {/* Dropdown de Categorías */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={toggleCategories}
                className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
              >
                <span>Categorías</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-secondary-200 dark:border-gray-600 py-4 z-50">
                  <div className="px-4 py-2 border-b border-secondary-100 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-secondary-900 dark:text-gray-100">Todas las Categorías</h3>
                    <p className="text-xs text-secondary-600 dark:text-gray-400">Encuentra tu profesor ideal</p>
                  </div>
                  
                  <div className="py-2">
                    {categorias.map((categoria) => (
                      <button
                        key={categoria.name}
                        onClick={() => handleCategoryClick(categoria.name)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            {categoria.icon}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-secondary-900 dark:text-gray-100">{categoria.name}</span>
                              {categoria.popular && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-secondary-600 dark:text-gray-400">{categoria.profesores} profesores</span>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-secondary-400 rotate-[-90deg]" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-secondary-100 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setIsCategoriesOpen(false)
                        setShowCategoriesModal(true)
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Ver todas las categorías →
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/como-funciona"
              className="text-secondary-700 hover:text-primary-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              ¿Cómo funciona?
            </Link>
            <Link
              to="/ser-profesor"
              className="text-secondary-700 hover:text-primary-600 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
            >
              Ser Profesor
            </Link>
          </nav>

          {/* Botones de acción Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {shouldShowUserElements ? (
              <>
                {/* Botón de Notificaciones */}
                <NotificationBell />
                
                {/* Menú de Usuario */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-xs">
                        {user?.nombre?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user?.nombre?.split(' ')[0]}</span>
                  </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mi Dashboard
                    </Link>
                    
                    {user?.tipoUsuario === 'profesor' && (
                      <Link
                        to="/profesor/disponibilidad"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        📅 Configurar Disponibilidad
                      </Link>
                    )}
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    {user?.tipoUsuario === 'profesor' && (
                      <Link
                        to="/mis-clases"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mis Clases
                      </Link>
                    )}
                    
                    {/* Opción Premium para Profesores */}
                    {user?.tipoUsuario === 'profesor' && (
                      <>
                        <hr className="my-1" />
                        <Link
                          to="/premium"
                          className="block px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ⭐ Obtener Premium
                        </Link>
                      </>
                    )}
                    
                    {(user?.tipoUsuario === 'admin' || ['admin', 'superadmin'].includes(user?.rol)) && (
                      <>
                        <hr className="my-1" />
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          🛡️ Panel Admin
                        </Link>
                      </>
                    )}
                    <hr className="my-1" />
                    
                    {/* Theme Toggle en menú de usuario */}
                    <div className="px-4 py-2 flex items-center justify-between hover:bg-secondary-50">
                      <span className="text-sm text-secondary-700">Modo Oscuro</span>
                      <ThemeToggle />
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-primary-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-primary-50"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Registrarse
                </Link>
                
                {/* Theme Toggle para usuarios no logueados */}
                <ThemeToggle className="ml-4" />
              </>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-secondary-600 hover:text-primary-600 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-secondary-200">
              <Link
                to="/buscar"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                onClick={toggleMenu}
              >
                Buscar Clases
              </Link>
              <Link
                to="/servicios"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
              <Link
                to="/como-funciona"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                onClick={toggleMenu}
              >
                ¿Cómo funciona?
              </Link>
              <Link
                to="/ser-profesor"
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                onClick={toggleMenu}
              >
                Ser Profesor
              </Link>
              
              {/* Theme Toggle Mobile */}
              <div className="px-3 py-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-secondary-600">Modo Oscuro</span>
                  <ThemeToggle />
                </div>
              </div>
              
              <div className="border-t border-secondary-200 pt-3 mt-3">
                {shouldShowUserElements ? (
                  <>
                    <div className="flex items-center px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-semibold text-xs">
                          {user?.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-secondary-900 font-medium">{user?.nombre}</span>
                    </div>
                    
                    {/* Notificaciones en móvil */}
                    <div className="px-3 py-2 mb-2">
                      <NotificationBell />
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                      onClick={toggleMenu}
                    >
                      Mi Dashboard
                    </Link>
                    <Link
                      to="/perfil"
                      className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                      onClick={toggleMenu}
                    >
                      Mi Perfil
                    </Link>
                    {user?.tipoUsuario === 'profesor' && (
                      <Link
                        to="/mis-clases"
                        className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                        onClick={toggleMenu}
                      >
                        Mis Clases
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center mt-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-secondary-50"
                      onClick={toggleMenu}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="block px-3 py-2 mt-2 btn-primary text-center"
                      onClick={toggleMenu}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Categorías */}
      <CategoriesModal 
        isOpen={showCategoriesModal} 
        onClose={() => setShowCategoriesModal(false)} 
      />
    </header>
  )
}

export default Header