# Plan 006 · Protección de intentos de registro

Estado: preparado y revisado internamente el 2026-10-24 bajo la autorización de ejecución completa de Miguel. Spec: [spec.md](spec.md). Issue #300. La PR apunta directamente a staging; los pasos 004 y 005 deben integrarse antes.

## Arquitectura y contrato

- domain/registration.py: máximo de 5 intentos en un segundo móvil y 20 en sesenta, incluido el actual. Excepciones de dirección bloqueada y origen no determinable. Sin conexiones ni Flask.
- storage/sqlite.py: añadir solo dos tablas, registration_attempts (address, attempted_at) y blocked_addresses (address PRIMARY KEY), con índice por dirección y tiempo. Sin relación con sessions ni checkins. Operaciones concretas de borrado global de intentos caducados, consulta de tiempos, alta de intento y bloqueo. Los tres esquemas originales y sus filas no cambian.
- usecases/attendance.py: una acción guard_registration(db_path, address, now) abre conexión, comienza BEGIN IMMEDIATE, elimina todos los intentos con tiempo <= now-60, comprueba bloqueo, cuenta intentos y persiste intento o bloqueo. Commit antes de lanzar el error, también cuando el origen falta. El bloqueo no guarda tiempo ni datos personales adicionales. La transacción serializa conexiones concurrentes para no admitir más del máximo. El error de seguridad prevalece sobre validaciones de sesión/cuerpo al superar un límite. No se prolonga la transacción durante el resto del registro.
- app.py: solo el POST público de checkin invoca la acción antes de leer el cuerpo; las demás rutas no cuentan. Origen ausente o no fiable: JSON 403 en español, sin registro ni bloqueo de una dirección inventada. Dirección bloqueada o intento que supera máximo: JSON 429 con mensaje de bloqueo permanente, sin Retry-After. El cliente existente muestra ese mensaje sin cambiar pantallas.

## Identificación del origen · CA-05, CA-12

Nuevo parámetro keyword-only trust_cloudflare=False en create_app. En modo directo se utiliza REMOTE_ADDR validado por ipaddress, ignorando cabeceras y formulario. Las direcciones privadas o loopback describen la conexión local y se contabilizan como tales: el modo local no promete una IP pública de Internet.

Con --tunel, main activa trust_cloudflare=True. Se exige una conexión inmediata de loopback desde el conector local y un único CF-Connecting-IP global válido; sin ello se rechaza el registro. ProxyFix se configura explícitamente con x_for=0 para no reemplazar el par de conexión con X-Forwarded-For. Se conserva su tratamiento actual de protocolo y host. No confiar en Forwarded, X-Real-IP ni X-Forwarded-For para contar intentos. Normalizar direcciones y direcciones IPv4 mapeadas en IPv6 para impedir identidades equivalentes distintas.

La frontera de confianza es el conector cloudflared local: Cloudflare establece CF-Connecting-IP. Un proceso con acceso al propio ordenador puede hablar con loopback y falsear el conector; esta tarea no autentica procesos locales ni afirma que una IP identifique a una persona. El servidor sigue escuchando solo en 127.0.0.1. Con túnel activo, el registro directo local sin cabecera de origen confiable se rechaza; las consultas locales siguen disponibles.

Fuentes técnicas verificadas el 2026-10-24: [Cloudflare HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/) y [Werkzeug ProxyFix](https://werkzeug.palletsprojects.com/en/stable/middleware/proxy_fix/). Se validará el contrato del conector mediante peticiones simuladas; no se presentará eso como prueba real del túnel.

## Datos y limpieza · CA-06, CA-08, CA-09

Los intentos pertenecen a la dirección, no a una clase. Tras cada intento atendido se eliminan globalmente los temporales de sesenta segundos o más, incluso si la dirección actual está bloqueada o no se identifica. Sin tráfico no hay tarea en segundo plano. La blacklist persiste en la misma base local y no se vacía al iniciar ni al limpiar intentos. Un intento bloqueado no añade un historial permanente de peticiones. No se implementa desbloqueo.

## Enmienda propuesta 3.0 · CA-11

Modificar P4: conservar nombre y hora como únicos datos de asistencia; permitir exclusivamente por separado la dirección de conexión y tiempo de intentos recientes, y solo la dirección para el bloqueo permanente. Datos locales; prohibido añadir emails, dispositivos o asociar IP a la lista de asistencia. Mantener la limitación de tránsito ya documentada.

Modificar §6: la protección contra intentos automatizados pasa a ser requisito con los umbrales y bloqueo de esta spec; mantener rotación de cuatro cifras, duplicados, sesiones cerradas y validación de entradas. Subir 2.4 a 3.0 porque se contradice la prohibición anterior de guardar IPs y añadir historial con fecha 2026-10-24. Mantener los demás principios y filas históricas.

Miguel autorizó completar la tarea tras revisar y corregir el spec; la aplicación de esta enmienda forma parte de esa delegación. No se altera el historial de aprobaciones de las specs previas.

## Verificación por criterio

- CA-01–CA-03: límites 5/6 y 20/21, ventanas móviles y contadores independientes; pruebas con reloj fijo.
- CA-04–CA-05: intentos válidos, inválidos, duplicados, clase ausente/cerrada y cuerpo no objeto; cambio de clase/nombre no reinicia contador. Consultas y operaciones privadas no cuentan. Cabeceras de alumno no cambian origen en directo; solo conector explícito acepta CF-Connecting-IP.
- CA-06: reiniciar create_app con el mismo archivo, cambiar clase y avanzar el reloj no elimina el bloqueo.
- CA-07: error visible en español y sin promesa de espera temporal ni Retry-After.
- CA-08–CA-09: bordes exactos a 1 y 60 segundos, limpieza global con IP inactiva y preservación del bloqueo. Dos conexiones concurrentes no admiten más de cinco en el mismo segundo.
- CA-10: suite previa de 112 pruebas y operaciones originales. Adaptar solo las comprobaciones de 005 que fijaban versión 2.4 o el inventario completo del esquema: ahora deben admitir 3.0 y las tablas nuevas, manteniendo las filas y definiciones de las tablas originales. No eliminar ni relajar regresiones de comportamiento.
- CA-11: comparación de secciones y filas históricas de constitución, privacidad explicada en README y arquitectura; specs 001–005 sin cambios.
- CA-12: rechazar origen ausente, malformado o no confiable con 403, sin asistencia ni bloqueo falso.

Ejecutar en copia desechable con .venv existente y datos ficticios; registrar red/green, versiones y resultados. No ejecutar el script de ataque ni usar datos reales. Después comprobar el alcance, registrar resultados, crear commits pequeños y publicar la PR con Closes #300 y revisores Diego, Víctor y Sergio. No fusionar sin dos revisiones vigentes.

## Comprobación de constitución y revisión interna

P1 sin dependencia de plataforma; P2 funciones y tablas concretas sin abstracciones extra; P3 biblioteca estándar y dependencias existentes; P4 enmienda limitada anterior a código; P5 pantallas conservadas; P6 mensajes/documentos en español; §3 sin cambiar stack; §4 autorización posterior expresa de ejecución completa; §5 pruebas por criterio y evidencia; §6 protección añadida sin quitar reglas; §7 solo nuestra app; §8 enmienda mayor trazable.

Revisión interna: la ventana incluye el intento actual; la limpieza no depende de que vuelva la misma IP; el bloqueo se confirma antes de lanzar error; bloqueo y contadores se consultan dentro de una transacción serializada; no se confía en cabeceras públicas sin modo explícito. No se afirma que el origen local sea público ni que no pueda cambiar una IP.
