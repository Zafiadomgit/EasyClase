import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useRealNotifications } from '../../hooks/useRealNotifications'

const Layout = () => {
  // Hook para notificaciones reales del sistema
  useRealNotifications()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout