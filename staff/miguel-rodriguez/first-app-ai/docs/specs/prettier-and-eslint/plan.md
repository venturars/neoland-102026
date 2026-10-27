# Plan de formato y lint para first-app-ai

Estado: aprobado por Miguel el 2026-10-27, con aceptación de los hallazgos Socket de esta propuesta.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-10-27.
Tarea: [issue #496](https://github.com/venturars/neoland-102026/issues/496).
PR: [#497](https://github.com/venturars/neoland-102026/pull/497), en draft y dirigida a `staging`.

## Enfoque y estado al aprobar el plan

Añadir dos comandos de desarrollo a la app Node existente. Prettier aplica su formato estándar; ESLint comprueba errores con las reglas recomendadas. No se añaden operaciones de negocio, firmas públicas, consultas ni mensajes de error de aplicación.

La app tiene doce archivos JavaScript propios: conexión, consultas, ocho operaciones, runner de Jupyter y arranque de Jupyter. No tiene todavía `format`, `lint` ni configuración ESLint. A diferencia de la app de referencia de Ventura, sí contiene JavaScript en `clients/jupyter/` y `scripts/`; ambas ubicaciones deben quedar cubiertas.

Usar configuración declarativa sencilla, sin plugins adicionales, helpers nuevos, hooks, CI o reglas propias para contar acciones por línea. La estructura y comportamiento existentes se conservan. El código nuevo de configuración también entra en el formato y lint.

## Archivos afectados

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`:

| Archivo | Cambio |
| --- | --- |
| `eslint.config.js` | Crear configuración ESM con las reglas recomendadas y los globales usados por esta app. |
| `package.json` | Añadir `format`, `lint` y las tres dependencias de desarrollo exactas aprobadas; mantener `jupyter`, metadata y dependencias existentes. |
| `pnpm-lock.yaml` | Dejar que pnpm registre la resolución; comparar las tres capas con la revisión de este plan. Nunca editarlo manualmente. |
| `db/connection.js`, `queries/users.js`, `logic/*.js` | Aplicar únicamente formato a los diez archivos actuales de estas ubicaciones. |
| `clients/jupyter/run-operation.js`, `scripts/jupyter.js` | Aplicar únicamente formato; conservar selección de operaciones, presentación y arranque. |
| `AGENTS.md` | Añadir ejecución de ambos comandos al terminar tareas, conservando revisiones SDD, verificaciones y Socket. |
| `docs/TREE.md`, `docs/ARCHITECTURE.md` | Incorporar la configuración y los documentos de esta feature, sus responsabilidades y los comandos de desarrollo. |
| `docs/CONSTITUTIONS.md` | Añadir los tres paquetes exactos como herramientas de desarrollo a la relación de dependencias; conservar contratos y reglas de paquetes. |
| `docs/STYLE.md` | Sustituir la frase histórica de que la guía no instala un formateador por una referencia al uso aprobado de los comandos. Conservar el formato estándar y las reglas de pasos. |
| `docs/specs/prettier-and-eslint/` | Mantener spec, plan y, después de su aprobación, tareas y evidencia real. |

No se cambian README, SQL, datos, Python, notebooks, ejemplos `.txt`, specs históricas ni otros proyectos. No se añaden `.prettierrc`, `.prettierignore`, configuración EditorConfig, scripts envoltorio o comandos adicionales.

## Paquetes y compatibilidad

Propuesta de desarrollo, con versiones verificadas en el registro npm el 2026-10-27:

| Paquete | Versión | Motivo |
| --- | --- | --- |
| `prettier` | `3.9.10` | Formato estándar, sin configuración propia. |
| `eslint` | `10.13.0` | Comprobación del JavaScript mediante su CLI. |
| `@eslint/js` | `10.0.1` | Reglas recomendadas oficiales, sin duplicarlas manualmente. |

Son las versiones de referencia de Ventura; se revisan para nuestra propuesta, sin trasladar su aceptación de riesgos. No se propone `globals`: los únicos globales Node adicionales usados en estos archivos son `console` y `process`, declarables directamente en la configuración.

Prettier declara Node `>=14`; ESLint y `@eslint/js` declaran `^20.19.0 || ^22.13.0 || >=24`. Los 61 paquetes revisados admiten Node 24.12.0 según sus metadatos de engines. Node 24.12.0 está instalado y se puede usar en las copias de verificación; el shell actual informa 24.22.1. No se cambia la versión del proyecto ni se añade `.nvmrc`.

La consulta `pnpm --version` de esta sesión quedó bloqueada por el intento de Corepack de consultar el registro desde el sandbox. No se ha confirmado una versión de pnpm ni ejecutado instalación. Antes de implementar se comprobará que el pnpm del entorno puede ejecutarse con el Node elegido; cualquier necesidad de instalar o cambiar herramientas se comunicará antes de hacerlo.

### Resolución comprobada durante la implementación — 2026-10-27

Corepack ya puede ejecutar pnpm. La instalación y todas las verificaciones se realizaron con Node 24.12.0 y la selección explícita `pnpm@10.33.0` mediante Corepack, con `COREPACK_ENABLE_AUTO_PIN=0`. El comando genérico de Corepack resolvió pnpm 12.15.0; no se utilizó esa versión para generar el lockfile ni para estas pruebas. No se cambiaron perfiles, versión del proyecto ni `packageManager`.

El lockfile generado coincide con los 61 pares nombre/versión y las 71 relaciones de las tres capas revisadas. Las resoluciones preexistentes se conservan. No hubo diferencias que exigieran ampliar la aceptación Socket. Las pruebas ejecutadas están en [tasks.md](tasks.md#evidencia-y-decisiones).

## Comandos propuestos

En `package.json`, manteniendo el comando `jupyter` actual:

```json
{
  "format": "prettier --no-config --no-editorconfig --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\" \"clients/jupyter/**/*.js\" \"scripts/**/*.js\" \"eslint.config.js\"",
  "lint": "eslint ."
}
```

Los patrones van entre comillas para que los interprete la herramienta también en Windows. Todos tienen archivos existentes, salvo la configuración que se creará antes de ejecutarlos. No se usa `prettier .`, que alcanzaría documentación y archivos Python o generados. `--no-config --no-editorconfig` conserva los defaults aun si existe una configuración en directorios superiores; no introduce opciones propias de estilo.

`lint` no usa `--fix`. Ambos comandos deben propagar sus fallos. Al terminar una tarea se ejecutan primero `pnpm format` y después `pnpm lint`; un fallo impide declararla terminada.

## Configuración ESLint

Contenido propuesto de `eslint.config.js`:

```js
import js from "@eslint/js";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.venv/**",
      "**/__pycache__/**",
      "**/.ipynb_checkpoints/**",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: js.configs.recommended.rules,
  },
];
```

El `export default` es la interfaz que ESLint exige a su archivo de configuración; queda limitado a ese archivo y no cambia la convención de exports nombrados de las operaciones de la app.

La configuración incluye el runner y el arranque de Jupyter y también se comprueba a sí misma. Los globales reconocen su entorno Node; no se desactiva `no-undef`. No se apagan reglas recomendadas para ocultar errores ni se obliga a refactorizar por formato.

Aún no se ha ejecutado ESLint sobre esta app. Si durante la verificación aparece un error que requiera cambiar lógica existente, se documentará y resolverá antes de continuar; no se convertirá silenciosamente en una corrección de comportamiento dentro de esta tarea.

## Documentación y conservación

AGENTS exige ambos comandos al finalizar tareas y remite a STYLE para la escritura. STYLE conserva una acción por línea para código nuevo, sin afirmar que lint compruebe esa regla ni exigir aplicarla al código antiguo. TREE refleja todos los archivos propios, incluido este desarrollo; ARCHITECTURE describe el papel de la configuración y los comandos. La constitución enumera las dependencias de desarrollo aprobadas sin modificar sus contratos o reglas Socket.

La actualización de estos documentos es puntual y de contenido: el comando de formato no los incluye. El procedimiento Socket completo del manual y todas las specs anteriores deben permanecer íntegros.

## Verificación después de las aprobaciones

1. Guardar referencia del inventario y contenido actual. Preparar una copia desechable sin bases locales, `.venv`, dependencias instaladas ni cachés. Mantener los datos de trabajo fuera de todas las pruebas.
2. Una vez aprobados este plan, los hallazgos y las tareas, instalar con pnpm las tres versiones exactas en la copia: `pnpm add -D --save-exact prettier@3.9.10 eslint@10.13.0 @eslint/js@10.0.1`. Comparar su lockfile con las tres capas revisadas antes de ejecutar las herramientas. Si cambia una versión o aparece otro paquete en esas capas, revisar la diferencia con Socket y esperar la aprobación del plan actualizado. Verificar también que las dependencias existentes no se hayan actualizado incidentalmente.
3. Crear configuración y comandos. Ejecutar Prettier `--debug-check` con los mismos patrones y defaults sobre el JavaScript existente, sin combinarlo con `--write`. Ejecutar `pnpm format`, comprobar los archivos incluidos y repetirlo: la segunda ejecución no debe producir nuevos cambios. Revisar el diff para confirmar formato sin modificaciones de lógica, comentarios significativos, mensajes o contratos.
4. Ejecutar `pnpm lint` sobre el código entregable y comprobar código de salida 0. En la copia, introducir un error de sintaxis en un archivo propio y comprobar salida distinta de 0 con diagnóstico del archivo. Restaurarlo y repetir lint. Comprobar además un uso de variable no definida en la copia para acreditar que se aplican las reglas recomendadas, no solo el parser; restaurar y comprobar otra vez.
5. Comparar SQL, Python, notebooks, ejemplos de terminal, specs históricas y demás archivos protegidos con la referencia: contenido idéntico. Comprobar árbol, responsabilidades, versiones, enlaces, instrucciones de finalización y que no se añadió configuración de Prettier. Registrar comandos y resultados reales en las tareas, sin declarar que las herramientas ya se probaron al redactar este plan.
6. Incorporar únicamente los archivos previstos y el formato verificado al proyecto de trabajo tras completar la comparación del lockfile. Con dependencias aprobadas y disponibles, repetir los comandos finales sobre la entrega y revisar el diff. Las herramientas analizan/formatean código; no arrancan Jupyter, no importan operaciones de la app ni abren su base de datos. Retirar las copias desechables creadas para esta tarea.

No se atribuye una prueba funcional del clasificador u otras operaciones a un lint satisfactorio. No se requieren instalaciones Python ni acceso a Ollama para comprobar este cambio de herramientas y formato.

## Revisión Socket — 2026-10-27

### Fuentes y consultas

- Metadatos del registro npm: `GET https://registry.npmjs.org/<nombre>/<versión>` para las raíces y metadatos de versiones para resolver los rangos de dependencias. Lectura con curl y semver ya disponible en npm, sin instalar ni ejecutar los paquetes propuestos.
- MCP `organizations`: organización `neoland`, plan free. MCP `depscore`: nombres y versiones exactos de las 61 entradas de la tabla, en cinco lotes. Cinco métricas disponibles por versión.
- MCP `alerts(org_slug="neoland", per_page=100)`: lista monitorizada vacía y `endCursor: null`; no acredita ausencia de alertas de estas versiones.
- Alertas por versión: `POST https://api.socket.dev/v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20`, con 61 `components` PURL exactos. HTTP 200, 61 respuestas NDJSON; nombre con namespace, versión e `inputPurl` cotejados uno a uno. Todas tienen revisión; no hay entradas ausentes, `pendingScan` o `notFound`. Sin filtros de severidad, acción o posibilidad de corrección.
- Campañas: `GET https://api.socket.dev/v1/orgs/neoland/threat-campaigns/?ecosystem=npm&per_page=5` devuelve HTTP 403: no habilitadas para la organización. **campaigns: coverage limited by the Socket plan**. No se afirma ausencia de campañas. No se trasladan a esta revisión las conclusiones de una lista general del dashboard ni alertas de malware como prueba de cobertura completa.
- Credencial existente leída fuera del repositorio y enviada solo por la entrada estándar de curl; no se registra en argumentos, documentos ni logs.

### Resolución esperada y relaciones

Tres capas en total: 1 = paquetes propuestos; 2 = sus dependencias directas; 3 = las dependencias directas de la capa 2. Son 61 pares nombre/versión distintos: 3 + 30 + 28. Se conserva una sola fila por par aunque tenga varios padres; los números no incluyen la cuarta capa.

La resolución esperada procede de los rangos y versiones publicados actualmente, no de una instalación ya hecha. El lockfile de la app todavía no contiene estas herramientas. La comparación posterior con pnpm es obligatoria: este resumen no garantiza que pnpm elija idéntica resolución.

`prettier` no tiene dependencias. El peer opcional `eslint` de `@eslint/js` se satisface con la raíz propuesta. Otros peers resueltos dentro de estas capas se incluyen en las relaciones. Se excluye `jiti`, peer opcional no seleccionado de ESLint: la configuración propuesta es JavaScript y no se propone instalarlo. Ninguna de las 61 entradas declara restricciones OS/CPU; no se excluye ninguna por plataforma.

| Padre | Dependencias resueltas en las capas revisadas |
| --- | --- |
| `@eslint-community/eslint-utils@4.10.1` | `eslint-visitor-keys@3.4.3`, `eslint@10.13.0` (peer) |
| `@eslint/config-array@0.23.5` | `@eslint/object-schema@3.0.5`, `debug@4.4.3`, `minimatch@10.2.6` |
| `@eslint/config-helpers@0.7.0` | `@eslint/core@1.2.1` |
| `@eslint/core@1.2.1` | `@types/json-schema@7.0.15` |
| `@eslint/js@10.0.1` | `eslint@10.13.0` (peer) |
| `@eslint/plugin-kit@0.7.3` | `levn@0.4.1`, `@eslint/core@1.2.1` |
| `@humanfs/node@0.16.8` | `@humanfs/core@0.19.2`, `@humanfs/types@0.15.0`, `@humanwhocodes/retry@0.4.3` |
| `ajv@6.15.0` | `uri-js@4.4.1`, `fast-deep-equal@3.1.3`, `json-schema-traverse@0.4.1`, `fast-json-stable-stringify@2.1.0` |
| `cross-spawn@7.0.6` | `which@2.0.2`, `path-key@3.1.1`, `shebang-command@2.0.0` |
| `debug@4.4.3` | `ms@2.1.3` |
| `eslint-scope@9.1.2` | `@types/esrecurse@4.3.1`, `@types/estree@1.0.9`, `esrecurse@4.3.0`, `estraverse@5.3.0` |
| `eslint@10.13.0` | `ajv@6.15.0`, `debug@4.4.3`, `espree@11.2.0`, `ignore@5.3.2`, `esquery@1.7.0`, `esutils@2.0.3`, `find-up@5.0.0`, `is-glob@4.0.3`, `minimatch@10.2.6`, `optionator@0.9.4`, `cross-spawn@7.0.6`, `glob-parent@6.0.2`, `imurmurhash@0.1.4`, `@eslint/core@1.2.1`, `eslint-scope@9.1.2`, `@humanfs/node@0.16.8`, `@types/estree@1.0.9`, `fast-deep-equal@3.1.3`, `natural-compare@1.4.0`, `file-entry-cache@11.1.5`, `@eslint/plugin-kit@0.7.3`, `eslint-visitor-keys@5.0.1`, `@eslint/config-array@0.23.5`, `@humanwhocodes/retry@0.4.3`, `escape-string-regexp@4.0.0`, `@eslint/config-helpers@0.7.0`, `@eslint-community/regexpp@4.12.2`, `@eslint-community/eslint-utils@4.10.1`, `@humanwhocodes/module-importer@1.0.1`, `json-stable-stringify-without-jsonify@1.0.1` |
| `espree@11.2.0` | `acorn@8.19.0`, `acorn-jsx@5.3.2`, `eslint-visitor-keys@5.0.1` |
| `esquery@1.7.0` | `estraverse@5.3.0` |
| `file-entry-cache@11.1.5` | `flat-cache@6.1.23` |
| `find-up@5.0.0` | `locate-path@6.0.0`, `path-exists@4.0.0` |
| `glob-parent@6.0.2` | `is-glob@4.0.3` |
| `is-glob@4.0.3` | `is-extglob@2.1.1` |
| `minimatch@10.2.6` | `brace-expansion@5.0.12` |
| `optionator@0.9.4` | `prelude-ls@1.2.1`, `deep-is@0.1.4`, `word-wrap@1.2.5`, `type-check@0.4.0`, `levn@0.4.1`, `fast-levenshtein@2.0.6` |

### Puntuaciones y alertas por versión

Métricas MCP en escala 0–100: SC = supply chain, V = vulnerabilidad, Q = calidad, M = mantenimiento, L = licencia. Mínimo observado: Q 68 en `shebang-command@2.0.0`. Ninguna métrica está por debajo de 50; esto no equivale a ausencia de alertas. La tabla usa MCP. La API de alertas devuelve además sus propias puntuaciones: coincide salvo supply chain de `prettier@3.9.10`, 97 en la API frente a 98 en MCP. Se conservan ambas lecturas, sin elegir la más favorable; ninguna cruza el umbral.

La API devuelve 108 ocurrencias en 37 versiones: 106 bajas y 2 medias (`middle` en la respuesta). Todas aparecen con acción `ignore` por política de la organización. Se incluyen igualmente; esa acción no sustituye la decisión de Miguel. Las otras 24 versiones devuelven arrays vacíos de alertas para la revisión consultada, no una garantía general de seguridad.

| Capa | Paquete exacto | SC | V | Q | M | L | Alertas recibidas (ocurrencias) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `@eslint/js@10.0.1` | 100 | 100 | 100 | 86 | 100 | Ninguna devuelta |
| 1 | `eslint@10.13.0` | 97 | 100 | 100 | 95 | 100 | debugAccess / baja ×2; envVars / baja ×6; filesystemAccess / baja ×7; urlStrings / baja ×1 |
| 1 | `prettier@3.9.10` | 98 | 100 | 96 | 97 | 100 | debugAccess / baja ×4; envVars / baja ×4; filesystemAccess / baja ×6; gptAnomaly / baja ×1; minifiedFile / baja ×12; urlStrings / baja ×1 |
| 2 | `@eslint-community/eslint-utils@4.10.1` | 99 | 100 | 84 | 85 | 100 | Ninguna devuelta |
| 2 | `@eslint-community/regexpp@4.12.2` | 99 | 100 | 100 | 81 | 100 | Ninguna devuelta |
| 2 | `@eslint/config-array@0.23.5` | 100 | 100 | 100 | 85 | 100 | Ninguna devuelta |
| 2 | `@eslint/config-helpers@0.7.0` | 100 | 100 | 100 | 86 | 100 | filesystemAccess / baja ×1 |
| 2 | `@eslint/core@1.2.1` | 100 | 100 | 80 | 85 | 100 | Ninguna devuelta |
| 2 | `@eslint/plugin-kit@0.7.3` | 100 | 100 | 100 | 88 | 100 | Ninguna devuelta |
| 2 | `@humanfs/node@0.16.8` | 100 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 2 | `@humanwhocodes/module-importer@1.0.1` | 99 | 100 | 93 | 79 | 100 | debugAccess / baja ×2 |
| 2 | `@humanwhocodes/retry@0.4.3` | 100 | 100 | 99 | 79 | 100 | Ninguna devuelta |
| 2 | `@types/estree@1.0.9` | 100 | 100 | 74 | 80 | 100 | Ninguna devuelta |
| 2 | `ajv@6.15.0` | 99 | 100 | 100 | 84 | 100 | gptAnomaly / baja ×3; urlStrings / baja ×1; usesEval / media ×1 |
| 2 | `cross-spawn@7.0.6` | 99 | 100 | 97 | 80 | 100 | envVars / baja ×2; filesystemAccess / baja ×1; gptAnomaly / baja ×1; shellAccess / media ×1 |
| 2 | `debug@4.4.3` | 99 | 100 | 100 | 81 | 100 | envVars / baja ×6 |
| 2 | `escape-string-regexp@4.0.0` | 100 | 100 | 71 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `eslint-scope@9.1.2` | 100 | 100 | 100 | 84 | 100 | Ninguna devuelta |
| 2 | `eslint-visitor-keys@5.0.1` | 100 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 2 | `espree@11.2.0` | 100 | 100 | 100 | 84 | 100 | Ninguna devuelta |
| 2 | `esquery@1.7.0` | 100 | 100 | 82 | 82 | 100 | minifiedFile / baja ×2 |
| 2 | `esutils@2.0.3` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `fast-deep-equal@3.1.3` | 100 | 100 | 99 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `file-entry-cache@11.1.5` | 100 | 100 | 100 | 83 | 100 | filesystemAccess / baja ×2 |
| 2 | `find-up@5.0.0` | 100 | 100 | 99 | 79 | 100 | Ninguna devuelta |
| 2 | `glob-parent@6.0.2` | 100 | 100 | 99 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `ignore@5.3.2` | 99 | 100 | 100 | 93 | 100 | envVars / baja ×2 |
| 2 | `imurmurhash@0.1.4` | 100 | 100 | 99 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `is-glob@4.0.3` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `json-stable-stringify-without-jsonify@1.0.1` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `minimatch@10.2.6` | 99 | 100 | 100 | 87 | 100 | envVars / baja ×6 |
| 2 | `natural-compare@1.4.0` | 100 | 100 | 99 | 75 | 100 | unmaintained / baja ×1 |
| 2 | `optionator@0.9.4` | 99 | 100 | 100 | 79 | 100 | Ninguna devuelta |
| 3 | `@eslint/object-schema@3.0.5` | 100 | 100 | 100 | 85 | 100 | Ninguna devuelta |
| 3 | `@humanfs/core@0.19.2` | 100 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 3 | `@humanfs/types@0.15.0` | 100 | 100 | 70 | 82 | 100 | Ninguna devuelta |
| 3 | `@types/esrecurse@4.3.1` | 100 | 100 | 89 | 79 | 100 | Ninguna devuelta |
| 3 | `@types/json-schema@7.0.15` | 100 | 100 | 74 | 79 | 100 | Ninguna devuelta |
| 3 | `acorn@8.19.0` | 100 | 100 | 100 | 89 | 100 | Ninguna devuelta |
| 3 | `acorn-jsx@5.3.2` | 100 | 100 | 82 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `brace-expansion@5.0.12` | 100 | 100 | 100 | 93 | 100 | Ninguna devuelta |
| 3 | `deep-is@0.1.4` | 100 | 100 | 89 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `eslint-visitor-keys@3.4.3` | 100 | 100 | 100 | 83 | 100 | Ninguna devuelta |
| 3 | `esrecurse@4.3.0` | 99 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `estraverse@5.3.0` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `fast-json-stable-stringify@2.1.0` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `fast-levenshtein@2.0.6` | 100 | 100 | 99 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `flat-cache@6.1.23` | 99 | 100 | 100 | 83 | 100 | filesystemAccess / baja ×2 |
| 3 | `is-extglob@2.1.1` | 100 | 100 | 97 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `json-schema-traverse@0.4.1` | 100 | 100 | 94 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `levn@0.4.1` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `locate-path@6.0.0` | 100 | 100 | 99 | 79 | 100 | filesystemAccess / baja ×1 |
| 3 | `ms@2.1.3` | 100 | 100 | 86 | 84 | 100 | Ninguna devuelta |
| 3 | `path-exists@4.0.0` | 100 | 100 | 80 | 75 | 100 | filesystemAccess / baja ×1; unmaintained / baja ×1 |
| 3 | `path-key@3.1.1` | 100 | 100 | 84 | 75 | 100 | envVars / baja ×1; unmaintained / baja ×1 |
| 3 | `prelude-ls@1.2.1` | 100 | 100 | 75 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `shebang-command@2.0.0` | 100 | 100 | 68 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `type-check@0.4.0` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `uri-js@4.4.1` | 100 | 100 | 100 | 75 | 100 | unmaintained / baja ×1 |
| 3 | `which@2.0.2` | 99 | 100 | 83 | 85 | 100 | envVars / baja ×4; gptAnomaly / baja ×1 |
| 3 | `word-wrap@1.2.5` | 100 | 100 | 100 | 81 | 100 | Ninguna devuelta |

### Significado de los hallazgos y decisión de Miguel

- `ajv@6.15.0`: `usesEval`, media, en `package/lib/compile/index.js`; la API identifica construcción `Function` al compilar validaciones. Es capacidad de ejecutar código generado; no se presenta como una vulnerabilidad o malware demostrado por esta consulta.
- `cross-spawn@7.0.6`: `shellAccess`, media, en `package/index.js`; usa `child_process` para lanzar procesos. Corresponde al propósito del paquete, pero sigue siendo una capacidad relevante que se acepta o rechaza explícitamente.
- Las bajas incluyen acceso al sistema de archivos, variables de entorno, carga/importación dinámica, texto de URLs, archivos minificados, detecciones heurísticas `gptAnomaly` y paquetes sin publicaciones recientes (`unmaintained`). Son señales de capacidad, distribución o mantenimiento. Las notas heurísticas no constituyen una revisión manual del código ni se usan para descartar las alertas.
- No se recibió ninguna alerta alta o crítica ni un hallazgo de vulnerabilidad en este conjunto consultado. El alcance está limitado a las versiones y revisión devueltas y a tres capas; la cuarta capa y posteriores no están auditadas por este procedimiento.

**Decisión de Miguel — 2026-10-27: aprobada esta propuesta y aceptados sus hallazgos Socket**, incluidas las 108 ocurrencias (en particular las dos medias), la cobertura limitada de campañas y la resolución esperada. La aceptación corresponde a las versiones y el alcance documentados; no cubre cambios posteriores en las tres capas ni paquetes de otras tareas. Al aprobar el plan no se había instalado ni ejecutado ninguna herramienta propuesta. No se hereda la aceptación de Ventura ni la de paquetes de tareas anteriores.

Tras revisar y aprobar este plan y su propuesta de paquetes se prepararán las tareas para revisión independiente. Su aprobación será necesaria antes de instalar o implementar. Si quedan hallazgos sin decisión o la resolución cambia en las capas revisadas, no se declara terminada la revisión ni se avanza bajo una aprobación anterior.

## Referencias técnicas

- [Configuración de ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) y [opciones de lenguaje y globales](https://eslint.org/docs/latest/use/configure/language-options).
- [CLI de Prettier](https://prettier.io/docs/cli) y [opciones predeterminadas](https://prettier.io/docs/options).
- [Autenticación de Socket](https://docs.socket.dev/reference/authentication). La revisión de paquetes sigue el procedimiento propio de AGENTS.
