# Tareas — cliente web de usuarios

1. Abre `docs/CONSTITUCION.md`, en la tabla de quién sabe qué.
   Añade `src/clients/http/*`: servidor local con `node:http`, que llama a `src/logic/` y traduce los errores a HTTP.
   Añade `src/clients/web/*`: HTML, CSS y JS vanilla, que llama a la API y no copia validaciones.
   En «Errores», escribe que `Not found`, `Body is not valid JSON` y `Unexpected error` son solo de `src/clients/http/`.
   En «Qué no entra», cambia «HTTP y frontend no se añaden» por: el HTTP solo escucha en `127.0.0.1`, sin login; no se añaden paquetes para el servidor ni para la web; las notas aún no existen.
   Esas frases se leen en el documento.

2. Abre `AGENTS.md`, en «Comandos».
   Añade que `pnpm start` levanta la web en `http://127.0.0.1:3000`.
   Esa frase se lee en la guía.

3. Abre `package.json`.
   Añade el script `"start": "node src/clients/http/start-http-server.js"`.
   `format` incluye también `src/clients/http/**/*.js` y `src/clients/web/**/*.{js,html,css}`.
   No se añade ninguna dependencia.

4. Abre `eslint.config.js`.
   Añade un bloque para `src/clients/web/**/*.js` con `languageOptions.globals`: `document`, `fetch` y `confirm` como `readonly`.
   No se instala el paquete `globals`.

5. Crea `src/clients/http/send-json.js`, `send-http-error.js` y `read-json-body.js`.
   `sendJson(response, status, data)` escribe `Content-Type: application/json; charset=utf-8`.
   `sendHttpError(response, error)` responde 404 si el mensaje empieza por `There is no user with id`, 400 con los cuatro mensajes de `src/logic/shared.js` y de email repetido, y 400 con `Body is not valid JSON`. Cualquier otro fallo es 500 con `Unexpected error`.
   `readJsonBody(request)` devuelve el objeto o lanza `Body is not valid JSON`.

6. Crea `src/clients/http/handle-users.js`.
   `handleUsers(store, request, response, pathname)` atiende las cuatro rutas del plan con `listUsers`, `findUserById`, `updateUser` y `deleteUser` de `src/logic/index.js`.
   El `PATCH` pasa solo `nombre` y `email` del cuerpo. No valida nada.
   Una ruta o un método que no está en la tabla responde 404 `{ error: "Not found" }`.

7. Crea `src/clients/http/serve-web-file.js`.
   Una lista fija relaciona cada fichero de `src/clients/web/` con su `Content-Type`. `/` es `index.html`.
   Una ruta fuera de la lista responde 404 `{ error: "Not found" }`.

8. Crea `src/clients/http/handle-request.js` y `start-http-server.js`.
   `handleRequest` envía `/api/users` y `/api/users/...` a `handleUsers`, y el resto a `serveWebFile`. Un fallo pasa por `sendHttpError`.
   `start-http-server.js` crea el almacén con `db` y `createSqliteStore`, escucha en `127.0.0.1:3000` y escribe `First App: http://127.0.0.1:3000`.

9. Crea `src/clients/web/index.html` y `styles.css`.
   Hay cuatro `<section data-screen>`: `selection`, `menu`, `edit` y `notes`. Solo se ve una.
   Hay un `<p id="message" role="status">`. `main.js` se carga con `type="module"`.
   Los botones de navegar llevan `data-action`. La edición tiene una zona aparte para eliminar.

10. Crea `src/clients/web/state.js`, `show-screen.js`, `show-message.js`, `navigate.js` y `main.js`.
    `STATE` guarda `selectedUser` e `isBusy`.
    `navigate` atiende `selection`, `menu`, `edit` y `notes`, y no hace nada mientras `isBusy` es `true`.
    `main.js` registra los eventos y llama a `loadUserSelection`.

11. Crea `src/clients/web/load-user-selection.js` y `select-user.js`.
    La lista muestra `#id · nombre — email`. Si está vacía, se ve `No hay usuarios todavía`. Si falla, se ve `No se ha podido cargar la lista` y el botón para reintentar.
    Elegir hace `GET /api/users/:id`, guarda el usuario en `STATE` y abre el menú.

12. Crea `src/clients/web/show-user-menu.js`, `open-user-editor.js` y `show-notes.js`.
    El menú pinta el id, el nombre y el email con `textContent`.
    El editor rellena el nombre y el email actuales.
    Notas muestra `Aún no hay notas` y un botón para volver al menú.

13. Crea `src/clients/web/save-user.js` y `delete-selected-user.js`.
    Guardar hace `PATCH` con `{ nombre, email }`. Si va bien, abre el menú con `Datos guardados`. Si falla, se queda en el formulario y muestra `error`.
    Eliminar pide `confirm("¿Eliminar a <nombre>?")`, hace `DELETE` y vuelve a la selección.
    Si `fetch` lanza, se ve `No se ha podido conectar con la aplicación`. Mientras espera, los botones están desactivados.

14. En `first-app`, ejecuta `pnpm format` y `pnpm lint`.
    Lint termina sin errores.

15. Ejecuta `pnpm start` y recorre la comprobación del plan.
    `curl -i http://127.0.0.1:3000/api/users/999` da 404 con `There is no user with id 999`.
    `curl -i --path-as-is http://127.0.0.1:3000/../src/db/connection.js` da 404.
