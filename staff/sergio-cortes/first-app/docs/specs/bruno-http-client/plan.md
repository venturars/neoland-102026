# Plan — colección Bruno del cliente HTTP

Issue: #1103.

No es una función nueva de `logic/`. La firma sigue siendo
`updateUser(input)`. No hay SQL nuevo. No hay mensaje nuevo. Los
mensajes de error son los de `docs/ERRORS.md`.

`updateUser` deja cambiar el nombre, el email o los dos. Un dato que
no viene (`undefined`) conserva el valor guardado. Si el dato viene,
se valida como ahora (`Name is empty`, `Email is invalid`). Antes de
escribir se llama a `findByEmail` con el email resultante (el nuevo
o el guardado). Si lo tiene otro usuario, `Email is already used`.
El propio usuario puede conservar su email.

No se reescriben `docs/specs/express-users-client/`,
`docs/specs/nest-users-client/` ni `docs/specs/nest-swagger-ui/`.
Este contrato se documenta en esta spec. El esquema Swagger de
`PATCH` en Nest deja de marcar `name` y `email` como obligatorios.

No se crea `bruno.md`: esta issue no lo pide; los pasos de
comprobación quedan en la issue y en `AGENTS.md`.

El cliente HTTP sigue en `src/clients/http/server.js`, en
`http://127.0.0.1:3001`. La base sigue en `src/db/server.js`, en
`http://127.0.0.1:3000`. Se arrancan con `pnpm server` y `pnpm http`
desde `first-app`. La colección no llama a `logic/`: envía HTTP a
ese cliente. No se abre otra base. No se cambia el puerto.

## Paquetes

Entra en `devDependencies`, con versión exacta:

- `@usebruno/cli@4.3.0`

El árbol sale de `pnpm view` del manifiesto publicado, capas 0 a 3.
Si un paquete ya salió en una capa anterior con la misma versión, no
se vuelve a consultar. Ya están en `pnpm-lock.yaml` con la misma
versión y no cambian: `qs@6.17.1`, `debug@4.4.3`, `jsesc@3.1.0`,
`cli-table3@0.6.5`, `side-channel@1.1.1`, `es-errors@1.3.0`,
`object-inspect@1.13.4`, `side-channel-list@1.0.1`,
`side-channel-map@1.0.1`, `side-channel-weakmap@1.0.2`,
`es-define-property@1.0.1`, `hasown@2.0.4`, `mime-types@2.1.35`,
`ms@2.1.3`, `strip-ansi@6.0.1`, `string-width@4.2.3`,
`escalade@3.2.0`, `graceful-fs@4.2.11`, `tslib@2.9.1`,
`inherits@2.0.4`, `safer-buffer@2.1.2`, `ajv@8.20.0`,
`fast-deep-equal@3.1.3`, `fast-uri@3.1.9`,
`json-schema-traverse@1.0.0`, `require-from-string@2.0.2`,
`mime-types@3.0.2`, `mime-db@1.54.0`. No entran en Socket.

`jscodeshift@17.4.0` pide Babel 7. El proyecto tiene `@babel/core`
`8.1.0` y `@babel/preset-env` `8.0.7`. No se cambia Babel del
proyecto. pnpm anida Babel 7 bajo `jscodeshift`.

Árbol nuevo, por capas (capa 0 = directo):

- Capa 0: `@usebruno/cli@4.3.0`.
- Capa 1: `chai@4.5.0`, `axios@1.18.0`, `chalk@3.0.0`,
  `yargs@17.7.3`, `lodash@4.18.1`, `js-yaml@4.3.1`,
  `fs-extra@10.1.0`, `csv-parse@5.6.0`, `decomment@0.9.5`,
  `form-data@4.0.4`, `aws4-axios@3.4.0`, `axios-ntlm@1.4.6`,
  `iconv-lite@0.6.3`, `xmlbuilder@15.1.1`, `@usebruno/js@0.55.0`,
  `@usebruno/lang@0.41.0`, `@usebruno/filestore@0.14.0`,
  `@usebruno/converters@0.25.0`, `@usebruno/requests@0.22.0`,
  `@usebruno/common@0.27.0`, `http-proxy-agent@7.0.2`,
  `https-proxy-agent@7.0.6`, `socks-proxy-agent@8.0.5`,
  `@aws-sdk/credential-providers@3.1019.0`.
