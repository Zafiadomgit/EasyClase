# 📊 Configuración de Sentry - EasyClase

## 🎯 Características implementadas

### ✅ Monitoreo de errores
- Captura automática de errores JavaScript
- Stack traces detallados
- Context del usuario y sesión

### ✅ Performance monitoring  
- Métricas de carga de página
- Transacciones de navegación
- Core Web Vitals

### ✅ Session Replay
- Grabación de sesiones con errores
- Replay de interacciones del usuario
- Debugging visual avanzado

### ✅ Release tracking
- Versionado automático
- Tracking de deployments
- Comparación entre versiones

## 🔧 Configuración

### Variables de entorno
```bash
# Opcional - Solo para builds de producción con sourcemaps
SENTRY_AUTH_TOKEN=tu_token_aqui
VITE_APP_VERSION=1.0.0
```

### Sample rates
- **Desarrollo**: 100% de transacciones y replays
- **Producción**: 10% de transacciones y replays
- **Errores**: 100% siempre capturados

## 🧪 Testing

### Botón de prueba
- Disponible en Dashboard (solo desarrollo)
- Genera error controlado para verificar funcionamiento
- Ubicado en esquina superior derecha

### Verificar funcionamiento
1. Ir a Dashboard
2. Click en "Probar Error Sentry"
3. Revisar https://sentry.io para ver el error capturado

## 📈 Dashboards de Sentry

### Métricas disponibles
- Errores por página/componente
- Performance de rutas
- Usuarios afectados
- Frecuencia de errores
- Session replays

### Alertas configuradas
- Nuevos errores en producción
- Degradación de performance
- Aumento en tasa de errores

## 🔒 Privacidad

### Datos capturados
- ✅ Stack traces de errores
- ✅ URLs y rutas visitadas
- ✅ Performance metrics
- ✅ IP del usuario (para geolocalización)
- ❌ Contraseñas o datos sensibles (filtrados)

### Configuración de privacidad
- `sendDefaultPii: true` - Para mejor contexto de errores
- Filtros automáticos para datos sensibles
- No captura contenido de formularios
