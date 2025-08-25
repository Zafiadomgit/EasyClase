// Utilidades para el modo oscuro
export const darkModeClasses = {
  // Fondos
  bg: {
    white: 'bg-white dark:bg-gray-800',
    gray50: 'bg-gray-50 dark:bg-gray-900',
    gray100: 'bg-gray-100 dark:bg-gray-800',
    secondary50: 'bg-secondary-50 dark:bg-gray-700',
  },
  
  // Bordes
  border: {
    gray200: 'border-gray-200 dark:border-gray-600',
    secondary200: 'border-secondary-200 dark:border-gray-600',
    secondary100: 'border-secondary-100 dark:border-gray-600',
  },
  
  // Textos
  text: {
    secondary900: 'text-secondary-900 dark:text-gray-100',
    secondary700: 'text-secondary-700 dark:text-gray-300',
    secondary600: 'text-secondary-600 dark:text-gray-400',
    gray500: 'text-gray-500 dark:text-gray-400',
    gray700: 'text-gray-700 dark:text-gray-300',
  },
  
  // Inputs
  input: 'border-secondary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
  
  // Hover states
  hover: {
    secondary50: 'hover:bg-secondary-50 dark:hover:bg-gray-700',
    gray50: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  }
}

// Función para aplicar clases de modo oscuro a componentes comunes
export const applyDarkMode = (baseClasses, darkClasses) => {
  return `${baseClasses} ${darkClasses}`
}

// Clases predefinidas para componentes comunes
export const commonDarkClasses = {
  card: 'bg-white dark:bg-gray-800 border border-secondary-200 dark:border-gray-600',
  input: 'border-secondary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
  text: 'text-secondary-900 dark:text-gray-100',
  textMuted: 'text-secondary-600 dark:text-gray-400',
  textSecondary: 'text-secondary-700 dark:text-gray-300',
}