- Capa 2 y 3: el resto de la tabla Socket. `axios@1.18.0` lo fija el
  CLI. `axios-ntlm` resuelve otra copia `axios@1.21.0`. `form-data`
  entra `4.0.4` (CLI) y `4.0.6` (axios 1.18).

### Validación Socket

Organización `sergio-cortes`, plan free. `threat_feed` respondió 403
`threat_feed_not_entitled`. La columna de campaña queda
`n/d (plan free)`.

`alerts` respondió 429 (`Insufficient quota`) para `@usebruno/cli`,
`axios`, `js-yaml`, `form-data` y `lodash`. No hay dato de alertas
abiertas. No se inventa. La consulta no está completa: ver
«Preguntas».

`depscore` se completó para los paquetes de la tabla. Quedaron sin
puntuación, también por 429: `@usebruno/converters@0.25.0`,
`jscodeshift@17.4.0`, `@usebruno/schema@0.31.0`,
`http-proxy-agent@7.0.2`, `https-proxy-agent@7.0.6`,
`socks-proxy-agent@8.0.5`, `@aws-sdk/credential-providers@3.1019.0`,
`@types/nanoid@2.1.0`, `@types/node@26.6.6`.

| capa | paquete@versión | campaña | alertas | license | maintenance | quality | supplyChain | vulnerability | stats < 50 |
|------|-----------------|---------|---------|---------|-------------|---------|-------------|---------------|------------|
| 0 | `@usebruno/cli@4.3.0` | n/d (plan free) | n/d (429) | 100 | 96 | 100 | 88 | 100 | ninguna |
| 1 | `chai@4.5.0` | n/d (plan free) | n/d (429) | 100 | 84 | 100 | 99 | 100 | ninguna |
| 1 | `axios@1.18.0` | n/d (plan free) | n/d (429) | 100 | 94 | 100 | 97 | 30 | vulnerability 30 |
| 1 | `chalk@3.0.0` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 100 | 100 | ninguna |
| 1 | `yargs@17.7.3` | n/d (plan free) | n/d (429) | 100 | 87 | 100 | 98 | 100 | ninguna |
| 1 | `lodash@4.18.1` | n/d (plan free) | n/d (429) | 100 | 82 | 86 | 100 | 100 | ninguna |
| 1 | `js-yaml@4.3.1` | n/d (plan free) | n/d (429) | 100 | 92 | 100 | 100 | 84 | ninguna |
| 1 | `fs-extra@10.1.0` | n/d (plan free) | n/d (429) | 100 | 88 | 100 | 99 | 100 | ninguna |
| 1 | `csv-parse@5.6.0` | n/d (plan free) | n/d (429) | 100 | 85 | 96 | 100 | 99 | ninguna |
| 1 | `decomment@0.9.5` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 1 | `form-data@4.0.4` | n/d (plan free) | n/d (429) | 100 | 87 | 100 | 99 | 84 | ninguna |
| 1 | `aws4-axios@3.4.0` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 99 | 100 | ninguna |
| 1 | `axios-ntlm@1.4.6` | n/d (plan free) | n/d (429) | 100 | 80 | 92 | 99 | 100 | ninguna |
| 1 | `iconv-lite@0.6.3` | n/d (plan free) | n/d (429) | 100 | 93 | 100 | 100 | 100 | ninguna |
| 1 | `xmlbuilder@15.1.1` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 1 | `@usebruno/js@0.55.0` | n/d (plan free) | n/d (429) | 100 | 95 | 76 | 85 | 100 | ninguna |
| 1 | `@usebruno/lang@0.41.0` | n/d (plan free) | n/d (429) | 100 | 94 | 76 | 93 | 100 | ninguna |
| 1 | `@usebruno/filestore@0.14.0` | n/d (plan free) | n/d (429) | 100 | 93 | 86 | 93 | 100 | ninguna |
| 1 | `@usebruno/requests@0.22.0` | n/d (plan free) | n/d (429) | 100 | 94 | 75 | 87 | 100 | ninguna |
| 1 | `@usebruno/common@0.27.0` | n/d (plan free) | n/d (429) | 100 | 94 | 76 | 86 | 100 | ninguna |
| 1 | `@usebruno/converters@0.25.0` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 1 | `http-proxy-agent@7.0.2` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 1 | `https-proxy-agent@7.0.6` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 1 | `socks-proxy-agent@8.0.5` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 1 | `@aws-sdk/credential-providers@3.1019.0` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 2 | `loupe@2.3.7` | n/d (plan free) | n/d (429) | 100 | 80 | 90 | 99 | 100 | ninguna |
| 2 | `pathval@1.1.1` | n/d (plan free) | n/d (429) | 100 | 79 | 100 | 99 | 100 | ninguna |
| 2 | `deep-eql@4.1.4` | n/d (plan free) | n/d (429) | 100 | 79 | 98 | 99 | 100 | ninguna |
| 2 | `check-error@1.0.3` | n/d (plan free) | n/d (429) | 100 | 80 | 99 | 99 | 100 | ninguna |
| 2 | `assertion-error@1.1.0` | n/d (plan free) | n/d (429) | 100 | 79 | 79 | 100 | 100 | ninguna |
| 2 | `form-data@4.0.6` | n/d (plan free) | n/d (429) | 100 | 87 | 100 | 99 | 100 | ninguna |
| 2 | `proxy-from-env@2.1.0` | n/d (plan free) | n/d (429) | 100 | 81 | 100 | 99 | 100 | ninguna |
| 2 | `follow-redirects@1.16.2` | n/d (plan free) | n/d (429) | 100 | 88 | 100 | 100 | 100 | ninguna |
| 2 | `https-proxy-agent@5.0.1` | n/d (plan free) | n/d (429) | 100 | 82 | 100 | 99 | 100 | ninguna |
| 2 | `ansi-styles@4.3.0` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 2 | `supports-color@7.2.0` | n/d (plan free) | n/d (429) | 100 | 80 | 91 | 100 | 100 | ninguna |
| 2 | `y18n@5.0.8` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 2 | `cliui@8.0.1` | n/d (plan free) | n/d (429) | 100 | 81 | 100 | 99 | 100 | ninguna |
| 2 | `yargs-parser@21.1.1` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 98 | 100 | ninguna |
| 2 | `get-caller-file@2.0.5` | n/d (plan free) | n/d (429) | 100 | 75 | 74 | 100 | 100 | ninguna |
| 2 | `require-directory@2.1.1` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 2 | `argparse@2.0.1` | n/d (plan free) | n/d (429) | 100 | 89 | 96 | 100 | 100 | ninguna |
| 2 | `jsonfile@6.2.1` | n/d (plan free) | n/d (429) | 100 | 82 | 99 | 100 | 100 | ninguna |
| 2 | `esprima@4.0.1` | n/d (plan free) | n/d (429) | 100 | 75 | 86 | 99 | 100 | ninguna |
| 2 | `@aws-sdk/client-sts@3.1162.0` | n/d (plan free) | n/d (429) | 100 | 97 | 100 | 99 | 100 | ninguna |
| 2 | `aws4@1.13.2` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 2 | `axios@1.21.0` | n/d (plan free) | n/d (429) | 100 | 94 | 100 | 97 | 100 | ninguna |
| 2 | `des.js@1.1.0` | n/d (plan free) | n/d (429) | 100 | 79 | 78 | 100 | 100 | ninguna |
| 2 | `dev-null@0.1.1` | n/d (plan free) | n/d (429) | 100 | 75 | 77 | 100 | 100 | ninguna |
| 2 | `js-md4@0.3.2` | n/d (plan free) | n/d (429) | 100 | 75 | 93 | 100 | 100 | ninguna |
| 2 | `tv4@1.3.0` | n/d (plan free) | n/d (429) | 80 | 75 | 100 | 100 | 100 | ninguna |
| 2 | `atob@2.1.2` | n/d (plan free) | n/d (429) | 100 | 75 | 81 | 100 | 100 | ninguna |
| 2 | `btoa@1.2.1` | n/d (plan free) | n/d (429) | 100 | 75 | 74 | 100 | 100 | ninguna |
| 2 | `path@0.12.7` | n/d (plan free) | n/d (429) | 100 | 75 | 73 | 100 | 100 | ninguna |
| 2 | `uuid@10.0.0` | n/d (plan free) | n/d (429) | 100 | 50 | 100 | 99 | 99 | ninguna |
| 2 | `yaml@2.3.4` | n/d (plan free) | n/d (429) | 100 | 87 | 100 | 99 | 99 | ninguna |
| 2 | `moment@2.31.0` | n/d (plan free) | n/d (429) | 100 | 87 | 97 | 100 | 100 | ninguna |
| 2 | `nanoid@3.3.18` | n/d (plan free) | n/d (429) | 100 | 92 | 81 | 100 | 100 | ninguna |
| 2 | `xml2js@0.6.2` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 2 | `cheerio@1.2.0` | n/d (plan free) | n/d (429) | 100 | 82 | 100 | 99 | 100 | ninguna |
| 2 | `crypto-js@4.2.0` | n/d (plan free) | n/d (429) | 100 | 50 | 100 | 100 | 100 | ninguna |
| 2 | `handlebars@4.7.10` | n/d (plan free) | n/d (429) | 100 | 89 | 100 | 99 | 100 | ninguna |
| 2 | `json-query@2.2.2` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 2 | `node-fetch@2.7.0` | n/d (plan free) | n/d (429) | 100 | 84 | 100 | 95 | 100 | ninguna |
| 2 | `ajv-formats@2.1.1` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 99 | 100 | ninguna |
| 2 | `chai-string@1.6.0` | n/d (plan free) | n/d (429) | 100 | 79 | 100 | 100 | 100 | ninguna |
| 2 | `jsonwebtoken@9.0.3` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 99 | 100 | ninguna |
| 2 | `xml-formatter@3.7.0` | n/d (plan free) | n/d (429) | 100 | 81 | 100 | 99 | 100 | ninguna |
| 2 | `@usebruno/query@0.3.0` | n/d (plan free) | n/d (429) | 100 | 89 | 76 | 90 | 100 | ninguna |
| 2 | `dotenv@16.6.1` | n/d (plan free) | n/d (429) | 100 | 95 | 100 | 99 | 100 | ninguna |
| 2 | `ohm-js@16.6.0` | n/d (plan free) | n/d (429) | 100 | 88 | 99 | 93 | 100 | ninguna |
| 2 | `arcsecond@5.0.0` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 2 | `@types/nanoid@2.1.0` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 2 | `jscodeshift@17.4.0` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 2 | `@usebruno/schema@0.31.0` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |
| 3 | `get-func-name@2.0.2` | n/d (plan free) | n/d (429) | 100 | 79 | 99 | 99 | 100 | ninguna |
| 3 | `type-detect@4.1.0` | n/d (plan free) | n/d (429) | 100 | 79 | 100 | 99 | 100 | ninguna |
| 3 | `asynckit@0.4.0` | n/d (plan free) | n/d (429) | 100 | 80 | 100 | 100 | 100 | ninguna |
| 3 | `combined-stream@1.0.8` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 3 | `es-set-tostringtag@2.1.0` | n/d (plan free) | n/d (429) | 100 | 53 | 84 | 66 | 100 | ninguna |
| 3 | `color-convert@2.0.1` | n/d (plan free) | n/d (429) | 100 | 80 | 90 | 100 | 100 | ninguna |
| 3 | `has-flag@4.0.0` | n/d (plan free) | n/d (429) | 100 | 75 | 94 | 100 | 100 | ninguna |
| 3 | `wrap-ansi@7.0.0` | n/d (plan free) | n/d (429) | 100 | 84 | 97 | 100 | 100 | ninguna |
| 3 | `universalify@2.0.1` | n/d (plan free) | n/d (429) | 100 | 79 | 88 | 100 | 100 | ninguna |
| 3 | `@smithy/core@3.39.0` | n/d (plan free) | n/d (429) | 100 | 97 | 90 | 100 | 100 | ninguna |
| 3 | `@aws-sdk/core@3.980.0` | n/d (plan free) | n/d (429) | 100 | 97 | 85 | 99 | 100 | ninguna |
| 3 | `@smithy/types@4.20.0` | n/d (plan free) | n/d (429) | 100 | 90 | 100 | 100 | 100 | ninguna |
| 3 | `@aws-sdk/types@3.975.0` | n/d (plan free) | n/d (429) | 100 | 93 | 72 | 100 | 100 | ninguna |
| 3 | `@smithy/node-http-handler@4.14.2` | n/d (plan free) | n/d (429) | 100 | 96 | 75 | 99 | 100 | ninguna |
| 3 | `@smithy/fetch-http-handler@5.8.0` | n/d (plan free) | n/d (429) | 100 | 89 | 72 | 99 | 100 | ninguna |
| 3 | `@aws-sdk/credential-provider-node@3.972.93` | n/d (plan free) | n/d (429) | 100 | 97 | 100 | 97 | 100 | ninguna |
| 3 | `@aws-sdk/signature-v4-multi-region@3.996.51` | n/d (plan free) | n/d (429) | 100 | 97 | 79 | 99 | 100 | ninguna |
| 3 | `minimalistic-assert@1.0.1` | n/d (plan free) | n/d (429) | 100 | 75 | 54 | 100 | 100 | ninguna |
| 3 | `process@0.11.10` | n/d (plan free) | n/d (429) | 100 | 75 | 76 | 100 | 100 | ninguna |
| 3 | `util@0.10.4` | n/d (plan free) | n/d (429) | 100 | 84 | 73 | 100 | 100 | ninguna |
| 3 | `sax@1.6.1` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 100 | 100 | ninguna |
| 3 | `xmlbuilder@11.0.1` | n/d (plan free) | n/d (429) | 100 | 75 | 97 | 100 | 100 | ninguna |
| 3 | `minimist@1.2.8` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 100 | 100 | ninguna |
| 3 | `wordwrap@1.0.0` | n/d (plan free) | n/d (429) | 100 | 75 | 89 | 100 | 100 | ninguna |
| 3 | `neo-async@2.6.2` | n/d (plan free) | n/d (429) | 100 | 75 | 100 | 100 | 100 | ninguna |
| 3 | `uglify-js@3.19.3` | n/d (plan free) | n/d (429) | 100 | 83 | 100 | 99 | 100 | ninguna |
| 3 | `source-map@0.6.1` | n/d (plan free) | n/d (429) | 100 | 86 | 100 | 100 | 100 | ninguna |
| 3 | `whatwg-url@5.0.0` | n/d (plan free) | n/d (429) | 100 | 94 | 90 | 100 | 100 | ninguna |
| 3 | `@types/node@26.6.6` | n/d (plan free) | n/d (429) | — | — | — | — | — | consulta 429 |

