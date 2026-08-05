import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ProfesorRoute from './components/ProfesorRoute'
import AdminLayout from './components/Admin/AdminLayout'

// Carga diferida por ruta: antes el navegador descargaba la aplicación
// entera (incluido todo el panel de administración) para mostrar la
// portada. Cada pantalla llega ahora en su propio archivo, cuando se visita.
const AdminClases = lazy(() => import('./pages/Admin/AdminClases'))
const AdminContenido = lazy(() => import('./pages/Admin/AdminContenido'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminDisputas = lazy(() => import('./pages/Admin/AdminDisputas'))
const AdminPagos = lazy(() => import('./pages/Admin/AdminPagos'))
const AdminReportes = lazy(() => import('./pages/Admin/AdminReportes'))
const AdminRetiros = lazy(() => import('./pages/Admin/AdminRetiros'))
const AdminSistema = lazy(() => import('./pages/Admin/AdminSistema'))
const AdminUsuarios = lazy(() => import('./pages/Admin/AdminUsuarios'))
const BuscarClases = lazy(() => import('./pages/BuscarClases'))
const BuscarServicios = lazy(() => import('./pages/BuscarServicios'))
const ComoFunciona = lazy(() => import('./pages/ComoFunciona'))
const CrearClase = lazy(() => import('./pages/CrearClase'))
const CrearServicio = lazy(() => import('./pages/CrearServicio'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const DetalleClase = lazy(() => import('./pages/DetalleClase'))
const Login = lazy(() => import('./pages/Auth/Login'))
const MisClases = lazy(() => import('./pages/MisClases'))
const MisReservas = lazy(() => import('./pages/Estudiante/MisReservas'))
const MisServiciosComprados = lazy(() => import('./pages/Estudiante/MisServiciosComprados'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))
const OnboardingProfesor = lazy(() => import('./pages/Professor/OnboardingProfesor'))
const Pago = lazy(() => import('./pages/Pago'))
const PagoExitoso = lazy(() => import('./pages/PagoExitoso'))
const PagoFallido = lazy(() => import('./pages/PagoFallido'))
const PagoPendiente = lazy(() => import('./pages/PagoPendiente'))
const Perfil = lazy(() => import('./pages/Perfil'))
const PerfilProfesor = lazy(() => import('./pages/PerfilProfesor'))
const Preferencias = lazy(() => import('./pages/Preferencias'))
const Premium = lazy(() => import('./pages/Premium'))
const Privacidad = lazy(() => import('./pages/Legal/Privacidad'))
const ProfesorDisponibilidad = lazy(() => import('./pages/Professor/ProfesorDisponibilidad'))
const RecuperarPassword = lazy(() => import('./pages/Auth/RecuperarPassword'))
const RestablecerPassword = lazy(() => import('./pages/Auth/RestablecerPassword'))
const Register = lazy(() => import('./pages/Auth/Register'))
const ReservarClase = lazy(() => import('./pages/ReservarClase'))
const Seguridad = lazy(() => import('./pages/Seguridad'))
const SerProfesor = lazy(() => import('./pages/SerProfesor'))
const SuperAdminPanel = lazy(() => import('./pages/Admin/SuperAdminPanelSimple'))
const Terminos = lazy(() => import('./pages/Legal/Terminos'))
const VideoCallRoom = lazy(() => import('./components/VideoCall/VideoCallRoom'))

import './App.css'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            </div>
            <div className="relative z-10">
              <Suspense fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
              }>
              <Routes>
                {/* Rutas independientes (sin Layout) */}
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recuperar-password" element={<RecuperarPassword />} />
                <Route path="/restablecer-password" element={<RestablecerPassword />} />

                {/* Rutas públicas */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/buscar" element={<BuscarClases />} />
                  <Route path="/servicios" element={<BuscarServicios />} />
                  <Route path="/servicios/crear" element={<ProfesorRoute><CrearServicio /></ProfesorRoute>} />
                  <Route path="/clases/crear" element={<ProfesorRoute><CrearClase /></ProfesorRoute>} />
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
                      <ProfesorRoute>
                        <ProfesorDisponibilidad />
                      </ProfesorRoute>
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
                  <Route path="retiros" element={<AdminRetiros />} />
                  <Route path="disputes" element={<AdminDisputas />} />
                  <Route path="reports" element={<AdminReportes />} />
                  <Route path="content" element={<AdminContenido />} />
                  <Route path="system" element={<AdminSistema />} />
                </Route>
              </Routes>
              </Suspense>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App