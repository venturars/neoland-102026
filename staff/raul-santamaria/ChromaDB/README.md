# ChromaDB

RAG basado en [ChromaDB](https://www.trychroma.com/) con la documentación oficial de Python. Un agente consulta esa documentación al generar código, en lugar de fiarse de otra versión. La versión la eliges al descargar (`3.15`, `3.14`, …).

Todo corre en tu equipo: el índice en `chroma_db/` y los embeddings con [Ollama](https://ollama.com/) (`qwen3-embedding:0.6b`).

Trabaja desde `staff/raul-santamaria/ChromaDB`. Guía de comandos: **[docs/COMMANDS.md](docs/COMMANDS.md)**.

## Cómo funciona

```
python-docs-md/  ── build_index.py ──►  chroma_db/
                                            │
agente ── search.py "pregunta" ─────────────┤
agente ── get_doc.py pathlib.Path.open ─────┘
```

- Markdown generado en tu equipo (no viene en git). Pipeline: [COMMANDS.md](docs/COMMANDS.md).
- El agente usa [skills/python-docs/SKILL.md](skills/python-docs/SKILL.md).

El **CRUD de usuarios** (SQLite, Jupyter) es un ejercicio aparte: [docs/JUPYTER.md](docs/JUPYTER.md).

## Requisitos

- Python 3.10+
- [Ollama](https://ollama.com/download) en marcha
- ~2 GB libres (modelo + índice)

Comprobar Python: `python3 --version` (macOS) o `py -3 --version` (Windows).

## Instalación rápida

```bash
cd staff/raul-santamaria/ChromaDB
```

Crear venv, activar e instalar: ver sección **Entorno** en [docs/COMMANDS.md](docs/COMMANDS.md).

Después: `ollama pull qwen3-embedding:0.6b`, descargar docs, construir índice — mismo documento.

## Documentación del proyecto

| Documento | Para qué |
| --- | --- |
| [docs/CONSTITUTION.md](docs/CONSTITUTION.md) | Reglas del proyecto |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Capas y pipeline |
| [docs/STYLE.md](docs/STYLE.md) | Estilo, Black, Ruff |
| [docs/DATABASE.md](docs/DATABASE.md) | Chroma + SQLite |
| [docs/SECURITY.md](docs/SECURITY.md) | Datos locales |
| [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) | Paquetes pip |
| [docs/TREE.md](docs/TREE.md) | Árbol de carpetas |
| [AGENTS.md](AGENTS.md) | Flujo para agentes IA |

## ChromaDash

Visor web opcional del índice. [docs/COMMANDS.md](docs/COMMANDS.md) — sección ChromaDash.

## Calidad de código

Black y Ruff configurados en `pyproject.toml` (dependencias en `requirements.txt`). Uso en [docs/STYLE.md](docs/STYLE.md) y [docs/COMMANDS.md](docs/COMMANDS.md).
