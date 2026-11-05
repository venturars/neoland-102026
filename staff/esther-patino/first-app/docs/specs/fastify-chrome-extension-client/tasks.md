# Tareas — cliente Chrome de usuarios

1. Abre `package.json`.
   Añade `fastify` en `5.12.8` a `dependencies`.
   Añade el script `chrome`.
   El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `fastify` queda en `5.12.8`.
   `express`, `@colors/colors`, `cli-table3` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `fastify` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/tree.md`, en `clients/`.
   Añade `chrome/` con `server.js`, `manifest.json`, `index.html`, `popup.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/chrome/server.js` llama a `src/logic/`, escucha en el puerto 3002 y no repite sus reglas.
   El popup es `index.html` y pide esa API. No sustituye a `src/db/server.js` ni al cliente HTTP.

6. Abre `docs/style.md`, en Comandos.
   Añade `pnpm chrome` desde `first-app`.
   Esa API escucha en `127.0.0.1:3002`.
   Esas líneas se leen.

7. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
   También se crea, se lista, se ve, se cambia y se borra un usuario desde una extensión de Chrome, con una API Fastify en el puerto 3002. La base sigue en el 3000.
   Este cambio añade el cliente Chrome y no añade un `.txt`.
   Esas líneas se leen.

8. Crea `src/clients/chrome/server.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   `ORIGIN` es `http://127.0.0.1:3002`. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
   El id de la ruta se pasa a número con `Number`. El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan.

9. Crea `src/clients/chrome/manifest.json`.
   Manifest V3. El popup es `index.html`.
   El permiso de host es `http://127.0.0.1:3002/*`.
   No hay otros permisos.

10. Crea `src/clients/chrome/index.html`, `popup.js` y `styles.css`.
    Una sola pantalla: lista, formulario de nombre y email, y botones para crear, guardar y borrar.
    `popup.js` pide las rutas de `ORIGIN` con `fetch`. No importa `src/logic/`.
    Si `fetch` no llega, muestra el `Could not` de esa acción. Los textos van en español.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los ficheros de `src/clients/chrome/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/` ni `src/clients/http/`.

12. Arranca la base con `pnpm server` y la API con `pnpm chrome`.
    La API escribe `http://127.0.0.1:3002`.
    La base sigue en el puerto 3000. El cliente HTTP sigue en el 3001.
    `GET /no-existe` responde 404 y un cuerpo vacío.

13. Carga `src/clients/chrome` en `chrome://extensions` con el modo de desarrollador y abre el popup.
    Se ve la lista. Si no hay usuarios, la lista está vacía.
    Crea Ada con ada@example.com. Aparece en la lista con el id, el nombre y el email.

14. Pulsa a Ada. El formulario muestra sus datos.
    Cambia el nombre a Ada Lovelace y guarda.
    La lista muestra el id, el nombre nuevo y el email anterior.

15. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven `Name is empty`, `Email is invalid` y `Email is already used`.
    No se guarda nada.

16. Borra a Ada.
    Ya no sale en la lista.
    Si no queda ninguno, esa lista está vacía.

17. Para la API y abre el popup.
    Listar muestra `Could not list the users`.
    Arranca otra vez la API. El cliente HTTP en el 3001 y las pantallas del navegador siguen funcionando.
