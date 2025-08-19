import React from 'react'

// Ícono personalizado para "Paga por hora"
export const PayPerHourIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Reloj de fondo */}
    <circle 
      cx="32" 
      cy="32" 
      r="28" 
      fill={`url(#clockGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Marcas del reloj */}
    <g stroke={color} strokeWidth="2">
      <line x1="32" y1="8" x2="32" y2="12" />
      <line x1="32" y1="52" x2="32" y2="56" />
      <line x1="56" y1="32" x2="52" y2="32" />
      <line x1="12" y1="32" x2="8" y2="32" />
    </g>
    
    {/* Manecillas del reloj */}
    <g stroke={color} strokeWidth="3" strokeLinecap="round">
      <line x1="32" y1="32" x2="32" y2="18" /> {/* Hora */}
      <line x1="32" y1="32" x2="42" y2="32" /> {/* Minutos */}
    </g>
    
    {/* Símbolo de dinero */}
    <circle cx="45" cy="19" r="8" fill="#10B981" stroke="white" strokeWidth="2"/>
    <text x="45" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">$</text>
    
    <defs>
      <linearGradient id={`clockGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
)

// Ícono personalizado para "Profesores Verificados"
export const VerifiedTeacherIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cabeza del profesor */}
    <circle 
      cx="32" 
      cy="22" 
      r="12" 
      fill={`url(#teacherGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Cuerpo del profesor */}
    <path 
      d="M32 34C40 34 46 40 46 48V54H18V48C18 40 24 34 32 34Z" 
      fill={`url(#bodyGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Libro en las manos */}
    <rect x="26" y="42" width="12" height="8" rx="1" fill="#F59E0B" stroke={color} strokeWidth="1"/>
    <line x1="29" y1="45" x2="35" y2="45" stroke="white" strokeWidth="1"/>
    <line x1="29" y1="47" x2="33" y2="47" stroke="white" strokeWidth="1"/>
    
    {/* Símbolo de verificación */}
    <circle cx="48" cy="16" r="10" fill="#10B981" stroke="white" strokeWidth="2"/>
    <path d="m43 16 3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    <defs>
      <linearGradient id={`teacherGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="100%" stopColor="#F87171" />
      </linearGradient>
      <linearGradient id={`bodyGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DBEAFE" />
        <stop offset="100%" stopColor="#BFDBFE" />
      </linearGradient>
    </defs>
  </svg>
)

// Ícono personalizado para "Aprendizaje Rápido"
export const FastLearningIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cerebro */}
    <path 
      d="M20 25C18 20 22 15 28 15C30 12 34 12 36 15C42 15 46 20 44 25C46 27 46 33 44 35C46 40 42 45 36 45C34 48 30 48 28 45C22 45 18 40 20 35C18 33 18 27 20 25Z"
      fill={`url(#brainGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Rayos de energía */}
    <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
      <path d="m48 20 6-3-6 3 6 3" />
      <path d="m50 30 8 0-8 0 8-3" />
      <path d="m48 40 6 3-6-3 6-3" />
      
      <path d="m16 20-6-3 6 3-6 3" />
      <path d="m14 30-8 0 8 0-8-3" />
      <path d="m16 40-6 3 6-3-6-3" />
    </g>
    
    {/* Engranajes */}
    <circle cx="28" cy="28" r="4" fill="none" stroke={color} strokeWidth="1.5"/>
    <circle cx="36" cy="32" r="3" fill="none" stroke={color} strokeWidth="1.5"/>
    
    <defs>
      <linearGradient id={`brainGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
)

// Ícono personalizado para "Seguridad"
export const SecurityIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Escudo */}
    <path 
      d="M32 8L20 12V28C20 38 26 47 32 50C38 47 44 38 44 28V12L32 8Z"
      fill={`url(#shieldGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Candado */}
    <rect x="26" y="26" width="12" height="10" rx="2" fill="#10B981" stroke="white" strokeWidth="1"/>
    <path d="M29 26V22C29 20.3431 30.3431 19 32 19C33.6569 19 35 20.3431 35 22V26" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="32" cy="31" r="1.5" fill="white"/>
    
    {/* Checkmarks alrededor */}
    <g stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 20 2 2 4-4" />
      <path d="m46 20-2 2-4-4" />
      <path d="m18 40 2-2 4 4" />
      <path d="m46 40-2-2-4 4" />
    </g>
    
    <defs>
      <linearGradient id={`shieldGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
)