`axios@1.18.0` baja de 50 en vulnerability (30). Esa versión la fija
el CLI. `form-data@4.0.4` vulnerability 84. `js-yaml@4.3.1`
vulnerability 84. `uuid@10.0.0` y `crypto-js@4.2.0` maintenance 50:
50 no baja. El agente no acepta alertas ni stats por su cuenta.

## Ficheros

Se crean:

- `src/clients/http/bruno/bruno.json`
- `src/clients/http/bruno/collection.bru`
- `src/clients/http/bruno/01-sql-online/folder.bru`
- `src/clients/http/bruno/01-sql-online/01-empty-list.bru`
- `src/clients/http/bruno/01-sql-online/02-create-ada.bru`
- `src/clients/http/bruno/01-sql-online/03-list-users.bru`
- `src/clients/http/bruno/01-sql-online/04-find-ada.bru`
- `src/clients/http/bruno/01-sql-online/05-patch-name.bru`
- `src/clients/http/bruno/01-sql-online/06-create-empty-name.bru`
- `src/clients/http/bruno/01-sql-online/07-create-invalid-email.bru`
- `src/clients/http/bruno/01-sql-online/08-create-used-email.bru`
- `src/clients/http/bruno/01-sql-online/09-get-missing.bru`
- `src/clients/http/bruno/01-sql-online/10-patch-missing.bru`
- `src/clients/http/bruno/01-sql-online/11-delete-missing.bru`
- `src/clients/http/bruno/01-sql-online/12-delete-ada.bru`
- `src/clients/http/bruno/01-sql-online/13-list-after-delete.bru`
- `src/clients/http/bruno/02-sql-offline/folder.bru`
- `src/clients/http/bruno/02-sql-offline/14-create-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/15-list-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/16-find-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/17-update-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/18-delete-sql-offline.bru`

