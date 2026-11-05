# Plan — personas por Nest

Cumple `docs/specs/cliente-nest/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `babel.config.json`: compila los decoradores. El preset es `@babel/preset-env` con `targets.node` `current` y `modules` `false`. El plugin es `@babel/plugin-proposal-decorators` con `version` `legacy`.
- `src/clients/nest/main.js`: arranca en `http://127.0.0.1:3003`.
- `src/clients/nest/app.module.js`: registra el controlador, el servicio y el filtro.
- `src/clients/nest/users.controller.js`: las cinco rutas. No importa `src/logic/`.
- `src/clients/nest/users.service.js`: llama a `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`. El id de la ruta se convierte en un entero de 1 en adelante antes de llamar. Un campo que no llega no entra en el cambio.
- `src/clients/nest/http-exception.filter.js`: traduce la frase al estado. Otra ruta responde 404 y un cuerpo vacío.
- `package.json`: el script `nest` borra `dist`, compila `src` con Babel y arranca `dist/clients/nest/main.js`. `format` incluye `src/clients/nest/**/*.js`.
- `eslint.config.js`: `@babel/eslint-parser` en `src/clients/nest/**/*.js`. `dist/` queda fuera.
- `docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`, `AGENTS.md` y `README.md`: nombran este cliente y avisan de que se aparta de `docs/STYLE.md` y de `docs/ERRORS.md`. Esos dos ficheros no se tocan.

No hay SQL nuevo. No hay firma nueva. `dist/` no se sube. `.gitignore` ya ignora `dist/`.

## Frases

El cuerpo de un fallo conocido es `{ "message": "<texto>" }`.

- `Name is empty` y `Email is invalid`: 400
- `Email is already used`: 409
- `User not found`: 404
- `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`: 500

Si lo lanzado no es una de esas frases, también responde 500 con el `Could not` de esa acción. Así, `Database is not running. Start it with npm run db.` y `Invalid id` se ven como ese `Could not`. No hay frase nueva.

## Paquetes

`express` sigue en `5.3.0`. Se añaden, en versión exacta:

- `@nestjs/common@12.3.3`
- `@nestjs/core@12.3.3`
- `@nestjs/platform-express@12.3.3`
- `reflect-metadata@0.2.2`
- `rxjs@7.8.2`
- `@babel/cli@8.1.0`
- `@babel/core@8.1.0`
- `@babel/eslint-parser@8.0.7`
- `@babel/plugin-proposal-decorators@8.0.2`
- `@babel/preset-env@8.0.7`

Socket, con `depscore`, dio 75 o más en esos diez y en las dependencias directas de Nest. La más baja es calidad 73, en `@babel/plugin-proposal-decorators@8.0.2`. Alertas abiertas de `@nestjs/core`, `@nestjs/common` y `rxjs` en `vibecodingneoland`: ninguna. El feed de amenazas no está disponible. Las capas dos y tres de Babel no se puntuaron una a una. No se instalan `class-validator` ni `class-transformer`.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`, `src/clients/electron/`
- `docs/STYLE.md`, `docs/ERRORS.md`

## Comprobar

Desde `first-app`, con `npm run db` en marcha, `npm run nest`. Crear una persona temporal, verla, cambiar el nombre y borrarla. Probar un nombre vacío, un email que no vale, un email repetido y un id que no está. Una ruta desconocida responde 404 y un cuerpo vacío. Luego `npm run format` y `npm run lint`. Quitar a esa persona.
