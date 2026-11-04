# Plan — sincronizar el orquestador git

Issue: #845.

No es una funcionalidad nueva. No hay fichero en `src/logic/`. No hay
firma. No hay SQL. No hay paquete de Node.

## Decisión

La fuente de verdad es
`exercises/git-workflow-agent-template/agents/git-workflow-agent.md`.

La spec #737 alineó plantillas, agentes auxiliares y skills; first-app
quedó atrás en el orquestador tras los commits del 3 nov 2026 en el
ejercicio (validación de issue y contrato issue → PR draft → SDD del
proyecto, integrado en Contexto, Validación y Empezar). No se
reintroduce la sección `## 0. Al integrarlo en un proyecto` del template
(#812): el ejercicio la eliminó en favor de ese texto integrado.

`AGENTS.md` ya describe issue antes de specs y las paradas SDD; no se
reescribe. `docs/ARCHITECTURE.md` sigue describiendo al orquestador como
quien reconoce el momento; no hace falta ampliarlo.

## Ficheros

Se crean en esta fase spec:

- `docs/specs/sync-git-orchestrator/spec.md`
- `docs/specs/sync-git-orchestrator/plan.md`

Se crea en la implementación (cuando exista `tasks.md` aprobado):

- `docs/specs/sync-git-orchestrator/tasks.md`

Se sustituye en la implementación:

- `agents/git-workflow-agent.md` — copia literal del ejercicio (byte a
  byte).

No se tocan:

- `AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`,
  `docs/ARCHITECTURE.md`
- skills cuyo único diff con el ejercicio es la ruta
  `staff/sergio-cortes/first-app/tools/` (siete skills; ver
  `docs/specs/per-type-templates/plan.md`)
- `src/`, `package.json`, `MCPS/socket-mcp/`, resto de `agents/`,
  `tools/`, `templates/`

## Comprobación prevista

- `diff` vacío entre los dos `git-workflow-agent.md` (ejercicio y
  first-app).
- En el árbol git-workflow, el único desfase template ↔ first-app sigue
  siendo esas siete skills de ruta.
- `staff/sergio-cortes/first-app/tools/check-status.sh` termina bien
  desde la raíz del repositorio.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión de cierre

`tasks.md` se escribe cuando una persona haya leído y aprobado esta spec
y este plan. La copia del orquestador va en esas tareas, no antes.