Se tocan:

- `src/logic/update-user.js`: un dato que no viene se conserva; el
  email resultante no puede estar en otro usuario.
- `src/clients/nest/users.controller.js`: `UPDATE_USER_BODY_SCHEMA`
  deja de tener `required: ["name", "email"]`. El ejemplo de cuerpo
  queda completo (`name` y `email`). `POST` no cambia.
- `package.json`: `"@usebruno/cli": "4.3.0"` en `devDependencies`,
  en orden alfabético, y script `bruno`.
- `pnpm-lock.yaml`: lo escribe pnpm. No se edita a mano.
- `docs/ARCHITECTURE.md`: el punto de `src/clients/http/server.js`,
  el de `src/logic/update-user.js` y el de los scripts de
  `package.json`.
- `docs/TREE.md`: `http/` pasa a tener `server.js` y `bruno/`.
- `AGENTS.md`: la comprobación de este cliente HTTP es `pnpm bruno`.
  El script `test` no se cambia.

No se tocan `src/clients/http/server.js` (ya reenvía `name` y
`email` del cuerpo), `src/queries/`, `src/db/`, Chrome,
`docs/ERRORS.md`, `docs/STYLE.md` ni las specs anteriores. No hay
`package.json` anidado. No hay `bruno.md`. No hay cliente de
terminal nuevo.

