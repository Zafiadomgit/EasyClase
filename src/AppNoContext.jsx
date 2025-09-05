import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LayoutSimple from './components/Layout/LayoutSimple'
import Home from './pages/Home'
import LoginSimple from './pages/Auth/LoginSimple'
import RegisterSimple from './pages/Auth/RegisterSimple'
import './App.css'

function AppNoContext() {
  return (
    <Router>
      <Routes>
        {/* Rutas independientes (sin Layout) */}
        <Route path="/login" element={<LoginSimple />} />
        <Route path="/registro" element={<RegisterSimple />} />
        
        {/* Rutas con Layout */}
        <Route path="/" element={<LayoutSimple />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppNoContext
