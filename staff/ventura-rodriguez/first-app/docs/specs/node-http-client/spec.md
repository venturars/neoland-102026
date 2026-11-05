# Cliente node:http de usuarios documentado con Jupyter

Issue: #1092.

Quien prueba la app crea, lista, ve, modifica y borra usuarios por
HTTP con el HTTP de Node. No hay contraseña. No hay página. Los
documentos Jupyter de esa API viven en la carpeta jupyter de este
cliente.

Lo usa quien prueba este cliente sin Express, sin Bruno, sin Nest y
sin los documentos Jupyter que ya ejecutan las acciones de la app.

Se arranca la base, que sigue donde ya está, y este cliente, en
`http://127.0.0.1:3004`.

Los documentos se abren con el Jupyter de la app, apuntando a esa
carpeta jupyter. No se abre Lab. No usa el Jupyter del ordenador. El
comando que ya abre los documentos de las acciones sigue igual.

Hay documentos con la base en marcha y documentos con la base caída.
Los de la base en marcha se ejecutan con la lista vacía.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario. Si hay datos, salen en
tabla. Si falla, se ve el mensaje y no la tabla de datos.

Ejemplo: se crea Ada con ada@example.com. Sale el id, el nombre Ada y
el email ada@example.com. La lista lo muestra. Se pide ese id y se
ven los mismos datos. Se cambia el nombre a Ada Lovelace. Se ve el
mismo id, el nombre Ada Lovelace y el email ada@example.com. Si se
borra, Ada ya no sale en la lista.

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
mensaje nuevo, una página propia y un paquete nuevo. Tampoco se
cambia lo que ya hacen la lógica, las consultas y los clientes de
terminal, Jupyter, navegador, HTTP, escritorio, Chrome, VS Code y
Nest. Tampoco se sustituye el servidor que ejecuta el SQL. Tampoco se
mueven estos documentos al Jupyter de las acciones, ni se cambia su
comando, ni se abre Lab, ni se usa el Jupyter del ordenador.
