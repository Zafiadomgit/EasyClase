import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-12 h-6 rounded-full p-1 transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-primary-600 hover:bg-primary-700' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
    >
      {/* Círculo que se mueve */}
      <div className={`
        w-4 h-4 rounded-full bg-white transition-all duration-300 ease-in-out transform
        flex items-center justify-center shadow-md
        ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-primary-600" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
      
      {/* Ícono de fondo */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <Sun className={`w-3 h-3 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-70'} text-yellow-600`} />
        <Moon className={`w-3 h-3 transition-opacity duration-300 ${isDarkMode ? 'opacity-70' : 'opacity-0'} text-blue-200`} />
      </div>
    </button>
  )
}

export default ThemeToggle
