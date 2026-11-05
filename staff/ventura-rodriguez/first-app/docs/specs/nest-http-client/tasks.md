# Tareas — cliente Nest de usuarios

1. Abre `package.json`.
   Añade en `dependencies` `@nestjs/common`, `@nestjs/core` y `@nestjs/platform-express` en `12.3.3`, `reflect-metadata` en `0.2.2` y `rxjs` en `7.8.2`.
   Añade en `devDependencies` `@babel/cli` y `@babel/core` en `8.1.0`, `@babel/eslint-parser` en `8.0.7`, `@babel/plugin-proposal-decorators` en `8.0.2` y `@babel/preset-env` en `8.0.7`.
   Las dependencias que ya estaban no cambian de versión.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   Esas diez versiones quedan fijadas.
   No se instala `class-transformer`, `class-validator`, `@nestjs/microservices`, `@nestjs/websockets` ni `@babel/node`.

3. Abre `pnpm-lock.yaml`.
   Las versiones de esos paquetes y de sus dependencias, hasta 3 capas, son las del plan.
   `express` sigue en `5.3.0` y `path-to-regexp` sigue en `8.4.2`.
   Si una versión no coincide, se para y esa versión vuelve a Socket.

4. Abre `package.json`.
   Añade el script `nest`: `rm -rf dist && babel src -d dist --config-file ./babel.config.json && node dist/clients/nest/main.js`.
   El script `format` también incluye `src/clients/nest/**/*.js`.
   El resto de scripts no cambia.

5. Crea `babel.config.json` en la raíz de `first-app`, al lado de `eslint.config.js`.
   El preset es `@babel/preset-env` con `targets.node` `current` y `modules` `false`.
   El plugin es `@babel/plugin-proposal-decorators` con `version` `legacy`.
   El fichero se lee.

6. Abre `.gitignore` en la raíz del repo.
   Añade `dist/`, que vale en cualquier carpeta.
   `dist/` no se commitea.
   El resto de ignorados no cambia.

7. Abre `eslint.config.js`.
   `dist/**` entra en `ignores`.
   `src/clients/nest/**/*.js` usa `@babel/eslint-parser`, con `configFile` `babel.config.json`, y deja las reglas recomendadas.
   `pnpm lint` no para en `@`.

8. Abre `docs/TREE.md`.
   Añade `babel.config.json` al lado de `eslint.config.js` y, en `src/clients/`, `nest/` con `main.js`, `app.module.js`, `users.controller.js`, `users.service.js` y `http-exception.filter.js`.
   `dist/` no entra en el árbol.
   Esas líneas se leen en el árbol.

9. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   Ese cliente se compila con Babel, `node` arranca `dist/clients/nest/main.js`, llama a `src/logic/` a través de esa copia, escucha en el puerto 3003 y no repite sus reglas.
   Usa la forma de Nest. No sustituye a `src/clients/http/`, ni a `src/clients/chrome/`, ni a `src/db/server.js`.
   Esas líneas se leen en la arquitectura.

10. Abre `docs/STYLE.md`.
    Avisa de que `src/clients/nest/` se aparta de esa guía: hay clases, métodos, `this`, decoradores y nombres de fichero con punto.
    El resto de la app no.
    El resto de la guía no cambia.

11. Abre `docs/ERRORS.md`.
    Avisa de que ese cliente traduce los mensajes de la lista con una clase filtro.
    No añade mensajes ni códigos.
    `logic/` sigue con `throw new Error`.

12. Crea `src/clients/nest/main.js`.
    La primera línea importa `reflect-metadata`. `ORIGIN` es `http://127.0.0.1:3003`.
    Arranca el módulo con `NestFactory` y escucha en ese host y ese puerto.
    Al arrancar escribe `ORIGIN`.

13. Crea `src/clients/nest/app.module.js`.
    La clase lleva `@Module` y registra el controlador, el servicio y el filtro.
    No importa ficheros de `logic/`.
    El fichero se lee.

14. Crea `src/clients/nest/users.service.js`.
    La clase lleva `@Injectable`. Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`.
    No importa `users-gender-count.js`, `find-user-by-name.js` ni `find-user-by-email.js`.
    Cada método llama a una de esas cinco funciones y devuelve su resultado.

15. Crea `src/clients/nest/users.controller.js`.
    La clase lleva `@Controller` y `@Dependencies(UsersService)`. Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
    El cuerpo entra con `@Bind(Body())` y el id con `@Bind(Param("id"))`. El id es el texto de la ruta. Crear y modificar leen `name` y `email`. Si un campo no viene, no entra en `changes`.
    El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío.

16. Crea `src/clients/nest/http-exception.filter.js`.
    La clase lleva `@Catch`. Un mensaje de la tabla del plan sale en `message`, con el estado de esa tabla.
    Si lo lanzado no es un `Error` con un mensaje de la lista, responde 500 con el `Could not` de esa acción.
    Otra ruta responde 404 y un cuerpo vacío.

17. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los `.js` de `src/clients/nest/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

18. Arranca la base con el comando que ya existe y el cliente con `pnpm nest`.
    El cliente escribe `http://127.0.0.1:3003`.
    La base sigue en el puerto 3000.
    `GET /no-existe` responde 404 y un cuerpo vacío.

19. `POST /users` con Ada y ada@example.com.
    Responde 201.
    El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
    `GET /users` incluye a ese usuario.

20. `GET /users/:id` con ese id.
    Responde 200 y los mismos datos.
    `PATCH /users/:id` solo con el nombre Ada Lovelace responde 200.
    El id y el email no cambian.

21. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
    Esos tres no crean un usuario nuevo.
    `GET`, `PATCH` y `DELETE` de un id que no existe responden 404 `User not found`.

22. `DELETE /users/:id` de Ada.
    Responde 204 y un cuerpo vacío.
    Ada ya no sale en `GET /users`.
    Si no queda ninguno, esa lista está vacía.

23. Para la base y llama a las cinco rutas.
    Crear muestra `Could not create the user`.
    Listar, ver, modificar y borrar muestran su `Could not`.
    Los cinco responden 500.

24. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 500 y `Could not create the user`.
    No sale un mensaje que no esté en la lista.
    El cliente no ha validado ese cuerpo.
