# Plan — meter el flujo de git en first-app

Issue: #589.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Se copian desde `exercises/git-workflow-agent-template` a `staff/esther-patino/first-app`, con el mismo texto:

- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `agents/create-issue.md`
- `agents/create-branch.md`
- `agents/create-commit.md`
- `agents/create-pr.md`
- `agents/launch-push.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/create-issue/SKILL.md`
- `skills/assign-author/SKILL.md`
- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `skills/link-pr-to-issue/SKILL.md`
- `skills/assign-reviewers/SKILL.md`
- `tools/check-status.sh`
- `tools/pull-changes.sh`
- `tools/create-branch-from-staging.sh`
- `tools/create-branch.sh`
- `tools/create-empty-commit.sh`
- `tools/commit-changes.sh`
- `tools/launch-push.sh`
- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`
- `MCPS/github-mcp-server/mcp.txt`

Se tocan, después de la copia:

- las skills cuyo comando es `./tools/`
- `AGENTS.md` de first-app
- `docs/tree.md`
- `docs/ARCHITECTURE.md`

No se toca `logic/`, `queries/`, `db/`, `clients/`, `scripts/`, `package.json` ni las specs ya escritas.

## Rutas

Los scripts se lanzan desde la raíz del repositorio. En estas skills, cada `./tools/` pasa a `staff/esther-patino/first-app/tools/`:

- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`

El resto de cada skill sigue igual. Las skills sin script no cambian.

## AGENTS.md

Al principio, antes de `## Proyecto`, queda esta frase:

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta.

El resto del fichero sigue igual. No se toca el `AGENTS.md` de la raíz.

## Árbol

En `docs/tree.md`, dentro de `first-app/` y antes de `docs/`, entran estas carpetas, sin los ficheros de dentro:

```
  agents/
  skills/
  tools/
  templates/
  MCPS/
```

El resto del árbol sigue igual.

## Arquitectura

En `docs/ARCHITECTURE.md`, antes de `docs/`, se añaden estos puntos. El resto sigue igual.

- `agents/git-workflow-agent.md` reconoce el momento y llama al subagente o a la skill que toca.
- `agents/help-me-to-think.md` hace una pregunta cada vez hasta que la tarea se puede dejar escrita.
- `agents/create-issue.md` crea la issue con título en inglés y descripción en español, asignada a quien está autenticado.
- `agents/create-branch.md` crea la rama `número-tipo-descripcion`.
- `agents/create-commit.md` hace un commit pequeño con ficheros nombrados.
- `agents/create-pr.md` abre la pull request contra `staging` y la deja en draft, sin enlazar la issue.
- `agents/launch-push.md` publica `HEAD` en `origin` y deja el upstream puesto.
- `skills/grill-with-docs/SKILL.md` entrevista cuando el cambio vive en este proyecto.
- `skills/grill-me/SKILL.md` entrevista cuando el repositorio no responde.
- `skills/create-issue/SKILL.md` deja la tarea escrita en GitHub.
- `skills/assign-author/SKILL.md` asigna la issue o la pull request al usuario autenticado.
- `skills/check-status/SKILL.md` dice la rama, los cambios sin commit y el remoto.
- `skills/pull-changes/SKILL.md` adelanta `staging` en fast-forward.
- `skills/create-branch-from-staging/SKILL.md` abre la rama desde `staging`.
- `skills/create-branch/SKILL.md` abre la rama desde una base que no es `staging`.
- `skills/create-empty-commit/SKILL.md` hace el commit vacío `chore: open #N`.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros nombrados.
- `skills/launch-push/SKILL.md` sube la rama actual y fija el upstream.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request con base `staging`.
- `skills/create-draft/SKILL.md` deja la pull request en draft.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N`. La issue se cierra cuando se fusiona la pull request.
- `skills/assign-reviewers/SKILL.md` asigna a quienes miran la pull request y la saca de draft.
- `tools/check-status.sh` escribe la rama, el remoto y los cambios.
- `tools/pull-changes.sh` adelanta `staging` en fast-forward.
- `tools/create-branch-from-staging.sh` crea la rama desde `staging`.
- `tools/create-branch.sh` crea la rama desde otra base.
- `tools/create-empty-commit.sh` crea el commit vacío de apertura.
- `tools/commit-changes.sh` guarda los ficheros nombrados.
- `tools/launch-push.sh` sube la rama y fija el upstream.
- `templates/issues/basic_issue.md` es el cuerpo de la issue: qué hay que hacer y cómo probarlo.
- `templates/pull-request/basic-pull-request.md` es el cuerpo de la pull request.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Las paradas de «Orden» siguen como están. El flujo de git se añade con la frase del apartado «AGENTS.md». «Orden» no se cambia.
