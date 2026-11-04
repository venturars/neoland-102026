# Historial de specs

Todas las specs de AsistenciApp, en orden: primero `001` a `008`, después por número de issue. La spec activa es la que está **En curso**; si no hay ninguna, la última de la tabla.

El agente actualiza esta tabla cada vez que una spec cambia de fase. Las specs resumidas se borran (`AGENTS.md` §3): quien empieza una tarea lee su resumen, y su nombre enlaza a la spec completa en el commit `90d8be4e` de `staging`.

| ID | Nombre | Issue | Fecha | Tipo | Estado | Resumida en | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `001` | [checkin-codigo](https://github.com/venturars/neoland-102026/tree/90d8be4e5f19ef4d3bab29dacdc29904393a2e82/staff/ventura-rodriguez/asistenciapp/specs/001-checkin-codigo) | — | 2026-10-19 | Funcionalidad | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | [resumen.md](resumen.md) | Check-in con código rotatorio, válido para cualquier plataforma. Borrada el 2026-11-03 |
| `002` | [spec-antes-del-cambio](https://github.com/venturars/neoland-102026/tree/90d8be4e5f19ef4d3bab29dacdc29904393a2e82/staff/ventura-rodriguez/asistenciapp/specs/002-spec-antes-del-cambio) | — | 2026-10-22 | Proceso | ✅ Implementada (2026-10-22) | [resumen.md](resumen.md) | Ningún fichero de la app se toca sin un spec aprobado. Borrada el 2026-11-03 |
| `003` | [activar-el-entorno](https://github.com/venturars/neoland-102026/tree/90d8be4e5f19ef4d3bab29dacdc29904393a2e82/staff/ventura-rodriguez/asistenciapp/specs/003-activar-el-entorno) | #187 | 2026-10-22 | Proceso | ✅ Implementada (2026-10-22): T01–T04, 77 tests | [resumen.md](resumen.md) | El README separa activar el entorno y arrancar la app. Borrada el 2026-11-03 |
| `004` | [quitar-referencias-personales](https://github.com/venturars/neoland-102026/tree/90d8be4e5f19ef4d3bab29dacdc29904393a2e82/staff/ventura-rodriguez/asistenciapp/specs/004-quitar-referencias-personales) | #193 | 2026-10-22 | Proceso | ✅ Implementada (2026-10-22): T01–T12, 80 tests | [resumen.md](resumen.md) | El README entra con un usuario genérico. Borrada el 2026-11-03 |
| `005` | [reorganizar-arquitectura](../005-reorganizar-arquitectura/spec.md) | #196 | 2026-10-22 | Proceso | ✅ Implementada (2026-10-22): T01–T12, 87 tests | — | Documentos en `docs/` y código en reglas, acciones y borde |
| `006` | [limite-por-ip-publica](../006-limite-por-ip-publica/spec.md) | #260 | 2026-10-23 | Funcionalidad | ✅ Implementada (2026-10-23): T01–T11, 102 tests | — | Límite de intentos de registro por IP y lista de bloqueo. El recuento, la duración del bloqueo y la IP con túnel los cambia la 008 |
| `007` | [flujo-de-git](../007-flujo-de-git/spec.md) | #616 | 2026-10-30 | Proceso | ✅ Implementada (2026-10-30): T01–T06 | — | Flujo de git del curso y cinco momentos del humano |
| `008` | [bloqueo-justo-y-reglas-claras](../008-bloqueo-justo-y-reglas-claras/spec.md) | #653 | 2026-10-30 | Funcionalidad | ✅ Implementada (2026-10-30): T01–T10, 114 tests | — | Solo cuentan los códigos fallados, el bloqueo caduca, IP real con túnel, constitución 4.0 y comandos por sistema |
| `679` | [formato-de-specs-e-historial](../679-formato-de-specs-e-historial/spec.md) | #679 | 2026-10-30 | Proceso | ✅ Implementada (2026-11-04): T01–T17, 113 tests | — | Specs por número de issue, este historial, resumen único, constitución 4.1, borra `001`–`004` y quita las referencias a specs de tests y código |

## Ideas sin spec

| Idea | Notas |
| --- | --- |
| Bot de Discord | Fuera del MVP |

## Specs descartadas

Ninguna. Una spec de funcionalidad que no sirve al propósito (constitución §1) y se descarta se anota aquí con su issue y el motivo.
