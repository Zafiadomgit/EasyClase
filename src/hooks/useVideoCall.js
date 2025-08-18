import { useState, useEffect, useRef, useCallback } from 'react'
import Peer from 'simple-peer'
import io from 'socket.io-client'

const useVideoCall = (roomId, userId, userType) => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [peer, setPeer] = useState(null)
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
  const currentStreamRef = useRef()

  // Inicializar Socket.io
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket']
    })
    
    setSocket(newSocket)
    
    newSocket.on('connect', () => {
      console.log('Socket conectado:', newSocket.id)
      newSocket.emit('join-room', { roomId, userId, userType })
    })

    newSocket.on('user-joined', ({ userId: joinedUserId, userType: joinedUserType }) => {
      console.log('Usuario se unió:', joinedUserId, joinedUserType)
      if (userType === 'profesor') {
        // El profesor inicia la llamada
        initiatePeerConnection(true, newSocket)
      }
    })

    newSocket.on('call-signal', (data) => {
      handleSignal(data)
    })

    newSocket.on('screen-share-request', ({ fromUserId, fromUserType }) => {
      if (userType === 'profesor') {
        // Solo el profesor puede autorizar compartir pantalla
        const allow = window.confirm(`${fromUserType === 'estudiante' ? 'El estudiante' : 'El usuario'} quiere compartir pantalla. ¿Permitir?`)
        newSocket.emit('screen-share-response', { 
          toUserId: fromUserId, 
          allowed: allow,
          roomId 
        })
      }
    })

    newSocket.on('screen-share-response', ({ allowed }) => {
      if (allowed) {
        setScreenSharePermission(true)
        startScreenShare()
      } else {
        alert('El profesor no autorizó compartir pantalla')
      }
    })

    newSocket.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message])
    })

    newSocket.on('call-ended', () => {
      endCall()
    })

    return () => {
      newSocket.disconnect()
    }
  }, [roomId, userId, userType])

  // Obtener stream de cámara
  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      currentStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      return stream
    } catch (err) {
      console.error('Error accediendo a la cámara:', err)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      throw err
    }
  }, [])

  // Inicializar conexión peer
  const initiatePeerConnection = useCallback(async (initiator, socketConnection) => {
    try {
      const stream = await getLocalStream()
      
      const newPeer = new Peer({
        initiator,
        trickle: false,
        stream
      })

      newPeer.on('signal', (data) => {
        socketConnection.emit('call-signal', {
          signal: data,
          roomId,
          userId
        })
      })

      newPeer.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
        setIsConnected(true)
        setIsCallActive(true)
      })

      newPeer.on('error', (err) => {
        console.error('Error en peer:', err)
        setError('Error en la conexión de video')
      })

      setPeer(newPeer)
      
    } catch (err) {
      setError('Error iniciando la videollamada')
    }
  }, [roomId, userId, getLocalStream])

  // Manejar señales de WebRTC
  const handleSignal = useCallback((data) => {
    if (peer) {
      peer.signal(data.signal)
    } else if (userType === 'estudiante') {
      // El estudiante responde a la llamada del profesor
      initiatePeerConnection(false, socket)
      setTimeout(() => {
        if (peer) {
          peer.signal(data.signal)
        }
      }, 1000)
    }
  }, [peer, userType, socket, initiatePeerConnection])

  // Iniciar llamada
  const startCall = useCallback(async () => {
    try {
      await getLocalStream()
      if (userType === 'profesor') {
        socket.emit('start-call', { roomId })
      }
    } catch (err) {
      setError('Error iniciando la llamada')
    }
  }, [getLocalStream, socket, roomId, userType])

  // Terminar llamada
  const endCall = useCallback(() => {
    if (peer) {
      peer.destroy()
      setPeer(null)
    }
    
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    setLocalStream(null)
    setRemoteStream(null)
    setIsConnected(false)
    setIsCallActive(false)
    setIsScreenSharing(false)
    
    if (socket) {
      socket.emit('end-call', { roomId })
    }
  }, [peer, socket, roomId])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (currentStreamRef.current) {
      const videoTrack = currentStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }, [])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (currentStreamRef.current) {
      const audioTrack = currentStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }, [])

  // Solicitar compartir pantalla
  const requestScreenShare = useCallback(() => {
    if (userType === 'profesor') {
      // El profesor puede compartir directamente
      setScreenSharePermission(true)
      startScreenShare()
    } else {
      // El estudiante debe pedir permiso
      socket.emit('screen-share-request', { roomId, userId, userType })
    }
  }, [socket, roomId, userId, userType])

  // Iniciar compartir pantalla
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Reemplazar el stream actual con el de pantalla
      if (peer && currentStreamRef.current) {
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peer._pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )
        
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      }

      currentStreamRef.current = screenStream
      setLocalStream(screenStream)
      setIsScreenSharing(true)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream
      }

      // Escuchar cuando el usuario pare de compartir pantalla
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

    } catch (err) {
      console.error('Error compartiendo pantalla:', err)
      setError('No se pudo compartir la pantalla')
    }
  }, [peer])

  // Parar compartir pantalla
  const stopScreenShare = useCallback(async () => {
    try {
      // Volver a la cámara
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      if (peer && currentStreamRef.current) {
        const videoTrack = cameraStream.getVideoTracks()[0]
        const sender = peer._pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )
        
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      }

      // Detener el stream de pantalla
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach(track => track.stop())
      }

      currentStreamRef.current = cameraStream
      setLocalStream(cameraStream)
      setIsScreenSharing(false)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = cameraStream
      }

    } catch (err) {
      console.error('Error volviendo a la cámara:', err)
    }
  }, [peer])

  // Enviar mensaje de chat
  const sendChatMessage = useCallback((message) => {
    if (socket && message.trim()) {
      const chatMessage = {
        id: Date.now(),
        userId,
        userType,
        message: message.trim(),
        timestamp: new Date().toISOString()
      }
      
      socket.emit('chat-message', { roomId, message: chatMessage })
      setChatMessages(prev => [...prev, chatMessage])
    }
  }, [socket, roomId, userId, userType])

  return {
    // Estado
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
    
    // Referencias
    localVideoRef,
    remoteVideoRef,
    
    // Métodos
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
