# Arquitectura — ChromaDB

Dos subsistemas en la misma carpeta del proyecto: **RAG** (documentación Python indexada) y **CRUD usuarios** (SQLite). Comparten convenciones en [STYLE.md](STYLE.md) y reglas en [CONSTITUTION.md](CONSTITUTION.md).

## Vista general

```text
                    ┌─────────────────────────────────────┐
                    │  RAG (scripts/ + chroma_db/)        │
  python-docs-md ──►│  download → convert → build_index   │
                    │  search.py / get_doc.py             │
                    └─────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │  CRUD (src/)                        │
  Jupyter ─────────►│  clients → sdk → core → storage → db│
                    └─────────────────────────────────────┘
```

## RAG — pipeline `scripts/`

| Pieza | Responsabilidad |
| --- | --- |
| `scripts/download_docs.py` | Baja HTML oficial a `python-docs/`. |
| `scripts/convert_docs.py` | Genera `python-docs-md/`. |
| `scripts/build_index.py` | Trocea, embede con Ollama, escribe `chroma_db/`. |
| `scripts/search.py` | Búsqueda semántica (requiere Ollama). |
| `scripts/get_doc.py` | Búsqueda por nombre exacto. |
| `scripts/settings.py` | Constantes compartidas (versión, modelo, troceado). |
| `skills/python-docs/SKILL.md` | Cómo debe consultar un agente antes de escribir Python. |
| `chromadash/` | UI opcional; servidor Chroma solo para inspección. |

Un fichero Python por acción en `scripts/` (salvo `settings.py`).

## CRUD — capas `src/`

Solo la capa superior llama a la inmediatamente inferior:

```text
src/clients/jupyter/   notebooks, una acción por fichero
        │
        ▼
src/sdk/               API para clientes (`import sdk`)
        │
        ▼
src/core/              Reglas de negocio y validación
        │
        ▼
src/storage/           SQL vía ficheros en storage/queries/
        │
        ▼
src/db/                Conexión, schema.sql, ruta users.sqlite
```

Detalle de tablas y rutas: [DATABASE.md](DATABASE.md).

## Flujo git y agentes

| Componente | Rol |
| --- | --- |
| `agents/git-workflow-agent.md` | Orquestador: pensar, issue, rama, commit, PR. |
| `agents/help-me-to-think.md`, `create-issue.md`, … | Un paso del flujo git cada uno. |
| `AGENTS.md` | Manual del agente principal (lectura obligatoria, SDD, implementación). |
| `agents/developer.md` / `agents/tester.md` | Subagentes de implementación por rondas. |
| `skills/` + `tools/` | Automatización git/GitHub. |

Paradas humanas y llave de implementación: [AGENTS.md](../AGENTS.md).

## SDD — especificaciones

```text
docs/specs/<cambio>/     spec.md, plan.md, tasks.md (+ report.md si falla ronda 9)
templates/specs/         plantillas para specs NUEVAS (desde issue #682)
templates/issues/        plantillas de issues GitHub
```

- `<cambio>` en kebab-case; carpeta **después** de tener `Issue: #N`.
- Specs antiguas (`adapt-git-workflow`, `restructure-skills`, …) mantienen su formato; las nuevas copian `templates/specs/`.

## Documentación de referencia

| Fichero | Contenido |
| --- | --- |
| [TREE.md](TREE.md) | Árbol de carpetas |
| [COMMANDS.md](COMMANDS.md) | Comandos operativos |
| [DEPENDENCIES.md](DEPENDENCIES.md) | Paquetes pip y Ollama |
| [SECURITY.md](SECURITY.md) | Datos locales, servidor, Jupyter |
