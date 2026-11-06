# Swagger UI en la API Nest de usuarios

Issue: #1071.

Quien prueba la app abre en el navegador la documentación interactiva de
la API Nest de usuarios. Ve las operaciones de crear, listar, ver por id,
modificar y borrar, y puede lanzar peticiones desde ahí sin Postman ni
otra herramienta externa.

Lo usa quien prueba la app con el cliente Nest ya existente, en
`http://127.0.0.1:3003`.

La documentación vive en `http://127.0.0.1:3003/docs`. La API de usuarios
sigue en las mismas rutas que antes: `POST /users`, `GET /users`,
`GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

Ejemplo: se abre `/docs`, se crea Ada con ada@example.com desde la UI,
se listan usuarios, se pide el 1, se cambia el nombre a Ada Lovelace y
se borra. Los cuerpos y códigos coinciden con la API Nest sin Swagger.

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

Cualquier otra ruta de la API (fuera de `/docs` y su spec) responde como
antes: sin cuerpo y con el mismo código que cuando la ruta no existe.

Queda fuera el cliente Express en el puerto 3001, la extensión Chrome,
Electron, terminal, navegador de la app, VS Code y Jupyter, la
contraseña, la autenticación, los permisos, contar por género, reglas
nuevas, mensajes nuevos y cambios en `src/logic/` y `src/queries/`.
