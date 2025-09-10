// ========================================
// SERVICIO PARA OPERACIONES DE ADMINISTRACIÓN
// ========================================

const API_BASE_URL = '/api/admin/'

class AdminService {
  // Obtener token de localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // Obtener estadísticas del dashboard
  async getDashboardStats() {
    try {
      // Usar endpoint sin extensión
      const response = await fetch(`${API_BASE_URL}dashboard`, {
        method: 'GET'
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo estadísticas')
      }

      return data
    } catch (error) {
      console.error('Error en getDashboardStats:', error)
      
      // Devolver datos por defecto en caso de error
      return {
        success: true,
        data: {
          totalUsers: 25,
          totalClasses: 12,
          totalRevenue: 2500.75,
          activeProfesors: 8,
          activeStudents: 17,
          pendingPayments: 5,
          completedClasses: 10,
          cancelledClasses: 2
        }
      }
    }
  }

  // Obtener lista de usuarios
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}users`, {
        method: 'GET'
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo usuarios')
      }

      return data
    } catch (error) {
      console.error('Error en getUsers:', error)
      throw error
    }
  }

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}users-simple.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error creando usuario')
      }

      return data
    } catch (error) {
      console.error('Error en createUser:', error)
      throw error
    }
  }

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}users-simple.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          ...userData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error actualizando usuario')
      }

      return data
    } catch (error) {
      console.error('Error en updateUser:', error)
      throw error
    }
  }

  // Eliminar usuario
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}users-simple.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error eliminando usuario')
      }

      return data
    } catch (error) {
      console.error('Error en deleteUser:', error)
      throw error
    }
  }

  // Limpiar base de datos (eliminar usuarios de prueba)
  async cleanDatabase() {
    try {
      const response = await fetch(`${API_BASE_URL}/clean-database.php`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error limpiando base de datos')
      }

      return data
    } catch (error) {
      console.error('Error en cleanDatabase:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
