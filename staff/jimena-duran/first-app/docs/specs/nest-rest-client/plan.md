Issue: #1054

# Plan de la API REST con NestJS

Estado: implementación autorizada y comprobada en Windows; evidencia en tasks.md.
PATCH devuelve 200 con el usuario actualizado. Babel se mantiene como se describe aquí.
append-field y la cobertura por versión están resueltos; el 403 de campañas
se conserva como limitación de acceso no bloqueante.
La persona usuaria acepta los cuatro hallazgos altos documentados y autoriza instalar las versiones aprobadas e implementar las tareas. Nuevos paquetes o versiones requieren revisión propia.

## Arquitectura

Referencia local: src/clients/http/app.js y sus cinco imports de src/logic/.
El nuevo adaptador usará módulo, controlador, servicio y filtro de NestJS.
El servicio importará createUser, listUsers, findUserById, updateUser y
deleteUser directamente de ../../logic/, conservando sus firmas.
createUser({ name, email }) y updateUser(id, changes) no cambian.
El id llegará como texto; PATCH incluirá solo campos presentes.
No habrá SQL nuevo, acceso SQLite directo ni cambios en queries o logic.
Los clientes de terminal existentes ya prueban estas funciones.

JavaScript ESM con decoradores legacy de Babel; módulo @Module,
controlador @Controller y @Dependencies, servicio @Injectable, filtro @Catch.
@Bind permitirá recibir Body y Param sin metadatos de TypeScript.
El filtro mapeará los mensajes de docs/ERRORS.md a los estados de la spec.
Los errores inesperados usarán el Could not de la operación; las rutas
desconocidas devolverán 404 vacío. DELETE devolverá 204 vacío.

Nest escuchará en 127.0.0.1:3003. Express seguirá en 3001 y el servidor SQL
original en 3000. Todos compartirán la misma lógica y base existente.
Babel compilará src a dist conservando rutas relativas; se ejecutará solo
dist/clients/nest/main.js, nunca una copia del servidor SQL en dist.

## Archivos propuestos

Crear babel.config.json y src/clients/nest/ con main.js, app-module.js,
users-controller.js, users-service.js y http-exception-filter.js.
Actualizar package.json, pnpm-lock.yaml y eslint.config.js.
Añadir dist/ a .gitignore dentro de first-app y excluirlo de ESLint.
Actualizar docs/TREE.md, docs/ARCHITECTURE.md, docs/STYLE.md,
docs/ERRORS.md y README.md con estructura, excepción y comandos.
No modificar datos ni los clientes existentes.

Añadir script nest con limpieza mediante node:fs rmSync de dist local
(recursive y force), compilación Babel y ejecución Node. Evitar rm -rf,
que no funciona en PowerShell. La limpieza se limita al dist de first-app.
Añadir src/clients/nest/**/*.js al formato; configurar el parser Babel
solo para esos archivos y mantener reglas recomendadas.
Babel usará preset-env con targets.node current y modules false,
y plugin-proposal-decorators en modo legacy.

## Paquetes propuestos

Fijar @nestjs/common, @nestjs/core y @nestjs/platform-express en 12.3.3,
reflect-metadata en 0.2.2 y rxjs en 7.8.2.
Fijar como desarrollo @babel/cli y @babel/core en 8.1.0,
@babel/eslint-parser y @babel/preset-env en 8.0.7,
y @babel/plugin-proposal-decorators en 8.0.2.
Conservar versiones actuales de los paquetes existentes.
No incorporar validadores, microservicios, websockets ni @babel/node.
Comprobar engines para Node 24.22.0 y fijar resolución hasta tres capas
antes de instalar. Toda versión diferente exige revisión Socket propia.

## Revisión de paquetes

Reconsulta de la tarea 1 del 5 de noviembre de 2026. Se conserva el árbol
de 210 versiones aprobado, sin instalar, implementar ni cambiar versiones:
10 directas y 200 transitivas (99 en capa 1, 67 en capa 2 y 34 en capa 3).
Incluye dependencias normales y opcionales de forma conservadora; no
incluye devDependencies de transitivos ni peers opcionales ajenos al alcance.
La resolución futura del lock deberá coincidir o volver a revisión.