// Ícono personalizado para "Flexibilidad"
export const FlexibilityIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Calendarios superpuestos */}
    <rect x="12" y="16" width="20" height="24" rx="3" fill="#F3F4F6" stroke={color} strokeWidth="2"/>
    <rect x="32" y="24" width="20" height="24" rx="3" fill={`url(#calendarGradient-${Math.random().toString(36).substr(2, 9)})`} stroke={color} strokeWidth="2"/>
    
    {/* Líneas del calendario */}
    <g stroke={color} strokeWidth="1">
      <line x1="16" y1="22" x2="28" y2="22" />
      <line x1="16" y1="26" x2="28" y2="26" />
      <line x1="16" y1="30" x2="24" y2="30" />
      
      <line x1="36" y1="30" x2="48" y2="30" />
      <line x1="36" y1="34" x2="48" y2="34" />
      <line x1="36" y1="38" x2="44" y2="38" />
    </g>
    
    {/* Reloj */}
    <circle cx="20" cy="44" r="6" fill="#F59E0B" stroke="white" strokeWidth="2"/>
    <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <line x1="20" y1="44" x2="20" y2="40" />
      <line x1="20" y1="44" x2="23" y2="44" />
    </g>
    
    {/* Flechas curvas para mostrar flexibilidad */}
    <path d="M8 32 Q 8 8 32 8 Q 56 8 56 32" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M8 32 Q 8 56 32 56 Q 56 56 56 32" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round"/>
    
    <defs>
      <linearGradient id={`calendarGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DBEAFE" />
        <stop offset="100%" stopColor="#BFDBFE" />
      </linearGradient>
    </defs>
  </svg>
)

// Ícono personalizado para "Soporte Continuo"
export const SupportIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg 
    className={className} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Persona central */}
    <circle 
      cx="32" 
      cy="24" 
      r="10" 
      fill={`url(#supportGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Cuerpo */}
    <path 
      d="M32 34C38 34 42 38 42 44V50H22V44C22 38 26 34 32 34Z"
      fill={`url(#supportBodyGradient-${Math.random().toString(36).substr(2, 9)})`}
      stroke={color}
      strokeWidth="2"
    />
    
    {/* Manos de apoyo de la izquierda */}
    <path 
      d="M8 38C10 36 14 36 16 38L20 42"
      stroke="#10B981" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="12" cy="32" r="6" fill="#10B981" stroke="white" strokeWidth="2"/>
    
    {/* Manos de apoyo de la derecha */}
    <path 
      d="M56 38C54 36 50 36 48 38L44 42"
      stroke="#10B981" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="52" cy="32" r="6" fill="#10B981" stroke="white" strokeWidth="2"/>
    
    {/* Corazón en el pecho para representar cuidado */}
    <path 
      d="M32 42C32 42 28 38 32 36C36 38 32 42 32 42Z"
      fill="#EF4444" 
      stroke="white" 
      strokeWidth="1"
    />
    
    {/* Líneas de conexión/energía */}
    <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.7">
      <path d="M16 28 L24 32" />
      <path d="M48 28 L40 32" />
      <path d="M32 16 L32 8" />
    </g>
    
    <defs>
      <linearGradient id={`supportGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <linearGradient id={`supportBodyGradient-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D1FAE5" />
        <stop offset="100%" stopColor="#A7F3D0" />
      </linearGradient>
    </defs>
  </svg>
)
