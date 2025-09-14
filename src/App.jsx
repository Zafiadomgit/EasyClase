import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import BuscarClases from './pages/BuscarClasesNuevo'
import PerfilProfesor from './pages/PerfilProfesor'
import Perfil from './pages/Perfil'
import MisClases from './pages/MisClases'
import Seguridad from './pages/Seguridad'
import Preferencias from './pages/Preferencias'
import Dashboard from './pages/Dashboard/Dashboard'
import SerProfesor from './pages/SerProfesor'
import ReservarClase from './pages/ReservarClase'
import BuscarServicios from './pages/BuscarServicios'
import CrearServicio from './pages/CrearServicio'
import CrearClase from './pages/CrearClase'
import MisServiciosComprados from './pages/Estudiante/MisServiciosComprados'
import MisReservas from './pages/Estudiante/MisReservas'
import PagoExitoso from './pages/PagoExitoso'
import PagoFallido from './pages/PagoFallido'
import PagoPendiente from './pages/PagoPendiente'
import OnboardingProfesor from './pages/Professor/OnboardingProfesor'
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
import SuperAdminPanel from './pages/Admin/SuperAdminPanelSimple'
import ProfesorDisponibilidad from './pages/Professor/ProfesorDisponibilidad'
import Premium from './pages/Premium'
import DetalleClase from './pages/DetalleClase'
import Chat from './pages/Chat'
import VideoCallRoom from './components/VideoCall/VideoCallRoom'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
          <div className="min-h-screen transition-colors duration-300" style={{backgroundColor: 'rgb(var(--color-background))'}}>
          <Routes>
            {/* Rutas independientes (sin Layout) */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas públicas */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/buscar" element={<BuscarClases />} />
              <Route path="/servicios" element={<BuscarServicios />} />
            <Route path="/servicios/crear" element={<CrearServicio />} />
            <Route path="/clases/crear" element={<CrearClase />} />
            <Route path="/mis-servicios-comprados" element={<MisServiciosComprados />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
            <Route path="/pago-pendiente" element={<PagoPendiente />} />
            <Route path="/profesor/onboarding" element={<OnboardingProfesor />} />
              <Route path="/profesor/:id" element={<PerfilProfesor />} />
              <Route path="/ser-profesor" element={<SerProfesor />} />
              <Route path="/reservar/:id" element={<ReservarClase />} />
              <Route path="/pago" element={<Pago />} />
              <Route path="/videollamada/:id" element={<VideoCallRoom />} />
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
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mis-clases" 
                element={
                  <ProtectedRoute>
                    <MisClases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clase/:id" 
                element={
                  <ProtectedRoute>
                    <DetalleClase />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/seguridad"
                element={
                  <ProtectedRoute>
                    <Seguridad />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preferencias"
                element={
                  <ProtectedRoute>
                    <Preferencias />
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
              <Route path="super" element={<SuperAdminPanel />} />
              <Route path="users" element={<AdminUsuarios />} />
              <Route path="classes" element={<AdminClases />} />
              <Route path="payments" element={<AdminPagos />} />
              <Route path="disputes" element={<AdminDisputas />} />
              <Route path="reports" element={<AdminReportes />} />
              <Route path="content" element={<AdminContenido />} />
              <Route path="system" element={<AdminSistema />} />
            </Route>
          </Routes>
                  </div>
        </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App