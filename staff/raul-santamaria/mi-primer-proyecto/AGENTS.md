# AGENTS.md — mi-primer-proyecto

## Proyecto

Primera app con IA para desarrolladores junior de AI Engineering, siguiendo SDD.
Node y SQLite. Lógica en `logic/`. SQL en `queries/queries/`.
`queries/users.js` importa esas queries. Conexión en `db/connection.js`.
Cliente en `clients/terminal/` (ficheros `.txt`).
La base del proyecto está en `docs/CONSTITUTIONS.md`.

## Comandos

No hay comandos de ejecución.

## Estilo

- `"type": "module"` en `package.json`.
- Prettier con su configuración por defecto.
- Código en inglés, pensado para personas hispanohablantes.

## Reglas

- El proyecto sigue SDD.
- No añadas dependencias. La base de datos es el SQLite de Node (`node:sqlite`).
- No añadas tests.
- No añadas comandos de ejecución.
- Carpetas: `clients/terminal`, `db`, `docs`, `logic`, `queries`.
- `logic/` no importa la base de datos. Recibe el almacén.
- El SQL está escrito dentro de la función que lo ejecuta.
- Los errores usan `try/catch` y el mensaje va en inglés.



## Al terminar cualquier tarea

- No hay tests que ejecutar.
- No hay comandos de ejecución que lanzar.

