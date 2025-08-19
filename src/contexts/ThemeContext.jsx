import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Cargar tema desde localStorage al inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('easyclase-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Aplicar tema al HTML
  useEffect(() => {
    const root = window.document.documentElement
    
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Guardar preferencia
    localStorage.setItem('easyclase-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Escuchar cambios del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Solo cambiar si no hay preferencia guardada
      const savedTheme = localStorage.getItem('easyclase-theme')
      if (!savedTheme) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark')
  }

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
