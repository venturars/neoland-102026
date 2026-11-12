# Plan — adaptar el flujo de git

Issue: #590.

No es funcionalidad de `logic/`. Sin firma, SQL ni paquete Node. El stack
de git vive solo en `staff/raul-santamaria/mi-primer-proyecto/`.

## Ficheros

Se crean: `agents/` (7), `skills/` (15), `tools/` (7), `templates/` (2),
`MCPS/` (1), esta spec, este plan y `tasks.md`.

Se tocan: `AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`,
`docs/ARCHITECTURE.md`.

No se tocan `logic/`, `queries/`, `db/`, `clients/`, `package.json` ni el
staff root.

## Rutas

Los scripts se lanzan desde la raíz del monorepo. Las 7 skills de shell
usan `staff/raul-santamaria/mi-primer-proyecto/tools/`.

## AGENTS.md y constitución

Al principio: git sigue `agents/git-workflow-agent.md`. Se añade «Orden»:
orquestador primero; no hay `docs/specs/<nombre>/` sin número de issue;
paradas en spec/plan y en tasks. La primera regla empieza por el
orquestador. Se conservan pnpm, format y lint.

En `CONSTITUTIONS.md`, antes del SDD: la issue la escribe su subagente y
la spec abre con `Issue: #N`.

## Árbol y arquitectura

En `TREE.md`, antes de `docs/`: `agents/`, `skills/`, `tools/`,
`templates/`, `MCPS/`. En `ARCHITECTURE.md`, un bullet por cada pieza
del stack (orquestador como agente aparte).

## Firma / SQL / Errores

No hay. No hay fallo de la lista «Errores».

## Decisión

Se mantiene el orden de esta app (dos paradas). El árbol y la arquitectura
entran en las tareas; no se tocan antes.
