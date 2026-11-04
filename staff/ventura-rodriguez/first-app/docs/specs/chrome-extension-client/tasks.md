# Tareas — cliente de Chrome para usuarios

1. Abre `package.json`.
   Añade `fastify` en `5.12.8` a `dependencies`.
   Añade el script `chrome` y el glob `src/clients/chrome/**/*.js` en `format`.
   El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `fastify` queda en `5.12.8`.
   `express`, `@colors/colors`, `cli-table3` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `fastify` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `chrome/` con `server.js`, `manifest.json`, `index.html`, `popup.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   La API de `src/clients/chrome/` llama a `src/logic/`, escucha en el puerto 3002 y no repite sus reglas.
   La extensión solo llama a esa API.
   No sustituye a `src/clients/http/` ni a `src/db/server.js`.

6. Crea `src/clients/chrome/server.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   `ORIGIN` es `http://127.0.0.1:3002`. Declara `console` y `URL`. Fastify lee el JSON. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
   El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan.

7. Crea `src/clients/chrome/manifest.json`.
   El manifest es Manifest V3 y la acción abre `index.html`.
   `host_permissions` es `http://127.0.0.1:3002/*`.
   No hay content script.

8. Crea `src/clients/chrome/index.html`.
   Una sola pantalla. El texto visible está en español.
   El estilo es `./styles.css` y el script es `./popup.js`.
   Hay crear, listar, ver, modificar y borrar, y un sitio para el mensaje.

9. Crea `src/clients/chrome/styles.css`.
   Da aspecto a la pantalla de `index.html`.
   No cambia el texto ni las acciones.
   El fichero se lee.

10. Crea `src/clients/chrome/popup.js`.
    No importa `logic/` ni otro cliente. Declara `document` y `fetch`. Pide a `http://127.0.0.1:3002` con `fetch` y escribe con `textContent`.
    Crear envía `name` y `email` aunque estén vacíos. Ver y la lista muestran `id`, `name`, `email`, `createdAt` y `updatedAt`.
    Modificar envía un campo solo si tiene texto. Borrar no muestra un usuario y vuelve a pedir la lista. Un `message` se ve.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los `.js` de `src/clients/chrome/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/`, `src/queries/` ni `src/clients/http/`.

12. Arranca la base con el comando que ya existe y la API con `pnpm chrome`.
    La API escribe `http://127.0.0.1:3002`.
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

17. Para la base y llama a las cinco rutas.
    Crear muestra `Could not create the user`.
    Listar, ver, modificar y borrar muestran su `Could not`.
    Los cinco responden 500.

18. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 500 y `Could not create the user`.
    No sale un mensaje que no esté en la lista.
    La API no ha validado ese cuerpo.

19. Con la base y `pnpm chrome` en marcha, carga la extensión de `src/clients/chrome` en Chrome y abre su ventana.
    Se ve la lista. Si no hay usuarios, está vacía.
    Crear Ada con ada@example.com muestra el id, el nombre Ada, el email ada@example.com y las dos fechas.
    La lista también muestra a Ada.

20. Pide el id de Ada.
    Se ven los mismos cinco datos.
    Cambia el nombre a Ada Lovelace y deja el email vacío.
    Se ve el mismo id, el nombre Ada Lovelace y el email ada@example.com.

21. Borra a Ada.
    No se muestra un usuario.
    Ada ya no sale en la lista.
    La ventana solo ha llamado a `http://127.0.0.1:3002`.

22. Crea con el nombre vacío, con un email que no vale y con un email que ya tiene otro usuario.
    Se ven `Name is empty`, `Email is invalid` y `Email is already used`.
    Pide, modifica o borra un id que no existe y se ve `User not found`.
    Esos fallos no cambian al usuario que sí existe.

23. Para la base y, con la API en marcha, abre la lista en la extensión.
    Se ve `Could not list the users`.
    Ver, modificar y borrar muestran su `Could not`.
    Crear muestra `Could not create the user`.
