# Plan de Swagger UI en NestJS

Issue: #1090

Estado: spec, plan y tareas aprobados por la persona el 5 de noviembre
de 2026. Autorizadas la instalación, la implementación y las comprobaciones
para dejar Swagger UI funcionando. Implementación y comprobaciones
completadas. Commit local autorizado para la #1090; push y cambios en la PR
requieren una autorización adicional.

## Base comprobada

`staging` se adelantó con `tools/pull-changes.sh` a `e54f9edc`, desde
`origin/staging`. La integración de la #1055 se comprobó antes de abrir
la rama: `01a13feb` es ancestro de la rama remota actualizada.
La rama de esta tarea es `1090-feat-nest-swagger-ui`.

La referencia técnica local es `src/clients/nest/`: `main.js` crea la app,
`users-controller.js` usa `@Controller("users")`, y el servicio llama a
las operaciones existentes de `logic/`. Los imports son ESM con nombres
de archivo en kebab-case. Se mantiene la excepción de clases y
decoradores de `docs/STYLE.md`.

## Solución

Añadir `@nestjs/swagger` fijado en `12.1.0` a `dependencies` y actualizar
`pnpm-lock.yaml`. Antes de `app.listen`, `main.js` construirá un documento
con `DocumentBuilder`, título `Users`, versión `0.0.0`, y lo publicará
mediante `SwaggerModule.createDocument` y `SwaggerModule.setup("", app,
document)`. La página estará en `/` sobre el mismo origen de la API.
Se conservan `ORIGIN`, `http://127.0.0.1:3003`, el mensaje de arranque y
el script `nest` que limpia dist y compila con Babel.

En `users-controller.js` se añadirán únicamente metadatos de Swagger:

- `ApiBody` en POST: objeto con `name` y `email` de tipo string y ambos
  obligatorios; ejemplos Ana y ana@example.com.
- `ApiBody` en PATCH: objeto con `name` y `email` de tipo string, ambos
  opcionales; el ejemplo enviará solo el nombre para mostrar la omisión
  del email.
- `ApiParam` en GET por id, PATCH y DELETE: `name: "id"`, obligatorio,
  schema string y ejemplo `"1"`.

Son metadatos de documentación, sin validadores nuevos. Se mantienen
`@Controller("users")`, los decoradores de rutas actuales, `@Bind`,
`@HttpCode` y los cuerpos de los métodos. No se copia otra estructura
de controlador ni se cambia el filtro para servir la página.

| Operación | Ruta actual | Éxito |
| --- | --- | --- |
| Crear | POST /users | 201, usuario |
| Listar | GET /users | 200, lista |
| Consultar | GET /users/:id | 200, usuario |
| Modificar | PATCH /users/:id | 200, usuario actualizado |
| Borrar | DELETE /users/:id | 204, sin cuerpo |

No hay función de negocio nueva, firma nueva ni SQL nuevo. Permanecen
`createUser(input)` y `updateUser(id, changes)`, así como las demás
operaciones actuales. No se necesita un cliente terminal nuevo para
esta página de un cliente existente.

## Archivos previstos

- `package.json` y `pnpm-lock.yaml`: dependencia exacta y árbol resuelto.
- `src/clients/nest/main.js`: publicación de Swagger UI.
- `src/clients/nest/users-controller.js`: cuerpos e ids en el documento.
- `README.md`: acceso a la página y secuencia de uso en Windows.
- `docs/ARCHITECTURE.md`: página en el cliente NestJS existente.

No se crean ni eliminan archivos de código. `docs/TREE.md` ya recoge
estos archivos y `docs/specs/<nombre>/`; no requiere cambio estructural.
No se modifican lógica, consultas, servicio, módulo, filtro, datos ni
otros clientes. `docs/STYLE.md` y `docs/ERRORS.md` siguen vigentes.

## Errores preservados

El filtro actual entrega JSON `{ message }` para errores de operación:
400 para `Name is empty` y `Email is invalid`; 409 para
`Email is already used`; 404 para `User not found`; 500 para
`Could not create the user`, `Could not list the users`,
`Could not find the user`, `Could not update the user` y
`Could not delete the user`.

