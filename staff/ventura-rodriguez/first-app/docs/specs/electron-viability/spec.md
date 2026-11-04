# Cliente de escritorio propio

Issue: #901.

Quien prueba la app abre una aplicación de escritorio propia, en
macOS, Windows y Linux. Esa aplicación no es el cliente de navegador.
Tiene su ventana. Desde ella crea, lista, ve, modifica y borra
usuarios. No hay contraseña.

Lo usa quien prueba la app sin abrir el navegador, la terminal ni
Jupyter.

Se abre con el comando `electron` de la app, desde `first-app`. La
base tiene que estar en marcha, porque las acciones son las de la
app. Al crear entran el nombre y el email. Al listar no entra nada.
Al ver uno entra el id. Al modificar entra el id y el nombre, el
email o los dos. Un dato que no entra conserva el valor guardado. Al
borrar entra el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la
lista está vacía. Al borrar no sale un usuario.

Ejemplo: se crea Ada con ada@example.com. Sale el id 1, el nombre Ada
y el email ada@example.com. La lista lo muestra. Se pide el 1 y se
ven los mismos datos. Se cambia el nombre a Ada Lovelace. Se ve el
id 1, el nombre Ada Lovelace y el email ada@example.com. Si se borra,
Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Las reglas siguen en un solo sitio y este cliente solo las muestra.
No sustituye esas reglas. No es el cliente de navegador ni el sitio
que ya se abre por HTTP.

Queda fuera generar instaladores, reutilizar el cliente de
navegador, la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo y cambiar lo que ya hacen la lógica, las consultas, la
base y los clientes de terminal, Jupyter, navegador y HTTP.