`bruno.json` tiene `version` `0.0.0`, `name` `first-app HTTP users`
y `type` `collection`.

`package.json` tiene el script `bruno`. Se lanza con `pnpm bruno`
desde `first-app`. Entra en `src/clients/http/bruno` y ejecuta
`bru run 01-sql-online -r`, con el `bru` de `node_modules/.bin`.

## Colección

La forma de cada petición es `.bru`: `meta`, método, cuerpo y
`tests { }` (`expect` de estado y, en fallos, `{ message }`). Hay
dos carpetas. No se ejecutan juntas.

`baseUrl` es `http://127.0.0.1:3001`. `missingId` es `999999`. Crear
Ada guarda `userId`. Las peticiones de ese usuario usan esa
variable. No se exige el id 1: la lista vacía no reinicia el
incremento.

Carpeta `01-sql-online`, con la lista vacía:

- `empty-list` es `GET /users`. 200 y `[]`.
- `create-ada` es `POST /users` con Ada y ada@example.com. 201. El
  cuerpo tiene `id`, `name`, `email`, `createdAt` y `updatedAt`.
  Nombre Ada y email ada@example.com.
- `list-users` es `GET /users`. 200. La lista tiene a Ada.
- `find-ada` es `GET /users/:id` con `userId`. 200 y los mismos
  datos.