La página mostrará esas respuestas. Se conserva la diferencia ya
aceptada de la #1055: PATCH o DELETE en `/users/1/extra` con JSON inválido
pueden devolver 500 con el mensaje de la operación. No se intenta
normalizar ese caso a 404. GET `/` pasa a servir Swagger UI como cambio
solicitado; las rutas desconocidas conservan el filtro existente.

## Dependencias y Socket

Consulta realizada el 5 de noviembre de 2026. Los manifiestos publicados
en el registro npm confirman este árbol nuevo hasta tres capas:

- Capa 0: `@nestjs/swagger@12.1.0`.
- Capa 1: `@microsoft/tsdoc@0.17.1`, `@nestjs/mapped-types@12.0.1`,
  `es-toolkit@1.52.0`, `js-yaml@5.5.0`, `swagger-ui-dist@5.34.0`.
- Capa 2: `argparse@3.0.4` por js-yaml, `@scarf/scarf@1.4.0` por
  swagger-ui-dist. Estos dos no tienen dependencias de ejecución.

`path-to-regexp@8.4.2` y `@standard-schema/spec@1.1.0` ya existen en el
lockfile y deben conservar su versión. Los peers existentes
`@nestjs/common@12.3.3`, `@nestjs/core@12.3.3` y
`reflect-metadata@0.2.2` tampoco cambian. No se añaden los peers opcionales
TypeScript, class-validator, class-transformer ni @fastify/static.
Si la resolución introduce versiones distintas u otros paquetes nuevos,
hay que revisar esas versiones con Socket antes de aprobar su uso.

Se consultó el MCP de Socket con versiones exactas y plataforma
`win32-x64`, organización `neoland-grrl6`.

| Paquete y versión | Licencia | Mantenimiento | Calidad | Cadena de suministro | Vulnerabilidades |
| --- | --- | --- | --- | --- | --- |
| @nestjs/swagger 12.1.0 | 100 | 96 | 86 | 98 | 100 |
| @microsoft/tsdoc 0.17.1 | 100 | 87 | 89 | 100 | 100 |
| @nestjs/mapped-types 12.0.1 | 100 | 89 | 89 | 99 | 100 |
| es-toolkit 1.52.0 | 100 | 98 | 93 | 99 | 100 |
| js-yaml 5.5.0 | 100 | 92 | 86 | 100 | 100 |
| swagger-ui-dist 5.34.0 | 80 | 97 | 83 | 99 | 100 |
| argparse 3.0.4 | 100 | 89 | 97 | 100 | 100 |
| @scarf/scarf 1.4.0 | 100 | 80 | 100 | 82 | 100 |

Para cada una de estas ocho versiones: ninguna puntuación es inferior
a 50; la consulta de alertas abiertas npm de la organización devolvió
`items: []` y `endCursor: null`. Esto no acredita ausencia global de
alertas por versión. La consulta de campañas devolvió 403
`threat_feed_not_entitled`: no hay información de campañas disponible
para ninguna de ellas con esta cuenta. Se documenta como limitación
de acceso: no acredita presencia ni ausencia de campañas. La persona
aprobó el plan y pidió conservar expresamente esta limitación; no se
declaran los paquetes libres de riesgo.

El manifiesto de `@scarf/scarf@1.4.0` declara `postinstall: node ./report.js`.
Se instaló con `--ignore-scripts` y Swagger UI funciona sin ejecutar ese
script. No se modificó la configuración personal.

### Resolución comprobada el 5 de noviembre de 2026

Se completó la resolución en una carpeta temporal con copias del
manifiesto y lockfile, usando pnpm `12.14.0` y la excepción puntual
autorizada para las dos versiones existentes. El comando fue:

```powershell
corepack pnpm --dir TEMP --config.minimumReleaseAgeExclude[]=electron-to-chromium@1.5.477 --config.minimumReleaseAgeExclude[]=regexpu-core@6.5.4 install --lockfile-only --ignore-scripts --ignore-workspace
```

Terminó con salida 0 y el mensaje de que el lockfile supera las políticas.
El árbol añadió exactamente los ocho paquetes y versiones revisados en
Socket. La operación solo resolvió el lockfile: no instaló dependencias
ni ejecutó sus scripts en esa carpeta temporal.

pnpm retiró las entradas huérfanas de `regjsparser@0.13.4`, sin referencias
desde otros paquetes. Se conservan sus dos entradas originales en el
lockfile final para no eliminar paquetes existentes. No se cambian
versiones existentes ni se modifica configuración global. La comparación
final confirmó las 367 entradas anteriores exactamente intactas y las
ocho incorporaciones aprobadas.

