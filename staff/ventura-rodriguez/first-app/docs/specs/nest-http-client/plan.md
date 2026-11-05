# Plan — cliente Nest de usuarios

Issue: #978.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

Hay paquetes nuevos. Entra Socket. El árbol lo resolvió pnpm 10.33.0
con el lockfile actual, sin instalarlo en el proyecto. Son estas
versiones exactas. `express` sigue en `5.3.0` y `path-to-regexp` sigue
en `8.4.2`: la versión no cambia y no se vuelven a mirar.
`mime-db@1.52.0` queda en la capa 4 y no entra. Los pares opcionales
`class-transformer`, `class-validator`, `@nestjs/microservices` y
`@nestjs/websockets` no se instalan. El cliente no valida.

Si pnpm resolviera otra versión, esa versión no es la de este resumen
y hay que volver a pasarla por Socket.

Los que se declaran, en `dependencies`:

- `@nestjs/common@12.3.3`
- `@nestjs/core@12.3.3`
- `@nestjs/platform-express@12.3.3`
- `reflect-metadata@0.2.2`
- `rxjs@7.8.2`

Los que se declaran, en `devDependencies`:

- `@babel/cli@8.1.0`
- `@babel/core@8.1.0`
- `@babel/eslint-parser@8.0.7`
- `@babel/plugin-proposal-decorators@8.0.2`
- `@babel/preset-env@8.0.7`

Son las versiones del ejemplo JavaScript de Nest,
`sample/09-babel-example`, salvo Nest, que aquí va en `12.3.3`. No
entra `@babel/node`: en Node 26.9.0 no transforma un fichero ESM y
`node` sigue viendo `@`.

El cliente llama a las funciones que ya existen y devuelve su
resultado. Las llamadas son las de `src/clients/http/app.js`. La forma
es la de ese ejemplo: clases con `@Module`, `@Controller`,
`@Injectable`, `@Get`, `@Post`, `@Patch`, `@Delete`, `@Catch` y
`@HttpCode`. La inyección es `@Dependencies(UsersService)`. El cuerpo
y el id entran con `@Bind(Body())` y `@Bind(Param("id"))`. No hay
TypeScript que escriba `design:paramtypes`.

Crear llama a `createUser({ name, email })`. Listar llama a
`listUsers()`. Ver uno llama a `findUserById(id)`. Modificar llama a
`updateUser(id, changes)`. Borrar llama a `deleteUser(id)`. El `id` es
el texto de la ruta. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con el comando que ya existe. Este cliente escucha en
`http://127.0.0.1:3003`. La constante es `ORIGIN`. `package.json` tiene
el script `nest`: `rm -rf dist && babel src -d dist --config-file ./babel.config.json && node dist/clients/nest/main.js`.

`babel.config.json` está en la raíz de `first-app`, al lado de
`eslint.config.js`. El script se lo pasa con `--config-file`. El
preset es
`@babel/preset-env` con `targets.node` `current` y `modules` `false`.
El plugin es `@babel/plugin-proposal-decorators` con `version`
`legacy`.

El script compila todo `src` a `dist`. El cliente importa
`../../logic/`. Desde `dist/clients/nest` ese camino es `dist/logic`.
Compilar solo el cliente dejaría ese import sin fichero. Fuera del
proyecto, con Nest `12.3.3` y estos paquetes de Babel, `GET /users`
respondió 200 y `POST /users` respondió 201, y el cuerpo llegó a la
función de logic. La copia que Babel hace de `create-user.js` conserva
las comprobaciones y las llamadas. Quita líneas en blanco y la coma
final. Los otros scripts siguen ejecutando `src/`.

Nest lee el cuerpo JSON. Crear y modificar leen `name` y `email`. Si
un campo no viene, no entra en `changes`, y `updateUser` conserva el
valor guardado. El cliente no valida. Si lo lanzado no es un `Error`
con un mensaje de la lista, responde 500 con el `Could not` de esa
acción. No inventa un mensaje.

Hay un módulo, un controlador, un servicio y un filtro. El servicio
llama a `logic/`. El controlador expone las rutas. El filtro traduce
el mensaje de la lista al estado. Otra ruta responde 404 y un cuerpo
vacío, no el JSON que Nest pondría por su cuenta. No hay mensaje
nuevo.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

## Ficheros

Se crean:

