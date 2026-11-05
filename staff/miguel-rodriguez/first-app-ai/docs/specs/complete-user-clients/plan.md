# Plan — clientes y resumen

Issue #1024 · PR #1025. Referencia: spec.md.
Autorización conjunta de Miguel del 2026-11-04 descrita en la spec.

## Retirada de Nest · 2026-11-05

Por petición expresa de Miguel, retirar de #1025 el adaptador Nest anterior y
continuarlo desde staging en la [issue #1044](https://github.com/venturars/neoland-102026/issues/1044).
Eliminar su archivo, comando, patrón de formato y las declaraciones exclusivas
de @nestjs/common, @nestjs/core, @nestjs/platform-express, reflect-metadata y rxjs.
pnpm regenera solo el lockfile, con scripts desactivados; no se instala ni añade
una versión. Conservar versiones y código de los demás clientes y la excepción
de antigüedad de Electron. El lint actual no contiene una excepción propia de Nest.

Las pruebas actuales de API cubren Express y Chrome/Fastify. La comprobación se
ejecuta en copias desechables, con puertos alternativos solo en esas copias,
sin tocar la demostración abierta. Actualizar guías, árbol y constitución para
reflejar los clientes presentes. La revisión Socket y los resultados del día 4
permanecen como historial de la propuesta anterior, no como inventario actual.

## Adaptadores

- Electron: main.js abre index.html propio, con app.js/styles.css. preload.cjs
  expone una lista cerrada de operaciones por IPC; main llama a lógica. Mantener
  contextIsolation y renderer sin Node. La clasificación queda en el main, donde
  funciona la operación compartida. Preparar el binario con el install.js del
  paquete instalado si pnpm no ejecuta su postinstall; documentar ese paso inicial.
  pnpm electron, cierre de ventana y reapertura en macOS.
- Chrome: manifest MV3 y popup propio. Solo host_permissions para loopback3002.
  server.js usa Fastify y llama a lógica; pnpm chrome. La extensión no importa
  módulos Node ni necesita permisos de sitios ajenos.
- Express existente: añadir GET /users/gender-count antes de /users/:id.
  Chrome/Fastify ofrece la misma ruta. Éxito200 y tres campos; fallo500
  con message Could not classify the users. Mantener CRUD201/200/204 y errores
  400/409/404/500 del cliente REST actual. IDs a número antes de llamar lógica.
- Web: botón de resumen que importa y espera usersGenderCount directamente. VS Code: acción
  genderCount en el host y botón en webview. Mantener su protocolo de peticiones,
  CSP y protección de edición. APIs/Electron usan la operación compartida.
  Express conserva su ruta de resumen para sus consumidores HTTP; se retira
  la excepción CORS que solo servía al rodeo del cliente web. Los formularios nuevos dejan
  validar nombre/email a la operación compartida, conservando sus mensajes.

Cambios limitados a src/clients, package.json/lockfile, README, arquitectura,
árbol, constitución, la operación usersGenderCount y estos documentos. Añadir cobertura de los nuevos JS/CJS en
format y los globals de los adaptadores al lint cuando corresponda.
`pnpm-workspace.yaml` guarda la excepción de antigüedad de Electron por versión
exacta generadas por pnpm; no desactiva el control para otras versiones.
`tests/client-apis.test.js` comprueba los contratos y
los fallos de las dos APIs con una base desechable.

## Correcciones de la revisión · 2026-11-04

Autorizadas por Miguel al pedir terminar los tres hallazgos antes de fusionar.
Esta sección reemplaza la decisión anterior de pasar el resumen web por Express
y, solo para el transporte del clasificador, el uso del SDK descrito en el plan
histórico de classifier. No se cambia su contrato de negocio.

- usersGenderCount usa fetch nativo a la misma API local compatible con OpenAI,
  POST http://127.0.0.1:11434/v1/chat/completions. Conserva exactamente el objeto
  de petición, modelo, prompt, esquema, lotes secuenciales de seis, fallback por
  respuesta inutilizable y error genérico por fallo de consulta/petición.
  Un envío por lote y timeout explícito de diez minutos: no reproduce los dos
  reintentos implícitos del SDK. No añade librería ni servidor; las dependencias
  declaradas no se cambian en esta corrección.
- El lanzador web sigue abriendo file:// con módulos locales. La prueba previa
  confirmó Origin file:// y Ollama responde a su preflight con permiso; verificar
  ese recorrido en navegador real. Origin null no está permitido por este
  daemon: no se presenta el doble clic ordinario como método de arranque válido.
- Electron y Chrome actualizan selección/formularios inmediatamente después
  de confirmar cada escritura. La recarga de la lista tiene su propio manejo
  de fallo y conserva el resultado confirmado. Si la recarga termina bien,
  usar su contacto más reciente o retirar la selección si ya no existe; no
  restaurar una instantánea anterior. Refresh explícito mantiene su significado.
  Mostrar createdAt y updatedAt mediante textContent.
- Añadir regresiones de estado tras fallo de recarga y de fechas visibles,
  además de transporte del clasificador, lotes, fallback y ausencia de conteo
  parcial. Probar el resumen web con Express detenido y sin petición al puerto
  3001. Actualizar las guías y registrar evidencia nueva sin borrar la histórica.

## Verificación

Ejecutar servidores solo sobre copia desechable; puerto3000 datos, 3001Express,
3002Chrome. Comprobar cada API con peticiones reales; escritorio y
popup en Chromium real con perfiles propios; VS Code en extension host real.
Usar el modelo llama3.2 instalado para un resumen poblado y verificar suma de
conteos, sin imponer etiquetas exactas al modelo. Probar tres ceros con tabla
vacía y errores con modelo inaccesible. Comparar registros y fechas antes y
después. Detener procesos propios, retirar copias/perfiles. Formato, lint y
regresiones existentes en serie después de detener los servicios manuales.

## Dependencias y decisión

Dependencias actuales de esta entrega: electron45.2.2 (desarrollo) y fastify5.12.8.
Se presentaron los hallazgos antes de instalar en esta conversación. La ejecución
continúa bajo la autorización conjunta expresa de Miguel de completar la tarea;
no se afirma una aceptación individual posterior de cada alerta. Conservar las
limitaciones en la entrega y comprobar la resolución real tras instalar.
Un cambio de versión obliga a comprobar la diferencia antes de incorporarla.

# Historical proposed client dependency review · 2026-11-04

This review records the original proposal, including the Nest implementation
withdrawn on 2026-11-05. Its findings and relationships are historical evidence.
The current dependency declarations exclude that implementation's five roots.

Metadata only; no package installed by this audit. Roots: electron@45.2.2
(devDependency), fastify@5.12.8, @nestjs/common@12.3.3, @nestjs/core@12.3.3,
@nestjs/platform-express@12.3.3, reflect-metadata@0.2.2 and rxjs@7.8.2.
Nest does not need SWC/TypeScript if decorators are applied as functions to plain
JavaScript classes in the Nest adapter. Existing business logic stays functions.

103 unique name/versions across each proposed root plus its direct dependencies
and their direct dependencies. Optional and required peers declared in metadata
were considered. Optional Nest peers class-validator, class-transformer,
@nestjs/websockets and @nestjs/microservices are not proposed for installation.
No OS/architecture exclusions appeared in this metadata. Electron executable is
platform-specific; verification target is darwin-arm64 only. This audit does not
certify the downloaded Electron binary for every operating system.

Sources: registry metadata via pnpm view; Socket MCP depscore for all 103 exact
versions with platform darwin-arm64; POST Socket org package API with exact PURLs,
alerts=true&poll=true&timeoutSec=20. API scores 0–1 converted to 0–100.
Scoped namespace and name were combined for identity checks. All 103 API results
matched exact inputPurl/name/version, with five scores and no pending/notFound.

Organization: Socket MCP organizations confirms neoland free. Open alerts and
cleared alerts were separately queried with no package/severity filters, both
endCursor null and no items. This only covers monitored organization packages.
Threat feed returned 403 threat_feed_not_entitled. campaigns: coverage limited
by the Socket plan; no absence of campaigns inferred from that failure.

Scores: 515 values, minimum 50.0, none below50. Alerts: 248 total: 2 high, 56 middle, 190 low; no critical or vulnerability-category alerts in these exact responses.

High findings:
- object-assign@4.1.1: socketUpgradeAvailable, maintenance category, policy ignore;
  recommends a Socketregistry substitute, not a CVE by itself. No optimize or
  package substitution is authorized by this audit.
- tslib@2.9.1: unstableOwnership, supply-chain category, new author microsoft1es,
  policy monitor. This is an ownership-change warning, not proven malware. It
  remains material and should be explicitly surfaced before installation.

All alerts, including ignored and low severities, appear below. No human
acceptance is claimed by the auditor. A lockfile comparison after authorized
installation must check actual optional/peer resolution and changed versions.

## Package scores and alerts

| Version | SC | V | Q | M | L | Alert types/severity/action (multiplicity) |
| --- | --- | --- | --- | --- | --- | --- |
| @electron-internal/extract-zip@1.0.8 | 95.0 | 100 | 98.0 | 94.0 | 100 | debugAccess/low/ignore; dynamicRequire/low/ignore; envVars/low/ignore ×65; filesystemAccess/low/ignore; shellAccess/middle/ignore; urlStrings/low/ignore |
| @electron/get@5.1.0 | 99.0 | 100 | 100 | 82.0 | 100 | urlStrings/low/ignore |
| @fastify/ajv-compiler@4.0.7 | 99.0 | 100 | 100 | 89.0 | 100 | urlStrings/low/ignore |
| @fastify/deepmerge@3.2.4 | 100 | 100 | 100 | 88.0 | 100 | No alerts returned |
| @fastify/error@4.2.1 | 100 | 100 | 100 | 84.0 | 100 | No alerts returned |
| @fastify/fast-json-stringify-compiler@5.1.1 | 100 | 100 | 100 | 89.0 | 100 | gptAnomaly/low/ignore; usesEval/middle/ignore |
| @fastify/forwarded@3.1.2 | 100 | 100 | 82.0 | 89.0 | 100 | No alerts returned |
| @fastify/merge-json-schemas@0.2.2 | 100 | 100 | 100 | 84.0 | 100 | No alerts returned |
| @fastify/proxy-addr@5.1.2 | 100 | 100 | 100 | 86.0 | 100 | gptSecurity/middle/ignore |
| @lukeed/csprng@1.1.0 | 100 | 100 | 87.0 | 79.0 | 100 | No alerts returned |
| @nestjs/common@12.3.3 | 99.0 | 100 | 100 | 96.0 | 100 | debugAccess/low/ignore; envVars/low/ignore ×3 |
| @nestjs/core@12.3.3 | 99.0 | 100 | 100 | 95.0 | 100 | debugAccess/low/ignore ×2; envVars/low/ignore; networkAccess/middle/ignore ×2; urlStrings/low/ignore |
| @nestjs/platform-express@12.3.3 | 99.0 | 100 | 100 | 96.0 | 100 | networkAccess/middle/ignore ×2 |
| @pinojs/redact@0.4.0 | 100 | 100 | 100 | 81.0 | 100 | No alerts returned |
| @standard-schema/spec@1.1.0 | 100 | 100 | 99.0 | 82.0 | 100 | No alerts returned |
| @tokenizer/inflate@0.6.0 | 99.0 | 100 | 99.0 | 90.0 | 100 | No alerts returned |
| @types/node@24.19.2 | 100 | 100 | 80.0 | 96.0 | 100 | No alerts returned |
| abstract-logging@2.0.1 | 100 | 100 | 77.0 | 75.0 | 100 | unmaintained/low/ignore |
| accepts@2.0.0 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor/low/ignore |
| ajv-formats@3.0.1 | 99.0 | 100 | 100 | 83.0 | 100 | No alerts returned |
| ajv@8.20.0 | 99.0 | 100 | 100 | 84.0 | 100 | gptAnomaly/low/ignore ×3; urlStrings/low/ignore; usesEval/middle/ignore |
| append-field@1.0.0 | 100 | 100 | 80.0 | 75.0 | 100 | unmaintained/low/ignore |
| atomic-sleep@1.0.0 | 100 | 100 | 85.0 | 75.0 | 100 | unmaintained/low/ignore |
| avvio@9.3.1 | 100 | 100 | 100 | 90.0 | 100 | No alerts returned |
| body-parser@2.4.0 | 99.0 | 100 | 100 | 93.0 | 100 | No alerts returned |
| busboy@1.6.0 | 100 | 100 | 100 | 80.0 | 100 | No alerts returned |
| content-disposition@2.0.1 | 100 | 100 | 100 | 86.0 | 100 | No alerts returned |
| content-type@2.1.0 | 100 | 100 | 90.0 | 88.0 | 100 | No alerts returned |
| cookie-signature@1.2.2 | 100 | 100 | 69.0 | 82.0 | 100 | No alerts returned |
| cookie@0.7.2 | 100 | 100 | 99.0 | 85.0 | 100 | No alerts returned |
| cookie@2.0.1 | 100 | 100 | 100 | 85.0 | 100 | No alerts returned |
| cors@2.8.6 | 99.0 | 100 | 100 | 83.0 | 100 | newAuthor/low/ignore |
| debug@4.4.3 | 99.0 | 100 | 100 | 81.0 | 100 | envVars/low/ignore ×6 |
| depd@2.0.0 | 99.0 | 100 | 100 | 75.0 | 100 | envVars/low/ignore ×2; unmaintained/low/ignore; usesEval/middle/ignore |
| electron@45.2.2 | 99.0 | 100 | 99.0 | 97.0 | 100 | envVars/low/ignore ×2; filesystemAccess/low/ignore; gptAnomaly/low/ignore; shellAccess/middle/ignore |
| encodeurl@2.0.1 | 100 | 100 | 99.0 | 90.0 | 100 | No alerts returned |
| env-paths@3.0.0 | 100 | 100 | 99.0 | 80.0 | 100 | No alerts returned |
| escape-html@1.0.3 | 100 | 100 | 78.0 | 75.0 | 100 | unmaintained/low/ignore |
| etag@1.8.1 | 100 | 100 | 99.0 | 75.0 | 100 | filesystemAccess/low/ignore; unmaintained/low/ignore |
| express@5.3.0 | 97.0 | 100 | 100 | 92.0 | 100 | dynamicRequire/low/ignore; envVars/low/ignore; filesystemAccess/low/ignore; networkAccess/middle/ignore ×5 |
| fast-deep-equal@3.1.3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| fast-json-stringify@7.2.1 | 99.0 | 100 | 100 | 97.0 | 100 | gptSecurity/middle/ignore; urlStrings/low/ignore; usesEval/middle/ignore ×2 |
| fast-querystring@1.1.2 | 99.0 | 100 | 100 | 79.0 | 100 | No alerts returned |
| fast-safe-stringify@2.1.1 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| fast-uri@4.2.3 | 100 | 100 | 100 | 98.0 | 100 | urlStrings/low/ignore |
| fastify@5.12.8 | 98.0 | 100 | 100 | 99.0 | 100 | debugAccess/low/ignore ×5; networkAccess/middle/ignore ×6; urlStrings/low/ignore |
| fastq@1.20.3 | 100 | 100 | 100 | 82.0 | 100 | No alerts returned |
| file-type@22.3.0 | 99.0 | 100 | 100 | 93.0 | 100 | No alerts returned |
| finalhandler@2.1.1 | 99.0 | 100 | 100 | 84.0 | 100 | envVars/low/ignore |
| find-my-way@9.10.0 | 99.0 | 100 | 100 | 89.0 | 100 | urlStrings/low/ignore; usesEval/middle/ignore ×5 |
| fresh@2.0.0 | 100 | 100 | 99.0 | 83.0 | 100 | No alerts returned |
| graceful-fs@4.2.11 | 99.0 | 100 | 100 | 79.0 | 100 | envVars/low/ignore ×4; filesystemAccess/low/ignore; gptAnomaly/low/ignore |
| http-errors@2.0.1 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor/low/ignore |
| ipaddr.js@2.5.0 | 100 | 100 | 100 | 82.0 | 100 | No alerts returned |
| iterare@1.2.1 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| json-schema-ref-resolver@3.0.1 | 100 | 100 | 100 | 87.0 | 100 | No alerts returned |
| light-my-request@6.8.0 | 99.0 | 100 | 100 | 89.0 | 100 | networkAccess/middle/ignore |
| load-esm@1.0.3 | 100 | 100 | 95.0 | 79.0 | 100 | No alerts returned |
| merge-descriptors@2.0.0 | 100 | 100 | 80.0 | 79.0 | 100 | No alerts returned |
| mime-types@3.0.2 | 100 | 100 | 100 | 85.0 | 100 | No alerts returned |
| multer@2.5.0 | 99.0 | 100 | 100 | 92.0 | 100 | debugAccess/low/ignore; filesystemAccess/low/ignore |
| object-assign@4.1.1 | 67.0 | 100 | 85.0 | 50.0 | 100 | socketUpgradeAvailable/high/ignore; unmaintained/low/ignore |
| on-exit-leak-free@2.1.2 | 100 | 100 | 85.0 | 79.0 | 100 | No alerts returned |
| on-finished@2.4.2 | 100 | 100 | 100 | 86.0 | 100 | debugAccess/low/ignore |
| once@1.4.0 | 100 | 100 | 91.0 | 75.0 | 100 | unmaintained/low/ignore |
| parseurl@1.3.3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| path-to-regexp@8.4.2 | 100 | 100 | 100 | 91.0 | 100 | urlStrings/low/ignore |
| pino-abstract-transport@3.0.0 | 100 | 100 | 100 | 81.0 | 100 | newAuthor/low/ignore |
| pino-std-serializers@7.1.0 | 100 | 100 | 100 | 82.0 | 100 | No alerts returned |
| pino@10.4.0 | 98.0 | 100 | 100 | 89.0 | 100 | debugAccess/low/ignore ×2; envVars/low/ignore ×4; filesystemAccess/low/ignore; gptAnomaly/low/ignore; urlStrings/low/ignore |
| process-warning@5.1.1 | 100 | 100 | 100 | 89.0 | 100 | No alerts returned |
| progress@2.0.3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| proxy-addr@2.0.8 | 99.0 | 100 | 100 | 84.0 | 100 | No alerts returned |
| qs@6.17.1 | 99.0 | 100 | 100 | 97.0 | 100 | No alerts returned |
| quick-format-unescaped@4.0.4 | 100 | 100 | 89.0 | 75.0 | 100 | unmaintained/low/ignore |
| range-parser@1.3.0 | 100 | 100 | 95.0 | 85.0 | 100 | newAuthor/low/ignore |
| real-require@1.0.0 | 99.0 | 100 | 75.0 | 83.0 | 100 | dynamicRequire/low/ignore; newAuthor/low/ignore; trivialPackage/middle/ignore; usesEval/middle/ignore |
| reflect-metadata@0.2.2 | 100 | 100 | 99.0 | 80.0 | 80.0 | usesEval/middle/ignore |
| rfdc@1.4.1 | 100 | 100 | 100 | 81.0 | 100 | No alerts returned |
| router@2.2.0 | 99.0 | 100 | 100 | 83.0 | 100 | networkAccess/middle/ignore ×2; newAuthor/low/ignore |
| rxjs@7.8.2 | 99.0 | 100 | 100 | 88.0 | 100 | gptAnomaly/low/ignore |
| safe-regex2@5.1.2 | 100 | 100 | 90.0 | 87.0 | 100 | No alerts returned |
| safe-stable-stringify@2.5.0 | 100 | 100 | 100 | 84.0 | 100 | No alerts returned |
| secure-json-parse@4.1.1 | 100 | 100 | 100 | 89.0 | 100 | No alerts returned |
| semver@7.8.6 | 100 | 100 | 100 | 95.0 | 100 | envVars/low/ignore ×3; urlStrings/low/ignore |
| send@1.2.1 | 99.0 | 100 | 100 | 85.0 | 100 | filesystemAccess/low/ignore; gptAnomaly/low/ignore |
| serve-static@2.2.1 | 99.0 | 100 | 99.0 | 84.0 | 100 | No alerts returned |
| set-cookie-parser@3.2.2 | 100 | 100 | 100 | 93.0 | 100 | No alerts returned |
| sonic-boom@4.2.1 | 100 | 100 | 100 | 88.0 | 100 | filesystemAccess/low/ignore |
| statuses@2.0.2 | 100 | 100 | 99.0 | 83.0 | 100 | newAuthor/low/ignore |
| strtok3@10.7.0 | 100 | 100 | 100 | 93.0 | 100 | No alerts returned |
| sumchecker@3.0.1 | 99.0 | 100 | 98.0 | 75.0 | 100 | filesystemAccess/low/ignore; unmaintained/low/ignore |
| thread-stream@4.2.1 | 99.0 | 100 | 100 | 90.0 | 100 | envVars/low/ignore ×2; gptAnomaly/low/ignore |
| toad-cache@3.7.4 | 100 | 100 | 100 | 81.0 | 100 | No alerts returned |
| token-types@6.2.0 | 99.0 | 100 | 100 | 87.0 | 100 | No alerts returned |
| tslib@2.9.1 | 92.0 | 100 | 100 | 91.0 | 100 | newAuthor/low/ignore; unstableOwnership/high/monitor |
| type-is@1.6.18 | 100 | 100 | 100 | 87.0 | 100 | No alerts returned |
| type-is@2.1.0 | 99.0 | 100 | 100 | 87.0 | 100 | newAuthor/low/ignore |
| uid@2.0.2 | 100 | 100 | 99.0 | 79.0 | 100 | No alerts returned |
| uint8array-extras@1.6.0 | 100 | 100 | 100 | 82.0 | 100 | No alerts returned |
| undici-types@7.24.6 | 100 | 100 | 74.0 | 96.0 | 100 | No alerts returned |
| undici@7.30.1 | 92.0 | 100 | 99.0 | 97.0 | 100 | debugAccess/low/ignore ×8; envVars/low/ignore ×10; filesystemAccess/low/ignore; gptAnomaly/low/ignore; minifiedFile/low/ignore ×2; networkAccess/middle/ignore ×21 |
| vary@1.1.2 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |

## Relationships reviewed

- @electron/get@5.1.0: debug@4.4.3, env-paths@3.0.0, graceful-fs@4.2.11, progress@2.0.3, semver@7.8.6, sumchecker@3.0.1, undici@7.30.1
- @fastify/ajv-compiler@4.0.7: ajv-formats@3.0.1, ajv@8.20.0, fast-uri@4.2.3
- @fastify/fast-json-stringify-compiler@5.1.1: fast-json-stringify@7.2.1
- @fastify/proxy-addr@5.1.2: @fastify/forwarded@3.1.2, ipaddr.js@2.5.0
- @nestjs/common@12.3.3: @standard-schema/spec@1.1.0, file-type@22.3.0, iterare@1.2.1, load-esm@1.0.3, reflect-metadata@0.2.2, rxjs@7.8.2, tslib@2.9.1, uid@2.0.2
- @nestjs/core@12.3.3: @nestjs/common@12.3.3, @nestjs/platform-express@12.3.3, fast-safe-stringify@2.1.1, iterare@1.2.1, path-to-regexp@8.4.2, reflect-metadata@0.2.2, rxjs@7.8.2, tslib@2.9.1, uid@2.0.2
- @nestjs/platform-express@12.3.3: @nestjs/common@12.3.3, @nestjs/core@12.3.3, cors@2.8.6, express@5.3.0, multer@2.5.0, path-to-regexp@8.4.2, tslib@2.9.1
- @types/node@24.19.2: undici-types@7.24.6
- avvio@9.3.1: @fastify/error@4.2.1, fastq@1.20.3
- cors@2.8.6: object-assign@4.1.1, vary@1.1.2
- electron@45.2.2: @electron-internal/extract-zip@1.0.8, @electron/get@5.1.0, @types/node@24.19.2
- express@5.3.0: accepts@2.0.0, body-parser@2.4.0, content-disposition@2.0.1, content-type@2.1.0, cookie-signature@1.2.2, cookie@0.7.2, debug@4.4.3, depd@2.0.0, encodeurl@2.0.1, escape-html@1.0.3, etag@1.8.1, finalhandler@2.1.1, fresh@2.0.0, http-errors@2.0.1, merge-descriptors@2.0.0, mime-types@3.0.2, on-finished@2.4.2, once@1.4.0, parseurl@1.3.3, proxy-addr@2.0.8, qs@6.17.1, range-parser@1.3.0, router@2.2.0, send@1.2.1, serve-static@2.2.1, statuses@2.0.2, type-is@2.1.0, vary@1.1.2
- fast-json-stringify@7.2.1: @fastify/merge-json-schemas@0.2.2, ajv-formats@3.0.1, ajv@8.20.0, fast-uri@4.2.3, json-schema-ref-resolver@3.0.1, rfdc@1.4.1
- fastify@5.12.8: @fastify/ajv-compiler@4.0.7, @fastify/error@4.2.1, @fastify/fast-json-stringify-compiler@5.1.1, @fastify/proxy-addr@5.1.2, abstract-logging@2.0.1, avvio@9.3.1, fast-json-stringify@7.2.1, find-my-way@9.10.0, light-my-request@6.8.0, pino@10.4.0, process-warning@5.1.1, rfdc@1.4.1, secure-json-parse@4.1.1, semver@7.8.6, toad-cache@3.7.4
- file-type@22.3.0: @tokenizer/inflate@0.6.0, strtok3@10.7.0, token-types@6.2.0, uint8array-extras@1.6.0
- find-my-way@9.10.0: fast-deep-equal@3.1.3, fast-querystring@1.1.2, safe-regex2@5.1.2
- light-my-request@6.8.0: @fastify/deepmerge@3.2.4, cookie@2.0.1, process-warning@5.1.1, set-cookie-parser@3.2.2
- multer@2.5.0: append-field@1.0.0, busboy@1.6.0, type-is@1.6.18
- pino@10.4.0: @pinojs/redact@0.4.0, atomic-sleep@1.0.0, on-exit-leak-free@2.1.2, pino-abstract-transport@3.0.0, pino-std-serializers@7.1.0, process-warning@5.1.1, quick-format-unescaped@4.0.4, real-require@1.0.0, safe-stable-stringify@2.5.0, sonic-boom@4.2.1, thread-stream@4.2.1
- rxjs@7.8.2: tslib@2.9.1
- uid@2.0.2: @lukeed/csprng@1.1.0
