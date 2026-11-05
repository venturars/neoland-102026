# Seguridad — ChromaDB

Todo corre en el equipo de quien lo usa. No hay un servicio remoto de este proyecto al que enviar los datos.

## Qué no sale del equipo

- `chroma_db/`, `python-docs/`, `python-docs-md/` y `src/db/users.sqlite` no van a git.
- `.venv/` no va a git.
- El modelo de embeddings no va en el repositorio. Se descarga con Ollama.
- No se escribe un token, una contraseña ni una clave en un fichero del proyecto. El MCP de GitHub se autentica fuera del repositorio.

## Lectura y escritura

- `python-docs/` es solo lectura. Se regenera con `download_docs.py`. No se edita a mano. `python-docs-md/` tampoco.
- Los scripts abren `chroma_db/` sin servidor. El servidor (`chroma run`) solo sirve para ChromaDash.
- No se arranca ese servidor mientras un script escribe en `chroma_db/`. Antes de `build_index.py` se para.
- Al terminar de mirar los datos, se para el servidor con `Ctrl+C` en la terminal donde corre.

## El ciclo de un cambio

La contraseña que corta el ciclo si la ronda 9 falla se recuerda. No se copia a ningún fichero, ni a la spec, ni al reporte.
