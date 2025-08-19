import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import BuscarClases from './pages/BuscarClases'
import PerfilProfesor from './pages/PerfilProfesor'
import Dashboard from './pages/Dashboard/Dashboard'
import SerProfesor from './pages/SerProfesor'
import ReservarClase from './pages/ReservarClase'
import BuscarServicios from './pages/BuscarServicios'
import OnboardingPage from './pages/OnboardingPage'
import Pago from './pages/Pago'
import ComoFunciona from './pages/ComoFunciona'
import Terminos from './pages/Legal/Terminos'
import Privacidad from './pages/Legal/Privacidad'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsuarios from './pages/Admin/AdminUsuarios'
import AdminClases from './pages/Admin/AdminClases'
import AdminPagos from './pages/Admin/AdminPagos'
import AdminDisputas from './pages/Admin/AdminDisputas'
import AdminReportes from './pages/Admin/AdminReportes'
import AdminContenido from './pages/Admin/AdminContenido'
import AdminSistema from './pages/Admin/AdminSistema'
import ProfesorDisponibilidad from './pages/Professor/ProfesorDisponibilidad'
import Premium from './pages/Premium'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            {/* Rutas independientes (sin Layout) */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/buscar" element={<BuscarClases />} />
              <Route path="/servicios" element={<BuscarServicios />} />
              <Route path="/profesor/:id" element={<PerfilProfesor />} />
              <Route path="/ser-profesor" element={<SerProfesor />} />
              <Route path="/reservar/:id" element={<ReservarClase />} />
              <Route path="/pago" element={<Pago />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/premium" 
                element={
                  <ProtectedRoute>
                    <Premium />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profesor/disponibilidad" 
                element={
                  <ProtectedRoute>
                    <ProfesorDisponibilidad />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* Rutas de Administración */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              } 
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsuarios />} />
              <Route path="classes" element={<AdminClases />} />
              <Route path="payments" element={<AdminPagos />} />
              <Route path="disputes" element={<AdminDisputas />} />
              <Route path="reports" element={<AdminReportes />} />
              <Route path="content" element={<AdminContenido />} />
              <Route path="system" element={<AdminSistema />} />
            </Route>
            
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App