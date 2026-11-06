# Cliente HTTP con node:http

Issue: #1112.

Quien prueba la app crea, lista, ve, modifica y borra usuarios por HTTP
con un servidor hecho solo con APIs de Node. No hay contraseña. Los
documentos Jupyter de este cliente viven en `jupyter/` dentro del
cliente y prueban esa API.

Lo usa quien prueba la app sin Express y sin abrir los Jupyter de la
lógica.

Se arranca la base, que sigue donde ya está, y este cliente, en
`http://127.0.0.1:3004`. El cliente Express sigue en el puerto 3001 y
no se sustituye.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

Ejemplo. Se crea Ada con ada@example.com. Sale el id, el nombre Ada y
el email ada@example.com. La lista lo muestra. Se pide ese id y se
ven los mismos datos. Se cambia el nombre a Ada Lovelace. Se ve el
mismo id, el nombre Ada Lovelace y el email ada@example.com. Si se
borra, Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si el id no es un entero mayor o igual que 1, se ve `Invalid id`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Si no hay usuarios, la lista está vacía. No es un fallo.

Queda fuera la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo y cambiar lo que ya hacen la lógica, las consultas y
los otros clientes. Tampoco se sustituye el servidor que ejecuta el
SQL ni el cliente Express ni la colección Bruno.
