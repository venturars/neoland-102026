# Plan — cerrar la issue al fusionar la pull request

Issue: #706.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Se tocan:

- `skills/link-pr-to-issue/SKILL.md`
- `agents/git-workflow-agent.md`
- `docs/ARCHITECTURE.md`
- `docs/specs/git-workflow-in-first-app/spec.md`
- `docs/specs/git-workflow-in-first-app/plan.md`

No se toca `logic/`, `queries/`, `db/`, `clients/`, `scripts/`, `package.json` ni la plantilla de `exercises/`.

## Enlace

En `skills/link-pr-to-issue/SKILL.md`, la línea del cuerpo pasa de `Related to #N` a `Closes #N`. Ese paso no cambia el estado de la issue. La barra Development sigue con `addCloseIssueReferences`.

La base de la pull request es `staging`. La rama por defecto es `main`. GitHub cierra la issue al fusionar en `main`. Fusionar en `staging` deja la issue abierta: se cierra justo después, si sigue abierta.

## Orquestador

En `agents/git-workflow-agent.md`, al empezar, el enlace deja `Closes #N` y la issue sigue abierta. Cuando la pull request ya está fusionada, la skill cierra la issue si sigue abierta.

## Arquitectura y spec anterior

`docs/ARCHITECTURE.md` y la spec `git-workflow-in-first-app` dicen lo mismo: `Closes #N`, y la issue se cierra cuando se fusiona la pull request.

## Errores

No hay fallo de la lista «Errores».

## Decisión

El trabajo sigue en la rama `589-feat-git-workflow-in-first-app`. La issue #589 y la pull request #592 ya están cerradas. No se abre otra rama.
