# Tasks: Cliente de navegador

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Servidor
- [x] Crear `src/clients/browser/server.js` con las rutas del plan.
- [x] Añadir el script `browser` a `package.json`.

## T2. Pantallas
- [x] Crear `src/clients/browser/public/index.html` con las tres pantallas.
- [x] Crear `src/clients/browser/public/styles.css`.
- [x] Crear `src/clients/browser/public/app.js`.

## T3. Formato y lint
- [x] Añadir los ficheros nuevos al script `format` de `package.json`.
- [x] Añadir las globales del plan a `eslint.config.js`.

## T4. Comprobación
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] Las rutas con `curl` y el usuario temporal `tmp-768-1`, con todos los casos del plan.
- [x] Las tres pantallas en el navegador con el usuario temporal `tmp-768-2`, de principio a fin.
- [x] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T5. Guías
- [x] `ARCHITECTURE.md`: el fichero `server.js` y el cliente de navegador en la sección Clientes.
- [x] `TREE.md`: la carpeta `src/clients/browser/`.
- [x] `STYLE.md`: los textos de las pantallas del navegador van en español; los errores, tal cual los lanza `logic`.
- [x] `AGENTS.md`: el comando `pnpm browser`.

## T6. Aspecto y confirmación propia (plan 1.1)
- [x] `index.html`: la lista de filas, las pantallas 2 y 3 con el orden de la sección Aspecto, y el `<dialog>` de confirmación.
- [x] `styles.css`: rehecho con los criterios de la sección Aspecto.
- [x] `app.js`: las filas como botones con iniciales, `askDeleteConfirmation()` y `removeUser()` desde la ventana.
- [x] `eslint.config.js`: quitar `confirm` de las globales.

## T7. Comprobación del cambio
- [x] Las tres pantallas en el navegador con un usuario temporal `tmp-768-3`: elegir con el ratón y con el teclado, Notas desactivada, volver, modificar, los errores, y la ventana de borrado cancelada con `Cancelar`, con `Esc` y confirmada.
- [x] Una captura de cada pantalla y de la ventana, en escritorio y en móvil.
- [x] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T8. `logic` directa en el navegador (plan 1.2)
- [x] Mergear la rama de #819 y resolver los choques.
- [x] `src/clients/browser/server.js`: solo la lista fija de ficheros del plan, sin las rutas `/users`.
- [x] `index.html`: las rutas de `styles.css` y `app.js` desde `src/`.
- [x] `app.js`: importar `listUsers`, `updateUser` y `deleteUser` y llamarlas con `await`, sin `callServer`.
- [x] `src/db/server.js`: `BROWSER_ORIGIN`, `OPTIONS /query`, el 403 de otro `Origin` y el `Content-Type` obligatorio.

## T9. Comprobación del cambio
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] Con `curl` al cliente: los siete ficheros de la lista dan 200; `/users`, `/logic/classify-gender.js`, `/queries/users-sql.js`, `/db/users.sqlite` y una ruta con `..` dan 404.
- [x] Con `curl` a la base: `OPTIONS` desde `http://127.0.0.1:3000` da 204 con el permiso; un `POST` con otro `Origin` da 403; un `POST` sin `Content-Type: application/json` da 400; la terminal sigue funcionando.
- [x] Las tres pantallas en el navegador con un usuario temporal `tmp-768-4`: elegir, Notas desactivada, volver, modificar, los errores de la spec y la ventana de borrado cancelada y confirmada.
- [x] Con la base parada, la pantalla 1 enseña `Error: Database is not running. Start it with pnpm db.`
- [x] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T10. Guías y PR
- [x] `ARCHITECTURE.md`: la sección Navegador con el camino nuevo, los ficheros que se sirven y el permiso del servidor de la base.
- [x] `TREE.md`: `server.js` del navegador solo sirve ficheros.
- [x] `AGENTS.md`: `pnpm db` antes de `pnpm browser`.
- [x] La descripción de #769 incluye #820 (#819).

## T11. Un solo servidor (plan 1.3)
- [x] Borrar `src/clients/browser/server.js`.
- [x] Mover `index.html`, `styles.css` y `app.js` de `public/` a `src/clients/browser/` con `git mv`.
- [x] `index.html`: enlazar `./styles.css` y `./app.js`.
- [x] `app.js`: importar de `../../logic/`.
- [x] `package.json`: el script `browser` abre Chrome como dice el plan.
- [x] `eslint.config.js`: el bloque del navegador para `src/clients/browser/**/*.js`.
- [x] `src/db/server.js`: `BROWSER_ORIGIN = "file://"`.

## T12. Comprobación del cambio 1.3
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] `pnpm browser` abre Chrome en el perfil aparte con la lista de usuarios.
- [x] Las tres pantallas en Chrome desde `file://`, con un usuario temporal `tmp-768-5`: elegir, Notas desactivada, volver, modificar, los errores de la spec y la ventana de borrado cancelada y confirmada. Se prueba con Chrome sin ventana (`--headless`) y un script, y después a mano.
- [x] Con la base parada, la pantalla 1 enseña `Error: Database is not running. Start it with pnpm db.`
- [x] Con `curl` a la base: `Origin: file://` da el permiso; `Origin: null` y `Origin: http://127.0.0.1:3000` dan 403; la terminal sigue funcionando.
- [x] No queda ningún `tmp-768-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T13. Guías y PR
- [x] `ARCHITECTURE.md`: la sección Navegador sin servidor, con `pnpm browser` abriendo Chrome, y el permiso `file://` del servidor de la base.
- [x] `TREE.md`: `src/clients/browser/` sin `server.js` ni `public/`.
- [x] `AGENTS.md`: `pnpm browser` abre Chrome; ya no hay nada que parar con Ctrl+C.
- [x] La descripción de #769: un solo servidor y Chrome.
