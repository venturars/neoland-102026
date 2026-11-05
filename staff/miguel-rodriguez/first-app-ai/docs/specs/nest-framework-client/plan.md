# Plan — cliente Nest

Issue #1044 · PR #1050 hacia staging. Referencia: spec.md.
Autorización conjunta de Miguel del 2026-11-05 antes de implementar.

## Recorrido

main.js importa reflect-metadata y arranca AppModule en loopback3003.
AppModule registra UsersController, UsersService y el filtro global con APP_FILTER.
El controlador usa clases y decoradores normales: Controller, rutas, Bind, Body,
Param, HttpCode y Dependencies(UsersService). Nest construye e inyecta el servicio;
no se crea a mano. Sus métodos esperan las cinco operaciones compartidas.
Los IDs de HTTP se convierten a número, como requieren nuestras funciones.
PATCH construye changes únicamente con los campos definidos del cuerpo.

UsersService usa Injectable y delega directamente a logic. El filtro convierte
los nueve mensajes existentes a los estados de la spec; reconoce HttpException
para el 404 vacío y oculta errores desconocidos tras el Could not de la acción.
No se añaden validadores ni reglas a la lógica.

## Archivos y herramientas

Cinco archivos nuevos en src/clients/nest: main.js, app.module.js,
users.controller.js, users.service.js, http-exception.filter.js.
Babel compila src completo a dist para conservar los imports relativos.
babel.config.json usa preset-env con targets.node=current, modules=false y
plugin-proposal-decorators legacy. pnpm nest compila y ejecuta main compilado.
Se ignora dist. ESLint usa babel/eslint-parser solo para Nest y permite clases,
this y métodos exclusivamente allí; documentar esa excepción en STYLE y ERRORS.
Actualizar package, lockfile, excepciones exactas de antigüedad, README, árbol,
arquitectura y constitución. Las versiones exactas y revisión están debajo.

## Verificación

Compilar, formato y lint. Comparar el árbol instalado de tres capas contra la
revisión, sin editar el lockfile a mano. Pruebas en una copia desechable con
puertos alternativos: cinco CRUD, orden, campos, edición de cada campo por
separado, email ocupado, nombre/email inválido, usuario ausente, cinco fallos
con datos inaccesibles y 404 vacío. Probar inyección sustituyendo el proveedor
por otro servicio en un módulo de prueba que usa el controlador real; comprobar
que la instancia inyectada responde, y el filtro oculta errores desconocidos.
Contrastar una escritura mediante queries compartidas. La colección Postman
reutiliza localhost3003; distinguir ejecución HTTP automatizada de ejecución
real en Postman. Conservar la demostración abierta del alumno.

## Revisión previa

La división responde al objetivo docente de clases, decoradores e inyección.
Babel y su parser son los únicos soportes adicionales de compilación/lint.
La spec fija los resultados; este plan fija la técnica. No se reutiliza el
adaptador retirado, Express como otro servidor intermediario, ni código literal
del profesor. Los otros clientes y la lógica quedan en sus propias entregas.

# Nest and Babel dependency review — 5 November 2026

## Technical decision delegated by Miguel

On 5 November, after receiving the findings and coverage gaps, Miguel answered:
“Review and approve based on what Ventura asked and his reference.” The principal
and an independent reviewer recommend the exact proposal for this local exercise.
The packages support the actual controller/service/module/filter, dependency
injection and Babel approach demonstrated in #981. No alternative runtime,
TypeScript setup, validators or interface libraries are proposed.

This records a technical decision made under that delegation, not a claim that
Miguel personally assessed every alert. The minimatch vulnerability, ownership
warning, replacement suggestion and 52 incomplete checks below remain open
findings. The release-age exceptions apply only to the three exact Nest versions.
The existing lint path uses project-controlled patterns; this reduces exposure
to the minimatch issue in the exercise without fixing the vulnerability.

The implementation still requires the separate spec, plan and tasks approvals.
After installation, compare the actual three-layer resolution with this review.

Exact teacher proposal: @nestjs/common@12.3.3, @nestjs/core@12.3.3, @nestjs/platform-express@12.3.3, reflect-metadata@0.2.2, rxjs@7.8.2, @babel/cli@8.1.0, @babel/core@8.1.0, @babel/eslint-parser@8.0.7, @babel/plugin-proposal-decorators@8.0.2, @babel/preset-env@8.0.7.

No packages installed or executed. Resolved metadata with `pnpm install --lockfile-only --ignore-scripts --reporter=append-only` in this disposable folder. Node 24.22.1; pnpm 12.15.0; platform darwin-arm64. The app was not edited.

Three layers contain **202 unique exact versions** and 507 root-specific relationships. This includes 63 versions already in fresh staging. All 202 versions are present in the teacher reference lock from PR #981 head a2ff7f23d5c32aefa1daae771b7075c1110c8095. Required/resolved optional peers are included; absent optional peers are listed below. Fourth-layer dependencies are outside this review. No OS/CPU/libc restrictions occurred within the three reviewed layers.

pnpm generated release-age exceptions for only @nestjs/common@12.3.3, @nestjs/core@12.3.3, and @nestjs/platform-express@12.3.3. They were published on 4 November and must be included in the proposal decision.

## Socket coverage

Source: POST https://api.socket.dev/v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20; exact purls; no severity/action/package alert filtering. API scores 0–1 converted to 0–100. Scoped namespace/name/version and inputPurl checked. Four batches returned 200 with 200 matching identities; the fifth returned HTTP 429. No retries after the quota failure.

**150/202 complete**, **50 pendingScan**, **2 quota-blocked**. Complete results contain 750 score values, minimum 50; none returned below 50. Unknown scores are not treated as passing.

Category minima (0–100): supplyChain 67.0, vulnerability 99.0, quality 62.0, maintenance 50.0, license 80.0.

All returned alerts: 263 ({'low': 174, 'middle': 87, 'high': 2}). This includes the 50 pendingScan markers. `all-alerts-unfiltered.json` retains every alert, file, properties, severity, action and action source, including ignored/low alerts. These counts do not establish absence of findings in incomplete versions.

## Material findings

- **object-assign@4.1.1** — socketUpgradeAvailable, high, maintenance, action ignore.
  - Path: @nestjs/platform-express@12.3.3 → cors@2.8.6 → object-assign@4.1.1.
  - Socket recommends its own replacement package. This is not a CVE. No optimizer/substitution was run.
- **minimatch@10.2.6** — mediumCVE, middle, vulnerability, action monitor.
  - Path: @babel/eslint-parser@8.0.7 → eslint@10.13.0 → minimatch@10.2.6.
  - CVE-2026-118764 / GHSA-g3hv-75wg-m249: minimatch has potential denial of service via globparts amplification. CVSS 6.9.
  - Attacker-controlled glob patterns with optimizationLevel >= 2 can amplify CPU/memory use. The reviewed path is @babel/eslint-parser@8.0.7 → existing eslint@10.13.0 → minimatch@10.2.6. It is lint tooling, not an HTTP route. The exact vulnerable version already exists in the fresh staging lock; adding Babel does not introduce or upgrade it, but the three-layer rule still requires reviewing it.
  - Socket affected range >= 7.0.0 < 11.0.1; first patched 11.0.1. No upgrade/override has been applied or proposed as already approved.
  - Primary advisory: https://github.com/advisories/GHSA-g3hv-75wg-m249
- **tslib@2.9.1** — unstableOwnership, high, supplyChainRisk, action monitor.
  - Path: @nestjs/common@12.3.3 → rxjs@7.8.2 → tslib@2.9.1.
  - Path: @nestjs/common@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/core@12.3.3 → @nestjs/common@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/core@12.3.3 → rxjs@7.8.2 → tslib@2.9.1.
  - Path: @nestjs/core@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/core@12.3.3 → @nestjs/platform-express@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/platform-express@12.3.3 → @nestjs/common@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/platform-express@12.3.3 → @nestjs/core@12.3.3 → tslib@2.9.1.
  - Path: @nestjs/platform-express@12.3.3 → tslib@2.9.1.
  - Path: rxjs@7.8.2 → tslib@2.9.1.
  - Ownership change to microsoft1es. A supply-chain warning, not proof of malware.

