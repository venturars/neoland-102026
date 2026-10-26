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


## Publicación y dependencias · 2026-10-24

Implementación guardada y subida en la rama 300-feat-limit-automated-checkin-attempts, con commit inicial y tres commits de trabajo separados. La PR de 006 no se abre aún: primero deben integrarse #252 (004) y #284 (005), para que el diff de 006 contra staging no mezcle esos pasos ni obligue a renovar revisiones por sus merges. T11 conserva su casilla pendiente hasta abrir esa PR y solicitar las revisiones de Dietor878, ChangVictor y sergiocortessat. Sergio ya está solicitado en las PRs anteriores.

Copias, bases ficticias y capturas de salida temporales eliminadas tras registrar los resultados. Se conserva únicamente la captura del mensaje de bloqueo y el repaso de estudio fuera del repositorio. El servidor temporal se detuvo y su puerto quedó cerrado.

## Verificación adicional con túnel real · 2026-10-24

Miguel autorizó después de la verificación inicial probar un túnel real y el script de clase antes de empezar la mejora propia. Se amplía únicamente la verificación, sin cambiar el comportamiento ni los criterios de aceptación.

- Copia desechable de la app, base nueva con nombres ficticios y token efímero. No se usaron datos ni servicios de clase existentes.
- cloudflared 2026.10.3 oficial, descargado temporalmente y verificado contra su SHA-256 publicado. Túnel real conectado a Cloudflare. La resolución local del nombre temporal falló; se utilizó DNS-over-HTTPS de Cloudflare solo en los procesos de prueba, sin modificar el DNS del equipo. Cliente fijado a IPv4 para conservar el mismo origen entre peticiones.
- Registro previo con código válido: 201. Una asistencia ficticia guardada.
- Script original asistencia/hack-etico.sh, sin modificaciones, limitado a 32 códigos incorrectos y 8 peticiones en paralelo: 5 respuestas 422 y 27 respuestas 429 observadas en el servidor. Salida 1, sin código encontrado. Se excluyeron del rango los códigos válidos de las ventanas próximas para probar el bloqueo, no la probabilidad de acertar antes del límite.
- Comprobación de la base: una asistencia previa conservada, cero registros del nombre utilizado por el script y una dirección bloqueada.
- Código válido después del bloqueo: 429 con mensaje español de bloqueo permanente. Tras reiniciar la aplicación sobre la misma base: 429 otra vez.
- Petición con CF-Connecting-IP, X-Forwarded-For y X-Real-IP inventados: 403 no JSON recibido antes de la app; no se guardó ninguna dirección inventada ni otra asistencia. Esta respuesta del servicio previo no demuestra por sí misma el rechazo de cabeceras dentro de Flask; esa parte permanece cubierta por las pruebas automatizadas.
- Consultar la clase tras el bloqueo: 200. Consultar las sesiones privadas sin token: 401; con token: 200.
- Servidor y túnel detenidos; puerto confirmado cerrado. Copia, binario temporal y base ficticia eliminados. Resultado sin IPs, token ni URL del túnel conservado fuera del repositorio en 006-live-security-results.json.

La primera ejecución encontró un error en la decodificación del secreto en el arnés externo de prueba; se corrigió allí, sin modificar código de la app. La ejecución final completó todas las comprobaciones anteriores. No se presenta este barrido acotado como una auditoría general ni como prueba de imposibilidad de acertar un código antes del límite. Los bordes exactos de las ventanas y el máximo de veinte por minuto siguen verificados en la suite automatizada anterior de 145 pruebas. No se cambió código de producto.

T11 sigue pendiente por la publicación de la PR; las revisiones e integración mantienen sus condiciones anteriores.


## Publicación autorizada · 2026-10-26

Miguel ordenó «sube todas las prssss omggg». Esta instrucción sustituye la espera de publicación condicionada a las predecesoras: se publica esta tarea ahora con base fija staging y sus dependencias pendientes explícitas. La PR es [#353](https://github.com/venturars/neoland-102026/pull/353), asignada a mglnglxx. No se autoriza merge sin las revisiones requeridas. Las aprobaciones y pruebas anteriores no se atribuyen a compañeros. Se conservan commits separados por tarea; los cambios acumulados de la base se explican en la descripción y se ofrece comparación exclusiva del paso.
