import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  User,
  MoreVertical,
  Phone,
  Video,
  Search
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Chat = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [chatInfo, setChatInfo] = useState(null)

  useEffect(() => {
    // Simular información del chat
    setChatInfo({
      id: 'chat_123',
      participant: {
        name: user?.tipoUsuario === 'profesor' ? 'Estudiante' : 'Profesor',
        avatar: null
      },
      lastSeen: 'Hace 5 minutos'
    })

    // Simular mensajes de ejemplo
    setMessages([
      {
        id: 1,
        sender: 'other',
        text: 'Hola! ¿Cómo va tu progreso con el proyecto?',
        timestamp: '10:30 AM',
        isRead: true
      },
      {
        id: 2,
        sender: 'me',
        text: '¡Hola! Está yendo muy bien, gracias por preguntar. ¿Podrías revisar la última parte que hice?',
        timestamp: '10:32 AM',
        isRead: true
      },
      {
        id: 3,
        sender: 'other',
        text: '¡Por supuesto! Envíame el código y lo reviso esta tarde.',
        timestamp: '10:35 AM',
        isRead: true
      }
    ])
  }, [user])

  const validateMessage = (text) => {
    // Patrones para detectar información personal
    const phonePattern = /(\+?[0-9]{1,4}[\s-]?[0-9]{1,4}[\s-]?[0-9]{1,4}[\s-]?[0-9]{1,4})/g
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    
    if (phonePattern.test(text)) {
      return {
        isValid: false,
        error: 'No se permite compartir números de teléfono por seguridad'
      }
    }
    
    if (emailPattern.test(text)) {
      return {
        isValid: false,
        error: 'No se permite compartir direcciones de email por seguridad'
      }
    }
    
    return { isValid: true }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const validation = validateMessage(newMessage)
      
      if (!validation.isValid) {
        alert(validation.error)
        return
      }
      
      const message = {
        id: Date.now(),
        sender: 'me',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isRead: false
      }
      
      setMessages([...messages, message])
      setNewMessage('')
      
      // Simular respuesta automática después de 2 segundos
      setTimeout(() => {
        const autoReply = {
          id: Date.now() + 1,
          sender: 'other',
          text: 'Mensaje recibido. Te respondo pronto.',
          timestamp: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: false
        }
        setMessages(prev => [...prev, autoReply])
      }, 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!chatInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header del chat */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  {chatInfo.participant.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chatInfo.lastSeen}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'me'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.sender === 'me' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <span>{message.timestamp}</span>
                  {message.sender === 'me' && (
                    <span className="flex items-center">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input de mensaje */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-lg transition-colors ${
                newMessage.trim()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Chat en desarrollo - Esta funcionalidad se implementará próximamente
            </p>
            <p className="text-xs text-red-500 dark:text-red-400">
              ⚠️ Por seguridad, no se permite compartir números de teléfono o emails
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
