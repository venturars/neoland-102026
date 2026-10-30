# Arquitectura de AsistenciApp

La aplicación conserva sus pantallas y comportamiento; cada parte tiene una responsabilidad.

## Estructura de carpetas

```text
asistenciapp/
├── AGENTS.md              # proceso y estilo de código
├── README.md              # uso de la app
├── docs/
│   ├── CONSTITUTION.md     # principios y seguridad
│   └── ARCHITECTURE.md     # estructura y responsabilidades
├── specs/                 # spec, plan, tareas y evidencia
├── requirements.txt
├── pytest.ini
├── app.py                 # HTTP y arranque
├── asistencia/
│   ├── domain/            # reglas de negocio
│   ├── usecases/          # coordinación de operaciones
│   ├── storage/           # conexiones y operaciones SQLite; roster.py para catálogo
│   │   ├── queries/roster/ # seis consultas del catálogo
│   │   └── data/initial-students.csv # grupo inicial de una sola carga
│   ├── origin.py          # origen fiable de la conexión
│   ├── race_http.py       # adaptador HTTP de carrera
│   ├── qr.py              # generación local del QR
│   ├── export.py          # formato CSV
│   └── tunnel.py          # acceso mediante túnel
├── static/                # pantallas y activos
├── tests/
├── .venv/                 # entorno local, fuera de Git
└── data/                  # datos locales, fuera de Git
```

El árbol muestra las partes relevantes. `.venv/` y `data/` se crean al preparar o ejecutar la app; no tienen que existir en una copia nueva del código.

## Responsabilidades

| Parte | Responsabilidad | Dependencias |
| --- | --- | --- |
| `asistencia/domain/` | Códigos, nombres y validez de una sesión o registro. | Biblioteca estándar; nunca almacenamiento, Flask ni casos de uso. |
| `asistencia/storage/` | Conexiones, esquema y operaciones SQLite concretas. | Biblioteca estándar; nunca reglas de asistencia ni HTTP. |
| `asistencia/usecases/` | Abrir, consultar, registrar, cerrar, eliminar y obtener datos de exportación. | Dominio y almacenamiento; devuelve datos o errores de negocio. |
| `app.py` | Peticiones HTTP, autenticación del profesor, respuestas, URL pública y arranque. | Casos de uso, formato CSV y túnel; sin acceso directo a SQLite. |
| `static/` | Pantallas del profesor y alumnado. | API existente; sin acceso al archivo de datos. |

Un registro entra por app.py: la acción obtiene la sesión, aplica las reglas de dominio y pide al almacén guardar el resultado. La entrada HTTP traduce los datos y errores a las mismas respuestas de antes. La autenticación se mantiene en el borde HTTP. Las acciones abren una conexión por operación y la cierran también ante errores; las escrituras conservan sus transacciones.

El archivo `data/asistencia.db` conserva sus tablas de asistencia, secretos, token y registros. 006 añade tablas de seguridad separadas, sin convertir ni modificar los datos anteriores. `asistencia/export.py` conserva el formato CSV; `asistencia/tunnel.py` conserva la publicación del servicio. No se añaden repositorios genéricos ni otras persistencias. 007 añade únicamente qrcode==8.2 para generar QR SVG localmente.

Las reglas vigentes están en [CONSTITUTION.md](CONSTITUTION.md); el proceso y la escritura de funciones, en [AGENTS.md](../AGENTS.md). Las specs 001–004 conservan los nombres que tenían sus documentos: AGENT.md pasó a AGENTS.md y CONSTITUTION.md pasó de la raíz a docs/. Los enlaces actuales se mantienen en el README y el manual.

## Correcciones pendientes del código

Los límites anteriores son la referencia para los próximos cambios. 012 retira los datos concretos del alumnado de `domain/roster.py`. El código actual todavía contiene consultas SQL antiguas dentro de las funciones de almacenamiento.

