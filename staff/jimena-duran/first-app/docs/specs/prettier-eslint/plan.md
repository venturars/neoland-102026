# Plan — formato y revisión de código

## Cambios

- `package.json` y `pnpm-lock.yaml`: añadir como dependencias de desarrollo
  exactas `prettier@3.9.10`, `eslint@10.13.0` y `@eslint/js@10.0.1`.
  Mantener las dependencias de ejecución existentes.
- Conservar los scripts existentes y añadir exactamente:

  ```json
  "format": "prettier --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\"",
  "lint": "eslint ."
  ```

- Crear `eslint.config.js` como configuración ESM con las reglas recomendadas
  de `@eslint/js`: importar `defineConfig` desde `eslint/config` y el paquete
  `@eslint/js`; declarar primero las exclusiones globales `.venv/**` y
  `node_modules/**`. Para `**/*.js`, registrar el plugin con el nombre `js`
  y extender `js/recommended`. No añadir otras reglas ni plugins.
- Prettier mantiene sus opciones predeterminadas, sin crear `.prettierrc`
  ni otra configuración propia de formato.
- Actualizar comandos y cierre de tareas en `AGENTS.md`: ejecutar formato
  y lint antes de terminar. Conservar Socket y el resto de las reglas.
- Actualizar `docs/TREE.md` y `docs/ARCHITECTURE.md` para incluir la
  configuración en la raíz de la app y describir sus reglas y exclusiones.
  No modificar `docs/STYLE.md` ni otras guías.
- No editar `logic/`, `queries/`, `db/` ni `clients/` como parte de esta
  incorporación. El comando de formato se limita al JavaScript de las tres
  carpetas indicadas; no formatea documentación, JSON ni el entorno Python.
  No cambiar reglas de negocio ni reescribir código previo para imponer
  una acción por línea.

## Entorno y comprobación

Node disponible: `24.22.0`, compatible con los paquetes propuestos.
pnpm `10.33.0` disponible mediante Corepack en caché temporal, sin cambiar
el gestor del proyecto ni instalarlo globalmente.

Ejecutar `pnpm format` dos veces y confirmar que la segunda no cambia
archivos. Ejecutar `pnpm lint` y comprobar que aplica las reglas recomendadas
al JavaScript con las exclusiones previstas. Revisar los comandos y el
cierre de tareas documentados, los enlaces y el alcance del diff.
No se crean funciones de negocio, consultas ni errores de aplicación.

## Socket — revisión previa a aprobación

Se reutilizan las puntuaciones de las 69 versiones revisadas hasta tres
capas: tres paquetes directos y 66 dependencias/versiones. Ninguna de las
cinco puntuaciones devueltas por Socket es inferior a 50. La tabla conserva
la mínima por versión; la capa 0 identifica los paquetes propuestos.
Prettier y `@eslint/js` no declaran dependencias de ejecución.

Campañas y alertas por versión: «no consta». El MCP permite consultar
alertas organizativas por nombre, sin filtro de versión ni lotes.
Respondió para 33 nombres sin alertas abiertas; después devolvió HTTP 429
por límite de consultas. Esos resultados no certifican las versiones.
El Threat Feed devolvió previamente 403 por falta de licencia específica;
no se volvió a consultar.

«No consta» significa que no se ha podido verificar, no ausencia de riesgos.
Quien aprueba el plan decide sobre estas limitaciones; cualquier alerta
conocida se comenta y su aceptación corresponde a esa persona. Si cambian
las versiones resueltas, se actualiza la revisión antes de aprobar el plan.

