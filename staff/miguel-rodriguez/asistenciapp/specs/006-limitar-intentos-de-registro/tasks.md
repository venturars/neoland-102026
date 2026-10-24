# Tareas 006 · Protección de intentos

Estado: preparadas y revisadas internamente el 2026-10-24 bajo autorización expresa de Miguel para completar la tarea. [Spec](spec.md), [plan](plan.md), issue #300.

- [x] T01 · Capturar copia anterior sin bases de trabajo ni entorno. Revisar instrucciones, spec y fuentes de confianza. CA-01–CA-12.
- [x] T02 · Redactar y revisar plan, enmienda 3.0 y tareas; registrar la delegación de Miguel sin inventar aprobaciones individuales. CA-11.
- [x] T03 · Añadir pruebas de umbrales, límites móviles, permanencia, limpieza, concurrencia y origen fiable; ejecutar antes de implementar. CA-01–CA-12.
- [x] T04 · Aplicar la enmienda documentada 3.0 conservando los demás principios e historial. CA-11.
- [x] T05 · Añadir reglas puras de límites y errores. CA-01–CA-03, CA-08.
- [x] T06 · Añadir tablas y operaciones de intentos y bloqueo sin modificar las tablas de asistencia. CA-06, CA-09, CA-10.
- [x] T07 · Implementar la acción transaccional de protección con cierre de conexión y errores después del commit. CA-01–CA-06, CA-08–CA-10, CA-12.
- [x] T08 · Resolver origen de conexión y activar la protección solo en checkin; conectar el modo de túnel explícito. CA-04, CA-05, CA-07, CA-10, CA-12.
- [x] T09 · Actualizar README, arquitectura y manual con las reglas actuales y la privacidad. CA-07, CA-11.
- [x] T10 · Ejecutar suite completa y revisar compatibilidad, conservación, concurrencia y origen; corregir las causas de cualquier fallo. CA-01–CA-12.
- [ ] T11 · Registrar evidencia y límites reales, eliminar copias temporales y publicar commits/PR con Sergio añadido como revisor. CA-01–CA-12.

## Resultados

Verificación nueva de 006 el 2026-10-24, en copias desechables y con datos ficticios. Python 3.14.8, Flask 3.1.3 y pytest 9.1.1 del .venv existente; sin instalaciones.

- Referencia previa: `python -m pytest -q -p no:cacheprovider`, 112 pruebas aprobadas en 0,25 s.
- Pruebas nuevas antes de implementar: 26 fallos en 0,23 s por funcionalidades ausentes o comportamiento previo sin protección.
- Primera suite tras implementar: 136 aprobadas y dos fallos en 0,50 s. Los dos eran las expectativas anteriores de versión 2.4 y esquema total sin tablas nuevas. Se actualizaron conforme al plan: versión 3.0 y conservación exacta de las tablas originales, sus definiciones y filas, comprobando además que las dos tablas añadidas estén vacías al inicializar una base anterior.
- Suite final: `python -m pytest -q -p no:cacheprovider`, **145 pruebas aprobadas en 0,56 s**, sin skips. Las 77 pruebas originales no se editaron. Los 33 casos de seguridad nuevos cubren los criterios siguientes.
- Navegador real sobre copia temporal, reloj fijo y servidor solo en loopback con puerto efímero: cinco envíos con código incorrecto producen 422; el sexto produce 429 y el formulario muestra «Esta dirección está bloqueada permanentemente…». Captura conservada fuera del repositorio. No se cambió el frontend.
- Se detuvo el servidor temporal y se confirmó que su puerto estaba cerrado. No se inició un túnel público ni se ejecutó el script de ataque.
- Comparación de contenido: 26 archivos protegidos idénticos, incluidos los quince documentos de specs 001–005, static/, exportador, túnel, script, requisitos y configuración. Las definiciones SQL anteriores son un prefijo intacto del esquema ampliado. `git diff --check` sin incidencias.

| Criterios | Evidencia |
| --- | --- |
| CA-01–CA-03 | Sexto intento, vigesimoprimero distribuido en el minuto, independencia de direcciones y 8 conexiones concurrentes: exactamente cinco admitidas y tres rechazadas. |
| CA-04 | Intentos válidos, duplicados, clase cerrada, ausente, nombre/código incorrecto y JSON no objeto consumen intentos. Consultas, exportación y cierre no los consumen. |
| CA-05 | Cambio de clase/nombre no evita el contador por origen. Formulario y cabeceras Forwarded/X-Forwarded-For/X-Real-IP/CF-Connecting-IP no sustituyen el par en modo directo. Modo de túnel exige conector local y una dirección global válida. |
| CA-06 | Bloqueo confirmado, reloj avanzado y create_app reiniciada sobre la misma base: sigue bloqueado. |
| CA-07 | Error español sin Retry-After ni promesa de expiración. Mensaje mostrado en navegador real. |
| CA-08–CA-09 | Ventanas móviles, bordes exactos 1/60 s, borrado de registros de otras IPs inactivas y conservación de datos recientes y blacklist. También limpia al atender un origen desconocido o bloqueado. |
| CA-10 | Suite completa, token anterior y filas/definiciones anteriores conservados; operaciones privadas y consultas disponibles incluso desde un origen bloqueado. |
| CA-11 | Enmienda 3.0 en P4 y §6, historial añadido y datos de intentos/bloqueo separados sin relación a asistencias. Revisión documental y prueba de límites de dominio. |
| CA-12 | Origen ausente, malformado, cadena de direcciones, dirección no pública en modo túnel y par no local producen rechazo sin asistencia ni identidad inventada. |

## Revisión interna final

La decisión de frecuencia se toma dentro de BEGIN IMMEDIATE para impedir carreras entre conexiones. Los rechazos se lanzan después del commit para no deshacer el bloqueo ni la limpieza. Una excepción controlada durante la escritura revierte el intento y libera la conexión; una nueva conexión puede adquirir el bloqueo de escritura.

Se mantiene explícita la frontera de confianza del conector local. Las pruebas de cabeceras y del arranque con --tunel son simuladas; no acreditan funcionamiento de un túnel real de Cloudflare. No se afirma que la IP sea estática ni que identifique a una persona. Las fuentes oficiales del plan respaldan el contrato de cabeceras, no sustituyen esa prueba real.

La autorización completa de Miguel consta en el spec. Las aprobaciones de compañeros y la integración de 004/005 siguen pendientes; esta revisión interna no las sustituye.
