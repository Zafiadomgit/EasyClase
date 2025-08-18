# 🚀 EasyClase - Instrucciones Rápidas

## ⚡ Inicio Rápido

### 1. **Ejecutar Sistema Completo (Windows)**
```bash
# Doble clic en:
ejecutar-sistema.bat
```

### 2. **Ejecutar Manualmente**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd Server.js
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3001 (o 3002 si 3001 está ocupado)
- **Backend**: http://localhost:3000
- **API Status**: http://localhost:3000/api/status

## 🎯 Primeras Pruebas

### 1. **Verificar que todo funciona**
- Abre http://localhost:3001
- Deberías ver la página de inicio de EasyClase

### 2. **Crear tu primera cuenta**
- Clic en "Registrarse"
- Completa el formulario
- Elige "Estudiante" o "Profesor"
- ¡Ya puedes usar el sistema!

### 3. **Explorar funcionalidades**
- **Dashboard**: Ve tus estadísticas
- **Buscar Clases**: Encuentra profesores
- **Perfil**: Configura tu información

## 🛠 Configuración Opcional

### Variables de Entorno (.env en Server.js/)
```env
MONGODB_URI=mongodb://localhost:27017/easyclase
JWT_SECRET=tu_jwt_secret_super_secreto
MP_ACCESS_TOKEN=tu_token_mercadopago
FRONTEND_URL=http://localhost:3001
```

### Base de Datos
- **MongoDB local**: Instala MongoDB Compass
- **MongoDB Atlas**: Usa la nube (gratis)

## 🐛 Solución de Problemas

### ❌ "Puerto ocupado"
- El frontend cambiará automáticamente a 3002, 3003, etc.
- Actualiza la URL en tu navegador

### ❌ "Error de conexión API"
- Verifica que el backend esté ejecutándose en puerto 3000
- Revisa la consola del backend para errores

### ❌ "Error de MongoDB"
- Instala MongoDB local o usa MongoDB Atlas
- Verifica la variable MONGODB_URI

## 🎨 Personalización

### Colores del Kit de Marca
Edita `tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#TU_COLOR_PRINCIPAL',
    // ... más tonos
  }
}
```

### Logo
Reemplaza el icono en `Header.jsx` con tu logo real.

## 📞 Ayuda

Si tienes problemas:
1. Revisa las consolas de ambos servidores
2. Verifica que las dependencias estén instaladas
3. Asegúrate de que MongoDB esté corriendo

¡Disfruta usando EasyClase! 🎓✨