Other returned alerts include environment access, filesystem/network/process access, eval/dynamic require, new authors, unmaintained releases, minified files and heuristic anomaly/lookalike warnings. Full unfiltered records below and in JSON; organizational ignore does not mean Miguel accepted them.

## Remaining coverage limits

- campaigns: coverage limited by the Socket plan.
- Current Socket MCP tools are not exposed in this session. Historical organization/plan result: neoland free, recorded in the 4 November complete-user-clients plan; not represented as a new organizations query.
- GET https://api.socket.dev/v0/orgs/neoland/alerts?per_page=1000 returned HTTP403, required scope alerts:list. Organization-monitored alerts and pagination could not be examined; this is separate from the exact-version alerts above.
- GET https://api.socket.dev/v0/orgs/neoland/threat-feed?per_page=100&filter=c returned HTTP403, required scope threat-feed:list. This response establishes a permission gap, not a new entitlement determination. The earlier review recorded threat_feed_not_entitled under MCP access.
- No current dashboard session was opened. The user-provided 27 October dashboard screenshot showed only a limited campaign list; historical context, not complete current campaign coverage.
- Official coverage sources consulted: https://docs.socket.dev/reference/getorgthreatfeeditems (special feed access and scope); https://docs.socket.dev/reference/alertslist (organization alerts and pagination); https://socket.dev/changelog/new-campaigns-tab-on-the-threat-intel-page (campaign dashboard distinct from individual alerts). No absence of campaigns inferred.

## Unknown exact versions

| Package/version | Reason |
| --- | --- |
| @babel/plugin-transform-for-of@8.0.7 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-function-name@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-json-strings@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-literals@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-logical-assignment-operators@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-member-expression-literals@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-modules-amd@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-modules-commonjs@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-modules-systemjs@8.1.0 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-modules-umd@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-named-capturing-groups-regex@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-new-target@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-nullish-coalescing-operator@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-numeric-separator@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-object-rest-spread@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-object-super@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-optional-catch-binding@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-optional-chaining@8.0.5 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-parameters@8.0.5 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-private-methods@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-private-property-in-object@8.0.5 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-property-literals@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-regenerator@8.0.6 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-regexp-modifiers@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-reserved-words@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-shorthand-properties@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-spread@8.0.8 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-sticky-regex@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-template-literals@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-typeof-symbol@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-unicode-escapes@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-unicode-property-regex@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-unicode-regex@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/plugin-transform-unicode-sets-regex@8.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/preset-env@8.0.7 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/preset-modules@0.2.0 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/template@8.0.0 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/traverse@8.1.0 | pendingScan returned; five scores and full alert scan unavailable |
| @babel/types@8.1.0 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint-community/eslint-utils@4.10.1 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint-community/regexpp@4.12.2 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint/config-array@0.23.5 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint/config-helpers@0.7.0 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint/core@1.2.1 | pendingScan returned; five scores and full alert scan unavailable |
| @eslint/plugin-kit@0.7.3 | pendingScan returned; five scores and full alert scan unavailable |
| @humanfs/node@0.16.8 | pendingScan returned; five scores and full alert scan unavailable |
| @humanwhocodes/module-importer@1.0.1 | pendingScan returned; five scores and full alert scan unavailable |
| @humanwhocodes/retry@0.4.3 | pendingScan returned; five scores and full alert scan unavailable |
| @jridgewell/gen-mapping@0.4.0-beta.0 | pendingScan returned; five scores and full alert scan unavailable |
| @jridgewell/resolve-uri@3.1.2 | pendingScan returned; five scores and full alert scan unavailable |
| vary@1.1.2 | final batch HTTP 429; API requires 100 quota units, token remaining 13 |
| verkit@0.5.0 | final batch HTTP 429; API requires 100 quota units, token remaining 13 |

## Exact three-layer resolution

Every relationship is retained in `three-layer-inventory.json`. Each unique version is checked once; layer is its minimum layer across all proposed roots. All five scores are unknown for pending/quota-blocked versions.

