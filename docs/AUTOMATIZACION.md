# 🤖 Automatización de EasyClase

Este documento describe la automatización gratuita que mantiene la app al aire
sin intervención manual, y qué quedó activo el 2026-08-02.

## Contexto: la infraestructura real

- **Frontend + API**: Vercel, proyecto `easy-clase-er9o`
  (https://easy-clase-er9o.vercel.app). Deploy automático desde `main`.
- **Base de datos de producción**: Supabase, proyecto `uxoklrovfahvyxzsbjvm`
  (pooler `aws-1-us-east-2.pooler.supabase.com:6543`, vía `DATABASE_URL` en
  Vercel). Ojo: este proyecto vive en una cuenta de Supabase distinta a la de
  los proyectos "easyclase" y "archivum".
- **MercadoPago**: `MP_ACCESS_TOKEN` configurado en Vercel y funcionando (la
  API responde consultas de pagos contra los servidores de MP).

## El riesgo que se automatizó

El **plan gratuito de Supabase pausa un proyecto tras ~7 días sin actividad**.
Si la base de producción se pausa, la app sigue "desplegada" pero nada
funciona: ni login, ni búsquedas, ni pagos.

## Piezas de la automatización

### 1. ✅ ACTIVO — pg_cron en Supabase (keep-alive, gratis)

En el proyecto Supabase `ddlvrycexamzznwtmchd` (activo de forma permanente)
quedaron programados con `pg_cron` + `pg_net` (migración
`easyclase_keepalive_cron`):

| Job | Cuándo | Qué hace |
|---|---|---|
| `easyclase-keepalive` | cada 6 horas | `GET https://easy-clase-er9o.vercel.app/api/status` — ejecuta una consulta SQL real en la DB de producción, contando como actividad y evitando la pausa |
| `selfping-keepalive` | diario 07:35 UTC | toca la API REST del propio proyecto que aloja los crons, para que éste tampoco se pause |

Verificar su historial:

```sql
-- En el proyecto ddlvrycexamzznwtmchd (SQL Editor de Supabase)
select jobname, schedule, active from cron.job;
select * from cron.job_run_details order by start_time desc limit 10;
select id, status_code, error_msg, created from net._http_response order by id desc limit 10;
```

### 2. ⏳ PENDIENTE DE MERGE — GitHub Actions (monitoreo + alertas)

`.github/workflows/keepalive.yml`: cada 6 horas verifica que la API responda
`status: OK` y `dbReady: true`. Si falla, **abre un issue con la etiqueta
`monitoreo`** (GitHub te avisa por email). Se puede lanzar a mano desde
Actions → Run workflow.

> Los workflows con `schedule` solo corren desde `main`: hay que mergear esta
> rama. GitHub además desactiva los crons si el repo pasa 60 días sin commits.

### 3. ⏳ PENDIENTE DE MERGE — Cron de Vercel (respaldo)

`vercel.json` → `crons`: Vercel llama a `/api/status` a diario a las 08:00 UTC.
Gratis en plan Hobby. Se activa con el próximo deploy a producción (merge a
`main`).

### 4. Flujo de dinero ya automático (código existente)

1. El estudiante paga → `/api/pagos/crear-preferencia` crea el checkout de
   MercadoPago y registra la transacción como `pendiente`.
2. MercadoPago confirma → llama al webhook `/api/pagos/webhook`.
3. El webhook marca la transacción `aprobado` de forma idempotente.
4. La comisión (20%, o 10% si el profesor es premium) se aplica al retiro.

## Checklist para vender de verdad

- [x] Base de datos activa y keep-alive automático.
- [x] MercadoPago respondiendo en producción.
- [ ] Confirmar que `MP_ACCESS_TOKEN` es de **producción** (no de pruebas):
      en el panel de MercadoPago → Tus integraciones → Credenciales de
      producción. Con token de pruebas los pagos reales no entran.
- [ ] Mergear esta rama a `main` (activa workflow + cron de Vercel).
- [ ] Dominio propio en Vercel (opcional) y actualizar `FRONTEND_URL`.
- [ ] Registrar el primer profesor real con precio/hora y disponibilidad.

## Verificación rápida en cualquier momento

```bash
curl https://easy-clase-er9o.vercel.app/api/status
# Esperado: {"status":"OK", ..., "dbReady":true}
```
