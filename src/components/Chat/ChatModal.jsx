import React, { useState, useEffect, useRef } from 'react'
import { X, Send, User, MessageCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const ChatModal = ({ isOpen, onClose, profesor, onSendMessage }) => {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: user.id,
      senderName: user.nombre,
      timestamp: new Date().toISOString(),
      isStudent: true
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    try {
      setLoading(true)
      // Aquí se enviaría el mensaje a la API
      if (onSendMessage) {
        await onSendMessage(newMessage)
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">
                Chat con {profesor?.nombre}
              </h3>
              <p className="text-sm text-secondary-600">
                {profesor?.especialidad}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">
                Inicia una conversación con {profesor?.nombre}
              </p>
              <p className="text-sm text-secondary-500 mt-1">
                Pregunta sobre su disponibilidad, experiencia o cualquier duda
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isStudent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.isStudent
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-900'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-secondary-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatModal
