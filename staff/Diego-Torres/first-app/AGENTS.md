# AGENTS.md — first-app

## Proyecto

first-app es una app de usuarios para alumnos junior. Se construye con IA siguiendo el sistema SDD.

Está en Node, con módulos ES (`"type": "module"`). SQLite entra con `node:sqlite`. No hay dependencias de paquete. Los scripts se lanzan con pnpm.

La arquitectura está en `docs/CONSTITUCION.md`. Esta guía no la repite. Si una tarea y la constitución chocan, gana la constitución. Si la constitución, el código y esta guía se contradicen, se pregunta antes de escribir.

El directorio de trabajo es `staff/Diego-Torres/first-app`.

## Base de datos

`db/` solo contiene `connection.js` y `users.sqlite`.

`db/connection.js` exporta `db`, la conexión a `db/users.sqlite`. No se añade otro fichero en `db/`. El esquema es `queries/esquema.sql`. El almacén es `queries/sqlite.js`: recibe la conexión ya abierta y no abre el fichero.

## Comandos

Desde esta carpeta:

- Tests: `pnpm test`
- Ejemplo: `pnpm run ejemplo`

No hay script de lint ni de formato. No se añade uno salvo que se pida.

## Estilo

El código y los mensajes de error están en castellano.

Ficheros en kebab-case. Funciones y variables en camelCase. Exportaciones con nombre. Imports ESM con la extensión `.js`.

Comillas dobles, punto y coma, indentación de 2 espacios.

El código se lee de arriba a abajo, con `if` y con nombres que dicen qué hacen. No se añaden envoltorios de resultado ni capas de más.

## Antes de escribir

- Lee `docs/CONSTITUCION.md`.
- No inventes campos, errores, carpetas ni operaciones.
- Si la constitución, el código y esta guía se contradicen, pregunta antes de escribir.

## Al terminar

- Una operación nueva lleva su prueba en `test/usuarios.test.js`.
- La tarea no está hecha hasta ejecutar `pnpm test`. Si el cambio se ve a mano, ejecuta también `pnpm run ejemplo`.
