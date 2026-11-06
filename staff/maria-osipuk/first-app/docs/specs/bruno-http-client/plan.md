Issue: #1119

# Plan de la colección de Bruno para el cliente HTTP

## Enfoque

No hay código nuevo: ni lógica, ni consultas, ni cambios en `src/clients/http/app.js` ni en `src/db/server.js`. La colección son archivos de texto de Bruno (`.bru`) que describen peticiones HTTP y sus tests, y viven junto al cliente que prueban, en `src/clients/http/bruno/`.

Se sigue la lógica de la colección de referencia: dos carpetas numeradas, una petición por archivo con el número en el nombre, variables comunes en `collection.bru` y el id del usuario creado guardado en una variable para las peticiones siguientes. Lo que cambia son los mensajes: los de esta aplicación son los de la tabla de [ERRORS.md](../../ERRORS.md) y del propio `app.js`.

Bruno es una aplicación externa que abre la carpeta. No se añade ningún paquete a `package.json`, así que no hay revisión con Socket.

## Archivos

Se crean, dentro de `src/clients/http/bruno/`:

- `bruno.json`: nombre de la colección y versión del formato.
- `collection.bru`: variables `baseUrl` (`http://127.0.0.1:3001`) y `missingId` (`999999`).
- `01-sql-online/folder.bru` y trece peticiones, numeradas del `01` al `13`: `empty-list`, `create-ada`, `list-users`, `find-ada`, `patch-name`, `create-empty-name`, `create-invalid-email`, `create-used-email`, `get-missing`, `patch-missing`, `delete-missing`, `delete-ada`, `list-after-delete`.
- `02-sql-offline/folder.bru` y cinco peticiones, numeradas del `14` al `18`: `create-sql-offline`, `list-sql-offline`, `find-sql-offline`, `update-sql-offline`, `delete-sql-offline`.

Se modifican:

- `README.md`: apartado «Probar el cliente REST con Bruno» con los pasos de uso, la base temporal y el aviso de que la primera carpeta necesita una base vacía; una línea en «Dónde está el código».
- `docs/ARCHITECTURE.md`: la descripción de `src/clients/http/` añade que está documentado con Bruno en `bruno/`.
- `docs/TREE.md`: `bruno/` con sus archivos y esta spec.

`docs/CONSTITUTION.md`, `docs/STYLE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, `package.json` y `.gitignore` no cambian: el cliente, sus rutas y sus errores son los mismos.

## Qué lleva cada petición

| Elemento     | Contenido                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------- |
| `meta`       | Nombre sin número y `seq` igual al número del archivo, para fijar el orden en Bruno.      |
| Método y URL | `{{baseUrl}}/users` o `{{baseUrl}}/users/{{userId}}` o `{{baseUrl}}/users/{{missingId}}`. |
| Cuerpo       | JSON solo en crear y modificar. Datos ficticios: Ada, `ada@example.com`, `Ada Lovelace`.  |
| `tests`      | El estado y el cuerpo exactos de la spec. El borrado exitoso comprueba el cuerpo vacío.   |
| Script       | Solo `create-ada`: guarda el `id` de la respuesta en `userId` con `bru.setVar`.           |

Los textos de los tests van en español, como en la colección de referencia; los mensajes que se comparan van en inglés, tal como los responde el cliente.

## Detalles que hay que cuidar

- **El borrado sin servidor de datos.** `deleteUser` busca antes al usuario, así que sin servidor responde `Unable to find user`, no `Unable to delete user`. La petición `delete-sql-offline` comprueba el primero.
- **El id.** `userId` es un número en la respuesta; en el test de `find-ada` se compara con `Number(bru.getVar("userId"))`.
- **Base vacía.** `empty-list` y `create-used-email` dependen de ello. La colección no limpia la base: el README indica arrancar con una base temporal.

## Verificación

1. Revisar que cada archivo `.bru` tiene `meta`, método, URL y `tests`, y que los números van del 01 al 18 sin saltos.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, arrancar `pnpm start` y `pnpm run http`. Abrir la colección en Bruno y lanzar `01-sql-online`: trece peticiones en verde.
3. Parar `pnpm start`, dejar `pnpm run http` y lanzar `02-sql-offline`: cinco peticiones en verde.
4. Cambiar a propósito un mensaje esperado en un test y ver que Bruno lo marca en rojo; deshacer el cambio.
5. `pnpm format` y `pnpm lint` sobre lo tocado, y `pnpm test` sin cambios en su resultado. La base real no se usa.

## Pregunta abierta

¿Se acepta comprobar la colección solo a mano en la aplicación de Bruno, sin su línea de comandos? Ejecutarla desde terminal exigiría `pnpm dlx` con una herramienta temporal y su revisión con Socket, y la spec deja fuera lanzarla desde un comando del proyecto. Hasta tener la respuesta no se escribe `tasks.md`.
