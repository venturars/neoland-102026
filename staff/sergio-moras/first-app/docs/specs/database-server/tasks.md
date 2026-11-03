# Tasks: Base de datos en un servidor local

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Foto inicial
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] Con los comandos actuales y el usuario temporal `tmp-819-1`, guardar la salida de crear, buscar por email y por nombre, modificar y borrar, y de los errores: email inválido o repetido, nombre y email vacíos, id inexistente y no numérico. Borrar `tmp-819-1` al terminar.

## T2. El servidor
- [x] Crear `src/queries/users-sql.js` con `USER_QUERIES` y el SQL de hoy, con `RETURNING id` en el borrado.
- [x] Crear `src/db/server.js`.
- [x] Añadir el script `db` a `package.json`.

## T3. `queries/`
- [x] Reescribir `src/queries/users.js` con `runQuery` y las seis funciones `async`, sin importar la conexión.

## T4. `logic/`
- [x] Las siete funciones de `src/logic/` pasan a ser `async` y usan `await` al llamar a `queries/`.

## T5. Clientes
- [x] `await` en los siete `.txt` de `src/clients/terminal/`.
- [x] `await` en el código de los siete `.ipynb` de `src/clients/jupyter/` y la anotación de que hace falta la base.

## T6. Comprobación
- [x] Con la base parada: `list-users.txt` da `Error: Database is not running. Start it with pnpm db.`
- [x] Con `pnpm db`: repetir T1 con el usuario temporal `tmp-819-2` y comparar con la foto. Solo cambian las fechas y el id.
- [x] Al servidor, con `curl`: un nombre que no existe, `toString`, un cuerpo que no es JSON, sin `params`, otra ruta y otro método. Cada uno responde como dice el plan.
- [x] `list-users` desde un documento de Jupyter da la misma tabla.
- [x] No queda ningún `tmp-819-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores. Con `console` en las globales de `eslint.config.js` (plan 1.1).

## T7. Guías
- [x] `ARCHITECTURE.md`: el camino `queries → servidor → db`, los ficheros nuevos, las peticiones del servidor y el mensaje de base parada que decide `queries/`.
- [x] `TREE.md`: `src/db/server.js` y `src/queries/users-sql.js`.
- [x] `DATABASE.md`: la conexión la usa solo el servidor y el SQL está en `src/queries/users-sql.js`.
- [x] `ERRORS.md`: `Database is not running. Start it with pnpm db.` y las respuestas de error del servidor.
- [x] `AGENTS.md`: el comando `pnpm db`, que va antes de los demás.