- `babel.config.json`
- `src/clients/nest/main.js`
- `src/clients/nest/app.module.js`
- `src/clients/nest/users.controller.js`
- `src/clients/nest/users.service.js`
- `src/clients/nest/http-exception.filter.js`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `eslint.config.js`
- `.gitignore`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/STYLE.md`
- `docs/ERRORS.md`

`package.json` añade los paquetes de arriba y el script `nest`. El
script `format` también incluye `src/clients/nest/**/*.js`.
`eslint.config.js` usa `@babel/eslint-parser` en
`src/clients/nest/**/*.js`, con `configFile`
`babel.config.json`, y deja las reglas recomendadas.
ESLint, con el parser de ahora, para en `@`. Con
`@babel/eslint-parser` ese fichero pasa el parseo. `dist/` queda fuera
de ESLint. `.gitignore`
ignora `dist/` en cualquier carpeta. `dist/` no se
commitea.

En el árbol, `first-app/` incluye `babel.config.json` al lado de
`eslint.config.js` y `clients/` incluye `nest/` con esos cinco
ficheros. `dist/` no entra en el árbol.
En la arquitectura, ese cliente se compila con Babel, `node` arranca
`dist/clients/nest/main.js`, llama a `src/logic/` a través de esa
copia, escucha en el puerto 3003 y no repite sus reglas. Usa la forma
de Nest. No sustituye a `src/clients/http/`, ni a `src/clients/chrome/`,
ni a `src/db/server.js`.

`docs/STYLE.md` avisa de que `src/clients/nest/` se aparta de esa
guía: hay clases, métodos, `this`, decoradores y nombres de fichero
con punto. El resto de la app no. `docs/ERRORS.md` avisa de que ese
cliente traduce los mensajes de la lista con una clase filtro. No
añade mensajes ni códigos. `logic/` sigue con `throw new Error`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     | Estado |
| --------------------------------- | --------------------------- | ------ |
| El nombre queda vacío             | `Name is empty`             | 400    |
| El email no vale                  | `Email is invalid`          | 400    |
| El email es de otro usuario       | `Email is already used`     | 409    |
| El usuario no está                | `User not found`            | 404    |
| No se llega a la base al crear    | `Could not create the user` | 500    |
| No se llega al listar             | `Could not list the users`  | 500    |
| No se llega al ver uno           | `Could not find the user`   | 500    |
| No se llega al modificar          | `Could not update the user` | 500    |
| No se llega al borrar             | `Could not delete the user` | 500    |

## Socket

`threat_feed` para `@nestjs/core@12.3.3` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

`depscore` dio las cinco stats de las versiones de abajo, salvo
`append-field@1.0.0`. Ninguna stat devuelta está por debajo de 50. La
más baja es maintenance 50, en `object-assign@4.1.1`. 50 no baja.

La lista de alertas npm abiertas de `ai-engineering` no está vacía.
Se leyeron las primeras 500 y la lista sigue. En esas 500, el único
nombre de este árbol que aparece es `busboy`, y es `@fastify/busboy`,
no el `busboy@1.6.0` de este plan. Una lista filtrada vacía no dice
que esa versión no tenga alerta. Tampoco lo dice no haber salido en
las primeras 500.

`depscore` de `append-field`, pedido como `1.0.0`, respondió dos veces
`append-field@2.0.0`: license 100, maintenance 79, quality 82,
supplyChain 100, vulnerability 100. Esas stats no son las de `1.0.0`.

- `@borewit/text-codec@0.2.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 87, quality 95, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@lukeed/csprng@1.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 79, quality 87, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@nestjs/common@12.3.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@nestjs/core@12.3.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 95, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@nestjs/platform-express@12.3.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@standard-schema/spec@1.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 82, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@tokenizer/inflate@0.6.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 90, quality 99, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@tokenizer/token@0.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 64, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `append-field@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. Stats: `depscore` no devolvió esta versión.
- `busboy@1.6.0`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `@fastify/busboy` `2.1.1` y `3.1.1`, no esta versión. license 100, maintenance 80, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cors@2.8.6`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-safe-stringify@2.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `file-type@22.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 91, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ieee754@1.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `iterare@1.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `load-esm@1.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 79, quality 95, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `media-typer@0.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 84, quality 93, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `mime-types@2.1.35`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 85, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `multer@2.5.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 92, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `object-assign@4.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 50, quality 85, supplyChain 67, vulnerability 100. Ninguna stat por debajo de 50.
- `reflect-metadata@0.2.2`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 80, maintenance 80, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `rxjs@7.8.2`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 88, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `streamsearch@1.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 79, quality 98, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `strtok3@10.7.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `token-types@6.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `tslib@2.9.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 91, quality 100, supplyChain 92, vulnerability 100. Ninguna stat por debajo de 50.
- `type-is@1.6.18`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 87, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `uid@2.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `uint8array-extras@1.6.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.

