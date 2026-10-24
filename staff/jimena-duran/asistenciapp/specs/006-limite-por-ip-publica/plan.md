# Plan 006 · Control de intentos de registro

Responsable: Jimena Durán.
Estado: preparado por petición expresa junto a spec y tareas; implementación pendiente de aprobación.
Spec: [spec.md](spec.md). Referencia técnica: PR #261, commit 9c251eb.

## 1. Base y alcance

Rama: `jimena-duran-23102026`, creada directamente desde
`origin/staging` en `8b5e696696df640a80b90b0d6fc09625ba7b1fd6`.
Esa base contiene las specs 001–005 y las correcciones LF/CRLF de Jimena.
Toda escritura de proyecto se limita a `staff/jimena-duran/asistenciapp/`.
La futura PR apuntará a staging y requiere autorización; ahora no se publica.
No se copia la implementación del profesor: se conservan las funciones, errores,
tipos y responsabilidades de la aplicación de Jimena.

## 2. Identidad y limitación aceptada (CA-07)

`app.py` obtiene exclusivamente `request.remote_addr`. Configurar explícitamente
`ProxyFix(..., x_for=0, x_proto=1, x_host=1)` para conservar la dirección de
conexión y el tratamiento actual de esquema y host públicos.
No leer IPs del JSON ni confiar en `X-Forwarded-For` o `CF-Connecting-IP`.
Las pruebas asignan `REMOTE_ADDR` para simular conexiones diferentes.

Con Cloudflare Tunnel la conexión que recibe Flask puede ser la de cloudflared,
habitualmente `127.0.0.1`, no la IP pública individual del alumno. Todos los
alumnos identificados con esa dirección comparten ambos límites y el bloqueo
permanente. Esta versión no garantiza una IP pública individual ni que sea estática.
En ejecución local también se aplica a la dirección local de conexión.
Es la decisión aprobada para igualar al profesor. No se añaden cabeceras de
identidad, proxies confiables, modos nuevos ni mecanismos alternativos.

## 3. Flujo y contratos (CA-01 a CA-06)

Solo cuenta `POST /api/s/<session_id>/checkin`, independientemente de clase,
nombre o código válidos. El recuento se comparte entre clases para cada IP.
Páginas, consultas y rutas del profesor no cuentan.

1. Comprobar si la dirección ya está bloqueada; si lo está, lanzar `Banned`
   sin anotar un nuevo intento ni registrar asistencia.
2. Anotar el intento con el instante inyectado; podar los anteriores a `instant - 60`.
3. Contar para esa dirección las horas `>= instant - 1` y `>= instant - 60`.
4. Si el recuento supera 5 o 20, guardar el bloqueo y lanzar `Banned`.
5. En otro caso, seguir el flujo actual: sesión, estado, nombre, código y registro.

La respuesta de `Banned` es HTTP 429 con JSON `error` y texto exacto:
«Esta dirección queda bloqueada por haber superado los intentos permitidos.»
El formulario actual ya presenta `data.error`; no se modifica `static/`.

Conservar `create_app(db_path, token, now)` y pasar `now()` como instante numérico,
como hace Jimena hoy. Ampliar `attendance.check_in` con una IP explícita requerida;
adaptar llamadas y ejemplos internos, sin reemplazar el instante por una función
de reloj como en la referencia. Conservar `prepare(path, token)`.
`check_in` mantiene su retorno `(fila, creado)` cuando no hay bloqueo.
Los estados 400, 404, 409, 422, duplicados, autenticación y CSV no se relajan.

## 4. Reparto por arquitectura y almacenamiento

| Archivo | Cambio previsto |
| --- | --- |
| `asistencia/domain/attempts.py` | Máximos, regla de exceso y error `Banned`; sin HTTP ni SQLite. |
| `asistencia/storage/sqlite.py` | Tablas y operaciones de anotar, contar, podar, consultar y guardar bloqueo; sin decidir máximos. |
| `asistencia/usecases/attendance.py` | Coordinar recuentos, regla, bloqueo y registro existente. |
| `app.py` | Obtener dirección y traducir `Banned` a 429; no abrir la base. |

Añadir tablas con `CREATE TABLE IF NOT EXISTS` al esquema que prepara el almacén:

| Tabla | Campos | Conservación |
| --- | --- | --- |
| `registration_attempts` | `id`, `ip`, `attempted_at` Unix REAL | Podar horas estrictamente anteriores al último minuto al procesar intentos no bloqueados. |
| `blocked_ips` | `ip` como clave, `blocked_at` ISO UTC | Permanente; sin operación de desbloqueo. |

