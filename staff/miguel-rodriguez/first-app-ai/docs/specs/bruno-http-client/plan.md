# Plan — colección Bruno de Express

Issue: [#1159](https://github.com/venturars/neoland-102026/issues/1159).
Spec: [spec.md](spec.md), aprobada el 2026-11-06.
Estado: plan y hallazgos de Socket aprobados por Miguel el 2026-11-06.

## Recorrido

Bruno envía peticiones al Express existente en `http://127.0.0.1:3001/users`.
Express llama a la lógica compartida, que llega al servicio de datos en el puerto
3000. La colección comprueba ese recorrido mediante HTTP.

Se añade `@usebruno/cli@4.3.0` como dependencia de desarrollo exacta. Tras aprobar
esta propuesta, pnpm realiza la instalación y se coteja su resolución con la
revisada abajo. La colección usa `.bru`, pruebas con `test`/`expect`, variables
con `bru.setVar`/`bru.getVar` y el sandbox seguro por defecto.

`package.json` incorpora:

```json
"bruno": "cd src/clients/http/bruno && ../../../../node_modules/.bin/bru run 01-sql-online -r --bail"
```

El grupo offline se ejecuta desde esa misma carpeta con:

```sh
../../../../node_modules/.bin/bru run 02-sql-offline -r --bail
```

Los grupos se ejecutan por separado porque necesitan estados distintos del
servicio de datos. Los `.bru` tienen orden explícito mediante `seq`. `--bail`
detiene el recorrido ante un fallo; si la comprobación inicial no encuentra una
lista vacía, las peticiones de escritura posteriores no se ejecutan.

## Colección online

`bruno.json` identifica la colección; `collection.bru` define `baseUrl`.
Se parte de una tabla vacía. Los IDs se toman de las respuestas al crear Ada y
Grace; no se presupone que empiecen en 1. Las variables se establecen en cada
recorrido completo, sin depender de una ejecución anterior.

| Secuencia | Peticiones y comprobaciones |
| --- | --- |
| 01 | GET de lista: `200` y `[]`. |
| 02–03 | Crear Ada y Grace con emails distintos: `201`, exactamente cinco campos, valores enviados, ID numérico y fechas como cadenas. Guardar los contactos devueltos. |
| 04–05 | Listar ambos por ID ascendente y consultar Ada por su ID: `200` y coincidencia con los contactos guardados, incluidas las fechas. |
| 06 | PATCH de Ada solo con nombre: `200`, nuevo nombre, email anterior, mismo ID y `createdAt`. Guardar respuesta actualizada. |
| 07 | PATCH de Ada solo con email: `200`, nuevo email, nombre anterior, mismo ID y `createdAt`. Guardar respuesta actualizada. |
| 08 | Listar: coincide con Ada actualizada y Grace intacta. Guardar esta lista como referencia completa para los rechazos. |
| 09–20 | POST con nombre vacío, email inválido y email ocupado; PATCH de Ada con esos tres errores. Cada rechazo tiene su petición GET posterior y su comprobación de igualdad completa con la lista de referencia. |
| 21–26 | GET, PATCH y DELETE de un ID inexistente; cada `404` tiene su GET de lista posterior, igual a la referencia completa. |
| 27–28 | DELETE de Ada: `204` y cuerpo vacío. GET de lista: solo Grace, sin cambios en sus cinco campos. |
| 29–30 | DELETE de Grace: `204` y cuerpo vacío. GET de lista: `200` y `[]`. |

Para email ocupado se usa el de Grace. El ID inexistente se obtiene sumando 1 al
mayor ID de los dos contactos de la copia vacía. Las pruebas de nombre vacío usan
`" "`; las de email inválido usan `"invalid"`. Cada error comprueba el estado
exacto y el cuerpo `{ "message": "..." }` definido por Express y la spec.

Cada petición de preservación compara la lista completa mediante igualdad
profunda, incluyendo `createdAt` y `updatedAt`. Las pruebas de edición no exigen
que `updatedAt` sea distinto: dos cambios pueden ocurrir en el mismo segundo.
Los scripts son cortos y locales a cada petición; no se añade un ejecutor ni una
biblioteca de pruebas paralela a Bruno.

## Colección offline

Con Express en marcha y el servicio de datos detenido, cinco peticiones prueban
POST y GET de `/users`, y GET, PATCH y DELETE de `/users/999999`. POST y PATCH
llevan nombre y email válidos. Cada prueba exige `500` y el mensaje exacto de su
operación en la tabla de la spec. Este grupo es independiente de las variables
creadas por el grupo online.

## Archivos y documentación

Se crean:

- `src/clients/http/bruno/bruno.json` y `collection.bru`.
- `src/clients/http/bruno/01-sql-online/folder.bru` y sus 30 peticiones ordenadas.
- `src/clients/http/bruno/02-sql-offline/folder.bru` y sus cinco peticiones.
- `src/clients/http/bruno.md`, con preparación, comandos y lectura de resultados.
- Los tres documentos SDD en `docs/specs/bruno-http-client/`.

Se actualizan `package.json`, el lockfile generado por pnpm, `README.md`,
`docs/TREE.md` y la responsabilidad del cliente HTTP en `docs/ARCHITECTURE.md`.
La arquitectura explica que Bruno prueba Express por HTTP; la guía y la colección
viven junto a ese cliente, y los documentos SDD permanecen en `docs/specs/`.
El resto del código conserva sus responsabilidades y contratos.

## Verificación

1. Crear una copia temporal excluyendo bases SQLite y sus archivos auxiliares.
   Verificar que los puertos de prueba están libres antes de iniciar procesos.
2. Tras la aprobación de los hallazgos, instalar en la copia con
   `pnpm add --save-dev --save-exact @usebruno/cli@4.3.0`.
   Cotejar las tres capas resueltas con esta propuesta antes de ejecutar Bruno.
   Si cambian versiones o paquetes de esas capas, revisar las diferencias con
   Socket y volver a presentar el plan. Comprobar que las versiones directas
   existentes, incluidas las de Babel, se mantienen.
3. Arrancar `pnpm server` en la copia e inicializar explícitamente la tabla con
   `src/clients/terminal/create-users-table.txt`. Arrancar `pnpm http`.
4. Ejecutar `pnpm bruno`: todas las peticiones y aserciones online deben pasar.
   Repetir el grupo completo para comprobar que termina vacío y puede repetirse
   aunque los IDs hayan aumentado.
5. Detener solo el proceso del servicio de datos y ejecutar el grupo offline:
   cinco respuestas `500` con sus mensajes. Reiniciar ese servicio y comprobar
   que la tabla sigue vacía.
6. Introducir temporalmente en la copia una expectativa incorrecta en un `.bru`:
   el comando debe informar el fallo y terminar con código distinto de cero.
   Restaurar el archivo y repetir el grupo correspondiente correctamente.
7. Detener los procesos de Express y del servicio de datos arrancados para
   estas pruebas, y confirmar que liberaron sus puertos. Ejecutar `pnpm format`
   y después `pnpm lint`; revisar los diffs. Compilar con
   `pnpm exec babel src --out-dir dist --delete-dir-on-start` para preparar los
   archivos `dist/` que importan las pruebas de Nest. Después ejecutar
   `node --test --test-concurrency=1 tests/*.test.js` en la copia, evitando
   servicios de demostración ya activos. Si se necesitan puertos
   alternativos, ajustar únicamente la copia y registrar la correspondencia.
8. Registrar comandos y resultados reales en las tareas; detener los procesos,
   eliminar la copia y verificar que la base de trabajo no cambió.

Las pruebas `.bru` son la verificación nueva de esta entrega. Si revelan un defecto
actual de Express o incompatibilidad de la herramienta, se informa y se acuerda
el cambio necesario antes de ampliar la implementación.

## Dependencia y resolución propuesta — 2026-11-06

Fuentes: metadata exacta de [npm](https://registry.npmjs.org/@usebruno%2Fcli/4.3.0),
[documentación oficial del CLI](https://docs.usebruno.com/bru-cli/overview) y nuestro
lockfile. Se resolvió con pnpm 12.15.0, en una carpeta temporal que contenía solo
`package.json`, `pnpm-lock.yaml` y `pnpm-workspace.yaml`, añadiendo la declaración
exacta y ejecutando `pnpm install --lockfile-only --ignore-scripts`.
No se instalaron paquetes ni se ejecutaron scripts de dependencias.

La resolución añade 417 entradas de paquetes, sin eliminar ni cambiar las
existentes. Regenera snapshots con contexto de peers: 440 claves nuevas, 23
sustituidas y una entrada existente que deja de ser solo opcional (`undici`).
Estas cifras describen todo el lockfile; la revisión exigida abarca las tres
capas de Bruno que figuran abajo, no sus 417 paquetes nuevos completos.

`jscodeshift@17.4.0` declara el peer opcional `@babel/preset-env@^7.1.6`; nuestro
proyecto conserva `8.0.7`. pnpm avisa de esa incompatibilidad. El peer pertenece a
un paquete de la tercera capa; su resolución está en una capa posterior.
La ejecución real de la colección debe confirmar que el CLI funciona con esta
resolución. No se propone bajar Babel ni alterar las excepciones de antigüedad.
Los peers resueltos dentro de las tres capas están incluidos en el inventario;
no hay paquetes con restricciones de plataforma en ese inventario. Peers
opcionales no resueltos, como `bufferutil`, `utf-8-validate` y `encoding`, no se
presentan como instalados.

## Socket — fuentes, cobertura y decisión

No hay herramientas MCP de Socket expuestas en esta sesión. Se usó la API
verificada `POST /v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20`, con
los 137 purls exactos, en lotes de 50/50/37. Las 37 respuestas inicialmente
`pendingScan` se consultaron una segunda vez y quedaron completas. Se cotejaron
nombre, namespace, versión y los cinco scores de las 137 respuestas.
Los scores de la API son 0–1 y se muestran multiplicados por 100.

Se conservaron todas las alertas recibidas, incluso `ignore`, severidad baja y
avisos de sustitución. La tabla siguiente recoge tipos y cantidades sin filtrado;
los scores no sustituyen la lectura de alertas.

`GET /v0/orgs/neoland/alerts` respondió `403`, requiere `alerts:list`.
`GET /v0/orgs/neoland/threat-feed` respondió `403`, requiere `threat-feed:list`.
No se ha obtenido el inventario global de alertas ni el feed de esa organización.
**campaigns: coverage limited by the Socket plan**. No se acredita ausencia de
campañas por paquete o versión. La lista limitada del dashboard ya observada no
amplía esa cobertura.

Hallazgos que requieren decisión:

- `axios@1.18.0`: vulnerabilidad **25/100**, por debajo de 50. Las respuestas
  contienen 14 alertas altas y 10 medias de CVE (12 identificadores distintos,
  algunos repetidos), relacionadas con HTTP/2, proxies, redirecciones, URLs de
  datos y lectura de propiedades heredadas. La colección usará JSON y destinos
  loopback fijos; eso limita las funciones usadas, pero no demuestra que todos
  los avisos sean inaplicables.
- `form-data@4.0.4`: alerta alta de inyección CRLF al usar nombres de campos o
  archivos no confiables. `js-yaml@4.3.1`: alerta alta de consumo de CPU con YAML
  preparado. Ambos tienen vulnerabilidad 84/100 pese a estas alertas.
- `@faker-js/faker@9.9.0`: dos alertas altas del mismo CVE sobre ejecución de código
  con plantillas no confiables. La colección no usa Faker ni importa plantillas.
- `tslib@2.9.1` y `@usebruno/query@0.3.0`: cambio de propietario de severidad alta;
  no equivale por sí solo a una detección de malware.
- Avisos medios de CVE en `csv-parse`, `uuid` y `yaml`; avisos de ejecución dinámica,
  acceso a red, archivos, entorno y shell en dependencias del CLI. `xml2js` recibe
  un aviso heurístico `gptSecurity` sobre primitivas de ejecución; se conserva como
  hallazgo, sin dar por probado un exploit en nuestro recorrido.
- Avisos de mantenimiento, licencia no identificada en `tv4`, deprecación en
  `crypto-js` y `uuid`, y sugerencias de sustitución en varios paquetes pequeños.
  No se convierten en actualizaciones automáticas.

### Decisión — 2026-11-06

Miguel acepta `@usebruno/cli@4.3.0` con los hallazgos de esta revisión, el aviso
del peer opcional de Babel y la cobertura limitada de alertas globales y campañas.
Se mantiene la resolución propuesta, sin overrides ni cambios de Babel.

El CLI se incorpora como herramienta de desarrollo para ejecutar la colección
propia contra `127.0.0.1`, con datos desechables y sandbox seguro. Esta decisión
no declara las dependencias libres de vulnerabilidades ni acepta riesgos de
futuras versiones. La instalación y las pruebas quedan pendientes de preparar y aprobar las tareas.

Se comprobó en npm que `4.3.0` es la última versión publicada y fija
`axios@1.18.0`, `form-data@4.0.4` y `js-yaml@4.3.1`. Las versiones `4.2.0` y
`4.2.1` fijan esas mismas versiones. Una futura actualización del CLI requerirá
su propia revisión. El aviso del peer opcional se comprobará ejecutando la
colección; si impide funcionar, se informará antes de modificar la propuesta.

### Árbol y scores

SHA-256 del lockfile propuesto: `47af6952b96c3ab2454e6a0e4cee9d57a12170d88e0404d180dfa53df8796c3c`.

| Capa | Paquete exacto | Supply chain | Vulnerabilidad | Calidad | Mantenimiento | Licencia | Alertas: tipo/severidad × cantidad |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `@usebruno/cli@4.3.0` | 98 | 100 | 100 | 94 | 100 | newAuthor/low ×1; urlStrings/low ×1; gptAnomaly/low ×1 |
| 2 | `@aws-sdk/credential-providers@3.1019.0` | 98 | 100 | 100 | 97 | 100 | envVars/low ×2 |
| 2 | `@usebruno/common@0.27.0` | 99 | 100 | 76 | 92 | 100 | newAuthor/low ×1; urlStrings/low ×1; minifiedFile/low ×2; usesEval/middle ×6; gptAnomaly/low ×3 |
| 2 | `@usebruno/converters@0.25.0` | 99 | 100 | 98 | 91 | 100 | newAuthor/low ×1; urlStrings/low ×1; minifiedFile/low ×4 |
| 2 | `@usebruno/filestore@0.14.0` | 99 | 100 | 86 | 91 | 100 | newAuthor/low ×1; urlStrings/low ×1; minifiedFile/low ×2 |
| 2 | `@usebruno/js@0.55.0` | 97 | 100 | 76 | 93 | 100 | newAuthor/low ×1; urlStrings/low ×1; minifiedFile/low ×1; usesEval/middle ×1; debugAccess/low ×5; filesystemAccess/low ×3; dynamicRequire/low ×3; gptAnomaly/low ×1 |
| 2 | `@usebruno/lang@0.41.0` | 99 | 100 | 76 | 91 | 100 | newAuthor/low ×1; urlStrings/low ×1 |
| 2 | `@usebruno/requests@0.22.0` | 98 | 100 | 75 | 92 | 100 | newAuthor/low ×1; urlStrings/low ×1; gptAnomaly/low ×2 |
| 2 | `aws4-axios@3.4.0` | 99 | 100 | 100 | 80 | 100 | envVars/low ×1 |
| 2 | `axios@1.18.0` | 97 | 25 | 100 | 94 | 100 | cve/high ×14; mediumCVE/middle ×10; networkAccess/middle ×19; envVars/low ×6 |
| 2 | `axios-ntlm@1.4.6` | 99 | 100 | 92 | 80 | 100 | networkAccess/middle ×2 |
| 2 | `chai@4.5.0` | 99 | 100 | 100 | 84 | 100 | Ninguna devuelta |
| 2 | `chalk@3.0.0` | 100 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 2 | `cli-table3@0.6.5` | 100 | 100 | 100 | 81 | 100 | Ninguna devuelta |
| 2 | `csv-parse@5.6.0` | 100 | 92 | 96 | 85 | 100 | mediumCVE/middle ×2 |
| 2 | `debug@4.4.3` | 99 | 100 | 100 | 81 | 100 | envVars/low ×6 |
| 2 | `decomment@0.9.5` | 100 | 100 | 100 | 75 | 100 | unmaintained/low ×1 |
| 2 | `form-data@4.0.4` | 99 | 84 | 100 | 87 | 100 | cve/high ×1; filesystemAccess/low ×1; networkAccess/middle ×2 |
| 2 | `fs-extra@10.1.0` | 99 | 100 | 100 | 88 | 100 | gptAnomaly/low ×1; urlStrings/low ×1 |
| 2 | `http-proxy-agent@7.0.2` | 99 | 100 | 82 | 82 | 100 | networkAccess/middle ×2 |
| 2 | `https-proxy-agent@7.0.6` | 99 | 100 | 91 | 82 | 100 | networkAccess/middle ×2 |
| 2 | `iconv-lite@0.6.3` | 100 | 100 | 100 | 93 | 100 | urlStrings/low ×1 |
| 2 | `js-yaml@4.3.1` | 100 | 84 | 100 | 92 | 100 | cve/high ×1 |
| 2 | `jsesc@3.1.0` | 100 | 100 | 100 | 79 | 100 | Ninguna devuelta |
| 2 | `lodash@4.18.1` | 99 | 100 | 86 | 82 | 100 | gptAnomaly/low ×1; urlStrings/low ×2; usesEval/middle ×2 |
| 2 | `qs@6.17.1` | 99 | 100 | 100 | 96 | 100 | Ninguna devuelta |
| 2 | `socks-proxy-agent@8.0.5` | 99 | 100 | 84 | 83 | 100 | networkAccess/middle ×3 |
| 2 | `xmlbuilder@15.1.1` | 100 | 100 | 100 | 75 | 100 | unmaintained/low ×1 |
| 2 | `yargs@17.7.3` | 98 | 100 | 100 | 87 | 100 | gptAnomaly/low ×1; dynamicRequire/low ×4; envVars/low ×4; filesystemAccess/low ×2; minifiedFile/low ×1; urlStrings/low ×1 |
| 3 | `@aws-sdk/client-cognito-identity@3.1019.0` | 98 | 100 | 99 | 97 | 100 | urlStrings/low ×1; minifiedFile/low ×2 |
| 3 | `@aws-sdk/core@3.980.0` | 99 | 100 | 85 | 97 | 100 | urlStrings/low ×1 |
| 3 | `@aws-sdk/credential-provider-cognito-identity@3.972.80` | 99 | 100 | 76 | 97 | 100 | Ninguna devuelta |
| 3 | `@aws-sdk/credential-provider-env@3.972.81` | 98 | 100 | 72 | 97 | 100 | envVars/low ×12 |
| 3 | `@aws-sdk/credential-provider-http@3.972.83` | 98 | 100 | 72 | 97 | 100 | envVars/low ×8; filesystemAccess/low ×2; urlStrings/low ×1 |
| 3 | `@aws-sdk/credential-provider-ini@3.973.26` | 99 | 100 | 76 | 97 | 100 | Ninguna devuelta |
| 3 | `@aws-sdk/credential-provider-login@3.972.88` | 99 | 100 | 75 | 97 | 100 | envVars/low ×4; filesystemAccess/low ×2 |
| 3 | `@aws-sdk/credential-provider-node@3.972.93` | 98 | 100 | 100 | 97 | 100 | envVars/low ×14 |
| 3 | `@aws-sdk/credential-provider-process@3.972.81` | 99 | 100 | 74 | 97 | 100 | shellAccess/middle ×2 |
| 3 | `@aws-sdk/credential-provider-sso@3.973.25` | 99 | 100 | 76 | 97 | 100 | urlStrings/low ×1 |
| 3 | `@aws-sdk/credential-provider-web-identity@3.972.87` | 98 | 100 | 75 | 97 | 100 | envVars/low ×8; filesystemAccess/low ×2 |
| 3 | `@aws-sdk/nested-clients@3.998.0` | 99 | 100 | 78 | 97 | 100 | urlStrings/low ×1 |
| 3 | `@aws-sdk/types@3.975.0` | 100 | 100 | 72 | 93 | 100 | Ninguna devuelta |
| 3 | `@smithy/config-resolver@4.7.2` | 100 | 100 | 58 | 89 | 100 | Ninguna devuelta |
| 3 | `@smithy/core@3.39.0` | 100 | 100 | 90 | 97 | 100 | urlStrings/low ×1 |
| 3 | `@smithy/credential-provider-imds@4.5.2` | 98 | 100 | 77 | 89 | 100 | envVars/low ×14; networkAccess/middle ×2; urlStrings/low ×1 |
| 3 | `@smithy/node-config-provider@4.6.2` | 99 | 100 | 51 | 89 | 100 | trivialPackage/middle ×1 |
| 3 | `@smithy/property-provider@4.5.2` | 100 | 100 | 53 | 89 | 100 | Ninguna devuelta |
| 3 | `@smithy/types@4.20.0` | 100 | 100 | 100 | 94 | 100 | Ninguna devuelta |
| 3 | `tslib@2.9.1` | 92 | 100 | 100 | 91 | 100 | newAuthor/low ×1; unstableOwnership/high ×1 |
| 3 | `@usebruno/schema@0.31.0` | 100 | 100 | 80 | 91 | 100 | newAuthor/low ×1; urlStrings/low ×1 |
| 3 | `jscodeshift@17.4.0` | 98 | 100 | 100 | 83 | 100 | urlStrings/low ×1 |
| 3 | `mime-types@3.0.2` | 100 | 100 | 100 | 85 | 100 | Ninguna devuelta |
| 3 | `nanoid@3.3.18` | 100 | 100 | 81 | 90 | 100 | Ninguna devuelta |
| 3 | `xml2js@0.6.2` | 100 | 100 | 100 | 80 | 100 | gptSecurity/middle ×1 |
| 3 | `@types/nanoid@2.1.0` | 100 | 100 | 69 | 75 | 100 | unmaintained/low ×1 |
| 3 | `ajv@8.20.0` | 99 | 100 | 100 | 84 | 100 | gptAnomaly/low ×3; urlStrings/low ×1; usesEval/middle ×1 |
| 3 | `yaml@2.3.4` | 99 | 92 | 100 | 87 | 100 | mediumCVE/middle ×2; gptAnomaly/low ×2; envVars/low ×2 |
| 3 | `@usebruno/query@0.3.0` | 90 | 100 | 76 | 89 | 100 | minifiedFile/low ×2; newAuthor/low ×1; unstableOwnership/high ×1 |
| 3 | `ajv-formats@2.1.1` | 99 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 3 | `atob@2.1.2` | 100 | 100 | 81 | 75 | 100 | unmaintained/low ×1 |
| 3 | `btoa@1.2.1` | 100 | 100 | 74 | 75 | 100 | unmaintained/low ×1 |
| 3 | `chai-string@1.6.0` | 100 | 100 | 100 | 79 | 100 | Ninguna devuelta |
| 3 | `cheerio@1.2.0` | 99 | 100 | 100 | 82 | 100 | Ninguna devuelta |
| 3 | `crypto-js@4.2.0` | 100 | 100 | 100 | 50 | 100 | deprecated/middle ×1; gptAnomaly/low ×1 |
| 3 | `handlebars@4.7.10` | 99 | 100 | 100 | 89 | 100 | filesystemAccess/low ×1; urlStrings/low ×1 |
| 3 | `json-query@2.2.2` | 100 | 100 | 100 | 75 | 100 | unmaintained/low ×1 |
| 3 | `jsonwebtoken@9.0.3` | 99 | 100 | 100 | 80 | 100 | Ninguna devuelta |
| 3 | `moment@2.31.0` | 100 | 100 | 97 | 87 | 100 | gptAnomaly/low ×1; urlStrings/low ×1 |
| 3 | `node-fetch@2.7.0` | 94 | 100 | 100 | 84 | 100 | gptAnomaly/low ×1; networkAccess/middle ×22; urlStrings/low ×1 |
| 3 | `path@0.12.7` | 100 | 100 | 73 | 75 | 100 | unmaintained/low ×1; envVars/low ×1 |
| 3 | `quickjs-emscripten@0.32.0` | 100 | 100 | 99 | 80 | 100 | minifiedFile/low ×2 |
| 3 | `tv4@1.3.0` | 100 | 100 | 100 | 75 | 80 | unmaintained/low ×1; unidentifiedLicense/low ×1 |
| 3 | `uuid@10.0.0` | 99 | 92 | 100 | 50 | 100 | deprecated/middle ×1; mediumCVE/middle ×2; urlStrings/low ×1 |
| 3 | `xml-formatter@3.7.0` | 100 | 100 | 100 | 80 | 100 | Ninguna devuelta |
| 3 | `arcsecond@5.0.0` | 100 | 100 | 100 | 80 | 100 | Ninguna devuelta |
| 3 | `dotenv@16.6.1` | 99 | 100 | 100 | 95 | 100 | filesystemAccess/low ×1; envVars/low ×5 |
| 3 | `ohm-js@16.6.0` | 93 | 100 | 99 | 87 | 100 | urlStrings/low ×2; minifiedFile/low ×3; usesEval/middle ×26 |
| 3 | `@aws-sdk/client-secrets-manager@3.1014.0` | 98 | 100 | 99 | 97 | 100 | minifiedFile/low ×2 |
| 3 | `@azure/core-rest-pipeline@1.25.0` | 99 | 100 | 100 | 90 | 100 | Ninguna devuelta |
| 3 | `@azure/identity@4.14.1` | 93 | 100 | 100 | 96 | 100 | envVars/low ×88; filesystemAccess/low ×10; urlStrings/low ×1 |
| 3 | `@azure/keyvault-secrets@4.12.0` | 99 | 100 | 100 | 90 | 100 | urlStrings/low ×1 |
| 3 | `@faker-js/faker@9.9.0` | 99 | 78 | 88 | 85 | 80 | cve/high ×2; urlStrings/low ×1; minifiedFile/low ×80 |
| 3 | `@google-cloud/secret-manager@6.3.0` | 99 | 100 | 100 | 91 | 100 | envVars/low ×4; minifiedFile/low ×1; networkAccess/middle ×2; urlStrings/low ×1 |
| 3 | `@grpc/grpc-js@1.14.7` | 97 | 100 | 97 | 96 | 100 | envVars/low ×17; filesystemAccess/low ×2; networkAccess/middle ×17; urlStrings/low ×1 |
| 3 | `@grpc/proto-loader@0.7.15` | 99 | 100 | 100 | 83 | 100 | urlStrings/low ×1; filesystemAccess/low ×1 |
| 3 | `@smithy/node-http-handler@4.5.3` | 99 | 100 | 74 | 96 | 100 | urlStrings/low ×1; networkAccess/middle ×5 |
| 3 | `@types/qs@6.15.1` | 100 | 100 | 69 | 81 | 100 | Ninguna devuelta |
| 3 | `google-auth-library@10.5.0` | 96 | 100 | 100 | 94 | 100 | urlStrings/low ×1; networkAccess/middle ×4; filesystemAccess/low ×5; envVars/low ×28; shellAccess/middle ×2; gptAnomaly/low ×2 |
| 3 | `google-protobuf@4.0.3` | 99 | 100 | 99 | 84 | 100 | dynamicRequire/low ×2; minifiedFile/low ×1; urlStrings/low ×1; usesEval/middle ×3 |
| 3 | `grpc-js-reflection-client@1.4.3` | 99 | 100 | 100 | 92 | 100 | gptDidYouMean/middle ×1 |
| 3 | `is-ip@5.0.1` | 100 | 100 | 86 | 79 | 100 | Ninguna devuelta |
| 3 | `pac-resolver@7.0.1` | 99 | 100 | 88 | 82 | 100 | networkAccess/middle ×2 |
| 3 | `shell-env@4.0.3` | 99 | 100 | 86 | 81 | 100 | envVars/low ×4 |
| 3 | `tough-cookie@6.0.2` | 99 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 3 | `ws@8.21.3` | 98 | 100 | 100 | 92 | 100 | gptAnomaly/low ×1; envVars/low ×2; networkAccess/middle ×5 |
| 3 | `@aws-sdk/client-sts@3.1162.0` | 99 | 100 | 100 | 97 | 100 | urlStrings/low ×1 |
| 3 | `aws4@1.13.2` | 100 | 100 | 100 | 80 | 100 | envVars/low ×1 |
| 3 | `follow-redirects@1.16.2` | 100 | 100 | 100 | 88 | 100 | networkAccess/middle ×2 |
| 3 | `form-data@4.0.6` | 99 | 100 | 100 | 87 | 100 | filesystemAccess/low ×1; networkAccess/middle ×2 |
| 3 | `https-proxy-agent@5.0.1` | 99 | 100 | 100 | 82 | 100 | networkAccess/middle ×2 |
| 3 | `proxy-from-env@2.1.0` | 99 | 100 | 100 | 81 | 100 | envVars/low ×4 |
| 3 | `des.js@1.1.0` | 100 | 100 | 78 | 79 | 100 | Ninguna devuelta |
| 3 | `dev-null@0.1.1` | 100 | 100 | 77 | 75 | 100 | unmaintained/low ×1 |
| 3 | `js-md4@0.3.2` | 100 | 100 | 93 | 75 | 100 | unmaintained/low ×1 |
| 3 | `assertion-error@1.1.0` | 100 | 100 | 79 | 79 | 100 | Ninguna devuelta |
| 3 | `check-error@1.0.3` | 99 | 100 | 99 | 80 | 100 | newAuthor/low ×1 |
| 3 | `deep-eql@4.1.4` | 99 | 100 | 98 | 79 | 100 | Ninguna devuelta |
| 3 | `get-func-name@2.0.2` | 99 | 100 | 99 | 79 | 100 | Ninguna devuelta |
| 3 | `loupe@2.3.7` | 99 | 100 | 90 | 80 | 100 | newAuthor/low ×1 |
| 3 | `pathval@1.1.1` | 99 | 100 | 100 | 79 | 100 | newAuthor/low ×1 |
| 3 | `type-detect@4.1.0` | 99 | 100 | 100 | 79 | 100 | Ninguna devuelta |
| 3 | `ansi-styles@4.3.0` | 100 | 100 | 100 | 80 | 100 | Ninguna devuelta |
| 3 | `supports-color@7.2.0` | 100 | 100 | 91 | 80 | 100 | Ninguna devuelta |
| 3 | `string-width@4.2.3` | 100 | 100 | 81 | 85 | 100 | Ninguna devuelta |
| 3 | `@colors/colors@1.5.0` | 100 | 100 | 100 | 82 | 100 | envVars/low ×1 |
| 3 | `ms@2.1.3` | 100 | 100 | 86 | 84 | 100 | Ninguna devuelta |
| 3 | `esprima@4.0.1` | 99 | 100 | 86 | 75 | 100 | gptAnomaly/low ×1; unmaintained/low ×1 |
| 3 | `asynckit@0.4.0` | 100 | 100 | 100 | 80 | 100 | gptAnomaly/low ×1 |
| 3 | `combined-stream@1.0.8` | 100 | 100 | 100 | 75 | 100 | unmaintained/low ×1 |
| 3 | `es-set-tostringtag@2.1.0` | 66 | 100 | 84 | 53 | 100 | socketUpgradeAvailable/high ×1 |
| 3 | `hasown@2.0.4` | 66 | 100 | 73 | 54 | 100 | socketUpgradeAvailable/high ×1 |
| 3 | `mime-types@2.1.35` | 100 | 100 | 99 | 85 | 100 | gptAnomaly/low ×1 |
| 3 | `graceful-fs@4.2.11` | 99 | 100 | 100 | 79 | 100 | gptAnomaly/low ×1; envVars/low ×4; filesystemAccess/low ×1 |
| 3 | `jsonfile@6.2.1` | 100 | 100 | 99 | 82 | 100 | filesystemAccess/low ×1 |
| 3 | `universalify@2.0.1` | 100 | 100 | 88 | 79 | 100 | Ninguna devuelta |
| 3 | `agent-base@7.1.4` | 99 | 100 | 90 | 81 | 100 | networkAccess/middle ×5 |
| 3 | `safer-buffer@2.1.2` | 67 | 100 | 100 | 50 | 100 | unmaintained/low ×1; socketUpgradeAvailable/high ×1 |
| 3 | `argparse@2.0.1` | 100 | 100 | 96 | 89 | 100 | envVars/low ×1; filesystemAccess/low ×1 |
| 3 | `es-define-property@1.0.1` | 66 | 100 | 81 | 53 | 100 | socketUpgradeAvailable/high ×1 |
| 3 | `side-channel@1.1.1` | 66 | 100 | 87 | 53 | 100 | socketUpgradeAvailable/high ×1 |
| 3 | `socks@2.8.10` | 99 | 100 | 100 | 82 | 100 | networkAccess/middle ×2 |
| 3 | `cliui@8.0.1` | 99 | 100 | 100 | 81 | 100 | Ninguna devuelta |
| 3 | `escalade@3.2.0` | 99 | 100 | 99 | 79 | 100 | gptAnomaly/low ×2; filesystemAccess/low ×2 |
| 3 | `get-caller-file@2.0.5` | 100 | 100 | 74 | 75 | 100 | unmaintained/low ×1 |
| 3 | `require-directory@2.1.1` | 100 | 100 | 100 | 75 | 100 | dynamicRequire/low ×1; filesystemAccess/low ×1; unmaintained/low ×1 |
| 3 | `y18n@5.0.8` | 100 | 100 | 100 | 75 | 100 | filesystemAccess/low ×2; unmaintained/low ×1 |
| 3 | `yargs-parser@21.1.1` | 98 | 100 | 100 | 83 | 100 | dynamicRequire/low ×4; envVars/low ×8; filesystemAccess/low ×2; urlStrings/low ×2 |

### Relaciones dentro de las tres capas

- `@usebruno/cli@4.3.0` → `@aws-sdk/credential-providers@3.1019.0`, `@usebruno/common@0.27.0`, `@usebruno/converters@0.25.0`, `@usebruno/filestore@0.14.0`, `@usebruno/js@0.55.0`, `@usebruno/lang@0.41.0`, `@usebruno/requests@0.22.0`, `aws4-axios@3.4.0`, `axios@1.18.0`, `axios-ntlm@1.4.6`, `chai@4.5.0`, `chalk@3.0.0`, `cli-table3@0.6.5`, `csv-parse@5.6.0`, `debug@4.4.3`, `decomment@0.9.5`, `form-data@4.0.4`, `fs-extra@10.1.0`, `http-proxy-agent@7.0.2`, `https-proxy-agent@7.0.6`, `iconv-lite@0.6.3`, `js-yaml@4.3.1`, `jsesc@3.1.0`, `lodash@4.18.1`, `qs@6.17.1`, `socks-proxy-agent@8.0.5`, `xmlbuilder@15.1.1`, `yargs@17.7.3`.
- `@aws-sdk/credential-providers@3.1019.0` → `@aws-sdk/client-cognito-identity@3.1019.0`, `@aws-sdk/core@3.980.0`, `@aws-sdk/credential-provider-cognito-identity@3.972.80`, `@aws-sdk/credential-provider-env@3.972.81`, `@aws-sdk/credential-provider-http@3.972.83`, `@aws-sdk/credential-provider-ini@3.973.26`, `@aws-sdk/credential-provider-login@3.972.88`, `@aws-sdk/credential-provider-node@3.972.93`, `@aws-sdk/credential-provider-process@3.972.81`, `@aws-sdk/credential-provider-sso@3.973.25`, `@aws-sdk/credential-provider-web-identity@3.972.87`, `@aws-sdk/nested-clients@3.998.0`, `@aws-sdk/types@3.975.0`, `@smithy/config-resolver@4.7.2`, `@smithy/core@3.39.0`, `@smithy/credential-provider-imds@4.5.2`, `@smithy/node-config-provider@4.6.2`, `@smithy/property-provider@4.5.2`, `@smithy/types@4.20.0`, `tslib@2.9.1`.
- `@usebruno/converters@0.25.0` → `@usebruno/common@0.27.0`, `@usebruno/schema@0.31.0`, `js-yaml@4.3.1`, `jscodeshift@17.4.0`, `lodash@4.18.1`, `mime-types@3.0.2`, `nanoid@3.3.18`, `xml2js@0.6.2`.
- `@usebruno/filestore@0.14.0` → `@types/nanoid@2.1.0`, `@usebruno/common@0.27.0`, `@usebruno/lang@0.41.0`, `ajv@8.20.0`, `lodash@4.18.1`, `nanoid@3.3.18`, `yaml@2.3.4`.
- `@usebruno/js@0.55.0` → `@usebruno/common@0.27.0`, `@usebruno/query@0.3.0`, `@usebruno/requests@0.22.0`, `ajv@8.20.0`, `ajv-formats@2.1.1`, `atob@2.1.2`, `axios@1.18.0`, `btoa@1.2.1`, `chai@4.5.0`, `chai-string@1.6.0`, `cheerio@1.2.0`, `crypto-js@4.2.0`, `handlebars@4.7.10`, `json-query@2.2.2`, `jsonwebtoken@9.0.3`, `lodash@4.18.1`, `moment@2.31.0`, `nanoid@3.3.18`, `node-fetch@2.7.0`, `path@0.12.7`, `quickjs-emscripten@0.32.0`, `tv4@1.3.0`, `uuid@10.0.0`, `xml-formatter@3.7.0`, `xml2js@0.6.2`, `yaml@2.3.4`.
- `@usebruno/lang@0.41.0` → `arcsecond@5.0.0`, `dotenv@16.6.1`, `lodash@4.18.1`, `ohm-js@16.6.0`.
- `@usebruno/requests@0.22.0` → `@aws-sdk/client-secrets-manager@3.1014.0`, `@aws-sdk/credential-providers@3.1019.0`, `@azure/core-rest-pipeline@1.25.0`, `@azure/identity@4.14.1`, `@azure/keyvault-secrets@4.12.0`, `@faker-js/faker@9.9.0`, `@google-cloud/secret-manager@6.3.0`, `@grpc/grpc-js@1.14.7`, `@grpc/proto-loader@0.7.15`, `@smithy/node-http-handler@4.5.3`, `@types/qs@6.15.1`, `@usebruno/common@0.27.0`, `axios@1.18.0`, `debug@4.4.3`, `google-auth-library@10.5.0`, `google-protobuf@4.0.3`, `grpc-js-reflection-client@1.4.3`, `http-proxy-agent@7.0.2`, `https-proxy-agent@7.0.6`, `is-ip@5.0.1`, `pac-resolver@7.0.1`, `qs@6.17.1`, `quickjs-emscripten@0.32.0`, `shell-env@4.0.3`, `socks-proxy-agent@8.0.5`, `tough-cookie@6.0.2`, `ws@8.21.3`.
- `aws4-axios@3.4.0` → `@aws-sdk/client-sts@3.1162.0`, `aws4@1.13.2`, `axios@1.18.0`.
- `axios@1.18.0` → `follow-redirects@1.16.2`, `form-data@4.0.6`, `https-proxy-agent@5.0.1`, `proxy-from-env@2.1.0`.
- `axios-ntlm@1.4.6` → `axios@1.18.0`, `des.js@1.1.0`, `dev-null@0.1.1`, `js-md4@0.3.2`.
- `chai@4.5.0` → `assertion-error@1.1.0`, `check-error@1.0.3`, `deep-eql@4.1.4`, `get-func-name@2.0.2`, `loupe@2.3.7`, `pathval@1.1.1`, `type-detect@4.1.0`.
- `chalk@3.0.0` → `ansi-styles@4.3.0`, `supports-color@7.2.0`.
- `cli-table3@0.6.5` → `string-width@4.2.3`, `@colors/colors@1.5.0 (opcional)`.
- `debug@4.4.3` → `ms@2.1.3`, `supports-color@7.2.0 (opcional)`.
- `decomment@0.9.5` → `esprima@4.0.1`.
- `form-data@4.0.4` → `asynckit@0.4.0`, `combined-stream@1.0.8`, `es-set-tostringtag@2.1.0`, `hasown@2.0.4`, `mime-types@2.1.35`.
- `fs-extra@10.1.0` → `graceful-fs@4.2.11`, `jsonfile@6.2.1`, `universalify@2.0.1`.
- `http-proxy-agent@7.0.2` → `agent-base@7.1.4`, `debug@4.4.3`.
- `https-proxy-agent@7.0.6` → `agent-base@7.1.4`, `debug@4.4.3`.
- `iconv-lite@0.6.3` → `safer-buffer@2.1.2`.
- `js-yaml@4.3.1` → `argparse@2.0.1`.
- `qs@6.17.1` → `es-define-property@1.0.1`, `side-channel@1.1.1`.
- `socks-proxy-agent@8.0.5` → `agent-base@7.1.4`, `debug@4.4.3`, `socks@2.8.10`.
- `yargs@17.7.3` → `cliui@8.0.1`, `escalade@3.2.0`, `get-caller-file@2.0.5`, `require-directory@2.1.1`, `string-width@4.2.3`, `y18n@5.0.8`, `yargs-parser@21.1.1`.

### Identificadores de vulnerabilidades devueltos

- `form-data@4.0.4`: high: CVE-2026-12143.
- `js-yaml@4.3.1`: high: CVE-2026-84375.
- `axios@1.18.0`: high: CVE-2026-101898, CVE-2026-101901, CVE-2026-101903, CVE-2026-101905, CVE-2026-101906, CVE-2026-101907, CVE-2026-101909; middle: CVE-2026-101899, CVE-2026-101900, CVE-2026-101902, CVE-2026-101904, CVE-2026-101908.
- `csv-parse@5.6.0`: middle: CVE-2026-85063.
- `uuid@10.0.0`: middle: CVE-2026-41907.
- `yaml@2.3.4`: middle: CVE-2026-33532.
- `@faker-js/faker@9.9.0`: high: CVE-2026-73231.

Las respuestas completas de esta revisión se conservan fuera del repositorio en
`/private/tmp/bruno1159-review/` (`inventory.json`, `results-final.json`,
respuestas HTTP y lockfile de propuesta). No contienen la credencial.
