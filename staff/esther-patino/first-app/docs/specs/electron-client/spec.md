# Cliente de escritorio propio

Issue: #975.

Quien prueba la app abre una ventana de escritorio propia. Esa ventana
no es el cliente del navegador ni el de la extensión. Desde ella crea,
lista, ve, modifica y borra usuarios. No hay contraseña.

Lo usa quien prueba la app sin abrir el navegador, la terminal, Jupyter
ni el cliente HTTP.

Se arranca la base, que sigue donde ya está, y se abre esta ventana
con el comando `electron` de la app, desde `first-app`.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id del usuario elegido en la lista. Al modificar entra ese
id y el nombre, el email o los dos. Un dato que no entra conserva el
valor guardado. Al borrar entra ese id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista, con id, nombre y email. Si no
hay usuarios, la lista está vacía. Al elegir uno se ven los cinco
datos. Al borrar no sale un usuario y ese usuario ya no está en la
lista.

Ejemplo. Se crea Ada con ada@example.com. Sale el id 1, el nombre Ada,
el email ada@example.com y las dos fechas. La lista lo muestra. Se
elige el 1 y se ven los mismos datos. Se cambia el nombre a Ada
Lovelace. Se ve el id 1, el nombre Ada Lovelace y el email
ada@example.com. Si se borra, Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es el de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Si no hay usuarios, la lista está vacía. No es un fallo.

Las reglas siguen en un solo sitio y esta ventana solo las muestra. No
sustituye esas reglas. No escucha en un puerto nuevo.

Queda fuera la contraseña, la autenticación, los permisos, contar
usuarios según el sexo del nombre, buscar por nombre, buscar por email,
una regla nueva, un mensaje nuevo, generar un instalador y cambiar lo
que ya hacen la terminal, Jupyter, el navegador, HTTP y la extensión.
Tampoco se reutilizan las pantallas del navegador ni se sustituye el
programa que guarda la base.
