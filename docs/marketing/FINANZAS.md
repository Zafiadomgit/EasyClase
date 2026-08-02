# 💰 Rutina financiera de EasyClase

La plata se mueve sola (MercadoPago → webhook → transacción aprobada →
comisión). Lo que NO es automático es mirarla. Este es el cierre mensual de
15 minutos; la rutina "Cierre financiero EasyClase" te lo recuerda el día 1
de cada mes con esta checklist.

## Checklist de cierre mensual

1. **Ingresos reales**: panel de MercadoPago → Actividad → filtrar el mes.
   Anota: total cobrado, número de ventas, devoluciones/contracargos.
2. **Panel admin de la app** (`/admin`): transacciones aprobadas del mes,
   usuarios nuevos (estudiantes y profesores), clases/servicios vendidos.
3. **Tu comisión** = ~20% del GMV (10% en profesores premium). Cuadra que lo
   de MercadoPago y lo del panel digan lo mismo; si difieren, revisar
   transacciones `pendiente` viejas (webhook caído ese día → issue de
   monitoreo en GitHub).
4. **Retiros de profesores**: `/admin/retiros` — aprobar/pagar lo pendiente.
   Regla: nunca dejar retiros pendientes más de 48h (mata la confianza).
5. **Costos del mes**: hoy $0 en infraestructura (Vercel Hobby, Supabase free,
   crons gratis). Anotar el día que algo pase a plan pago.
6. **Impuestos (Colombia)**: MercadoPago aplica retenciones según tu régimen;
   descarga el reporte fiscal mensual de MP y guárdalo en una carpeta
   `finanzas/AAAA-MM/`. Cuando el volumen sea real (>4UVT/mes recurrente),
   una hora con un contador vale más que cualquier software.

## Los 3 números que deciden todo

| Número | Dónde | Decisión que alimenta |
|---|---|---|
| GMV del mes (total vendido) | MercadoPago | ¿Crece el negocio? |
| Ventas por usuario nuevo | admin: transacciones ÷ registros | ¿El problema es tráfico o conversión? |
| % transacciones aprobadas vs pendientes | admin/pagos | ¿El checkout está fallando? |

## Señales de alarma

- Transacciones `pendiente` en aumento → revisar webhook de MP.
- GMV crece pero registros no → dependes de pocos alumnos: riesgo.
- Registros crecen pero GMV no → problema de conversión (precios, confianza,
  primer profe visible) — atacar la página de perfil de profesor.
