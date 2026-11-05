# Colección Bruno del cliente HTTP

Issue: #1103.

Quien prueba la app crea, lista, ve, modifica y borra usuarios del
cliente HTTP desde Bruno, sin escribir cada petición a mano. No hay
contraseña. Bruno se instala con Node. La colección vive junto a ese
cliente.

Se arranca la base, que sigue donde ya está, y el cliente HTTP, en
`http://127.0.0.1:3001`. La colección usa esa dirección.

Hay peticiones con la base en marcha y peticiones con la base caída.
Las de la base en marcha se ejecutan con la lista vacía.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y, si se cambia, el nombre,
el email o los dos. Un dato que no entra conserva el valor guardado.
Antes de guardar se comprueba que el email resultante no lo tenga otro
usuario. Al borrar entra el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale ningún usuario. Cada petición comprueba
el código de estado y, si hay fallo, el mensaje.

Ejemplo: se crea Ada con ada@example.com. Sale el id, el nombre Ada y
el email ada@example.com, con 201. La lista lo muestra. Se pide ese id
y se ven los mismos datos. Se modifica solo el nombre a Ada Lovelace.
Sale el mismo id, el nombre Ada Lovelace y el email ada@example.com,
con 200. Si se borra, la respuesta es 204 y Ada ya no sale en la lista.

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
género, buscar por nombre, buscar por email, `Id is invalid`, `Body is
invalid`, un mensaje nuevo, reescribir las specs anteriores de
Express, Nest o Swagger, y cambiar las consultas o el servidor que
ejecuta el SQL. El contrato de modificar (un campo o los dos, email
sin repetir) se documenta aquí. Chrome queda fuera. El comando `test`
de Node no se cambia.
