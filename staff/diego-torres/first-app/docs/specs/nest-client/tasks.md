Issue: #1040

# Tareas — cliente de usuarios con una API Nest

Todos los comentarios del código son frases sencillas, fáciles de leer y sin jerga de Nest sin explicar. Van por bloques y también encima de cada import.

1. Abre `package.json`.
   Añade `@nestjs/common`, `@nestjs/core` y `@nestjs/platform-express` en `12.3.3`, `reflect-metadata` en `0.2.2` y `rxjs` en `7.8.2` a `dependencies`, y `@swc/core` en `1.16.21` a `devDependencies`.
   Añade el script `nest` y `src/clients/nest/*.{js,mjs}` en `format`. El resto de dependencias y scripts no cambia.

2. En `first-app`, lanza `pnpm install`.
   `pnpm-lock.yaml` cambia y los seis paquetes quedan en esas versiones.
   Las demás dependencias directas siguen en su versión. Si la instalación falla por el `postinstall` de `@swc/core`, para y enséñaselo a Diego.

3. Compara **todas** las entradas nuevas de `pnpm-lock.yaml` con la tabla del plan.
   Incluye las opcionales y los 19 paquetes fuera de las 3 capas, que deben ser los únicos sin fila en la tabla.
   Si otra entrada no coincide, para y dilo. Esa versión vuelve a Socket. No se instala otra para hacerla coincidir.

4. En `first-app`, lanza `pnpm audit`.
   Se lee el resultado.
   Si sale algo alto o crítico, para y enséñaselo a Diego antes de seguir.

5. Crea `.gitignore` en `first-app`.
   Contiene `src/clients/nest/.run/`.
   `git status` no muestra esa carpeta cuando exista.

6. Abre `eslint.config.js`.
   Ignora `.run/` y los cuatro ficheros con `@`, y añade las reglas recomendadas a `src/clients/nest/bootstrap.mjs`.
   Lo demás no cambia.

7. Crea `src/clients/nest/users.service.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`, cada una desde su fichero de `src/logic/`, no desde `logic/index.js`.
   Cada método llama a su operación con la firma del plan. No valida.

8. Crea `src/clients/nest/users.controller.js`.
   Las cinco rutas y estados de la tabla del plan. Usa `body ?? {}`. En `PATCH`, lo que no llega no entra en `changes`.
   `DELETE` no devuelve cuerpo.

9. Crea `src/clients/nest/logic-exception.filter.js`.
   Los errores de la tabla del plan responden `{ message }` con su estado. Lo que no está en la tabla responde 500 con el `Could not …` elegido por método y ruta.
   Ruta que no existe: 404 sin cuerpo. JSON mal formado: 400 sin cuerpo.

10. Crea `src/clients/nest/app.module.js`.
    Une el controlador, el servicio y el filtro.
    El filtro queda activo para toda la app.

11. Crea `src/clients/nest/main.js`.
    Crea la app con `logger: false`. El middleware responde 403 sin cuerpo si el `Host` no es `127.0.0.1:3003` o si llega `Origin`.
    Escucha en `127.0.0.1:3003`, escribe la dirección en la consola y avisa si el puerto está ocupado, igual que `chrome/server.js`.

12. Crea `src/clients/nest/bootstrap.mjs`.
    Traduce los ficheros con `@swc/core` a `.run/`, cambia `../../logic/` por `../../../logic/` en lo traducido e importa `.run/main.js`.
    No toca los ficheros originales.

13. Con `pnpm start` en otra terminal, lanza `pnpm nest`.
    La consola escribe `http://127.0.0.1:3003` y solo los avisos del plan.
    Si `@Bind` o `@Inject` no funcionan traducidos con swc, para y dilo. No cambies de herramienta sin preguntar.

14. Prueba por HTTP el ejemplo de Ada de la spec, con un email que no exista en la base.
    Crear da 201, listar y ver dan 200, y renombrar da 200 con el mismo email. Borrar da 204 sin cuerpo y Ada ya no sale en la lista.
    Los datos de prueba no quedan en la base.

15. Prueba los fallos con la base en marcha.
    `Name is empty` y `Email is invalid` dan 400, `Email is already used` da 409 y `User not found` da 404, en `{ message }`.
    `GET /no-existe` da 404 sin cuerpo.

16. Prueba las peticiones que no se atienden.
    JSON mal formado da 400 sin cuerpo, no 500. Un cuerpo que no es JSON al crear da `Name is empty`.
    `Host` ajeno da 403 sin cuerpo. `Origin` presente da 403 sin cuerpo.

17. Para `pnpm start` con `pnpm nest` en marcha y repite las cinco rutas.
    Dan 500 con `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`.
    Vuelve a lanzar `pnpm start`.

18. Lanza `pnpm chrome` y pide `GET /users` en el 3002.
    Responde como antes, con `pnpm nest` también en marcha.
    `git status` no muestra cambios en `src/logic/`, `src/queries/`, `src/db/` ni en los demás clientes.

19. Abre `docs/STYLE.md`.
    Añade el aviso: `src/clients/nest/` usa clases y decoradores porque Nest los exige. El resto del proyecto sigue igual.

20. Abre `docs/ARCHITECTURE.md` y `docs/TREE.md`.
    Añade `src/clients/nest/` a la capa de clientes, a «Quién sabe qué» y al árbol.
    Dicen que llama a `src/logic/`, que escucha en `127.0.0.1:3003` y que no tiene reglas.

21. Abre `AGENTS.md`.
    Añade las dependencias, el comando `pnpm nest`, el alcance de `pnpm format` y este cliente a los que necesitan el servidor.

22. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `format` no toca `.run/`. `lint` termina bien.
    Cuenta a Diego qué ha quedado sin revisar por lint: los cuatro ficheros con `@`.
