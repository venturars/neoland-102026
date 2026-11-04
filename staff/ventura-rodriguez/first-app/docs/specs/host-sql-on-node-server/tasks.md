# Tareas — base de datos en un servidor

1. Crea `src/db/server.js` como dice el plan.
   Abre `users.sqlite` al lado de ese fichero y define `ORIGIN`.
   No exporta `db`. Borra `src/db/connection.js`.
   `connection.js` ya no está.

2. Abre `package.json`.
   Añade el script `server` con `node src/db/server.js`.
   El resto de scripts no cambia.
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
   Borra `insert.sql`.
   El `.sql` ya no está.

9. Crea `src/queries/queries/update.js`.
    Exporta `UPDATE_USER` con el texto del plan.
    Borra `update.sql`.
    El `.sql` ya no está.

10. Crea `src/queries/queries/remove.js`.
    Exporta `REMOVE_USER` con el texto del plan.
    Borra `remove.sql`.
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
    El `try` espera a `findByEmail` y a `insert`.
    El resto de la función no cambia.

14. Abre `src/logic/update-user.js`.
    `updateUser` pasa a ser async.
    El `try` espera a `findById`, a `findByEmail` y a `update`.
    El resto de la función no cambia.

15. Abre `src/logic/delete-user.js`.
    `deleteUser` pasa a ser async.
    El `try` espera a `findById` y a `remove`.
    El resto de la función no cambia.

16. Abre `src/logic/list-users.js`.
    `listUsers` pasa a ser async.
    El `try` espera a `findAll`.
    El resto de la función no cambia.

17. Abre `src/logic/find-user-by-email.js`.
    `findUserByEmail` pasa a ser async.
    El `try` espera a `findByEmail`.
    El resto de la función no cambia.

18. Abre `src/logic/find-user-by-id.js`.
    `findUserById` pasa a ser async.
    El `try` espera a `findById`.
    El resto de la función no cambia.

19. Abre `src/logic/find-user-by-name.js`.
    `findUserByName` pasa a ser async.
    El `try` espera a `findByName`.
    El resto de la función no cambia.

20. Abre `src/logic/users-gender-count.js`.
    El `try` espera a `findAll`.
    Sigue importando `openai`.
    El resto de la función no cambia.

21. Abre `src/clients/terminal/create-user.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

22. Abre `src/clients/terminal/update-user.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

23. Abre `src/clients/terminal/delete-user.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

24. Abre `src/clients/terminal/list-users.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

25. Abre `src/clients/terminal/find-user-by-email.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

26. Abre `src/clients/terminal/find-user-by-id.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

27. Abre `src/clients/terminal/find-user-by-name.txt`.
    La línea del resultado usa `await`.
    El import no cambia.
    El fichero se lee.

28. Abre `src/clients/terminal/create-users-table.txt`.
    Quita el import de `db`.
    Espera a `createUsersTable()` y a `listTables()`, e imprime ese resultado.
    El comentario del directorio no cambia.

29. Abre `src/clients/jupyter/create-user.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

30. Abre `src/clients/jupyter/update-user.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

31. Abre `src/clients/jupyter/delete-user.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

32. Abre `src/clients/jupyter/list-users.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

33. Abre `src/clients/jupyter/find-user-by-email.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

34. Abre `src/clients/jupyter/find-user-by-id.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

35. Abre `src/clients/jupyter/find-user-by-name.ipynb`.
    En el programa de Node, la llamada usa `await`.
    El resto del documento no cambia.
    La llamada se lee en el bloque.

36. Abre `src/clients/jupyter/create-users-table.ipynb`.
    Quita el import de `db`.
    Espera a `createUsersTable()` y a `listTables()`. La tabla sigue con la columna `name`.
    El resto del documento no cambia.

37. Abre `docs/ARCHITECTURE.md`.
    Deja las líneas de base, consultas y logic como están en el plan.
    La línea de terminal dice que llama con `await`.
    El resto del documento no cambia.

38. Abre `docs/DATABASE.md`.
    La primera frase queda como en el plan: la conexión la abre `db/server.js` y no se exporta.
    La sección de queries describe el módulo `.js` y la ejecución en el servidor.
    La tabla `users` no cambia.

39. Abre `docs/TREE.md`.
    `src/db/` muestra `server.js` y `users.sqlite`.
    El resto del árbol no cambia.
    Esas dos líneas se leen en el árbol.

40. En una terminal, con el directorio actual en `first-app`, lanza `pnpm server`.
    El proceso sigue en marcha.
    La salida es `http://127.0.0.1:3000`.
    Déjalo abierto para los pasos siguientes.

41. Pega `src/clients/terminal/create-user.txt` con el directorio actual en `first-app`.
    La salida es el usuario, con `id`, `name`, `email`, `createdAt` y `updatedAt`.
    No se imprime una promesa.
    El email está en minúsculas.

42. Pega en la terminal la misma llamada con el nombre vacío.
    Se ve `Name is empty`.
    No se imprime un usuario.
    El fichero del cliente sigue creando a Ada.

43. Pega `src/clients/terminal/create-users-table.txt` con el directorio actual en `first-app`.
    La salida es la lista de tablas.
    Una fila tiene `name` con `users`.
    El cliente no importa `db`.

44. En `first-app`, lanza `pnpm format`.
    El comando termina sin error.
    Los `.js` nuevos quedan con el formato del proyecto.
    No cambia el comportamiento.

45. En `first-app`, lanza `pnpm lint`.
    El comando termina sin error.
    No queda un aviso en los ficheros tocados.
    El servidor del paso 40 puede cerrarse.
