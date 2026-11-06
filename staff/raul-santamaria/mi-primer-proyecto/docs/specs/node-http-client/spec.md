# Cliente HTTP nativo de usuarios

Issue: #1091.

Quien prueba la app crea, lista, ve, modifica y borra usuarios por HTTP
sin Express ni Nest. Abre un documento por cada ruta, ejecuta el bloque
y lee la respuesta.

Lo usa quien prueba la app sin abrir el navegador ni la terminal.

Se arranca este cliente en `http://127.0.0.1:3004`. La base sigue en el
mismo sitio que el resto de la app. El cliente Express sigue en
`http://127.0.0.1:3001`. La API de la extensión Chrome sigue en
`http://127.0.0.1:3002`. El cliente Nest sigue en
`http://127.0.0.1:3003`.

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

El Jupyter es el del entorno de la app. Un comando nuevo abre la lista
de documentos de este cliente, en la interfaz de notebooks. No se abre
Lab. No se usa un Jupyter instalado aparte. El comando que ya abre los
documentos de las acciones de terminal no cambia.

Cada documento es una ruta de esta API. El bloque pide a este cliente
por HTTP. Los datos de ejemplo se pueden cambiar antes de ejecutar.
Sale el código HTTP y el cuerpo. Si no hay cuerpo, se ve el código y
ningún JSON.

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

Si no hay servidor, se ve el error de la petición.

Queda fuera la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo, un paquete npm, una colección Bruno, Jupyter Lab, un
Jupyter ajeno al entorno de la app y cambiar lo que ya hacen la
lógica, las consultas y los clientes Express, Chrome, Nest, terminal,
Jupyter y navegador.
