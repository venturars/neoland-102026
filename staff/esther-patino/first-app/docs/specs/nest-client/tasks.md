# Tareas — cliente Nest de usuarios

1. Abre `package.json`.
   Añade en `dependencies` `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`, `@nestjs/platform-express@12.3.3`, `reflect-metadata@0.2.2` y `rxjs@7.8.2`.
   Añade en `devDependencies` `@babel/cli@8.1.0`, `@babel/core@8.1.0`, `@babel/plugin-proposal-decorators@8.0.2` y `@babel/preset-env@8.0.7`.
   El script `nest` es `babel src/clients/nest --out-dir src/clients/nest-run && node src/clients/nest-run/main.js`.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   Los nueve paquetes quedan en la versión del plan.
   `express` sigue en `5.3.0`.

3. Abre `pnpm-lock.yaml`.
   Las versiones de Nest, de Babel y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Crea `src/clients/nest/.babelrc.json`.
   `@babel/preset-env` tiene `targets.node` en `current` y `modules` en false.
   El plugin de decoradores tiene `version` en `legacy`.
   El resto de la app no tiene otro fichero de Babel.

5. Crea `.gitignore` en `first-app`.
   Ignora `src/clients/nest-run/`.
   Esa carpeta es la salida de Babel.
   No se commitea.

6. Abre `eslint.config.js`.
   `globalIgnores` incluye `src/clients/nest-run/**`.
   El resto de las reglas no cambia.
   El fuente de `src/clients/nest/` sí se linta.

7. Abre `docs/tree.md`, en `clients/`.
   Añade `nest/` con `.babelrc.json`, `main.js`, `app.module.js` y `users.controller.js`.
   No lista `nest-run/`.
   El resto del árbol no cambia.

8. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/nest/` llama a `src/logic/`, escucha en el puerto 3003 y no repite sus reglas.
   `pnpm nest` lo compila con Babel a `src/clients/nest-run` y arranca ese `main.js`.
   No sustituye a `src/db/server.js` ni al cliente HTTP.

9. Abre `docs/style.md`, en Comandos.
   Añade `pnpm nest` desde `first-app`. Ese cliente escucha en `127.0.0.1:3003`.
   Dice que usa una clase de módulo y una de controlador.
   Dice que este cliente es el que pasa por Babel.

10. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
    También se crea, se lista, se ve, se cambia y se borra un usuario con el cliente Nest, en el puerto 3003. Ese cliente pasa por Babel. La base sigue en el 3000.
    Este cambio añade el cliente Nest, que es el que pasa por Babel, y no añade un `.txt`.
    Esas líneas se leen.

11. Crea `src/clients/nest/main.js`.
    Importa `reflect-metadata` y `NestFactory`. `ORIGIN` es `http://127.0.0.1:3003`.
    Crea la app con el módulo y escucha en ese host y ese puerto.
    Al arrancar escribe `ORIGIN`.

12. Crea `src/clients/nest/app.module.js`.
    La clase del módulo registra el controlador.
    No importa `src/logic/`.
    No hay otra clase.

13. Crea `src/clients/nest/users.controller.js`.
    Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`.
    Las rutas son `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id`.
    El id de la ruta se pasa a número con `Number`. El éxito responde 201, 200, 200, 200 y 204. El 204 va vacío. Un fallo de la lista sale en `message`, con el estado de la tabla del plan.

14. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los ficheros de `src/clients/nest/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

15. Arranca la base con `pnpm server` y el cliente con `pnpm nest`.
    Babel escribe `src/clients/nest-run/` y el cliente escribe `http://127.0.0.1:3003`.
    La base sigue en el puerto 3000.
    `GET /no-existe` responde 404 y un cuerpo vacío.

16. `POST /users` con Ada y ada@example.com.
    Responde 201.
    El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
    `GET /users` incluye a ese usuario.

17. `GET /users/:id` con ese id.
    Responde 200 y los mismos datos.
    `PATCH /users/:id` solo con el nombre Ada Lovelace responde 200.
    El id y el email no cambian.

18. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`.
    `GET`, `PATCH` y `DELETE` de un id que no existe responden 404 `User not found`.
    `GET` de un id que no es un entero mayor o igual que 1 responde 400 `Invalid id`.

19. `DELETE /users/:id` de Ada.
    Responde 204 y un cuerpo vacío.
    Ada ya no sale en `GET /users`.
    Si no queda ninguno, esa lista está vacía.

20. Para la base y llama a las cinco rutas.
    Crear muestra `Could not create the user`.
    Listar, ver, cambiar y borrar muestran su `Could not`.
    Los cinco responden 500.

21. Arranca otra vez la base y envía `POST /users` sin nombre.
    Responde 400 y `Name is empty`.
    No sale `Query failed` ni un mensaje que no esté en la lista.
    El cliente HTTP del puerto 3001 sigue respondiendo.
