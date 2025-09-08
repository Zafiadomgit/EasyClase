import React from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import App from './App.jsx'
import './index.css'

// 🛡️ IMPLEMENTAR HEADERS DE SEGURIDAD A+ INMEDIATAMENTE
// import './utils/securityHeaders.js'

// Configurar Sentry para monitoreo de errores
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    
    // Environment detection
    environment: import.meta.env.MODE, // 'development' o 'production'
    
    // Release tracking
    release: `easyclase@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    
    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% en prod
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0, // Siempre grabar cuando hay errores
  })
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)