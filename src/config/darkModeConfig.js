// Configuración para el modo oscuro
export const darkModeMappings = {
  // Mapeos de clases que necesitan modo oscuro
  bgWhite: {
    from: 'bg-white',
    to: 'bg-white dark:bg-gray-800'
  },
  bgGray50: {
    from: 'bg-gray-50',
    to: 'bg-gray-50 dark:bg-gray-900'
  },
  borderGray200: {
    from: 'border-gray-200',
    to: 'border-gray-200 dark:border-gray-600'
  },
  borderSecondary200: {
    from: 'border-secondary-200',
    to: 'border-secondary-200 dark:border-gray-600'
  },
  textSecondary900: {
    from: 'text-secondary-900',
    to: 'text-secondary-900 dark:text-gray-100'
  },
  textSecondary700: {
    from: 'text-secondary-700',
    to: 'text-secondary-700 dark:text-gray-300'
  },
  textSecondary600: {
    from: 'text-secondary-600',
    to: 'text-secondary-600 dark:text-gray-400'
  },
  inputBorder: {
    from: 'border-secondary-300',
    to: 'border-secondary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
  },
  hoverSecondary50: {
    from: 'hover:bg-secondary-50',
    to: 'hover:bg-secondary-50 dark:hover:bg-gray-700'
  },
  hoverGray50: {
    from: 'hover:bg-gray-50',
    to: 'hover:bg-gray-50 dark:hover:bg-gray-700'
  }
}

// Función para aplicar todas las transformaciones de modo oscuro
export const applyDarkModeTransformations = (className) => {
  let result = className
  
  Object.values(darkModeMappings).forEach(mapping => {
    result = result.replace(new RegExp(`\\b${mapping.from}\\b`, 'g'), mapping.to)
  })
  
  return result
}

// Clases comunes que ya incluyen modo oscuro
export const darkModeClasses = {
  card: 'bg-white dark:bg-gray-800 border border-secondary-200 dark:border-gray-600',
  input: 'border-secondary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
  text: 'text-secondary-900 dark:text-gray-100',
  textMuted: 'text-secondary-600 dark:text-gray-400',
  textSecondary: 'text-secondary-700 dark:text-gray-300',
  background: 'bg-gray-50 dark:bg-gray-900',
  header: 'bg-white/95 dark:bg-gray-900/95',
  dropdown: 'bg-white dark:bg-gray-800 border border-secondary-200 dark:border-gray-600'
}
