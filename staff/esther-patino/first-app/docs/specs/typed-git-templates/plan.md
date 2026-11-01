# Plan — plantillas por tipo en el flujo de git

Issue: #686.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Se copian desde `exercises/git-workflow-agent-template/templates` a `staff/esther-patino/first-app/templates`, con el mismo texto:

- `issues/feat_issue.md`
- `issues/fix_issue.md`
- `issues/docs_issue.md`
- `issues/refactor_issue.md`
- `issues/test_issue.md`
- `issues/chore_issue.md`
- `pull-request/feat-pull-request.md`
- `pull-request/fix-pull-request.md`
- `pull-request/docs-pull-request.md`
- `pull-request/refactor-pull-request.md`
- `pull-request/test-pull-request.md`
- `pull-request/chore-pull-request.md`

Se borran:

- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`

Se tocan, para que el cuerpo use la plantilla del tipo y, si el tipo no tiene plantilla, la más cercana:

- `skills/create-issue/SKILL.md`
- `agents/create-issue.md`
- `skills/create-pr-base-staging/SKILL.md`
- `agents/create-pr.md`

Se tocan, para que el enlace deje `Closes #N` y cierre la issue:

- `skills/link-pr-to-issue/SKILL.md`
- `agents/git-workflow-agent.md`
- `docs/ARCHITECTURE.md`
- `docs/specs/git-workflow-in-first-app/spec.md`
- `docs/specs/git-workflow-in-first-app/plan.md`

En `docs/ARCHITECTURE.md` también se nombran las doce plantillas en lugar de las dos básicas. `docs/tree.md` ya tiene la carpeta `templates/` y no cambia.

No se toca `logic/`, `queries/`, `db/`, `clients/`, `scripts/` ni `package.json`. Las demás specs ya escritas no cambian.

## Estado actual

`skills/create-issue/SKILL.md` rellena `templates/issues/basic_issue.md`. `agents/create-issue.md` ya habla de `templates/issues/<template>.md`, pero el único fichero es el básico.

`skills/create-pr-base-staging/SKILL.md` y `agents/create-pr.md` rellenan `templates/pull-request/<template>.md` y dejan la sección Issue vacía. El único fichero es `basic-pull-request.md`.

`skills/link-pr-to-issue/SKILL.md` deja `Related to #N` y prohíbe las palabras de cierre. `agents/git-workflow-agent.md` dice que el enlace no cierra la issue.

## Enlace

La sección Issue, al enlazar, queda `Closes #N`. En ese mismo paso la issue pasa a cerrada. No se espera a la fusión. La base de la pull request sigue siendo `staging`.

La plantilla del ejercicio no cierra la issue al enlazar: la deja para la fusión en la rama por defecto. Aquí se cierra al enlazar.

La frase «No uses `gh` ni un script de `tools/`» de las skills de first-app se queda. No se copia la frase del header de `mcp.json` que trae la skill del ejercicio.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Al enlazar, el cuerpo lleva `Closes #N` y la issue queda cerrada. Se modifican en este cambio la skill de enlace, el orquestador, `docs/ARCHITECTURE.md` y la frase del enlace en la spec `git-workflow-in-first-app`.
