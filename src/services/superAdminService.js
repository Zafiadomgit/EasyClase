// Servicio para funciones de Super Administrador
class SuperAdminService {
  
  // Gestión de usuarios
  static async getAllUsers() {
    try {
      const response = await fetch('/api/admin/users/all')
      const data = await response.json()
      return data.users || []
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      return []
    }
  }

  static async createUser(userData) {
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creando usuario:', error)
      return { success: false, message: 'Error al crear usuario' }
    }
  }

  static async updateUser(userId, userData) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      return { success: false, message: 'Error al actualizar usuario' }
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      return { success: false, message: 'Error al eliminar usuario' }
    }
  }

  static async bulkActionUsers(userIds, action) {
    try {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds, action })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error ejecutando acción masiva:', error)
      return { success: false, message: 'Error ejecutando acción masiva' }
    }
  }

  // Gestión de clases
  static async getAllClasses() {
    try {
      const response = await fetch('/api/admin/classes/all')
      const data = await response.json()
      return data.classes || []
    } catch (error) {
      console.error('Error obteniendo clases:', error)
      return []
    }
  }

  static async cancelClass(classId, reason) {
    try {
      const response = await fetch(`/api/admin/classes/${classId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cancelando clase:', error)
      return { success: false, message: 'Error al cancelar clase' }
    }
  }

  static async refundClass(classId, amount) {
    try {
      const response = await fetch(`/api/admin/classes/${classId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error reembolsando clase:', error)
      return { success: false, message: 'Error al reembolsar clase' }
    }
  }

  // Gestión de pagos
  static async getAllPayments() {
    try {
      const response = await fetch('/api/admin/payments/all')
      const data = await response.json()
      return data.payments || []
    } catch (error) {
      console.error('Error obteniendo pagos:', error)
      return []
    }
  }

  static async processPayment(paymentId) {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/process`, {
        method: 'POST'
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error procesando pago:', error)
      return { success: false, message: 'Error al procesar pago' }
    }
  }

  static async refundPayment(paymentId, amount) {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error reembolsando pago:', error)
      return { success: false, message: 'Error al reembolsar pago' }
    }
  }

  // Gestión de sistema
  static async getSystemStats() {
    try {
      const response = await fetch('/api/admin/system/stats')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {}
    }
  }

  static async updateSystemSettings(settings) {
    try {
      const response = await fetch('/api/admin/system/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error actualizando configuración:', error)
      return { success: false, message: 'Error al actualizar configuración' }
    }
  }

  static async toggleMaintenanceMode() {
    try {
      const response = await fetch('/api/admin/system/maintenance', {
        method: 'POST'
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cambiando modo mantenimiento:', error)
      return { success: false, message: 'Error al cambiar modo mantenimiento' }
    }
  }

  // Gestión de reportes
  static async generateReport(type, dateRange) {
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, dateRange })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error generando reporte:', error)
      return { success: false, message: 'Error al generar reporte' }
    }
  }

  static async exportData(type, format = 'csv') {
    try {
      const response = await fetch(`/api/admin/export/${type}?format=${format}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      return { success: true }
    } catch (error) {
      console.error('Error exportando datos:', error)
      return { success: false, message: 'Error al exportar datos' }
    }
  }

  // Gestión de notificaciones
  static async sendNotification(notification) {
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error enviando notificación:', error)
      return { success: false, message: 'Error al enviar notificación' }
    }
  }

  static async broadcastMessage(message) {
    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error enviando mensaje masivo:', error)
      return { success: false, message: 'Error al enviar mensaje masivo' }
    }
  }

  // Gestión de seguridad
  static async getSecurityLogs() {
    try {
      const response = await fetch('/api/admin/security/logs')
      const data = await response.json()
      return data.logs || []
    } catch (error) {
      console.error('Error obteniendo logs de seguridad:', error)
      return []
    }
  }

  static async blockUser(userId, reason) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error bloqueando usuario:', error)
      return { success: false, message: 'Error al bloquear usuario' }
    }
  }

  static async unblockUser(userId) {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unblock`, {
        method: 'POST'
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error desbloqueando usuario:', error)
      return { success: false, message: 'Error al desbloquear usuario' }
    }
  }
}

export default SuperAdminService
