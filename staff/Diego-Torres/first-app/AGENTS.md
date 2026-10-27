# AGENTS.md — first-app

## Proyecto

first-app es una app de usuarios para alumnos junior. Se construye con IA siguiendo el sistema SDD.

Está en Node, con módulos ES (`"type": "module"`). SQLite entra con `node:sqlite`. Las dependencias de paquete son `openai`, `cli-table3` y `@colors/colors`. Los scripts se lanzan con pnpm.

La arquitectura está en `docs/CONSTITUCION.md`. Esta guía no la repite. Si una tarea y la constitución chocan, gana la constitución. Si la constitución, el código y esta guía se contradicen, se pregunta antes de escribir.

Un desarrollo nuevo pasa por `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. Ahí viven `spec.md`, `plan.md` y `tasks.md`.

El directorio de trabajo es `staff/Diego-Torres/first-app`.

## Base de datos

`db/` solo contiene `connection.js` y `users.sqlite`.

`db/connection.js` exporta `db`, la conexión a `db/users.sqlite`. No se añade otro fichero en `db/`. El esquema es `queries/queries/create-users-table.sql`. El almacén es `queries/users.js`: recibe la conexión ya abierta y no abre el fichero.

`logic/` tiene un fichero por operación. `clients/terminal/` tiene un `.txt` por operación: se pega en la terminal con el directorio actual en `first-app`. Importa la función de `logic/`, le pasa el almacén y hace `console.log`.

## Comandos

Desde esta carpeta:

- Ejemplo: `pnpm run ejemplo`

Si el cambio se ve a mano, se ejecuta `pnpm run ejemplo`.

No hay script de lint ni de formato. No se añade uno salvo que se pida.

La dependencia `openai` es la del clasificador. `@colors/colors` y `cli-table3` son las tablas del cliente Jupyter. Se instalan con `pnpm install`. Jupyter se abre con `pnpm run jupyter`.

## Estilo

El código se escribe en castellano. Los nombres de las queries, de las funciones y de los documentos que las nombran van en inglés. Los tres errores de `logic/errors.js` también.

Ficheros en kebab-case. Funciones y variables en camelCase. Exportaciones con nombre. Imports ESM con la extensión `.js`.

Comillas dobles, punto y coma, indentación de 2 espacios.

El código se lee de arriba a abajo, con `if` y con nombres que dicen qué hacen. No se añaden envoltorios de resultado ni capas de más.

## Antes de escribir

- Lee `docs/CONSTITUCION.md`.
- No inventes campos, errores, carpetas ni operaciones.
- Si la constitución, el código y esta guía se contradicen, pregunta antes de escribir.
