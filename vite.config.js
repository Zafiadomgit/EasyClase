import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from "@sentry/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Solo usar Sentry plugin en build de producción
    process.env.NODE_ENV === 'production' && sentryVitePlugin({
      org: "easyclase",
      project: "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  ].filter(Boolean),
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': process.env
  }
})