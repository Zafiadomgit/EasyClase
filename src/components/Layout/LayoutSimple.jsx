import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderSimple from './HeaderSimple'
import Footer from './Footer'

const LayoutSimple = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <HeaderSimple />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default LayoutSimple