| Package/version | Layer | SC | V | Q | M | L | Alerts, all severities/actions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| @babel/cli@8.1.0 | 1 | 99.0 | 100 | 75.0 | 95.0 | 100 | none returned for this exact-version response |
| @babel/code-frame@8.0.6 | 2 | 100 | 100 | 73.0 | 90.0 | 100 | none returned for this exact-version response |
| @babel/compat-data@8.0.5 | 2 | 100 | 100 | 75.0 | 90.0 | 100 | none returned for this exact-version response |
| @babel/core@8.1.0 | 1 | 98.0 | 100 | 78.0 | 97.0 | 100 | envVars/low/ignore ×3; urlStrings/low/ignore |
| @babel/eslint-parser@8.0.7 | 1 | 99.0 | 100 | 75.0 | 97.0 | 100 | debugAccess/low/ignore |
| @babel/generator@8.1.0 | 2 | 99.0 | 100 | 78.0 | 96.0 | 100 | none returned for this exact-version response |
| @babel/helper-annotate-as-pure@8.0.0 | 3 | 100 | 100 | 64.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-compilation-targets@8.0.7 | 2 | 99.0 | 100 | 74.0 | 96.0 | 100 | envVars/low/ignore ×2 |
| @babel/helper-create-class-features-plugin@8.0.10 | 2 | 99.0 | 100 | 77.0 | 96.0 | 100 | urlStrings/low/ignore |
| @babel/helper-create-regexp-features-plugin@8.0.7 | 3 | 100 | 100 | 72.0 | 94.0 | 100 | none returned for this exact-version response |
| @babel/helper-define-polyfill-provider@1.0.0 | 3 | 99.0 | 100 | 76.0 | 87.0 | 100 | urlStrings/low/ignore |
| @babel/helper-globals@8.0.6 | 3 | 100 | 100 | 75.0 | 89.0 | 100 | none returned for this exact-version response |
| @babel/helper-member-expression-to-functions@8.0.5 | 3 | 100 | 100 | 74.0 | 90.0 | 100 | none returned for this exact-version response |
| @babel/helper-module-imports@8.0.0 | 3 | 99.0 | 100 | 75.0 | 88.0 | 100 | dynamicRequire/low/ignore ×4 |
| @babel/helper-module-transforms@8.1.0 | 3 | 99.0 | 100 | 76.0 | 91.0 | 100 | none returned for this exact-version response |
| @babel/helper-optimise-call-expression@8.0.0 | 3 | 100 | 100 | 68.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-plugin-utils@8.0.1 | 2 | 100 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-remap-async-to-generator@8.0.1 | 3 | 99.0 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-replace-supers@8.0.1 | 3 | 100 | 100 | 73.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-skip-transparent-expression-wrappers@8.1.0 | 3 | 100 | 100 | 66.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helper-string-parser@8.0.8 | 3 | 100 | 100 | 74.0 | 96.0 | 100 | none returned for this exact-version response |
| @babel/helper-validator-identifier@8.0.6 | 3 | 100 | 100 | 72.0 | 90.0 | 100 | none returned for this exact-version response |
| @babel/helper-validator-option@8.0.0 | 2 | 100 | 100 | 71.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/helpers@8.1.0 | 2 | 99.0 | 100 | 76.0 | 97.0 | 100 | urlStrings/low/ignore |
| @babel/parser@8.1.0 | 2 | 100 | 100 | 80.0 | 98.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1 | 2 | 100 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1 | 2 | 100 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1 | 2 | 100 | 100 | 68.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 | 2 | 100 | 100 | 68.0 | 91.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 | 2 | 99.0 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1 | 2 | 100 | 100 | 72.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-proposal-decorators@8.0.2 | 1 | 99.0 | 100 | 73.0 | 89.0 | 100 | none returned for this exact-version response |
| @babel/plugin-syntax-decorators@8.0.1 | 2 | 100 | 100 | 67.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-arrow-functions@8.0.1 | 2 | 99.0 | 100 | 66.0 | 88.0 | 100 | urlStrings/low/ignore |
| @babel/plugin-transform-async-generator-functions@8.0.6 | 2 | 99.0 | 100 | 72.0 | 93.0 | 100 | usesEval/middle/ignore |
| @babel/plugin-transform-async-to-generator@8.0.1 | 2 | 99.0 | 100 | 69.0 | 88.0 | 100 | usesEval/middle/ignore ×2 |
| @babel/plugin-transform-block-scoped-functions@8.0.1 | 2 | 100 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-block-scoping@8.0.10 | 2 | 99.0 | 100 | 75.0 | 96.0 | 100 | usesEval/middle/ignore ×2 |
| @babel/plugin-transform-class-properties@8.0.1 | 2 | 100 | 100 | 64.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-class-static-block@8.0.5 | 2 | 100 | 100 | 72.0 | 90.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-classes@8.1.0 | 2 | 99.0 | 100 | 75.0 | 96.0 | 100 | urlStrings/low/ignore |
| @babel/plugin-transform-computed-properties@8.0.1 | 2 | 100 | 100 | 72.0 | 88.0 | 100 | urlStrings/low/ignore |
| @babel/plugin-transform-destructuring@8.0.5 | 2 | 100 | 100 | 75.0 | 90.0 | 100 | urlStrings/low/ignore |
| @babel/plugin-transform-dotall-regex@8.0.1 | 2 | 99.0 | 100 | 62.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-duplicate-keys@8.0.1 | 2 | 100 | 100 | 69.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 | 2 | 99.0 | 100 | 65.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-dynamic-import@8.0.1 | 2 | 100 | 100 | 67.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-explicit-resource-management@8.0.5 | 2 | 99.0 | 100 | 72.0 | 90.0 | 100 | usesEval/middle/ignore ×2 |
| @babel/plugin-transform-exponentiation-operator@8.0.1 | 2 | 100 | 100 | 70.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-export-namespace-from@8.1.0 | 2 | 100 | 100 | 69.0 | 88.0 | 100 | none returned for this exact-version response |
| @babel/plugin-transform-for-of@8.0.7 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-function-name@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-json-strings@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-literals@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-logical-assignment-operators@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-member-expression-literals@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-modules-amd@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-modules-commonjs@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-modules-systemjs@8.1.0 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-modules-umd@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-named-capturing-groups-regex@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-new-target@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-nullish-coalescing-operator@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-numeric-separator@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-object-rest-spread@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-object-super@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-optional-catch-binding@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-optional-chaining@8.0.5 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-parameters@8.0.5 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-private-methods@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-private-property-in-object@8.0.5 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-property-literals@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-regenerator@8.0.6 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-regexp-modifiers@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-reserved-words@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-shorthand-properties@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-spread@8.0.8 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-sticky-regex@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-template-literals@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-typeof-symbol@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-unicode-escapes@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-unicode-property-regex@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-unicode-regex@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/plugin-transform-unicode-sets-regex@8.0.1 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/preset-env@8.0.7 | 1 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/preset-modules@0.2.0 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/template@8.0.0 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/traverse@8.1.0 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @babel/types@8.1.0 | 2 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint-community/eslint-utils@4.10.1 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint-community/regexpp@4.12.2 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint/config-array@0.23.5 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint/config-helpers@0.7.0 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint/core@1.2.1 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @eslint/plugin-kit@0.7.3 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @humanfs/node@0.16.8 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @humanwhocodes/module-importer@1.0.1 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @humanwhocodes/retry@0.4.3 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @jridgewell/gen-mapping@0.4.0-beta.0 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @jridgewell/resolve-uri@3.1.2 | 3 | unknown | unknown | unknown | unknown | unknown | pendingScan/middle/ignore |
| @jridgewell/sourcemap-codec@1.6.0 | 3 | 100 | 100 | 100 | 81.0 | 100 | none returned for this exact-version response |
| @jridgewell/trace-mapping@0.3.31 | 2 | 100 | 100 | 100 | 80.0 | 100 | none returned for this exact-version response |
| @lukeed/csprng@1.1.0 | 3 | 100 | 100 | 87.0 | 79.0 | 100 | none returned for this exact-version response |
| @nestjs/common@12.3.3 | 1 | 99.0 | 100 | 100 | 96.0 | 100 | debugAccess/low/ignore; envVars/low/ignore ×3 |
| @nestjs/core@12.3.3 | 1 | 99.0 | 100 | 100 | 95.0 | 100 | debugAccess/low/ignore ×2; envVars/low/ignore; networkAccess/middle/ignore ×2; urlStrings/low/ignore |
| @nestjs/platform-express@12.3.3 | 1 | 99.0 | 100 | 100 | 96.0 | 100 | networkAccess/middle/ignore ×2 |
| @standard-schema/spec@1.1.0 | 2 | 100 | 100 | 99.0 | 82.0 | 100 | none returned for this exact-version response |
| @tokenizer/inflate@0.6.0 | 3 | 99.0 | 100 | 99.0 | 90.0 | 100 | none returned for this exact-version response |
| @types/esrecurse@4.3.1 | 3 | 100 | 100 | 89.0 | 79.0 | 100 | none returned for this exact-version response |
| @types/estree@1.0.9 | 3 | 100 | 100 | 74.0 | 87.0 | 100 | none returned for this exact-version response |
| @types/gensync@1.0.5 | 2 | 100 | 100 | 70.0 | 80.0 | 100 | none returned for this exact-version response |
| @types/jsesc@2.5.1 | 3 | 100 | 100 | 69.0 | 79.0 | 100 | none returned for this exact-version response |
| accepts@2.0.0 | 3 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor/low/ignore |
| ajv@6.15.0 | 3 | 99.0 | 100 | 100 | 84.0 | 100 | gptAnomaly/low/ignore ×3; urlStrings/low/ignore; usesEval/middle/ignore |
| append-field@1.0.0 | 3 | 100 | 100 | 80.0 | 75.0 | 100 | unmaintained/low/ignore |
| babel-plugin-polyfill-corejs3@1.0.0 | 2 | 99.0 | 100 | 93.0 | 83.0 | 100 | none returned for this exact-version response |
| body-parser@2.4.0 | 3 | 99.0 | 100 | 100 | 93.0 | 100 | none returned for this exact-version response |
| browserslist@4.29.5 | 3 | 98.0 | 100 | 90.0 | 92.0 | 100 | dynamicRequire/low/ignore ×2; envVars/low/ignore ×19; filesystemAccess/low/ignore; urlStrings/low/ignore |
| busboy@1.6.0 | 3 | 100 | 100 | 100 | 80.0 | 100 | none returned for this exact-version response |
| chokidar@5.0.0 | 2 | 99.0 | 100 | 100 | 85.0 | 100 | filesystemAccess/low/ignore ×4; envVars/low/ignore ×2 |
| commander@14.0.3 | 2 | 99.0 | 100 | 100 | 83.0 | 100 | envVars/low/ignore ×7; filesystemAccess/low/ignore; shellAccess/middle/ignore |
| content-disposition@2.0.1 | 3 | 100 | 100 | 100 | 86.0 | 100 | none returned for this exact-version response |
| content-type@2.1.0 | 3 | 100 | 100 | 90.0 | 88.0 | 100 | none returned for this exact-version response |
| convert-source-map@2.0.0 | 2 | 100 | 100 | 100 | 81.0 | 100 | newAuthor/low/ignore; urlStrings/low/ignore |
| cookie@0.7.2 | 3 | 100 | 100 | 99.0 | 85.0 | 100 | none returned for this exact-version response |
| cookie-signature@1.2.2 | 3 | 100 | 100 | 69.0 | 82.0 | 100 | none returned for this exact-version response |
| core-js-compat@3.51.0 | 2 | 100 | 100 | 100 | 87.0 | 100 | none returned for this exact-version response |
| cors@2.8.6 | 2 | 99.0 | 100 | 100 | 83.0 | 100 | newAuthor/low/ignore |
| cross-spawn@7.0.6 | 3 | 99.0 | 100 | 97.0 | 80.0 | 100 | gptAnomaly/low/ignore; envVars/low/ignore ×2; filesystemAccess/low/ignore; shellAccess/middle/ignore |
| debug@4.4.3 | 3 | 99.0 | 100 | 100 | 81.0 | 100 | envVars/low/ignore ×6 |
| depd@2.0.0 | 3 | 99.0 | 100 | 100 | 75.0 | 100 | envVars/low/ignore ×2; unmaintained/low/ignore; usesEval/middle/ignore |
| empathic@2.1.0 | 2 | 100 | 100 | 93.0 | 83.0 | 100 | none returned for this exact-version response |
| encodeurl@2.0.1 | 3 | 100 | 100 | 99.0 | 90.0 | 100 | none returned for this exact-version response |
| escape-html@1.0.3 | 3 | 100 | 100 | 78.0 | 75.0 | 100 | unmaintained/low/ignore |
| escape-string-regexp@4.0.0 | 3 | 100 | 100 | 71.0 | 75.0 | 100 | unmaintained/low/ignore |
| eslint@10.13.0 | 2 | 97.0 | 100 | 100 | 96.0 | 100 | debugAccess/low/ignore ×2; envVars/low/ignore ×6; filesystemAccess/low/ignore ×7; urlStrings/low/ignore |
| eslint-scope@9.1.2 | 2 | 100 | 100 | 100 | 84.0 | 100 | none returned for this exact-version response |
| eslint-visitor-keys@5.0.1 | 2 | 100 | 100 | 100 | 83.0 | 100 | none returned for this exact-version response |
| espree@11.2.0 | 3 | 100 | 100 | 100 | 84.0 | 100 | none returned for this exact-version response |
| esquery@1.7.0 | 3 | 100 | 100 | 82.0 | 82.0 | 100 | minifiedFile/low/ignore ×2 |
| esrecurse@4.3.0 | 3 | 99.0 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| estraverse@5.3.0 | 3 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| esutils@2.0.3 | 3 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| etag@1.8.1 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | filesystemAccess/low/ignore; unmaintained/low/ignore |
| express@5.3.0 | 2 | 97.0 | 100 | 100 | 92.0 | 100 | dynamicRequire/low/ignore; envVars/low/ignore; filesystemAccess/low/ignore; networkAccess/middle/ignore ×5 |
| fast-deep-equal@3.1.3 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| fast-safe-stringify@2.1.1 | 2 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| file-entry-cache@11.1.5 | 3 | 100 | 100 | 100 | 83.0 | 100 | filesystemAccess/low/ignore ×2 |
| file-type@22.3.0 | 2 | 99.0 | 100 | 100 | 93.0 | 100 | none returned for this exact-version response |
| finalhandler@2.1.1 | 3 | 99.0 | 100 | 100 | 84.0 | 100 | envVars/low/ignore |
| find-up@5.0.0 | 3 | 100 | 100 | 99.0 | 79.0 | 100 | none returned for this exact-version response |
| flru@1.0.2 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| fresh@2.0.0 | 3 | 100 | 100 | 99.0 | 83.0 | 100 | none returned for this exact-version response |
| gensync@1.0.0-beta.2 | 2 | 100 | 100 | 100 | 75.0 | 100 | gptAnomaly/low/ignore; unmaintained/low/ignore |
| glob@14.0.3 | 2 | 98.0 | 100 | 99.0 | 92.0 | 100 | debugAccess/low/ignore; envVars/low/ignore ×2; filesystemAccess/low/ignore ×3; minifiedFile/low/ignore ×2; networkAccess/middle/ignore ×12 |
| glob-parent@6.0.2 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| http-errors@2.0.1 | 3 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor/low/ignore |
| ignore@5.3.2 | 3 | 99.0 | 100 | 100 | 91.0 | 100 | envVars/low/ignore ×2 |
| import-meta-resolve@4.2.0 | 2 | 99.0 | 100 | 100 | 79.0 | 100 | debugAccess/low/ignore ×2; filesystemAccess/low/ignore ×2 |
| imurmurhash@0.1.4 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| is-glob@4.0.3 | 3 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| iterare@1.2.1 | 2 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| js-tokens@10.0.0 | 3 | 100 | 100 | 72.0 | 80.0 | 100 | none returned for this exact-version response |
| jsesc@3.1.0 | 3 | 100 | 100 | 100 | 79.0 | 100 | none returned for this exact-version response |
| json-stable-stringify-without-jsonify@1.0.1 | 3 | 100 | 100 | 100 | 75.0 | 100 | unmaintained/low/ignore |
| json5@2.2.3 | 2 | 100 | 100 | 100 | 81.0 | 100 | gptAnomaly/low/ignore ×2 |
| load-esm@1.0.3 | 2 | 100 | 100 | 95.0 | 79.0 | 100 | none returned for this exact-version response |
| merge-descriptors@2.0.0 | 3 | 100 | 100 | 80.0 | 79.0 | 100 | none returned for this exact-version response |
| mime-types@3.0.2 | 3 | 100 | 100 | 100 | 85.0 | 100 | none returned for this exact-version response |
| minimatch@10.2.6 | 3 | 99.0 | 99.0 | 100 | 95.0 | 100 | mediumCVE/middle/monitor; envVars/low/ignore ×6 |
| minimatch@11.0.4 | 3 | 100 | 100 | 100 | 95.0 | 100 | envVars/low/ignore ×2 |
| minipass@7.1.3 | 3 | 100 | 100 | 100 | 80.0 | 100 | none returned for this exact-version response |
| multer@2.5.0 | 2 | 99.0 | 100 | 100 | 92.0 | 100 | debugAccess/low/ignore; filesystemAccess/low/ignore |
| natural-compare@1.4.0 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| object-assign@4.1.1 | 3 | 67.0 | 100 | 85.0 | 50.0 | 100 | unmaintained/low/ignore; socketUpgradeAvailable/high/ignore |
| obug@3.0.0 | 2 | 100 | 100 | 100 | 90.0 | 100 | gptDidYouMean/middle/ignore |
| on-finished@2.4.2 | 3 | 100 | 100 | 100 | 86.0 | 100 | debugAccess/low/ignore |
| once@1.4.0 | 3 | 100 | 100 | 91.0 | 75.0 | 100 | unmaintained/low/ignore |
| optionator@0.9.4 | 3 | 99.0 | 100 | 100 | 79.0 | 100 | none returned for this exact-version response |
| parseurl@1.3.3 | 3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained/low/ignore |
| path-scurry@3.0.0 | 3 | 99.0 | 100 | 100 | 86.0 | 100 | filesystemAccess/low/ignore ×6 |
| path-to-regexp@8.4.2 | 2 | 100 | 100 | 100 | 91.0 | 100 | urlStrings/low/ignore |
| proxy-addr@2.0.8 | 3 | 99.0 | 100 | 100 | 84.0 | 100 | none returned for this exact-version response |
| qs@6.17.1 | 3 | 99.0 | 100 | 100 | 96.0 | 100 | none returned for this exact-version response |
| range-parser@1.3.0 | 3 | 100 | 100 | 95.0 | 85.0 | 100 | newAuthor/low/ignore |
| readdirp@5.1.1 | 3 | 100 | 100 | 100 | 83.0 | 100 | filesystemAccess/low/ignore |
| reflect-metadata@0.2.2 | 1 | 100 | 100 | 99.0 | 80.0 | 80.0 | usesEval/middle/ignore |
| router@2.2.0 | 3 | 99.0 | 100 | 100 | 83.0 | 100 | networkAccess/middle/ignore ×2; newAuthor/low/ignore |
| rxjs@7.8.2 | 1 | 99.0 | 100 | 100 | 88.0 | 100 | gptAnomaly/low/ignore |
| send@1.2.1 | 3 | 99.0 | 100 | 100 | 85.0 | 100 | gptAnomaly/low/ignore; filesystemAccess/low/ignore |
| serve-static@2.2.1 | 3 | 99.0 | 100 | 99.0 | 84.0 | 100 | none returned for this exact-version response |
| slash@5.1.0 | 2 | 100 | 100 | 72.0 | 79.0 | 100 | none returned for this exact-version response |
| statuses@2.0.2 | 3 | 100 | 100 | 99.0 | 83.0 | 100 | newAuthor/low/ignore |
| strtok3@10.7.0 | 3 | 100 | 100 | 100 | 93.0 | 100 | none returned for this exact-version response |
| token-types@6.2.0 | 3 | 99.0 | 100 | 100 | 87.0 | 100 | none returned for this exact-version response |
| tslib@2.9.1 | 2 | 92.0 | 100 | 100 | 91.0 | 100 | newAuthor/low/ignore; unstableOwnership/high/monitor |
| type-is@1.6.18 | 3 | 100 | 100 | 100 | 87.0 | 100 | none returned for this exact-version response |
| type-is@2.1.0 | 3 | 99.0 | 100 | 100 | 87.0 | 100 | newAuthor/low/ignore |
| uid@2.0.2 | 2 | 100 | 100 | 99.0 | 79.0 | 100 | none returned for this exact-version response |
| uint8array-extras@1.6.0 | 3 | 100 | 100 | 100 | 82.0 | 100 | none returned for this exact-version response |
| vary@1.1.2 | 3 | unknown | unknown | unknown | unknown | unknown | unknown: HTTP429 |
| verkit@0.5.0 | 2 | unknown | unknown | unknown | unknown | unknown | unknown: HTTP429 |

