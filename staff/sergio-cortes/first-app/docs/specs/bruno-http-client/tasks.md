# Tareas — colección Bruno del cliente HTTP

Issue: #1103.

Solo el paso 1 instala y cambia el paquete. Se ejecuta tras la
aprobación de «Paquetes»: spec y plan aprobados por la persona. Los
demás pasos siguen al 1.

1. Abrir `first-app/package.json`. Añadir `@usebruno/cli` con versión
   exacta `4.3.0` en `devDependencies`, con `pnpm add -D --save-exact`.
   Añadir el script `bruno`: entra en `src/clients/http/bruno` y lanza
   `bru run 01-sql-online -r`. Resultado: `"@usebruno/cli": "4.3.0"` y
   el lockfile lo recoge. El script `test` no cambia.

2. Abrir `src/logic/update-user.js`. Un `name` o `email` que no viene
   conserva el valor de `findById`. Si viene, se valida como ahora.
   Antes de `update` se llama a `findByEmail` con el email resultante.
   Resultado: se puede cambiar un campo o los dos; email de otro
   usuario sigue siendo `Email is already used`.

3. Abrir `src/clients/nest/users.controller.js`. En
   `UPDATE_USER_BODY_SCHEMA`, quitar `required: ["name", "email"]`.
   Dejar el ejemplo completo `{ name: "Ada Lovelace", email:
   "ada@example.com" }`. Resultado: `POST` no cambia; `PATCH` no exige
   los dos campos; el ejemplo sigue con nombre y email.

4. Abrir `docs/ARCHITECTURE.md`. En `update-user.js`, decir que un dato
   que no entra se conserva y que el email no se repite. En
   `users.controller.js`, decir que el cuerpo de `PATCH` no exige los
   dos. En `src/clients/http/server.js` y en los scripts, la colección
   Bruno y `pnpm bruno` se añaden en los pasos de documentación
   posteriores.

5. Abrir `docs/TREE.md`, en `http/`. Dejar `server.js` y añadir
   `bruno/`. Resultado: el árbol coincide con el plan.

6. Abrir `AGENTS.md`, Comandos. El script `test` sigue fallando y no se
   cambia. Añadir que la comprobación del cliente HTTP es `pnpm bruno`.
   En Ejecutar, nombrar `pnpm bruno`.

7. Crear `src/clients/http/bruno/bruno.json`. `version` `0.0.0`, `name`
   `first-app HTTP users`, `type` `collection`. Resultado: ese fichero
   se lee en la carpeta.

8. Crear `src/clients/http/bruno/collection.bru`. `baseUrl`
   `http://127.0.0.1:3001`. `missingId` `999999`. No hay otra variable.

9. Crear `src/clients/http/bruno/01-sql-online/folder.bru`. `name`
   `01-sql-online`, `seq` `1`.

10. Crear `src/clients/http/bruno/01-sql-online/01-empty-list.bru`.
    `GET /users`. Tests: 200 y `[]`. `seq` `1`.

11. Crear `src/clients/http/bruno/01-sql-online/02-create-ada.bru`.
    `POST /users` con Ada y ada@example.com. Tests: 201, cinco campos,
    nombre Ada y email ada@example.com. Guarda `userId`. `seq` `2`.

12. Crear `src/clients/http/bruno/01-sql-online/03-list-users.bru`.
    `GET /users`. Tests: 200 y la lista tiene a Ada. `seq` `3`.

13. Crear `src/clients/http/bruno/01-sql-online/04-find-ada.bru`.
    `GET /users/:id` con `userId`. Tests: 200 y los mismos datos.
    `seq` `4`.

14. Crear `src/clients/http/bruno/01-sql-online/05-patch-name.bru`.
    `PATCH /users/:id` solo con el nombre Ada Lovelace. Tests: 200; el
    id y el email no cambian. `seq` `5`.

15. Crear `src/clients/http/bruno/01-sql-online/06-create-empty-name.bru`.
    `POST /users` con el nombre `" "` y empty@example.com. Tests: 400 y
    `Name is empty`. `seq` `6`.

16. Crear `src/clients/http/bruno/01-sql-online/07-create-invalid-email.bru`.
    `POST /users` con Invalid e `invalid`. Tests: 400 y
    `Email is invalid`. `seq` `7`.

17. Crear `src/clients/http/bruno/01-sql-online/08-create-used-email.bru`.
    `POST /users` con Other y ada@example.com. Tests: 409 y
    `Email is already used`. `seq` `8`.

18. Crear `src/clients/http/bruno/01-sql-online/09-get-missing.bru`.
    `GET /users/:id` con `missingId`. Tests: 404 y `User not found`.
    `seq` `9`.

19. Crear `src/clients/http/bruno/01-sql-online/10-patch-missing.bru`.
    `PATCH /users/:id` con `missingId` y solo el nombre Nobody. Tests:
    404 y `User not found`. `seq` `10`.

20. Crear `src/clients/http/bruno/01-sql-online/11-delete-missing.bru`.
    `DELETE /users/:id` con `missingId`. Tests: 404 y `User not found`.
    `seq` `11`.

21. Crear `src/clients/http/bruno/01-sql-online/12-delete-ada.bru`.
    `DELETE /users/:id` con `userId`. Tests: 204 y cuerpo vacío.
    `seq` `12`.

22. Crear `src/clients/http/bruno/01-sql-online/13-list-after-delete.bru`.
    `GET /users`. Tests: 200 y `[]`. `seq` `13`.

23. Crear `src/clients/http/bruno/02-sql-offline/folder.bru`. `name`
    `02-sql-offline`, `seq` `2`.

24. Crear `src/clients/http/bruno/02-sql-offline/14-create-sql-offline.bru`.
    `POST /users`. Tests: 500 y `Could not create the user`. `seq` `14`.

25. Crear `src/clients/http/bruno/02-sql-offline/15-list-sql-offline.bru`.
    `GET /users`. Tests: 500 y `Could not list the users`. `seq` `15`.

26. Crear `src/clients/http/bruno/02-sql-offline/16-find-sql-offline.bru`.
    `GET /users/:id` con `missingId`. Tests: 500 y
    `Could not find the user`. `seq` `16`.

27. Crear `src/clients/http/bruno/02-sql-offline/17-update-sql-offline.bru`.
    `PATCH /users/:id` con `missingId` y solo el nombre Offline. Tests:
    500 y `Could not update the user`. `seq` `17`.

28. Crear `src/clients/http/bruno/02-sql-offline/18-delete-sql-offline.bru`.
    `DELETE /users/:id` con `missingId`. Tests: 500 y
    `Could not delete the user`. `seq` `18`.

29. Abrir `docs/ARCHITECTURE.md` en `src/clients/http/server.js` y en
    los scripts de `package.json`. Añadir la colección Bruno y
    `pnpm bruno`. Resultado: el texto coincide con el plan.

30. Ejecutar `pnpm run format` y `pnpm run lint` desde `first-app`.
    Resultado: Prettier no deja cambios pendientes y ESLint no da
    errores.

31. Con la lista vacía, arrancar `pnpm server` y `pnpm http`. Resultado:
    la consola del HTTP muestra `http://127.0.0.1:3001`.

32. Ejecutar `pnpm bruno`. Resultado: `01-sql-online` pasa; el patch
    solo cambia el nombre; se ven 400, 409 y 404 acordados; al final
    la lista está vacía.

33. Parar solo `pnpm server`. Desde `src/clients/http/bruno`, lanzar
    `bru run 02-sql-offline -r`. Resultado: las cinco responden 500 con
    el `Could not …` de esa acción. El script `test` sigue fallando.
