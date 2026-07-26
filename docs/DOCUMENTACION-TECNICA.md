# EasyClase — Documentación técnica

Plataforma de clases y servicios particulares con pagos por Mercado Pago
(Checkout Pro). Este documento resume la arquitectura, el modelo de datos, las
variables de entorno y la API del backend.

---

## 1. Arquitectura

| Capa | Tecnología | Ubicación |
|------|------------|-----------|
| Frontend | React 18 + Vite + Tailwind + React Router | `src/` |
| Backend | Node.js serverless (Express) — **un solo archivo** | `api/index.js` |
| Base de datos | PostgreSQL (Supabase) vía Sequelize | conexión por `DATABASE_URL` |
| Pagos | Mercado Pago **Checkout Pro** (SDK oficial `mercadopago`) | `api/index.js` |
| Hosting | Vercel (frontend estático + función serverless) | `vercel.json` |

**Puntos clave:**
- El **único backend desplegado es `api/index.js`**. Vercel enruta `/api/(.*)` a esa
  función serverless (ver `vercel.json`). No hay backend PHP ni Express aparte.
- La conexión a la base parsea `DATABASE_URL` manualmente (el usuario del pooler de
  Supabase contiene un punto y el parser de URI de Sequelize fallaba). El driver `pg`
  se importa explícitamente para que el bundler de Vercel lo incluya.
- Las tablas se crean/actualizan solas con `sync({ alter: true })` en la primera
  petición que toca la base (`initDB()`), que además siembra datos demo.

### Flujo de una request
```
navegador → /api/* → Vercel → api/index.js (Express) → Sequelize → Supabase PostgreSQL
                                     └→ SDK Mercado Pago (pagos)
```

---

## 2. Variables de entorno (Vercel)

| Variable | Uso | Obligatoria |
|----------|-----|-------------|
| `DATABASE_URL` | Connection string del pooler de Supabase | Sí (features de base) |
| `MP_ACCESS_TOKEN` | Access Token privado de Mercado Pago (pruebas: prefijo `TEST-`/`APP_USR`) | Sí (pagos) |
| `JWT_SECRET` | Firma de los JWT de sesión | Recomendada |
| `FRONTEND_URL` | Base para `back_urls` y `notification_url` de MP | Opcional (default al dominio) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Crea/asegura un usuario admin en el arranque | Opcional |
| `MERCADOPAGO_ACCESS_TOKEN` | Fallback de `MP_ACCESS_TOKEN` | No |

> El Access Token es **privado** y nunca debe ir en el frontend ni en el repo.

---

## 3. Modelo de datos (Sequelize)

| Modelo | Tabla | Descripción |
|--------|-------|-------------|
| `User` | `users` | Usuarios (estudiante / profesor / admin). Incluye perfil de profesor (bio, especialidades, precioPorHora, calificación…) y campos 2FA. |
| `Servicio` | `servicios` | Servicios/cursos ofrecidos por un profesor. Materiales como enlaces en `archivos` `[{nombre,url}]`. |
| `Plantilla` | `plantillas` | Clases en vivo (plantillas) creadas por un profesor. |
| `Disponibilidad` | `disponibilidades` | Franjas horarias semanales del profesor. |
| `Transaccion` | `transacciones` | Registro de cada pago (servicio o clase): estado, referencia, precio, comprador. |
| `Review` | `reviews` | Reseñas de estudiantes a profesores (con respuesta del profesor). |
| `Retiro` | `retiros` | Solicitudes de retiro de dinero de los profesores. |

**Relaciones:** `Servicio.proveedor → User.id`; `Transaccion.usuario/profesorId/servicioId`
referencian usuarios y servicios; `Review.profesorId/autor → User.id`;
`Plantilla.profesor`, `Disponibilidad.profesor`, `Retiro.profesor → User.id`.

---

## 4. Autenticación

- **JWT** en el header `Authorization: Bearer <token>` (expira en 7 días).
- Middlewares:
  - `authMiddleware`: exige token válido → setea `req.userId`.
  - `adminMiddleware`: además exige `tipoUsuario ∈ {admin, superadmin}`.
  - `getUserIdOptional`: extrae el usuario si hay token, sin bloquear (usado en el cobro).

---

## 5. API

Todas las respuestas siguen la forma `{ success: boolean, message?, data? }`.

### Estado y auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/status` | — | Estado del servicio + diagnóstico seguro de la base |
| POST | `/api/auth/login` | — | Login (email + password) → `{ user, token }` |
| POST | `/api/auth/register` | — | Registro de usuario |
| GET | `/api/auth/profile` | Sí | Perfil del usuario autenticado |
| PUT | `/api/auth/profile` | Sí | Actualizar perfil |
| GET | `/api/auth/preferencias` | Sí | Preferencias del usuario |

### 2FA
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/2fa` | Sí | Config 2FA del usuario |
| POST | `/api/2fa` | Sí | Activar 2FA (guarda secreto + backup codes) |
| DELETE | `/api/2fa` | Sí | Desactivar 2FA |

### Profesores
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/profesores` | — | Buscar/listar profesores (`?q=`, `?categoria=`) |
| GET | `/api/profesores/destacados` | — | Top profesores |
| GET | `/api/profesores/categorias` | — | Categorías existentes |
| GET | `/api/profesores/:id` | — | Perfil del profesor + reseñas |
| GET | `/api/profesores/balance` | Sí | Balance disponible para retiro |
| POST | `/api/profesores/retirar` | Sí | Solicitar un retiro |
| GET | `/api/profesores/retiros` | Sí | Mis solicitudes de retiro |

