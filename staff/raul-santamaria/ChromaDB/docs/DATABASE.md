# Bases de datos — ChromaDB

Hay **dos** almacenes distintos: el índice vectorial del RAG y SQLite para usuarios.

## ChromaDB (`chroma_db/`)

- **Ruta:** `staff/raul-santamaria/ChromaDB/chroma_db/` (generada en cada equipo, fuera de git).
- **Colección:** nombre derivado de la versión descargada, p. ej. `python_3_15_docs` (ver `COLLECTION` en `scripts/settings.py`).
- **Contenido:** fragmentos de `python-docs-md/` con embeddings del modelo Ollama configurado en `scripts/settings.py`.
- **Acceso:** los scripts abren el cliente en local **sin** servidor, salvo cuando se usa ChromaDash (ver [SECURITY.md](SECURITY.md)).
- **Metadatos de troceado:** umbrales `MERGE_BELOW`, `MERGE_MAX`, `SPLIT_ABOVE`, áreas `AREAS` y páginas extra en `scripts/settings.py`.

Flujo: `python-docs-md/` → `build_index.py` → `chroma_db/`.

## SQLite usuarios (`src/db/`)

- **Fichero:** `src/db/users.sqlite` (se crea al primer uso, fuera de git).
- **Esquema:** [`src/db/schema.sql`](../src/db/schema.sql):

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL
);
```

- **Consultas:** un fichero `.sql` por operación en `src/storage/queries/`.
- **Capas:** solo `storage/` ejecuta SQL; `core/` aplica reglas; ver [ARCHITECTURE.md](ARCHITECTURE.md).

El CRUD **no** usa ChromaDB ni Ollama.

## Carpetas de documentación (no son BD)

| Carpeta | Rol |
| --- | --- |
| `python-docs/` | HTML oficial descargado (solo lectura). |
| `python-docs-md/` | Markdown generado; fuente del índice. |

Ambas fuera de git. Detalle operativo en [COMMANDS.md](COMMANDS.md).
