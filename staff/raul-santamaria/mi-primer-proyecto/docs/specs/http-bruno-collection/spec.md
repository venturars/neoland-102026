# Colección Bruno dentro del cliente HTTP de usuarios

Issue: #1080.

Quien prueba la app lanza, desde el mismo proyecto Node, un lote de
peticiones contra el cliente HTTP de usuarios que ya existe. Ve los
códigos y los cuerpos JSON sin escribir cada petición a mano.

No es un cliente nuevo. El servidor sigue siendo `app.js` en
`src/clients/http/`, en `http://127.0.0.1:3001`, con la base en marcha
como el resto de la app. Lo que se añade es una colección Bruno y la
forma de ejecutarla con pnpm, todo dentro de esa misma carpeta
`src/clients/http/`.

Las operaciones son las mismas cinco rutas de siempre: `POST /users`,
`GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.

Al crear entran el nombre y el email. Al listar no entra nada. Al ver
uno entra el id. Al modificar entra el id y el nombre, el email o los
dos. Un dato que no entra conserva el valor guardado. Al borrar entra
el id.

Sale el usuario que ya devuelve la app: el id, el nombre, el email y
las dos fechas. Al listar sale esa lista. Si no hay usuarios, la lista
está vacía. Al borrar no sale un usuario.

Ejemplo: con `pnpm server` y `pnpm http` en marcha, se ejecuta el
comando del proyecto que lanza la colección; se crea Ada con
ada@example.com, se listan usuarios, se pide el id de Ada, se cambia el
nombre a Ada Lovelace y se borra. Los cuerpos y códigos coinciden con
el cliente HTTP sin usar Bruno.

La colección incluye también peticiones que provocan error conocido
(nombre vacío, email inválido, email duplicado, usuario inexistente y
ruta desconocida), con el mismo `{ message }` y el mismo HTTP que
`app.js`.

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

Cualquier otra ruta responde sin cuerpo y con el mismo código que
cuando la ruta no existe.

Queda fuera un segundo servidor HTTP, un puerto distinto del 3001, el
cliente Nest, la extensión Chrome, Electron, terminal, navegador de la
app, VS Code, Jupyter, Swagger UI en el puerto 3003, cambiar el
comportamiento de `app.js`, reglas nuevas en `src/logic/`, mensajes
nuevos y automatizar la suite en CI.
