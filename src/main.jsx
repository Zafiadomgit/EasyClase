import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react"
import App from './App.jsx'
import './index.css'

// Configurar Sentry para monitoreo de errores
Sentry.init({
  dsn: "https://6cbb0fd348b1fe1515e7dcaf28226dc1@o4509872351477760.ingest.us.sentry.io/4509872366092288",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: import.meta.env.MODE, // 'development' o 'production'
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  // Capturar un porcentaje de transacciones para performance monitoring
  tracesSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)