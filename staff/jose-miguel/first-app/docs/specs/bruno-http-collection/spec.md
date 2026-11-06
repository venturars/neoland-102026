# Colección Bruno del cliente HTTP

Issue: #1129.

Como quien prueba first-app, quiero lanzar las cinco operaciones del cliente Express (`http://127.0.0.1:3001`) desde Bruno, para no montar cada petición a mano.

Arranco `pnpm server` y `pnpm http`. La colección vive junto a ese cliente. Con la lista de usuarios vacía, cubre el camino feliz y los fallos visibles. Otra carpeta cubre las mismas acciones con el SQL parado.

No cambia `logic/`, `queries/`, `db/` ni las rutas de `src/clients/http/app.js`. Nest, Chrome y el resto de clientes no entran. El script `test` de `package.json` no se sustituye.

Entradas y salidas: las mismas que el cliente HTTP (#880). Crear pide `name` y `email` (201). Listar no pide nada (200). Ver, modificar y borrar piden `id`. En patch, un campo omitido conserva el valor. Borrar es 204 sin cuerpo.

Ejemplo online: lista vacía; crear Ada; listar; abrir por el `id` guardado; cambiar solo el nombre; fallos de nombre vacío, email inválido, email usado y usuario inexistente; borrar Ada; lista otra vez vacía.

Con SQL parado y HTTP en marcha: cada acción responde 500 con el `Could not …` de esa operación.

Queda fuera contraseña, auth, permisos, contar por género, búsquedas extra, reglas o mensajes nuevos.
