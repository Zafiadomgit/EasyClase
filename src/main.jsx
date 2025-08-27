import React from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import App from './App.jsx'
import './index.css'

// Configurar Sentry para monitoreo de errores
Sentry.init({
  dsn: "https://6cbb0fd348b1fe1515e7dcaf28226dc1@o4509872351477760.ingest.us.sentry.io/4509872366092288",
  
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
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% en prod, 100% en dev
  
  // Session replay
  replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0, // Siempre grabar cuando hay errores
  
  // Filtros de errores
  beforeSend(event) {
    // Filtrar errores de desarrollo
    if (import.meta.env.DEV && event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('Development')) {
        return null; // No enviar errores de desarrollo
      }
    }
    return event;
  },
})

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)