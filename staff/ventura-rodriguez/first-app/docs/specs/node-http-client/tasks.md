# Tareas — cliente node:http de usuarios documentado con Jupyter

1. Abre `package.json`.
   Añade el script `node-http`: `node src/clients/node-http/app.js`.
   Añade el script `jupyter-node-http`: `sh scripts/jupyter-node-http.sh`. El glob de `format` incluye `src/clients/node-http/**/*.js`.
   El script `jupyter` sigue en `sh scripts/jupyter.sh`. No hay paquete nuevo.

2. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `node-http/` con `app.js` y `jupyter/` con `create-user.ipynb`, `list-users.ipynb`, `find-user-by-id.ipynb`, `update-user.ipynb` y `delete-user.ipynb`.
   En la raíz de `first-app` entra `scripts/jupyter-node-http.sh`.
   El resto del árbol no cambia.

3. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/node-http/` llama a `src/logic/`, usa `createServer` de `node:http` y escucha en el puerto 3004. Los notebooks viven en `jupyter/` y se abren con `pnpm jupyter-node-http`. Se lanza con `pnpm node-http`.
   No sustituye a `src/clients/http/`, ni a `src/clients/jupyter/`, ni a `src/db/server.js`.
   Esas líneas se leen en la arquitectura.

4. Crea `scripts/jupyter-node-http.sh`.
   Copia `scripts/jupyter.sh`. Solo cambia la carpeta que abre Notebook: `src/clients/node-http/jupyter`.
   Reutiliza el mismo `.venv` y `notebook` `7.6.3`.
   `scripts/jupyter.sh` no cambia.

5. Crea `src/clients/node-http/app.js`.
   Importa `createServer` de `node:http` y `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   `ORIGIN` es `http://127.0.0.1:3004`. El cuerpo JSON se lee como en `src/db/server.js`. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
   El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan. Otra ruta responde 404 y un cuerpo vacío.

6. Crea `src/clients/node-http/jupyter/create-user.ipynb`.
   El markdown lleva título, qué hace, qué pasa en la base, qué acción usa y las anotaciones del plan. La anotación dice que se abre con `pnpm jupyter-node-http` desde la app.
   El bloque hace `POST /users` a `http://127.0.0.1:3004` con Ada y ada@example.com, desde Node, y dibuja las columnas de un usuario.
   No busca `logic/`. Si falla, se ve el `message` y no la tabla de datos.

7. Crea `src/clients/node-http/jupyter/list-users.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque hace `GET /users` a `http://127.0.0.1:3004` y dibuja una fila por usuario. Lista vacía: encabezados y `No hay filas.`
   No busca `logic/`.

8. Crea `src/clients/node-http/jupyter/find-user-by-id.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque hace `GET /users/:id` a `http://127.0.0.1:3004` con el id de Ada y dibuja las columnas de un usuario.
   No busca `logic/`.

9. Crea `src/clients/node-http/jupyter/update-user.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque hace `PATCH /users/:id` a `http://127.0.0.1:3004` solo con el nombre Ada Lovelace y dibuja las columnas de un usuario.
   No busca `logic/`.

10. Crea `src/clients/node-http/jupyter/delete-user.ipynb`.
    El markdown lleva las partes del plan para este documento.
    El bloque hace `DELETE /users/:id` a `http://127.0.0.1:3004` con el id de Ada. Si no hay datos, la tabla dice `No devuelve datos.`
    No busca `logic/`.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe `src/clients/node-http/app.js`.
    `pnpm lint` termina bien.
    No cambia `src/logic/`, ni `src/queries/`, ni `src/clients/http/app.js`, ni `src/clients/jupyter/`.

12. Arranca la base con `pnpm server` y el cliente con `pnpm node-http`.
    El cliente escribe `http://127.0.0.1:3004`.
    La base sigue en el puerto 3000.
    `GET /no-existe` responde 404 y un cuerpo vacío.

13. `POST /users` con Ada y ada@example.com.
    Responde 201.
    El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
    `GET /users` incluye a ese usuario.

14. `GET /users/:id` con ese id.
    Responde 200 y los mismos datos.
    `PATCH /users/:id` solo con el nombre Ada Lovelace responde 200.
    El id y el email no cambian.

15. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
    Esos tres no crean un usuario nuevo.
    `GET`, `PATCH` y `DELETE` de un id que no existe responden 404 `User not found`.

16. `DELETE /users/:id` de Ada.
    Responde 204 y un cuerpo vacío.
    Ada ya no sale en `GET /users`.
    Si no queda ninguno, esa lista está vacía.

17. Para la base y deja este cliente abierto. Llama a las cinco rutas. El id que no está es `999999`.
    Crear muestra `Could not create the user`.
    Listar, ver, modificar y borrar muestran su `Could not`.
    Los cinco responden 500.

18. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 500 y `Could not create the user`.
    No sale un mensaje que no esté en la lista.
    El cliente no ha validado ese cuerpo.

19. Con la base y este cliente en marcha, lanza `pnpm jupyter-node-http` desde `first-app`.
    El navegador muestra la lista de los cinco documentos, en la interfaz de notebooks.
    El proceso usa el `.venv` y `notebook` `7.6.3`.
    No se abre Lab.

20. Ejecuta el bloque de cada documento con el directorio en `src/clients/node-http/jupyter`, con la lista vacía.
    Crear muestra a Ada en tabla. Listar y ver ese id muestran lo mismo. Modificar muestra Ada Lovelace. Borrar muestra `No devuelve datos.`
    La salida que queda guardada es la tabla, la línea `No hay filas.`, `No devuelve datos.`, o el mensaje.
    No se reescribe esa salida a mano.

21. Lanza `pnpm jupyter` desde `first-app`.
    El navegador muestra los documentos de `src/clients/jupyter/`.
    No muestra los de `src/clients/node-http/jupyter/`.
    `scripts/jupyter.sh` no ha cambiado.