| Capa | Paquete y versión | Puntuación mínima | Campaña | Alerta |
| --- | --- | --- | --- | --- |
| 0 | `@eslint/js@10.0.1` | 86 | no consta | no consta |
| 0 | `eslint@10.13.0` | 95 | no consta | no consta |
| 0 | `prettier@3.9.10` | 96 | no consta | no consta |
| 1 | `@eslint-community/eslint-utils@4.10.1` | 84 | no consta | no consta |
| 1 | `@eslint-community/regexpp@4.12.2` | 81 | no consta | no consta |
| 1 | `@eslint/config-array@0.23.5` | 85 | no consta | no consta |
| 1 | `@eslint/config-helpers@0.7.0` | 86 | no consta | no consta |
| 1 | `@eslint/core@1.2.1` | 80 | no consta | no consta |
| 1 | `@eslint/plugin-kit@0.7.3` | 88 | no consta | no consta |
| 1 | `@humanfs/node@0.16.8` | 83 | no consta | no consta |
| 1 | `@humanwhocodes/module-importer@1.0.1` | 79 | no consta | no consta |
| 1 | `@humanwhocodes/retry@0.4.3` | 79 | no consta | no consta |
| 1 | `@types/estree@1.0.9` | 74 | no consta | no consta |
| 1 | `ajv@6.15.0` | 84 | no consta | no consta |
| 1 | `cross-spawn@7.0.6` | 80 | no consta | no consta |
| 1 | `debug@4.4.3` | 81 | no consta | no consta |
| 1 | `escape-string-regexp@4.0.0` | 71 | no consta | no consta |
| 1 | `eslint-scope@9.1.2` | 84 | no consta | no consta |
| 1 | `eslint-visitor-keys@5.0.1` | 83 | no consta | no consta |
| 1 | `espree@11.2.0` | 84 | no consta | no consta |
| 1 | `esquery@1.7.0` | 82 | no consta | no consta |
| 1 | `esutils@2.0.3` | 75 | no consta | no consta |
| 1 | `fast-deep-equal@3.1.3` | 75 | no consta | no consta |
| 1 | `file-entry-cache@11.1.5` | 83 | no consta | no consta |
| 1 | `find-up@5.0.0` | 79 | no consta | no consta |
| 1 | `glob-parent@6.0.2` | 75 | no consta | no consta |
| 1 | `ignore@5.3.2` | 93 | no consta | no consta |
| 1 | `imurmurhash@0.1.4` | 75 | no consta | no consta |
| 1 | `is-glob@4.0.3` | 75 | no consta | no consta |
| 1 | `json-stable-stringify-without-jsonify@1.0.1` | 75 | no consta | no consta |
| 1 | `minimatch@10.2.6` | 87 | no consta | no consta |
| 1 | `natural-compare@1.4.0` | 75 | no consta | no consta |
| 1 | `optionator@0.9.4` | 79 | no consta | no consta |
| 2 | `@eslint/object-schema@3.0.5` | 85 | no consta | no consta |
| 2 | `@humanfs/core@0.19.2` | 83 | no consta | no consta |
| 2 | `@humanfs/types@0.15.0` | 70 | no consta | no consta |
| 2 | `@types/esrecurse@4.3.1` | 79 | no consta | no consta |
| 2 | `@types/json-schema@7.0.15` | 74 | no consta | no consta |
| 2 | `acorn@8.19.0` | 89 | no consta | no consta |
| 2 | `acorn-jsx@5.3.2` | 75 | no consta | no consta |
| 2 | `brace-expansion@5.0.12` | 93 | no consta | no consta |
| 2 | `deep-is@0.1.4` | 75 | no consta | no consta |
| 2 | `eslint-visitor-keys@3.4.3` | 83 | no consta | no consta |
| 2 | `esrecurse@4.3.0` | 75 | no consta | no consta |
| 2 | `estraverse@5.3.0` | 75 | no consta | no consta |
| 2 | `fast-json-stable-stringify@2.1.0` | 75 | no consta | no consta |
| 2 | `fast-levenshtein@2.0.6` | 75 | no consta | no consta |
| 2 | `flat-cache@6.1.23` | 83 | no consta | no consta |
| 2 | `is-extglob@2.1.1` | 75 | no consta | no consta |
| 2 | `json-schema-traverse@0.4.1` | 75 | no consta | no consta |
| 2 | `levn@0.4.1` | 75 | no consta | no consta |
| 2 | `locate-path@6.0.0` | 79 | no consta | no consta |
| 2 | `ms@2.1.3` | 84 | no consta | no consta |
| 2 | `path-exists@4.0.0` | 75 | no consta | no consta |
| 2 | `path-key@3.1.1` | 75 | no consta | no consta |
| 2 | `prelude-ls@1.2.1` | 75 | no consta | no consta |
| 2 | `shebang-command@2.0.0` | 68 | no consta | no consta |
| 2 | `type-check@0.4.0` | 75 | no consta | no consta |
| 2 | `uri-js@4.4.1` | 75 | no consta | no consta |
| 2 | `which@2.0.2` | 83 | no consta | no consta |
| 2 | `word-wrap@1.2.5` | 81 | no consta | no consta |
| 3 | `balanced-match@4.0.4` | 85 | no consta | no consta |
| 3 | `cacheable@2.5.0` | 84 | no consta | no consta |
| 3 | `flatted@3.4.4` | 83 | no consta | no consta |
| 3 | `hookified@1.15.1` | 92 | no consta | no consta |
| 3 | `isexe@2.0.0` | 83 | no consta | no consta |
| 3 | `p-locate@5.0.0` | 80 | no consta | no consta |
| 3 | `punycode@2.3.1` | 81 | no consta | no consta |
| 3 | `shebang-regex@3.0.0` | 69 | no consta | no consta |

## Referencias

- [Configuración de ESLint](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Opciones de Prettier](https://prettier.io/docs/options)
