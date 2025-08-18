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
  
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()

  // Inicializar Socket.io (simplificado)
  useEffect(() => {
    try {
      const newSocket = io('http://localhost:3000', {
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
        setChatMessages(prev => [...prev, message])
      })

      return () => {
        newSocket.disconnect()
      }
    } catch (err) {
      console.error('Error conectando socket:', err)
      setError('Error de conexión al servidor')
    }
  }, [roomId, userId, userType])

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
  const startCall = useCallback(async () => {
    await initializeLocalStream()
  }, [initializeLocalStream])

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