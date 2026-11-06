# Página para consumir los usuarios

Issue: #1070.

Quien prueba la app arranca la base, que sigue donde ya está, y el
cliente que ya escucha en `http://127.0.0.1:3003`. Abre esa dirección
en el navegador. Ve una página Swagger UI. Desde esa página crea,
lista, ve, modifica y borra un usuario, y ve el resultado de cada
acción, sin salir de la página.

No cambia cómo se crea, se lista, se abre, se modifica ni se borra.
No cambia las consultas ni los datos que ya se guardan. No cambia el
resto de clientes.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario. La respuesta al crear es 201. La respuesta al borrar es 204 y no trae cuerpo.

Ejemplo: en la página se crea Ada con ada@example.com. Sale el id 1,
el nombre Ada y el email ada@example.com. La lista lo muestra. Se pide
el 1 y se ven los mismos datos. Se cambia el nombre a Ada Lovelace y
se deja el correo. Se ve el id 1, el nombre Ada Lovelace y el email
ada@example.com. Si se borra, la respuesta es 204. Al volver a pedir
el 1, la respuesta es 404 y el mensaje es `User not found`.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo y otro cliente. La issue #978 dejó esta página fuera de
aquella tarea. Esta tarea es la página.
