# Tareas — el navegador llama a las reglas

1. Abre `docs/style.md`, en Comandos.
   La base sigue con `pnpm server` en `127.0.0.1:3000`.
   Las pantallas pasan a `pnpm start` en `127.0.0.1:3001`. Las dos se lanzan a la vez.
   Esas líneas se leen.

2. Abre `docs/ARCHITECTURE.md`, en `src/clients/http/`.
   El servidor escucha en `127.0.0.1:3001` y solo reparte la lista cerrada del plan.
   No llama a `src/logic/`. Salen `handle-users.js`, `read-json-body.js` y `send-json.js`.
   Esas líneas se leen.

3. Abre `docs/ARCHITECTURE.md`, en `src/clients/web/`.
   La lista, la elección, el guardado y el borrado importan las funciones de `src/logic/` del plan.
   El navegador no pide `/api/users`.
   Esas líneas se leen.

4. Abre `docs/tree.md`, en `clients/http/`.
   Salen `handle-users.js`, `read-json-body.js` y `send-json.js`.
   El resto del árbol no cambia.
   Esas líneas se leen.

5. Abre `src/clients/http/start-http-server.js`.
   Escucha solo en `127.0.0.1:3001`.
   Al arrancar escribe esa dirección.
   No abre la base.

6. Abre `src/clients/http/serve-public-file.js`.
   La lista cerrada añade las rutas `/logic/` y `/queries/` del plan, cada una con su fichero.
   Una ruta pedida no se concatena a una carpeta del disco.
   No se reparten `users-gender-count.js`, la base ni `src/db/server.js`.

7. Abre `src/clients/http/handle-request.js`.
   Toda ruta llama a `serve-public-file.js`.
   Un fallo acaba en `send-http-error.js`.
   No hay ruta de usuarios.

8. Borra `src/clients/http/handle-users.js`, `read-json-body.js` y `send-json.js`.
   Esos tres ficheros no están.
   `send-http-error.js` sigue.
   El directorio se lee.

9. Abre `src/clients/web/load-user-selection.js`.
   Llama a `listUsers()` y crea una opción por usuario, con id, nombre y email.
   Si la lista llega vacía, dice que no hay usuarios.
   Si la llamada falla, el mensaje es distinto de la lista vacía.

10. Abre `src/clients/web/select-user.js`.
    Pasa el id elegido a número y llama a `findUserById`.
    No pide contraseña.
    Si existe, guarda la elección y muestra el menú.

11. Abre `src/clients/web/save-user.js`.
    Llama a `updateUser` con el id, el nombre y el email.
    Si se guarda, el menú muestra los datos nuevos.
    Si falla, se ve el mensaje de `src/logic/` y los campos no se borran.

12. Abre `src/clients/web/delete-selected-user.js`.
    Pide confirmación antes de llamar a `deleteUser`.
    Cancelar no llama y el usuario sigue.
    Confirmar borra, vuelve a la lista y conserva a los demás.

13. Lanza `pnpm server` y `pnpm start` desde `first-app`.
    En `http://127.0.0.1:3001` se elige un usuario, se cambia y se borra, como dice la spec de vanilla.
    Ir a notas no abre otra pantalla. `docs/specs/vanilla-user-client/` no ha cambiado.
    Después se lanzan `pnpm format` y `pnpm lint`.