## Optional peers not resolved

| Declared by | Peer | Range |
| --- | --- | --- |
| @nestjs/common@12.3.3 | class-transformer | >=0.4.1 |
| @nestjs/common@12.3.3 | class-validator | >=0.13.2 |
| @nestjs/core@12.3.3 | @nestjs/microservices | ^12.0.0 |
| @nestjs/core@12.3.3 | @nestjs/websockets | ^12.0.0 |
| debug@4.4.3 | supports-color | * |
| eslint@10.13.0 | jiti | * |

These optional peers are not proposed/installed; no required peer gap was found. The three-layer tree has no missing snapshots.

## Root-specific dependency relationships

### @nestjs/common@12.3.3

- @nestjs/common@12.3.3 → @standard-schema/spec@1.1.0 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → file-type@22.3.0 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → iterare@1.2.1 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → load-esm@1.0.3 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → reflect-metadata@0.2.2 (layers 1→2, dependencies, resolved peer).
- @nestjs/common@12.3.3 → rxjs@7.8.2 (layers 1→2, dependencies, resolved peer).
- @nestjs/common@12.3.3 → tslib@2.9.1 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → uid@2.0.2 (layers 1→2, dependencies).
- file-type@22.3.0 → @tokenizer/inflate@0.6.0 (layers 2→3, dependencies).
- file-type@22.3.0 → strtok3@10.7.0 (layers 2→3, dependencies).
- file-type@22.3.0 → token-types@6.2.0 (layers 2→3, dependencies).
- file-type@22.3.0 → uint8array-extras@1.6.0 (layers 2→3, dependencies).
- rxjs@7.8.2 → tslib@2.9.1 (layers 2→3, dependencies).
- uid@2.0.2 → @lukeed/csprng@1.1.0 (layers 2→3, dependencies).

