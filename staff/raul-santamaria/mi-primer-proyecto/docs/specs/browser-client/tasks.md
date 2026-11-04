# Tareas — cliente del navegador

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Comprobar la precondición del plan.
  Existe `src/db/server.js`, `package.json` tiene `server` y `pnpm server` deja la base en `http://127.0.0.1:3000`.
  Pegar `src/clients/terminal/list-users.txt` con `await` en la llamada termina bien con el servidor en marcha.
  Si falta algo de esto, parar y completar antes el desarrollo de base en servidor (issue #851).

- [x] 2. Abrir `docs/TREE.md`, en `src/clients/`.
  Añadir `browser/` con `index.html`, `app.js` y `styles.css`.
  El resto del árbol no cambia salvo esas líneas.

- [x] 3. Abrir `docs/ARCHITECTURE.md`, junto a terminal y jupyter.
  Documentar que `src/clients/browser/` llama a `src/logic/` sin repetir reglas y que la página no se sirve.

- [x] 4. Abrir `package.json`.
  Añadir el script `browser` que abre `src/clients/browser/index.html` por `file://` en Edge o Chrome en Windows, con permiso para módulos locales.
  Conservar `server`.

- [x] 5. Crear `src/clients/browser/index.html`.
  Tres secciones: lista, menú y modificar o eliminar. Texto visible en español.
  Menú con volver, modificar usuario y notas desactivado. Enlazar `./styles.css` y `./app.js` como módulo.

- [x] 6. Crear `src/clients/browser/styles.css`.
  Estilo legible para las tres vistas. El botón de notas deshabilitado se distingue del resto.

- [x] 7. Crear `src/clients/browser/app.js`.
  Importar `listUsers`, `updateUser` y `deleteUser` desde `../../logic/` con extensión `.js`. No importar `users-gender-count.js`.
  Listar id, nombre y email; elegir fila abre menú; formulario desde el usuario activo; volver recarga lista; guardar usa `updateUser({ id, name, email })`; eliminar usa `deleteUser({ id })`.

- [x] 8. Comprobar arranque con `pnpm server` y `pnpm browser` desde `mi-primer-proyecto`.
  Se ve el listado sin contraseña. Lista vacía si no hay usuarios. Elegir un id abre el menú con ese usuario.

- [x] 9. Comprobar navegación del menú.
  Notas no responde. Volver muestra otra vez el listado. Cerrar y reabrir la página vuelve al listado.

- [x] 10. Comprobar edición y validaciones.
  Modificar nombre y guardar: mismo id y datos actualizados. Nombre vacío, email inválido y email duplicado muestran los mensajes del plan.
  Si el usuario ya no existe al guardar, se ve `No user exists with that id`.

- [x] 11. Comprobar borrado y base caída.
  Eliminar desde la tercera pantalla: el usuario desaparece del listado. Con el servidor parado, listar muestra `Could not list the users`; guardar y eliminar muestran `Could not update the user` y `Could not delete the user`.

- [x] 12. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  Ambos terminan sin errores.
