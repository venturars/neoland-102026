# Arquitectura

## RAG (documentación Python)

- `scripts/`: pipeline de descarga, conversión, troceado, embeddings e
  indexado. Un fichero por acción; `search.py` y `get_doc.py` consultan
  el índice en local.
- `chroma_db/`: almacén vectorial (generado en cada equipo, fuera de git).
- `chromadash/`: visor opcional; arranca servidor Chroma solo para UI.
- `skills/python-docs/SKILL.md`: guía al agente para consultar antes de
  escribir Python.

## CRUD usuarios (SQLite)

- `src/clients/jupyter/` → `src/sdk/` → `src/core/` → `src/storage/` →
  `src/db/`. Ver `docs/CONSTITUTION.md`.

## Flujo git con agentes

- `agents/git-workflow-agent.md` elige el momento (pensar, issue, empezar,
  guardar, pedir revisión) y lanza un subagente aparte.
- `agents/help-me-to-think.md`, `create-issue.md`, `create-branch.md`,
  `create-commit.md`, `launch-push.md`, `create-pr.md` cubren cada paso.
- `skills/` y `tools/` ejecutan git y GitHub según las reglas de
  `AGENTS.md` (parada antes de pedir revisión; sin merge a `staging`).

## Implementación con IA

- Tras la issue y los documentos SDD, `agents/developer.md` y
  `agents/tester.md` implementan `tasks.md` (llave/contraseña solo en esa
  fase).
