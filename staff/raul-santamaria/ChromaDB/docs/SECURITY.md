# Seguridad — ChromaDB

Proyecto **local-first**: no hay despliegue público del RAG ni del CRUD en esta carpeta.

## Datos y git

- No commitear secretos, tokens ni `.env` con credenciales.
- Fuera de git (`.gitignore`): `python-docs/`, `python-docs-md/`, `chroma_db/`, `.venv/`, `src/db/users.sqlite`.
- La documentación oficial descargada conserva licencia en `python-docs-md/LICENSE.md`.

## ChromaDB servidor

- Los scripts de indexado y consulta usan el cliente embebido sobre `chroma_db/`.
- El **servidor** Chroma solo se arranca para **ChromaDash** (`chroma run chromadash/chroma-cors.yaml`).
- No ejecutar el servidor mientras un script **escribe** en `chroma_db/` (p. ej. `build_index.py`).
- `chromadash/chroma-cors.yaml` expone CORS para que el HTML local hable con `localhost:8000`; no usar esa configuración en internet sin revisión.

## Jupyter

- Notebooks en `src/clients/jupyter/` asumen entorno local del alumno.
- No exponer el notebook a red pública sin autenticación.

## Dependencias

- Versiones fijadas en `requirements.txt`; cambios solo con aprobación humana ([DEPENDENCIES.md](DEPENDENCIES.md)).
