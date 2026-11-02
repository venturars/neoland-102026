# Tareas — cliente de navegador

1. Abre `package.json`.
   El script `start` arranca `src/clients/http/start-http-server.js`.
   `format` incluye `src/clients/**/*.js`.
   No se añaden dependencias.

2. Abre `src/clients/http/send-json.js`, `send-http-error.js`, `read-json-body.js`.
   Igual que el plan: JSON sin caché; errores conocidos con el mensaje de logic;
   `Id is invalid` usa 400.

3. Abre `src/clients/http/handle-users.js`.
   Las rutas `/api/users` llaman a `listUsers`, `findUserById`, `updateUser` y `deleteUser`.
   `updateUser` recibe `{ id, name, email }`. Si falta name o email en el PATCH, se conserva el valor guardado.
   Id inválido en la URL: `Id is invalid`.

4. Abre `serve-public-file.js`, `handle-request.js`, `start-http-server.js`.
   Lista cerrada de estáticos; `127.0.0.1:3000`.

5. Abre `src/clients/web/index.html`.
   Tres pantallas; menú con acciones horizontales y volver aparte;
   notas deshabilitada con tooltip; borrado con confirmación inline.

6. Abre `styles.css` con la paleta crema/teal del plan y estados hover/active en botones.

7. Abre los módulos de `src/clients/web/` (uno por función).
   Tras borrar confirmado, `loadUserSelection()`.

8. Abre `docs/TREE.md` y `docs/ARCHITECTURE.md`.
   Entradas para `http/` y `web/`.

9. Desde `first-app`, `pnpm start`. Prueba los pasos de la issue #739.

10. `pnpm run format` y `pnpm run lint` en lo tocado.
