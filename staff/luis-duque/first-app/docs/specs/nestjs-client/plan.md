# Plan — cliente NestJS

Cumple `docs/specs/nestjs-client/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar y eliminar siguen en la lógica que ya existe. Buscar y contar el género no entran. Crear la tabla no se pide aparte.

Se añade NestJS `12.3.3`. Es la excepción aceptada, junto a Express `5.3.0`, Electron `45.2.3` y Fastify `5.12.8`. Esta app es JavaScript con `"type": "module"`. NestJS usa decoradores y Node no los ejecuta así. Babel los compila antes de arrancar. No hay TypeScript.

`express` se queda en `5.3.0`. `@nestjs/platform-express` lo usa. Esa versión no cambia y no se vuelve a comprobar, ni el árbol que ya cuelga de ella.

## Validación Socket

`depscore` respondió el 2026-11-05, con plataforma `win32-x64`. `organizations` respondió `Unauthorized`. Sin `org_slug` no se ha podido llamar a `alerts` ni a `threat_feed`. No hay dato de alerta ni de campaña. Eso no es ausencia de avisos.

El árbol son 154 paquetes nuevos, hasta 3 capas, sin repetir. Las versiones transitivas son las que pnpm ya resolvió para estos mismos números en este repositorio. Esta app todavía no las tiene en su `pnpm-lock.yaml`. Ninguna stat está por debajo de 50. La más baja es el mantenimiento de `object-assign` `4.1.1`, en 50, y no baja de 50. Su cadena está en 67. Varios plugins de Babel tienen la calidad entre 62 y 69. Tampoco bajan de 50.

Socket devolvió `append-field` `2.0.0` cuando el árbol pide `1.0.0`. La fila de abajo es la de `2.0.0`. La de `1.0.0` no se ha podido leer. Esas puntuaciones tampoco bajan de 50.

| Paquete | Versión | Capa | Campaña | Alertas | Stats por debajo de 50 |
| --- | --- | --- | --- | --- | --- |
| `@nestjs/common` | `12.3.3` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 100, cadena 99, vulnerabilidad 100 |
| `@nestjs/core` | `12.3.3` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 95, calidad 100, cadena 99, vulnerabilidad 100 |
| `@nestjs/platform-express` | `12.3.3` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 100, cadena 99, vulnerabilidad 100 |
| `reflect-metadata` | `0.2.2` | 0 | sin dato | sin dato | ninguna. Licencia 80, mantenimiento 80, calidad 99, cadena 100, vulnerabilidad 100 |
| `rxjs` | `7.8.2` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 88, calidad 100, cadena 99, vulnerabilidad 100 |
| `@babel/cli` | `8.1.0` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 95, calidad 75, cadena 99, vulnerabilidad 100 |
| `@babel/core` | `8.1.0` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 97, calidad 78, cadena 98, vulnerabilidad 100 |
| `@babel/plugin-proposal-decorators` | `8.0.2` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 73, cadena 99, vulnerabilidad 100 |
| `@babel/preset-env` | `8.0.7` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 94, calidad 75, cadena 96, vulnerabilidad 100 |
| `append-field` | `2.0.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 82, cadena 100, vulnerabilidad 100. El árbol pide `1.0.0` |

Las otras 144 dependencias, de la capa 1 a la 3, tienen campaña `sin dato`, alertas `sin dato` y ninguna stat por debajo de 50.

## Ficheros

Se crea `src/clients/nest/`:

- `main.js` arranca NestJS, escucha y escribe el origen.
- `app.module.js` registra el controlador, el servicio y el filtro.
- `users.controller.js` recibe las cuatro peticiones.
- `users.service.js` llama a la lógica.
- `http-exception.filter.js` traduce el `Error` a la respuesta HTTP. No crea una clase de error: usa `Error`.

Se crea `babel.config.json` en `first-app`. El preset es `@babel/preset-env` con `modules: false` y el objetivo `node: current`. El plugin es `@babel/plugin-proposal-decorators` con `version: legacy`.

Se crea `scripts/run-nest.js`. Borra `dist`, compila `src` a `dist` con Babel y arranca `dist/clients/nest/main.js`. Compila todo `src` porque el cliente importa `../../logic` y esa ruta tiene que existir dentro de `dist`.

