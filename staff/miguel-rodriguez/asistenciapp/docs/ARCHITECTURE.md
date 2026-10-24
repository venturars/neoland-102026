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

El archivo `data/asistencia.db`, sus tablas, secretos, token y registros mantienen su formato. No hay migraciones. `asistencia/export.py` conserva el formato CSV; `asistencia/tunnel.py` conserva la publicación del servicio. No se añaden dependencias, repositorios genéricos ni otras persistencias.

Las reglas vigentes están en [CONSTITUTION.md](CONSTITUTION.md); el proceso y la escritura de funciones, en [AGENTS.md](../AGENTS.md). Las specs 001–004 conservan los nombres que tenían sus documentos: AGENT.md pasó a AGENTS.md y CONSTITUTION.md pasó de la raíz a docs/. Los enlaces actuales se mantienen en el README y el manual.
