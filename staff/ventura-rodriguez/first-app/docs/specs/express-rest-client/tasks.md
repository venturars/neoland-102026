# Tareas — cliente REST de usuarios

1. Abre `package.json`.
   Añade `express` en `5.3.0` a `dependencies`.
   Añade el script `http` y el glob `src/clients/http/**/*.js` en `format`.
   El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `express` queda en `5.3.0`.
   `@colors/colors`, `cli-table3` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `express` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `http/` con `app.js`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/http/` llama a `src/logic/`, escucha en el puerto 3001 y no repite sus reglas.
   No sustituye a `src/db/server.js`.
   Esas líneas se leen en la arquitectura.

6. Crea `src/clients/http/app.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   `ORIGIN` es `http://127.0.0.1:3001`. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
   El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan.

7. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   `pnpm format` escribe `src/clients/http/app.js`.
   `pnpm lint` termina bien.
   No cambia `src/logic/` ni `src/queries/`.

8. Arranca la base con el comando que ya existe y el cliente con `pnpm http`.
   El cliente escribe `http://127.0.0.1:3001`.
   La base sigue en el puerto 3000.
   `GET /no-existe` responde 404 y un cuerpo vacío.

9. `POST /users` con Ada y ada@example.com.
   Responde 201.
   El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
   `GET /users` incluye a ese usuario.

10. `GET /users/:id` con ese id.
    Responde 200 y los mismos datos.
    `PATCH /users/:id` solo con el nombre Ada Lovelace responde 200.
    El id y el email no cambian.

11. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
    Esos tres no crean un usuario nuevo.
    `GET`, `PATCH` y `DELETE` de un id que no existe responden 404 `User not found`.

12. `DELETE /users/:id` de Ada.
    Responde 204 y un cuerpo vacío.
    Ada ya no sale en `GET /users`.
    Si no queda ninguno, esa lista está vacía.

13. Para la base y llama a las cinco rutas.
    Crear muestra `Could not create the user`.
    Listar, ver, modificar y borrar muestran su `Could not`.
    Los cinco responden 500.

14. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 500 y `Could not create the user`.
    No sale un mensaje que no esté en la lista.
    El cliente no ha validado ese cuerpo.
