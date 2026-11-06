# Tareas — colección Bruno del cliente HTTP

Plan aceptado, incluida la vulnerabilidad 30 de `axios` `1.18.0` y Socket incompleto. Se añade `@usebruno/cli` `4.3.0`. Cada paso hace una cosa. Cada petición es un fichero propio.

1. Abre `package.json` en `first-app`.
   En `devDependencies` entra `@usebruno/cli` `4.3.0`. El script `bruno` entra en `src/clients/http/bruno` y lanza `bru run 01-sql-online -r`.
   pnpm escribe `pnpm-lock.yaml`. No se usa npm ni yarn.
   El script `test` no cambia.

2. Crea `src/clients/http/bruno/bruno.json`.
   `version` es `0.0.0`, `name` es `first-app HTTP users`, `type` es `collection`.
   El fichero se puede leer.
   No hay otro `bruno.json`.

3. Crea `src/clients/http/bruno/collection.bru`.
   `baseUrl` es `http://127.0.0.1:3001`. `missingId` es `999999`.
   No hay otra variable.
   El fichero se puede leer.

4. Crea `src/clients/http/bruno/01-sql-online/folder.bru`.
   `name` es `01-sql-online`. `seq` es `1`.
   El fichero se puede leer.

5. Crea `src/clients/http/bruno/01-sql-online/01-empty-list.bru`.
   `GET /users`. Tests: 200 y `[]`. `seq` es `1`.
   El fichero se puede leer.

6. Crea `src/clients/http/bruno/01-sql-online/02-create-ada.bru`.
   `POST /users` con Ada y ada@example.com. Tests: 201, `id`, `name` y `email`. Nombre Ada y email ada@example.com.
   Guarda `userId`. `seq` es `2`.
   El fichero se puede leer.

7. Crea `src/clients/http/bruno/01-sql-online/03-list-users.bru`.
   `GET /users`. Tests: 200 y la lista tiene a Ada. `seq` es `3`.
   El fichero se puede leer.

8. Crea `src/clients/http/bruno/01-sql-online/04-find-ada-by-id.bru`.
   `GET /users/:id` con `userId`. Tests: 200 y los mismos datos. `seq` es `4`.
   El fichero se puede leer.

9. Crea `src/clients/http/bruno/01-sql-online/05-find-ada-by-email.bru`.
   `GET /users/email/:email` con ada@example.com. Tests: 200 y los mismos datos. `seq` es `5`.
   El fichero se puede leer.

10. Crea `src/clients/http/bruno/01-sql-online/06-find-ada-by-name.bru`.
    `GET /users/name/:name` con Ada. Tests: 200 y los mismos datos. `seq` es `6`.
    El fichero se puede leer.

11. Crea `src/clients/http/bruno/01-sql-online/07-patch-name.bru`.
    `PATCH /users/:id` solo con el nombre Ada Lovelace. Tests: 200; el cuerpo es el `id` y el nombre enviado. `seq` es `7`.
    El fichero se puede leer.

12. Crea `src/clients/http/bruno/01-sql-online/08-create-empty-name.bru`.
    `POST /users` con el nombre `" "` y empty@example.com. Tests: 400 y `Name is required`. `seq` es `8`.
    El fichero se puede leer.

13. Crea `src/clients/http/bruno/01-sql-online/09-create-invalid-email.bru`.
    `POST /users` con Invalid e `invalid`. Tests: 400 y `Email is not valid`. `seq` es `9`.
    El fichero se puede leer.

14. Crea `src/clients/http/bruno/01-sql-online/10-create-used-email.bru`.
    `POST /users` con Other y ada@example.com. Tests: 409 y el mensaje contiene `UNIQUE constraint`. `seq` es `10`.
    El fichero se puede leer.

15. Crea `src/clients/http/bruno/01-sql-online/11-get-missing.bru`.
    `GET /users/:id` con `missingId`. Tests: 404 y un mensaje que termina en `was not found`. `seq` es `11`.
    El fichero se puede leer.

16. Crea `src/clients/http/bruno/01-sql-online/12-get-missing-email.bru`.
    `GET /users/email/:email` con missing@example.com. Tests: 404 y un mensaje que termina en `was not found`. `seq` es `12`.
    El fichero se puede leer.

17. Crea `src/clients/http/bruno/01-sql-online/13-get-missing-name.bru`.
    `GET /users/name/:name` con Nobody. Tests: 404 y `User Nobody was not found`. `seq` es `13`.
    El fichero se puede leer.

18. Crea `src/clients/http/bruno/01-sql-online/14-patch-missing.bru`.
    `PATCH /users/:id` con `missingId` y solo el nombre Nobody. Tests: 404 y un mensaje que termina en `was not found`. `seq` es `14`.
    El fichero se puede leer.