organizations confirmó Neoland, slug neoland-grrl6. SOCKET_API_TOKEN estaba
disponible en el proceso; solo se comprobó su presencia, sin mostrar ni
persistir el secreto, ni alterar OAuth. Según docs/SOCKET.md, se consultaron
los 210 PURL explícitos con alerts=true, poll=false, summary=true.
HTTP 200: 210 identidades verificadas por inputPurl, namespace/name,
versión e id, con campo alerts. Ausentes, duplicadas, discordantes,
pendingScan, notFound, errores y respuestas incompletas: cero.

PURL resuelve append-field@1.0.0: licencia 100, mantenimiento 75, calidad
80, cadena de suministro 100 y vulnerabilidad 100. Tiene unmaintained,
severidad low, acción ignore. depscore sigue devolviendo 2.0.0 al pedir
1.0.0; esa puntuación de otra versión no se usa. La columna Mínima recoge
las cinco métricas PURL de cada versión: ninguna de las 210 es inferior
a 50; el mínimo es 50 en mantenimiento de object-assign@4.1.1.

La consulta devuelve 225 hallazgos en 94 versiones y alerts vacío en 116.
La tabla agrupa tipo/severidad/acción y cantidad. Sin hallazgos PURL se
limita a esta respuesta, no implica seguridad universal. El anterior vacío
de alertas abiertas de organización no se extrapola a versiones.
ignore y monitor reflejan política de organización, no aceptación humana.

### Detalle de los cuatro hallazgos altos

Reconsulta PURL limitada a estas cuatro versiones: HTTP 200, cuatro
identidades exactas, sin errores de resolución. Se conservan versiones,
Babel y el árbol de 210 entradas.

| Versión consultada | Hallazgo, categoría y acción | Qué señala y propuesta exacta de Socket |
| --- | --- | --- |
| tslib@2.9.1 | unstableOwnership; high; supplyChainRisk; monitor por org-policy | La respuesta identifica author: microsoft1es. Señala publicaciones de un colaborador nuevo y posible inestabilidad de propiedad; no demuestra malware. No incluye fix ni cambio de versión recomendado. |
| object-assign@4.1.1 | socketUpgradeAvailable; high; maintenance; ignore por org-policy | Propone replacementPURL pkg:npm/%40socketregistry/object-assign@1.0.5, interop cjs, categories cleanup, deprecated false. fix.type: upgrade; fix.description: Run `npx socket optimize`. |
| es-define-property@1.0.1 | socketUpgradeAvailable; high; maintenance; ignore por org-policy | Propone replacementPURL pkg:npm/%40socketregistry/es-define-property@1.0.7, interop cjs, categories cleanup, deprecated false. fix.type: upgrade; fix.description: Run `npx socket optimize`. |
| side-channel@1.1.1 | socketUpgradeAvailable; high; maintenance; ignore por org-policy | Propone replacementPURL pkg:npm/%40socketregistry/side-channel@1.0.10, interop cjs, categories cleanup, deprecated false. fix.type: upgrade; fix.description: Run `npx socket optimize`. |

Las tres propuestas socketUpgradeAvailable son sustituciones por paquetes
del registro Socket, no una exigencia de subir la versión SemVer del paquete
actual. No se ejecuta la sugerencia ni se incorporan overrides.
Las reglas locales de paquetes exigen presentar los hallazgos para que
la persona responsable decida si los acepta; no obligan a cambiar versiones.
Un cambio de paquete o versión requeriría su propia revisión Socket.
Las acciones ignore y monitor no son esa decisión humana.

