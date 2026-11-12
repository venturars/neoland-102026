# Cliente Nest de usuarios

Issue: #1014.

Quien prueba la app crea, lista, ve, cambia y borra usuarios por HTTP
con un cliente Nest. No hay contraseña ni pantalla.

Lo usa quien prueba las mismas acciones del cliente HTTP sin abrir el
navegador ni la terminal.

Se arranca la base, que sigue donde ya está, y este cliente, en
`http://127.0.0.1:3003`. Se arranca con el comando `nest` de la app,
desde `first-app`.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al cambiar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

Ejemplo. Se crea Ada con ada@example.com. Sale el id 1, el nombre Ada,
el email ada@example.com y las dos fechas. La lista lo muestra. Se
pide el 1 y se ven los mismos datos. Se cambia el nombre a Ada
Lovelace. Se ve el id 1, el nombre Ada Lovelace y el email
ada@example.com. Si se borra, Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es el de otro usuario, se ve `Email is already used`.

Si el id no es un entero mayor o igual que 1, se ve `Invalid id`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al cambiar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Si no hay usuarios, la lista está vacía. No es un fallo.

Las reglas siguen en un solo sitio y este cliente solo las muestra. No
sustituye esas reglas. No sustituye al cliente HTTP ni a la base.

Queda fuera la contraseña, la autenticación, los permisos, contar
usuarios según el sexo del nombre, buscar por nombre, buscar por email,
una pantalla, una regla nueva, un mensaje nuevo, TypeScript y cambiar
lo que ya hacen la terminal, Jupyter, el navegador, HTTP, Chrome,
Electron y VS Code. Tampoco se sustituye el programa que guarda la
base.
