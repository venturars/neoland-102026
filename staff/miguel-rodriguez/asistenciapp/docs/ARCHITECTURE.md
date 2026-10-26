# Arquitectura de AsistenciApp

La aplicación conserva sus pantallas y comportamiento; cada parte tiene una responsabilidad.

| Parte | Responsabilidad | Dependencias |
| --- | --- | --- |
| `asistencia/domain/` | Códigos, nombres y validez de una sesión o registro. | Biblioteca estándar; nunca almacenamiento, Flask ni casos de uso. |
| `asistencia/storage/` | Conexiones, esquema y operaciones SQLite concretas. | Biblioteca estándar; nunca reglas de asistencia ni HTTP. |
| `asistencia/usecases/` | Abrir, consultar, registrar, cerrar, eliminar y obtener datos de exportación. | Dominio y almacenamiento; devuelve datos o errores de negocio. |
| `app.py` | Peticiones HTTP, autenticación del profesor, respuestas, URL pública y arranque. | Casos de uso, formato CSV y túnel; sin acceso directo a SQLite. |
| `static/` | Pantallas del profesor y alumnado. | API existente; sin acceso al archivo de datos. |

Un registro entra por app.py: la acción obtiene la sesión, aplica las reglas de dominio y pide al almacén guardar el resultado. La entrada HTTP traduce los datos y errores a las mismas respuestas de antes. La autenticación se mantiene en el borde HTTP. Las acciones abren una conexión por operación y la cierran también ante errores; las escrituras conservan sus transacciones.

El archivo `data/asistencia.db` conserva sus tablas de asistencia, secretos, token y registros. 006 añade tablas de seguridad separadas, sin convertir ni modificar los datos anteriores. `asistencia/export.py` conserva el formato CSV; `asistencia/tunnel.py` conserva la publicación del servicio. No se añaden dependencias, repositorios genéricos ni otras persistencias.

Las reglas vigentes están en [CONSTITUTION.md](CONSTITUTION.md); el proceso y la escritura de funciones, en [AGENTS.md](../AGENTS.md). Las specs 001–004 conservan los nombres que tenían sus documentos: AGENT.md pasó a AGENTS.md y CONSTITUTION.md pasó de la raíz a docs/. Los enlaces actuales se mantienen en el README y el manual.


## Protección 006

`asistencia/origin.py` pertenece al borde de conexión: normaliza el par directo y solo acepta el origen Cloudflare cuando se configura explícitamente ese modo y el par es el conector local. No interpreta X-Forwarded-For como origen; ProxyFix tiene x_for=0. Se mantiene la confianza previa en protocolo y host para construir enlaces.

`domain/registration.py` normaliza direcciones y decide los máximos móviles sin acceder al almacén. `attendance.guard_registration` abre una transacción BEGIN IMMEDIATE: limpieza global, consulta de bloqueo y tiempos, decisión y escritura. Confirma la transacción antes de lanzar un rechazo; otra conexión no puede comprobar el mismo contador en paralelo y admitir intentos de más. `storage/sqlite.py` realiza las operaciones sin decidir límites.

`registration_attempts` guarda solo dirección y tiempo; `blocked_addresses` guarda solo dirección. No hay claves hacia alumnos, clases o registros. Los temporales caducados se borran al atender el siguiente intento, también desde una dirección bloqueada o sin origen válido. La blacklist sobrevive al reinicio. Los errores 429 (bloqueo permanente) y 403 (origen no fiable) se traducen en app.py y los muestra el formulario existente.

