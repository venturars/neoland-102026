# Tareas — recuento en los clientes

1. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
   La ventana de escritorio crea, lista, ve, cambia y borra usuarios. La base sigue en el 3000.
   El recuento se pide desde HTTP, la extensión, el panel, esa ventana y Nest. Las tres pantallas del navegador no lo piden.
   Este cambio no añade un `.txt`. Esas líneas se leen.

2. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   HTTP, Chrome, el panel, la ventana y Nest piden el recuento. La página no importa `src/logic/`.
   Añade `src/clients/electron/`: `main.js` llama a `src/logic/` y no escucha en un puerto.
   `src/clients/web/` sigue sin contar. Esas líneas se leen.

3. Abre `docs/tree.md`, en `clients/`.
   Añade `electron/` con `main.js`, `preload.js`, `index.html`, `app.js` y `styles.css`.
   No añade otro fichero.
   Esas líneas se leen en el árbol.

4. Abre `docs/style.md`, en Comandos.
   Añade `pnpm electron` desde `first-app`.
   La ventana no escucha en un puerto. La base sigue en `127.0.0.1:3000`.
   Esas líneas se leen.

5. Abre `src/clients/http/app.js`.
   Importa `usersGenderCount` desde `../../logic/users-gender-count.js`.
   Registra `GET /users/gender-count` antes de `GET /users/:id`.
   Responde 200 y el objeto. Si falla, responde 500 y `{ message: "Could not classify the users" }`.

6. Abre `src/clients/chrome/server.js`.
   Importa `usersGenderCount` y registra la misma ruta antes de `GET /users/:id`.
   El puerto sigue siendo 3002.
   El fallo usa el mismo 500 y el mismo mensaje.

7. Abre `src/clients/chrome/index.html`, `popup.js` y `styles.css`.
   Añade la pestaña Recuento. Al abrirla se oculta la sección de usuarios.
   El botón pide `GET /users/gender-count` con `fetch`. `popup.js` no importa `src/logic/`.
   Se ven solo `women`, `men` y `undefinedUser`. Si falla, se ve `Could not classify the users`.

8. Abre `src/clients/vscode/extension.js`.
   Importa `usersGenderCount`. El mensaje `users-gender-count` llama a esa función.
   Si falla, el panel recibe `Could not classify the users`.
   No importa otro fichero de `src/logic/`.

9. Abre `src/clients/vscode/index.html`, `app.js` y `styles.css`.
   Añade la pestaña Recuento y el botón que manda `users-gender-count`.
   `app.js` no importa `src/logic/` ni `vscode`.
   Se ven solo los tres números. Si falla, se ve `Could not classify the users`.

10. Abre `src/clients/electron/main.js` y `preload.js`.
    `main.js` importa `usersGenderCount` y la recibe con `ipcMain.handle`.
    `preload.js` publica `usersGenderCount`. No importa `src/logic/`.
    Si falla, la ventana recibe `Could not classify the users`.

11. Abre `src/clients/electron/index.html`, `app.js` y `styles.css`.
    Añade la pestaña Recuento. El botón llama a `usersGenderCount` de `preload.js`.
    `app.js` no importa `src/logic/` ni `electron`.
    Se ven solo los tres números. Si falla, se ve `Could not classify the users`.

12. Abre `src/clients/nest/users.controller.js`.
    Importa `usersGenderCount`. Declara `Get("users/gender-count")` antes de `Get("users/:id")`.
    Responde 200 y el objeto. Si falla, responde 500 y el mensaje `Could not classify the users`.
    No se edita `src/clients/nest-run/`.

13. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los ficheros tocados.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

14. Arranca la base con `pnpm server` y la IA local. Deja usuarios guardados.
    Pide `GET /users/gender-count` en el puerto 3001, en el 3002 y, tras `pnpm nest`, en el 3003.
    Los tres responden 200 y el mismo objeto `{ women, men, undefinedUser }`.
    `GET /users/1` sigue devolviendo un usuario.

15. Abre el popup, el panel con «Abrir usuarios» y la ventana con `pnpm electron`.
    En cada uno abre la pestaña Recuento y pide el recuento.
    Se ven solo los tres números, los mismos que en las rutas.
    La lista de usuarios no sale en esa pestaña.

16. Vacía los usuarios y vuelve a pedirlo en una ruta y en una pestaña.
    Los tres números son 0.
    La respuesta de la ruta es 200.
    No se ve `Could not classify the users`.

17. Apaga la IA local y vuelve a pedirlo.
    Se ve `Could not classify the users`.
    Las rutas responden 500 y ese mensaje.
    El usuario sigue teniendo solo el id, el nombre, el email y las dos fechas.

18. Abre las tres pantallas con `pnpm open` y mira la terminal y Jupyter.
    Siguen como estaban y no piden el recuento.
    `src/clients/terminal/users-gender-count.txt` sigue siendo la prueba manual del recuento.
    No hay un `.txt` nuevo.
