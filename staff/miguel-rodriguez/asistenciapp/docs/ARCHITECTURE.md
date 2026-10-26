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
