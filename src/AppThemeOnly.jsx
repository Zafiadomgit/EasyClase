import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContextSimple'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import RegisterSimple from './pages/Auth/RegisterSimple'
import './App.css'

function AppThemeOnly() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen transition-colors duration-300" style={{backgroundColor: 'rgb(var(--color-background))'}}>
          <Routes>
            {/* Rutas independientes (sin Layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterSimple />} />
            
            {/* Rutas públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppThemeOnly
