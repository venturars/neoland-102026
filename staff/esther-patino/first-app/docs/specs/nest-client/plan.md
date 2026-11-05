# Plan — cliente Nest de usuarios

Issue: #1014.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún
fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma
nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

El cliente importa las funciones que ya existen y devuelve su
resultado. Se parece a `src/clients/http/app.js`: la llamada está en
el cliente y la regla sigue en `src/logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Cambiar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

`validateId` rechaza un texto: el fallo es `Invalid id`. El id de la
ruta es texto. El cliente lo pasa a número con `Number` antes de
llamar. No lanza su propio mensaje. `Number("1")` es `1`.
`Number("abc")` es `NaN` y `validateId` lanza `Invalid id`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con `pnpm server`. Este cliente escucha en
`http://127.0.0.1:3003`. La constante es `ORIGIN`. `package.json`
tiene el script `nest`. Se lanza con `pnpm nest` desde `first-app`.
Ese script compila `src/clients/nest` con Babel a
`src/clients/nest-run` y arranca `node` en ese `main.js`. Al
arrancar escribe esa dirección.

El adaptador es el de Express. `@nestjs/platform-express@12.3.3`
depende de `express@5.3.0`, que ya está en la app y no cambia de
versión. Crear y cambiar leen `name` y `email`. Si un campo no viene,
no entra en `changes`, y `updateUser` conserva el valor guardado. El
cliente no valida el nombre ni el email. Si lo lanzado no es un
`Error` con un mensaje de la tabla de abajo, responde 500 con el
`Could not` de esa acción. No inventa un mensaje.

Las clases de Nest quedan en el módulo y en el controlador. El
controlador llama a `src/logic/`. No hay otra clase. La constitución
y el estilo dicen que este cliente las usa ahí, y que este cliente
es el que pasa por Babel. El resto de la app sigue sin ellas y sin
Babel.

`src/clients/nest/.babelrc.json` es el del ejemplo de Babel de Nest.
`@babel/preset-env` va con `targets.node` en `current` y `modules` en
false. `@babel/plugin-proposal-decorators` va con `version` en
`legacy`. Esas versiones son las últimas de npm y las del ejemplo:
`@babel/cli@8.1.0`, `@babel/core@8.1.0`,
`@babel/plugin-proposal-decorators@8.0.2` y `@babel/preset-env@8.0.7`.

La salida queda en `src/clients/nest-run`, al lado de `nest/` y a la
misma profundidad. El fichero compilado conserva
`import ... from "../../logic/..."`, así que sigue llegando a
`src/logic/`. Se compiló una muestra con estas versiones: el
decorador sale del fuente y el import queda. `nest-run` se genera.
`.gitignore` lo ignora. ESLint también.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista. Si no hay usuarios, la lista es `[]`.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` cambia. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` con un mensaje de la tabla de abajo,
el cuerpo es JSON con la clave `message` y ese texto.

## Ficheros

Se crean:

- `src/clients/nest/main.js`
- `src/clients/nest/app.module.js`
- `src/clients/nest/users.controller.js`
- `src/clients/nest/.babelrc.json`
- `.gitignore`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `eslint.config.js`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`package.json` añade en `dependencies` los cinco paquetes de Nest de
abajo y en `devDependencies` los cuatro de Babel. El script `nest`
es `babel src/clients/nest --out-dir src/clients/nest-run && node src/clients/nest-run/main.js`.
El script `format` sigue siendo `prettier --write .`. No se cambia su
glob.

`.gitignore` ignora `src/clients/nest-run/`.

`eslint.config.js` ignora `src/clients/nest-run/**`.

`docs/tree.md` añade `nest/` dentro de `clients/`, con `.babelrc.json`,
`main.js`, `app.module.js` y `users.controller.js`. No lista
`nest-run/`.

`docs/ARCHITECTURE.md` dice que `src/clients/nest/` llama a
`src/logic/`, escucha en el puerto 3003 y no repite sus reglas. Las
clases quedan en el módulo y en el controlador. `pnpm nest` lo
compila con Babel a `src/clients/nest-run` y arranca ese `main.js`.
No sustituye a `src/db/server.js` ni al cliente HTTP.

`docs/style.md` añade el comando `pnpm nest`. Ese cliente escucha en
`127.0.0.1:3003`. Dice que este cliente usa una clase de módulo y
una de controlador, y que es el que pasa por Babel.

