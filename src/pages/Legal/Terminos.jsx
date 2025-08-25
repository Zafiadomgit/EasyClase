import React from 'react'
import { Link } from 'react-router-dom'

const Terminos = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-sm text-secondary-600 mb-4">
            <Link to="/" className="hover:text-primary-600">Inicio</Link>
            <span className="mx-2">›</span>
            <span>Términos de Servicio</span>
          </nav>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Términos de Servicio
          </h1>
          <p className="text-lg text-secondary-600">
            Última actualización: Enero 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Al acceder y utilizar EasyClase ("la Plataforma"), usted acepta estar sujeto a estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, no debe utilizar este servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">2. Descripción del Servicio</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              EasyClase es una plataforma que conecta estudiantes con profesores para clases particulares exclusivamente en modalidad online. Facilitamos la comunicación, programación, pago y videollamadas integradas entre las partes, pero no somos empleadores de los profesores ni garantizamos la calidad de los servicios educativos.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🌐 Solo Modalidad Online</h3>
              <p className="text-blue-700">
                <strong>Todas las clases en EasyClase son exclusivamente online.</strong> No facilitamos ni permitimos encuentros presenciales. Esto garantiza la seguridad de nuestros usuarios y permite un mejor control de calidad del servicio.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">3. Registro y Cuentas de Usuario</h2>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li>Debe proporcionar información precisa y completa durante el registro</li>
              <li>Es responsable de mantener la confidencialidad de su cuenta</li>
              <li>Debe notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
              <li>Solo personas mayores de 18 años pueden crear cuentas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">4. Políticas de Pago</h2>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Sistema de Escrow</h3>
              <p className="text-primary-700">
                Los pagos se procesan a través de nuestro sistema de escrow. Los fondos se liberan al profesor solo después de que el estudiante confirme la recepción satisfactoria del servicio.
              </p>
            </div>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li>Los estudiantes pagan antes de recibir las clases</li>
              <li>Los profesores reciben el pago después de la confirmación del servicio</li>
              <li>EasyClase cobra una comisión del 5% sobre cada transacción</li>
              <li>Los reembolsos se procesan según nuestra política de reembolsos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">5. Sistema de Videollamadas Integrado</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">🎥 Plataforma Integrada</h3>
              <p className="text-green-700 mb-3">
                EasyClase cuenta con un sistema de videollamadas integrado que permite la comunicación segura entre estudiantes y profesores sin compartir información personal.
              </p>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li>Las videollamadas solo están disponibles durante el horario programado de la clase</li>
                <li>No se comparten números telefónicos, emails personales ni enlaces externos</li>
                <li>Las sesiones son moderadas por nuestra plataforma para garantizar la seguridad</li>
                <li>Se prohíbe grabar las sesiones sin consentimiento expreso de ambas partes</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">6. Responsabilidades del Profesor</h2>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li>Proporcionar servicios educativos de calidad</li>
              <li>Mantener horarios acordados y comunicar cambios con anticipación</li>
              <li>Verificar credenciales y experiencia declarada</li>
              <li>Mantener un comportamiento profesional en todo momento</li>
              <li>Cumplir con todas las leyes aplicables en su jurisdicción</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">7. Responsabilidades del Estudiante</h2>
            <ul className="list-disc list-inside text-secondary-700 space-y-2">
              <li>Pagar las clases según los términos acordados</li>
              <li>Asistir a las clases programadas o cancelar con anticipación</li>
              <li>Mantener un comportamiento respetuoso</li>
              <li>Proporcionar feedback honesto sobre los servicios recibidos</li>
              <li>No solicitar servicios fuera de la plataforma para evitar comisiones</li>
              <li><strong>NO compartir información de contacto personal (teléfonos, emails, redes sociales) con los profesores</strong></li>
              <li>Usar únicamente los canales oficiales de comunicación de la plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">8. Política de Comunicación y Seguridad</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🚫 Prohibición de Intercambio de Información de Contacto</h3>
              <p className="text-red-700 mb-3">
                Para garantizar la seguridad de todos los usuarios y el correcto funcionamiento de la plataforma, 
                <strong>está estrictamente prohibido</strong> compartir información de contacto personal entre estudiantes y profesores.
              </p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                <li>Números de teléfono (móvil, fijo, WhatsApp)</li>
                <li>Direcciones de email personales</li>
                <li>Usuarios de redes sociales (Instagram, Facebook, Twitter, etc.)</li>
                <li>Enlaces a plataformas de comunicación externas</li>
                <li>Cualquier otra información que permita contacto directo fuera de la plataforma</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">✅ Canales Oficiales Permitidos</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Chat interno de la plataforma</li>
                <li>Videollamadas integradas durante las clases programadas</li>
                <li>Mensajes a través del sistema de notificaciones</li>
                <li>Comunicación a través del soporte oficial</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Sanciones por Violación</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li><strong>Primera advertencia:</strong> Notificación automática del sistema</li>
                <li><strong>Segunda advertencia:</strong> Bloqueo temporal del chat (24 horas)</li>
                <li><strong>Tercera advertencia:</strong> Suspensión de la cuenta por 7 días</li>
                <li><strong>Violaciones repetidas:</strong> Baneo permanente de la plataforma</li>
              </ul>
              <p className="text-yellow-700 mt-3 font-medium">
                <strong>Importante:</strong> Esta política es fundamental para garantizar la seguridad de tu dinero y la integridad de la plataforma.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">9. Política de Cancelación</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cancelaciones</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Más de 24 horas: Reembolso completo</li>
                <li>Entre 24-2 horas: 50% de penalización</li>
                <li>Menos de 2 horas: Sin reembolso</li>
                <li>No-show del profesor: Reembolso completo</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">10. Propiedad Intelectual</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de EasyClase y está protegido por las leyes de derechos de autor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">11. Limitación de Responsabilidad</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              EasyClase actúa únicamente como intermediario. No somos responsables por la calidad, seguridad o legalidad de los servicios ofrecidos por los profesores, ni por la capacidad de pago de los estudiantes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">12. Modificaciones</h2>
            <p className="text-secondary-700 leading-relaxed mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios importantes serán notificados con 30 días de anticipación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">13. Contacto</h2>
            <p className="text-secondary-700 leading-relaxed">
              Si tiene preguntas sobre estos Términos de Servicio, contáctenos en:
            </p>
            <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
              <p className="text-secondary-700">
                <strong>Email:</strong> legal@easyclase.com<br/>
                <strong>Teléfono:</strong> +57 300 123 4567<br/>
                <strong>Dirección:</strong> Bogotá, Colombia
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-200">
          <div className="flex flex-wrap gap-4">
            <Link to="/privacidad" className="text-primary-600 hover:text-primary-700 font-medium">
              Política de Privacidad
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

export default Terminos
