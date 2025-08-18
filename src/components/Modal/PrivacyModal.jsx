import React, { useState, useEffect, useRef } from 'react'
import { X, Check, AlertCircle, Shield, Lock, Eye, Users } from 'lucide-react'

const PrivacyModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)
  const [showAcceptButton, setShowAcceptButton] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToEnd(false)
      setShowAcceptButton(false)
      // Reset scroll position when modal opens
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    }
  }, [isOpen])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const scrolledToEnd = scrollTop + clientHeight >= scrollHeight - 10 // 10px tolerance
    
    if (scrolledToEnd && !hasScrolledToEnd) {
      setHasScrolledToEnd(true)
      setTimeout(() => {
        setShowAcceptButton(true)
      }, 1000) // Wait 1 second after reaching the end
    }
  }

  const handleAccept = () => {
    onAccept('privacy')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="inline-block w-full max-w-4xl px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">
              Política de Privacidad
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scroll progress indicator */}
          <div className="mt-4 mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Lee toda la política para continuar</span>
              <span className={hasScrolledToEnd ? "text-green-600 font-medium" : ""}>
                {hasScrolledToEnd ? "✓ Política leída" : "Sigue leyendo..."}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  hasScrolledToEnd ? "bg-green-500 w-full" : "bg-blue-500 w-0"
                }`}
              />
            </div>
          </div>

          {/* Content with scroll */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-6 bg-gray-50"
          >
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-600 mb-4">
                <strong>En EasyClase, tu privacidad es nuestra prioridad. Última actualización:</strong> Enero 2024
              </p>

              {/* Resumen Visual */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-medium text-blue-900 mb-1">Datos Protegidos</h5>
                  <p className="text-xs text-blue-700">Encriptamos toda tu información</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Lock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <h5 className="font-medium text-green-900 mb-1">No Vendemos</h5>
                  <p className="text-xs text-green-700">Nunca vendemos tus datos</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-medium text-purple-900 mb-1">Transparencia</h5>
                  <p className="text-xs text-purple-700">Te explicamos todo</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <h5 className="font-medium text-orange-900 mb-1">Control Total</h5>
                  <p className="text-xs text-orange-700">Tú decides sobre tus datos</p>
                </div>
              </div>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Información que Recolectamos</h4>
                
                <h5 className="text-md font-semibold text-gray-800 mb-2">Información Personal</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4 text-sm">
                  <li>Nombre completo y información de contacto</li>
                  <li>Dirección de email y número de teléfono</li>
                  <li>Información de pago (procesada de forma segura)</li>
                  <li>Ubicación geográfica (ciudad/país)</li>
                  <li>Foto de perfil (opcional)</li>
                </ul>

                <h5 className="text-md font-semibold text-gray-800 mb-2">Información Profesional</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4 text-sm">
                  <li>Experiencia educativa y profesional</li>
                  <li>Certificaciones y títulos</li>
                  <li>Especialidades y habilidades</li>
                  <li>Tarifas y disponibilidad</li>
                </ul>

                <h5 className="text-md font-semibold text-gray-800 mb-2">Información de Uso</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Historial de clases y transacciones</li>
                  <li>Reseñas y calificaciones</li>
                  <li>Mensajes dentro de la plataforma</li>
                  <li>Datos de navegación y cookies</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Cómo Utilizamos tu Información</h4>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h5 className="text-md font-semibold text-blue-800 mb-2">Propósitos Principales</h5>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>Facilitar conexiones entre estudiantes y profesores</li>
                    <li>Procesar pagos y transacciones de forma segura</li>
                    <li>Mejorar la experiencia del usuario en la plataforma</li>
                    <li>Proporcionar soporte al cliente</li>
                    <li>Prevenir fraude y garantizar la seguridad</li>
                  </ul>
                </div>

                <h5 className="text-md font-semibold text-gray-800 mb-2">Marketing y Comunicación</h5>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Solo enviamos comunicaciones relacionadas con el servicio y promociones relevantes. 
                  Puedes darte de baja en cualquier momento.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Compartir Información</h4>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h5 className="text-md font-semibold text-red-800 mb-2">🚫 Lo que NO hacemos</h5>
                  <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                    <li>Vender tu información personal a terceros</li>
                    <li>Compartir datos con fines publicitarios externos</li>
                    <li>Dar acceso no autorizado a tu información privada</li>
                  </ul>
                </div>

                <h5 className="text-md font-semibold text-gray-800 mb-2">Cuándo Compartimos Información</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Con profesores/estudiantes:</strong> Solo información necesaria para las clases</li>
                  <li><strong>Proveedores de servicios:</strong> Procesamiento de pagos, hosting, analytics</li>
                  <li><strong>Requerimientos legales:</strong> Cuando sea requerido por ley</li>
                  <li><strong>Seguridad:</strong> Para prevenir fraude o actividades maliciosas</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">4. Seguridad de Datos</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-md font-semibold text-green-800 mb-2">🔒 Medidas Técnicas</h5>
                    <ul className="list-disc list-inside text-green-700 space-y-1 text-xs">
                      <li>Encriptación SSL/TLS</li>
                      <li>Servidores seguros</li>
                      <li>Autenticación de dos factores</li>
                      <li>Monitoreo continuo</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-md font-semibold text-blue-800 mb-2">👥 Medidas Organizacionales</h5>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-xs">
                      <li>Acceso limitado a datos</li>
                      <li>Capacitación en privacidad</li>
                      <li>Auditorías regulares</li>
                      <li>Políticas estrictas</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">5. Tus Derechos</h4>
                
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1 text-sm">✅ Acceso</h5>
                    <p className="text-gray-700 text-xs">Solicitar una copia de todos los datos que tenemos sobre ti</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1 text-sm">✏️ Rectificación</h5>
                    <p className="text-gray-700 text-xs">Corregir información inexacta o incompleta</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1 text-sm">🗑️ Eliminación</h5>
                    <p className="text-gray-700 text-xs">Solicitar la eliminación de tus datos personales</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-1 text-sm">📦 Portabilidad</h5>
                    <p className="text-gray-700 text-xs">Obtener tus datos en un formato portable</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Para ejercer estos derechos:</strong> Contáctanos en 
                    <span className="font-medium"> privacidad@easyclase.com</span>
                  </p>
                </div>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">6. Cookies y Tecnologías Similares</h4>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Utilizamos cookies para mejorar tu experiencia, recordar tus preferencias y analizar el uso de la plataforma. 
                  Puedes controlar las cookies a través de la configuración de tu navegador.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">7. Retención de Datos</h4>
                <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                  Conservamos tu información personal solo durante el tiempo necesario para los propósitos descritos en esta política, 
                  o según lo requiera la ley. Los datos de transacciones se conservan por motivos fiscales y legales.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">8. Contacto</h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700 mb-3 text-sm">
                    Si tienes preguntas sobre esta Política de Privacidad:
                  </p>
                  <div className="space-y-1 text-gray-700 text-sm">
                    <p><strong>Email de Privacidad:</strong> privacidad@easyclase.com</p>
                    <p><strong>Email General:</strong> hola@easyclase.com</p>
                    <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                    <p><strong>Dirección:</strong> Bogotá, Colombia</p>
                  </div>
                </div>
              </section>

              {/* Final message that appears only when scrolled to end */}
              {hasScrolledToEnd && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium text-sm">
                      ¡Has leído toda la política! Ahora puedes aceptar la política de privacidad.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>Debes leer toda la política para poder aceptar</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={!showAcceptButton}
                className={`px-6 py-2 rounded-lg transition-all ${
                  showAcceptButton
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {showAcceptButton ? "Acepto la Política" : "Lee toda la política"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