Fuentes oficiales: [unstableOwnership](https://socket.dev/alerts/unstableOwnership)
y [socketUpgradeAvailable](https://socket.dev/alerts/socketUpgradeAvailable).

El reintento MCP threat_feed mantiene HTTP 403 threat_feed_not_entitled:
la organización no tiene habilitado el acceso a campañas. Se conserva
como limitación de acceso: no se verifica presencia ni ausencia de
campañas para ninguna de las 210 versiones. Por instrucción expresa
de la persona usuaria, este 403 deja de ser un bloqueo de la tarea.
append-field@1.0.0 y la cobertura de alertas por versión ya están resueltos.
La persona usuaria acepta los cuatro hallazgos altos descritos y autoriza
instalar las versiones aprobadas e implementar las tareas, manteniendo
Babel y el alcance. Esta aceptación no se extiende a versiones nuevas.

Node 24.22.0 cumple los engines directos: @nestjs/core@12.3.3 requiere >=20
y los cinco Babel requieren ^22.18.0 || >=24.11.0; los otros cuatro
directos no declaran engine Node en sus metadatos.

| Paquete y versión | Capa | Mínima | Alertas por versión y campañas |
| --- | --- | --- | --- |
| @babel/cli@8.1.0 | 0 | 75 | Sin hallazgos PURL; campañas no verificadas |
| @babel/core@8.1.0 | 0 | 78 | envVars/low/ignore x3; urlStrings/low/ignore x1; campañas no verificadas |
| @babel/eslint-parser@8.0.7 | 0 | 75 | debugAccess/low/ignore x1; campañas no verificadas |
| @babel/plugin-proposal-decorators@8.0.2 | 0 | 73 | Sin hallazgos PURL; campañas no verificadas |
| @babel/preset-env@8.0.7 | 0 | 75 | urlStrings/low/ignore x1; campañas no verificadas |
| @nestjs/common@12.3.3 | 0 | 96 | debugAccess/low/ignore x1; envVars/low/ignore x3; campañas no verificadas |
| @nestjs/core@12.3.3 | 0 | 95 | debugAccess/low/ignore x2; envVars/low/ignore x1; networkAccess/middle/ignore x2; urlStrings/low/ignore x1; campañas no verificadas |
| @nestjs/platform-express@12.3.3 | 0 | 96 | networkAccess/middle/ignore x2; campañas no verificadas |
| reflect-metadata@0.2.2 | 0 | 80 | usesEval/middle/ignore x1; campañas no verificadas |
| rxjs@7.8.2 | 0 | 88 | gptAnomaly/low/ignore x1; campañas no verificadas |
| @babel/code-frame@8.0.6 | 1 | 73 | Sin hallazgos PURL; campañas no verificadas |
| @babel/compat-data@8.0.5 | 1 | 75 | Sin hallazgos PURL; campañas no verificadas |
| @babel/generator@8.1.0 | 1 | 78 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-compilation-targets@8.0.7 | 1 | 74 | envVars/low/ignore x2; campañas no verificadas |
| @babel/helper-create-class-features-plugin@8.0.10 | 1 | 77 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/helper-plugin-utils@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-validator-option@8.0.0 | 1 | 71 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helpers@8.1.0 | 1 | 76 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/parser@8.1.0 | 1 | 80 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1 | 1 | 68 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 | 1 | 68 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1 | 1 | 72 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-syntax-decorators@8.0.1 | 1 | 67 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-arrow-functions@8.0.1 | 1 | 66 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-async-generator-functions@8.0.6 | 1 | 72 | usesEval/middle/ignore x1; campañas no verificadas |
| @babel/plugin-transform-async-to-generator@8.0.1 | 1 | 69 | usesEval/middle/ignore x2; campañas no verificadas |
| @babel/plugin-transform-block-scoped-functions@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-block-scoping@8.0.10 | 1 | 75 | usesEval/middle/ignore x2; campañas no verificadas |
| @babel/plugin-transform-class-properties@8.0.1 | 1 | 64 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-class-static-block@8.0.5 | 1 | 72 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-classes@8.1.0 | 1 | 75 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-computed-properties@8.0.1 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-destructuring@8.0.5 | 1 | 75 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-dotall-regex@8.0.1 | 1 | 62 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-duplicate-keys@8.0.1 | 1 | 69 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-dynamic-import@8.0.1 | 1 | 67 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-explicit-resource-management@8.0.5 | 1 | 72 | usesEval/middle/ignore x2; campañas no verificadas |
| @babel/plugin-transform-exponentiation-operator@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-export-namespace-from@8.1.0 | 1 | 69 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-for-of@8.0.7 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-function-name@8.0.1 | 1 | 66 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-json-strings@8.0.1 | 1 | 66 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-literals@8.0.1 | 1 | 66 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-logical-assignment-operators@8.0.1 | 1 | 69 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-member-expression-literals@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-modules-amd@8.0.1 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-modules-commonjs@8.0.1 | 1 | 73 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-modules-systemjs@8.1.0 | 1 | 74 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-modules-umd@8.0.1 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-named-capturing-groups-regex@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-new-target@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-nullish-coalescing-operator@8.0.1 | 1 | 69 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-numeric-separator@8.0.1 | 1 | 66 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-object-rest-spread@8.0.1 | 1 | 75 | urlStrings/low/ignore x1; usesEval/middle/ignore x1; campañas no verificadas |
| @babel/plugin-transform-object-super@8.0.1 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-optional-catch-binding@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-optional-chaining@8.0.5 | 1 | 73 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-parameters@8.0.5 | 1 | 75 | urlStrings/low/ignore x1; usesEval/middle/ignore x2; campañas no verificadas |
| @babel/plugin-transform-private-methods@8.0.1 | 1 | 65 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-private-property-in-object@8.0.5 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-property-literals@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-regenerator@8.0.6 | 1 | 76 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-regexp-modifiers@8.0.1 | 1 | 62 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-reserved-words@8.0.1 | 1 | 64 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-shorthand-properties@8.0.1 | 1 | 69 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-spread@8.0.8 | 1 | 72 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-sticky-regex@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-template-literals@8.0.1 | 1 | 71 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/plugin-transform-typeof-symbol@8.0.1 | 1 | 69 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-unicode-escapes@8.0.1 | 1 | 71 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-unicode-property-regex@8.0.1 | 1 | 65 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-unicode-regex@8.0.1 | 1 | 62 | Sin hallazgos PURL; campañas no verificadas |
| @babel/plugin-transform-unicode-sets-regex@8.0.1 | 1 | 62 | Sin hallazgos PURL; campañas no verificadas |
| @babel/preset-modules@0.2.0 | 1 | 84 | Sin hallazgos PURL; campañas no verificadas |
| @babel/template@8.0.0 | 1 | 75 | Sin hallazgos PURL; campañas no verificadas |
| @babel/traverse@8.1.0 | 1 | 79 | usesEval/middle/ignore x1; campañas no verificadas |
| @babel/types@8.1.0 | 1 | 80 | Sin hallazgos PURL; campañas no verificadas |
| @jridgewell/trace-mapping@0.3.31 | 1 | 80 | Sin hallazgos PURL; campañas no verificadas |
| @standard-schema/spec@1.1.0 | 1 | 82 | Sin hallazgos PURL; campañas no verificadas |
| @types/gensync@1.0.5 | 1 | 70 | Sin hallazgos PURL; campañas no verificadas |
| babel-plugin-polyfill-corejs3@1.0.0 | 1 | 83 | Sin hallazgos PURL; campañas no verificadas |
| chokidar@5.0.0 | 1 | 85 | envVars/low/ignore x2; filesystemAccess/low/ignore x4; campañas no verificadas |
| commander@14.0.3 | 1 | 83 | envVars/low/ignore x7; filesystemAccess/low/ignore x1; shellAccess/middle/ignore x1; campañas no verificadas |
| convert-source-map@2.0.0 | 1 | 81 | newAuthor/low/ignore x1; urlStrings/low/ignore x1; campañas no verificadas |
| core-js-compat@3.51.0 | 1 | 87 | Sin hallazgos PURL; campañas no verificadas |
| cors@2.8.6 | 1 | 83 | newAuthor/low/ignore x1; campañas no verificadas |
| empathic@2.1.0 | 1 | 83 | Sin hallazgos PURL; campañas no verificadas |
| eslint-scope@9.1.2 | 1 | 84 | Sin hallazgos PURL; campañas no verificadas |
| eslint-visitor-keys@5.0.1 | 1 | 83 | Sin hallazgos PURL; campañas no verificadas |
| express@5.3.0 | 1 | 92 | dynamicRequire/low/ignore x1; envVars/low/ignore x1; filesystemAccess/low/ignore x1; networkAccess/middle/ignore x5; campañas no verificadas |
| fast-safe-stringify@2.1.1 | 1 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| file-type@22.3.0 | 1 | 93 | Sin hallazgos PURL; campañas no verificadas |
| gensync@1.0.0-beta.2 | 1 | 75 | gptAnomaly/low/ignore x1; unmaintained/low/ignore x1; campañas no verificadas |
| glob@14.0.3 | 1 | 92 | debugAccess/low/ignore x1; envVars/low/ignore x2; filesystemAccess/low/ignore x3; minifiedFile/low/ignore x2; networkAccess/middle/ignore x12; campañas no verificadas |
| import-meta-resolve@4.2.0 | 1 | 79 | debugAccess/low/ignore x2; filesystemAccess/low/ignore x2; campañas no verificadas |
| iterare@1.2.1 | 1 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| json5@2.2.3 | 1 | 81 | gptAnomaly/low/ignore x2; campañas no verificadas |
| load-esm@1.0.3 | 1 | 79 | Sin hallazgos PURL; campañas no verificadas |
| multer@2.5.0 | 1 | 92 | debugAccess/low/ignore x1; filesystemAccess/low/ignore x1; campañas no verificadas |
| obug@3.0.0 | 1 | 90 | gptDidYouMean/middle/ignore x1; campañas no verificadas |
| path-to-regexp@8.4.2 | 1 | 91 | urlStrings/low/ignore x1; campañas no verificadas |
| slash@5.1.0 | 1 | 72 | Sin hallazgos PURL; campañas no verificadas |
| tslib@2.9.1 | 1 | 91 | newAuthor/low/ignore x1; unstableOwnership/high/monitor x1; campañas no verificadas |
| uid@2.0.2 | 1 | 79 | Sin hallazgos PURL; campañas no verificadas |
| verkit@0.5.0 | 1 | 88 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-annotate-as-pure@8.0.0 | 2 | 64 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-create-regexp-features-plugin@8.0.7 | 2 | 72 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-define-polyfill-provider@1.0.0 | 2 | 76 | urlStrings/low/ignore x1; campañas no verificadas |
| @babel/helper-globals@8.0.6 | 2 | 75 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-member-expression-to-functions@8.0.5 | 2 | 74 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-module-imports@8.0.0 | 2 | 75 | dynamicRequire/low/ignore x4; campañas no verificadas |
| @babel/helper-module-transforms@8.1.0 | 2 | 76 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-optimise-call-expression@8.0.0 | 2 | 68 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-remap-async-to-generator@8.0.1 | 2 | 70 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-replace-supers@8.0.1 | 2 | 73 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-skip-transparent-expression-wrappers@8.1.0 | 2 | 66 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-string-parser@8.0.8 | 2 | 74 | Sin hallazgos PURL; campañas no verificadas |
| @babel/helper-validator-identifier@8.0.6 | 2 | 72 | Sin hallazgos PURL; campañas no verificadas |
| @jridgewell/gen-mapping@0.4.0-beta.0 | 2 | 80 | Sin hallazgos PURL; campañas no verificadas |
| @jridgewell/resolve-uri@3.1.2 | 2 | 79 | urlStrings/low/ignore x1; campañas no verificadas |
| @jridgewell/sourcemap-codec@1.6.0 | 2 | 81 | Sin hallazgos PURL; campañas no verificadas |
| @lukeed/csprng@1.1.0 | 2 | 79 | Sin hallazgos PURL; campañas no verificadas |
| @tokenizer/inflate@0.6.0 | 2 | 90 | Sin hallazgos PURL; campañas no verificadas |
| @types/esrecurse@4.3.1 | 2 | 79 | Sin hallazgos PURL; campañas no verificadas |
| @types/estree@1.0.10 | 2 | 74 | Sin hallazgos PURL; campañas no verificadas |
| @types/jsesc@2.5.1 | 2 | 69 | Sin hallazgos PURL; campañas no verificadas |
| accepts@2.0.0 | 2 | 84 | newAuthor/low/ignore x1; campañas no verificadas |
| append-field@1.0.0 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| body-parser@2.4.0 | 2 | 93 | Sin hallazgos PURL; campañas no verificadas |
| browserslist@4.29.5 | 2 | 90 | dynamicRequire/low/ignore x2; envVars/low/ignore x19; filesystemAccess/low/ignore x1; urlStrings/low/ignore x1; campañas no verificadas |
| busboy@1.6.0 | 2 | 80 | Sin hallazgos PURL; campañas no verificadas |
| content-disposition@2.0.1 | 2 | 86 | Sin hallazgos PURL; campañas no verificadas |
| content-type@2.1.0 | 2 | 88 | Sin hallazgos PURL; campañas no verificadas |
| cookie@0.7.2 | 2 | 85 | Sin hallazgos PURL; campañas no verificadas |
| cookie-signature@1.2.2 | 2 | 69 | Sin hallazgos PURL; campañas no verificadas |
| debug@4.4.3 | 2 | 81 | envVars/low/ignore x6; campañas no verificadas |
| depd@2.0.0 | 2 | 75 | envVars/low/ignore x2; unmaintained/low/ignore x1; usesEval/middle/ignore x1; campañas no verificadas |
| encodeurl@2.0.1 | 2 | 90 | Sin hallazgos PURL; campañas no verificadas |
| escape-html@1.0.3 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| esrecurse@4.3.0 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| estraverse@5.3.0 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| esutils@2.0.3 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| etag@1.8.1 | 2 | 75 | filesystemAccess/low/ignore x1; unmaintained/low/ignore x1; campañas no verificadas |
| finalhandler@2.1.1 | 2 | 84 | envVars/low/ignore x1; campañas no verificadas |
| flru@1.0.2 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| fresh@2.0.0 | 2 | 83 | Sin hallazgos PURL; campañas no verificadas |
| http-errors@2.0.1 | 2 | 84 | newAuthor/low/ignore x1; campañas no verificadas |
| js-tokens@10.0.0 | 2 | 72 | Sin hallazgos PURL; campañas no verificadas |
| jsesc@3.1.0 | 2 | 79 | Sin hallazgos PURL; campañas no verificadas |
| merge-descriptors@2.0.0 | 2 | 79 | Sin hallazgos PURL; campañas no verificadas |
| mime-types@3.0.2 | 2 | 85 | Sin hallazgos PURL; campañas no verificadas |
| minimatch@11.0.4 | 2 | 95 | envVars/low/ignore x2; campañas no verificadas |
| minipass@7.1.3 | 2 | 80 | Sin hallazgos PURL; campañas no verificadas |
| object-assign@4.1.1 | 2 | 50 | unmaintained/low/ignore x1; socketUpgradeAvailable/high/ignore x1; campañas no verificadas |
| on-finished@2.4.2 | 2 | 86 | debugAccess/low/ignore x1; campañas no verificadas |
| once@1.4.0 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| parseurl@1.3.3 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| path-scurry@3.0.0 | 2 | 86 | filesystemAccess/low/ignore x6; campañas no verificadas |
| proxy-addr@2.0.8 | 2 | 84 | Sin hallazgos PURL; campañas no verificadas |
| qs@6.17.1 | 2 | 96 | Sin hallazgos PURL; campañas no verificadas |
| range-parser@1.3.0 | 2 | 85 | newAuthor/low/ignore x1; campañas no verificadas |
| readdirp@5.1.1 | 2 | 83 | filesystemAccess/low/ignore x1; campañas no verificadas |
| router@2.2.0 | 2 | 83 | networkAccess/middle/ignore x2; newAuthor/low/ignore x1; campañas no verificadas |
| send@1.2.1 | 2 | 85 | gptAnomaly/low/ignore x1; filesystemAccess/low/ignore x1; campañas no verificadas |
| serve-static@2.2.1 | 2 | 84 | Sin hallazgos PURL; campañas no verificadas |
| statuses@2.0.2 | 2 | 83 | newAuthor/low/ignore x1; campañas no verificadas |
| strtok3@10.7.0 | 2 | 93 | Sin hallazgos PURL; campañas no verificadas |
| token-types@6.2.0 | 2 | 87 | Sin hallazgos PURL; campañas no verificadas |
| type-is@1.6.18 | 2 | 87 | Sin hallazgos PURL; campañas no verificadas |
| type-is@2.1.0 | 2 | 87 | newAuthor/low/ignore x1; campañas no verificadas |
| uint8array-extras@1.6.0 | 2 | 82 | Sin hallazgos PURL; campañas no verificadas |
| vary@1.1.2 | 2 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| @babel/helper-wrap-function@8.0.0 | 3 | 72 | Sin hallazgos PURL; campañas no verificadas |
| @borewit/text-codec@0.2.3 | 3 | 87 | Sin hallazgos PURL; campañas no verificadas |
| @isaacs/nonrecursive-glob-match@1.0.3 | 3 | 91 | Sin hallazgos PURL; campañas no verificadas |
| @tokenizer/token@0.3.0 | 3 | 64 | unmaintained/low/ignore x1; campañas no verificadas |
| baseline-browser-mapping@2.11.35 | 3 | 96 | envVars/low/ignore x3; minifiedFile/low/ignore x1; campañas no verificadas |
| brace-expansion@5.0.12 | 3 | 93 | Sin hallazgos PURL; campañas no verificadas |
| bytes@3.1.2 | 3 | 81 | Sin hallazgos PURL; campañas no verificadas |
| caniuse-lite@1.0.30001820 | 3 | 74 | Sin hallazgos PURL; campañas no verificadas |
| ee-first@1.1.1 | 3 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| electron-to-chromium@1.5.477 | 3 | 96 | Sin hallazgos PURL; campañas no verificadas |
| es-define-property@1.0.1 | 3 | 53 | socketUpgradeAvailable/high/ignore x1; campañas no verificadas |
| forwarded@0.2.0 | 3 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| iconv-lite@0.7.3 | 3 | 93 | urlStrings/low/ignore x1; campañas no verificadas |
| ieee754@1.2.1 | 3 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| inherits@2.0.4 | 3 | 75 | unmaintained/low/ignore x1; campañas no verificadas |
| ipaddr.js@1.9.1 | 3 | 82 | gptAnomaly/low/ignore x1; campañas no verificadas |
| is-promise@4.0.0 | 3 | 66 | unmaintained/low/ignore x1; campañas no verificadas |
| lodash.debounce@4.0.8 | 3 | 74 | unmaintained/low/ignore x1; urlStrings/low/ignore x1; usesEval/middle/ignore x1; campañas no verificadas |
| lru-cache@11.5.3 | 3 | 88 | minifiedFile/low/ignore x2; networkAccess/middle/ignore x12; campañas no verificadas |
| media-typer@0.3.0 | 3 | 84 | Sin hallazgos PURL; campañas no verificadas |
| media-typer@1.1.1 | 3 | 84 | Sin hallazgos PURL; campañas no verificadas |
| mime-db@1.54.0 | 3 | 84 | Sin hallazgos PURL; campañas no verificadas |
| mime-types@2.1.35 | 3 | 85 | gptAnomaly/low/ignore x1; campañas no verificadas |
| ms@2.1.3 | 3 | 84 | Sin hallazgos PURL; campañas no verificadas |
| negotiator@1.1.0 | 3 | 85 | Sin hallazgos PURL; campañas no verificadas |
| node-releases@2.0.63 | 3 | 81 | Sin hallazgos PURL; campañas no verificadas |
| raw-body@3.0.2 | 3 | 86 | debugAccess/low/ignore x1; campañas no verificadas |
| regexpu-core@6.5.4 | 3 | 93 | Sin hallazgos PURL; campañas no verificadas |
| setprototypeof@1.2.0 | 3 | 73 | unmaintained/low/ignore x1; campañas no verificadas |
| side-channel@1.1.1 | 3 | 53 | socketUpgradeAvailable/high/ignore x1; campañas no verificadas |
| streamsearch@1.1.0 | 3 | 79 | Sin hallazgos PURL; campañas no verificadas |
| toidentifier@1.0.1 | 3 | 82 | Sin hallazgos PURL; campañas no verificadas |
| update-browserslist-db@1.3.4 | 3 | 82 | envVars/low/ignore x1; filesystemAccess/low/ignore x1; shellAccess/middle/ignore x1; campañas no verificadas |
| wrappy@1.0.2 | 3 | 73 | newAuthor/low/ignore x1; unmaintained/low/ignore x1; campañas no verificadas |

## Verificación prevista en Windows

Entorno comprobado: Node v24.22.0; corepack pnpm --version devuelve 12.14.0.
pnpm no está directamente en PATH. No cambiar configuración global.

Desde staff/jimena-duran/first-app, en terminales separadas:

```powershell
corepack pnpm server
corepack pnpm http
corepack pnpm nest
```

El último comando será válido después de implementar el script propuesto.
Para las pruebas se usará una copia desechable con datos ficticios, según
docs/DATABASE.md, ejecutada en este mismo entorno Windows. Sus puertos
deben estar libres; no detener procesos ajenos ni inicializar la base personal.
Preparar la tabla solo en esa copia con el cliente de creación ya existente.
Los comandos anteriores también describen el arranque habitual de la app.

Prueba manual prevista en otra terminal PowerShell:

```powershell
$api = "http://127.0.0.1:3003/users"
$email = "nest-$([guid]::NewGuid().ToString('N'))@example.com"
$body = @{ name = "Ana"; email = $email } | ConvertTo-Json
$user = Invoke-RestMethod $api -Method Post -ContentType "application/json" -Body $body
Invoke-RestMethod $api
Invoke-RestMethod "$api/$($user.id)"
$changes = @{ name = "Ana Durán" } | ConvertTo-Json
Invoke-RestMethod "$api/$($user.id)" -Method Patch -ContentType "application/json" -Body $changes
Invoke-RestMethod "http://127.0.0.1:3001/users/$($user.id)"
Invoke-WebRequest "$api/$($user.id)" -Method Delete -UseBasicParsing
```

Registrar estados, cuerpos, fechas y conservación de email e id.
Probar nombre vacío y email inválido (400), duplicado (409) y usuario
inexistente en GET/PATCH/DELETE (404), sin altas adicionales.
Verificar ruta desconocida 404 vacío y DELETE 204 vacío.
Probar las cinco operaciones con servidor SQL detenido: 500 y mensaje de
su operación; probar campo requerido ausente: 500 de su operación.
Reiniciar SQL al terminar y eliminar únicamente usuarios creados por las
pruebas. No asumir que la base está vacía ni borrar usuarios previos.
Comprobar Express simultáneamente y compartir datos en ambos sentidos.
Ejecutar corepack pnpm format y corepack pnpm lint; revisar que no cambien
archivos fuera de alcance. Registrar evidencia real tras autorización.

## Decisiones de revisión

STYLE.md prohíbe clases, métodos propios y this. NestJS requiere esa forma.
Se aprueba en el plan una excepción limitada a src/clients/nest/ para clases, métodos,
this y decoradores, conservando nombres de archivo kebab-case.
ERRORS.md deberá permitir el filtro de transporte sin crear clases de error
de negocio. La aprobación incluye estas excepciones y la actualización
documental propuesta. La autorización posterior permite ejecutarlas.
Los cuatro hallazgos altos se aceptan expresamente; campañas conserva
la limitación de acceso no bloqueante descrita arriba.