### @nestjs/core@12.3.3

- @nestjs/core@12.3.3 → @nestjs/common@12.3.3 (layers 1→2, dependencies, resolved peer).
- @nestjs/core@12.3.3 → fast-safe-stringify@2.1.1 (layers 1→2, dependencies).
- @nestjs/core@12.3.3 → iterare@1.2.1 (layers 1→2, dependencies).
- @nestjs/core@12.3.3 → path-to-regexp@8.4.2 (layers 1→2, dependencies).
- @nestjs/core@12.3.3 → reflect-metadata@0.2.2 (layers 1→2, dependencies, resolved peer).
- @nestjs/core@12.3.3 → rxjs@7.8.2 (layers 1→2, dependencies, resolved peer).
- @nestjs/core@12.3.3 → tslib@2.9.1 (layers 1→2, dependencies).
- @nestjs/core@12.3.3 → uid@2.0.2 (layers 1→2, dependencies).
- @nestjs/core@12.3.3 → @nestjs/platform-express@12.3.3 (layers 1→2, optionalDependencies, resolved peer).
- @nestjs/common@12.3.3 → @standard-schema/spec@1.1.0 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → file-type@22.3.0 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → iterare@1.2.1 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → load-esm@1.0.3 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → reflect-metadata@0.2.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/common@12.3.3 → rxjs@7.8.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/common@12.3.3 → tslib@2.9.1 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → uid@2.0.2 (layers 2→3, dependencies).
- rxjs@7.8.2 → tslib@2.9.1 (layers 2→3, dependencies).
- uid@2.0.2 → @lukeed/csprng@1.1.0 (layers 2→3, dependencies).
- @nestjs/platform-express@12.3.3 → @nestjs/common@12.3.3 (layers 2→3, dependencies, resolved peer).
- @nestjs/platform-express@12.3.3 → @nestjs/core@12.3.3 (layers 2→3, dependencies, resolved peer).
- @nestjs/platform-express@12.3.3 → cors@2.8.6 (layers 2→3, dependencies).
- @nestjs/platform-express@12.3.3 → express@5.3.0 (layers 2→3, dependencies).
- @nestjs/platform-express@12.3.3 → multer@2.5.0 (layers 2→3, dependencies).
- @nestjs/platform-express@12.3.3 → path-to-regexp@8.4.2 (layers 2→3, dependencies).
- @nestjs/platform-express@12.3.3 → tslib@2.9.1 (layers 2→3, dependencies).

### @nestjs/platform-express@12.3.3

