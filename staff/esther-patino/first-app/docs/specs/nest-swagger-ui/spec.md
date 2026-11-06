# Swagger UI en el cliente Nest

Issue: #1074.

Quien prueba la app quiere ver y lanzar las peticiones del cliente Nest
desde el navegador, sin escribir curl a mano.

Lo usa quien ya prueba crear, listar, ver, cambiar y borrar usuarios con
ese cliente en `http://127.0.0.1:3003`.

Se arranca la base, que sigue donde ya está, y el cliente Nest con el
comando `nest` de la app, desde `first-app`. En el mismo servidor hay
una página Swagger UI. Muestra las cinco acciones de usuarios que el
cliente ya expone. Desde ahí se elige una operación, se rellenan los
datos y se envía la petición. Se ve la respuesta en pantalla.

Las acciones son las de siempre:

- Crear entra el nombre y el email.
- Listar no entra nada.
- Ver uno entra el id.
- Cambiar entra el id y el nombre, el email o los dos. Un dato que no
  entra conserva el valor guardado.
- Borrar entra el id.

Sale lo mismo que ya devuelve el cliente Nest: el usuario con el id, el
nombre, el email y las dos fechas; al listar, la lista; al borrar, no
sale un usuario.

Ejemplo. Con la base y el cliente Nest en marcha, se abre Swagger UI en
el navegador. Se crea Ada con ada@example.com. La respuesta es 201 y
sale el id 1, el nombre Ada, el email ada@example.com y las dos fechas.
Desde la misma página se lista, se pide el 1, se cambia el nombre a Ada
Lovelace y se borra a Ada. Cada respuesta coincide con la que ya daba el
cliente sin Swagger.

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

No cambian las reglas de usuarios. Este cambio solo documenta y prueba la
API que ya existe. No sustituye al cliente HTTP ni a la base.

Queda fuera la contraseña, la autenticación, los permisos, rutas nuevas,
contar usuarios según el sexo del nombre, buscar por nombre, buscar por
email, una pantalla propia de la app, una regla nueva, un mensaje
nuevo, TypeScript y cambiar lo que ya hacen la terminal, Jupyter, el
navegador de pantallas, HTTP, Chrome, Electron y VS Code. Tampoco se
sustituye el programa que guarda la base.
