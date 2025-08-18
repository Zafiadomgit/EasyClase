import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Eye, Lock, Users } from 'lucide-react'

const Privacidad = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-sm text-secondary-600 mb-4">
            <Link to="/" className="hover:text-primary-600">Inicio</Link>
            <span className="mx-2">›</span>
            <span>Política de Privacidad</span>
          </nav>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-secondary-600">
            En EasyClase, tu privacidad es nuestra prioridad. Última actualización: Enero 2024
          </p>
        </div>

        {/* Resumen Visual */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Datos Protegidos</h3>
            <p className="text-sm text-blue-700">Encriptamos y protegemos toda tu información personal</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">No Vendemos</h3>
            <p className="text-sm text-green-700">Nunca vendemos tu información a terceros</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-purple-900 mb-2">Transparencia</h3>
            <p className="text-sm text-purple-700">Te explicamos exactamente qué datos recolectamos</p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-orange-900 mb-2">Control Total</h3>
            <p className="text-sm text-orange-700">Puedes acceder, modificar o eliminar tus datos</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">1. Información que Recolectamos</h2>
            
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Información Personal</h3>
            <ul className="list-disc list-inside text-secondary-700 space-y-2 mb-4">
              <li>Nombre completo y información de contacto</li>
              <li>Dirección de email y número de teléfono</li>
              <li>Información de pago (procesada de forma segura)</li>
              <li>Ubicación geográfica (ciudad/país)</li>
              <li>Foto de perfil (opcional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Información Profesional</h3>
            <ul className="list-disc list-inside text-secondary-700 space-y-2 mb-4">
              <li>Experiencia educativa y profesional</li>
              <li>Certificaciones y títulos</li>
              <li>Especialidades y habilidades</li>
              <li>Tarifas y disponibilidad</li>
            </ul>

            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Información de Uso</h3>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li>Historial de clases y transacciones</li>
              <li>Reseñas y calificaciones</li>
              <li>Mensajes dentro de la plataforma</li>
              <li>Datos de navegación y cookies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">2. Cómo Utilizamos tu Información</h2>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">Propósitos Principales</h3>
              <ul className="list-disc list-inside text-primary-700 space-y-1">
                <li>Facilitar conexiones entre estudiantes y profesores</li>
                <li>Procesar pagos y transacciones de forma segura</li>
                <li>Mejorar la experiencia del usuario en la plataforma</li>
                <li>Proporcionar soporte al cliente</li>
                <li>Prevenir fraude y garantizar la seguridad</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Marketing y Comunicación</h3>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Solo enviamos comunicaciones relacionadas con el servicio y promociones relevantes. 
              Puedes darte de baja en cualquier momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">3. Compartir Información</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🚫 Lo que NO hacemos</h3>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                <li>Vender tu información personal a terceros</li>
                <li>Compartir datos con fines publicitarios externos</li>
                <li>Dar acceso no autorizado a tu información privada</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Cuándo Compartimos Información</h3>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li><strong>Con profesores/estudiantes:</strong> Solo información necesaria para las clases</li>
              <li><strong>Proveedores de servicios:</strong> Procesamiento de pagos, hosting, analytics</li>
              <li><strong>Requerimientos legales:</strong> Cuando sea requerido por ley</li>
              <li><strong>Seguridad:</strong> Para prevenir fraude o actividades maliciosas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">4. Seguridad de Datos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🔒 Medidas Técnicas</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                  <li>Encriptación SSL/TLS</li>
                  <li>Servidores seguros</li>
                  <li>Autenticación de dos factores</li>
                  <li>Monitoreo continuo</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">👥 Medidas Organizacionales</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                  <li>Acceso limitado a datos</li>
                  <li>Capacitación en privacidad</li>
                  <li>Auditorías regulares</li>
                  <li>Políticas estrictas</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">5. Tus Derechos</h2>
            
            <div className="space-y-4">
              <div className="border border-secondary-200 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-2">✅ Acceso</h3>
                <p className="text-secondary-700 text-sm">Solicitar una copia de todos los datos que tenemos sobre ti</p>
              </div>
              <div className="border border-secondary-200 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-2">✏️ Rectificación</h3>
                <p className="text-secondary-700 text-sm">Corregir información inexacta o incompleta</p>
              </div>
              <div className="border border-secondary-200 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-2">🗑️ Eliminación</h3>
                <p className="text-secondary-700 text-sm">Solicitar la eliminación de tus datos personales</p>
              </div>
              <div className="border border-secondary-200 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-2">📦 Portabilidad</h3>
                <p className="text-secondary-700 text-sm">Obtener tus datos en un formato portable</p>
              </div>
              <div className="border border-secondary-200 rounded-lg p-4">
                <h3 className="font-semibold text-secondary-900 mb-2">⚠️ Objeción</h3>
                <p className="text-secondary-700 text-sm">Oponerte al procesamiento de tus datos</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Para ejercer estos derechos:</strong> Contáctanos en 
                <a href="mailto:privacidad@easyclase.com" className="font-medium"> privacidad@easyclase.com</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">6. Cookies y Tecnologías Similares</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Utilizamos cookies para mejorar tu experiencia, recordar tus preferencias y analizar el uso de la plataforma. 
              Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>
            <Link to="/cookies" className="text-primary-600 hover:text-primary-700 font-medium">
              Ver Política de Cookies Detallada →
            </Link>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">7. Retención de Datos</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Conservamos tu información personal solo durante el tiempo necesario para los propósitos descritos en esta política, 
              o según lo requiera la ley. Los datos de transacciones se conservan por motivos fiscales y legales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">8. Cambios en esta Política</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios importantes por email 
              o mediante un aviso prominente en la plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">9. Contacto</h2>
            <div className="bg-secondary-50 rounded-lg p-6">
              <p className="text-secondary-700 mb-4">
                Si tienes preguntas sobre esta Política de Privacidad o el manejo de tus datos:
              </p>
              <div className="space-y-2 text-secondary-700">
                <p><strong>Email de Privacidad:</strong> privacidad@easyclase.com</p>
                <p><strong>Email General:</strong> hola@easyclase.com</p>
                <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                <p><strong>Dirección:</strong> Bogotá, Colombia</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-200">
          <div className="flex flex-wrap gap-4">
            <Link to="/terminos" className="text-primary-600 hover:text-primary-700 font-medium">
              Términos de Servicio
            </Link>
            <Link to="/cookies" className="text-primary-600 hover:text-primary-700 font-medium">
              Política de Cookies
            </Link>
            <Link to="/contacto" className="text-primary-600 hover:text-primary-700 font-medium">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacidad
