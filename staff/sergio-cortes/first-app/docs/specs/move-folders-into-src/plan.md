# Plan — mover el código de la app a src

Issue: #598.

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. No hay firma
ni SQL nuevo. No hay paquete nuevo ni cambio de versión. No hay validación
Socket.

La constitución, el árbol, la arquitectura, la base de datos, los errores, el
estilo y `AGENTS.md` sitúan `db/`, `queries/`, `logic/` y `clients/` en la raíz
de first-app. Este desarrollo las deja en `src/` y actualiza esas guías vivas
para que digan lo mismo que la spec. Las reglas de negocio no cambian de capa:
siguen en `logic/`, no pasan a `queries/` ni a `clients/`.

## Ficheros

Se crea la carpeta `src/` al mover dentro, con el mismo contenido:

- `src/db/` (`connections.js`, `users.sqlite`)
- `src/queries/` (`user.js` y `queries/*.sql`)
- `src/logic/` (los `.js` que hay ahora)
- `src/clients/terminal/` y `src/clients/jupyter/`

No se crean ficheros nuevos dentro de esas carpetas.

No se edita el JavaScript de `logic/`, `queries/user.js` ni
`db/connections.js`. Los `import` relativos (`../queries/user.js`,
`../db/connections.js`) siguen resolviendo al mover las carpetas juntas. El
SQL se sigue leyendo con `import.meta.url`. `users.sqlite` sigue junto a
`connections.js`.

Se toca el texto de los clientes, porque Node los resuelve desde first-app:

- En cada `.txt` de `clients/terminal/`, `./logic/` pasa a `./src/logic/`.
- En `clients/terminal/create-user-table.txt`, `./db/` pasa a `./src/db/` y
  `./queries/` pasa a `./src/queries/`.
- El comentario de pegar con el directorio actual en first-app no cambia.
- En cada cuaderno de `clients/jupyter/`, el `import` del programa de Node
  queda igual que el de su `.txt`, carácter por carácter. La tabla no cambia.

Esos `.txt` son: `create-user-table.txt`, `create-user.txt`,
`update-user.txt`, `delete-user.txt`, `find-user-by-id.txt`,
`find-user-by-email.txt`, `find-user-by-name.txt`, `list-users.txt`,
`user-gender-count.txt`. Hay un cuaderno con el mismo nombre.

Se tocan también:

- `package.json`: el script `format` pasa a
  `prettier --write "src/db/**/*.js" "src/queries/**/*.js" "src/logic/**/*.js"`.
  `jupyter`, `lint` y `test` no cambian. No se toca `pnpm-lock.yaml`.
- `eslint.config.js`: el ignore `clients/jupyter/**` pasa a
  `src/clients/jupyter/**`. El resto igual.
- `scripts/jupyter.sh`: el arranque pasa de `clients/jupyter` a
  `src/clients/jupyter`. El `cd` a la raíz de first-app no cambia.
- `AGENTS.md`, en **## Al terminar una tarea**: el cliente vive en
  `src/clients/terminal/` e importa la función de `src/logic/`. El directorio
  actual sigue siendo first-app.
- `docs/TREE.md`: `db/`, `queries/`, `logic/` y `clients/` quedan anidadas
  bajo `src/`. El resto del árbol no se mueve.
- `docs/ARCHITECTURE.md`: las rutas de `db/`, `queries/`, `logic/`,
  `clients/` y el arranque de Jupyter en `scripts/jupyter.sh` llevan el
  prefijo `src/`.
- `docs/DATABASE.md`: `db/users.sqlite`, `db/connections.js`, `queries/` y
  `queries/user.js` pasan a `src/`.
- `docs/ERRORS.md`: `logic/errors.js` y «no sale de `logic/`» pasan a `src/`.
- `docs/STYLE.md`: el contrato de `logic/` y `logic/errors.js` pasan a `src/`.
- `docs/CONSTITUTIONS.md`: «un fichero nuevo en `logic/`», «no se mueven sus
  reglas a `queries/` ni a `clients/`» y «llaman a `queries/user.js`» pasan a
  `src/`.

No se tocan `agents/`, `skills/`, `tools/`, `templates/`, `MCPS/` ni los `.sql`.

## Parecido

No hay fichero nuevo en `logic/`.

## Firma

No hay firma nueva. Siguen `createUser(input)`, `updateUser(input)`,
`deleteUser(id)`, `findUserById(id)`, `findUserByEmail(email)`,
`findUserByName(name)`, `listUsers()`, `usersGenderCount()` y
`createUsersTable(database)`.

## SQL

No hay SQL nuevo.

## Errores

No hay un mensaje nuevo.

## Pregunta

Las specs ya cerradas en `docs/specs/` (salvo esta) nombran `logic/`,
`queries/`, `db/` y `clients/` en la raíz. Este plan no las reescribe.

Respuesta (2026-10-29): se dejan así, como registro de cuando esas carpetas
estaban en la raíz. No se reescriben.

## Aprobación

- **Spec:** aprobada por la persona (2026-10-29).
- **Plan:** aprobado (2026-10-29; `tasks.md` creado).
