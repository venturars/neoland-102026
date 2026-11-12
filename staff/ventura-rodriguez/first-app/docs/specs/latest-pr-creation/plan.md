# Plan — abrir la pull request en un paso

Issue: #910.

No es una funcionalidad nueva. No reemplaza ningún fichero de
`logic/`. No hay firma. No hay SQL. No hay paquete de Node. No
entra Socket.

## Ficheros

Se crea:

- `tools/create-pr-base-staging.sh`

Se tocan:

- `agents/git-workflow-agent.md`
- `agents/create-pr.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `docs/ARCHITECTURE.md`

No se toca `logic/`, `queries/`, `db/`, `clients/`, `package.json`
ni `MCPS/socket-mcp/`. No se toca `skills/assign-author/SKILL.md`
ni el resto de agentes y skills.

## Texto

`agents/git-workflow-agent.md`, `agents/create-pr.md` y
`skills/create-draft/SKILL.md` quedan como la plantilla del curso,
sin cambiarlos.

`tools/create-pr-base-staging.sh` queda como la plantilla del
curso, sin cambiarlo.

`skills/create-pr-base-staging/SKILL.md` queda como la plantilla
del curso. Cambia la ruta del comando.

## Rutas

El comando sigue llevando `bash`, la rama, el título y el fichero
del cuerpo, como en la plantilla. La ruta es
`staff/ventura-rodriguez/first-app/tools/create-pr-base-staging.sh`.
No usa la ruta de `exercises/` ni `./tools/`.

## Árbol

`docs/TREE.md` ya lista `tools/` y no lista los ficheros de
dentro. La carpeta sigue. El árbol no se modifica.

## Arquitectura

Se sustituyen estos puntos. Se añade el del script después de
`tools/launch-push.sh`. El resto sigue igual.

- `agents/git-workflow-agent.md` reconoce el momento, llama al
  subagente como un agente aparte y confirma cada paso antes del
  siguiente. El padre no hace ese trabajo.
- `agents/create-pr.md` abre la pull request contra `staging`, en
  draft y asignada a quien está autenticado, en una sola
  invocación. No enlaza la issue.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request
  con base `staging`, en draft y asignada a quien está
  autenticado.
- `skills/create-draft/SKILL.md` pasa a draft una pull request
  que ya existe.
- `tools/create-pr-base-staging.sh` crea la pull request con base
  `staging`, en draft y asignada a quien está autenticado.

El punto de `skills/assign-author/SKILL.md` sigue igual.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».