- `patch-name` es `PATCH /users/:id` solo con el nombre Ada
  Lovelace. 200. El id y el email no cambian.
- `create-empty-name` es `POST /users` con el nombre `" "` y
  empty@example.com. 400 y `Name is empty`.
- `create-invalid-email` es `POST /users` con Invalid e `invalid`.
  400 y `Email is invalid`.
- `create-used-email` es `POST /users` con Other y ada@example.com.
  409 y `Email is already used`.
- `get-missing`, `patch-missing` y `delete-missing` usan
  `missingId`. 404 y `User not found`. `patch-missing` envía solo
  el nombre Nobody.
- `delete-ada` es `DELETE /users/:id` con `userId`. 204 y cuerpo
  vacío.
- `list-after-delete` es `GET /users`. 200 y `[]`.

Carpeta `02-sql-offline`, con el SQL parado y el cliente HTTP
abierto:

- `create-sql-offline` es `POST /users`. 500 y `Could not create the
  user`.
- `list-sql-offline` es `GET /users`. 500 y `Could not list the
  users`.
- `find-sql-offline` es `GET /users/:id` con `missingId`. 500 y
  `Could not find the user`.
- `update-sql-offline` es `PATCH /users/:id` con `missingId` y
  solo el nombre Offline. 500 y `Could not update the user`.
