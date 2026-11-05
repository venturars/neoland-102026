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

Socket, con `depscore`, dio 75 o más en esos diez y en las dependencias directas de Nest. La más baja de ese grupo es calidad 73, en `@babel/plugin-proposal-decorators@8.0.2`.

Las capas dos y tres de Babel salen de `package-lock.json`, con la versión que el lock resuelve dentro de `node_modules` de cada paquete. La capa dos son 88 dependencias de `@babel/cli@8.1.0`, `@babel/core@8.1.0`, `@babel/eslint-parser@8.0.7`, `@babel/plugin-proposal-decorators@8.0.2` y `@babel/preset-env@8.0.7`. La capa tres son 30 dependencias de esa capa dos. En este árbol `minimatch` es `11.0.4`.

`depscore` devolvió las cinco puntuaciones de las 118. Ninguna baja de 50. La más baja es calidad 62, en `@babel/plugin-transform-dotall-regex@8.0.1`, `@babel/plugin-transform-regexp-modifiers@8.0.1`, `@babel/plugin-transform-unicode-regex@8.0.1` y `@babel/plugin-transform-unicode-sets-regex@8.0.1`.

Alertas: `alerts` con `org_slug` `vibecodingneoland`, `status` `open` y `artifact_type` `npm`. `items` llegó vacío y `endCursor` llegó nulo. No hay alerta abierta de npm en esa organización.

Campaña: `threat_feed` para `@babel/core@8.1.0`, ecosistema `npm`, respondió 403 `threat_feed_not_entitled`. El mensaje fue `Threat feed is not enabled for this organization. Please contact sales for information on enabling this feature.` No hay dato de campaña. Se acepta ese hueco. Las versiones se quedan: las puntuaciones que sí llegaron están en 50 o más y la lista de alertas abiertas está vacía.

