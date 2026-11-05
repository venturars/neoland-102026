# Tareas — cliente del navegador

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Crear `src/db/server.js` como en el plan de referencia host-sql de Ventura.
  `ORIGIN` `http://127.0.0.1:3000`. Abre `users.sqlite` junto al servidor. No exporta `db`.
  Añadir script `server` en `package.json`. Quitar `src/db/connection.js` del flujo de queries.

- [x] 2. Pasar cada `.sql` de `src/queries/queries/` a su módulo `.js` que exporta el texto SQL.
  Borrar los `.sql`. Reescribir `src/queries/users.js` para `POST` a `/execute` con `fetch`, sin `node:fs` ni import de conexión local.

- [x] 3. Hacer `async` las funciones de `src/logic/` que usan queries, sin cambiar entradas ni salidas de `docs/CONSTITUTIONS.md`.
  Cada `try` espera a la query. `users-gender-count.js` sigue importando `openai`.

- [x] 4. Actualizar `src/clients/terminal/*.txt` y los bloques Node de `src/clients/jupyter/*.ipynb`.
  Las llamadas a `logic/` usan `await`. Pegar `create-user.txt` con `pnpm server` en marcha sigue mostrando un usuario, no una promesa.

- [x] 5. Abrir `src/clients/http/app.js`.
  Las rutas esperan a `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`. El comportamiento HTTP no cambia.

- [x] 6. Abrir `docs/TREE.md`, `docs/ARCHITECTURE.md` y `docs/DATABASE.md`.
  `db/` muestra `server.js` y `users.sqlite`. Browser y servidor SQL quedan descritos como en el plan.

- [x] 7. Crear `src/clients/browser/index.html`.
  Tres pantallas en español: lista, menú (volver, modificar, notas desactivado) y editar/eliminar. `type="module"` hacia `./app.js` y `./styles.css`.

- [x] 8. Crear `src/clients/browser/styles.css` y `src/clients/browser/app.js`.
  Importa `listUsers`, `updateUser` y `deleteUser` con extensión `.js`. Usa `updateUser({ id, name, email })` y `deleteUser({ id })`.
  Los errores se muestran con `error.message`. Notas no tiene acción.

- [x] 9. Añadir script `browser` en `package.json` para Windows (Chrome, perfil en `%TEMP%`, `--allow-file-access-from-files`, `file://` de `index.html`).

- [x] 10. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`. Ambos terminan bien.

- [x] 11. Con `pnpm server` en marcha, lanzar `pnpm browser`.
  Lista con id, nombre y email; elegir usuario; volver; modificar Ada a Ada Lovelace; errores de validación; eliminar y comprobar que ya no sale.

- [x] 12. Con la base parada, abrir la lista y guardar en editar.
  Se ven `Could not list the users`, `Could not update the user` y `Could not delete the user` en pantalla.
