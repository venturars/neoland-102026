# Plan — adaptar el flujo de git

Issue: #677.

No es funcionalidad de `src/core` ni `src/sdk`. Sin dependencia nueva.
El stack de git vive solo en `staff/raul-santamaria/ChromaDB/`.

## Ficheros

Se copian desde `exercises/git-workflow-agent-template/`:

- `agents/` (7 playbooks git; se mantienen `developer.md` y `tester.md`).
- `skills/` (15 del template; se mantiene `skills/python-docs/`).
- `tools/` (7 scripts bash).
- `templates/` (issues y pull requests del template).
- `MCPS/github-mcp-server/mcp.txt`.

Se tocan: `AGENTS.md`, `docs/CONSTITUTION.md`. Se crean `docs/TREE.md`,
`docs/ARCHITECTURE.md`, esta spec, este plan y `tasks.md`.

No se tocan `src/`, `scripts/` (RAG), `chromadash/`, `requirements.txt`
ni el staff root.

## Rutas

Los scripts se lanzan desde la raíz del monorepo. Las skills cuyo comando
es `./tools/` pasan a
`staff/raul-santamaria/ChromaDB/tools/`.

## Parche de `git-workflow-agent.md`

Tras copiar, se edita solo ese fichero:

- No merge a `staging`.
- Parada obligatoria antes del momento «pedir revisión» (no
  `assign-reviewers` ni quitar draft hasta que lo pida la persona).
- No saltar la llave en implementación.

## AGENTS.md

Al inicio: el trabajo de git sigue `agents/git-workflow-agent.md`.

Reglas de intervención (issue #677):

- Humano al crear o aprobar la issue (implementar + dos revisores).
- Con issue existente: spec, plan, tasks, git e implementación sin
  paradas intermedias.
- Llave solo en implementación (sección **Implementación** con el ciclo
  developer/tester actual).
- Parada antes de pedir revisión.
- Se conservan **Comandos** y **Al terminar una tarea**.

## Constitución, árbol y arquitectura

En `CONSTITUTION.md`: antes del SDD hace falta la issue; la spec abre
con `Issue: #N`.

En `TREE.md`: árbol de ChromaDB con `agents/`, `skills/`, `tools/`,
`templates/`, `MCPS/` además del layout RAG existente.

En `ARCHITECTURE.md`: bullets del stack git (orquestador aparte) y cómo
convive con scripts, `src/` y `chromadash/`.

## Comprobación de la constitución

| Condición | Cómo |
| --- | --- |
| El agente consulta docs con scripts, no MCP RAG | No se cambia `skills/python-docs/`. |
| Dependencias | `requirements.txt` intacto. |
| Estilo Python | No se editan `.py` de negocio. |

## Referencia

Conteos y rutas como mi-primer-proyecto #590. No se copia la sección
«Orden» con paradas en spec/plan/tasks de mi-primer.