- `delete-sql-offline` es `DELETE /users/:id` con `missingId`. 500 y
  `Could not delete the user`.

Un fallo de la lista sale en JSON con la clave `message` y ese
texto.

## Documentación del proyecto

En `docs/ARCHITECTURE.md`, el punto de `src/logic/update-user.js`
añade que un dato que no entra se conserva y que el email no se
repite. El punto de `src/clients/http/server.js` añade que la
carpeta tiene la colección Bruno y que se lanza con `pnpm bruno`.
El punto de `src/clients/nest/users.controller.js` añade que el
cuerpo de `PATCH` no exige los dos campos. El punto de los scripts
de `package.json` añade el script `bruno`. El resto de los puntos
no cambia.

En `docs/TREE.md`, `http/` queda así:

```
      http/
        server.js
        bruno/
```

En `AGENTS.md`, Comandos: el script `test` sigue siendo el
placeholder que termina en error y no se cambia. Se añade que la
comprobación del cliente HTTP es `pnpm bruno` (colección con
`tests { }` de Bruno), no ese script. En Ejecutar se nombra
`pnpm bruno`.

## Firma

No hay función nueva. Sigue `updateUser(input)`: `id` obligatorio;
`name` y `email` opcionales. Devuelve el usuario (`id`, `name`,
`email`, `createdAt`, `updatedAt`).

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
| No se llega al ver uno            | `Could not find the user`   | 500    |
| No se llega al modificar          | `Could not update the user` | 500    |
| No se llega al borrar             | `Could not delete the user` | 500    |

## Preguntas

La constitución pide un resumen Socket completo antes de aceptar el
plan. Esta consulta no lo está: `alerts` dio 429 y nueve paquetes
no tienen `depscore`. No hay `tasks.md` hasta tener esa respuesta.

1. ¿Se reintenta Socket cuando vuelva la cuota, y se completa la
   tabla de alertas y los nueve `depscore` que faltan, antes de
   escribir `tasks.md`?
2. `axios@1.18.0` tiene vulnerability 30. La fija el CLI. ¿Se
   acepta esa stat al aceptar el plan, o se espera también a las
   alertas de esa versión?
