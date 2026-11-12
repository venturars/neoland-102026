# Árbol — ChromaDB

Cada carpeta tiene un trabajo. Los ficheros de código de `scripts/` y de `src/` tienen una función, salvo `settings.py`.

## Lo que va en git

- `agents/`. Quién hace cada paso del ciclo. El flujo de git y los cuatro agentes de un cambio.
- `skills/`. Cómo se usa una herramienta. `skills/python-docs/` consulta el índice local.
- `tools/`. Scripts de shell del flujo de git.
- `templates/`. La forma de una issue, de una pull request y de `spec.md`, `plan.md` y `tasks.md`.
- `docs/`. La referencia. `docs/specs/<cambio>/` guarda la spec, el plan y las tasks de un cambio. No se borran al cerrar.
- `scripts/`. El cauce del RAG. Un script, una función. Se lanzan desde la terminal.
- `src/`. El CRUD de usuarios, por capas. Ver `docs/ARCHITECTURE.md`.
- `chromadash/`. El visor web de Chroma, parcheado para la API v2. Incluye sus imágenes.
- `tests/`. Pytest. Un módulo por función de producción.
- `MCPS/`. Cómo está declarado el MCP de GitHub. El token no va aquí.
- `README.md`. La guía de instalación para una persona.
- `AGENTS.md`. El ciclo de un cambio.
- `requirements.txt` y `pyproject.toml`. Dependencias fijas y la configuración de Black, Ruff y pytest.

## Lo que no va a git

- `.venv/`. El entorno virtual.
- `chroma_db/`. El índice de Chroma. Cada equipo lo construye.
- `python-docs/`. El HTML oficial descargado. Solo lectura.
- `python-docs-md/`. Ese HTML pasado a Markdown. Es la fuente del índice. No se edita a mano.
- `src/db/users.sqlite`. La base del CRUD. Se crea al usarla.
- `__pycache__/` y `.ipynb_checkpoints/`.

## `src/`

- `clients/jupyter/`. Un notebook por acción. Solo usa `sdk`.
- `sdk/`. La API que importan los notebooks. Llama a `core`.
- `core/`. Las reglas del usuario. Llama a `storage`.
- `storage/`. Lee y escribe. El SQL está en `storage/queries/`, un fichero por consulta.
- `db/`. La conexión, `schema.sql` y la ruta del fichero.
