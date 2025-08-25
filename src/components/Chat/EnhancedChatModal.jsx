import React, { useState, useEffect, useRef } from 'react'
import { X, Send, User, MessageCircle, AlertTriangle, Shield, Phone, Mail } from 'lucide-react'

const EnhancedChatModal = ({ isOpen, onClose, profesor, onSendMessage }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const messagesEndRef = useRef(null)

  // Patrones para detectar información de contacto
  const contactPatterns = {
    phone: /(\+?[0-9]{1,4}[-.\s]?)?[0-9]{7,15}/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    whatsapp: /(whatsapp|wa|w\.a\.|w\.a)\s*:?\s*(\+?[0-9]{1,4}[-.\s]?)?[0-9]{7,15}/gi,
    telegram: /(telegram|tg)\s*:?\s*@?[a-zA-Z0-9_]{5,}/gi,
    instagram: /(instagram|ig)\s*:?\s*@?[a-zA-Z0-9_\.]{3,}/gi
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setMessages([])
      setWarningCount(0)
      setIsBlocked(false)
    }
  }, [isOpen])

  const detectContactInfo = (text) => {
    const detected = []
    
    Object.entries(contactPatterns).forEach(([type, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        detected.push({
          type,
          matches: matches,
          message: getWarningMessage(type)
        })
      }
    })
    
    return detected
  }

  const getWarningMessage = (type) => {
    const warnings = {
      phone: 'No está permitido compartir números de teléfono',
      email: 'No está permitido compartir direcciones de email',
      whatsapp: 'No está permitido compartir información de WhatsApp',
      telegram: 'No está permitido compartir información de Telegram',
      instagram: 'No está permitido compartir información de Instagram'
    }
    return warnings[type] || 'No está permitido compartir información de contacto'
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isBlocked) return

    // Detectar información de contacto
    const detectedContact = detectContactInfo(message)
    
    if (detectedContact.length > 0) {
      const newWarningCount = warningCount + 1
      setWarningCount(newWarningCount)
      
      // Mostrar advertencia
      const warningMessage = {
        id: Date.now(),
        type: 'warning',
        content: `⚠️ ${detectedContact[0].message}. ${newWarningCount >= 3 ? 'Tu cuenta será suspendida si continúas.' : ''}`,
        timestamp: new Date(),
        isSystem: true
      }
      
      setMessages(prev => [...prev, warningMessage])
      
      // Bloquear después de 3 advertencias
      if (newWarningCount >= 3) {
        setIsBlocked(true)
        const blockMessage = {
          id: Date.now() + 1,
          type: 'block',
          content: '🚫 Tu cuenta ha sido suspendida temporalmente por violar las políticas de comunicación. Contacta soporte para más información.',
          timestamp: new Date(),
          isSystem: true
        }
        setMessages(prev => [...prev, blockMessage])
        
        // Notificar al sistema
        if (onSendMessage) {
          onSendMessage({
            type: 'violation',
            violations: detectedContact,
            warningCount: newWarningCount,
            userId: 'current-user-id' // Esto vendría del contexto de autenticación
          })
        }
      }
      
      setMessage('')
      return
    }

    // Mensaje normal
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      sender: 'Tú'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Simular respuesta del profesor
    setIsTyping(true)
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        type: 'professor',
        content: `Hola, gracias por tu mensaje. Para coordinar la clase, por favor usa solo los canales oficiales de la plataforma. ¿En qué fecha te gustaría programar la clase?`,
        timestamp: new Date(),
        sender: profesor?.nombre || 'Profesor'
      }
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 2000)

    // Enviar mensaje real
    if (onSendMessage) {
      onSendMessage({
        type: 'message',
        content: message,
        timestamp: new Date()
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Chat con {profesor?.nombre}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comunicación segura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Advertencia de seguridad */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">
              Por tu seguridad, no compartas información de contacto personal
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Usa solo los canales oficiales de la plataforma
          </p>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Inicia una conversación con {profesor?.nombre}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : msg.type === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                      : msg.type === 'block'
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {msg.type === 'warning' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">ADVERTENCIA</span>
                    </div>
                  )}
                  {msg.type === 'block' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <X className="w-4 h-4" />
                      <span className="text-xs font-medium">CUENTA SUSPENDIDA</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isBlocked ? "Tu cuenta está suspendida" : "Escribe tu mensaje..."}
              disabled={isBlocked}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isBlocked}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Contador de advertencias */}
          {warningCount > 0 && (
            <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              Advertencias: {warningCount}/3
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedChatModal
