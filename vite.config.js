import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from "@sentry/vite-plugin"
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // 👈 Esto asegura que las rutas de assets sean absolutas
  plugins: [
    react(),
    // Sentry plugin deshabilitado temporalmente
    // process.env.NODE_ENV === 'production' && sentryVitePlugin({
    //   org: "easyclase",
    //   project: "javascript-react",
    //   authToken: process.env.SENTRY_AUTH_TOKEN,
    // })
  ].filter(Boolean),
  server: {
    port: 3001,
    proxy: {
      '/api': {
        // En desarrollo, el servidor Node.js puede estar en 3000 o usar VITE_API_URL
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 1000,
    copyPublicDir: true,
    minify: false
  },
  optimizeDeps: {
    include: ['speakeasy', 'qrcode']
  },
  define: {
    global: 'globalThis'
  },
  publicDir: 'public'
})