# EasyClase Frontend

Frontend moderno para la plataforma EasyClase - Conectando estudiantes con profesores verificados.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y responsive con Tailwind CSS
- **Navegación Intuitiva**: Flujos de usuario optimizados para estudiantes y profesores
- **Componentes Reutilizables**: Arquitectura modular y escalable
- **Autenticación**: Sistema completo de login y registro
- **Dashboard Personalizado**: Paneles específicos para estudiantes y profesores
- **Sistema de Búsqueda**: Filtros avanzados para encontrar clases y profesores
- **Responsive Design**: Optimizado para móviles, tablets y desktop

## 🛠 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de desarrollo rápida
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router** - Navegación y rutas
- **Lucide React** - Iconos modernos
- **HeadlessUI** - Componentes accesibles

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd easyclase-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   cp .env.example .env
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3001
   ```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Layout/         # Componentes de layout (Header, Footer)
├── pages/              # Páginas principales
│   ├── Auth/           # Páginas de autenticación
│   ├── Dashboard/      # Panel de usuario
│   └── ...             # Otras páginas
├── styles/             # Estilos globales
├── utils/              # Utilidades y helpers
└── App.jsx             # Componente principal
```

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño consistente con:

- **Colores Primarios**: Azules (#0ea5e9, #0284c7)
- **Colores Secundarios**: Grises (#64748b, #475569)
- **Tipografía**: Inter (texto) y Poppins (títulos)
- **Espaciado**: Sistema basado en rem/px de Tailwind
- **Componentes**: Botones, tarjetas, formularios estandarizados

## 📱 Páginas Implementadas

- ✅ **Página de Inicio** - Landing page con propuesta de valor
- ✅ **Buscar Clases** - Sistema de búsqueda con filtros
- ✅ **Perfil de Profesor** - Vista detallada del profesor
- ✅ **Login/Registro** - Autenticación de usuarios
- ✅ **Dashboard** - Panel personalizado para estudiantes y profesores

## 🔗 Integración con Backend

El frontend está configurado para conectarse con el backend en:
- **Desarrollo**: `http://localhost:3000`
- **Producción**: [URL del backend en producción]

Las rutas de API están proxy configuradas en Vite para facilitar el desarrollo.

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter de código
```

## 📝 Próximos Pasos

- [ ] Integrar con API real del backend
- [ ] Implementar sistema de pagos (MercadoPago)
- [ ] Añadir notificaciones en tiempo real
- [ ] Implementar chat en vivo
- [ ] Agregar sistema de calificaciones
- [ ] Optimizar para SEO
- [ ] Añadir tests unitarios

## 🎯 Flujos de Usuario Implementados

### Estudiante
1. Registro/Login
2. Búsqueda de clases
3. Vista de perfil de profesor
4. Reserva de clases
5. Dashboard personal

### Profesor
1. Registro/Login como profesor
2. Configuración de perfil
3. Gestión de disponibilidad
4. Dashboard con estadísticas
5. Gestión de solicitudes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Contacto

- Email: hola@easyclase.com
- Website: [easyclase.com](https://easyclase.com)

---

**EasyClase** - Aprende habilidades útiles, paga por hora, sin riesgos.