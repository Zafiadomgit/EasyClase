import { useState, useEffect, useRef, useCallback } from 'react'
// TODO: Configurar simple-peer correctamente para Vite en versión futura
// import Peer from 'simple-peer'
import io from 'socket.io-client'

const useVideoCall = (roomId, userId, userType) => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenSharePermission, setScreenSharePermission] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [error, setError] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [classEndTime, setClassEndTime] = useState(null)
  
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()

  // Inicializar Socket.io (simplificado)
  useEffect(() => {
    try {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
      const newSocket = io(socketUrl, {
        transports: ['websocket']
      })
      
      setSocket(newSocket)
      
      newSocket.on('connect', () => {
        console.log('Socket conectado:', newSocket.id)
        newSocket.emit('join-room', { roomId, userId, userType })
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on('chat-message', (message) => {
        // Validar mensaje antes de mostrarlo
        const validation = validateChatMessage(message.message)
        if (validation.isValid) {
          setChatMessages(prev => [...prev, message])
        } else {
          // Notificar al usuario que el mensaje fue bloqueado
          console.warn('Mensaje bloqueado por seguridad:', validation.error)
        }
      })

      return () => {
        newSocket.disconnect()
      }
    } catch (err) {
      console.error('Error conectando socket:', err)
      setError('Error de conexión al servidor')
    }
  }, [roomId, userId, userType])

  // Validar mensajes del chat para evitar información personal
  const validateChatMessage = (text) => {
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

  // Inicializar cámara local
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      setIsCallActive(true)
    } catch (err) {
      console.error('Error accediendo a cámara:', err)
      setError('No se pudo acceder a la cámara y micrófono')
      
      // Intentar solo audio
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
        setLocalStream(audioStream)
        setIsCallActive(true)
      } catch (audioErr) {
        console.error('Error accediendo a audio:', audioErr)
      }
    }
  }, [])

  // Funciones de control simplificadas
  const startCall = useCallback(async (classDuration = 1) => {
    // Validar que estemos en el horario permitido (10 min antes hasta la duración real de la clase)
    const now = new Date()
    const classTime = new Date() // Aquí deberías obtener el tiempo real de la clase
    const tenMinutesBefore = new Date(classTime.getTime() - 10 * 60 * 1000)
    
    // Calcular el tiempo de finalización basado en la duración real de la clase
    const classDurationInHours = parseFloat(classDuration) || 1
    const classEndTime = new Date(classTime.getTime() + (classDurationInHours * 60 * 60 * 1000))
    
    if (now < tenMinutesBefore) {
      setError('La videollamada no está disponible aún. Estará disponible 10 minutos antes de la clase.')
      return
    }
    
    if (now > classEndTime) {
      setError('La clase ya ha terminado. La videollamada se cierra automáticamente al finalizar la clase.')
      return
    }
    
    // Calcular tiempo de cierre automático
    const timeUntilClose = classEndTime.getTime() - now.getTime()
    setClassEndTime(classEndTime)
    
    // Programar cierre automático
    setTimeout(() => {
      endCall()
      setError('La videollamada se ha cerrado automáticamente al finalizar la clase.')
    }, timeUntilClose)
    
    await initializeLocalStream()
  }, [initializeLocalStream, endCall])

  const endCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    
    setIsCallActive(false)
    setIsScreenSharing(false)
    
    if (socket) {
      socket.emit('end-call', { roomId })
    }
  }, [localStream, socket, roomId])

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }, [localStream])

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }, [localStream])

  const requestScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
      
      // En una implementación completa, esto se compartiría vía WebRTC
      setIsScreenSharing(true)
      
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false)
      }
      
    } catch (err) {
      console.error('Error compartiendo pantalla:', err)
      setError('No se pudo compartir la pantalla')
    }
  }, [])

  const stopScreenShare = useCallback(() => {
    setIsScreenSharing(false)
  }, [])

  const sendChatMessage = useCallback((message) => {
    if (socket && message.trim()) {
      // Validar mensaje antes de enviarlo
      const validation = validateChatMessage(message.trim())
      if (!validation.isValid) {
        setError(validation.error)
        return
      }
      
      const chatMsg = {
        id: Date.now(),
        text: message,
        sender: userId,
        senderType: userType,
        timestamp: new Date().toISOString()
      }
      
      socket.emit('chat-message', { roomId, message: chatMsg })
      setChatMessages(prev => [...prev, chatMsg])
    }
  }, [socket, roomId, userId, userType])

  return {
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
  }
}

export default useVideoCall