- @nestjs/platform-express@12.3.3 → @nestjs/common@12.3.3 (layers 1→2, dependencies, resolved peer).
- @nestjs/platform-express@12.3.3 → @nestjs/core@12.3.3 (layers 1→2, dependencies, resolved peer).
- @nestjs/platform-express@12.3.3 → cors@2.8.6 (layers 1→2, dependencies).
- @nestjs/platform-express@12.3.3 → express@5.3.0 (layers 1→2, dependencies).
- @nestjs/platform-express@12.3.3 → multer@2.5.0 (layers 1→2, dependencies).
- @nestjs/platform-express@12.3.3 → path-to-regexp@8.4.2 (layers 1→2, dependencies).
- @nestjs/platform-express@12.3.3 → tslib@2.9.1 (layers 1→2, dependencies).
- @nestjs/common@12.3.3 → @standard-schema/spec@1.1.0 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → file-type@22.3.0 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → iterare@1.2.1 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → load-esm@1.0.3 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → reflect-metadata@0.2.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/common@12.3.3 → rxjs@7.8.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/common@12.3.3 → tslib@2.9.1 (layers 2→3, dependencies).
- @nestjs/common@12.3.3 → uid@2.0.2 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → @nestjs/common@12.3.3 (layers 2→3, dependencies, resolved peer).
- @nestjs/core@12.3.3 → fast-safe-stringify@2.1.1 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → iterare@1.2.1 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → path-to-regexp@8.4.2 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → reflect-metadata@0.2.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/core@12.3.3 → rxjs@7.8.2 (layers 2→3, dependencies, resolved peer).
- @nestjs/core@12.3.3 → tslib@2.9.1 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → uid@2.0.2 (layers 2→3, dependencies).
- @nestjs/core@12.3.3 → @nestjs/platform-express@12.3.3 (layers 2→3, optionalDependencies, resolved peer).
- cors@2.8.6 → object-assign@4.1.1 (layers 2→3, dependencies).
- cors@2.8.6 → vary@1.1.2 (layers 2→3, dependencies).
- express@5.3.0 → accepts@2.0.0 (layers 2→3, dependencies).
- express@5.3.0 → body-parser@2.4.0 (layers 2→3, dependencies).
- express@5.3.0 → content-disposition@2.0.1 (layers 2→3, dependencies).
- express@5.3.0 → content-type@2.1.0 (layers 2→3, dependencies).
- express@5.3.0 → cookie@0.7.2 (layers 2→3, dependencies).
- express@5.3.0 → cookie-signature@1.2.2 (layers 2→3, dependencies).
- express@5.3.0 → debug@4.4.3 (layers 2→3, dependencies).
- express@5.3.0 → depd@2.0.0 (layers 2→3, dependencies).
- express@5.3.0 → encodeurl@2.0.1 (layers 2→3, dependencies).
- express@5.3.0 → escape-html@1.0.3 (layers 2→3, dependencies).
- express@5.3.0 → etag@1.8.1 (layers 2→3, dependencies).
- express@5.3.0 → finalhandler@2.1.1 (layers 2→3, dependencies).
- express@5.3.0 → fresh@2.0.0 (layers 2→3, dependencies).
- express@5.3.0 → http-errors@2.0.1 (layers 2→3, dependencies).
- express@5.3.0 → merge-descriptors@2.0.0 (layers 2→3, dependencies).
- express@5.3.0 → mime-types@3.0.2 (layers 2→3, dependencies).
- express@5.3.0 → on-finished@2.4.2 (layers 2→3, dependencies).
- express@5.3.0 → once@1.4.0 (layers 2→3, dependencies).
- express@5.3.0 → parseurl@1.3.3 (layers 2→3, dependencies).
- express@5.3.0 → proxy-addr@2.0.8 (layers 2→3, dependencies).
- express@5.3.0 → qs@6.17.1 (layers 2→3, dependencies).
- express@5.3.0 → range-parser@1.3.0 (layers 2→3, dependencies).
- express@5.3.0 → router@2.2.0 (layers 2→3, dependencies).
- express@5.3.0 → send@1.2.1 (layers 2→3, dependencies).
- express@5.3.0 → serve-static@2.2.1 (layers 2→3, dependencies).
- express@5.3.0 → statuses@2.0.2 (layers 2→3, dependencies).
- express@5.3.0 → type-is@2.1.0 (layers 2→3, dependencies).
- express@5.3.0 → vary@1.1.2 (layers 2→3, dependencies).
- multer@2.5.0 → append-field@1.0.0 (layers 2→3, dependencies).
- multer@2.5.0 → busboy@1.6.0 (layers 2→3, dependencies).
- multer@2.5.0 → type-is@1.6.18 (layers 2→3, dependencies).

### reflect-metadata@0.2.2


### rxjs@7.8.2

- rxjs@7.8.2 → tslib@2.9.1 (layers 1→2, dependencies).

### @babel/cli@8.1.0

- @babel/cli@8.1.0 → @babel/core@8.1.0 (layers 1→2, dependencies, resolved peer).
- @babel/cli@8.1.0 → @jridgewell/trace-mapping@0.3.31 (layers 1→2, dependencies).
- @babel/cli@8.1.0 → chokidar@5.0.0 (layers 1→2, dependencies).
- @babel/cli@8.1.0 → commander@14.0.3 (layers 1→2, dependencies).
- @babel/cli@8.1.0 → convert-source-map@2.0.0 (layers 1→2, dependencies).
- @babel/cli@8.1.0 → glob@14.0.3 (layers 1→2, dependencies).
- @babel/cli@8.1.0 → slash@5.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/generator@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helpers@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @types/gensync@1.0.5 (layers 2→3, dependencies).
- @babel/core@8.1.0 → convert-source-map@2.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → empathic@2.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → gensync@1.0.0-beta.2 (layers 2→3, dependencies).
- @babel/core@8.1.0 → import-meta-resolve@4.2.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → json5@2.2.3 (layers 2→3, dependencies).
- @babel/core@8.1.0 → obug@3.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → verkit@0.5.0 (layers 2→3, dependencies).
- @jridgewell/trace-mapping@0.3.31 → @jridgewell/resolve-uri@3.1.2 (layers 2→3, dependencies).
- @jridgewell/trace-mapping@0.3.31 → @jridgewell/sourcemap-codec@1.6.0 (layers 2→3, dependencies).
- chokidar@5.0.0 → readdirp@5.1.1 (layers 2→3, dependencies).
- glob@14.0.3 → minimatch@11.0.4 (layers 2→3, dependencies).
- glob@14.0.3 → minipass@7.1.3 (layers 2→3, dependencies).
- glob@14.0.3 → path-scurry@3.0.0 (layers 2→3, dependencies).

### @babel/core@8.1.0

- @babel/core@8.1.0 → @babel/code-frame@8.0.6 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/generator@8.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/helpers@8.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/parser@8.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/template@8.0.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/traverse@8.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/types@8.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @types/gensync@1.0.5 (layers 1→2, dependencies).
- @babel/core@8.1.0 → convert-source-map@2.0.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → empathic@2.1.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → gensync@1.0.0-beta.2 (layers 1→2, dependencies).
- @babel/core@8.1.0 → import-meta-resolve@4.2.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → json5@2.2.3 (layers 1→2, dependencies).
- @babel/core@8.1.0 → obug@3.0.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → verkit@0.5.0 (layers 1→2, dependencies).
- @babel/code-frame@8.0.6 → @babel/helper-validator-identifier@8.0.6 (layers 2→3, dependencies).
- @babel/code-frame@8.0.6 → js-tokens@10.0.0 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → @jridgewell/gen-mapping@0.4.0-beta.0 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → @jridgewell/trace-mapping@0.3.31 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → @types/jsesc@2.5.1 (layers 2→3, dependencies).
- @babel/generator@8.1.0 → jsesc@3.1.0 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → @babel/compat-data@8.0.5 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → @babel/helper-validator-option@8.0.0 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → browserslist@4.29.5 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → flru@1.0.2 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → verkit@0.5.0 (layers 2→3, dependencies).
- @babel/helpers@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/helpers@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/parser@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/template@8.0.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/template@8.0.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/template@8.0.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/generator@8.1.0 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/helper-globals@8.0.6 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/traverse@8.1.0 → obug@3.0.0 (layers 2→3, dependencies).
- @babel/types@8.1.0 → @babel/helper-string-parser@8.0.8 (layers 2→3, dependencies).
- @babel/types@8.1.0 → @babel/helper-validator-identifier@8.0.6 (layers 2→3, dependencies).

### @babel/eslint-parser@8.0.7