Se toca `package.json`. En `dependencies` entran `@nestjs/common` `12.3.3`, `@nestjs/core` `12.3.3`, `@nestjs/platform-express` `12.3.3`, `reflect-metadata` `0.2.2` y `rxjs` `7.8.2`. En `devDependencies` entran `@babel/cli` `8.1.0`, `@babel/core` `8.1.0`, `@babel/plugin-proposal-decorators` `8.0.2` y `@babel/preset-env` `8.0.7`. El script `nest` queda `node scripts/run-nest.js`. Se lanza con `pnpm nest` desde `first-app`, con `pnpm server` en marcha. El script `format` también escribe `src/clients/nest/**/*.js`. pnpm añade los paquetes con esas versiones exactas. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn.

Se toca `eslint.config.js`. Ignora `dist/**` y `src/clients/nest/**`. El parser recomendado no entiende los decoradores. Prettier sí formatea ese JavaScript. `pnpm lint` sigue y no analiza esa carpeta.

Se toca el `.gitignore` de la raíz del repositorio. Entra `staff/luis-duque/first-app/dist/`. `dist` es salida de Babel y no se sube.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/http`, `src/clients/electron`, `src/clients/chrome` ni `src/clients/vscode`. No se crea un `README`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. `users.service.js` importa cuatro funciones que ya existen. El controlador no importa la lógica.

| Petición | Llamada |
| --- | --- |
| `POST /users` | `createUser({ name, email })` |
| `GET /users` | `listUsers()` |
| `PATCH /users/:id` | `updateUser(id, changes)` |
| `DELETE /users/:id` | `deleteUser(id)` |

No hay `GET /users/:id`, ni por email, ni por nombre. No se importa `usersGender`.

El cuerpo de crear es JSON con `name` y `email`. El de modificar es JSON con `name`, con `email` o con los dos. Si un campo no llega, no entra en `changes`. El id de la ruta llega como texto. La lógica ya acepta un id en texto.

## SQL

No hay SQL nuevo. Cada petición usa la operación que ya está escrita.

## Cliente

`main.js` importa primero `reflect-metadata`. Crea la aplicación con `NestFactory` y `AppModule`. La constante `ORIGIN` vale `http://127.0.0.1:3003`. Escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

No valida, no escribe SQL y no abre la base. No llama a `/execute`.

Si la función termina, la respuesta es JSON, salvo al eliminar:

- Crear responde 201 con `{ id, name, email }`.
- Listar responde 200 con la lista. Si no hay ninguno, `[]`.
- Modificar responde 200 con lo que devuelve `updateUser`: el `id` y solo los campos enviados.
- Eliminar responde 204 sin cuerpo. `deleteUser` no devuelve el usuario. Esa respuesta vacía es la señal de que ya no está.

Si la ruta no existe, responde 404 sin cuerpo.

Si el cuerpo no es JSON, responde 400 con `{ "message": texto }`. El texto es el de ese error.

Si la función lanza un `Error`, el cuerpo es `{ "message": texto }` y el texto no se cambia:

- `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer` y `Provide a name or an email to update` responden 400.
- Un mensaje que termina en `was not found` responde 404.
- Un mensaje que contiene `UNIQUE constraint` responde 409. El email repetido sigue saliendo con el texto de SQLite.
- Cualquier otro `Error` responde 500 con ese texto. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

## Documentación

`docs/ARCHITECTURE.md` gana el cliente NestJS: otra forma de listar, crear, modificar y eliminar, desde Postman, sin pantallas. Responde en `127.0.0.1:3003`. Usa NestJS `12.3.3`. Llama a la lógica. No busca y no cuenta el género. Se arranca con `pnpm nest` desde `first-app`, con el programa de consultas en marcha. La terminal, Jupyter, las pantallas, la ventana, el popup de Chrome, la vista de Visual Studio Code y el cliente HTTP siguen igual.

`docs/TREE.md` añade `clients/nest/` con `main.js`, `app.module.js`, `users.controller.js`, `users.service.js` y `http-exception.filter.js`. Añade `scripts/run-nest.js` y `babel.config.json`.

`docs/STYLE.md` deja el cliente en `src/clients/nest`. `users.service.js` llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`. No llama a las búsquedas ni a `usersGender`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm nest`. NestJS queda en `12.3.3`.

`docs/ERRORS.md` añade que, si este cliente no está en marcha, Postman no completa la petición.

`docs/CONSTITUTIONS.MD` cuenta el cliente NestJS, `pnpm nest` y `127.0.0.1:3003`. El desarrollo abierto pasa a ser `docs/specs/nestjs-client/`.

`AGENTS.MD` deja la regla: el cliente vive en `src/clients/nest`. `users.service.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm nest` desde `first-app` y escucha en `127.0.0.1:3003`. NestJS queda en `12.3.3`. Babel compila `src` a `dist` antes de arrancar. `dist` no se sube.
