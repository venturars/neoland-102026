# Plan — Prettier y ESLint

## Recorrido

Este cambio añade herramientas de desarrollo. No crea una capa, no cambia `logic/`, no añade SQL y no modifica el comportamiento de la aplicación.

`package.json` ya obliga a usar pnpm y contiene los scripts `preinstall` y `test`. No contiene scripts de formato ni de comprobación estática. `docs/STYLE.md` ya establece que el formato es el estándar de Prettier, pero todavía no explica cómo aplicarlo. `AGENTS.md` no tiene el apartado «Al terminar una tarea» pedido por la issue.

## Dependencias

Se añaden como `devDependencies` y con versión exacta:

- Prettier `3.9.10`, para aplicar el formato estándar.
- ESLint `10.13.0`, para analizar los archivos JavaScript.

Se instalan con pnpm. `pnpm-lock.yaml` fija sus dependencias transitivas. No se añade una configuración de estilo propia de Prettier.

## Comandos y configuración

`package.json` añade:

- `format`: ejecuta `prettier --write .`.
- `lint`: ejecuta `eslint .`.

`.prettierignore` impide que Prettier entre en `.venv/`, `node_modules/` y `pnpm-lock.yaml`. Esos directorios contienen herramientas instaladas y código de terceros que no pertenece a la app. El lockfile lo genera pnpm.

`eslint.config.js` usa la configuración plana incluida en ESLint. Ignora `.venv/` y `node_modules/`, analiza los archivos `.js` como módulos y declara `process` y `URL` como globales de solo lectura. Activa `no-undef` y `no-unused-vars`. ESLint también falla al encontrar sintaxis que no puede analizar.

No se añade `@eslint/js`: las reglas utilizadas pertenecen al núcleo de ESLint.

## Ficheros

- `package.json`: declara las dependencias de desarrollo y los scripts `format` y `lint`.
- `pnpm-lock.yaml`: fija las versiones instaladas por pnpm.
- `.prettierignore`: excluye el entorno virtual, las dependencias instaladas y el lockfile generado.
- `eslint.config.js`: contiene el alcance, los ignores y las reglas de ESLint.
- `AGENTS.md`: crea el apartado «Al terminar una tarea» con `pnpm format` y `pnpm lint`.
- `docs/STYLE.md`: documenta los dos comandos.
- `docs/ARCHITECTURE.md`: describe la responsabilidad de `eslint.config.js` y los scripts del paquete.
- `docs/TREE.md`: añade `eslint.config.js` y la carpeta de esta spec.

`docs/CONSTITUTION.md` se revisa al terminar. No necesita un cambio planificado porque no cambia el alcance, las capas, los datos ni una decisión fundamental.

## Revisión con Socket

`depscore` dio las cinco stats de cada paquete. No dijo si la versión está en una campaña ni si tiene una alerta. `socket-mcp` no dejó consultar `organizations` y `alerts` en esta revisión, así que «no consta» significa que no se pudo comprobar, no que no exista.

Se revisaron Prettier `3.9.10`, ESLint `10.13.0` y sus dependencias hasta 3 capas, según `pnpm-lock.yaml`: 78 paquetes en total. `openai@7.40.0` ya estaba en `package.json` y su versión no cambia, así que no entra. La stat más baja es quality 68, en `shebang-command@2.0.0`. Ninguna stat está por debajo de 50.

Queda por decidir quién acepta el plan: aceptar estas versiones con campaña y alerta sin comprobar, o repetir la comprobación con `alerts` cuando `socket-mcp` tenga sesión.

- `@cacheable/memory@2.2.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@cacheable/utils@2.5.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint-community/eslint-utils@4.10.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 84, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint-community/regexpp@4.12.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/config-array@0.23.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/config-helpers@0.7.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/core@1.2.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/object-schema@3.0.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/plugin-kit@0.7.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/core@0.19.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/node@0.16.8`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/types@0.15.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 82, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanwhocodes/module-importer@1.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 93, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanwhocodes/retry@0.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@keyv/bigmap@1.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@keyv/serialize@1.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 71, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/esrecurse@4.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/estree@1.0.9`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/json-schema@7.0.15`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `acorn-jsx@5.3.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `acorn@8.19.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ajv@6.15.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `balanced-match@4.0.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 86, quality 85, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `brace-expansion@5.0.12`. Campaña: no consta. Alerta: no consta. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cacheable@2.5.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `cross-spawn@7.0.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 97, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `debug@4.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `deep-is@0.1.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `escape-string-regexp@4.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 71, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-scope@9.1.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-visitor-keys@3.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-visitor-keys@5.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint@10.13.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 95, quality 100, supplyChain 97, vulnerability 100. Ninguna stat por debajo de 50.
- `espree@11.2.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esquery@1.7.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 82, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esrecurse@4.3.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `estraverse@5.3.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esutils@2.0.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-deep-equal@3.1.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-json-stable-stringify@2.1.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-levenshtein@2.0.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `file-entry-cache@11.1.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `find-up@5.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `flat-cache@6.1.23`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `flatted@3.4.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `glob-parent@6.0.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `hashery@1.5.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 92, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `hookified@1.15.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 92, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `hookified@2.2.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 92, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ignore@5.3.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 93, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `imurmurhash@0.1.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-extglob@2.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-glob@4.0.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `isexe@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 85, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `json-schema-traverse@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 94, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `json-stable-stringify-without-jsonify@1.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `keyv@5.6.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 90, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `levn@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `locate-path@6.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `minimatch@10.2.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ms@2.1.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `natural-compare@1.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `optionator@0.9.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `p-limit@3.1.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `p-locate@5.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-exists@4.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-key@3.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 84, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prelude-ls@1.2.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 75, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prettier@3.9.10`. Campaña: no consta. Alerta: no consta. license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `punycode@2.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `qified@0.10.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 87, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-command@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-regex@3.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 69, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `type-check@0.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `uri-js@4.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `which@2.0.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 83, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `word-wrap@1.2.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `yocto-queue@0.1.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.

## Comprobación

- `pnpm format` aplica Prettier sin error.
- `pnpm lint` analiza los JavaScript sin error.
- `pnpm exec prettier --check .` confirma que no queda formato pendiente.
- `git diff --check` no encuentra errores de espacios.
- La revisión final confirma que no se cambió el comportamiento de la app.