Las siguientes refactorizaciones deberán guardar el texto de las consultas antiguas en archivos separados. Las consultas nuevas del catálogo ya están separadas. Los casos de uso coordinan dominio y almacenamiento; no construyen respuestas del navegador. No se añaden proveedores intercambiables ni una capa genérica de consultas. La spec 010 documenta estos límites; no modifica todavía esas implementaciones.


## Protección 006

`asistencia/origin.py` pertenece al borde de conexión: normaliza el par directo y solo acepta el origen Cloudflare cuando se configura explícitamente ese modo y el par es el conector local. No interpreta X-Forwarded-For como origen; ProxyFix tiene x_for=0. Se mantiene la confianza previa en protocolo y host para construir enlaces.

`domain/registration.py` normaliza direcciones y decide los máximos móviles sin acceder al almacén. `attendance.guard_registration` abre una transacción BEGIN IMMEDIATE: limpieza global, consulta de bloqueo y tiempos, decisión y escritura. Confirma la transacción antes de lanzar un rechazo; otra conexión no puede comprobar el mismo contador en paralelo y admitir intentos de más. `storage/sqlite.py` realiza las operaciones sin decidir límites.

`registration_attempts` guarda solo dirección y tiempo; `blocked_addresses` guarda solo dirección. No hay claves hacia alumnos, clases o registros. Los temporales caducados se borran al atender el siguiente intento, también desde una dirección bloqueada o sin origen válido. La blacklist sobrevive al reinicio. Los errores 429 (bloqueo permanente) y 403 (origen no fiable) se traducen en app.py y los muestra el formulario existente.

