import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import BuscarClases from './pages/BuscarClases'
import BuscarServicios from './pages/BuscarServicios'
import ComoFunciona from './pages/ComoFunciona'
import SerProfesor from './pages/SerProfesor'
import Perfil from './pages/Perfil'
import MisClases from './pages/MisClases'
import CrearServicio from './pages/CrearServicio'
import OnboardingPage from './pages/OnboardingPage'
import ProfesorDisponibilidad from './pages/Professor/ProfesorDisponibilidad'
import PerfilProfesor from './pages/PerfilProfesor'
import ReservarClase from './pages/ReservarClase'
import DetalleClase from './pages/DetalleClase'
import './App.css'

function AppWithAuth() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
                          {/* Rutas independientes (sin Layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
              
                          {/* Rutas con Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="buscar" element={<BuscarClases />} />
              <Route path="servicios" element={<BuscarServicios />} />
              <Route path="como-funciona" element={<ComoFunciona />} />
              <Route path="ser-profesor" element={<SerProfesor />} />
              <Route path="profesor/disponibilidad" element={<ProfesorDisponibilidad />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="mis-clases" element={<MisClases />} />
              <Route path="crear-servicio" element={<CrearServicio />} />
              <Route path="profesor/:id" element={<PerfilProfesor />} />
              <Route path="reservar/:id" element={<ReservarClase />} />
              <Route path="clase/:id" element={<DetalleClase />} />
            </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppWithAuth
