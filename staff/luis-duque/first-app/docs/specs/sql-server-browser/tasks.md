# Tareas — pantallas en el navegador

1. Crea `src/db/server.js`.
   Abre `users.sqlite` con `DatabaseSync` y escucha en `http://127.0.0.1:3000`.
   Solo responde a `/execute`. No exporta la conexión y no sirve la página.
   El fichero se puede leer.

2. Crea los ocho módulos en `src/queries/queries/`.
   Cada uno exporta su constante en mayúsculas con el texto del `.sql` del mismo nombre.
   Siguen los `?`. El SQL no cambia.
   `create-table-users.js` se puede leer.

3. Abre `src/queries/users.js`.
   Importa esas constantes y pide `POST /execute` a `http://127.0.0.1:3000`.
   No lee el disco, no abre la base y no usa `try/catch`. Cada operación espera antes a `createTableUsers`.
   El fichero se puede leer.

4. Borra `src/db/connection.js` y los ocho `.sql` de `src/queries/queries/`.
   `users.sqlite` se queda en `src/db/`.
   Nadie importa `connection.js`.
   Esos ficheros ya no están.

5. Abre en `src/logic/` los ficheros `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js` y `find-user-by-name.js`.
   Donde usan el resultado de `src/queries/users.js`, esperan con `await`.
   La firma y los mensajes no cambian. `shared.js` y `users-gender.js` no se tocan.
   `update-user.js` se puede leer.

6. Crea `src/clients/browser/index.html`.
   Hay cuatro pantallas: lista, menú, modificar y notas. Se ve una cada vez.
   Carga `styles.css` y `app.js` con `type="module"`.
   El fichero se puede leer.

7. Crea `src/clients/browser/styles.css`.
   Marca la pantalla que se ve y deja las otras ocultas.
   No añade un paquete.
   El fichero se puede leer.

8. Crea `src/clients/browser/app.js`.
   Importa solo `listUsers`, `updateUser` y `deleteUser`. No llama a `/execute`.
   Elige por id en la lista. Guardar o eliminar vuelve a la lista. Notas solo vuelve al menú.
   Si la lógica lanza, se ve `error.message`. El fichero se puede leer.

9. Abre `package.json`.
   Añade `server` con `node src/db/server.js` y `browser` con el comando del plan.
   `format` también escribe `src/clients/browser/**/*.js`.
   No se toca `pnpm-lock.yaml`. Los scripts se pueden leer.

10. Abre `docs/ARCHITECTURE.md`.
    Las consultas se ejecutan en el programa local de `127.0.0.1:3000`.
    Las pantallas importan la lógica para listar, modificar y eliminar.
    El fichero se puede leer.

11. Abre `docs/TREE.md`.
    `connection.js` pasa a `server.js`. Los `.sql` pasan a los `.js` de cada consulta.
    Añade `clients/browser/` con `index.html`, `app.js` y `styles.css`.
    El fichero se puede leer.

12. Abre `docs/DATABASE.md`.
    `src/db/server.js` abre `users.sqlite` y ejecuta lo que llega a `/execute`.
    El texto de cada consulta está en un módulo. `users.js` se lo pide a ese programa.
    El fichero se puede leer.

13. Abre `docs/STYLE.md`.
    Deja de mandar `connection.js` y los `.sql`.
    El único que abre la base es `src/db/server.js`. El navegador solo llama a `listUsers`, `updateUser` y `deleteUser`.
    El fichero se puede leer.

14. Abre `docs/ERRORS.md`.
    Si el programa local no está en marcha, la operación no se completa.
    Se ve el fallo de esa llamada. Los mensajes que ya estaban se quedan.
    El fichero se puede leer.

15. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Quitan la prohibición de pantalla y servidor. Cuentan `pnpm server` y `pnpm browser`.
    El desarrollo abierto pasa a ser `docs/specs/sql-server-browser/`.
    Los dos se pueden leer y coinciden con el código.

16. Lee `src/clients/terminal/`, `src/clients/jupyter/` y `src/logic/users-gender.js`.
    Siguen igual.
    No hay paquete nuevo.
    `pnpm-lock.yaml` sigue igual.

17. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript nuevo y no dejan avisos.
    No se tocan la terminal ni Jupyter.
    Los dos comandos terminan.

18. Desde `first-app`, lanza `pnpm server`.
    La consola muestra `http://127.0.0.1:3000`.
    Con ese programa en marcha, listar desde la terminal sigue igual.
    Ese proceso no sirve la página.

19. Desde `first-app`, lanza `pnpm browser`.
    Brave abre la lista de `src/clients/browser/index.html`.
    Un id que no está no abre el menú. Notas no guarda nada.
    Guardar o eliminar vuelve a la lista y esa lista ya muestra el cambio.
