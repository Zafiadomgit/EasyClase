import React, { useState, useEffect, useRef } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'

const TermsModal = ({ isOpen, onClose, onAccept }) => {
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
    onAccept('terms')
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
        <div className="inline-block w-full max-w-4xl px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Términos y Condiciones de Servicio
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
              <span>Lee todo el documento para continuar</span>
              <span className={hasScrolledToEnd ? "text-green-600 font-medium" : ""}>
                {hasScrolledToEnd ? "✓ Documento leído" : "Sigue leyendo..."}
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
                <strong>Última actualización:</strong> Enero 2024
              </p>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Aceptación de los Términos</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Al acceder y utilizar EasyClase ("la Plataforma"), usted acepta estar sujeto a estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, no debe utilizar este servicio.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Descripción del Servicio</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EasyClase es una plataforma que conecta estudiantes con profesores para clases particulares. Facilitamos la comunicación, programación y pago entre las partes, pero no somos empleadores de los profesores ni garantizamos la calidad de los servicios educativos.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Registro y Cuentas de Usuario</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Debe proporcionar información precisa y completa durante el registro</li>
                  <li>Es responsable de mantener la confidencialidad de su cuenta</li>
                  <li>Debe notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                  <li>Solo personas mayores de 18 años pueden crear cuentas</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">4. Políticas de Pago</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h5 className="text-md font-semibold text-blue-800 mb-2">Sistema de Escrow</h5>
                  <p className="text-blue-700 text-sm">
                    Los pagos se procesan a través de nuestro sistema de escrow. Los fondos se liberan al profesor solo después de que el estudiante confirme la recepción satisfactoria del servicio.
                  </p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Los estudiantes pagan antes de recibir las clases</li>
                  <li>Los profesores reciben el pago después de la confirmación del servicio</li>
                  <li>EasyClase cobra una comisión del 5% sobre cada transacción</li>
                  <li>Los reembolsos se procesan según nuestra política de reembolsos</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">5. Responsabilidades del Profesor</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Proporcionar servicios educativos de calidad</li>
                  <li>Mantener horarios acordados y comunicar cambios con anticipación</li>
                  <li>Verificar credenciales y experiencia declarada</li>
                  <li>Mantener un comportamiento profesional en todo momento</li>
                  <li>Cumplir con todas las leyes aplicables en su jurisdicción</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">6. Responsabilidades del Estudiante</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Pagar las clases según los términos acordados</li>
                  <li>Asistir a las clases programadas o cancelar con anticipación</li>
                  <li>Mantener un comportamiento respetuoso</li>
                  <li>Proporcionar feedback honesto sobre los servicios recibidos</li>
                  <li>No solicitar servicios fuera de la plataforma para evitar comisiones</li>
                </ul>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">7. Política de Cancelación</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h5 className="text-md font-semibold text-yellow-800 mb-2">Cancelaciones</h5>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                    <li>Más de 24 horas: Reembolso completo</li>
                    <li>Entre 24-2 horas: 50% de penalización</li>
                    <li>Menos de 2 horas: Sin reembolso</li>
                    <li>No-show del profesor: Reembolso completo</li>
                  </ul>
                </div>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">8. Propiedad Intelectual</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de EasyClase y está protegido por las leyes de derechos de autor.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">9. Limitación de Responsabilidad</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  EasyClase actúa únicamente como intermediario. No somos responsables por la calidad, seguridad o legalidad de los servicios ofrecidos por los profesores, ni por la capacidad de pago de los estudiantes.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">10. Modificaciones</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios importantes serán notificados con 30 días de anticipación.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">11. Contacto</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Si tiene preguntas sobre estos Términos de Servicio, contáctenos en:
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Email:</strong> legal@easyclase.com<br/>
                    <strong>Teléfono:</strong> +57 300 123 4567<br/>
                    <strong>Dirección:</strong> Bogotá, Colombia
                  </p>
                </div>
              </section>

              {/* Final message that appears only when scrolled to end */}
              {hasScrolledToEnd && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      ¡Has leído todo el documento! Ahora puedes aceptar los términos y condiciones.
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
              <span>Debes leer todo el documento para poder aceptar</span>
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
                {showAcceptButton ? "Acepto los Términos" : "Lee todo el documento"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