- `@babel/code-frame@8.0.6`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 73, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/compat-data@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 75, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/generator@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 78, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-compilation-targets@8.0.7`, capa 2. `depscore`: licencia 100, mantenimiento 96, calidad 74, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-create-class-features-plugin@8.0.10`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 77, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-plugin-utils@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-validator-option@8.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 71, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helpers@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 76, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/parser@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 98, calidad 80, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 68, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6`, capa 2. `depscore`: licencia 100, mantenimiento 94, calidad 68, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-syntax-decorators@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 67, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-arrow-functions@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 66, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-async-generator-functions@8.0.6`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 72, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-async-to-generator@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-block-scoped-functions@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-block-scoping@8.0.10`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-class-properties@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 64, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-class-static-block@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-classes@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-computed-properties@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-destructuring@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 94, calidad 75, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-dotall-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 62, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-duplicate-keys@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-dynamic-import@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 67, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-explicit-resource-management@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 72, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-exponentiation-operator@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-export-namespace-from@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 93, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-for-of@8.0.7`, capa 2. `depscore`: licencia 100, mantenimiento 95, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-function-name@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 66, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-json-strings@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 66, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-literals@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 66, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-logical-assignment-operators@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-member-expression-literals@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-modules-amd@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 72, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-modules-commonjs@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 73, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-modules-systemjs@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 93, calidad 74, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-modules-umd@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 72, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-named-capturing-groups-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-new-target@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-nullish-coalescing-operator@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-numeric-separator@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 66, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-object-rest-spread@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-object-super@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-optional-catch-binding@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-optional-chaining@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 73, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-parameters@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-private-methods@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-private-property-in-object@8.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 72, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-property-literals@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-regenerator@8.0.6`, capa 2. `depscore`: licencia 100, mantenimiento 92, calidad 76, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-regexp-modifiers@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 62, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-reserved-words@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 64, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-shorthand-properties@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-spread@8.0.8`, capa 2. `depscore`: licencia 100, mantenimiento 94, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-sticky-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-template-literals@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 71, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-typeof-symbol@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-unicode-escapes@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 71, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-unicode-property-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 65, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-unicode-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 62, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/plugin-transform-unicode-sets-regex@8.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 62, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/preset-modules@0.2.0`, capa 2. `depscore`: licencia 100, mantenimiento 84, calidad 99, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/template@8.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 75, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/traverse@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 79, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/types@8.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 80, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@jridgewell/trace-mapping@0.3.31`, capa 2. `depscore`: licencia 100, mantenimiento 80, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@types/gensync@1.0.5`, capa 2. `depscore`: licencia 100, mantenimiento 80, calidad 70, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `babel-plugin-polyfill-corejs3@1.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 83, calidad 93, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `chokidar@5.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 85, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `commander@14.0.3`, capa 2. `depscore`: licencia 100, mantenimiento 83, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `convert-source-map@2.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `core-js-compat@3.51.0`, capa 2. `depscore`: licencia 100, mantenimiento 87, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `empathic@2.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 83, calidad 93, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `eslint-scope@9.1.2`, capa 2. `depscore`: licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `eslint-visitor-keys@5.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 83, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `gensync@1.0.0-beta.2`, capa 2. `depscore`: licencia 100, mantenimiento 75, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `glob@14.0.3`, capa 2. `depscore`: licencia 100, mantenimiento 92, calidad 99, cadena 98, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `import-meta-resolve@4.2.0`, capa 2. `depscore`: licencia 100, mantenimiento 79, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `json5@2.2.3`, capa 2. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `obug@3.0.0`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `slash@5.1.0`, capa 2. `depscore`: licencia 100, mantenimiento 79, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `verkit@0.5.0`, capa 2. `depscore`: licencia 100, mantenimiento 88, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-annotate-as-pure@8.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 64, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-create-regexp-features-plugin@8.0.7`, capa 3. `depscore`: licencia 100, mantenimiento 94, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-define-polyfill-provider@1.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 87, calidad 76, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-globals@8.0.6`, capa 3. `depscore`: licencia 100, mantenimiento 89, calidad 75, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-member-expression-to-functions@8.0.5`, capa 3. `depscore`: licencia 100, mantenimiento 90, calidad 74, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-module-imports@8.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-module-transforms@8.1.0`, capa 3. `depscore`: licencia 100, mantenimiento 96, calidad 76, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-optimise-call-expression@8.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 68, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-remap-async-to-generator@8.0.1`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 70, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-replace-supers@8.0.1`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 73, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-skip-transparent-expression-wrappers@8.1.0`, capa 3. `depscore`: licencia 100, mantenimiento 94, calidad 66, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-string-parser@8.0.8`, capa 3. `depscore`: licencia 100, mantenimiento 96, calidad 74, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@babel/helper-validator-identifier@8.0.6`, capa 3. `depscore`: licencia 100, mantenimiento 90, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@jridgewell/gen-mapping@0.4.0-beta.0`, capa 3. `depscore`: licencia 100, mantenimiento 80, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@jridgewell/resolve-uri@3.1.2`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 81, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@jridgewell/sourcemap-codec@1.6.0`, capa 3. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@types/esrecurse@4.3.1`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 89, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@types/estree@1.0.9`, capa 3. `depscore`: licencia 100, mantenimiento 87, calidad 74, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@types/jsesc@2.5.1`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 69, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `browserslist@4.29.5`, capa 3. `depscore`: licencia 100, mantenimiento 92, calidad 90, cadena 98, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `esrecurse@4.3.0`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `estraverse@5.3.0`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `esutils@2.0.3`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `flru@1.0.2`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 99, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `js-tokens@10.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 80, calidad 72, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `jsesc@3.1.0`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `minimatch@11.0.4`, capa 3. `depscore`: licencia 100, mantenimiento 95, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `minipass@7.1.3`, capa 3. `depscore`: licencia 100, mantenimiento 80, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `path-scurry@3.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 86, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `readdirp@5.1.1`, capa 3. `depscore`: licencia 100, mantenimiento 83, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.

No se instalan `class-validator` ni `class-transformer`.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`, `src/clients/electron/`
- `docs/STYLE.md`, `docs/ERRORS.md`

## Comprobar

Desde `first-app`, con `npm run db` en marcha, `npm run nest`. Crear una persona temporal, verla, cambiar el nombre y borrarla. Probar un nombre vacío, un email que no vale, un email repetido y un id que no está. Una ruta desconocida responde 404 y un cuerpo vacío. Luego `npm run format` y `npm run lint`. Quitar a esa persona.
