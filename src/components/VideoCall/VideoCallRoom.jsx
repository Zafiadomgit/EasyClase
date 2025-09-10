import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  MessageCircle,
  X,
  Send,
  Maximize2,
  Users,
  Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import useVideoCall from '../../hooks/useVideoCall'
import AnnotationCanvas from './AnnotationCanvas'
import VideoCallAuthService from '../../services/videoCallAuth'

const VideoCallRoom = () => {
  const { id: claseId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { clase, duracion, fechaInicio, fechaFin } = location.state || {}
  const { user } = useAuth()
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [accessValidated, setAccessValidated] = useState(false)
  const [accessError, setAccessError] = useState(null)

  const {
    localStream,
    remoteStream,
    isConnected,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    screenSharePermission,
    isCallActive,
    error,
    chatMessages,
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    requestScreenShare,
    stopScreenShare,
    sendChatMessage
  } = useVideoCall(claseId, user?.id, user?.tipoUsuario, duracion)

  // Validar acceso al montar el componente
  useEffect(() => {
    if (!user || !claseId) {
      setAccessError('Usuario no autenticado o ID de clase inválido')
      return
    }
    
    // Verificar si el usuario puede acceder a esta videollamada
    const accessCheck = VideoCallAuthService.canAccessVideoCall(claseId, user.id, user.tipoUsuario)
    
    if (!accessCheck.canAccess) {
      setAccessError('No tienes permisos para acceder a esta videollamada')
      return
    }
    
    // Verificar si es el momento correcto para unirse
    const timeCheck = VideoCallAuthService.canJoinNow(accessCheck.clase)
    
    if (!timeCheck.canJoin) {
      setAccessError(timeCheck.reason)
      return
    }
    
    setAccessValidated(true)
  }, [user, claseId])
  
  useEffect(() => {
    if (accessValidated) {
      // Auto-iniciar la llamada cuando se valida el acceso
      startCall()
      
      return () => {
        endCall()
      }
    }
  }, [accessValidated])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendChatMessage(chatMessage)
      setChatMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const canUseAnnotations = user?.premium || user?.tipoUsuario === 'admin'

  // Mostrar error de acceso si no se puede acceder
  if (accessError) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
          <div className="text-red-500 mb-4">
            <PhoneOff className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-gray-600 mb-6">{accessError}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras se valida el acceso
  if (!accessValidated) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Validando Acceso</h3>
          <p className="text-gray-600">Verificando permisos para la videollamada...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <PhoneOff className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error en la Videollamada</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-white font-semibold">Clase Virtual</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-300 text-sm">
              {isConnected ? 'Conectado' : 'Conectando...'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{isConnected ? '2' : '1'} participantes</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700"
            title="Pantalla completa"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 relative"
            title="Chat"
          >
            <MessageCircle className="w-5 h-5" />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700"
            title="Salir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Video Principal */}
        <div className="flex-1 relative bg-black">
          {/* Video Remoto (Principal) */}
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Users className="w-24 h-24 mx-auto mb-4" />
                <p className="text-xl">Esperando al otro participante...</p>
              </div>
            </div>
          )}

          {/* Video Local (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
            {localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Video className="w-8 h-8" />
              </div>
            )}
            
            {/* Overlay para video local */}
            <div className="absolute bottom-2 left-2 flex items-center space-x-1">
              <span className="text-white text-sm font-medium">Tú</span>
              {!isVideoEnabled && (
                <VideoOff className="w-4 h-4 text-red-400" />
              )}
              {!isAudioEnabled && (
                <MicOff className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>

          {/* Canvas de Anotaciones (Premium) */}
          {showAnnotations && canUseAnnotations && isScreenSharing && (
            <AnnotationCanvas
              className="absolute inset-0 pointer-events-auto"
              onClose={() => setShowAnnotations(false)}
            />
          )}

          {/* Indicador de Compartir Pantalla */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span className="text-sm">Compartiendo Pantalla</span>
            </div>
          )}

          {/* Botón de Anotaciones Premium */}
          {canUseAnnotations && isScreenSharing && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className="absolute top-20 left-4 bg-amber-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-700"
              title="Anotaciones Colaborativas (Premium)"
            >
              <span className="text-sm">✏️ Anotar</span>
              {user?.premium && <span className="text-xs bg-amber-800 px-1 rounded">PREMIUM</span>}
            </button>
          )}
        </div>

        {/* Panel de Chat */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col">
            {/* Header del Chat */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Chat de la Clase</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.userId === user?.id ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.userId === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {msg.userType === 'profesor' ? '👨‍🏫' : '👩‍🎓'} 
                      {msg.userId === user?.id ? 'Tú' : (msg.userType === 'profesor' ? 'Profesor' : 'Estudiante')}
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Chat */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Control de Video */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoEnabled 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title={isVideoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Control de Audio */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioEnabled 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title={isAudioEnabled ? 'Silenciar' : 'Activar micrófono'}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Compartir Pantalla */}
          <button
            onClick={isScreenSharing ? stopScreenShare : requestScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Parar compartir pantalla' : 'Compartir pantalla'}
          >
            {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </button>

          {/* Terminar Llamada */}
          <button
            onClick={() => {
              endCall()
              navigate('/dashboard')
            }}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
            title="Terminar llamada"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Status Info */}
        <div className="text-center mt-3 text-gray-400 text-sm">
          {!isConnected && 'Estableciendo conexión...'}
          {isConnected && !isCallActive && 'Conexión establecida'}
          {isCallActive && (
            <div className="flex items-center justify-center space-x-4">
              <span>Llamada activa</span>
              {isScreenSharing && (
                <span className="text-blue-400">📺 Pantalla compartida</span>
              )}
              {canUseAnnotations && isScreenSharing && (
                <span className="text-amber-400">✏️ Anotaciones disponibles</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCallRoom
