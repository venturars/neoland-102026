# Cliente de VS Code para usuarios

Issue: #950.

Quien prueba la app crea, lista, ve, modifica y borra usuarios desde
una extensión de VS Code. No hay contraseña.

Lo usa quien prueba la app en VS Code, sin el cliente HTTP, la
terminal, el navegador, Jupyter, el escritorio ni Chrome.

Se arranca la base, que sigue donde ya está. Se abre con el comando
`vscode` de la app, desde `first-app`. Eso abre una ventana de
desarrollo de VS Code. En la barra lateral está la vista Usuarios.
Es una sola pantalla. El proceso de la extensión usa las acciones
que ya tiene la app. La vista solo muestra el resultado. No hay otra
API.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

La vista muestra la lista. Cada usuario se ve con su id, su nombre,
su email y las dos fechas. Crear, ver, modificar y borrar se hacen en
esa vista y el resultado se ve ahí.

Ejemplo: se crea Ada con ada@example.com. Sale el id 1, el nombre Ada,
el email ada@example.com y las dos fechas. La lista lo muestra. Se
pide el 1 y se ven los mismos datos. Se cambia el nombre a Ada
Lovelace. Se ve el id 1, el nombre Ada Lovelace y el email
ada@example.com. Si se borra, Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera el instalador, publicarla, un paquete nuevo, otra API,
otro puerto, la contraseña, la autenticación, los permisos, contar
por género, buscar por nombre, buscar por email, una regla nueva, un
mensaje nuevo y cambiar lo que ya hacen la lógica, las consultas, la
base y los clientes de terminal, Jupyter, navegador, HTTP, escritorio
y Chrome. Tampoco se sustituye el servidor que ejecuta el SQL.
