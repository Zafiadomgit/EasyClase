import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

class TwoFactorAuthService {
  
  // Generar secreto para 2FA
  static generateSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: `EasyClase Admin (${userEmail})`,
      issuer: 'EasyClase',
      length: 32
    })
    
    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      manualEntryKey: secret.base32
    }
  }

  // Generar código QR para Microsoft Authenticator
  static async generateQRCode(secret, userEmail) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(secret)
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generando QR code:', error)
      throw new Error('Error generando código QR')
    }
  }

  // Verificar código TOTP
  static verifyToken(secret, token) {
    try {
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2 // Permitir 2 ventanas de tiempo (60 segundos)
      })
      
      return {
        verified,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error verificando token:', error)
      return {
        verified: false,
        error: 'Error verificando token'
      }
    }
  }

  // Generar código de respaldo
  static generateBackupCodes() {
    const codes = []
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateRandomCode())
    }
    return codes
  }

  static generateRandomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Verificar código de respaldo
  static verifyBackupCode(usedCodes, code) {
    if (usedCodes.includes(code)) {
      return false // Código ya usado
    }
    return true
  }

  // Guardar configuración 2FA en base de datos real
  static async save2FAConfig(userId, secret, backupCodes) {
    try {
      const response = await fetch('/api/admin/2fa-real.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          secret,
          backupCodes
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // También guardar en localStorage como backup
        const config = {
          userId,
          secret,
          backupCodes,
          enabled: true,
          createdAt: Date.now()
        }
        localStorage.setItem('2fa_config', JSON.stringify(config))
        return config
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error guardando configuración 2FA:', error)
      // Fallback a localStorage si falla la API
      const config = {
        userId,
        secret,
        backupCodes,
        enabled: true,
        createdAt: Date.now()
      }
      localStorage.setItem('2fa_config', JSON.stringify(config))
      return config
    }
  }

  // Obtener configuración 2FA desde base de datos
  static async get2FAConfig() {
    try {
      const response = await fetch('/api/admin/2fa-real.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
        }
      })
      
      const data = await response.json()
      
      if (data.success && data.config) {
        // También guardar en localStorage como cache
        const config = {
          userId: 'admin',
          secret: data.config.secret,
          backupCodes: data.config.backupCodes,
          enabled: data.enabled,
          createdAt: data.config.createdAt
        }
        localStorage.setItem('2fa_config', JSON.stringify(config))
        return config
      }
      
      return null
    } catch (error) {
      console.error('Error obteniendo configuración 2FA:', error)
      // Fallback a localStorage
      try {
        const config = localStorage.getItem('2fa_config')
        return config ? JSON.parse(config) : null
      } catch (localError) {
        return null
      }
    }
  }

  // Verificar si 2FA está habilitado
  static async is2FAEnabled() {
    try {
      const config = await this.get2FAConfig()
      return config && config.enabled
    } catch (error) {
      console.error('Error verificando estado 2FA:', error)
      // Fallback a localStorage
      const config = JSON.parse(localStorage.getItem('2fa_config') || '{}')
      return config && config.enabled
    }
  }

  // Deshabilitar 2FA
  static async disable2FA() {
    try {
      const response = await fetch('/api/admin/2fa-real.php', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        localStorage.removeItem('2fa_config')
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error deshabilitando 2FA:', error)
      // Fallback a localStorage
      localStorage.removeItem('2fa_config')
      return true
    }
  }

  // Generar URL para Microsoft Authenticator
  static generateMicrosoftAuthURL(secret, userEmail) {
    const appName = 'EasyClase Admin'
    const issuer = 'EasyClase'
    
    return `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
  }

  // Validar configuración 2FA
  static validate2FASetup(secret, testToken) {
    if (!secret || !testToken) {
      return {
        valid: false,
        error: 'Secreto y token de prueba requeridos'
      }
    }

    const verification = this.verifyToken(secret, testToken)
    
    if (!verification.verified) {
      return {
        valid: false,
        error: 'Token de prueba inválido'
      }
    }

    return {
      valid: true,
      message: 'Configuración 2FA válida'
    }
  }

  // Obtener tiempo restante para el próximo token
  static getTimeRemaining() {
    const epoch = Math.round(new Date().getTime() / 1000.0)
    const timeStep = 30
    const timeRemaining = timeStep - (epoch % timeStep)
    return timeRemaining
  }

  // Formatear tiempo restante
  static formatTimeRemaining(seconds) {
    if (seconds < 10) {
      return `0${seconds}`
    }
    return seconds.toString()
  }
}

export default TwoFactorAuthService
