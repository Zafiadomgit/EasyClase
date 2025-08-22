# Sistema de Descuentos - EasyClase

## Resumen del Cambio

Se ha implementado un nuevo sistema de descuentos que reemplaza la "primera clase gratis" por un sistema más sostenible y equitativo.

## Nuevo Sistema de Descuentos

### 🎯 Descuento del 10% en la Primera Clase por Categoría

- **Porcentaje**: 10% de descuento
- **Aplicación**: Primera clase de cada categoría para cada estudiante
- **Asunción del costo**: 
  - **Estudiantes normales**: El descuento lo asume el profesor
  - **Estudiantes Premium**: El descuento lo asume la plataforma

### 👑 Plan Premium

- **Descuento ilimitado**: 10% en todas las clases mientras el plan esté activo
- **Asunción del costo**: La plataforma asume todos los descuentos
- **Beneficios adicionales**: Acceso prioritario a profesores

## Implementación Técnica

### Modelos Actualizados

#### User Model
```javascript
// Nuevos campos agregados
premium: {
  activo: Boolean,
  fechaInicio: Date,
  fechaFin: Date,
  plan: String // 'mensual' | 'anual'
},
descuentosUtilizados: [{
  categoria: String,
  fechaUtilizacion: Date,
  claseId: ObjectId
}]
```

#### Clase Model
```javascript
// Nuevos campos agregados
descuento: {
  aplicado: Boolean,
  porcentaje: Number,
  montoDescuento: Number,
  categoria: String,
  asumidoPor: String // 'profesor' | 'plataforma'
}
```

### Servicios Creados

#### descuentoService.js
- `verificarDescuentoDisponible()`: Verifica si un estudiante puede usar descuento
- `aplicarDescuento()`: Aplica descuento a una clase
- `calcularDescuento()`: Calcula el descuento sin aplicarlo
- `obtenerHistorialDescuentos()`: Obtiene historial de descuentos

### Endpoints Nuevos

#### GET /api/clases/descuentos/info
- **Parámetros**: `categoria` (query)
- **Respuesta**: Información sobre descuento disponible

#### GET /api/clases/descuentos/historial
- **Respuesta**: Historial de descuentos del estudiante

### Frontend Actualizado

#### Páginas Modificadas
- **Pago.jsx**: Muestra descuentos aplicados
- **PerfilProfesor.jsx**: Muestra información de descuentos disponibles
- **Home.jsx**: Nueva sección explicando el sistema de descuentos

#### Componentes Nuevos
- Indicadores de descuento en perfiles de profesores
- Sección de descuentos en la página principal

## Reglas de Negocio

### Para Estudiantes Normales
1. **Una clase con descuento por categoría**
2. **El descuento lo asume el profesor**
3. **No se puede reutilizar el descuento en la misma categoría**

### Para Estudiantes Premium
1. **Descuento ilimitado en todas las clases**
2. **El descuento lo asume la plataforma**
3. **Mientras el plan premium esté activo**

### Cálculo de Descuentos
```javascript
const subtotal = precio * duracion;
const montoDescuento = (subtotal * 10) / 100;
const total = subtotal - montoDescuento;
```

## Migración de Datos

### Script de Migración
```bash
node server/scripts/migrateDescuentos.js
```

### Datos de Prueba Creados
- **Usuario Premium**: premium@test.com / password123
- **Usuario Normal**: normal@test.com / password123
- **Clases de prueba** con y sin descuentos aplicados

## Beneficios del Nuevo Sistema

### Para Estudiantes
- ✅ Descuentos transparentes y predecibles
- ✅ Beneficio real en cada categoría
- ✅ Opción premium para descuentos ilimitados

### Para Profesores
- ✅ Control sobre sus descuentos
- ✅ Atracción de nuevos estudiantes
- ✅ Sistema más sostenible

### Para la Plataforma
- ✅ Modelo de negocio más claro
- ✅ Ingresos por suscripciones premium
- ✅ Mejor experiencia de usuario

## Próximos Pasos

1. **Testing**: Probar el sistema con usuarios reales
2. **Métricas**: Implementar tracking de uso de descuentos
3. **Optimización**: Ajustar porcentajes según feedback
4. **Expansión**: Considerar descuentos por volumen o fidelidad

## Comandos Útiles

### Ejecutar Migración
```bash
cd server
node scripts/migrateDescuentos.js
```

### Verificar Estado
```bash
# Verificar usuarios con premium
db.users.find({"premium.activo": true})

# Verificar clases con descuentos
db.clases.find({"descuento.aplicado": true})
```

## Contacto

Para preguntas sobre el sistema de descuentos, contactar al equipo de desarrollo.
