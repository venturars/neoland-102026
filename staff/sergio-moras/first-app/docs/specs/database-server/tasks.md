# Tasks: Base de datos en un servidor local

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Foto inicial
- [ ] Guardar la salida de `list-users.txt` antes de empezar.
- [ ] Con los comandos actuales y el usuario temporal `tmp-819-1`, guardar la salida de crear, buscar por email y por nombre, modificar y borrar, y de los errores: email inválido o repetido, nombre y email vacíos, id inexistente y no numérico. Borrar `tmp-819-1` al terminar.

## T2. El servidor
- [ ] Crear `src/queries/users-sql.js` con `USER_QUERIES` y el SQL de hoy, con `RETURNING id` en el borrado.
- [ ] Crear `src/db/server.js`.
- [ ] Añadir el script `db` a `package.json`.

## T3. `queries/`
- [ ] Reescribir `src/queries/users.js` con `runQuery` y las seis funciones `async`, sin importar la conexión.

## T4. `logic/`
- [ ] Las siete funciones de `src/logic/` pasan a ser `async` y usan `await` al llamar a `queries/`.

## T5. Clientes
- [ ] `await` en los siete `.txt` de `src/clients/terminal/`.
- [ ] `await` en el código de los siete `.ipynb` de `src/clients/jupyter/` y la anotación de que hace falta la base.

## T6. Comprobación
- [ ] Con la base parada: `list-users.txt` da `Error: Database is not running. Start it with pnpm db.`
- [ ] Con `pnpm db`: repetir T1 con el usuario temporal `tmp-819-2` y comparar con la foto. Solo cambian las fechas y el id.
- [ ] Al servidor, con `curl`: un nombre que no existe, `toString`, un cuerpo que no es JSON, sin `params`, otra ruta y otro método. Cada uno responde como dice el plan.
- [ ] `list-users` desde un documento de Jupyter da la misma tabla.
- [ ] No queda ningún `tmp-819-*` y `list-users.txt` da lo mismo que al empezar.
- [ ] `pnpm format` y `pnpm lint` sin errores.

## T7. Guías
- [ ] `ARCHITECTURE.md`: el camino `queries → servidor → db`, los ficheros nuevos, las peticiones del servidor y el mensaje de base parada que decide `queries/`.
- [ ] `TREE.md`: `src/db/server.js` y `src/queries/users-sql.js`.
- [ ] `DATABASE.md`: la conexión la usa solo el servidor y el SQL está en `src/queries/users-sql.js`.
- [ ] `ERRORS.md`: `Database is not running. Start it with pnpm db.` y las respuestas de error del servidor.
- [ ] `AGENTS.md`: el comando `pnpm db`, que va antes de los demás.
