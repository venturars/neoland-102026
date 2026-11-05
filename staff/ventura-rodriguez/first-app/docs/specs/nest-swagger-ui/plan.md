# Plan — página para consumir los usuarios

Issue: #1070.

No es una funcionalidad nueva de `logic/`. No se reemplaza ningún
fichero de `logic/`. No hay firma nueva. No hay SQL nuevo. No hay
mensaje nuevo.

La spec de la issue #978 dejó la página fuera de aquella tarea. La
issue #1070 la pide en el cliente que ya escucha en
`http://127.0.0.1:3003`. Esta spec sigue la #1070.

Hay un paquete nuevo. Entra Socket. El árbol lo resolvió pnpm 10.33.0
con `--lockfile-only`, fuera del proyecto, partiendo del lockfile
actual. No se instaló en el proyecto. Son estas versiones exactas.
`path-to-regexp` sigue en `8.4.2`. `@standard-schema/spec` sigue en
`1.1.0`. `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3` y
`reflect-metadata@0.2.2` no cambian y no se vuelven a mirar.

Los pares opcionales `typescript`, `class-validator`,
`class-transformer` y `@fastify/static` no se instalan. El cliente
sigue en JavaScript y no valida con esas librerías. El servidor sigue
siendo Express.

Si pnpm resolviera otra versión, esa versión no es la de este resumen
y hay que volver a pasarla por Socket.

El que se declara, en `dependencies`:

- `@nestjs/swagger@12.1.0`

Sus dependencias nuevas, hasta 3 capas:

- `@microsoft/tsdoc@0.17.1`
- `@nestjs/mapped-types@12.0.1`
- `es-toolkit@1.52.0`
- `js-yaml@5.5.0`
- `swagger-ui-dist@5.34.0`
- `argparse@3.0.4`, dependencia de `js-yaml@5.5.0`
- `@scarf/scarf@1.4.0`, dependencia de `swagger-ui-dist@5.34.0`

`argparse@3.0.4` y `@scarf/scarf@1.4.0` no tienen dependencias.
`@nestjs/mapped-types@12.0.1` depende de `@nestjs/common` y de
`reflect-metadata`, que no cambian. pnpm 10.33.0 ignoró el script de
instalación de `@scarf/scarf@1.4.0`. La comprobación de abajo se hizo
con ese script ignorado.

`src/clients/nest/main.js` sigue creando la app y escuchando en
`ORIGIN`. Antes de `listen`, construye el documento con
`DocumentBuilder`: título `Users`, versión `0.0.0`. Lo publica con
`SwaggerModule.setup` y el camino `""`. En `@nestjs/swagger@12.1.0`,
`validatePath` antepone `/` si el primer carácter no es `/`. El camino
vacío queda en `/`.

Fuera del proyecto, con Nest `12.3.3` y este paquete, `GET /` respondió
200 y el HTML trae el título `Swagger UI`. `GET /swagger-ui.css`
respondió 200. `GET /users` siguió respondiendo 200 y el JSON. El
documento salió en `GET /-json`. `servers` salió vacío. La página usa
el host de la petición. No se añade otro servidor.

Esa comprobación fue HTTP. No fue un clic en el navegador.

El documento no inventa el cuerpo. Un `POST` que solo usa
`@Bind(Body())` salió sin `requestBody`. Con `@ApiBody` y el schema de
abajo, `POST /users` salió con el cuerpo obligatorio, `name` y `email`
como cadenas, y los ejemplos Ada y ada@example.com.

`GET /users/:id` sin `@ApiParam` salió con `parameters` vacío. En esta
versión, `ApiParam` guarda un parámetro `in` `path` con el `name` que
recibe, y el explorer lo lee de esa metadata. No se arrancó esa
variante. El plan la usa porque sin ella el id no entra en el
documento.

`@HttpCode(201)` salió como respuesta 201. Borrar ya tiene
`@HttpCode(204)`. Se queda. El filtro se queda. No hay estado nuevo.

En `users.controller.js` las rutas no cambian.

- Crear lleva `@ApiBody`. El schema es un objeto. Hacen falta `name` y
  `email`, los dos cadenas. El ejemplo es Ada y ada@example.com.
- Modificar lleva `@ApiBody`. El schema es un objeto. `name` y `email`
  son cadenas y ninguno hace falta. El ejemplo del nombre es Ada
  Lovelace y el del email es ada@example.com.
- Ver, modificar y borrar llevan `@ApiParam`. El `name` es `id`,
  `required` es true, el schema es una cadena y el ejemplo es `1`.

