# Constitución — ChromaDB

Reglas **no negociables**. Cómo se organiza el código: [ARCHITECTURE.md](ARCHITECTURE.md). Cómo trabajan los agentes: [AGENTS.md](../AGENTS.md). Estilo y herramientas: [STYLE.md](STYLE.md).

ChromaDB es un RAG con la documentación oficial de Python (versión descargada en local). Un agente la consulta con scripts de terminal, no con un MCP.

## Condiciones del RAG

- Solo se indexa la documentación de la versión descargada.
- Todo corre en local: vectores en `chroma_db/`, embeddings con Ollama.
- Ningún fragmento se trunca al calcular su embedding.
- `python-docs/` es solo lectura.
- `python-docs-md/` se genera con `download_docs.py` + `convert_docs.py`; no se edita a mano.
- Los scripts acceden a `chroma_db/` sin servidor. El servidor Chroma solo para ChromaDash; pararlo antes de scripts que escriben.
- Carpetas fuera de git: `python-docs/`, `python-docs-md/`, `chroma_db/`, `.venv/`.
- `chromadash/` va en el repositorio (visor parcheado para API v2).
- Cada equipo construye su índice; el modelo de embeddings se define en `scripts/settings.py` y se baja con Ollama.

## Dependencias

Antes de añadir o cambiar una dependencia en `requirements.txt`, explicar el motivo a la persona; ella decide. Versiones fijadas. Detalle: [DEPENDENCIES.md](DEPENDENCIES.md).

## Código

- Estilo funcional, un fichero por función, capas en `src/` (ver [ARCHITECTURE.md](ARCHITECTURE.md)).
- Formato con **Black** y lint con **Ruff** según [STYLE.md](STYLE.md) y `pyproject.toml`.

## Cambios con SDD

- Issue en GitHub con número **antes** de crear `docs/specs/<cambio>/`.
- La spec abre con `Issue: #N`.
- Specs **nuevas** usan las plantillas en `templates/specs/`.
- Flujo git, paradas humanas e implementación: [AGENTS.md](../AGENTS.md).
