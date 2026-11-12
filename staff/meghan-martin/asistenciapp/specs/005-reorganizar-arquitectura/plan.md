# Plan 005 · Separar reglas, almacén y pantalla

## 1. Cómo

- Mover `CONSTITUTION.md` a `docs/CONSTITUTION.md` y anotar la versión 2.3.
- Renombrar `AGENT.md` a `AGENTS.md` y añadir cómo se escribe una función.
- Reescribir `docs/ARCHITECTURE.md` para que nombre las tres carpetas de verdad.
- `asistencia/domain/`: código, nombre y si la clase existe o sigue abierta.
- `asistencia/usecases/attendance.py`: abrir, cerrar, anotar, listar, borrar y exportar.
- `asistencia/storage/sqlite.py`: el mismo guardado de antes. Cada función abre el fichero y lo cierra.
- `app.py` solo recibe la petición y pide la acción.
- `export.py` y `tunnel.py` se quedan donde están.
- Los tests del código y del nombre importan `asistencia.domain`.

## 2. Comprobación de la constitución

- P1 y P2: pasar lista no cambia.
- P3: no hay dependencias nuevas.
- P4: los datos siguen en el fichero local.
- P5: los avisos siguen en español.
- P6: los documentos nuevos están en español.
- §4: este spec va antes del cambio.
- §7: todo sigue dentro de `staff/meghan-martin/asistenciapp/`.

## 3. Archivos

Se crean `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/` y `tests/test_architecture.py`. Se borra `asistencia/db.py`.
