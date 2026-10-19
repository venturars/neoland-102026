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
- No añadas dependencias. La base de datos es SQLite con `sqlite3`.
- No añadas tests.
- No añadas comandos de ejecución.
- Carpetas: `clients/terminal`, `db`, `docs`, `logic`, `queries`.
- `logic/` no importa `sqlite3`. Recibe el almacén.
- `CREATE TABLE` está en `queries/queries/` y `queries/users.js` lo ejecuta.
- Los errores usan `try/catch` y el mensaje va en inglés.



## Al terminar cualquier tarea

- No hay tests que ejecutar.
- No hay comandos de ejecución que lanzar.

