# Plan — apertura de la pull request en un solo paso

Issue: #928.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Se crean:

- `docs/specs/latest-pr-creation/spec.md`
- `docs/specs/latest-pr-creation/plan.md`
- `docs/specs/latest-pr-creation/tasks.md`
- `tools/create-pr-base-staging.sh`

Se tocan:

- `agents/git-workflow-agent.md`
- `agents/create-pr.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `docs/ARCHITECTURE.md`, en los puntos de esos ficheros

La ruta del script es `staff/esther-patino/first-app/tools/create-pr-base-staging.sh`. No usa la ruta de `exercises/`.

No se toca `skills/link-pr-to-issue/SKILL.md`. No se toca `src/`, `package.json` ni `MCPS/socket-mcp/`.

## Apertura

`skills/create-pr-base-staging/SKILL.md` llama a ese script con la rama, el título y el fichero del cuerpo. El script ejecuta `gh pr create` con `--base staging`, `--draft` y `--assignee "@me"`.

`agents/create-pr.md` usa esa skill en una sola invocación. `agents/git-workflow-agent.md` llama a `create-pr` con `create-pr-base-staging`. No nombra `assign-author` ni `create-draft` en ese paso.

Si la issue ya está escrita y el trabajo siguiente hace cambios, el momento es Empezar. Al dejarla escrita, si a continuación se van a hacer cambios, el momento siguiente es Empezar. Antes del paso siguiente, el orquestador confirma que el anterior ha salido bien.

## Pull request que ya existe

`assign-author` y `create-draft` se usan entonces. `create-draft` pasa a draft una pull request que ya existe. No crea otra. El enlace con la issue se conserva. El orquestador sigue dejando `Closes #N`. La issue sigue abierta. Nadie la cierra con una llamada.

## Errores

No hay fallo de la lista «Errores».

## Decisión

La constitución, el texto de esos ficheros y esta spec dicen lo mismo. Hay `tasks.md`. No hay pregunta abierta. El trabajo está en la rama `928-docs-latest-pr-creation`. La issue #928 sigue abierta. La pull request #929 sigue en draft.