`docs/CONSTITUTIONS.md` dice, en la sección 1, que también se crea,
se lista, se ve, se cambia y se borra un usuario con el cliente Nest,
en el puerto 3003, que ese cliente pasa por Babel, y que la base
sigue en el puerto 3000. En la sección 7 dice que este cambio añade
el cliente Nest, que es el que pasa por Babel, y no añade un `.txt`.
`AGENTS.md` no cambia: el `.txt` sigue siendo el cliente de una
funcionalidad nueva, y esta no lo es.

`docs/errors.md` no cambia. Los mensajes de la tabla ya están.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal,
Jupyter, `src/clients/web/`, `src/clients/http/`,
`src/clients/chrome/`, `src/clients/electron/` ni
`src/clients/vscode/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     | Estado |
| ----------------------------------------- | --------------------------- | ------ |
| El nombre queda vacío                     | `Name is empty`             | 400    |
| El email no vale                          | `Email is invalid`          | 400    |
| El email es el de otro usuario            | `Email is already used`     | 409    |
| El id no es un entero mayor o igual que 1 | `Invalid id`                | 400    |
| Ese usuario no está                       | `User not found`            | 404    |
| No se llega a la base al crear            | `Could not create the user` | 500    |
| No se llega al listar                     | `Could not list the users`  | 500    |
| No se llega al ver uno                    | `Could not find the user`   | 500    |
| No se llega al cambiar                    | `Could not update the user` | 500    |
| No se llega al borrar                     | `Could not delete the user` | 500    |

La lista vacía no es un fallo.

## Socket

Hay paquetes nuevos. Aún no están instalados. El árbol es el que
resolvió npm para esas versiones y sus rangos, hasta 3 capas. Si
`pnpm` resuelve otra versión dentro de un rango, esa versión no es
la de este resumen y hay que volver a pasarla por Socket.

`express@5.3.0` no cambia de versión. Tampoco cambian los paquetes
de su árbol que ya están en `pnpm-lock.yaml` en la misma versión,
entre ellos `path-to-regexp@8.4.2`, `type-is@2.1.0` y `vary@1.1.2`.
Esos quedan fuera de este chequeo. Su resumen está en el plan del
cliente HTTP.

Entran los paquetes nuevos:

- `@nestjs/common@12.3.3`
- `@nestjs/core@12.3.3`
- `@nestjs/platform-express@12.3.3`
- `reflect-metadata@0.2.2`
- `rxjs@7.8.2`
- `@babel/cli@8.1.0`
- `@babel/core@8.1.0`
- `@babel/plugin-proposal-decorators@8.0.2`
- `@babel/preset-env@8.0.7`
- y los de su árbol, hasta 3 capas, que no estaban ya en esa versión

Tres datos. Cada uno dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Ninguna está
por debajo de 50. La más baja es maintenance 50, en
`object-assign@4.1.1`. 50 no baja.

La alerta sale de `alerts`, con `org_slug` `socket-dev-neoland`, que
es el que devolvió `organizations`. Se pidió la lista abierta, sin
filtrar por paquete. `items` llegó vacío y `endCursor` llegó nulo.
La misma lista vacía salió al filtrar por `npm`. Una lista vacía es
la lista de la organización. No dice que estas versiones no tengan
alerta.

La campaña sale de `threat_feed` para `@nestjs/core@12.3.3` y para
`@babel/core@8.1.0`, con ese mismo `org_slug`. Las dos respondieron
403 `threat_feed_not_entitled`: la organización no tiene threat
feed. No hay dato de campaña. El rechazo es de la organización, así
que tampoco hay dato de campaña para el resto del árbol.

Se pidió `append-field@1.0.0`, que es la versión que resolvió npm.
`depscore` devolvió las stats de `append-field@2.0.0`. No hay stat
de la `1.0.0`.

- `@borewit/text-codec@0.2.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 95, supplyChain 100, vulnerability 100.
- `@lukeed/csprng@1.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 87, supplyChain 100, vulnerability 100.
- `@nestjs/common@12.3.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100.
- `@nestjs/core@12.3.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 100, supplyChain 99, vulnerability 100.
- `@nestjs/platform-express@12.3.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100.
- `@standard-schema/spec@1.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 99, supplyChain 100, vulnerability 100.
- `@tokenizer/inflate@0.6.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 99, supplyChain 99, vulnerability 100.
- `@tokenizer/token@0.3.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 64, supplyChain 100, vulnerability 100.
- `append-field@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. `depscore` no devolvió esta versión: devolvió la `2.0.0`, con license 100, maintenance 79, quality 82, supplyChain 100, vulnerability 100.
- `busboy@1.6.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 100, supplyChain 100, vulnerability 100.
- `cors@2.8.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100.
- `fast-safe-stringify@2.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100.
- `file-type@22.3.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 100, supplyChain 99, vulnerability 100.
- `ieee754@1.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 82, supplyChain 100, vulnerability 100.
- `iterare@1.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100.
- `load-esm@1.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 95, supplyChain 100, vulnerability 100.
- `multer@2.5.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 100, supplyChain 99, vulnerability 100.
- `object-assign@4.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 50, quality 85, supplyChain 67, vulnerability 100.
- `reflect-metadata@0.2.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 80, maintenance 80, quality 99, supplyChain 100, vulnerability 100.
- `rxjs@7.8.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 100, supplyChain 99, vulnerability 100.
- `streamsearch@1.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 98, supplyChain 100, vulnerability 100.
- `strtok3@10.7.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100.
- `token-types@6.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100.
- `tslib@2.9.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 100, supplyChain 92, vulnerability 100.
- `uid@2.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100.
- `uint8array-extras@1.6.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100.

- `@babel/cli@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 75, supplyChain 99, vulnerability 100.
- `@babel/code-frame@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 73, supplyChain 100, vulnerability 100.
- `@babel/compat-data@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 75, supplyChain 100, vulnerability 100.
- `@babel/core@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 78, supplyChain 98, vulnerability 100.
- `@babel/generator@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 78, supplyChain 99, vulnerability 100.
- `@babel/helper-annotate-as-pure@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 64, supplyChain 100, vulnerability 100.
- `@babel/helper-compilation-targets@8.0.7`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 94, quality 74, supplyChain 99, vulnerability 100.
- `@babel/helper-create-class-features-plugin@8.0.10`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 77, supplyChain 99, vulnerability 100.
- `@babel/helper-create-regexp-features-plugin@8.0.7`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 94, quality 72, supplyChain 100, vulnerability 100.
- `@babel/helper-define-polyfill-provider@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 76, supplyChain 99, vulnerability 100.
- `@babel/helper-globals@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 75, supplyChain 100, vulnerability 100.
- `@babel/helper-member-expression-to-functions@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 74, supplyChain 100, vulnerability 100.
- `@babel/helper-module-imports@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 75, supplyChain 99, vulnerability 100.
- `@babel/helper-module-transforms@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 76, supplyChain 99, vulnerability 100.
- `@babel/helper-optimise-call-expression@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 68, supplyChain 100, vulnerability 100.
- `@babel/helper-plugin-utils@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/helper-remap-async-to-generator@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 99, vulnerability 100.
- `@babel/helper-replace-supers@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 73, supplyChain 100, vulnerability 100.
- `@babel/helper-skip-transparent-expression-wrappers@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100.
- `@babel/helper-string-parser@8.0.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 94, quality 74, supplyChain 100, vulnerability 100.
- `@babel/helper-validator-identifier@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 72, supplyChain 100, vulnerability 100.
- `@babel/helper-validator-option@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 71, supplyChain 100, vulnerability 100.
- `@babel/helper-wrap-function@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 72, supplyChain 100, vulnerability 100.
- `@babel/helpers@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 76, supplyChain 99, vulnerability 100.
- `@babel/parser@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 98, quality 80, supplyChain 100, vulnerability 100.
- `@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 68, supplyChain 100, vulnerability 100.
- `@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 68, supplyChain 100, vulnerability 100.
- `@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 99, vulnerability 100.
- `@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 72, supplyChain 100, vulnerability 100.
- `@babel/plugin-proposal-decorators@8.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 73, supplyChain 99, vulnerability 100.
- `@babel/plugin-syntax-decorators@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 67, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-arrow-functions@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-async-generator-functions@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-async-to-generator@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-block-scoped-functions@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-block-scoping@8.0.10`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 75, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-class-properties@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 64, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-class-static-block@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 72, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-classes@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 75, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-computed-properties@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 72, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-destructuring@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 75, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-dotall-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 62, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-duplicate-keys@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-dynamic-import@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 67, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-explicit-resource-management@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-exponentiation-operator@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-export-namespace-from@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-for-of@8.0.7`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 72, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-function-name@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-json-strings@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-literals@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-logical-assignment-operators@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-member-expression-literals@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-modules-amd@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-modules-commonjs@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 73, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-modules-systemjs@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 74, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-modules-umd@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-named-capturing-groups-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-new-target@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-nullish-coalescing-operator@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-numeric-separator@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-object-rest-spread@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 75, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-object-super@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-optional-catch-binding@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-optional-chaining@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 73, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-parameters@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 75, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-private-methods@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-private-property-in-object@8.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-property-literals@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-regenerator@8.0.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 76, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-regexp-modifiers@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 62, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-reserved-words@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 64, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-shorthand-properties@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-spread@8.0.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 72, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-sticky-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-template-literals@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 71, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-typeof-symbol@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 69, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-unicode-escapes@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 71, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-unicode-property-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 65, supplyChain 100, vulnerability 100.
- `@babel/plugin-transform-unicode-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 62, supplyChain 99, vulnerability 100.
- `@babel/plugin-transform-unicode-sets-regex@8.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 62, supplyChain 99, vulnerability 100.
- `@babel/preset-env@8.0.7`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 75, supplyChain 96, vulnerability 100.
- `@babel/preset-modules@0.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 99, supplyChain 99, vulnerability 100.
- `@babel/template@8.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 75, supplyChain 100, vulnerability 100.
- `@babel/traverse@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 79, supplyChain 99, vulnerability 100.
- `@babel/types@8.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 80, supplyChain 100, vulnerability 100.
- `@isaacs/nonrecursive-glob-match@1.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100.
- `@jridgewell/gen-mapping@0.4.0-beta.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 100, supplyChain 100, vulnerability 100.
- `@jridgewell/resolve-uri@3.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 81, supplyChain 100, vulnerability 100.
- `@jridgewell/sourcemap-codec@1.6.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `@jridgewell/trace-mapping@0.3.31`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 100, supplyChain 100, vulnerability 100.
- `@types/gensync@1.0.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 70, supplyChain 100, vulnerability 100.
- `@types/jsesc@2.5.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 69, supplyChain 100, vulnerability 100.
- `babel-plugin-polyfill-corejs3@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 93, supplyChain 99, vulnerability 100.
- `baseline-browser-mapping@2.11.35`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 99, supplyChain 99, vulnerability 100.
- `brace-expansion@5.0.12`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100.
- `browserslist@4.29.5`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 90, supplyChain 98, vulnerability 100.
- `caniuse-lite@1.0.30001820`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 74, supplyChain 100, vulnerability 100.
- `chokidar@5.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 99, vulnerability 100.
- `commander@14.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100.
- `convert-source-map@2.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `core-js-compat@3.51.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 100, supplyChain 100, vulnerability 100.
- `electron-to-chromium@1.5.473`. Campaña: `threat_feed` para esta versión respondió 403 `threat_feed_not_entitled`. Alerta: la lista abierta de la organización salió vacía. `pnpm` resolvió `1.5.473` y no la `1.5.476` del árbol de npm. `depscore` no contestó: 429, cuota insuficiente. No hay stat de esta versión.
- `empathic@2.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 93, supplyChain 100, vulnerability 100.
- `esutils@2.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100.
- `flru@1.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `gensync@1.0.0-beta.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100.
- `glob@14.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 99, supplyChain 98, vulnerability 100.
- `import-meta-resolve@4.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100.
- `js-tokens@10.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 72, supplyChain 100, vulnerability 100.
- `jsesc@3.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 100, supplyChain 100, vulnerability 100.
- `json5@2.2.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `lodash.debounce@4.0.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 74, supplyChain 100, vulnerability 100.
- `lru-cache@11.5.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 99, supplyChain 99, vulnerability 100.
- `minimatch@11.0.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 100, supplyChain 99, vulnerability 100.
- `minipass@7.1.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 100, supplyChain 100, vulnerability 100.
- `node-releases@2.0.63`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 81, supplyChain 100, vulnerability 100.
- `obug@3.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 100, supplyChain 100, vulnerability 100.
- `path-scurry@3.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100.
- `readdirp@5.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100.
- `regexpu-core@6.5.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 100, supplyChain 99, vulnerability 100.
- `slash@5.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 72, supplyChain 100, vulnerability 100.
- `update-browserslist-db@1.3.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 82, supplyChain 99, vulnerability 100.
- `verkit@0.5.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100.

## Respuesta

La persona respondió que sí. Este cliente se arranca con Babel. La
constitución y el estilo dicen que este cliente es el que pasa por
Babel. Hay `tasks.md`. No hay código hasta que se pidan las tareas.
