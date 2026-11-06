# Gestionar usuarios desde Swagger UI

Issue: #1090

Quien usa la aplicación arranca la base y el cliente NestJS existente,
abre `http://127.0.0.1:3003/` en el navegador y ve Swagger UI. Desde esa
página puede crear, listar, consultar, modificar y borrar usuarios y ver
la respuesta de cada operación.

Crear pide nombre y email. Devuelve 201 y el usuario con `id`, `name`,
`email`, `createdAt` y `updatedAt`. Listar devuelve 200 y la lista de
usuarios; si no hay usuarios, devuelve `[]`. Consultar pide el id y
devuelve 200 con ese usuario y sus cinco campos.

Modificar pide el id y permite enviar nombre, email o ambos. Devuelve
200 con el usuario actualizado; un campo omitido conserva su valor.
Borrar pide el id y devuelve 204 sin cuerpo.

Ejemplo: crear Ana con un email ficticio libre devuelve un id. La lista
incluye ese usuario y consultarlo por ese id devuelve sus mismos datos.
Modificar solo su nombre a Ana Durán conserva su email. Borrarlo devuelve
204; consultarlo después devuelve 404 y `User not found`. El id se toma
de la respuesta, sin suponer que sea 1.

La página permite introducir los cuerpos de crear y modificar y el id
de consultar, modificar y borrar. Presenta los estados y mensajes
actuales del cliente:

| Situación | Estado | Mensaje |
| --- | --- | --- |
| Nombre vacío | 400 | `Name is empty` |
| Email inválido | 400 | `Email is invalid` |
| Email de otro usuario | 409 | `Email is already used` |
| Usuario inexistente | 404 | `User not found` |
| Fallo al crear | 500 | `Could not create the user` |
| Fallo al listar | 500 | `Could not list the users` |
| Fallo al consultar | 500 | `Could not find the user` |
| Fallo al modificar | 500 | `Could not update the user` |
| Fallo al borrar | 500 | `Could not delete the user` |

El alcance es añadir la página al cliente existente. Se conservan las
rutas, reglas, datos, errores y comportamiento actuales de las cinco
operaciones. Los demás clientes siguen funcionando con los mismos datos.
Quedan fuera autenticación, contraseñas, permisos, búsquedas nuevas,
clasificación por género y cambios en la persistencia.
