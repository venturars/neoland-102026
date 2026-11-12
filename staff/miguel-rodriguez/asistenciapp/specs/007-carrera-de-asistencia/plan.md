# Plan 007 · Carrera de asistencia de Halloween

Estado: spec, plan y tareas aprobados por Miguel el 2026-10-24; implementación local autorizada el 2026-10-25 tras aprobar el resultado de 008. Interfaz implementada y verificada por el agente; Miguel probó el recorrido en ordenador y mediante QR en su móvil el 2026-10-25. Publicación pendiente. Issue [#325](https://github.com/venturars/neoland-102026/issues/325); backend [#328](https://github.com/venturars/neoland-102026/issues/328), sin PR publicada. La excepción autorizada permite implementar en copia separada y publicar después con diff exclusivo a staging. Véanse [evidencia](evidence.md) y [revisión](review.md).

## 1. Resultado y alcance

Python y Flask siguen recibiendo peticiones; SQLite conserva clases y asistencias; HTML, CSS, JavaScript y dibujos SVG locales presentan el juego. No hay cuentas, OAuth, admisiones individuales, motores de videojuegos, servicios de IA ni servicios externos para dibujar QR o personajes.

Secuencia: preparar carrera → ocupar nombre mediante QR → Go fija la parrilla → cuenta atrás de tres segundos → código y tres envíos por plaza → cierre automático si todos registran, o manual → animación de resultados → podio. Con una plaza agotada o desconectada se ofrece el cierre manual, sin marcarla presente.

## 2. Dependencia de seguridad y publicación

El contrato aprobado de producto requiere una excepción expresa a la política 006 y datos temporales que hoy P4 no permite. La spec 006 y sus pruebas originales no se reescriben.

Se separará una tarea de seguridad con su propia issue, spec 008, plan, tareas y PR. La [spec 008](../008-proteger-el-registro-de-carrera/spec.md), su plan y sus tareas fueron aprobados por separado. Su implementación local fue aprobada por Miguel el 2026-10-25; issue #328, sin PR publicada. La autorización local posterior permite implementar 007 sin ejecutar todavía el momento Git de T02. La tarea implementará el backend mínimo descrito aquí: plazas, accesos, fases, presupuestos, reintentos y protección de rutas, con las enmiendas pertinentes. La PR de 007 añadirá QR, pantallas, dibujos, animaciones e integración de la presentación sobre ese contrato ya revisado. No se repartirá una misma modificación entre ambas PRs sin dejar un contrato y una responsabilidad claros.

Ambas PRs tendrán base final staging y una issue propia enlazada explícitamente. No se cambian bases para encadenarlas ni se incluye 007 en los commits de 006. Antes de implementar se revisará el estado real de staging y de las PRs predecesoras. El trabajo aún no integrado podrá prepararse localmente, pero no se publicará una PR contra staging cuyo diff mezcle specs anteriores. Antes de implementar 007 se crea su rama propia desde staging y se abre su PR en draft mediante el commit vacío de la issue; se mantendrá en draft durante la implementación. La preparación y aprobación de estos documentos no ejecuta ese momento Git. Este plan no crea ramas ni realiza Git.

**Puertas previas:** aprobación de este plan; creación y aprobación por su proceso de la tarea de seguridad; aprobación y aplicación de las enmiendas antes del código afectado; tareas 007 aprobadas antes de implementar su parte. La aprobación de un documento no se atribuye a otro.

## 3. Responsabilidades y archivos

| Parte | Archivos previstos | Responsabilidad |
| --- | --- | --- |
| Dominio | asistencia/domain/race.py; asistencia/domain/roster.py | Fases derivadas, máximo de tres operaciones, grupo fijado, validación del nombre de roster y orden de llegada. Sin Flask, SQL, reloj global ni I/O. |
| Almacenamiento | asistencia/storage/races.py; ampliación aditiva del esquema en storage/sqlite.py | SQL concreto para carreras, plazas, permisos y operaciones; recibe una conexión, no decide reglas ni hace commits internos. |
| Casos de uso | asistencia/usecases/races.py; integración limitada en usecases/attendance.py | Preparar, entrar, retirar antes de Go, iniciar, consultar estado, comprobar código, cerrar, limpiar y retirar asistencias; transacciones coordinadas por 008; el intento usa reserva A y resultado B separados según su contrato aprobado. |
| Borde HTTP | asistencia/race_http.py; integración en app.py | Cookie temporal, CSRF, entradas acotadas, autenticación del profesor, respuestas y no-cache. Sin SQL ni decisiones de presupuesto. |
| QR | asistencia/qr.py | Generar SVG desde el enlace ya autorizado del profesor; sin llamadas externas. |
| Pantallas | static/race.html, race.js, race-display.html, race-display.js, race.css; integración en profesor.html/profesor.js | Alumno: nombre, espera, código e intentos. Profesor: QR, parrilla, Go, resultados y podio. |
| Dibujo compartido | static/race-renderer.js; static/race-characters/<slug>.svg | Montaje de tarjetas/karts con DOM seguro, dibujos locales y animación del orden ya confirmado. |
| Documentación y pruebas | tests/test_race_*.py, docs/CONSTITUTION.md, ARCHITECTURE.md, AGENTS.md, README.md, docs/RACE-ASSETS.md | Evidencia por criterio, reglas vigentes y créditos/referencias de los quince dibujos. |

La spec de seguridad será responsable de los cuatro primeros bloques y de sus pruebas de contrato; 007 consumirá ese backend. No habrá gestores genéricos de repositorios, un servidor aparte ni persistencia alternativa. Las funciones nuevas tendrán tipos, responsabilidad, parámetros, resultado y ejemplo según AGENTS.md.

## 4. Modelo aditivo de datos

No se renombra ni reconstruye ninguna tabla existente. La presencia de una fila en races identifica permanentemente el modo carrera de esa clase; el cliente no elige ese modo en cada envío.

- **races:** session_id como clave y referencia a sessions; prepared_at; starts_at nullable; expires_at = prepared_at + 7200; join_secret nullable. Se crea con la sesión y el secreto de entrada en una misma transacción. sessions.closed_at sigue siendo la autoridad de cierre. El secreto QR es aleatorio de 32 bytes, necesario solo durante el lobby para que el profesor pueda recuperar el mismo QR tras recargar. Se borra al iniciar o cerrar y nunca se escribe en logs.
- **race_slots:** clave compuesta (session_id, roster_key); nombre de presentación y character_slug congelados para esa carrera; included_at_start; estado básico; referencia nullable al checkin confirmado. Se crean exactamente las quince plazas desde el roster del servidor. No se eliminan/recrean para liberar un nombre. Sus metadatos no secretos permiten reconstruir el resultado una vez borrados los accesos temporales.
- **race_access:** una fila por plaza; SHA-256 del permiso aleatorio de navegador y sin el valor en claro. Una restricción impide asignar el mismo permiso a dos plazas. Retirar una plaza antes de Go revoca el hash; no elimina la plaza ni sus operaciones. No contiene dirección IP, email o identidad de dispositivo.
- **race_operations:** clave (session_id, roster_key, operation_id), huella HMAC-SHA256 del contenido normalizado de la operación, con el secreto de la clase y el prefijo de propósito race-operation-v1, número 1–3, estado reserved/completed, resultado de negocio si está completada y referencia al checkin si lo produjo. Restricción única para el número de intento de cada plaza. No guarda el código enviado ni el correcto. Una misma operation_id con contenido distinto se rechaza sin evaluar el nuevo código. Como máximo tres filas por plaza y 45 para quince plazas; se usa su recuento como presupuesto, sin un segundo contador que pueda divergir.

Las claves hacia checkins usarán ON DELETE SET NULL donde proceda. Retirar una asistencia establece además el estado de plaza retirada, impidiendo nuevas comprobaciones; un resultado antiguo no se vuelve a mostrar como asistencia vigente. Las operaciones, hashes y demás datos temporales se conservan como máximo hasta expires_at. El cierre prohíbe nuevas comprobaciones aunque sus filas temporales ya se hayan eliminado.

Se crearán índices para races.expires_at y para los permisos por carrera/hash; las claves compuestas y únicas cubren la búsqueda de plazas y operaciones.

Los resultados de carrera se ordenan por el ID de inserción de sus checkins, que refleja el orden serializado de confirmación. No se ordenan por el reloj del teléfono ni por checked_at cuando dos hilos pudieron obtener sus horas antes de esperar la escritura. Las clases normales mantienen su orden y contrato actuales.

## 5. Transacciones y reglas de fase

**Corrección de seguridad pendiente de aprobación, 2026-10-24:** el diseño anterior de transacción única podía devolver un intento después de evaluar si fallaba la escritura. Se sustituye por el contrato del [plan 008 §5](../008-proteger-el-registro-de-carrera/plan.md): reserva duradera A antes de evaluar y resultado/asistencia/cierre juntos en B. Un rollback de B no borra la reserva; una operación reservada sin resultado informa unconfirmed y nunca se reevalúa. No hay reanudaciones por timeout, otro navegador o reinicio. 007 consume este contrato; no lo implementa de nuevo.

La fase, el grupo fijado, los permisos y la caducidad se vuelven a comprobar antes de evaluar en B. El tercer intento reservado puede acertar; el cuarto no se evalúa. Cierre, caducidad o asistencia ya confirmada entre A y B impiden otra evaluación. El orden de puestos corresponde a las confirmaciones B, nunca al orden de reservas A.

La preparación, ocupación exclusiva, retirada en lobby y Go mantienen sus transacciones propias y las reglas aprobadas. Las funciones SQL de carrera no hacen commits internos; no se llaman helpers normales que sí los hagan. La limpieza se ejecuta al siguiente tráfico o inicialización; no reabre clases ni borra asistencias o blacklist de 006. La excepción por plaza no ejecuta el guard IP de 006.

La integración del alumno debe reconocer 202 unconfirmed: consultar estado, mostrar el intento gastado y no reenviar ni crear otro envío automáticamente. Un resultado ya confirmado sigue siendo recuperable tras cierre hasta expires_at; una reserva sin resultado no se presenta como código incorrecto ni asistencia. El contrato exacto y su evidencia pertenecen a 008. Esta corrección del caso de fallo espera aprobación junto con la spec y plan 008 corregidos.

## 6. Rutas, permisos y sesión de navegador

| Ruta | Acceso y función |
| --- | --- |
| POST /api/sessions/races | Profesor; prepara carrera y devuelve id. |
| GET /api/sessions/<id>/race | Profesor; estado completo, código solo cuando está abierta y enlace de entrada solo en lobby. |
| GET /api/sessions/<id>/race/qr.svg | Profesor; QR local del enlace vigente; 410 fuera del lobby. |
| POST /api/sessions/<id>/race/start | Profesor; Go idempotente. |
| POST /api/sessions/<id>/race/release | Profesor; libera una plaza solo en lobby. |
| POST /api/sessions/<id>/race/close | Profesor; cierre idempotente. |
| POST /api/races/<id>/lobby | Secreto QR vigente en cuerpo; devuelve roster y fase, sin código ni datos privados. |
| POST /api/races/<id>/join | Secreto QR vigente y roster_key; ocupa plaza y establece cookie. |
| GET /api/races/<id>/me | Cookie de plaza; devuelve solo su personaje, fase, resultado e intentos y protección CSRF, nunca código ni secretos ajenos. |
| POST /api/races/<id>/attempt | Cookie y protección CSRF; operation_id y código. |

Las rutas privadas quedan bajo /api/sessions/ para aprovechar la autenticación X-Teacher-Token ya existente. No se acepta ese token en un parámetro público ni se mezcla con el permiso del alumno.

La cookie usa nombre específico de carrera, Path=/api/races/<id>, HttpOnly, SameSite=Strict, sin Domain y caduca en expires_at. Secure es obligatorio en --tunel/HTTPS; únicamente las pruebas locales explícitas en loopback usan HTTP sin Secure. No se guarda el permiso en localStorage, no se devuelve en JSON ni se añade a URLs. El servidor valida el hash con comparación constante y comprueba fase/permiso en cada acción, no confía en que la interfaz haya ocultado un botón.

Para acciones con cookie se valida un X-Race-CSRF impredecible, derivado con HMAC del permiso vigente y su carrera, devuelto únicamente por /me al navegador que ya tiene acceso. Se exige application/json y un encabezado de petición propio; no se habilita CORS ni se acepta un formulario o text/plain como alternativa. Se rechazan solicitudes de navegador declaradas cross-site. La entrada inicial sin cookie requiere el secreto QR además de JSON y cabecera propia, con la misma política sin CORS. Las rutas del profesor mantienen la cabecera secreta existente.

Todas las respuestas privadas, de entrada y de participante usan Cache-Control: no-store y no imprimen cookies, cuerpos con códigos ni permisos en logs. El fragmento del enlace es race.html?r=<id>#join=<secret>: el navegador lo pasa al cuerpo autorizado de entrada y lo elimina de la barra con history.replaceState. Se conserva temporalmente en sessionStorage solo hasta completar la ocupación o cerrar el lobby, para permitir una recarga previa a elegir nombre. Después se borra; perder la cookie no habilita su recuperación. La página usa Referrer-Policy: no-referrer y no carga recursos de terceros.

### Cierre de vías antiguas

Antes de aplicar guard_registration, el borde obtiene el modo real de la clase mediante una acción de solo lectura. Si es normal o no existe, conserva la ruta y precedencia actuales de 006. Si es carrera, el POST antiguo /api/s/<id>/checkin no evalúa códigos ni ejecuta la blacklist IP: devuelve 403 indicando usar el acceso de carrera. No recibe la cookie, que tiene otro Path. La propia acción attendance.check_in también rechaza clases de carrera para evitar saltarse el contrato desde un cliente de terminal.

Las vistas públicas y privadas antiguas deben consultar el modo de carrera: la vista pública no expone roster, permisos, código o QR; la privada deriva open de la fase real y no muestra el código durante el lobby. El cierre y la eliminación de checkins por rutas antiguas del profesor delegan en las acciones de carrera para conservar transacciones y presupuestos. Las rutas y respuestas de clases normales permanecen iguales.

## 7. Pantallas y dibujos

El panel añade «Carrera de Halloween» al crear una clase y un acceso a su presentación. La pantalla de presentación lee el token del profesor desde el fragmento inicial, lo conserva en sessionStorage y lo quita de la barra antes de generar enlaces compartibles. El QR jamás incluye ese token. Los controles, QR, código y parrilla se organizan para proyectar; se ofrece pantalla completa sin depender de ella para ocultar datos privados.

El alumno usa una única página: elegir nombre → esperar → introducir código con contador 3/2/1 → resultado o «Sin intentos». Sin confirmaciones humanas ni selección de nombre después de Go. El formulario deshabilita envíos mientras espera respuesta. Para cada envío genera una operation_id con crypto.randomUUID(), validada como UUID y longitud acotada por el servidor, y conserva en sessionStorage la misma operación y cuerpo para reintentar tras pérdida de conexión; nunca crea un identificador nuevo para una repetición automática. Borra el código pendiente al recibir resultado, cerrar o caducar; no se registra en consola. Lo conservado en el teléfono no altera el presupuesto del servidor.

Polling cada segundo, una petición pendiente por pantalla; backoff a 2, 4 y 8 segundos si hay fallos. /me y la vista del profesor incluyen serverNow, startsAt y expiresAt para corregir el desfase visual. El reloj del navegador nunca abre permisos ni decide posiciones. Se pausarán temporizadores al abandonar la vista y se actualizará el estado al volver. El código rota como ahora; una hora de inicio compartida sustituye múltiples temporizadores independientes de salida.

Los quince SVG locales representan el personaje y su kart completo. Se revisa cada imagen original antes de dibujar y se conservan dos rasgos reconocibles según la spec. Se documenta alumno, referencia, paleta y adaptación en docs/RACE-ASSETS.md, sin copiar audios ni modificar exercises/. Los dibujos son originales, con estilo uniforme, colores y accesorios distintos. Su SVG no incluye scripts, eventos, enlaces externos o texto procedente del servidor.

race-renderer.js usa DOM creado explícitamente, textContent e imágenes de una lista local permitida. Nunca concatena HTML de nombres o respuestas. Los resultados se ordenan exclusivamente desde el servidor. La animación final dura unos ocho segundos, con salidas/velocidades decorativas y cruces de meta en la secuencia confirmada; nunca cambia ni sortea puestos. El podio muestra hasta tres finalistas. Con movimiento reducido, se presenta directamente la clasificación sin desplazamientos. No hay audio ni input de conducción en esta versión.

En 400 px se usa lista vertical de participantes y desplazamiento de página, no una pista minúscula con quince nombres ilegibles. El código y los controles mantienen tamaños utilizables. Se prueban teclado, foco, etiquetas, estado aria-live sin anunciar cada fotograma, contraste y caracteres maliciosos en títulos/nombres.

Referencia consultada: Spell UI local, su registry.json y componente/documentación qr-code. Solo inspira la composición; no se copian componentes React ni se añaden sus dependencias. Se prioriza escaneo fiable: QR negro sobre blanco con zona libre de cuatro módulos, sin personajes sobrepuestos.

## 8. QR y dependencia propuesta

Se propone qrcode==8.2, con fábrica SVG explícita SvgPathImage/SvgPathFillImage. Su metadata verificada admite Python >=3.9,<4 y la versión está publicada; su restricción de versión admite los runtimes 3.13+ del proyecto; el funcionamiento se verificará en el entorno real durante la implementación. No se instala el extra pil, png o all: no se necesitan Pillow ni pypng para el SVG. En Windows el paquete declara colorama como dependencia de plataforma; se documentará como transitiva. No se instala nada durante esta fase de plan.

Justificación P3: la biblioteca estándar no codifica QR. Implementar el estándar a mano añadiría código difícil de revisar; un servicio remoto filtraría el enlace de entrada. Una biblioteca pequeña y específica permite generar el QR local y usar las tecnologías de clase. No es un nuevo framework ni cambia el servidor. Si Miguel no aprueba esa dependencia, el QR no se sustituirá por una imagen simulada; se revisará el plan.

Prueba de lectura: escanear el SVG real con móvil en el lobby sobre túnel autorizado. La alternativa clicable se ensaya desde un segundo navegador. Las pruebas automatizadas comprueban SVG, contenido local y autorización, pero no sustituyen esa lectura con cámara.

## 9. Enmienda propuesta 4.0, todavía no aplicada

Se propone 4.0 para la excepción de seguridad y privacidad del backend y 4.1 para la dependencia QR al integrar la presentación, partiendo de la versión vigente 3.0. Son propuestas: si otra enmienda cambia esa base, se revisa la numeración antes de aplicar. Se preservan los otros principios y todo el historial. Texto exacto a incorporar por cada tarea:

**P3, añadido en 4.1 (007):** «Para las carreras de asistencia se permite qrcode==8.2 para generar QR SVG localmente, sin extras de imágenes. Se documentan sus dependencias transitivas de plataforma. No se envían datos a un generador externo.»

**P4, añadido en 4.0 (seguridad):** «Se permite una lista local de nombres y personajes de clase como referencia previa, sin atribuir presencia. En modo carrera se acepta el nombre seleccionado y se guardan temporalmente plazas, permisos y operaciones necesarias para limitar sus intentos. No identifican dispositivos entre clases ni se vinculan a direcciones de seguridad. Los secretos de entrada se revocan al cerrar las altas; los permisos de registro al cerrar o cancelar la carrera. La lectura privada del propio resultado y los datos temporales caducan como máximo dos horas después de preparar la carrera y se eliminan en la siguiente petición o inicialización antes de aceptar operaciones. Se conservan asistencias y metadatos no secretos necesarios para consultar el grupo y resultado. Los enlaces de entrada y permisos solo transitan hacia los navegadores de la clase; no se registran en logs ni se envían a servicios externos.»

**§6, sustituir en 4.0 (seguridad) el punto de intentos por:** «Las clases normales conservan los límites de cinco intentos por segundo móvil y veinte por minuto móvil por dirección, con bloqueo permanente de 006. En clases de carrera se usa un QR vigente para ocupar una única plaza por nombre del roster mientras el lobby esté abierto; Go fija el grupo y cierra nuevas ocupaciones y reemplazos. Cada plaza tiene tres comprobaciones totales, incluida la correcta, con reserva atómica previa a evaluar el código. Cambiar navegador, dirección, nombre o rotación del código no repone oportunidades; la ausencia de acceso válido impide comprobar. Las repeticiones de una misma operación no añaden comprobaciones y no permiten probar contenido distinto. El agotamiento afecta solo a esa plaza; no se aplican a las plazas de carrera bloqueos colectivos por IP. Se valida el origen fiable en ambos modos. La entrada automática no identifica a una persona ni impide que alguien ocupe nombres ajenos; se acepta esa limitación para el juego de clase.»

Añadir la fila 4.0 en la tarea de backend con fecha real de aprobación y motivo de entrada automática, presupuesto por plaza, roster y permisos temporales. Añadir después la fila 4.1 en 007 con fecha real de aprobación y motivo del generador QR local. No atribuir aprobación antes de recibirla ni incluir en dos PRs la misma modificación de constitución. Las pruebas que fijan una versión anterior se actualizarán solo cuando esa enmienda se aplique, conservando las comprobaciones de sus principios e historial.

## 10. Comprobación de la constitución

| Regla | Comprobación |
| --- | --- |
| Propósito y P1 | La carrera representa asistencia real y no usa Discord, Meet o GitHub para identificar alumnos; el modo normal sigue disponible. |
| P2 | Cuatro tablas concretas, quince plazas, máximo 45 operaciones y sin colas pendientes de admisión. No hay cuentas ni motor de juego. |
| P3 y §3 | Python, Flask, SQLite y navegador actuales; qrcode se justifica y propone explícitamente antes de instalarlo. |
| P4 | Enmienda previa con finalidad, datos y caducidad; secretos en hashes donde basta verificarlos; sin IP asociada al alumno, audio o fotos reales. |
| P5 | QR con alternativa de enlace, teclado, móvil y movimiento reducido; información legible sin animación. |
| P6 | Textos, errores y documentos españoles; identificadores técnicos ingleses. |
| §4 | Spec, plan y tareas aprobados por Miguel, sin implementación. La aplicación de enmiendas y los documentos de la dependencia de seguridad siguen sus aprobaciones propias. |
| §5 | Cada criterio tiene verificación abajo; regresiones normales no se sustituyen por pruebas que solo reflejen el código nuevo. |
| §6 | No se presenta la excepción de carrera como cumplimiento literal de 006; contrato y enmienda separados y explícitos. |
| §7–§8 | Solo nuestra carpeta; se consultan ejercicios sin modificarlos; historial intacto y aprobación de enmiendas por Miguel. |

## 11. Verificación prevista

Se ejecutará sobre copia y bases ficticias, utilizando el entorno local existente. Se registra versión de Python/Flask/pytest, dependencias instaladas y evidencia nueva; los 145 tests de 006 constituyen la referencia anterior, no un resultado que se atribuya a esta funcionalidad todavía.

| Criterios | Pruebas de contrato o revisión |
| --- | --- |
| CA-01, CA-12, CA-18 | Roster de quince claves únicas y personajes existentes; asociación contra historial y revisión de los quince dibujos; originals sin cambios y sin dependencias de frontend nuevas. |
| CA-02–CA-04, CA-24 | Dos conexiones ocupan el mismo nombre: una sola gana; otro navegador no recibe su cookie. Retirar en lobby revoca el acceso anterior. Cincuenta altas simultáneas contra quince nombres: máximo quince plazas. Entrada concurrente con Go: queda incluida o rechazada. Sin ocupantes Go no inicia. Reusar QR después de Go no incorpora ni repone plazas. |
| CA-05, CA-11 | Reloj inyectado: doble Go, recarga a mitad de salida, dos pantallas con hora local distinta, cierre/caducidad durante cuenta atrás y reinicio del servidor. Abrir sin que exista ninguna pantalla conectada tras la salida; nunca reabrir tras cerrar. |
| CA-06–CA-08 | Registros concurrentes con la misma hora visible conservan orden por confirmación; el alumno no puede elegir puesto ni reloj. Fallos no ocupan posición; una tercera comprobación válida sí registra. |
| CA-09–CA-10 | Cierre manual y último registro en carrera, cero/uno/dos/tres resultados, un participante agotado, cancelación de cierre, orden exacto de meta y podio. Sin registros ficticios para ausentes. |
| CA-13 | Base anterior con datos y definiciones intactos; registro/exportación normal sin cambios. Eliminar una asistencia invalida éxitos cacheados y puestos sin reabrir ni permitir otro registro. |
| CA-14, CA-21 | Sin token de profesor, sin cookie, cookie ajena, secreta de otra carrera, revocada o caducada: no código ni control. POST antiguo y llamada directa a attendance.check_in no eluden el modo carrera. CSRF ausente/falso y petición cross-site: rechazadas sin consumir intentos ajenos. No secretos en URL de peticiones, Referer, caches o logs. |
| CA-15, CA-19, CA-23 | Quince clientes con misma IP realizan un éxito cada uno. Un atacante envía cincuenta códigos concurrentes de una plaza: como máximo tres comparaciones de código y tres operaciones; las demás plazas conservan acceso. Correcto después de agotar no se evalúa. Caso hostil con ocupación de los quince nombres: límite total de 45, sin afirmar que se impide suplantación. |
| CA-20 | Tras dos fallos, reinicio y rotación conservan un único intento. Borrar cookies y volver a QR tras Go no emite acceso. Retirar/liberar solo en lobby; no reemplazos tras Go. Una petición no autorizada no puede crear otra carrera. |
| CA-22 | Misma operación en dos conexiones: una comprobación y un resultado. Repetirla con otro código: 409 sin validarlo. Simular respuesta perdida tras éxito, último éxito y fallo; recuperar resultado sin revalidar ni gastar. Error SQL inducido: reserva A conservada, rollback solo de resultado B, sin reevaluación de la operación ni respuesta que revele la validez del código. Mostrar unconfirmed y consultar estado. |
| CA-16 | Navegador real en móvil/desktop, teclado, zoom, movimiento reducido, red lenta y reconexión. Escaneo real de QR, enlace alternativo, intento pendiente, límite de tres, código visible solo en profesor y podio de menos de tres. |
| CA-17, CA-25 | Reloj en 7199/7200 s: un éxito guardado y su operación repetida se recuperan antes del límite, pero en el límite y después se rechazan también por /me y /attempt, aunque se conserve la cookie; no se evalúa código ni se devuelve el resultado privado. Tras cerrar permite solo resultado propio hasta expirar. Al siguiente tráfico o inicialización borra datos temporales y mantiene clase cerrada y asistencia. Sin permisos en logs ni acceso restaurado al reiniciar. |

Prueba de carga limitada en copia: 15 envíos legítimos más 50 adversarios con payload pequeño; comparar respuestas, duración, máximo de evaluaciones y permisos de otras plazas. Límite de cuerpo de las rutas nuevas: 2 KiB; código de hasta cuatro cifras y parámetros con formato/longitud acotados; respuesta 413 para cuerpos mayores. La ocupación y el libro de operaciones acotan las filas a 15 y 45 por carrera. No se añadirá una cuota global de intentos que deje sin presupuesto a la clase. Un bloqueo de SQLite que supere la espera acotada produce 503 y reintento de la misma operación, sin convertirlo en intento fallido de código.

No se propone una defensa completa frente a inundaciones: se documentará el tiempo de espera y la concurrencia realmente soportada, se comprobará que no hay crecimiento sin límite de datos y se mantendrá ese límite como riesgo conocido. No se lanzará tráfico contra sesiones de compañeros. Cualquier ensayo de túnel real usará copia y datos ficticios autorizados, se detendrá y se comprobará el puerto libre al acabar.

## 12. Revisión interna del plan

La revisión de diseño encontró y corrigió estos puntos antes de presentarlo:

1. Se prohíben commits internos de helpers dentro de las transacciones de carrera; la reserva duradera se confirma primero y el resultado/asistencia/cierre después; un fallo no devuelve consumo.
2. El modo de clase se consulta en servidor también en rutas antiguas y llamadas de terminal; no basta con ocultar el formulario normal.
3. Los hashes solos no permiten volver a mostrar un QR tras recargar; se conserva el secreto de entrada únicamente durante el lobby y se borra en Go.
4. La lectura del resultado tras el último éxito no queda anulada al cerrar; lo que se revoca inmediatamente es comprobar otro código. Al caducar sí desaparece todo permiso temporal.
5. Un éxito cacheado no puede revivir una asistencia retirada; se consulta el estado actual de la plaza antes de responder a un reintento.
6. Se separa el orden de confirmación del reloj de los hilos y de la animación: para carreras manda el orden de inserción serializado.
7. La fase cerrada no impide recuperar un resultado propio ya guardado dentro de su lectura temporal; el orden de permisos, reintentos y comprobaciones nuevas queda explícito.
8. Se propone una secuencia 4.0/4.1 de enmiendas en lugar de aplicar la misma versión desde dos PRs; la librería QR y su dependencia transitiva Windows se declaran antes de instalar.

Resultado: diseño preparado para revisión de Miguel, con la dependencia de seguridad y los límites de identidad y saturación explícitos. No se ha ejecutado la implementación ni se afirma que las pruebas previstas hayan pasado. La redacción de tareas y el código esperan sus aprobaciones correspondientes.

## Fuentes técnicas consultadas

- [qrcode 8.2, metadata y fábrica SVG](https://pypi.org/project/qrcode/8.2/): dependencia específica, SVG y requisitos; no se instala durante el plan.
- [Python sqlite3 3.14](https://docs.python.org/3.14/library/sqlite3.html): control explícito de transacciones, placeholders y conexiones. El entorno real se verificará al ejecutar.
- [OWASP: CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): token ligado a sesión, cabeceras propias y SameSite como protección adicional.
- [OWASP: sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): permisos impredecibles, cookie protegida, no divulgación por URLs y caducidad.

## Aprobación del plan

2026-10-24: Miguel indicó «Approved, prepare the tasks and review them properly before I approve them». Se registra aprobación de este plan, sin atribuir aprobación a las tareas todavía ni a documentos inexistentes de la dependencia de seguridad.

## Correcciones tras la segunda revisión

2026-10-24: por petición de Miguel, la caducidad se comprueba antes de cualquier resultado guardado y la prueba de frontera incluye /me y /attempt. El flujo Git sitúa rama y PR draft antes de implementar; la entrega final actualiza esa PR. Estas correcciones no cambian la experiencia aprobada ni atribuyen aprobación a las tareas.

2026-10-24: Miguel aprobó las tareas tras revisar las correcciones y pidió preparar la spec 008. La aprobación de los documentos 007 no se extiende a los de 008 ni a su enmienda.

Revisión de coherencia con el borrador 008: se enlaza la nueva spec sin atribuirle aprobación y se explicita que un éxito guardado no permite saltarse el rechazo de una operación reutilizada con contenido distinto. Se mantiene el contrato ya definido de 007 CA-22.

Corrección posterior de fallo técnico: la sección 5 y su ensayo de error SQL remiten al diseño A/B de 008, pendiente de aprobación. La presentación debe reconocer unconfirmed sin crear intentos automáticamente. Se conserva la historia de las aprobaciones anteriores, que no se extiende a esta corrección.

Aprobación posterior de la corrección, 2026-10-24: Miguel aprobó la spec y plan 008 corregidos y pidió preparar sus tareas. Se aprueba también la coordinación del caso de fallo con este documento, sin iniciar implementación.
