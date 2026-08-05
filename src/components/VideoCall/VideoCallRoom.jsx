import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

// Sala de clase en vivo sobre Jitsi Meet.
//
// La implementación anterior dependía de simple-peer (comentado con un TODO) y
// de un servidor socket.io que no existe y que además Vercel no puede alojar,
// porque sus funciones no mantienen conexiones abiertas. Jitsi aporta el
// servidor de señalización, los TURN y toda la interfaz (audio, video,
// compartir pantalla, chat), sin coste ni infraestructura propia.
//
// Quién puede entrar lo decide el backend: /api/clases/:id/videollamada valida
// que el usuario sea el alumno o el profesor de esa clase, que esté pagada y
// que estemos dentro del horario, y solo entonces entrega el nombre de la sala,
// que es impredecible.
const JITSI_SCRIPT_ID = 'jitsi-external-api'

const cargarJitsi = (dominio) => new Promise((resolve, reject) => {
  if (window.JitsiMeetExternalAPI) return resolve()
  const existente = document.getElementById(JITSI_SCRIPT_ID)
  if (existente) {
    existente.addEventListener('load', () => resolve())
    existente.addEventListener('error', () => reject(new Error('No se pudo cargar la videollamada')))
    return
  }
  const script = document.createElement('script')
  script.id = JITSI_SCRIPT_ID
  script.src = `https://${dominio}/external_api.js`
  script.async = true
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('No se pudo cargar la videollamada'))
  document.body.appendChild(script)
})

const VideoCallRoom = ({ claseId: claseIdProp, onLeave }) => {
  const { id: claseIdRuta } = useParams()
  const navigate = useNavigate()
  const claseId = claseIdProp || claseIdRuta

  const [estado, setEstado] = useState('cargando') // cargando | error | en-llamada
  const [mensaje, setMensaje] = useState('')
  const contenedorRef = useRef(null)
  const apiRef = useRef(null)

  useEffect(() => {
    let cancelado = false
    let temporizadorFin = null

    const salir = () => {
      if (onLeave) onLeave()
      else navigate('/mis-clases')
    }

    const iniciar = async () => {
      try {
        const respuesta = await fetch(`/api/clases/${claseId}/videollamada`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        })
        const datos = await respuesta.json()

        if (!respuesta.ok || !datos.success) {
          if (cancelado) return
          setMensaje(datos.message || 'No se pudo abrir la videollamada')
          setEstado('error')
          return
        }

        const { sala, dominio, nombreUsuario, titulo, terminaEn } = datos.data
        await cargarJitsi(dominio)
        if (cancelado || !contenedorRef.current) return

        const api = new window.JitsiMeetExternalAPI(dominio, {
          roomName: sala,
          parentNode: contenedorRef.current,
          userInfo: { displayName: nombreUsuario },
          configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            startWithAudioMuted: false,
            startWithVideoMuted: false
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            MOBILE_APP_PROMO: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat', 'raisehand',
              'tileview', 'fullscreen', 'settings', 'hangup'
            ]
          }
        })

        apiRef.current = api
        api.executeCommand('subject', titulo || 'Clase EasyClase')
        api.addEventListener('readyToClose', salir)

        // La sala se cierra sola cuando termina el horario de la clase.
        if (Number(terminaEn) > 0) {
          temporizadorFin = setTimeout(() => {
            try { api.executeCommand('hangup') } catch { /* ya cerrada */ }
            salir()
          }, Number(terminaEn))
        }

        if (!cancelado) setEstado('en-llamada')
      } catch (error) {
        console.error('Error iniciando la videollamada:', error)
        if (cancelado) return
        setMensaje(error.message || 'No se pudo iniciar la videollamada')
        setEstado('error')
      }
    }

    if (claseId) iniciar()

    return () => {
      cancelado = true
      if (temporizadorFin) clearTimeout(temporizadorFin)
      if (apiRef.current) {
        try { apiRef.current.dispose() } catch { /* ya liberada */ }
        apiRef.current = null
      }
    }
  }, [claseId])

  const salirManual = () => {
    if (onLeave) onLeave()
    else navigate('/mis-clases')
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {estado !== 'en-llamada' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            {estado === 'cargando' ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-200">Conectando con la clase...</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-gray-100 text-lg mb-6">{mensaje}</p>
                <button
                  onClick={salirManual}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a mis clases
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Jitsi se monta aquí y ocupa toda la pantalla al conectar. */}
      <div
        ref={contenedorRef}
        className={estado === 'en-llamada' ? 'flex-1' : 'hidden'}
      />
    </div>
  )
}

export default VideoCallRoom
