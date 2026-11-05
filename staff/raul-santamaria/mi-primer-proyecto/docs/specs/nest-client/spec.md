# Cliente HTTP Nest de usuarios

Issue: #984.

Quien prueba la app crea, lista, ve, modifica y borra usuarios por HTTP.
No hay contraseña.

Lo usa quien prueba la app sin abrir la página del navegador ni la ventana
de escritorio.

Se arranca este cliente en `http://127.0.0.1:3003`. La base sigue en el
mismo sitio que el resto de la app. El cliente Express sigue en
`http://127.0.0.1:3001`. La API de la extensión Chrome sigue en
`http://127.0.0.1:3002`.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

Ejemplo: se crea Ada con ada@example.com. Sale el id 1, el nombre Ada
y el email ada@example.com. La lista lo muestra. Se pide el 1 y se ven
los mismos datos. Se cambia el nombre a Ada Lovelace. Se ve el id 1,
el nombre Ada Lovelace y el email ada@example.com. Si se borra, Ada
ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si el id no vale, se ve `User id is not valid`.

Si ese usuario no está, se ve `No user exists with that id`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Cualquier otra ruta responde sin cuerpo y con el mismo código que el
cliente Express cuando la ruta no existe.

Queda fuera la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo, una página propia, TypeScript y cambiar lo que ya hacen
la lógica, las consultas, el cliente Express, Electron y los clientes
de terminal, Jupyter y navegador.
