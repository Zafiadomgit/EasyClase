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
  environment: import.meta.env.MODE, // 'development' o 'production'
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  // Capturar un porcentaje de transacciones para performance monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% en prod, 100% en dev
})

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)