### Instalación comprobada

Desde first-app en Windows/PowerShell se ejecutó:

```powershell
corepack pnpm --config.minimumReleaseAgeExclude[]=electron-to-chromium@1.5.477 --config.minimumReleaseAgeExclude[]=regexpu-core@6.5.4 install --frozen-lockfile --ignore-scripts
```

Terminó con salida 0: pnpm `12.14.0` aceptó las 375 entradas del lockfile
y añadió ocho paquetes. No ejecutó scripts de dependencias ni cambió la
política para otras versiones. El entorno usa Node `v24.22.0`.

## Evidencia de comprobación del 5 de noviembre de 2026

Se comprobó la implementación contra una copia desechable del servidor
SQL con base ficticia; las escrituras no utilizaron la base personal.
Las siguientes acciones se ejecutaron realmente en Swagger UI mediante
el navegador controlado con Playwright:

- Lista vacía: 200 con `[]`. Creación: 201 con los cinco campos; listado
  y consulta del id recibido: 200 con los mismos datos.
- PATCH solo nombre, solo email y ambos: 200, conservando cada campo
  omitido. Borrado: 204 sin cuerpo; consulta posterior: 404 y
  `User not found`.
- Nombre vacío: 400 y `Name is empty`; email inválido: 400 y
  `Email is invalid`; email duplicado: 409 y `Email is already used`.
- Con SQL ficticio detenido, las cinco operaciones devolvieron 500 y
  sus cinco mensajes de operación documentados.

Las comprobaciones HTTP adicionales dieron 200 para `/`, CSS, bundle y
`/-json`. El documento generado contiene las cinco operaciones actuales,
los cuerpos POST/PATCH y los tres parámetros id correctos. Express en
3001 consultó el mismo usuario durante el ciclo con respuesta 200.

`corepack pnpm format` y `corepack pnpm lint`, con las mismas dos
excepciones CLI, terminaron con salida 0. La revisión de alcance
conserva lógica, consultas, servicio, módulo, filtro y otros clientes.

El SHA-256 de `src/db/users.sqlite` personal fue idéntico antes y después
de las pruebas:
`4790457CA2412B0CC8EE8D6F7C4E066917E9954C016A311427C12703F9CE94A4`.
Al terminar se restauraron el servidor SQL personal en 3000, NestJS en
3003 y Express en 3001, activos para usar la aplicación.
Con esa base personal activa, GET `/` y GET `/users` respondieron 200;
el navegador recargó la raíz y mostró Swagger UI con su título correcto.

### Arranque para esta ocasión en Windows

En dos terminales PowerShell desde first-app:

```powershell
node src/db/server.js
```

```powershell
corepack pnpm --config.minimumReleaseAgeExclude[]=electron-to-chromium@1.5.477 --config.minimumReleaseAgeExclude[]=regexpu-core@6.5.4 nest
```

Abrir `http://127.0.0.1:3003/`. pnpm `12.14.0` vuelve a comprobar las
dependencias al ejecutar scripts mediante `verifyDepsBeforeRun`; mientras
esas dos versiones no cumplan la antigüedad mínima, los comandos de esta
ocasión, incluidos `nest`, `format` y `lint`, usan las mismas dos opciones
CLI autorizadas. La excepción no persiste ni modifica configuración.

## Estado de las aprobaciones y excepción puntual

Spec, plan y tareas aprobados; instalación e implementación autorizadas.
El 403 de Socket queda registrado como limitación de acceso por petición
expresa, sin concluir presencia ni ausencia de campañas.

La persona autoriza, solo en esta ocasión y mediante opciones CLI de la
operación, exceptuar de la antigüedad mínima las versiones existentes
`electron-to-chromium@1.5.477` y `regexpu-core@6.5.4`. No se cambia la
configuración global ni se exceptúan otras versiones o paquetes. Se
conservan las versiones existentes y la política para el resto del árbol.
La resolución aislada con ese alcance se completó y coincide con el
árbol aprobado. Si una operación posterior introduce otras versiones,
actualizar este plan y revisarlas con Socket antes de continuar.

La persona autorizó posteriormente el commit local de la #1090.
No se autoriza push ni cambios en la PR en esta etapa.
