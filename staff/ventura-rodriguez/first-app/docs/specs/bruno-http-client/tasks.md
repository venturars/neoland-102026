# Tareas — colección Bruno del cliente HTTP

1. Abre `package.json`.
   Añade en `devDependencies` `@usebruno/cli` en `4.3.0`.
   Añade el script `bruno`. Entra en `src/clients/http/bruno` y lanza `bru run 01-sql-online -r`.
   El resto de dependencias y scripts no cambia de versión.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `@usebruno/cli` queda en `4.3.0`.
   `cli-table3`, `debug` y `qs` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de ese paquete y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala Babel 7.

4. Abre `docs/ARCHITECTURE.md`, en el punto de `src/clients/http/`.
   Ese cliente llama a `src/logic/`, escucha en el puerto 3001, tiene la guía y la colección Bruno y se lanza con `pnpm bruno`.
   El paquete es `@usebruno/cli`. No sustituye a `src/db/server.js`.
   El punto de `docs/specs/<nombre>/` vuelve a spec, plan y tareas.

5. Abre `docs/TREE.md`, en `src/clients/http/`.
   Entra `bruno.md` y `bruno/`.
   Sale `bruno-http-client/` de `docs/specs/`.
   El resto del árbol no cambia.

6. Crea `src/clients/http/bruno/bruno.json`.
   `version` es `1`, `name` es `first-app HTTP users` y `type` es `collection`.
   Quita `docs/specs/bruno-http-client/bruno.json` si estaba ahí.
   Ese fichero se lee en la carpeta.

7. Crea `src/clients/http/bruno/collection.bru`.
   `baseUrl` es `http://127.0.0.1:3001`.
   `missingId` es `999999`.
   No hay otra variable.

8. Crea `src/clients/http/bruno/01-sql-online/folder.bru`.
   El `name` es `01-sql-online`.
   El `seq` es `1`.
   Esa carpeta queda la primera.

9. Crea `src/clients/http/bruno/01-sql-online/01-empty-list.bru`.
   Es `GET /users`.
   El test espera 200 y `[]`.
   El `seq` es `1`.

10. Crea `src/clients/http/bruno/01-sql-online/02-create-ada.bru`.
    Es `POST /users` con Ada y ada@example.com.
    El test espera 201, los cinco campos, nombre Ada y email ada@example.com.
    Guarda `userId`. El `seq` es `2`.

11. Crea `src/clients/http/bruno/01-sql-online/03-list-users.bru`.
    Es `GET /users`.
    El test espera 200 y que la lista tenga a Ada.
    El `seq` es `3`.

12. Crea `src/clients/http/bruno/01-sql-online/04-find-ada.bru`.
    Es `GET /users/:id` con `userId`.
    El test espera 200 y los mismos datos.
    El `seq` es `4`.

13. Crea `src/clients/http/bruno/01-sql-online/05-patch-name.bru`.
    Es `PATCH /users/:id` solo con el nombre Ada Lovelace.
    El test espera 200. El id y el email no cambian.
    El `seq` es `5`.

14. Crea `src/clients/http/bruno/01-sql-online/06-create-empty-name.bru`.
    Es `POST /users` con el nombre `" "` y empty@example.com.
    El test espera 400 y `Name is empty`.
    El `seq` es `6`.

15. Crea `src/clients/http/bruno/01-sql-online/07-create-invalid-email.bru`.
    Es `POST /users` con Invalid e `invalid`.
    El test espera 400 y `Email is invalid`.
    El `seq` es `7`.

16. Crea `src/clients/http/bruno/01-sql-online/08-create-used-email.bru`.
    Es `POST /users` con Other y ada@example.com.
    El test espera 409 y `Email is already used`.
    El `seq` es `8`.

17. Crea `src/clients/http/bruno/01-sql-online/09-get-missing.bru`.
    Es `GET /users/:id` con `missingId`.
    El test espera 404 y `User not found`.
    El `seq` es `9`.

18. Crea `src/clients/http/bruno/01-sql-online/10-patch-missing.bru`.
    Es `PATCH /users/:id` con `missingId`.
    El test espera 404 y `User not found`.
    El `seq` es `10`.

19. Crea `src/clients/http/bruno/01-sql-online/11-delete-missing.bru`.
    Es `DELETE /users/:id` con `missingId`.
    El test espera 404 y `User not found`.
    El `seq` es `11`.

20. Crea `src/clients/http/bruno/01-sql-online/12-delete-ada.bru`.
    Es `DELETE /users/:id` con `userId`.
    El test espera 204 y cuerpo vacío.
    El `seq` es `12`.

21. Crea `src/clients/http/bruno/01-sql-online/13-list-after-delete.bru`.
    Es `GET /users`.
    El test espera 200 y `[]`.
    El `seq` es `13`.

22. Crea `src/clients/http/bruno/02-sql-offline/folder.bru`.
    El `name` es `02-sql-offline`.
    El `seq` es `2`.
    Esa carpeta queda la segunda.

23. Crea `src/clients/http/bruno/02-sql-offline/14-create-sql-offline.bru`.
    Es `POST /users`.
    El test espera 500 y `Could not create the user`.
    El `seq` es `14`.

24. Crea `src/clients/http/bruno/02-sql-offline/15-list-sql-offline.bru`.
    Es `GET /users`.
    El test espera 500 y `Could not list the users`.
    El `seq` es `15`.

25. Crea `src/clients/http/bruno/02-sql-offline/16-find-sql-offline.bru`.
    Es `GET /users/:id` con `missingId`.
    El test espera 500 y `Could not find the user`.
    El `seq` es `16`.

26. Crea `src/clients/http/bruno/02-sql-offline/17-update-sql-offline.bru`.
    Es `PATCH /users/:id` con `missingId`.
    El test espera 500 y `Could not update the user`.
    El `seq` es `17`.

27. Crea `src/clients/http/bruno/02-sql-offline/18-delete-sql-offline.bru`.
    Es `DELETE /users/:id` con `missingId`.
    El test espera 500 y `Could not delete the user`.
    El `seq` es `18`.

28. Crea `src/clients/http/bruno.md`.
    Dice arrancar `pnpm server` y `pnpm http` desde `first-app` y, con la lista vacía, `pnpm bruno`.
    Luego parar solo el SQL y, desde `src/clients/http/bruno`, `../../../../node_modules/.bin/bru run 02-sql-offline -r`.
    Quita `docs/specs/bruno-http-client/bruno.md` y `docs/specs/bruno-http-client/bruno/`.

29. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm lint` termina bien.
    No cambia `src/logic/`, ni `src/queries/`, ni `src/clients/http/app.js`.

30. Arranca la base con `pnpm server` y el cliente con `pnpm http`.
    El cliente escribe `http://127.0.0.1:3001`.
    La base sigue en el puerto 3000.
    La lista está vacía.

31. Desde `first-app`, lanza `pnpm bruno`.
    Crear responde 201. Listar, ver y modificar responden 200. Borrar responde 204 vacío.
    Se ven 400 `Name is empty`, 400 `Email is invalid`, 409 `Email is already used` y 404 `User not found`.
    Al final la lista está vacía.

32. Para solo el SQL y deja el cliente HTTP abierto.
    Desde `src/clients/http/bruno`, lanza `../../../../node_modules/.bin/bru run 02-sql-offline -r`.
    Los cinco responden 500 y el `Could not` de cada acción.
    No cambia el cliente HTTP ni el resto de clientes.