Quien acepta el plan decide si esas alertas, en esas otras versiones,
se aceptan. También decide el dato que falta de `append-field@1.0.0`.

## Socket de Babel

El árbol de Babel son 126 paquetes nuevos, hasta 3 capas, sin los que
ya estaban en el lock ni los de Nest ya resumidos arriba.
`@babel/eslint-parser` depende de `eslint@10.13.0`. Esa versión no
cambia y su árbol no se vuelve a mirar.

`threat_feed` sigue en 403 `threat_feed_not_entitled`. La cuenta no
tiene threat feed.

`depscore` contestó los primeros 42. Ninguna stat de esos 42 baja de
50. La quality más baja de ese lote es 64, en
`@babel/helper-annotate-as-pure@8.0.0` y
`@babel/plugin-transform-class-properties@8.0.1`. Un segundo
`depscore`, con los 42 siguientes, respondió 429: cuota insuficiente,
pide 100 y el token tenía 36.

`alerts` contestó la lista npm abierta de la organización: 500 y
luego 42, sin página siguiente. Son 542. Una lista que no nombra una
versión no dice que esa versión no tenga alerta.

En esas 542, `@babel/core` aparece en `7.27.3`, alerta baja
`GHSA-4x5r-pxfx-6jf8` (lectura de fichero vía `sourceMappingURL`). No
nombra `8.1.0`. `@babel/plugin-transform-modules-systemjs` aparece en
`7.27.1`, alerta alta `GHSA-fv7c-fp4j-7gwp` (código arbitrario al
compilar una entrada maliciosa). No nombra `8.1.0`. `browserslist`
aparece en `4.24.5`, dos alertas altas: `GHSA-c83g-rgw3-j3cx` (memoria
sin límite) y `GHSA-73wf-gq98-2v4g` (escritura de prototipo vía
`browserslist-stats.json`). No nombran `4.29.5`. `glob` aparece en
`7.2.3`, `8.1.0`, `9.3.5`, `10.3.10`, `10.4.5` y `10.5.0`: alerta alta
`GHSA-5j98-mcp5-4vw2` en `10.3.10` y `10.4.5` (el CLI ejecuta con
`shell:true`) y deprecación del mantenedor en esas seis. No nombran
`14.0.3`. `minimatch` aparece en `3.1.2`, `5.1.6`, `8.0.4`, `9.0.1`,
`9.0.3`, `9.0.5` y `10.2.6`. Las altas son `GHSA-3ppc-4f35-3m26`,
`GHSA-23c5-xmqv-rm74` y `GHSA-7r86-cg39-jmmj` en las seis primeras. La
media es `GHSA-g3hv-75wg-m249` en `10.2.6`. No nombran `11.0.4`.
`eslint` aparece en `8.56.0`, deprecado por el mantenedor. No nombra
`10.13.0`. Su árbol no se vuelve a mirar.

El resto de nombres de este árbol no aparecen en esas 542. Quien
acepta el plan decide si esas alertas, en esas otras versiones, se
aceptan.

- `@babel/cli@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 95, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/code-frame@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 90, quality 73, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/compat-data@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 90, quality 75, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/core@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas nombran `7.27.3`, no `8.1.0`. `GHSA-4x5r-pxfx-6jf8`. Eso no dice que `8.1.0` no tenga alerta. license 100, maintenance 97, quality 78, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/eslint-parser@8.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 97, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/generator@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 96, quality 78, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-annotate-as-pure@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 64, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-compilation-targets@8.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 94, quality 74, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-create-class-features-plugin@8.0.10`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 96, quality 77, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-create-regexp-features-plugin@8.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 94, quality 72, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-define-polyfill-provider@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 87, quality 76, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-globals@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 89, quality 75, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-member-expression-to-functions@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 90, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-module-imports@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-module-transforms@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 91, quality 76, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-optimise-call-expression@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-plugin-utils@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-remap-async-to-generator@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-replace-supers@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 73, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-skip-transparent-expression-wrappers@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 66, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-string-parser@8.0.8`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 94, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-validator-identifier@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 90, quality 72, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-validator-option@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 71, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helper-wrap-function@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 72, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/helpers@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 97, quality 76, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/parser@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 98, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 91, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 72, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-proposal-decorators@8.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 89, quality 73, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-syntax-decorators@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 67, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-arrow-functions@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 66, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-async-generator-functions@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 93, quality 72, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-async-to-generator@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 69, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-block-scoped-functions@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-block-scoping@8.0.10`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 96, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-class-properties@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 88, quality 64, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-class-static-block@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 90, quality 72, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@babel/plugin-transform-classes@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 96, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.

