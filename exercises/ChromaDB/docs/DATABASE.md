# Datos — ChromaDB

Hay dos almacenes locales. Ninguno va a git. No comparten tablas ni colecciones.

## Chroma

`scripts/settings.py` fija la ruta `chroma_db/` y el modelo `qwen3-embedding:0.6b`.

La colección se llama `python_<version>_docs`. Con la documentación 3.15 el nombre es `python_3_15_docs`. Si aún no hay versión descargada, el nombre provisional es `python_docs`.

Entra la documentación de esa versión. Lo de otras versiones se excluye al indexar. Ningún fragmento se trunca al calcular su embedding. Los tamaños de troceo (`MERGE_BELOW`, `MERGE_MAX`, `SPLIT_ABOVE`) y `NUM_CTX` están en `scripts/settings.py`.

Los scripts abren `chroma_db/` directamente, sin servidor. El servidor de Chroma solo se arranca para mirar los datos con ChromaDash. No se arranca mientras un script escribe, y se para al terminar.

`build_index.py` borra el índice anterior y lo crea de nuevo. Hay que repetirlo si cambia la versión, el modelo o esos tamaños.

## SQLite

El CRUD guarda los usuarios en `src/db/users.sqlite`. La ruta está en `src/db/settings.py`. La primera conexión crea la tabla con `src/db/schema.sql` si no existe.

Columnas de `users`:

- `id`, entero, clave autonumérica.
- `name`, texto, obligatorio.
- `email`, texto, obligatorio y único.
- `age`, entero, obligatorio.
- `gender`, texto, obligatorio.

El SQL de cada consulta está en `src/storage/queries/`, un fichero `.sql` por consulta. `storage` lo lee y lo ejecuta. Las reglas de nombre, email, edad y género no están en el esquema: las aplica `core`, con las constantes de `src/core/settings.py`.

Para vaciar la base se para Jupyter y se borra `src/db/users.sqlite`.
