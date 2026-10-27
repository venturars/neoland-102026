# Mapa

`ejemplo.js` y `test/` llaman a `logic/`. Si quieren guardar, llaman también a `queries/users.js`. `ejemplo.js` le pasa la conexión de `db/connection.js`. Las pruebas usan `test/almacen-memoria.js` para no tocar el fichero. `clients/terminal/*.txt` es un cliente por operación: se pega en la terminal, le pasa el almacén y hace `console.log`.

`logic` decide si un usuario es válido y qué pasa al crearlo, cambiarlo o borrarlo. Una operación, un fichero. Recibe el almacén como primer argumento. No abre SQLite ni lee `.sql`.

`db/connection.js` abre `db/users.sqlite`. `queries/queries` son las frases SQL, una por fichero. `queries/users.js` ejecuta `queries/queries/create-users-table.sql` y traduce esas frases a las cinco funciones del almacén: `guardar`, `buscarPorId`, `buscarPorEmail`, `listar` y `borrar`.

`guardar` sin `id` inserta. `guardar` con `id` actualiza.