- `@babel/plugin-transform-computed-properties@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-destructuring@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-dotall-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-duplicate-keys@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-dynamic-import@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-explicit-resource-management@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-exponentiation-operator@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-export-namespace-from@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-for-of@8.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-function-name@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-json-strings@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-literals@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-logical-assignment-operators@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-member-expression-literals@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-modules-amd@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-modules-commonjs@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-modules-systemjs@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas nombran `7.27.1`, no `8.1.0`. `GHSA-fv7c-fp4j-7gwp`. Eso no dice que `8.1.0` no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-modules-umd@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-named-capturing-groups-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-new-target@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-nullish-coalescing-operator@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-numeric-separator@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-object-rest-spread@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-object-super@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-optional-catch-binding@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-optional-chaining@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-parameters@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-private-methods@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-private-property-in-object@8.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-property-literals@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-regenerator@8.0.6`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-regexp-modifiers@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-reserved-words@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-shorthand-properties@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-spread@8.0.8`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-sticky-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-template-literals@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-typeof-symbol@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-unicode-escapes@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-unicode-property-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-unicode-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/plugin-transform-unicode-sets-regex@8.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/preset-env@8.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/preset-modules@0.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/template@8.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/traverse@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@babel/types@8.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@isaacs/nonrecursive-glob-match@1.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@jridgewell/gen-mapping@0.4.0-beta.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@jridgewell/resolve-uri@3.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@jridgewell/sourcemap-codec@1.6.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@jridgewell/trace-mapping@0.3.31`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@types/gensync@1.0.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `@types/jsesc@2.5.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `babel-plugin-polyfill-corejs3@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `baseline-browser-mapping@2.11.35`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `browserslist@4.29.5`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas nombran `4.24.5`, no `4.29.5`. `GHSA-c83g-rgw3-j3cx` y `GHSA-73wf-gq98-2v4g`. Eso no dice que `4.29.5` no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `caniuse-lite@1.0.30001820`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `chokidar@5.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `commander@14.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `convert-source-map@2.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `core-js-compat@3.51.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `electron-to-chromium@1.5.476`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `empathic@2.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `flru@1.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `gensync@1.0.0-beta.2`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `glob@14.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas nombran `7.2.3`, `8.1.0`, `9.3.5`, `10.3.10`, `10.4.5` y `10.5.0`, no `14.0.3`. `GHSA-5j98-mcp5-4vw2` y deprecación del mantenedor. Eso no dice que `14.0.3` no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `import-meta-resolve@4.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `js-tokens@10.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `jsesc@3.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `json5@2.2.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `lodash.debounce@4.0.8`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `lru-cache@11.5.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `minimatch@11.0.4`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas nombran `3.1.2`, `5.1.6`, `8.0.4`, `9.0.1`, `9.0.3`, `9.0.5` y `10.2.6`, no `11.0.4`. `GHSA-3ppc-4f35-3m26`, `GHSA-23c5-xmqv-rm74`, `GHSA-7r86-cg39-jmmj` y `GHSA-g3hv-75wg-m249`. Eso no dice que `11.0.4` no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `minipass@7.1.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `node-releases@2.0.63`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `obug@3.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `path-scurry@3.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `readdirp@5.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `regexpu-core@6.5.3`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `slash@5.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `update-browserslist-db@1.3.4`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).
- `verkit@0.5.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 542 alertas npm abiertas no nombran esta versión. Eso no dice que no tenga alerta. Stats: `depscore` respondió 429, cuota insuficiente (pide 100 y el token tenía 36).

Quien revisa deja las alertas fuera. `depscore` de estos 84 sigue sin
contestar: 429, pide 100 y el token tenía 38.