- @babel/eslint-parser@8.0.7 → @babel/core@8.1.0 (layers 1→2, dependencies, resolved peer).
- @babel/eslint-parser@8.0.7 → eslint@10.13.0 (layers 1→2, dependencies, resolved peer).
- @babel/eslint-parser@8.0.7 → eslint-scope@9.1.2 (layers 1→2, dependencies).
- @babel/eslint-parser@8.0.7 → eslint-visitor-keys@5.0.1 (layers 1→2, dependencies).
- @babel/eslint-parser@8.0.7 → verkit@0.5.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/generator@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helpers@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @types/gensync@1.0.5 (layers 2→3, dependencies).
- @babel/core@8.1.0 → convert-source-map@2.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → empathic@2.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → gensync@1.0.0-beta.2 (layers 2→3, dependencies).
- @babel/core@8.1.0 → import-meta-resolve@4.2.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → json5@2.2.3 (layers 2→3, dependencies).
- @babel/core@8.1.0 → obug@3.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → verkit@0.5.0 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint-community/eslint-utils@4.10.1 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint-community/regexpp@4.12.2 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint/config-array@0.23.5 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint/config-helpers@0.7.0 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint/core@1.2.1 (layers 2→3, dependencies).
- eslint@10.13.0 → @eslint/plugin-kit@0.7.3 (layers 2→3, dependencies).
- eslint@10.13.0 → @humanfs/node@0.16.8 (layers 2→3, dependencies).
- eslint@10.13.0 → @humanwhocodes/module-importer@1.0.1 (layers 2→3, dependencies).
- eslint@10.13.0 → @humanwhocodes/retry@0.4.3 (layers 2→3, dependencies).
- eslint@10.13.0 → @types/estree@1.0.9 (layers 2→3, dependencies).
- eslint@10.13.0 → ajv@6.15.0 (layers 2→3, dependencies).
- eslint@10.13.0 → cross-spawn@7.0.6 (layers 2→3, dependencies).
- eslint@10.13.0 → debug@4.4.3 (layers 2→3, dependencies).
- eslint@10.13.0 → escape-string-regexp@4.0.0 (layers 2→3, dependencies).
- eslint@10.13.0 → eslint-scope@9.1.2 (layers 2→3, dependencies).
- eslint@10.13.0 → eslint-visitor-keys@5.0.1 (layers 2→3, dependencies).
- eslint@10.13.0 → espree@11.2.0 (layers 2→3, dependencies).
- eslint@10.13.0 → esquery@1.7.0 (layers 2→3, dependencies).
- eslint@10.13.0 → esutils@2.0.3 (layers 2→3, dependencies).
- eslint@10.13.0 → fast-deep-equal@3.1.3 (layers 2→3, dependencies).
- eslint@10.13.0 → file-entry-cache@11.1.5 (layers 2→3, dependencies).
- eslint@10.13.0 → find-up@5.0.0 (layers 2→3, dependencies).
- eslint@10.13.0 → glob-parent@6.0.2 (layers 2→3, dependencies).
- eslint@10.13.0 → ignore@5.3.2 (layers 2→3, dependencies).
- eslint@10.13.0 → imurmurhash@0.1.4 (layers 2→3, dependencies).
- eslint@10.13.0 → is-glob@4.0.3 (layers 2→3, dependencies).
- eslint@10.13.0 → json-stable-stringify-without-jsonify@1.0.1 (layers 2→3, dependencies).
- eslint@10.13.0 → minimatch@10.2.6 (layers 2→3, dependencies).
- eslint@10.13.0 → natural-compare@1.4.0 (layers 2→3, dependencies).
- eslint@10.13.0 → optionator@0.9.4 (layers 2→3, dependencies).
- eslint-scope@9.1.2 → @types/esrecurse@4.3.1 (layers 2→3, dependencies).
- eslint-scope@9.1.2 → @types/estree@1.0.9 (layers 2→3, dependencies).
- eslint-scope@9.1.2 → esrecurse@4.3.0 (layers 2→3, dependencies).
- eslint-scope@9.1.2 → estraverse@5.3.0 (layers 2→3, dependencies).

### @babel/plugin-proposal-decorators@8.0.2

- @babel/plugin-proposal-decorators@8.0.2 → @babel/core@8.1.0 (layers 1→2, dependencies, resolved peer).
- @babel/plugin-proposal-decorators@8.0.2 → @babel/helper-create-class-features-plugin@8.0.10 (layers 1→2, dependencies).
- @babel/plugin-proposal-decorators@8.0.2 → @babel/helper-plugin-utils@8.0.1 (layers 1→2, dependencies).
- @babel/plugin-proposal-decorators@8.0.2 → @babel/plugin-syntax-decorators@8.0.1 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/generator@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helpers@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @types/gensync@1.0.5 (layers 2→3, dependencies).
- @babel/core@8.1.0 → convert-source-map@2.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → empathic@2.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → gensync@1.0.0-beta.2 (layers 2→3, dependencies).
- @babel/core@8.1.0 → import-meta-resolve@4.2.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → json5@2.2.3 (layers 2→3, dependencies).
- @babel/core@8.1.0 → obug@3.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → verkit@0.5.0 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/helper-annotate-as-pure@8.0.0 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/helper-member-expression-to-functions@8.0.5 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/helper-optimise-call-expression@8.0.0 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/helper-replace-supers@8.0.1 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/helper-create-class-features-plugin@8.0.10 → verkit@0.5.0 (layers 2→3, dependencies).
- @babel/helper-plugin-utils@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-syntax-decorators@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-syntax-decorators@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).

### @babel/preset-env@8.0.7

