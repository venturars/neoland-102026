# Plan 008 · Proteger el registro de carrera

Estado: spec, plan y tareas aprobados por Miguel. Implementada y verificada en copia local autorizada el 2026-10-24; 218 pruebas de aplicación pasan; también pasan las dos reproducciones originales del review. Resultado local aprobado por Miguel el 2026-10-25; publicación pendiente. Enmienda 4.0 aplicada solo en esta copia; la constitución de la copia original sigue intacta. [Spec aprobada](spec.md). Este documento concreta el contrato de seguridad del [plan 007](https://github.com/venturars/neoland-102026/issues/325); 007 consumirá sus resultados.

## 1. Alcance y puertas previas

008 implementa dominio, roster, persistencia, acciones y HTTP de carrera, sus pruebas y la enmienda 4.0. 007 conserva generador/ruta QR SVG, interfaz, dibujos, animaciones y enmienda 4.1. La seguridad se verifica con clientes de prueba sin esperar a las pantallas de 007. No se añaden dependencias a Flask, pytest y la biblioteca estándar actuales; qrcode no se instala en 008.

La issue propia es [#328](https://github.com/venturars/neoland-102026/issues/328), creada con título y assignee aprobados. Miguel aprobó expresamente la excepción «Proceed locally; publish later»: implementación y pruebas en una copia local separada, sin publicar mientras staging no contenga las predecesoras necesarias. La enmienda 4.0 propuesta y aprobada se aplica solo en esa copia. T02 conserva pendiente su parte de rama/PR draft aislada a staging; no se publica un diff acumulado, no se cambia base para encadenar PRs y no se usa la rama 300 para 008. La evidencia no sustituye revisión de Miguel ni aprobaciones de compañeros.

## 2. Código actual contrastado

- app.py autentica /api/sessions y subrutas con X-Teacher-Token. El POST de registro habitual ejecuta guard_registration antes de leer el cuerpo; esa precedencia se conserva para clases normales y desconocidas.
- attendance.teacher_view muestra código a toda sesión sin closed_at: necesita distinguir carrera, lobby y cuenta atrás. public_session también deriva open solo de closed_at.
- storage/sqlite.py usa with conn en create_session, add_checkin, close_session y remove_checkin: no son primitivas seguras para una transacción de carrera ya abierta. Sus contratos normales se conservan; las carreras usan SQL sin commits internos.
- Las asistencias tienen ID AUTOINCREMENT y nombre normalizado único por clase. El listado normal ordena checked_at, id. La clasificación de carrera usará ID de confirmación, sin alterar el orden normal ni sus fechas.
- domain/codes.py acepta código actual o ventana anterior de treinta segundos. Se reutiliza esa regla, sin generar ni guardar códigos nuevos.
- origin.py determina origen directo o Cloudflare explícito; ProxyFix tiene x_for=0. Se reutiliza para validar el origen de un intento de carrera, sin almacenar su dirección o consultar el bloqueo IP de 006.
- tests/test_architecture.py fija Versión 3.0. Solo se actualizará esa expectativa al aplicar la enmienda aprobada, conservando las comprobaciones de reglas, capas e historial.

## 3. Archivos y responsabilidades

| Archivo | Responsabilidad |
| --- | --- |
| asistencia/domain/roster.py, nuevo | Quince nombres y character_slug de 007, clave estable y normalización existente. Única lista ejecutable del roster; sin imágenes ni acceso a ejercicios en ejecución. |
| asistencia/domain/race.py, nuevo | Fases, constantes 3 intentos/3 segundos/7200 segundos, reglas y errores de negocio; datos y reloj recibido, sin SQL, Flask o I/O. |
| asistencia/storage/races.py, nuevo | Conexión de carrera y SQL concreto sin commit interno, índices y lecturas; no decide permisos, fase o presupuesto. |
| asistencia/storage/sqlite.py | Añadir esquema sin alterar tablas anteriores. Sus helpers normales no cambian de contrato. |
| asistencia/usecases/races.py, nuevo | Preparar, lobby, entrar, recuperar plaza, retirar, iniciar, consultar, intentar, cerrar, quitar asistencia y limpiar; decide transacciones, usa dominio y almacén. |
| asistencia/usecases/attendance.py | Distinguir modo en consultas, rechazar check_in directo para carreras y delegar cierre, retirada y exportación de carrera. Sin importar Flask. |
| asistencia/race_http.py, nuevo | Registrar rutas concretas en la app y adaptar autenticación, cookie, CSRF, cuerpo, origen y errores; sin SQL ni lógica de contador. |
| app.py | Registrar adaptador y limpieza previa; decisión de desvío de la ruta antigua mediante caso de uso. Sin acceso directo al almacén. |
| tests/test_race_domain.py, test_race_storage.py, test_race_usecases.py, test_race_api.py, test_race_concurrency.py y test_race_live_http.py, nuevos | Pruebas de reglas, restricciones, transacciones, permisos y simultaneidad; fixtures locales ficticias. |
| tests/test_architecture.py y pruebas de regresión existentes | Extender límites de capas a módulos nuevos, aplicar versión aprobada y conservar contratos anteriores. |
| docs/CONSTITUTION.md, docs/ARCHITECTURE.md, AGENTS.md, README.md | Enmienda, contrato HTTP y uso técnico verificable sin presentar el juego como terminado. |

Una función por acción concreta. Tipos, docstrings, :param, :return, :rtype y Usage:: según AGENTS.md. Nada de repositorios genéricos, colas o servicios aparte. La autenticación del profesor sigue en el borde HTTP; los casos de uso de administración no se exponen por otra ruta pública. La posesión del archivo de datos o la ejecución de código local no se presenta como una frontera frente a quien ya controla el ordenador.

## 4. Datos aditivos y restricciones

Se añaden cuatro tablas; las existentes sessions, checkins, config, registration_attempts y blocked_addresses no se reconstruyen ni convierten. Las filas previas no adquieren modo carrera.

| Tabla | Campos y restricciones |
| --- | --- |
| races | session_id PK/FK a sessions; prepared_at REAL; starts_at REAL nullable; expires_at REAL = prepared_at + 7200; join_secret TEXT nullable. La fila identifica el modo permanentemente. sessions.closed_at es la autoridad de cierre. |
| race_slots | PK(session_id, roster_key), FK a races; display_name, character_slug; included_at_start con CHECK 0/1; estado limitado a pendiente/listo/registrado/retirado; checkin_id nullable FK a checkins ON DELETE SET NULL. Quince filas creadas al preparar; no se borran/recrean para liberar una ocupación. |
| race_access | PK/FK compuesta a race_slots; credential_hash UNIQUE NOT NULL. Máximo un acceso vigente por plaza; borrar/reemplazar únicamente al retirar/ocupar durante lobby. Se comprueba su carrera en cada consulta. |
| race_operations | PK(session_id, roster_key, operation_id), FK compuesta a race_slots; attempt_no con CHECK 1–3 y UNIQUE(session_id, roster_key, attempt_no); payload_fingerprint, state con CHECK reserved/completed, result_kind y result_status nullable solo en reserved, checkin_id nullable ON DELETE SET NULL. Máximo tres filas por plaza, cuarenta y cinco por carrera. |

El consumo se obtiene contando race_operations; no hay un segundo contador que pueda divergir. Cada reserva confirmada cuenta, tanto state=reserved como state=completed. Una fila reserved significa consumo duradero sin resultado confirmado; no se libera, borra o reutiliza por timeout, caída o reinicio. No hay leases ni recuperación que autorice reevaluarla. La caducidad de la carrera sí elimina esos datos según el contrato. Las restricciones exigen resultado nulo en reserved y resultado final en completed. result_kind y estado de plaza se validan contra valores permitidos. No se guarda el código enviado, el correcto, una IP, email o identificador persistente de dispositivo.

El secreto de la clase ya existente se reutiliza para códigos y, con separación de propósito, para la huella HMAC-SHA256 de la operación. Se serializa un contenido normalizado y acotado, con tipos explícitos para distinguir ausente, no-string y string; no se guarda ese contenido. Código string: recortar espacios como la regla actual, cuatro dígitos ASCII para una evaluación. Otros formatos autorizados gastan una operación fallida sin llamar al validador. La huella incluye carrera, plaza y prefijo race-operation-v1. Comparaciones de hashes/huellas con compare_digest.

El permiso de plaza se genera con secrets.token_urlsafe(32); solo se guarda SHA-256 del permiso. El secreto QR también es aleatorio de 32 bytes, pero se conserva en claro únicamente durante lobby porque el profesor debe recuperar el mismo enlace al recargar. Se borra al dar Go o cerrar. Las operaciones y hashes de acceso desaparecen al caducar; los metadatos no secretos y las asistencias permiten reconstruir la carrera cerrada. Los estados retirados impiden que una referencia checkin_id borrada reaparezca como éxito.

Índices: races.expires_at; las PK y UNIQUE anteriores para plazas, accesos y operaciones. Todas las conexiones activan foreign_keys. No se amplía la duración del acceso por consulta, inicio, cierre o reinicio.

## 5. Conexiones, reloj y atomicidad

storage/races.py abre conexiones de carrera con timeout=0.5, isolation_level=None y autocommit=sqlite3.LEGACY_TRANSACTION_CONTROL explícito, row_factory y foreign_keys. Se usa BEGIN IMMEDIATE y commit/rollback explícito por mutación; finally cierra la conexión. Las conexiones normales conservan su configuración. No compartir conexiones entre hilos ni reutilizar una conexión de otro request.

No llamar a create_session/add_checkin/close_session/remove_checkin existentes dentro de esa transacción: sus with conn confirmarían parte de la operación. Las primitivas nuevas ejecutan SQL sin commit. init_schema/executescript ocurre solo en inicialización fuera de transacciones de acciones.

El reloj es callable inyectable: now se obtiene después de adquirir el bloqueo de escritura. No pasar un instante calculado por el HTTP antes de esperar. Lecturas usan una instantánea coherente; la consulta autorizada revalida caducidad con el reloj del servidor antes de devolver datos privados. Una consulta que ya encuentra caducidad ejecuta la limpieza y rechaza el acceso temporal.

Las mutaciones distintas de attempt mantienen una transacción. attempt tiene dos transacciones deliberadas: **A reserva y confirma consumo; B evalúa y confirma resultado/asistencia/cierre**. Solo tras retorno satisfactorio del commit de A se permite evaluar. Una excepción o confirmación incierta de A nunca lleva a B: consultar después con la misma operation_id mostrará la reserva si existe, sin reevaluarla; si no existe, un envío posterior puede reservarla por primera vez porque no hubo evaluación previa.

La conexión de carrera usa synchronous=FULL. La garantía presupone que SQLite y el almacenamiento conservan los commits confirmados; restaurar o manipular el archivo de datos está fuera de la frontera de usuario remoto. No se guarda ningún código entre A y B.

Bloqueo superior a 500 ms antes de reservar: 503, Retry-After: 1, sin evaluación ni consumo. Si la reserva ya existe y B no logra obtener escritura, devolver 202 con state=unconfirmed y el presupuesto gastado: no lanzar B de nuevo ni prometer que se reintentará. Un fallo de SQL/commit en B devuelve error técnico genérico con indicación de consultar estado; revierte solo los cambios de B, nunca la reserva confirmada en A. No afirmar que el código era correcto/incorrecto. Una pérdida de respuesta de commit puede ser incierta: la consulta posterior distingue completed de reserved desde la base real.

Solo la invocación que acaba de confirmar una reserva nueva puede entrar una vez en B. Ese derecho es una variable local de esa invocación, no un dato aceptado del cliente, una ruta pública, una lease o un secreto recuperable. Ninguna lectura, repetición, reinicio ni tarea de fondo obtiene ese derecho. Si el proceso muere entre A y B, o durante B, la operación queda sin confirmar y gastada; no se recupera evaluándola. Mientras la invocación original siga activa puede completar B una vez; un 202 no demuestra que haya terminado.

### Fases

Primero cerrada si closed_at existe; caducada si now >= expires_at, con cierre efectivo antes de admitir operaciones; lobby si starts_at es nulo; cuenta_atras si now < starts_at; registro en otro caso. El arranque y el reloj no reabren una clase cerrada. Los dos motivos de final no conceden otra duración de lectura.

### Preparar, entrar y dar salida

1. Preparar genera sesión, secreto de clase, carrera, secreto de entrada y quince plazas en una transacción. Título: contrato actual; sin asistencias. Roster y personajes son snapshots de esa carrera.
2. lobby exige secreto de entrada válido, vigencia y fase lobby. Devuelve nombres/personajes y disponibilidad; no secretos, asistencia privada o código.
3. join comprueba fase y secreto, después ocupación. Con permiso vigente de la propia plaza devuelve esa misma plaza, sin cambiar nombre. Un competidor pierde con 409; nunca recibe el permiso ganador. Crear hash de acceso y marcar listo se confirman juntos; el borde entrega la cookie solo tras commit.
4. Si la respuesta se pierde antes de establecer cookie, la plaza puede quedar ocupada: no se recupera un permiso con solo repetir el nombre. El profesor puede retirar en lobby; revoca el hash y vuelve pendiente esa misma fila.
5. start exige al menos una plaza lista y lobby vigente. Fija included_at_start, starts_at=now+3 y borra join_secret. Dos starts devuelven la misma salida si ya se inició; si está cerrada/caducada no la reabren. Entradas concurrentes quedan antes o después de esa transacción.

### Intento y recuperación, orden obligatorio

El borde valida cuerpo acotado, controles de navegador y origen fiable antes de llamar a attempt. El origen se transmite como dato validado a la acción y se comprueba sin almacenarlo; ausencia o formato inválido produce 403 sin evaluar ni gastar. No se llama a guard_registration.

**Transacción A: reserva duradera, sin evaluación de código**

1. Adquirir BEGIN IMMEDIATE; obtener now del servidor y comprobar carrera, permiso y caducidad antes de cualquier resultado privado. Si caducó, cerrar/limpiar y confirmar limpieza antes de 410; no revertirla al traducir el error.
2. Comprobar plaza fijada y retirada. La retirada responde con ese estado sin devolver éxitos antiguos.
3. Buscar operation_id válida en la plaza. Si existe, comparar huella antes de devolver éxito: contenido distinto da 409 sin evaluación ni reserva. Misma huella con completed recupera el resultado vigente; con reserved devuelve 202 state=unconfirmed, remaining y mensaje «Este envío aún no tiene resultado confirmado. El intento sigue gastado. Consulta tu estado». Nunca ejecuta B. Estos resultados pueden consultarse tras cierre hasta expires_at.
4. Sin operación existente y plaza ya registrada, devolver su asistencia real sin evaluar ni reservar. No afirmar que el código nuevo es correcto.
5. Para operación nueva exigir fase open y menos de tres filas, incluidas reserved. Cerrada/countdown: 409; agotada: 429. Nunca comparar un código para elegir el error.
6. Insertar attempt_no siguiente con UUID y huella. UUID ausente/inválida: generar identificador interno y completar fallo 400 sin evaluación; código ausente/mal formado con UUID válida: completar fallo 422 sin evaluación. Para código de formato correcto guardar state=reserved, resultado nulo. Confirmar A. Tras fallo o commit incierto de A no ejecutar B ni reenviar automáticamente.

**Transacción B: una ejecución de la reserva recién creada**

7. Solo el creador local de una nueva reserva confirmada abre BEGIN IMMEDIATE una vez. Volver a obtener now y comprobar permiso, fase, caducidad, plaza fijada y ausencia de asistencia/retirada. No se comprueba «quedan intentos» de nuevo: la tercera reserva conserva derecho a su única evaluación. Si cierre, caducidad, retirada o un éxito de la misma plaza ganaron entre A y B, no evaluar: completar resultado de no procesado si la reserva sigue vigente o limpiar si caducó; el consumo no se devuelve. Un éxito existente se muestra desde su fila real, sin insertarlo otra vez.
8. Mientras mantiene el bloqueo de escritura, llamar una vez a is_valid_code. Incorrecto: completar fallo 422. Correcto: insertar checkin con el nombre canónico y hora de B, enlazar y marcar plaza registrada. Si todos los incluidos ya tienen asistencia, cerrar en B. Confirmar resultado, asistencia y cierre juntos. Clasificación por ID de checkin; nunca orden de reservas A.
9. Si B falla después de evaluar, rollback solo de B; A permanece reserved. No ejecutar otra vez B, aunque el cliente repita el mismo ID. Antes de evaluar tampoco se elimina una reserva si se abandona B. No convertir reserved en un resultado falso de código ni refundar el presupuesto. Un resultado completed se recupera sin evaluación aunque su respuesta se haya perdido.

Las lecturas /me y de operación reflejan estado guardado, no una respuesta cacheada. /me incluye un resumen propio de las operaciones (máximo tres: operation_id y state), para distinguir resultado confirmado de reserva sin confirmar; ninguna permite recuperar permisos ni códigos. El cliente consulta estado al recibir 202 o error incierto; no crea UUID ni envíos nuevos automáticamente. Si decide un envío nuevo, utiliza otra UUID y otra oportunidad disponible; dos solicitudes distintas de una plaza pueden reservar antes de B, pero B serializa la asistencia y nunca crea dos registros. Las reservas que queden sin evaluación siguen gastadas.

Los resultados de negocio se traducen después de confirmar su transacción. No lanzar excepciones dentro de with conn que reviertan por accidente consumo o limpieza. La reserva A y su ausencia de reevaluación son parte del límite duro de 3/45, también con inyección de fallos; no se limita la prueba a contar operaciones que lograron terminar.

### Cerrar, quitar asistencia y caducar

close es idempotente, también durante lobby/cuenta atrás. Borra join_secret y establece closed_at; el estado de fase revoca toda escritura aunque todavía existan hashes para lectura. No borra operaciones hasta expires_at, incluidas las reserved, para conservar consumo y recuperar respuestas perdidas. Cerrar entre A y B impide evaluar en B, sin devolver la oportunidad. Cerrar una carrera sin registros es válido; no inicia un grupo vacío ni crea puestos.

remove_checkin verifica la clase y el registro, marca retirado, borra checkin y deja referencias nulas en una transacción. Recalcula posiciones desde filas reales. Puede actuar antes o después del cierre/caducidad con permiso de profesor, pero nunca reactiva una plaza; los accesos temporales caducados siguen inválidos.

Antes de admitir peticiones se consulta trabajo de caducidad por índice y se limpia globalmente lo vencido; también en inicialización, antes de servir. Solo se abre escritura si alguna carrera vencida sigue abierta o conserva join_secret, accesos u operaciones; no se reescriben continuamente carreras antiguas ya limpias. Bajo escritura se vuelve a leer el reloj. Se cierra si falta, se borran secretos/accesos/operaciones de carrera y se conservan clases/plazas/asistencias. No se llama a limpieza de 006 ni se borra su blacklist. Si una limpieza necesaria falla no se permite usar por ello un acceso vencido; no se informa de éxito de la operación pendiente.

## 6. HTTP y contrato para 007

Todas las respuestas incluyen JSON de negocio con errores en español, excepto el QR SVG que 008 no implementa. phase usa lobby/countdown/open/closed/expired; los nombres ingleses son identificadores internos. El usuario verá textos españoles desde 007.

| Ruta | Permiso y respuesta |
| --- | --- |
| POST /api/sessions/races | X-Teacher-Token; título opcional; 201 con id, title, phase y tiempos. |
| GET /api/sessions/<id>/race | Profesor; id/title, roster con estados y puestos confirmados, phase, serverNow/startsAt/expiresAt; joinUrl solo en lobby; code/secondsLeft solo open. |
| POST /api/sessions/<id>/race/start | Profesor; salida existente o nueva y fase. Vacío 409, cerrado/caducado no inicia. |
| POST /api/sessions/<id>/race/release | Profesor; roster_key, solo lobby; 200 o 409. |
| POST /api/sessions/<id>/race/close | Profesor; cierre y clasificación vigentes. |
| POST /api/races/<id>/lobby | Secreto de entrada en cuerpo, X-Race-Request: 1; roster y disponibilidad solo durante lobby. |
| POST /api/races/<id>/join | Igual, más roster_key; cookie tras ocupación; respuesta propia con personaje y fase. |
| GET /api/races/<id>/me | Cookie; solo su plaza, phase, intentos restantes, estado/resultado y resumen de operaciones propios, serverNow/startsAt/expiresAt y csrfToken. Nunca código, otra operación o permiso. |
| POST /api/races/<id>/attempt | Cookie, X-Race-CSRF, origen fiable; operation_id y code; resultado/error propio y presupuesto confirmado. |

Tiempos numéricos Unix en segundos, comunes a las respuestas. checkin conserva checkedAt ISO actual y, cuando procede, position calculada. Las respuestas recuperadas reflejan la asistencia retirada; no se reproduce a ciegas un JSON antiguo de éxito. Para slot registrado se puede mantener remaining=3-count sin ofrecerlo como derecho a enviar otro código.

Estado 202: envío reservado sin resultado confirmado, sin reevaluación al consultar. Errores: 400 operación inválida; 401 profesor ausente/falso; 403 acceso de plaza falso/revocado/ajeno, CSRF u origen no fiable, o vía habitual incompatible; 404 clase inexistente; 409 ocupada/fase/contenido repetido distinto; 410 caducidad o entrada ya cerrada; 413 cuerpo excesivo; 415 tipo no permitido; 422 código fallido; 429 presupuesto agotado; 503 ocupación temporal; 500 fallo inesperado genérico. Errores anteriores a autorización no revelan plazas privadas ni código. La acción de cierre de profesor conserva acceso al historial después del vencimiento; caduca el permiso del alumno, no el token persistente del profesor.

### Cookie, CSRF y secreto de entrada

- Cookie con nombre específico de carrera, Path=/api/races/<id>, sin Domain, HttpOnly, SameSite=Strict, Expires y Max-Age sin superar expires_at. Permiso solo en cookie, nunca en JSON, URL o localStorage. Hash de acceso verificado con compare_digest; caducidad también en servidor aunque el navegador conserve cookie.
- Secure obligatorio con el modo de túnel configurado explícitamente; no decidir rebajarlo por una cabecera de esquema elegida por el visitante. La excepción de HTTP local solo se permite en configuración de desarrollo explícita con conexión loopback. No ampliar la confianza en ProxyFix o reenviados para obtener origen.
- CSRF: HMAC con secreto de clase, prefijo race-csrf-v1, carrera y permiso vigente; /me lo entrega solo a quien ya posee su cookie. Validar con compare_digest, exigir JSON y X-Race-CSRF en attempt. El token no identifica al alumno ni repone consumo.
- El origen autorizado se configura desde la base_url real conocida al arrancar el túnel, o el origen loopback explícito en desarrollo; los tests lo inyectan. Se usa también para construir joinUrl. No se deriva de Host/X-Forwarded-Host enviados por el visitante; sin configuración válida no se prepara una carrera. app.py configura ese valor después de obtener la URL del túnel y antes de empezar a servir.
- lobby/join exigen JSON, X-Race-Request: 1 y join_secret vigente. Sin CORS ni formularios alternativos; rechazar Sec-Fetch-Site: cross-site, y Origin presente que no coincida con el origen autorizado del servicio. La ausencia de Origin/Sec-Fetch-Site en un cliente de prueba no sustituye secreto/cookie/cabeceras. El objetivo es evitar envíos desde otra página, no detener un script que conoce el enlace compartido.
- Cache-Control: no-store en todas las respuestas de carrera, también errores; no registrar cookies, CSRF, código, secretos o cuerpos. Solo registrar clase de fallo inesperado sin datos sensibles ni volcar variables.
- joinUrl será race.html?r=<id>#join=<secret>, sin token del profesor. El secreto se pasa en cuerpo para entrar, nunca query string. La lectura/eliminación del fragmento y su conservación breve en sessionStorage pertenecen a 007; 008 publica el enlace, pero no crea race.html ni genera QR. La comprobación de acceso no depende de que exista esa página.

### Cuerpos y trabajo acotados

Límite de rutas nuevas de escritura: 2048 bytes leídos, incluido cuerpo sin Content-Length conocido; 413 antes de procesar exceso. No imponer ese límite global a rutas normales. Tipo distinto de application/json: 415 sin evaluación. JSON no válido o raíz no objeto: para attempt autorizado, tratar como operación ausente fallida, con consumo solo dentro de fase/presupuesto; para las otras acciones, 400 sin mutaciones. La autenticación, CSRF y origen se comprueban antes de reservar el intento.

Longitudes: session_id según formato existente, roster_key de la lista fija, secretos base64url de longitud esperada, UUID canónica de 36 caracteres, code string de cuatro dígitos tras trim. Extraños tipos o campos no eligen clase, plaza, reloj, fase o presupuesto. Los campos desconocidos se ignoran consistentemente en las rutas nuevas; nunca se usan como autoridad. En attempt, un campo name o mode extra no cambia la plaza ni el modo. Los tests verifican exactamente esta decisión, sin dejarla abierta a la implementación. El título conserva el contrato existente; su cuerpo queda acotado por el límite nuevo.

La espera SQL de 500 ms por transacción, cuerpos de 2 KiB y límites de 15/45 acotan trabajo y almacenamiento por carrera. No hay límite colectivo de códigos, bloqueos nuevos de IP ni crecimiento de operaciones por accesos no autorizados. No se promete inmunidad a saturación del servidor/red o acaparamiento del lobby.

## 7. Integración con las vías existentes

1. Añadir acción de solo lectura para consultar modo por ID. En POST /api/s/<id>/checkin, carrera conocida recibe 403 «Esta clase usa carrera. Abre tu acceso de carrera» antes de guard_registration y sin comparar código. Para normal o inexistente, mantener guard, lectura/validación, respuesta y precedencia actuales. La clase no cambia de modo después de crearse.
2. attendance.check_in rechaza carrera también desde terminal, antes de validate_check_in; no es suficiente proteger la ruta HTTP. No añadir un parámetro público skip_security o mode elegido por el cliente. Una llamada local a una primitiva SQL no se presenta como cliente soportado.
3. teacher_view delega carrera en lectura de races y conserva el contrato normal. open significa registro abierto en carrera; code/secondsLeft ausentes en lobby/countdown/closed/expired. public_session conserva título/open sin revelar lista, permisos, enlace o código. list_sessions puede añadir mode para carreras sin cambiar respuestas normales; no cuenta lobby como asistencia.
4. close_session y remove_checkin delegan en acciones de carrera, conservando 404/contratos normales. No llamar a un helper que confirme dentro de la acción de carrera. El flujo antiguo del profesor tampoco puede dejar registrado un éxito retirado o abierto un permiso de escritura.
5. export_session conserva formato CSV y filas reales. Para carrera entrega las asistencias ordenadas por ID confirmado; para normal, checked_at,id como antes. No exporta lobby, presupuestos o accesos.
6. La autenticación de /api/sessions y subrutas cubre las rutas nuevas; mantener X-Teacher-Token, sin query pública. El adaptador proporciona al futuro generador QR de 007 una consulta autorizada de enlace/estado, sin que 007 consulte SQL o reconstruya secretos revocados.

## 8. Texto de enmienda 4.0 aprobado y aplicado solo en esta copia

Base de partida: 3.0. Enmienda 4.0 aprobada y aplicada en esta copia el 2026-10-24. El texto siguiente conserva la propuesta sometida a aprobación. Solo 008 aplica estos textos y la fila 4.0, con fecha real de ratificación. La aprobación de spec no aprueba silenciosamente esta enmienda. Solicitar que Miguel ratifique su texto antes de aplicarlo; 007 aplicará su añadido 4.1 por separado.

**P4, añadido:** «Se permite una lista local de nombres y personajes de clase como referencia previa, sin atribuir presencia. En modo carrera se acepta el nombre seleccionado y se guardan temporalmente plazas, permisos y operaciones necesarias para limitar sus intentos. No identifican dispositivos entre clases ni se vinculan a direcciones de seguridad. Los secretos de entrada se revocan al cerrar las altas; los permisos de registro al cerrar o cancelar la carrera. La lectura privada del propio resultado y los datos temporales caducan como máximo dos horas después de preparar la carrera y se eliminan en la siguiente petición o inicialización antes de aceptar operaciones. Se conservan asistencias y metadatos no secretos necesarios para consultar el grupo y resultado. Los enlaces de entrada y permisos solo transitan hacia los navegadores de la clase; no se registran en logs ni se envían a servicios externos.»

**§6, sustituir el punto de intentos:** «Las clases normales conservan los límites de cinco intentos por segundo móvil y veinte por minuto móvil por dirección, con bloqueo permanente de 006. En clases de carrera se usa un QR vigente para ocupar una única plaza por nombre del roster mientras el lobby esté abierto; Go fija el grupo y cierra nuevas ocupaciones y reemplazos. Cada plaza tiene tres comprobaciones totales, incluida la correcta, con reserva atómica previa a evaluar el código. Cambiar navegador, dirección, nombre o rotación del código no repone oportunidades; la ausencia de acceso válido impide comprobar. Las repeticiones de una misma operación no añaden comprobaciones y no permiten probar contenido distinto. El agotamiento afecta solo a esa plaza; no se aplican a las plazas de carrera bloqueos colectivos por IP. Se valida el origen fiable en ambos modos. La entrada automática no identifica a una persona ni impide que alguien ocupe nombres ajenos; se acepta esa limitación para el juego de clase.»

Fila de historial: versión 4.0, fecha real de ratificación, P4/§6 excepción de carrera con plazas, entrada automática, presupuesto y accesos temporales; motivo: permitir la clase en Wi-Fi compartida sin quitar el control de conjeturas. El resto de principios/historial se conserva. La referencia a QR describe el acceso que dibujará 007; no obliga a 008 a generar imágenes.

## 9. Comprobación de la constitución

| Regla | Resultado previsto |
| --- | --- |
| Propósito | Asistencia real, sin inventar presencias para llenar la parrilla. |
| P1 | Sin login de Discord/GitHub/Meet; roster local. |
| P2 | Reglas y cuatro tablas concretas, máximo 45 operaciones; nada de cuentas o infraestructura adicional. No añade un paso al introducir el código. |
| P3 y §3 | Stack actual sin dependencias nuevas; conexión estándar, reglas y HTTP en capas existentes. |
| P4 | Requiere enmienda 4.0 antes de código; no IP asociada a alumnos, ni emails o datos ajenos; caducidad máxima y limpieza. |
| P5 | Errores legibles y datos de fase/presupuesto para interfaz móvil; las pantallas y su revisión visual son de 007. |
| P6 | Spec, plan, mensajes y documentos españoles; identificadores técnicos ingleses. |
| §4 | Spec, plan y tareas aprobados; implementación local autorizada, enmienda 4.0 aplicada solo en la copia y resultado pendiente de revisión de Miguel. |
| §5 | Matriz de los 24 criterios y tests antes de implementación; regresión completa sobre copia ficticia. |
| §6 | Excepción propuesta explícita; ninguna alteración silenciosa de 006. Código de cuatro cifras y cierre se mantienen. |
| §7–§8 | Solo nuestra app, sin tocar ejercicios; ratificación de enmienda por Miguel e historial intacto. |

## 10. Pruebas antes de implementación y evidencia

Nueva suite en copia con base temporal ficticia, reloj inyectado, token de prueba y secretos no reales. Registrar versiones/runtime y baseline vigente; no atribuir de nuevo las 145 pruebas anteriores. Pruebas por comportamiento, no búsqueda de texto para simular seguridad. Cada módulo de pruebas se prepara antes de su código; un fallo por funcionalidad ausente se registra, no se marca como implementación completada.

| Criterio 008 | Prueba automatizada y resultado esperado |
| --- | --- |
| CA-01 | Preparación con/sin token: solo profesor crea una clase y quince plazas únicas; no checkins; carrera nueva no acepta secretos anteriores. |
| CA-02 | Dos conexiones por nombre: una ocupación; 50 altas a 15 nombres: máximo 15; variantes normalizadas sin plaza extra; ninguna respuesta entrega el permiso de otro. |
| CA-03 | Retirar en lobby, revocar cookie anterior y reocupar misma fila; tras Go 409 y ningún reemplazo. |
| CA-04 | Sin ocupantes no inicia; barrera entre join/start: incluido antes o rechazo después, grupo fijo; QR secreto deja de funcionar. |
| CA-05 | Reloj antes/en salida, doble start, otra ventana y reinicio: starts_at único, código solo open, cierre antes de salida nunca reabre. Validar actual/anterior según regla existente. |
| CA-06 | Falta/falsedad/carrera ajena/revocación en accesos; profesor protegido; no código en JSON alumno ni consultas viejas, no consumo ajeno. |
| CA-07 | Formatos ausente, no-string y código inválido consumen; tercero correcto registra; cuarto correcto/incorrecto no invoca is_valid_code. |
| CA-08 | 50 operaciones concurrentes de plaza: máximo tres operaciones confirmadas y llamadas de evaluación; 15 plazas con dos fallos y último fallo: máximo 45, sin checkins ficticios. |
| CA-09 | Dos fallos, reinicio, rotación, dirección distinta y un último intento; cookie borrada/QR repetido tras Go sin reposición; retirada de asistencia no repone. |
| CA-10 | 15 clientes con la misma IP consiguen éxito; 50 envíos adversarios no agotan otras plazas. IP ya bloqueada en modo normal no bloquea carrera ni pierde su bloqueo normal. |
| CA-11 | Origen ausente, cabeceras de IP falsificadas y túnel/directo; 403 sin consumo, sin código evaluado y sin direcciones guardadas con la plaza. |
| CA-12 | POST normal para carrera y llamada directa check_in: rechazo sin guard/validador; mode/name manipulados no desvían la acción; consultas antiguas no filtran código. |
| CA-13 | Barrera tras commit A: mismo ID/cuerpo obtiene 202 sin evaluar; solo creador entra en B. Tras completed recupera resultado. Mismo ID distinto código en reserved o completed: 409. UUID inválida gasta fallo solo cuando corresponde. |
| CA-14 | Respuesta perdida de fallo, éxito y último éxito: recuperar completed tras cierre sin gasto; reserved devuelve unconfirmed sin evaluación. /me muestra solo las operaciones propias hasta expires_at. |
| CA-15 | Inyectar fallo antes/durante commit A: no evaluación; si quedó reserva, conservarla. Caída tras commit A, fallo tras evaluar/insertar/antes de commit B: A persiste y B no deja asistencia parcial. Repetir y reiniciar nunca reevalúan reserved. Tres reservas con fallos mantienen el techo de tres llamadas; cuarto rechazado. Dos registros con misma hora: orden de confirmación B, no de reserva A. |
| CA-16 | Barreras entre A/B: cierre o caducidad ganan sin comprobación posterior; último éxito y cierre manual serializan B. Repetir cierre conserva closed_at; vacío no autocierra. |
| CA-17 | Borrar asistencia por la ruta existente y la acción de carrera, en abierto/cerrado y tras caducar: puestos recalculados, sin resucitar checkin ni gasto nuevo. |
| CA-18 | Reabrir app con misma base en lobby/countdown/open/closed: grupo, presupuesto y permisos vigentes conservados; nunca desplaza la salida. |
| CA-19 | 7199, 7200 y 7201 segundos desde preparar, con éxito/operación guardados: /me y /attempt leen solo antes del límite; después no comparan código ni devuelven éxito. |
| CA-20 | Caducidad de varias carreras, siguiente petición e inicialización: cerrar/borrar todos los temporales vencidos; mantener recientes, plazas, asistencias y blacklist. Segunda pasada sin escritura repetida innecesaria. |
| CA-21 | Inspección de filas/logs/respuestas: sin códigos en claro, permiso solo hash salvo secreto de entrada durante lobby; no IP/nombre mezclados ni secretos públicos. |
| CA-22 | 413 con/sin Content-Length, 415, JSON inválido, CSRF ausente/falso, Origin ajeno, Host reenviado manipulado y cross-site; sin validación ni crecimiento extra. Bloqueo antes de A: 503 sin consumo; después de A: 202 con consumo reservado y sin evaluación. Error de commit incierto: consultar estado sin volver a ejecutar una reserva existente. |
| CA-23 | Suite completa anterior y comparativa de clases normales/errores/CSV, datos y definiciones anteriores intactos. Comprobar guard precede validación para ID inexistente como antes. |
| CA-24 | Ensayo HTTP completo con Flask test_client y reloj, sin race.html: preparar → lobby → join → Go → códigos → resultado → cierre. Campos y errores exactos del contrato para 007. |

Concurrencia con conexiones SQLite independientes sobre archivo, barreras y resultados invariantes; no sleeps arbitrarios para conseguir carreras aparentes. Contar invocaciones del validador por una envoltura de prueba sin sustituir la regla de código. Exigir el techo de 3/45 invocaciones reales del validador también con fallos SQL, caídas entre A/B y reinicios. Las reservas abandonadas cuentan aunque nunca hayan evaluado; los resultados completed nunca se reevalúan. Inyectar fallo de confirmación después de un commit real para verificar también la respuesta perdida: recuperación, no doble inserción.

Ensayo adicional de red local/túnel sobre copia ficticia: comprobar cookie Secure/HttpOnly/SameSite y un ciclo de acceso real sin pantallas del juego, más la convivencia 15+50 acotada. No atacar sesiones ajenas ni lanzar un barrido exhaustivo. Guardar comandos/resultados sanitizados; parar todos los procesos propios y comprobar puertos libres. Las capturas del juego, escaneo móvil y revisión de los dibujos son evidencia posterior de 007.

## 11. Revisión interna del plan

- Se evitan commits internos y relojes anteriores al bloqueo. A confirma consumo antes de evaluar; B confirma resultado/asistencia/cierre juntos. Un rollback de B no devuelve el intento de A.
- La caducidad precede al éxito guardado; la operación con contenido distinto se rechaza antes de devolver ese éxito. Retirada y vencimiento prevalecen sobre resultados viejos.
- Una repetición de reserved nunca obtiene derecho a evaluar; no hay leases ni reanudación después de reinicio. El creador local es el único ejecutor posible de B, una vez.
- Se separan consultas del resultado y comprobaciones de código: cerrar revoca escritura, pero conserva lectura propia hasta el límite original.
- La vía habitual rechaza carreras antes del guard IP; las llamadas de terminal no se saltan esa distinción. No hay un parámetro elegido por el alumno para cambiar el modo.
- El origen autorizado y el enlace compartido salen de la configuración real del servicio, no de cabeceras manipulables; los campos desconocidos tienen una decisión explícita de ignorar sin autoridad.
- La limpieza no reescribe carreras ya limpias; el JSON mal formado autorizado consume solo dentro de fase/presupuesto, sin confundir fallos de transporte con una evaluación nueva.
- Se conserva el contrato para 007 sin crear sus pantallas ni QR. El backend se verifica con clientes de prueba y tiene su propia issue/PR a staging, todavía no creadas.

Resultado documental: plan preparado para aprobación separada. Ninguna prueba descrita se presenta como ejecutada y ninguna enmienda se aplica durante la redacción.

## Fuentes primarias consultadas

- [Python sqlite3: transacciones y conexiones](https://docs.python.org/3/library/sqlite3.html): control explícito y cierre; se comprobará el runtime instalado antes de ejecutar.
- [OWASP: gestión de sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): permisos aleatorios, cookie protegida y caducidad en servidor.
- [OWASP: CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): cabecera propia, secreto ligado al acceso y rechazo de solicitudes de otro origen; SameSite es una defensa adicional.

## Corrección tras la revisión de rollback · pendiente de aprobación

2026-10-24: Miguel pidió corregir spec y plan. Se sustituye la transacción única de intento por reserva duradera A y resultado B. Se revisan estados, respuestas 202/503, recuperación, caída del proceso, cierre entre fases y pruebas de fallos; 3/45 se exige también con fallos. Esta revisión no aplica enmiendas ni implementa código y espera aprobación junto con la spec corregida.

## Aprobación del plan corregido

2026-10-24: Miguel indicó «Approved, prepare the tasks for 008 and review them properly before I approve them». Aprueba la spec corregida y el plan 008 con reservas duraderas A/B, incluida su coordinación del caso de fallo con 007. Las tareas 008 se presentan para aprobación separada. No se atribuye ejecución ni aplicación de la enmienda.

## Registro de ejecución local autorizado

2026-10-24: Miguel aprobó crear la issue y avanzar localmente sin publicar. El ensayo de red T46 queda reproducible en tests/test_race_live_http.py; la comparación aditiva T45 usa tests/fixtures/008-baseline.sql, extraído del esquema 006 anterior y contrastado con el manifiesto de partida. Son evidencias de las comprobaciones ya previstas, sin ampliar el comportamiento del producto. Véase [evidence.md](evidence.md).

## Correcciones de implementación R1/R2

Aplican el contrato ya aprobado: reloj fresco después de esperas y antes de devolver resultados privados, y 503 ante contención anterior a reserva. La fase B conserva 202 o fallo técnico incierto según la frontera alcanzada; ningún cambio permite repetir la evaluación o devolver consumo. Evidencia y regresiones en [evidence.md](evidence.md).