La frontera Cloudflare presupone el conector local controlado por quien ejecuta la app. No protege contra procesos maliciosos que ya pueden acceder al propio ordenador; no se anuncia como identificación de personas ni de IPs estáticas. Fuentes: [cabeceras Cloudflare](https://developers.cloudflare.com/fundamentals/reference/http-headers/) y [ProxyFix](https://werkzeug.palletsprojects.com/en/stable/middleware/proxy_fix/).


## Registro de carrera 008

[Issue #328](https://github.com/venturars/neoland-102026/issues/328). Implementación en copia local autorizada; publicación pendiente de sus predecesoras en staging. La presentación, el QR y los dibujos pertenecen a [007](https://github.com/venturars/neoland-102026/issues/325).

- `domain/roster.py` valida y resuelve alumnos recibidos como datos explícitos; `domain/race.py` contiene fases, máximos y resultados. El catálogo actual procede del almacenamiento descrito en 012.
- `storage/races.py` ejecuta SQL concreto sin commits internos. Sus conexiones activan claves externas y synchronous=FULL, con espera máxima de 500 ms. Las cuatro tablas nuevas son aditivas: races, race_slots, race_access y race_operations. No se modifica el esquema ni los datos previos de asistencia y 006.
- `usecases/races.py` coordina cada transacción y lee el reloj después de adquirir el bloqueo de escritura. No depende de Flask. El permiso de plaza se guarda como hash; el secreto compartido de entrada solo permanece durante el lobby.
- `asistencia/race_http.py` traduce las nueve rutas, autentica el acceso del alumno, comprueba origen/CSRF y limita el cuerpo a 2048 bytes. La autorización de profesor sigue en app.py. No ejecuta SQL. Todas las respuestas de carrera, incluidos errores y consultas antiguas identificadas como carrera, llevan Cache-Control: no-store.

### Reserva A y resultado B

A obtiene BEGIN IMMEDIATE, valida acceso/fase/presupuesto y confirma una fila reserved antes de llamar al validador. Las reservas cuentan dentro de las tres oportunidades. Una operación existente devuelve su resultado completed o 202/unconfirmed, pero nunca obtiene permiso para ejecutar B. Repetir su UUID con otro código devuelve 409.

Solo la invocación que creó y confirmó A recibe una función local de un uso para llamar a B. Captura los datos validados en el servidor y no admite datos nuevos al ejecutarse. Una marca privada protegida con Lock se consume antes de B y no se restablece ante fallos. No se entrega la función si el commit A falla o es incierto; no se reconstruye al repetir una operación. B toma otro bloqueo, vuelve a leer reloj/acceso/fase y evalúa una vez. Resultado, asistencia, puesto y posible cierre se confirman juntos. Los puestos se derivan del ID de las asistencias, aunque sus fechas sean iguales.

Si B falla, su rollback conserva A. No hay reanudación, devolución de oportunidades ni reintento automático. Si el resultado se confirmó y se perdió la respuesta, repetir recupera la asistencia real. Un commit incierto de A nunca habilita B. La tercera reserva válida puede ganar aunque ya queden cero oportunidades libres.

Un bloqueo antes de reservar devuelve 503 sin consumo. Después de reservar, un bloqueo impidiendo B devuelve 202 con consumo; un fallo técnico devuelve 500 y pide consultar el estado. Una operación distinta solo se crea por un nuevo envío intencional del participante.

### Resultados internos de 011

El dominio expresa rechazos mediante `RaceError.reason`, sin códigos de respuesta. Los intentos devuelven `(data, result_kind)`; las consultas conservan sus diccionarios. `race_http.py` traduce motivos y resultados a los estados y cabeceras HTTP anteriores, sin un estado de éxito por defecto para valores desconocidos.

`storage/races.py:complete_operation` conserva la codificación antigua de `result_status` para no migrar el esquema. Los casos de uso recuperan `result_kind`, sin usar ese número. Un éxito guardado conserva su 201 antiguo, pero recuperarlo devuelve 200; una fila reserved sigue sin resultado y devuelve 202. Los datos anteriores se comprueban en los fixtures generados con 010 y en tests/test_race_refactor.py.

### Contrato que consume 007

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


## Presentación de carrera 007

[Issue #325](https://github.com/venturars/neoland-102026/issues/325). Implementada en copia local sobre el backend 008 aprobado por Miguel; publicación pendiente. La enmienda 4.1 permite qrcode==8.2 sin extras; colorama es transitiva en Windows.

- `asistencia/qr.py` recibe un enlace autorizado y produce SVG negro sobre blanco con margen de cuatro módulos. No consulta datos, registra secretos ni llama a servicios externos.
- GET `/api/sessions/<id>/race/qr.svg` pertenece al adaptador `race_http.py`: exige profesor, obtiene el enlace de entrada del caso de uso y solo devuelve imagen durante el lobby. Lleva no-store también en errores; después de Go/cierre/caducidad devuelve 410. Esta es la única ruta que añade 007.
- `profesor.html` y `profesor.js` permiten elegir una carrera nueva y abrir la presentación. Las clases normales usan sus operaciones anteriores.
- `race-display.html/js` consultan el estado privado del profesor, cargan el QR mediante cabecera y un blob local revocable, ofrecen Go/cierre/retirada/CSV y dibujan los resultados confirmados. El código solo se muestra en fase abierta. Dos ventanas usan el mismo startsAt del servidor.
- `race.html/js` retiran el fragmento de la barra, conservan temporalmente la entrada en sessionStorage y la borran al ocupar plaza o cerrar las altas. El permiso emitido por 008 permanece en cookie HttpOnly. El script no puede leerlo ni añadirlo a un enlace.
- Un envío guarda temporalmente su UUID y código antes del POST. Un reintento explícito conserva ambos. 202 o fallo técnico llevan a consultar el estado sin crear otra operación automática; los datos pendientes se eliminan al resolverla, cerrar o caducar. El presupuesto y las transacciones A/B siguen siendo propiedad exclusiva de 008.
- Cada pantalla mantiene una sola petición API activa, con espera de acciones del usuario, pausa al ocultarse, timeout de ocho segundos y backoff de uno a ocho segundos. La cuenta atrás local es visual: no abre permisos. Volver de la caché reinicia la consulta y el reloj visual.
- `race-renderer.js` recibe el roster y las asistencias del servidor. Usa textContent, un conjunto de slugs de activos permitidos y nodos estables; no mantiene otra lista ejecutable de nombres. La llegada anima transformaciones, sin calcular ganadores. El podio deriva de las asistencias actuales y se recalcula tras retirar una.
- `race.css` adapta parrilla, controles, formulario y podio a móvil y escritorio; prefers-reduced-motion omite la llegada animada. Los quince SVG locales no contienen scripts, eventos ni recursos remotos. Referencias en [RACE-ASSETS.md](RACE-ASSETS.md).

007 no modifica las tablas ni los casos de uso de 008. Continúan vigentes el bloqueo de rutas normales para una carrera, las tres reservas por plaza, la caducidad previa a recuperar resultados y la limpieza del backend. Pruebas y límites reales: [evidencia de 007](../specs/007-carrera-de-asistencia/evidence.md).


## Presentación 009

`race-theme.css`, acotado a `body.race-ui`, comparte paleta y controles entre panel y pantallas de carrera. `race.css` conserva la disposición. La entrada normal del alumno sigue con sus estilos anteriores. No se añaden dependencias, rutas, tablas o estados de negocio.

`race-finale.js` calcula tramos decorativos con tiempo recibido: ganador 0–2000 ms; 3/2/1 entre 2000 y 5000; llegada hasta 13000; podio después. Calcula la duración creciente de cada puesto confirmado, sin ordenar resultados. Sus pruebas se ejecutan con `node --test tests/browser/test-race-finale.mjs`.

`race-display.js` mantiene una ejecución local por cierre observado, con instante monotónico y firma de checkins. El polling no repone el reloj. El temporizador visual existente dibuja el tramo; animationend y promesas de animaciones no deciden el final. La primera consulta ya cerrada muestra directamente resultados. La ocultación pausa movimientos y, al volver, una consulta fresca valida el resultado antes de representar el progreso real. Retirada, pérdida de autorización, movimiento reducido y salida de página cancelan la ejecución anterior.

`race-renderer.js` asocia resultados y nodos por clave de plaza del roster y anima desde el origen hacia la meta. Registrar solo actualiza el estado y puesto; CSS no desplaza el kart. Las medidas se recalculan tras resize manteniendo progreso y duraciones. La escena final usa el mismo roster, oculta los no registrados durante el recorrido y conserva la clasificación completa y las acciones del profesor. El podio se dibuja solo con las asistencias vigentes.

El reloj final es local a la presentación, distinto del startsAt compartido del registro. No identifica personas ni concede permisos de comprobar códigos. Evidencia: [009](../specs/009-refinar-presentacion-de-carrera/evidence.md).


## Catálogo de alumnos y personajes · 012

`storage/roster.py` lee el catálogo `students`, su indicador `student_catalog_version` en `config`, los datos iniciales de `storage/data/initial-students.csv` y las referencias de SVG locales existentes. Las seis consultas están en `storage/queries/roster/`. El dominio valida registros y resuelve nombres con datos explícitos, sin archivos ni base de datos. `usecases/roster.py` coordina los estados sin confirmar transacciones.

La primera creación de una carrera prepara los quince alumnos originales solo si tabla e indicador están ausentes. La tabla, alumnos, indicador y carrera se confirman en el mismo `BEGIN IMMEDIATE` de `races.prepare`, sin `executescript`. Un catálogo preparado se lee en su orden guardado; no se contrasta ni repone desde el CSV. Vacío produce `catalog_empty`; estado incoherente, datos inválidos o fallo de lectura producen `catalog_unavailable`. No se repara automáticamente. Una respuesta perdida después de confirmar no borra lo confirmado ni permite deducir que falta la preparación.

Cada carrera guarda su propia correspondencia en `race_slots`: cambios del catálogo solo afectan a carreras nuevas. `join` y `release` resuelven contra esas plazas, sin depender del catálogo actual. No se cambian operaciones A/B, credenciales, intentos, vigencia, asistencias ni limpieza de temporales. El catálogo no se enlaza a direcciones de seguridad.

El adaptador traduce los dos motivos a 409/503. El panel muestra el mensaje como texto al crear carreras; 401, fallos de red y clases normales conservan su tratamiento anterior. No hay edición de alumnos, administración multigrupo, API nueva ni dependencia nueva. La separación del SQL antiguo sigue pendiente.