La terminal sigue escribiendo `http://127.0.0.1:3003`. El script
`nest` no cambia.

## Ficheros

No se crean ficheros de código.

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `src/clients/nest/main.js`
- `src/clients/nest/users.controller.js`
- `docs/ARCHITECTURE.md`

`package.json` añade `@nestjs/swagger@12.1.0` en `dependencies`.
`pnpm-lock.yaml` guarda el árbol de arriba.

El punto de `src/clients/nest/` en `docs/ARCHITECTURE.md` queda así.
El resto de los puntos no cambia. `docs/TREE.md` no cambia: no entra
ni sale un fichero. `docs/STYLE.md` y `docs/ERRORS.md` no cambian.

```
- `src/clients/nest/` se compila con Babel, `node` arranca
  `dist/clients/nest/main.js`, llama a `src/logic/` a través de esa
  copia y abre la página en `http://127.0.0.1:3003`. No repite sus
  reglas. No sustituye a `src/clients/http/`, ni a
  `src/clients/chrome/`, ni a `src/db/server.js`.
```

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

`threat_feed` para `@nestjs/swagger@12.1.0` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

`depscore` dio las cinco stats de las ocho versiones nuevas. Ninguna
está por debajo de 50. La license más baja es 80, en
`swagger-ui-dist@5.34.0`. La maintenance más baja es 80, en
`@scarf/scarf@1.4.0`. La quality más baja es 83, en
`swagger-ui-dist@5.34.0`. La supply chain más baja es 82, en
`@scarf/scarf@1.4.0`.

`alerts` de `ai-engineering`, abiertas, de npm, filtradas por estos
ocho nombres, devolvió 5 y `endCursor` null. Las cinco son de
`js-yaml` y nombran `3.14.1`, `4.1.0` y `4.1.1`. No nombran `5.5.0`.
Eso no dice que `5.5.0` no tenga alerta. Los otros siete nombres no
salen. Una lista que no nombra una versión no dice que esa versión no
tenga alerta.

- Alta `GHSA-5p4m-2wfm-xmqj`. CPU cuadrática al resolver `!!omap` en
  js-yaml 3.x y 4.x. Versiones nombradas: `3.14.1`, `4.1.0`, `4.1.1`.
  El parche indicado es `4.3.1`.
- Alta `GHSA-52cp-r559-cp3m`. CPU cuadrática con cadenas de merge
  `<<`. Versiones nombradas: `3.14.1`, `4.1.0`, `4.1.1`. El parche
  indicado es `4.3.0`.
- Alta `GHSA-2883-xcg3-v3hh`. `maxTotalMergeKeys` no limita la CPU con
  merges vacíos. Versiones nombradas: `3.14.1`, `4.1.0`, `4.1.1`. El
  parche indicado es `3.15.2`.
- Media `GHSA-mh29-5h37-fv8m`. Contaminación de prototipo en el merge
  `<<`. Versiones nombradas: `3.14.1` y `4.1.0`. El parche indicado es
  `4.1.1`.
- Media `GHSA-h67p-54hq-rp68`. CPU cuadrática al repetir el mismo alias
  en un merge. Versiones nombradas: `3.14.1`, `4.1.0`, `4.1.1`. El
  parche indicado es `4.2.0`.

- `@microsoft/tsdoc@0.17.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 87, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@nestjs/mapped-types@12.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 89, quality 89, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@nestjs/swagger@12.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 96, quality 86, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `@scarf/scarf@1.4.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 80, quality 100, supplyChain 82, vulnerability 100. Ninguna stat por debajo de 50.
- `argparse@3.0.4`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 89, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `es-toolkit@1.52.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 100, maintenance 98, quality 93, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `js-yaml@5.5.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas nombran `3.14.1`, `4.1.0` y `4.1.1`, no `5.5.0`. `GHSA-5p4m-2wfm-xmqj`, `GHSA-52cp-r559-cp3m`, `GHSA-2883-xcg3-v3hh`, `GHSA-mh29-5h37-fv8m` y `GHSA-h67p-54hq-rp68`. Eso no dice que `5.5.0` no tenga alerta. license 100, maintenance 92, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `swagger-ui-dist@5.34.0`. Campaña: la cuenta no tiene threat feed. Alerta: las 5 alertas de este filtro no nombran esta versión. Eso no dice que no tenga alerta. license 80, maintenance 97, quality 83, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.

Quien acepta el plan decide si esas alertas, en esas otras versiones,
se aceptan.

## Decisión

No queda una pregunta abierta. Las tareas se escriben cuando una
persona haya leído esta spec y este plan.