19. Crea `src/clients/http/bruno/01-sql-online/15-delete-missing.bru`.
    `DELETE /users/:id` con `missingId`. Tests: 404 y un mensaje que termina en `was not found`. `seq` es `15`.
    El fichero se puede leer.

20. Crea `src/clients/http/bruno/01-sql-online/16-delete-ada.bru`.
    `DELETE /users/:id` con `userId`. Tests: 204 y cuerpo vacío. `seq` es `16`.
    El fichero se puede leer.

21. Crea `src/clients/http/bruno/01-sql-online/17-list-after-delete.bru`.
    `GET /users`. Tests: 200 y `[]`. `seq` es `17`.
    El fichero se puede leer.

22. Crea `src/clients/http/bruno/02-sql-offline/folder.bru`.
    `name` es `02-sql-offline`. `seq` es `2`.
    El fichero se puede leer.

23. Crea `src/clients/http/bruno/02-sql-offline/18-create-sql-offline.bru`.
    `POST /users`. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `18`.
    El fichero se puede leer.

24. Crea `src/clients/http/bruno/02-sql-offline/19-list-sql-offline.bru`.
    `GET /users`. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `19`.
    El fichero se puede leer.

25. Crea `src/clients/http/bruno/02-sql-offline/20-find-sql-offline.bru`.
    `GET /users/:id` con `missingId`. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `20`.
    El fichero se puede leer.

26. Crea `src/clients/http/bruno/02-sql-offline/21-find-email-sql-offline.bru`.
    `GET /users/email/:email` con offline@example.com. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `21`.
    El fichero se puede leer.

27. Crea `src/clients/http/bruno/02-sql-offline/22-find-name-sql-offline.bru`.
    `GET /users/name/:name` con Offline. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `22`.
    El fichero se puede leer.

28. Crea `src/clients/http/bruno/02-sql-offline/23-update-sql-offline.bru`.
    `PATCH /users/:id` con `missingId` y solo el nombre Offline. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `23`.
    El fichero se puede leer.

29. Crea `src/clients/http/bruno/02-sql-offline/24-delete-sql-offline.bru`.
    `DELETE /users/:id` con `missingId`. Tests: 500 y el texto de ese `Error`, sin cambiarlo. `seq` es `24`.
    El fichero se puede leer.

30. Abre `docs/ARCHITECTURE.md`.
    El cliente HTTP también se comprueba con Bruno y `pnpm bruno`. Sigue en `127.0.0.1:3001`.
    Postman puede seguir pidiendo esas mismas peticiones. No cuenta el género.
    El fichero se puede leer.

31. Abre `docs/TREE.md`.
    En `http/` quedan `app.js` y `bruno/`.
    No añade más ficheros en esa carpeta.
    El fichero se puede leer.

32. Abre `docs/STYLE.md`.
    El cliente HTTP sigue siendo un solo fichero JavaScript, `src/clients/http/app.js`.
    La colección Bruno vive en `src/clients/http/bruno`.
    El fichero se puede leer.

33. Abre `docs/ERRORS.md`.
    Si este cliente no está en marcha, `pnpm bruno` no completa la petición.
    Si el programa de consultas no está en marcha, las peticiones de Bruno ven el fallo de esa llamada.
    Los mensajes que ya estaban se quedan.

34. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan `pnpm bruno` y la colección en `src/clients/http/bruno`. El desarrollo abierto pasa a ser `docs/specs/bruno-http-client/`.
    `@usebruno/cli` queda en `4.3.0`. `app.js`, Express `5.3.0` y el puerto `3001` se quedan.
    Los dos se pueden leer.

35. Lee `src/clients/http/app.js`, `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca. No se crea `bruno.md`.
    `eslint.config.js` y el `.gitignore` de la raíz no se tocan. No se crea un `README`.
    `package.json` no gana ningún otro paquete.

36. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    No dejan avisos. Las peticiones `.bru` no las formatea Prettier.
    No se tocan la terminal, Jupyter, las pantallas, Nest, la ventana, el popup ni la vista.
    Los dos comandos terminan.

37. Desde `first-app`, con la lista vacía, lanza `pnpm server` y `pnpm http`.
    La consola del HTTP muestra `http://127.0.0.1:3001`.
    El programa de consultas sigue en `127.0.0.1:3000`.

38. Desde `first-app`, lanza `pnpm bruno`.
    `01-sql-online` pasa. Crear, listar, buscar por id, email y nombre, modificar y eliminar coinciden con el plan.
    Se ven 400, 409 y 404 acordados. Al final la lista está vacía.

39. Para solo `pnpm server`. Desde `src/clients/http/bruno`, lanza `bru run 02-sql-offline -r`.
    Las siete responden 500 con el texto de ese `Error`, sin cambiarlo.
    El script `test` no se ha tocado. `app.js` no ha cambiado de rutas.