- @babel/preset-env@8.0.7 → @babel/compat-data@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/core@8.1.0 (layers 1→2, dependencies, resolved peer).
- @babel/preset-env@8.0.7 → @babel/helper-compilation-targets@8.0.7 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/helper-plugin-utils@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/helper-validator-option@8.0.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-arrow-functions@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-async-generator-functions@8.0.6 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-async-to-generator@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-block-scoped-functions@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-block-scoping@8.0.10 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-class-properties@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-class-static-block@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-classes@8.1.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-computed-properties@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-destructuring@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-dotall-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-duplicate-keys@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-dynamic-import@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-explicit-resource-management@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-exponentiation-operator@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-export-namespace-from@8.1.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-for-of@8.0.7 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-function-name@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-json-strings@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-literals@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-logical-assignment-operators@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-member-expression-literals@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-modules-amd@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-modules-commonjs@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-modules-systemjs@8.1.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-modules-umd@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-named-capturing-groups-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-new-target@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-nullish-coalescing-operator@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-numeric-separator@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-object-rest-spread@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-object-super@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-optional-catch-binding@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-optional-chaining@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-parameters@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-private-methods@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-private-property-in-object@8.0.5 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-property-literals@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-regenerator@8.0.6 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-regexp-modifiers@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-reserved-words@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-shorthand-properties@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-spread@8.0.8 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-sticky-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-template-literals@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-typeof-symbol@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-unicode-escapes@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-unicode-property-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-unicode-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/plugin-transform-unicode-sets-regex@8.0.1 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → @babel/preset-modules@0.2.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → babel-plugin-polyfill-corejs3@1.0.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → core-js-compat@3.51.0 (layers 1→2, dependencies).
- @babel/preset-env@8.0.7 → verkit@0.5.0 (layers 1→2, dependencies).
- @babel/core@8.1.0 → @babel/code-frame@8.0.6 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/generator@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/helpers@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/parser@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/template@8.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → @types/gensync@1.0.5 (layers 2→3, dependencies).
- @babel/core@8.1.0 → convert-source-map@2.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → empathic@2.1.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → gensync@1.0.0-beta.2 (layers 2→3, dependencies).
- @babel/core@8.1.0 → import-meta-resolve@4.2.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → json5@2.2.3 (layers 2→3, dependencies).
- @babel/core@8.1.0 → obug@3.0.0 (layers 2→3, dependencies).
- @babel/core@8.1.0 → verkit@0.5.0 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → @babel/compat-data@8.0.5 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → @babel/helper-validator-option@8.0.0 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → browserslist@4.29.5 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → flru@1.0.2 (layers 2→3, dependencies).
- @babel/helper-compilation-targets@8.0.7 → verkit@0.5.0 (layers 2→3, dependencies).
- @babel/helper-plugin-utils@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1 → @babel/plugin-transform-optional-chaining@8.0.5 (layers 2→3, dependencies).
- @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-arrow-functions@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-arrow-functions@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-async-generator-functions@8.0.6 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-async-generator-functions@8.0.6 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-async-generator-functions@8.0.6 → @babel/helper-remap-async-to-generator@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-async-generator-functions@8.0.6 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-async-to-generator@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-async-to-generator@8.0.1 → @babel/helper-module-imports@8.0.0 (layers 2→3, dependencies).
- @babel/plugin-transform-async-to-generator@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-async-to-generator@8.0.1 → @babel/helper-remap-async-to-generator@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-block-scoped-functions@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-block-scoped-functions@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-block-scoping@8.0.10 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-block-scoping@8.0.10 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-class-properties@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-class-properties@8.0.1 → @babel/helper-create-class-features-plugin@8.0.10 (layers 2→3, dependencies).
- @babel/plugin-transform-class-properties@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-class-static-block@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-class-static-block@8.0.5 → @babel/helper-create-class-features-plugin@8.0.10 (layers 2→3, dependencies).
- @babel/plugin-transform-class-static-block@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-classes@8.1.0 → @babel/helper-annotate-as-pure@8.0.0 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/helper-globals@8.0.6 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/helper-replace-supers@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-classes@8.1.0 → @babel/traverse@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-computed-properties@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-computed-properties@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-destructuring@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-destructuring@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-dotall-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-dotall-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-dotall-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-duplicate-keys@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-duplicate-keys@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-dynamic-import@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-dynamic-import@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-explicit-resource-management@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-explicit-resource-management@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-explicit-resource-management@8.0.5 → @babel/plugin-transform-destructuring@8.0.5 (layers 2→3, dependencies).
- @babel/plugin-transform-exponentiation-operator@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-exponentiation-operator@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-export-namespace-from@8.1.0 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-export-namespace-from@8.1.0 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-for-of@8.0.7 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-for-of@8.0.7 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-for-of@8.0.7 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-function-name@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-function-name@8.0.1 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-function-name@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-json-strings@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-json-strings@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-literals@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-literals@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-logical-assignment-operators@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-logical-assignment-operators@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-member-expression-literals@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-member-expression-literals@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-amd@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-modules-amd@8.0.1 → @babel/helper-module-transforms@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-amd@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-commonjs@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-modules-commonjs@8.0.1 → @babel/helper-module-transforms@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-commonjs@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-systemjs@8.1.0 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-modules-systemjs@8.1.0 → @babel/helper-module-transforms@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-systemjs@8.1.0 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-systemjs@8.1.0 → @babel/helper-validator-identifier@8.0.6 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-umd@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-modules-umd@8.0.1 → @babel/helper-module-transforms@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-modules-umd@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-named-capturing-groups-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-named-capturing-groups-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-named-capturing-groups-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-new-target@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-new-target@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-nullish-coalescing-operator@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-nullish-coalescing-operator@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-numeric-separator@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-numeric-separator@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-object-rest-spread@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-object-rest-spread@8.0.1 → @babel/helper-compilation-targets@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-object-rest-spread@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-object-rest-spread@8.0.1 → @babel/plugin-transform-destructuring@8.0.5 (layers 2→3, dependencies).
- @babel/plugin-transform-object-rest-spread@8.0.1 → @babel/plugin-transform-parameters@8.0.5 (layers 2→3, dependencies).
- @babel/plugin-transform-object-super@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-object-super@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-object-super@8.0.1 → @babel/helper-replace-supers@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-optional-catch-binding@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-optional-catch-binding@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-optional-chaining@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-optional-chaining@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-optional-chaining@8.0.5 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-parameters@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-parameters@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-private-methods@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-private-methods@8.0.1 → @babel/helper-create-class-features-plugin@8.0.10 (layers 2→3, dependencies).
- @babel/plugin-transform-private-methods@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-private-property-in-object@8.0.5 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-private-property-in-object@8.0.5 → @babel/helper-annotate-as-pure@8.0.0 (layers 2→3, dependencies).
- @babel/plugin-transform-private-property-in-object@8.0.5 → @babel/helper-create-class-features-plugin@8.0.10 (layers 2→3, dependencies).
- @babel/plugin-transform-private-property-in-object@8.0.5 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-property-literals@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-property-literals@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-regenerator@8.0.6 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-regenerator@8.0.6 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-regexp-modifiers@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-regexp-modifiers@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-regexp-modifiers@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-reserved-words@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-reserved-words@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-shorthand-properties@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-shorthand-properties@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-spread@8.0.8 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-spread@8.0.8 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-spread@8.0.8 → @babel/helper-skip-transparent-expression-wrappers@8.1.0 (layers 2→3, dependencies).
- @babel/plugin-transform-sticky-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-sticky-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-template-literals@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-template-literals@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-typeof-symbol@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-typeof-symbol@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-escapes@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-unicode-escapes@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-property-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-unicode-property-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-property-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-unicode-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-sets-regex@8.0.1 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/plugin-transform-unicode-sets-regex@8.0.1 → @babel/helper-create-regexp-features-plugin@8.0.7 (layers 2→3, dependencies).
- @babel/plugin-transform-unicode-sets-regex@8.0.1 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/preset-modules@0.2.0 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- @babel/preset-modules@0.2.0 → @babel/helper-plugin-utils@8.0.1 (layers 2→3, dependencies).
- @babel/preset-modules@0.2.0 → @babel/plugin-transform-dotall-regex@8.0.1 (layers 2→3, dependencies).
- @babel/preset-modules@0.2.0 → @babel/plugin-transform-unicode-property-regex@8.0.1 (layers 2→3, dependencies).
- @babel/preset-modules@0.2.0 → @babel/types@8.1.0 (layers 2→3, dependencies).
- @babel/preset-modules@0.2.0 → esutils@2.0.3 (layers 2→3, dependencies).
- babel-plugin-polyfill-corejs3@1.0.0 → @babel/core@8.1.0 (layers 2→3, dependencies, resolved peer).
- babel-plugin-polyfill-corejs3@1.0.0 → @babel/helper-define-polyfill-provider@1.0.0 (layers 2→3, dependencies).
- babel-plugin-polyfill-corejs3@1.0.0 → core-js-compat@3.51.0 (layers 2→3, dependencies).
- core-js-compat@3.51.0 → browserslist@4.29.5 (layers 2→3, dependencies).

## Required human decision

Accept or decline this exact Nest/Babel proposal with the minimatch CVE, tslib ownership warning, other unfiltered alerts, 52 unknown exact versions, and limited campaign/organization-alert coverage. No package installation until that decision. After any authorized installation, compare its lockfile three-layer tree with this inventory and review any differences before continuing.


## Integración tras los merges · 2026-11-05

Se incorpora staging f1e27d67 después de #1023, #1031, #1025 y #1035. Resolver
README y arquitectura conservando las guías integradas y añadiendo Nest; unir
las configuraciones de formato/lint y las excepciones de antigüedad. pnpm
regenera el lockfile sin scripts. La comparación de los202 nodos y snapshots
de las tres capas revisadas no presenta diferencias. El árbol combinado tiene
373 versiones; lo añadido fuera de esas capas corresponde a Electron/Fastify
ya integrados. OpenAI enlaza su peer opcional undici7.30.1 existente; la
clasificación compartida usa fetch nativo. No cambia la lógica del clasificador.

La prueba de Nest reescribe solo sus copias compiladas de db/server.js y
queries/users.js para usar el puerto aislado, incluida la llamada listen.
Las fuentes de los clientes integrados se conservan como están en staging.
