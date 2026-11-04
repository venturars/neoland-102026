# Tareas — cliente REST de usuarios

1. Abre `package.json`.
   Añade `express` en `5.3.0` a `dependencies`.
   Añade el script `http`.
   El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `express` queda en `5.3.0`.
   `@colors/colors`, `cli-table3` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `express` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/tree.md`, en `clients/`.
   Añade `http/` con `app.js`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/http/` llama a `src/logic/`, escucha en el puerto 3001 y no repite sus reglas.
   No sustituye a `src/db/server.js`.
   Deja de decir que no hay `src/clients/http/`.

6. Abre `docs/style.md`, en Comandos.
   Añade `pnpm http` desde `first-app`.
   Ese cliente escucha en `127.0.0.1:3001`.
   Esas líneas se leen.

7. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
   También se crea, se lista, se ve, se cambia y se borra un usuario por HTTP, en el puerto 3001. La base sigue en el 3000.
   Este cambio añade el cliente HTTP y no añade un `.txt`.
   Esas líneas se leen.

8. Abre `docs/errors.md`.
   Entran `Could not create the user`, `Could not list the users`, `Could not update the user` y `Could not delete the user`.
   `Could not find the user` también cubre no llegar a la base al ver un usuario.
   Esas frases se leen en la lista.

9. Crea `src/clients/http/app.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   `ORIGIN` es `http://127.0.0.1:3001`. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
   El id de la ruta se pasa a número con `Number`. El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan.

10. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe `src/clients/http/app.js`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

11. Arranca la base con `pnpm server` y el cliente con `pnpm http`.
    El cliente escribe `http://127.0.0.1:3001`.
    La base sigue en el puerto 3000.
    `GET /no-existe` responde 404 y un cuerpo vacío.

12. `POST /users` con Ada y ada@example.com.
    Responde 201.
    El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
    `GET /users` incluye a ese usuario.

13. `GET /users/:id` con ese id.
    Responde 200 y los mismos datos.
    `PATCH /users/:id` solo con el nombre Ada Lovelace responde 200.
    El id y el email no cambian.

14. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
    `GET`, `PATCH` y `DELETE` de un id que no existe responden 404 `User not found`.
    `GET` de un id que no es un entero mayor o igual que 1 responde 400 `Invalid id`.

15. `DELETE /users/:id` de Ada.
    Responde 204 y un cuerpo vacío.
    Ada ya no sale en `GET /users`.
    Si no queda ninguno, esa lista está vacía.

16. Para la base y llama a las cinco rutas.
    Crear muestra `Could not create the user`.
    Listar, ver, modificar y borrar muestran su `Could not`.
    Los cinco responden 500.

17. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 400 y `Name is empty`.
    No sale `Query failed` ni un mensaje que no esté en la lista.
    El cliente no ha validado ese cuerpo.
