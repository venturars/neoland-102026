# Página Swagger UI para consumir la API de usuarios

Issue: #1082.

Quien consume la API arranca el cliente Nest, que sigue en
`http://127.0.0.1:3003`, y abre `http://127.0.0.1:3003/docs` en el
navegador. Ve una página Swagger UI con las cinco acciones de usuarios.
Desde esa página crea, lista, ve, modifica y borra un usuario, y ve la
respuesta de cada acción, sin salir de la página.

No cambia cómo se crea, se lista, se abre, se modifica ni se borra un
usuario. No cambian los datos que ya se guardan ni las consultas. No
cambia el resto de clientes.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entran el id, el nombre y el email: los
dos datos son obligatorios, no se cambia uno solo. Al borrar entra el
id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y las
dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista está
vacía. Al borrar no sale ningún usuario.

| Acción   | Éxito                         |
|----------|-------------------------------|
| Crear    | 201 con el usuario            |
| Listar   | 200 con la lista de usuarios  |
| Ver      | 200 con el usuario            |
| Modificar| 200 con el usuario            |
| Borrar   | 204 sin cuerpo                |

Cada acción de la página muestra qué datos entran, con un ejemplo, y
las respuestas posibles con su código y su mensaje.

Ejemplo: en la página se crea Ada con ada@example.com. Sale el id 1, el
nombre Ada y el email ada@example.com, con 201. La lista muestra a Ada.
Se pide el 1 y se ven los mismos datos. Se modifica el 1 con el nombre
Ada Lovelace y el email ada@example.com. Sale el id 1, el nombre Ada
Lovelace y el email ada@example.com, con 200. Si se borra el 1, la
respuesta es 204. Al volver a pedir el 1, la respuesta es 404 y el
mensaje es `User not found`.

Fallos que se ven en la página:

| Acción              | Fallo                                         | Respuesta | Mensaje                       |
|---------------------|-----------------------------------------------|-----------|-------------------------------|
| Ver, modificar, borrar | El id no es un número entero positivo     | 400       | `Id is invalid`               |
| Crear, modificar    | El nombre está vacío o falta                  | 400       | `Name is empty`               |
| Crear, modificar    | El email no vale o falta                      | 400       | `Email is invalid`            |
| Crear, modificar    | El cuerpo no es un objeto                     | 400       | `Body is invalid`             |
| Crear, modificar    | El email es de otro usuario                   | 409       | `Email is already used`       |
| Ver, modificar, borrar | Ese usuario no está                        | 404       | `User not found`              |
| Crear               | No se llega a la base                         | 500       | `Could not create the user`   |
| Listar              | No se llega a la base                         | 500       | `Could not list the users`    |
| Ver                 | No se llega a la base                         | 500       | `Could not find the user`     |
| Modificar           | No se llega a la base                         | 500       | `Could not update the user`   |
| Borrar              | No se llega a la base                         | 500       | `Could not delete the user`   |

Queda fuera la contraseña, la autenticación, los permisos, contar por
género, buscar por nombre, buscar por email, una regla de negocio nueva,
un mensaje nuevo, una página aparte para la documentación y cualquier
otro cliente. Esta tarea es la página en `/docs`.