La frontera Cloudflare presupone el conector local controlado por quien ejecuta la app. No protege contra procesos maliciosos que ya pueden acceder al propio ordenador; no se anuncia como identificación de personas ni de IPs estáticas. Fuentes: [cabeceras Cloudflare](https://developers.cloudflare.com/fundamentals/reference/http-headers/) y [ProxyFix](https://werkzeug.palletsprojects.com/en/stable/middleware/proxy_fix/).


## Registro de carrera 008

[Issue #328](https://github.com/venturars/neoland-102026/issues/328). Implementación en copia local autorizada; publicación pendiente de sus predecesoras en staging. La presentación, el QR y los dibujos pertenecen a [007](https://github.com/venturars/neoland-102026/issues/325).

- `domain/roster.py` contiene las quince correspondencias de nombre/personaje; `domain/race.py` contiene fases, máximos y resultados.
- `storage/races.py` ejecuta SQL concreto sin commits internos. Sus conexiones activan claves externas y synchronous=FULL, con espera máxima de 500 ms. Las cuatro tablas nuevas son aditivas: races, race_slots, race_access y race_operations. No se modifica el esquema ni los datos previos de asistencia y 006.
- `usecases/races.py` coordina cada transacción y lee el reloj después de adquirir el bloqueo de escritura. No depende de Flask. El permiso de plaza se guarda como hash; el secreto compartido de entrada solo permanece durante el lobby.
- `asistencia/race_http.py` traduce las nueve rutas, autentica el acceso del alumno, comprueba origen/CSRF y limita el cuerpo a 2048 bytes. La autorización de profesor sigue en app.py. No ejecuta SQL. Todas las respuestas de carrera, incluidos errores y consultas antiguas identificadas como carrera, llevan Cache-Control: no-store.

### Reserva A y resultado B

A obtiene BEGIN IMMEDIATE, valida acceso/fase/presupuesto y confirma una fila reserved antes de llamar al validador. Las reservas cuentan dentro de las tres oportunidades. Una operación existente devuelve su resultado completed o 202/unconfirmed, pero nunca obtiene permiso para ejecutar B. Repetir su UUID con otro código devuelve 409.

Solo la invocación que creó y confirmó A recibe un derecho local para llamar una vez a B. B toma otro bloqueo, vuelve a leer reloj/acceso/fase y evalúa una vez. Resultado, asistencia, puesto y posible cierre se confirman juntos. Los puestos se derivan del ID de las asistencias, aunque sus fechas sean iguales.

Si B falla, su rollback conserva A. No hay reanudación, devolución de oportunidades ni reintento automático. Si el resultado se confirmó y se perdió la respuesta, repetir recupera la asistencia real. Un commit incierto de A nunca habilita B. La tercera reserva válida puede ganar aunque ya queden cero oportunidades libres.

Un bloqueo antes de reservar devuelve 503 sin consumo. Después de reservar, un bloqueo impidiendo B devuelve 202 con consumo; un fallo técnico devuelve 500 y pide consultar el estado. Una operación distinta solo se crea por un nuevo envío intencional del participante.

### Contrato que consumirá 007

| Ruta | Acceso y datos |
| --- | --- |
| POST `/api/sessions/races` | Profesor; title opcional; 201 con id, title, phase y tiempos. |
| GET `/api/sessions/<id>/race` | Profesor; roster, grupo fijado, asistencias y puestos; joinUrl solo en lobby; code/secondsLeft solo en open. |
| POST `/api/sessions/<id>/race/start` | Profesor; cuerpo JSON; fija startsAt una vez y cierra altas. |
| POST `/api/sessions/<id>/race/release` | Profesor; roster_key; solo lobby; revoca el acceso anterior. |
| POST `/api/sessions/<id>/race/close` | Profesor; cierre idempotente sin inventar registros. |
| POST `/api/races/<id>/lobby` | join_secret y X-Race-Request: 1; disponibilidad sin permisos ajenos. |
| POST `/api/races/<id>/join` | Lo anterior más roster_key; fija cookie propia tras commit; devuelve personaje y estado. |
| GET `/api/races/<id>/me` | Cookie; estado propio, remaining, operations, result y csrfToken. |
| POST `/api/races/<id>/attempt` | Cookie, X-Race-CSRF y origen fiable; operation_id UUID canónica y code. |

phase: lobby/countdown/open/closed/expired. serverNow, startsAt y expiresAt son segundos Unix; startsAt puede ser null. result contiene id, name, checkedAt ISO y position, o null. remaining es 3 menos las operaciones guardadas; no autoriza a enviar tras cerrar o confirmar asistencia. operations muestra únicamente operation_id/state propios; sus estados persistentes son reserved/completed. Un intento reservado sin resultado devuelve operationState=unconfirmed con 202. Nunca se añade una operación automáticamente por esa respuesta.

Rechazos: 400 operación inválida autorizada (gasta oportunidad si procede); 401 profesor sin autorización; 403 acceso/origen/CSRF; 404 carrera inexistente; 409 fase o contenido repetido distinto; 410 entrada cerrada o acceso caducado; 413 cuerpo excesivo; 415 contenido no JSON; 422 código inválido; 429 presupuesto agotado; 500 fallo técnico incierto; 503 ocupado antes de reserva o configuración de origen ausente. Los errores llevan error en español; la respuesta 202 lleva message. Un acierto nuevo devuelve 201 y recuperar uno confirmado devuelve 200.

### Vigencia, origen y compatibilidad

El origen de carrera procede de base_url real configurada por el arranque, nunca de Host/X-Forwarded-Host del visitante. HTTPS es obligatorio para uso compartido; HTTP solo se permite explícitamente para loopback de desarrollo. La cookie es HttpOnly, SameSite=Strict, sin Domain, con Path de su carrera y caducidad original; lleva Secure en HTTPS/túnel. El fragmento #join del enlace no se envía como query al servidor. No se registran códigos, cuerpos, permisos o secretos; un fallo técnico solo registra su clase.

Go fija las plazas ocupadas y startsAt=ahora+3; se revoca la entrada. Cerrar revoca escrituras, pero la lectura propia dura hasta preparedAt+7200. Exactamente en ese límite se rechaza incluso un éxito guardado. La siguiente petición o inicialización cierra las carreras vencidas y elimina accesos/operaciones; conserva asistencias, grupo y blacklist de 006. No se exige limpieza de fondo sin tráfico.

Las rutas antiguas consultan el modo real. Una carrera rechaza el registro habitual y el caso de uso directo antes del guard IP o de comparar códigos. Consultas, cierre, retirada y CSV delegan en las acciones de carrera; retirar asistencia marca su plaza retirada y recalcula puestos sin reabrirla. Una base anterior sin tablas de carrera sigue siendo normal. Las clases normales mantienen precedencia, límites y bloqueo permanente de 006.

La entrada compartida no verifica quién elige cada nombre: alguien puede ocupar nombres ajenos o varias plazas antes de Go. El límite demostrado es tres evaluaciones por plaza y cuarenta y cinco por carrera; no impide la suplantación ni garantiza disponibilidad frente a saturación del servidor.


### Revisión de lecturas y contención 008

Las lecturas privadas de plaza y lobby comprueban el reloj después de cargar los metadatos y otra vez después de cargar el resultado. No devuelven información temporal con un instante capturado antes de una espera. Ante caducidad se revierte la lectura antes de limpiar.

La apertura de conexión y las consultas previas reconocen los códigos SQLite BUSY/LOCKED como contención temporal: 503 antes de una reserva nueva. Las conexiones fallidas durante configuración se cierran. Un bloqueo al entrar en B se traduce a 202 con la reserva de A gastada. Los fallos de escritura/commit posteriores no se reclasifican como intentos libres: mantienen el error técnico y la recuperación sin reevaluación. Los errores de E/S tampoco se etiquetan como un simple bloqueo.
