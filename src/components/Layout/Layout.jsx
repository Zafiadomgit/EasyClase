import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useUpcomingClassNotifications } from '../../hooks/useUpcomingClassNotifications'
import { useSystemNotifications } from '../../hooks/useSystemNotifications'
import AuthDebug from '../Debug/AuthDebug'

const Layout = () => {
  // Hook para notificaciones de clases próximas
  useUpcomingClassNotifications()
  
  // Hook para notificaciones del sistema
  useSystemNotifications()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthDebug />
    </div>
  )
}

export default Layout