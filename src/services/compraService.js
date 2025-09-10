class CompraService {
  constructor() {
    this.baseURL = '/api/compras-servicios'
  }

  async crearCompra(servicioId) {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ servicioId })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error creando compra')
      }

      return data
    } catch (error) {
      console.error('Error creando compra:', error)
      throw error
    }
  }

  async obtenerMisCompras() {
    try {
      const response = await fetch(`${this.baseURL}/mis-compras`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo compras')
      }

      return data
    } catch (error) {
      console.error('Error obteniendo compras:', error)
      throw error
    }
  }

  async obtenerArchivosServicio(compraId) {
    try {
      const response = await fetch(`${this.baseURL}/${compraId}/archivos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo archivos')
      }

      return data
    } catch (error) {
      console.error('Error obteniendo archivos:', error)
      throw error
    }
  }

  async descargarArchivo(compraId, archivoId, nombreArchivo) {
    try {
      const response = await fetch(`${this.baseURL}/${compraId}/archivos/${archivoId}/descargar`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error descargando archivo')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombreArchivo
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return true
    } catch (error) {
      console.error('Error descargando archivo:', error)
      throw error
    }
  }
}

export const compraService = new CompraService()