Usar el mismo `data/asistencia.db`, consultas parametrizadas y cierre de conexiones
como en el almacén existente. No borrar ni reconstruir tablas previas.
No añadir columna IP, vínculos a nombres ni identificadores de clase a `checkins`.
La poda se ejecuta al recibir intentos; no es una tarea en segundo plano y puede
dejar intentos antiguos en disco mientras no haya nuevos intentos que la ejecuten.
No se incorporan mejoras adicionales de infraestructura respecto a la referencia.

## 5. Documentación y compatibilidad (CA-08, CA-09)

Tras aprobación, enmendar únicamente P4 de `docs/CONSTITUTION.md`, el encabezado
y el historial a versión 3.0: permitir IPs exclusivamente para recuento y bloqueo,
sin asociarlas al registro de asistencia. Mantener los demás principios y §6
como en la referencia; la 006 añade un control concreto sin cambiar el puzzle.
No llevar máximos, aviso ni duración de blacklist a la constitución.

Actualizar README con límites, persistencia, ausencia de desbloqueo y limitación
del túnel; corregir la afirmación de que no se almacena ninguna IP.
Añadir responsabilidad de attempts al documento de arquitectura y seguimiento
de la 006 en AGENTS.md sin reescribir los estados históricos anteriores.

Adaptar `test_architecture.py` y `test_sdd_rules.py` a la versión vigente 3.0
en el encabezado, preservando puertas SDD y hashes de la spec 001.
Extender la comprobación del README para autorizar solo los nuevos textos de
la 006; mantener una comparación histórica y pruebas que rechacen otros cambios.
No sustituir el hash por una comprobación débil ni recalcularlo sin contrastar
la base histórica. Conservar normalización exclusiva CRLF a LF.
Specs 001–005 e integrity.json de la 005 se conservan sin cambios.
`static/` y `asistencia/domain/codes.py` deben conservar sus bytes versionados.

## 6. Plan de pruebas

| Criterios | Cobertura prevista |
| --- | --- |
| CA-01 | 5/6 y 20/21; ventanas móviles, bordes exactos, expiración y límite global entre clases; separar los 20 intentos para no disparar el límite por segundo. |
| CA-02, CA-08 | Registro válido, duplicados, suite actual de códigos, estados de sesión, autenticación, eliminación y CSV. |
| CA-03 | Fallos de código, nombre, clase inexistente o cerrada cuentan; lecturas, páginas y panel no cuentan. |
| CA-04 | 429 y mensaje exacto, blacklist efectiva y ausencia de asistencia en el intento que excede cualquiera de los máximos. |
| CA-05 | Código correcto rechazado tras bloqueo, bloqueo entre clases y sin nuevos intentos anotados. |
| CA-06 | Reabrir con el mismo archivo, avanzar el reloj y verificar que no caduca; otra IP sigue operativa. |
| CA-07 | IP falsa en JSON y ambas cabeceras no modifica REMOTE_ADDR; dirección real queda bloqueada y la falsa no. |
| CA-09 | Privacidad y versión vigente, datos separados, preparación de una base previa sin pérdida y límites entre capas. |

Crear pruebas propias en `test_attempts.py`, `test_blocklist.py` y
`test_rate_limit.py`, usando bases temporales y reloj controlado. Extender las
comprobaciones documentales existentes para la 006. Primero comprobar fallos
esperados de las nuevas pruebas; después implementar.
Ejecutar la suite completa en copias temporales con LF y CRLF; registrar resultados
reales y revisar `git diff --check`. No ejecutar `hack-etico.sh`, levantar túneles
ni alterar bases locales con datos reales.

## 7. Comprobación de la constitución

- P1: no añade dependencia de una plataforma de clase.
- P2: conserva las capas y SQLite concretos; sin interfaces ni servicios nuevos.
- P3: ninguna dependencia nueva; Flask, pytest y biblioteca estándar.
- P4: necesita la enmienda 3.0 propuesta; no almacenar IPs antes de aprobarla.
- P5: sin cambios visuales; mensaje en el formulario existente.
- P6: documentación y aviso en español.
- §5: todos los criterios tienen comprobaciones previstas; suite completa obligatoria.
- §6: código, duplicados, cierre y validación conservados; el control nuevo se
  documenta en la 006 conforme a la decisión de referencia.

## 8. Puerta de implementación

La petición expresa de Jimena autoriza preparar conjuntamente estos documentos.
No autoriza aún código, tests nuevos, cambios de constitución ni publicación.
Presentar spec, plan y tareas y esperar aprobación para comenzar.

## Resultado local

Implementaci?n autorizada y verificada el 2026-10-23. Suite completa: 183 pruebas
pasan con LF y 183 con CRLF. Specs 001?005, static/ y codes.py coinciden con
los 23 hashes de la base registrados en integrity.json. Sin commit, push ni PR.
