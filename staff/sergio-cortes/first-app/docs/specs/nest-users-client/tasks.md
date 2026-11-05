# Tareas — cliente HTTP con Nest.js para usuarios

Issue: #1036.

El paso 1 solo se ejecuta tras la aprobación de «Paquetes».

1. Desde `first-app`, ejecutar el `pnpm add --save-exact` de producción del
   plan (`@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`,
   `@nestjs/platform-express@12.3.3`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`).
   Versiones exactas, sin `^`. Cambia `pnpm-lock.yaml`.

2. Desde `first-app`, ejecutar el `pnpm add -D --save-exact` de Babel del
   plan (`@babel/cli@8.1.0`, `@babel/core@8.1.0`, `@babel/preset-env@8.0.7`,
   `@babel/plugin-proposal-decorators@8.0.2`, `@babel/eslint-parser@8.0.7`).
   Quedan en `devDependencies`, sin `^`. No se añade otra dependencia.

3. Abrir `pnpm-lock.yaml`.
   Las versiones de los pasos 1 y 2, y sus dependencias hasta 3 capas, son
   las del plan. Si una no coincide, se para y esa versión vuelve a Socket.

4. Abrir `package.json`. Añadir el script `nest`: si nada escucha en
   `127.0.0.1:3000` (`nc -z`), arranca `src/db/server.js` en segundo plano y lo
   para al salir; después `rm -rf dist && babel src -d dist --config-file ./babel.config.json && node dist/clients/nest/main.js`.
   No se tocan `server`, `web`, `http`, `electron`, `chrome`, `jupyter`,
   `format`, `lint` ni `test`.

5. Crear `babel.config.json` en la raíz de first-app, igual que el plan
   (`preset-env` con `node` `current` y `modules` `false`; plugin de
   decoradores `{ "version": "legacy" }`).

6. Abrir el `.gitignore` del repo. Añadir `dist/` si no está. `dist/` no se
   commitea.

7. Abrir `eslint.config.js`. Para `src/clients/nest/**/*.js`, parser
   `@babel/eslint-parser` con `configFile` `./babel.config.json`, y `console`
   como global. Ignorar `dist/`. No se cambian los bloques de los demás
   clientes.

8. Abrir `docs/STYLE.md`. Excepción en `src/clients/nest/`: clases, `this`,
   métodos, decoradores. Nombres de fichero que exige la convención de la
   tecnología, solo cuando hace falta. El resto de la guía no cambia.

9. Abrir `docs/ERRORS.md`. HTTP (Express, Chrome, Nest) responde
   `{ "message" }`. Quitar `Internal error` de esos clientes. Conservar
   `Body is invalid`. Anotar DELETE 204, 404 vacío y el fallback `Could not …`.

10. Crear `src/clients/nest/http-exception.filter.js`, igual que el plan.
    Filtro `@Catch()`. Por clase: `ValidationError` 400, `NotFoundError` 404,
    `ConflictError` 409, `DatabaseError` 500. JSON mal formado: 400
    `Body is invalid`. Otro error: 500 `Could not …` de la acción. Ruta
    desconocida: 404 sin cuerpo. Responde `{ message }`.

11. Crear `src/clients/nest/users.service.js`. Importa `listUsers`,
    `findUserById`, `createUser`, `updateUser` y `deleteUser`. `parseUserId`
    antes de logic. No captura errores.

12. Crear `src/clients/nest/users.controller.js`. Cinco rutas: 200, 200, 201,
    200 y 204. Delega en el servicio. `checkBody` en POST y PATCH. No importa
    logic.

13. Crear `src/clients/nest/app.module.js` y `src/clients/nest/main.js`.
    Módulo con controlador, servicio y filtro (`APP_FILTER`). `main.js`
    escucha en `127.0.0.1:3003` y escribe
    `HTTP server listening on http://127.0.0.1:3003`.

14. Abrir `src/clients/http/server.js` y `src/clients/chrome/server.js`.
    DELETE 204 sin cuerpo. Fallo `{ message }`. 404 vacío. Fallback
    `Could not …`. Sin `Internal error`. No se toca logic.

15. Abrir `src/clients/chrome/popup.js`. El fallo lee `body.message`. Un
    DELETE 204 no llama a `response.json()`.

16. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
    Añadir `babel.config.json` y `src/clients/nest/` con los cinco ficheros.
    Nest se compila a `dist/` y llama a logic en 3003. Express 3001 y Chrome
    3002 el mismo contrato HTTP. El script `nest` arranca la base si el 3000
    está libre.

17. `pnpm run format` y `pnpm run lint` sobre lo tocado.
    No cambia `src/logic/`, `src/queries/`, `src/db/`, web, electron, vscode
    ni jupyter.

18. Con `pnpm server` y, por turno, `pnpm nest`, `pnpm http` y `pnpm chrome`,
    probar con `curl` las 5 rutas en 3003, 3001 y 3002: éxito (200, 201,
    DELETE 204 vacío), `Id is invalid`, `User not found`,
    `Email is already used` (409), `Name is empty`, `Email is invalid` (400),
    `Body is invalid` (JSON roto) y una ruta que no existe (404 vacío).
    El popup de Chrome muestra el `message` del JSON. No hay `.txt` de
    terminal.
