Issue: #1127

# Tareas del recuento de usuarios por género en los clientes

1. Cliente HTTP: en `src/clients/http/app.js`, añade `GET /users/gender-count` antes de `/users/:id`.
   Responde `200` con `{ female, male, undefined }`. `Unable to list users` responde `500` con ese mensaje; el resto, `500` con `Could not classify the users.`.
   Con `pnpm start` y `pnpm run http`, la ruta con la base vacía responde tres ceros.

2. Crea `tests/http-client.test.js`: añade el caso del recuento con base temporal y datos ficticios.
   Comprueba tres ceros con la tabla vacía, el orden de las claves y `Unable to list users` con el servidor de datos parado.
   `pnpm test` pasa con `pnpm start` y `pnpm run http` parados.

3. API de Chrome: en `src/clients/chrome/api.js`, añade la misma ruta con las mismas respuestas.
   En `tests/chrome-client.test.js`, añade el mismo caso de prueba.
   `pnpm test` pasa.

4. Cliente Nest: añade `countByGender()` a `users.service.js` y `@Get("users/gender-count")` antes de `users/:id` en `users.controller.js`, con su descripción en Swagger.
   El filtro responde `500` con `Unable to list users` o con `Could not classify the users.`.
   `tests/nest-client.test.js` comprueba tres ceros y `Unable to list users` con el servidor parado.

5. Ventana de escritorio: añade `countUsersAction()` a `user-actions.js`, el canal `users:count` a `main.js` y `count()` a `preload.cjs`.
   Devuelve `{ data }` o `{ error }`. `tests/electron-client.test.js` comprueba tres ceros y el `{ error }` con el servidor parado.
   `pnpm test` pasa.

6. Ventana de escritorio: en `index.html`, `app.js` y `styles.css`, añade las pestañas Usuarios y Recuento.
   Recuento tiene un botón, un aviso mientras cuenta y tres números con `textContent`.
   El clasificador falla con `Could not classify the users.` en inglés; cambiar de pestaña conserva la lista.

7. Panel de VS Code: añade `countUsersAction()` a `user-actions.js` y la acción `"count"` a `extension.js`.
   `tests/vscode-client.test.js` comprueba tres ceros y el `{ error }` con el servidor parado.
   `pnpm test` pasa.

8. Panel de VS Code: en `index.html`, `view.js` y `styles.css`, añade las pestañas Usuarios y Recuento con el mismo comportamiento que en escritorio.
   La política de seguridad no cambia.

9. Extensión de Chrome: en `popup.html`, `popup.js` y `styles.css`, añade las pestañas y el botón de Recuento que llama a `GET /users/gender-count`.
   Muestra los mensajes en inglés tal cual; `manifest.json` no cambia.

10. Bruno: crea `01-sql-online/14-count-empty.bru` y `02-sql-offline/20-count-sql-offline.bru`.
    Renombra los de `02-sql-offline` de 14-18 a 15-19, con su `seq`.
    Las carpetas se lanzan en Bruno y todas las comprobaciones pasan.

11. Actualiza `README.md` (sección de Bruno y uso del recuento), `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/ERRORS.md` y el apartado 1 de `docs/CONSTITUTION.md`.
    Los enlaces y los nombres de archivo coinciden con el código.

12. Comprobación final: `pnpm format` y `pnpm lint` sobre los archivos del pedido, y `pnpm test`.
    Prueba a mano los cinco clientes con IA local y una base temporal de datos ficticios: mismos tres números en todos, tres ceros sin usuarios y `Could not classify the users.` con la IA apagada.
