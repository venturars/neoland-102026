# Mapa

`ejemplo.js` y `test/` llaman a `logic/operaciones.js`. Si quieren guardar, llaman también a `db/sqlite.js`. Las pruebas usan `test/almacen-memoria.js` para no tocar el fichero.

`logic` decide si un usuario es válido y qué pasa al crearlo, cambiarlo o borrarlo. Recibe el almacén como primer argumento. No abre SQLite ni lee `.sql`.

`queries` son las frases SQL, una por fichero. `db/sqlite.js` abre la base, ejecuta `db/esquema.sql` y traduce esas frases a las cinco funciones del almacén: `guardar`, `buscarPorId`, `buscarPorEmail`, `listar` y `borrar`.

`guardar` sin `id` inserta. `guardar` con `id` actualiza.
