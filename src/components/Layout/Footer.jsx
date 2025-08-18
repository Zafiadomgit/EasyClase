import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/Logo_reducido-removebg-preview.png" 
                alt="EasyClase Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.src = '/LogoS1.png';
                  e.target.onerror = () => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  };
                }}
              />
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">EasyClase</span>
            </div>
            <p className="text-secondary-300 mb-6 max-w-sm leading-relaxed">
              La plataforma líder para conectar estudiantes con profesores expertos. 
              Aprende habilidades prácticas pagando solo por las horas que necesitas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.996 1.482-1.996.699 0 1.037.219 1.037 1.142 0 .695-.442 1.737-.662 2.705-.188.789.395 1.142 1.142 1.142 1.371 0 2.424-1.444 2.424-3.527 0-1.845-1.326-3.134-3.224-3.134-2.195 0-3.483 1.645-3.483 3.348 0 .662.255 1.371.573 1.756.063.075.072.141.053.219-.058.237-.188.756-.214.861-.035.146-.116.177-.268.107-1.001-.465-1.624-1.926-1.624-3.1 0-2.431 1.767-4.66 5.093-4.66 2.673 0 4.75 1.906 4.75 4.449 0 2.655-1.677 4.79-4.003 4.79-.781 0-1.518-.407-1.768-.889l-.482 1.835c-.174.677-.645 1.518-.963 2.034.725.225 1.497.345 2.292.345 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/buscar?categoria=Programación" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Programación
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=Excel" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Excel
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=Inglés" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Inglés
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=Matemáticas" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Matemáticas
                </Link>
              </li>
              <li>
                <Link to="/buscar?categoria=Diseño Gráfico" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Diseño Gráfico
                </Link>
              </li>
              <li>
                <Link to="/buscar" className="text-secondary-300 hover:text-white transition-colors text-sm font-medium">
                  Ver todas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ayuda" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  ¿Cómo Funciona?
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/disputas" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Resolver Disputas
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@easyclase.com" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  soporte@easyclase.com
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nosotros" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/empleos" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Empleos
                </Link>
              </li>
              <li>
                <Link to="/prensa" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Prensa
                </Link>
              </li>
              <li>
                <Link to="/inversores" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Inversores
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terminos" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/derechos-autor" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Derechos de Autor
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-secondary-300 hover:text-white transition-colors text-sm">
                  Política DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0">
              <p className="text-secondary-400 text-sm">
                &copy; 2024 EasyClase. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-secondary-500 text-xs">🇨🇴 Colombia</span>
                <span className="text-secondary-500 text-xs">• Español</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-secondary-400" />
                <span className="text-secondary-400 text-sm">hola@easyclase.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-secondary-400" />
                <span className="text-secondary-400 text-sm">+57 300 123 4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer