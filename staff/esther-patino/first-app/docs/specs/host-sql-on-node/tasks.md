# Tareas — base en un servidor

1. Crea `src/db/server.js` como dice el plan.
   Abre `users.sqlite` al lado de ese fichero y define `ORIGIN`.
   No exporta `db`. Borra `src/db/connection.js`.
   `connection.js` ya no está.

2. Abre `package.json`.
   Añade el script `server` con `node src/db/server.js`.
   El script `start` no cambia.
   El script se lee en el fichero.

3. Crea `src/queries/queries/create-users-table.js`.
   Exporta `CREATE_USERS_TABLE` con el texto del plan.
   Borra `create-users-table.sql`.
   El `.sql` ya no está.

4. Crea `src/queries/queries/find-by-id.js`.
   Exporta `FIND_BY_ID` con el texto del plan.
   Borra `find-by-id.sql`.
   El `.sql` ya no está.

5. Crea `src/queries/queries/find-by-email.js`.
   Exporta `FIND_BY_EMAIL` con el texto del plan.
   Borra `find-by-email.sql`.
   El `.sql` ya no está.

6. Crea `src/queries/queries/find-by-name.js`.
   Exporta `FIND_BY_NAME` con el texto del plan.
   Borra `find-by-name.sql`.
   El `.sql` ya no está.

7. Crea `src/queries/queries/find-all.js`.
   Exporta `FIND_ALL` con el texto del plan.
   Borra `find-all.sql`.
   El `.sql` ya no está.

8. Crea `src/queries/queries/insert.js`.
   Exporta `INSERT_USER` con el texto del plan.
   Borra `insert-user.sql`.
   El `.sql` ya no está.

9. Crea `src/queries/queries/update.js`.
   Exporta `UPDATE_USER` con el texto del plan.
   Borra `update-user.sql`.
   El `.sql` ya no está.

10. Crea `src/queries/queries/remove.js`.
    Exporta `REMOVE_USER` con el texto del plan.
    Borra `remove-user.sql`.
    El `.sql` ya no está.

11. Crea `src/queries/queries/list-tables.js`.
    Exporta `LIST_TABLES` con el texto del plan.
    El fichero no ejecuta la consulta.
    El texto se lee en el fichero.

12. Abre `src/queries/users.js`.
    Importa las constantes. Quita `node:fs` y `db`.
    `execute` hace `POST` a `http://127.0.0.1:3000/execute`, como dice el plan.
    El fichero no importa `server.js`.

13. Abre `src/logic/create-user.js`.
    `createUser` pasa a ser async.
    Espera a `findByEmail` y a `insertUser` donde ya se llaman.
    El resto de la función no cambia.

14. Abre `src/logic/update-user.js`.
    `updateUser` pasa a ser async.
    Espera a `findById`, a `findByEmail` y a `saveUser`.
    El resto de la función no cambia.

15. Abre `src/logic/delete-user.js`.
    `deleteUser` pasa a ser async.
    Espera a `findById` y a `removeUser`.
    El resto de la función no cambia.

16. Abre `src/logic/list-users.js`.
    `listUsers` pasa a ser async.
    Espera a `findAll`.
    La reexportación de `findAll` se queda.

17. Abre `src/logic/find-user-by-email.js`.
    `findUserByEmail` pasa a ser async.
    Espera a `findByEmail`.
    El resto de la función no cambia.

18. Abre `src/logic/find-user-by-id.js`.
    `findUserById` pasa a ser async.
    Espera a `findById`.
    El resto de la función no cambia.

19. Abre `src/logic/find-user-by-name.js`.
    `findUserByName` pasa a ser async.
    El `try` que ya existe espera a `findByName`.
    El resto de la función no cambia.

20. Abre `src/logic/users-gender-count.js`.
    El `try` que ya existe espera a `findAll`.
    Sigue importando `openai`.
    El resto de la función no cambia.

21. Abre `src/clients/http/handle-users.js`.
    Espera a `listUsers`, `findUserById`, `updateUser` y `deleteUser`.
    Las rutas no cambian.
    El fichero se lee.

22. Abre los `.txt` de `src/clients/terminal/` que llaman a una función, menos `users-gender-count.txt`.
    La llamada lleva `await`. El import no cambia.
    `users-gender-count.txt` ya espera y se queda.
    El fichero se lee.

23. Abre `src/clients/terminal/create-users-table.txt`.
    Quita el import de `db`.
    Espera a `createUsersTable()` y a `listTables()`, e imprime ese resultado.
    El comentario del directorio no cambia.

24. Abre los `.ipynb` de `src/clients/jupyter/` que llaman a una función, menos `users-gender-count.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

25. Abre `src/clients/jupyter/create-users-table.ipynb`.
    Quita el import de `db`.
    Espera a `createUsersTable()` y a `listTables()`. La tabla sigue con la columna `name`.
    El resto del documento no cambia.

26. Abre `docs/ARCHITECTURE.md`, `docs/database.md`, `docs/tree.md`, `docs/CONSTITUTIONS.md` y `docs/style.md`.
    Dejan la base, las consultas y la espera como dice el plan.
    La tabla `users` y las frases de error no cambian.
    `queries/queries/` ya no lista `.sql`.

27. En una terminal, con el directorio actual en `first-app`, lanza `pnpm server`.
    El proceso sigue en marcha.
    La salida es `http://127.0.0.1:3000`.
    No lances `pnpm start` a la vez. Déjalo abierto para los pasos siguientes.

28. Pega `src/clients/terminal/insert-user.txt` con el directorio actual en `first-app`.
    La salida es el usuario, con `id`, `name`, `email`, `createdAt` y `updatedAt`.
    No se imprime una promesa.
    El email está en minúsculas.

29. Pega `src/clients/terminal/create-users-table.txt` con el directorio actual en `first-app`.
    La salida es la lista de tablas.
    Una fila tiene `name` con `users`.
    El cliente no importa `db`.

30. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    Los dos comandos terminan sin error.
    El servidor del paso 27 puede cerrarse.
    No cambia el comportamiento.
