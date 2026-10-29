# Plan · ChromaDB en la carpeta de Maria

Spec: [spec.md](spec.md). Issue #576.

Este plan dice cómo se cumple la spec. No hay código nuevo, ni dependencia nueva, ni suite de tests. Las comprobaciones son comandos y leer la salida.

## Pasos

Desde `staff/maria-osipuk/ChromaDB/`, en macOS.

| Paso | Comando |
| --- | --- |
| Copia (ya hecha, rama `576-chore-copy-chromadb-into-maria-osipuk`) | `cp -R exercises/ChromaDB staff/maria-osipuk/ChromaDB` |
| Entorno | `python3 -m venv .venv` y `source .venv/bin/activate` |
| Dependencias | `python -m pip install -r requirements.txt` (versiones fijas, sin cambios) |
| Modelo | `ollama pull qwen3-embedding:0.6b` |
| Documentación | `python scripts/download_docs.py 3.14` y `python scripts/convert_docs.py` |
| Revisar troceado | `python scripts/count_chunks.py` |
| Índice | `python scripts/build_index.py` |
| Consulta | `python scripts/search.py "..."` y `python scripts/get_doc.py ...` |

## Decisiones

La versión es `3.14`, la de Python instalado en este equipo. Si la URL oficial de 3.14 no responde, se pide a la persona que elija otra (`3.13`, `3.15`). No se elige sola.

Ollama tiene que estar en marcha. Si no lo está, el paso del índice falla con `Ollama is not running`: se arranca la app y se repite ese paso.

`scripts/embed_texts.py` reintenta si Ollama devuelve un error 400 (`EOF` o `connection reset`). Es el único código que cambia, más `EMBED_RETRIES` y `EMBED_PAUSE` en `scripts/settings.py`. Se descartaron `BATCH_SIZE` más pequeño (sin garantía) y CPU (mucho más lento).

El índice puede tardar entre unos minutos y bastante más sin GPU. Se lanza una sola vez y no se interrumpe.

## Comprobación de la constitución

| Condición | Cómo |
| --- | --- |
| Solo entra la documentación de la versión descargada | Solo se descarga `3.14`. |
| Todo corre en local | Chroma en `chroma_db/`, embeddings con Ollama. |
| Los scripts abren `chroma_db/` sin servidor | No se arranca `chroma run`. |
| `python-docs/`, `python-docs-md/`, `chroma_db/` y `.venv/` no van a git | Ya están en `.gitignore`. Se comprueba con `git status`. |
| No se añade una dependencia | `requirements.txt` no se toca. |

El estilo de código se sigue en `embed_texts.py`: inglés, tipos, `raise RuntimeError`, una acción por línea.

`src/core` y `src/sdk` no se crean ni se modifican. El ciclo no llama al tester por este cambio.

## Qué mirar

| Comprobación de la spec | Dónde |
| --- | --- |
| 1 y 2 | `diff -rq` y `git status` de `exercises/ChromaDB` |
| 3 | `ollama list` |
| 4 | Salida de `convert_docs.py` |
| 5 | Última línea de `build_index.py` |
| 6 y 7 | Salida de `search.py` y `get_doc.py` |
| 8 | `git status` y `git check-ignore -v` |
| 9 | `pgrep -fl "chroma|build_index"` vacío |
