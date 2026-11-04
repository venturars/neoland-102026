# Cliente HTTP REST de usuarios

Issue: #880.

Quien prueba la app crea, lista, ve, modifica y borra usuarios por HTTP. No hay contraseña.

Lo usa quien prueba la app sin abrir el navegador ni la terminal.

Se arranca la base (`pnpm server`, `http://127.0.0.1:3000`) y este cliente (`pnpm http`, `http://127.0.0.1:3001`).

Al crear entran el nombre y el email. Al listar no entra nada. Al ver uno entra el id. Al modificar entra el id y el nombre, el email o los dos. Un dato que no entra conserva el valor guardado. Al borrar entra el id.

Sale el usuario que ya devuelve la app: id, nombre, email, `createdAt`, `updatedAt`. Al listar sale esa lista. Si no hay usuarios, la lista está vacía. Al borrar no sale un usuario.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera contraseña, autenticación, permisos, contar por género, buscar por nombre o email, reglas nuevas, mensajes nuevos y cambiar `logic/`, `queries/` o los clientes terminal, Jupyter y navegador. No se sustituye el servidor SQL.
