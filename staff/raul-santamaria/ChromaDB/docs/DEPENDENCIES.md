# Dependencias — ChromaDB

Todas van en [`requirements.txt`](../requirements.txt) con **versión fijada**. Antes de añadir o cambiar una dependencia, explicar el motivo a la persona; ella decide (ver [CONSTITUTION.md](CONSTITUTION.md)).

## Runtime

| Paquete | Para qué |
| --- | --- |
| `chromadb` | Almacén vectorial local (`chroma_db/`). |
| `ollama` | Cliente para calcular embeddings con Ollama en local. |
| `beautifulsoup4` + `lxml` | Parseo del HTML oficial de docs.python.org al convertir a Markdown. |
| `jupyter` | Notebooks en `src/clients/jupyter/` para el CRUD de usuarios. |

## Herramientas de desarrollo

| Paquete | Para qué |
| --- | --- |
| `black` | Formateador; fuente de verdad del estilo visual (ver [STYLE.md](STYLE.md)). |
| `ruff` | Linter y orden de imports; configuración en `pyproject.toml`. |

## Fuera de pip

| Componente | Para qué |
| --- | --- |
| **Ollama** (app) | Servidor local del modelo `qwen3-embedding:0.6b` (definido en `scripts/settings.py`). |
| **Python** ≥ 3.10 | Intérprete del venv `.venv/`. |

No se versiona el modelo de embeddings en git: cada equipo hace `ollama pull` según [COMMANDS.md](COMMANDS.md).
