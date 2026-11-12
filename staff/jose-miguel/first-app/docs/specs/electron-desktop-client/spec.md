# Cliente de escritorio Electron

Issue: #951.

Quien prueba la app abre una ventana de escritorio propia para crear, listar, ver, modificar y borrar usuarios. No sustituye al navegador: tiene su propia página. No hay contraseña.

La base tiene que estar en marcha (`pnpm server`, `http://127.0.0.1:3000`). El cliente se abre con `pnpm electron` desde first-app, en otra terminal.

Al crear entran nombre y email. Al listar no entra nada. Al ver uno entra el id. Al modificar entran id y nombre, email o ambos; lo que no se envía conserva el valor guardado. Al borrar entra el id.

Se muestra el usuario que devuelve la app: id, nombre, email, `createdAt`, `updatedAt`. La lista está vacía si no hay usuarios.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera instaladores, reutilizar el cliente de navegador, contraseña, autenticación, permisos, contar por género, buscar por nombre o email, reglas nuevas, mensajes nuevos y cambiar `logic/`, `queries/`, el servidor SQL o los clientes terminal, Jupyter, browser y HTTP.