### Servicios
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/servicios` | — | Buscar/listar servicios activos |
| GET | `/api/servicios/categorias` | — | Categorías de servicios |
| GET | `/api/servicios/:id` | — | Detalle de un servicio |
| GET | `/api/servicios/usuario/mis-servicios` | Sí | Servicios del profesor |
| POST | `/api/servicios` | Sí | Crear servicio |
| PUT | `/api/servicios/:id` | Sí (dueño) | Editar servicio |
| DELETE | `/api/servicios/:id` | Sí (dueño) | Eliminar servicio |

### Clases (plantillas) y disponibilidad
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/plantillas` | Sí | Clases-plantilla del profesor |
| POST | `/api/plantillas` | Sí | Crear clase-plantilla |
| DELETE | `/api/plantillas/:id` | Sí (dueño) | Eliminar |
| GET | `/api/profesor/horarios` | Sí | Disponibilidad del profesor |
| POST | `/api/profesor/horarios` | Sí | Reemplazar el set de horarios |

### Reseñas
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/reviews/profesor/:id` | — | Reseñas de un profesor |
| GET | `/api/reviews/mis-reviews` | Sí | Reseñas escritas por el usuario |
| POST | `/api/reviews` | Sí | Publicar reseña (recalcula el rating del profesor) |
| PUT | `/api/reviews/:id/responder` | Sí (profesor) | Responder una reseña |

### Compras y reservas
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/compras-servicios/mis-compras` | Sí | Servicios comprados (con materiales si está pagado) |
| GET | `/api/reservas/mis-reservas` | Sí | Reservas de clase del usuario |

### Pagos (Mercado Pago — Checkout Pro)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/pagos/crear-preferencia` | Opcional | Crea la preferencia y registra la transacción; devuelve `init_point` |
| GET | `/api/pagos/:id` | — | Estado de un pago |
| POST | `/api/pagos/webhook` | — | Notificaciones de MP; confirma el pago y actualiza la transacción |

### Admin
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Métricas + top profesores |
| GET | `/api/admin/users` | Admin | Lista de usuarios |
| PUT | `/api/admin/users/:id/estado` | Admin | Bloquear/activar usuario |
| GET | `/api/admin/payments` | Admin | Todas las transacciones |
| GET | `/api/admin/clases` | Admin | Todas las reservas de clase |
| GET | `/api/admin/retiros` | Admin | Solicitudes de retiro |
| PUT | `/api/admin/retiros/:id/estado` | Admin | Aprobar / pagar / rechazar retiro |

---

## 6. Flujo de pago (Checkout Pro)

1. El frontend arma la reserva/compra y llama a **`POST /api/pagos/crear-preferencia`**
   con `{ titulo, precio, email, tipo, referencia, ... }`.
2. El backend crea la `preference` en Mercado Pago con `back_urls`
   (`/pago-exitoso`, `/pago-fallido`, `/pago-pendiente`), `auto_return` y
   `notification_url` al webhook, y **registra una `Transaccion` en estado `pendiente`**.
3. El frontend redirige al `init_point` → el usuario paga en Mercado Pago.
4. Mercado Pago llama al **webhook** `POST /api/pagos/webhook`; el backend consulta el
   pago con el SDK y actualiza la `Transaccion` (`aprobado` / `rechazado`) por
   `external_reference`.
5. Al volver, `/pago-exitoso` confirma el estado y marca la reserva como programada.

> **Retiros de profesor:** el payout automático real requiere **Mercado Pago Connect**
> (cuentas vinculadas + split). Hoy el retiro es una **solicitud** que el admin aprueba
> y paga manualmente desde `/admin/retiros`.

---

## 7. Frontend — rutas principales

| Ruta | Página | Rol |
|------|--------|-----|
| `/buscar`, `/servicios` | Buscar profesores / servicios | público |
| `/profesor/:id` | Perfil de profesor + reseñas | público |
| `/reservar/:id` | Reservar clase | usuario |
| `/pago`, `/pago-exitoso` | Pago (MP) y confirmación | usuario |
| `/servicios/crear`, `/clases/crear` | Crear servicio / clase | profesor |
| `/mis-servicios-comprados`, `/mis-reservas` | Compras y reservas | usuario |
| `/profesor/disponibilidad` | Configurar horarios | profesor |
| `/dashboard` | Panel + balance/retiro | usuario/profesor |
| `/admin/*` | Panel admin (dashboard, usuarios, pagos, clases, retiros) | admin |

---

## 8. Desarrollo local

```bash
npm install          # dependencias del frontend + backend serverless
npm run dev          # frontend (Vite)
npm run build        # build de producción del frontend
```

El backend serverless (`api/index.js`) se ejecuta en Vercel; localmente se puede
montar con Express importando `app` desde `api/index.js`. Requiere `DATABASE_URL` y
`MP_ACCESS_TOKEN` en el entorno para las features de base y pagos.
