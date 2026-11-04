Issue: #751

# Verificación de la corrección al flujo original

Estado: spec, plan y C01–C20 aprobados conjuntamente. Corrección implementada y comprobada localmente; pendiente revisión humana; commit selectivo y push autorizados en la misma rama y PR #756.

Fuente: `exercises/git-workflow-agent-template` en `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`; último cambio del template `25208d23157626954906ffe7da32757c58d9a66e`. Rama de trabajo `751-chore-asistenciapp-git-five-stages`, HEAD de partida de la corrección `25a2858920c3eda5f46a199c7b9d11cfeee031c6`.

## Comparación con la fuente

Se verificaron los 42 archivos de las cinco carpetas. Se comprobaron los identificadores de blob contra el commit fijado y SHA-256 de los bytes de fuente y copia. Hay 34 coincidencias exactas y 8 adaptaciones permitidas: un párrafo en el orquestador y una ruta en cada una de siete skills. No hay otras diferencias respecto de la fuente.

| Grupo | Iguales byte a byte | Adaptaciones |
| --- | --- | --- |
| tools | 7 | 0 |
| agents | 6 | 1 |
| skills | 8 | 7 |
| templates | 12 | 0 |
| MCPS | 1 | 0 |

Los siete scripts se obtuvieron de los blobs Git, con LF, sin traducción ni cambios de código. Las doce plantillas recuperaron LF en el árbol de trabajo para coincidir también por hash; su contenido Git no cambió. Se retiraron los ocho archivos PowerShell y su ensayo propio. No se añadieron helpers ni ensayos permanentes de reemplazo.

El modo de los siete scripts en la fuente es `100755`. Antes del commit de publicación se releyó el índice temporal: los siete tienen modo 100755 y el mismo identificador de blob que la fuente fijada. Durante la implementación se invocaron mediante Bash sin preparar el índice.

El diff de corrección respecto de HEAD comprende 48 rutas: 31 archivos modificados, 9 retirados y 8 nuevos (los siete scripts y este informe). Las doce plantillas no tienen diff de contenido Git.

## Pruebas ejecutadas

Windows y Git Bash 5.3.15 ya instalado, sin instalaciones ni cambios de configuración personal.

- `bash --noprofile --norc -n <script>`: los siete scripts aceptados. Estos siete resultados se obtuvieron una vez y no se repitieron al ajustar el entorno del ensayo.
- `bash --noprofile --norc staff/jimena-duran/asistenciapp/tools/check-status.sh`: salida 0 desde la raíz del repositorio y desde un repositorio temporal en una ruta con espacios. Es la única herramienta ejecutada sobre el repositorio de trabajo y es de lectura.
- C19: 35 comprobaciones satisfactorias de estado y contratos, exclusivamente con archivos ficticios y un remoto bare local. El arnés y sus registros `commands.json` y `result.json` quedaron en la carpeta temporal de ensayo, fuera del proyecto; no se incorporan herramientas propias a la entrega.
- `python -m pytest tests/test_sdd_rules.py -k "sdd_gates or constitution_amendment" -q`, con el intérprete existente de la aplicación: 11 aprobadas y 29 no seleccionadas. Las diez comprobaciones de puertas se ejecutaron antes de adaptar los documentos y fallaron como se esperaba; después pasaron las 11 afectadas. No se ejecutaron pruebas funcionales.
- `git diff --check` y comprobación de espacios de todos los archivos afectados, incluidos los nuevos: correctos; sin cambios preparados.
- Comparación AST: las cuatro funciones de prueba ajenas al ajuste de `test_sdd_gates` son idénticas, incluida la de versión constitucional; se conservaron las mismas funciones y parametrizaciones. Solo cambiaron los textos del flujo y se añadieron expectativas de prioridad local y ausencia de pausas intermedias.

Contratos comprobados sobre repositorios desechables:

1. Actualización por avance rápido conserva la rama actual y adelanta staging; divergencia rechazada conservando referencias.
2. Rama nueva desde origin/staging; recuperación local sin perder commits y recuperación remota con upstream.
3. Otra base con tipo `maintenance`, sin plantilla propia ni cambio del nombre de rama.
4. `create-empty-commit.sh 901`: mensaje `chore: open #901`, árbol vacío respecto del padre e índice ajeno conservado.
5. `commit-changes.sh "docs: change selected fixture" "named file.txt"`: solo el archivo indicado, con espacio en el nombre; índice ajeno conservado.
6. `launch-push.sh`: SHA y upstream comprobados contra el bare local. Un segundo escenario sin avance rápido se rechaza sin modificar el remoto local.
7. Rechazos propios de los originales: número o descripción inválidos, staging como base del script alternativo, apertura en staging, archivos omitidos y argumentos indebidos o de fuerza.

No se probaron como garantías los controles extra ausentes del original. Los scripts de mutación solo se ejecutaron dentro de la carpeta temporal y cada invocación comprobó antes que origin era el bare local. El arnés descartó variables de contexto Git heredadas y usó configuración aislada. Al retirar la configuración global para la primera lectura de estado, Git rechazó el propietario del repositorio; se ajustó únicamente `safe.directory` en el entorno de ese proceso, sin configuración persistente ni cambio de los originales. Ese primer intento no creó commits ni hizo push.

## Revisión estática y límites

El SDD local prevalece expresamente en AGENTS, §4 y el párrafo añadido al orquestador. Se mantienen cinco momentos, documentos juntos y autorización para implementar separada de publicación. El ajuste constitucional se limita a §4 y la entrada 3.1; se mantienen versión, fecha local, principios y resto del documento.

Se recorrieron en lectura los agentes y las quince skills: selección de las doce plantillas y alternativa más cercana, separación de roles, enlace de issue y referencia MCP. MCP y gh se documentan sin modificar configuración personal. No se ejecutó una interacción integral de agentes con GitHub ni se probaron escrituras remotas. La referencia MCP y los enlaces de instalación se conservaron como texto de la fuente, sin ejecutar esas instrucciones.

Las solicitudes de recuperar originales y limitar la adaptación están atendidas localmente. La clasificación completa de los 13 registros sigue en el plan. En los ocho hilos inline:

| Observación | Resultado de esta corrección |
| --- | --- |
| URL de origin con credenciales | Código propio retirado; el original muestra upstream, no la URL |
| Variables Git heredadas en el ensayo propio | Ensayo propio retirado; no acredita aislamiento de los originales |
| Colisiones mezcladas en el ensayo propio | Ensayo propio retirado; su evidencia no valida los originales |
| Directorio versionado ya eliminado | Sigue presente en la fuente, sin corrección local |
| Carrera entre comprobación y avance de staging | Sigue presente en la fuente, sin corrección local |
| Orden de revisores y salida de draft | Sigue presente en el texto original, sin corrección local |
| Sincronización después de un borrado preparado | Sigue presente en la fuente, sin corrección local |
| Etiquetas implícitas con push.followTags | Sigue presente en la fuente, sin corrección local |

No se respondieron comentarios ni se resolvieron conversaciones.

## Conservación

3.402 archivos protegidos conservan exactamente su SHA-256 inicial. Otros 12 archivos protegidos son las plantillas: solo cambiaron CRLF a los LF originales y ahora sus hashes coinciden con los blobs fijados. Ambas bases SQLite, pruebas funcionales, specs anteriores, first-app y `verification.md` están entre los archivos intactos. ChromaDB conserva sus 27.292 entradas, tamaños y fechas; ese inventario no afirma igualdad mediante hash de su contenido.

Durante la implementación se conservaron las referencias de HEAD, staging y origin/staging. La rama pausada y su referencia remota local se conservan en `ba7b36490b3018c51353b6579383064df51aabff`. Durante la implementación no se hizo commit ni push del repositorio de trabajo ni se modificó GitHub. El índice quedó sin preparar; las modificaciones corresponden solo al alcance aprobado de AsistenciApp. La autorización posterior permite publicar selectivamente la corrección y actualizar su descripción en la PR existente, conservando los vínculos y revisores.

`verification.md` permanece intacto: sus resultados son de la implementación anterior y no se presentan como validación de Bash. Los procesos de ensayo terminaron; las carpetas temporales se conservan para inspección.

Pendiente: revisión humana. El modo Git 100755 y los siete blobs originales quedaron comprobados antes del commit selectivo. Los cinco problemas heredados siguen señalados como límites de la fuente; esta corrección no los resuelve.

## Hashes de coincidencias exactas

SHA-256 común a fuente y copia, calculado sobre bytes sin normalizar durante la comparación:

| Archivo | SHA-256 común |
| --- | --- |
| `MCPS/github-mcp-server/mcp.txt` | `1d35dd2b945863e2c9ac08c24850769f55bdd5df35d43b06384e2747af0dfffd` |
| `agents/create-branch.md` | `b7c0d056483fabf19e02a5f1f659dac2b3791fe28c124886f09a3eb09a10be65` |
| `agents/create-commit.md` | `43585e9db9f929088e9bdd5cad3010980515d8e84999598987bf9f51126ae2f1` |
| `agents/create-issue.md` | `8ceddc02f1f323b84a08ba004c490eb52eab3571343661d92b87263e42e79e48` |
| `agents/create-pr.md` | `a80ce883c4696364eb3eceb6d8a6589696f748f44ba0b454da0b02587bb2659c` |
| `agents/help-me-to-think.md` | `f5d562ed04c7d1ad4f56b3dec47abc123f7f813a106a7e8f756376430e5e8322` |
| `agents/launch-push.md` | `4262dacbc3f9e4ccacf94b74526ab4cc92ce7ee0e8efa4069beb4d0a24118d66` |
| `skills/assign-author/SKILL.md` | `52f45de66d3b6c5fc6a7465721c77e1f55f984e0804953b2e94cab97efc778db` |
| `skills/assign-reviewers/SKILL.md` | `f09834491ac276a18b502da65e32c982b8cd737692f959460dd71904c2897eed` |
| `skills/create-draft/SKILL.md` | `d7ac36c107b4c23d811e196b113b23108d6df8f6357d2e78a4c8bda24f905bb8` |
| `skills/create-issue/SKILL.md` | `7642907ce21eca0beedee1722296ce721a005e28cbee914d2299632fcfbdc629` |
| `skills/create-pr-base-staging/SKILL.md` | `0adba118cb868dde02584d65f7749808d478d3fccdbee8d44ed5b31bb3b3ae3b` |
| `skills/grill-me/SKILL.md` | `7b9ffcfaa1c21544cb728c610a10bbc38a91f574ac7fc8d9c0fc904bedde7376` |
| `skills/grill-with-docs/SKILL.md` | `0e23efaeb4ec0cc0ddc4b990a937846dafcbe1f9d6342d56a4c05f03fcabc0cc` |
| `skills/link-pr-to-issue/SKILL.md` | `93a06c0a096bf30b2b2b032874e2e738dea611815bb660605993ccaa900470fc` |
| `templates/issues/chore_issue.md` | `42902fbd091bd2a3da5e18fba2283c750ae831ad699a58f6f81447c17e9b3592` |
| `templates/issues/docs_issue.md` | `916e0089b4c38e4fd7fa5b9e11ab6c4c0cfefd0b1bd9539d51fdd14109181e0f` |
| `templates/issues/feat_issue.md` | `9733cadfddfe7a193b560b8192a343a0bb689873aef54243192b66c4ab14e129` |
| `templates/issues/fix_issue.md` | `061060e0552c0410cdb0973b905026399c7e386522e059e0848c9188b882ca02` |
| `templates/issues/refactor_issue.md` | `84a9ea124d4254f1d3e3d37554d7441855bd7db2654c43a52bbe2910d6d34332` |
| `templates/issues/test_issue.md` | `65f6c352588e2728a0e430227f653da85e1ac85799a448573cf4d4c85df09b8a` |
| `templates/pull-request/chore-pull-request.md` | `dd5a2cbbcccecdbef470dda5cfbc30168368723e51864addd9191734363887c3` |
| `templates/pull-request/docs-pull-request.md` | `86ef508a593fbf8d672f27cacd701ba9c0dddd5fa8df96f1aab02c3d6102e90d` |
| `templates/pull-request/feat-pull-request.md` | `ec974ebfe8afb76f844322820569a990f2cad75d2571ef75867c1cc1722a37a9` |
| `templates/pull-request/fix-pull-request.md` | `38e86dcfe3e054e6687aa391eebbb729f0afa4691ab8e462fb782bee5588440c` |
| `templates/pull-request/refactor-pull-request.md` | `35ed529ea97cbaf73b599ffcfab16199a29921f99914a75249960adc61425a4c` |
| `templates/pull-request/test-pull-request.md` | `84822e45e59d08a66db665724ac9522ade623bc6c3b0a90f449f746a71a9260c` |
| `tools/check-status.sh` | `e41ce438c1966b272786643b332aefa2971b66d6b48fbf2f9dd588cc473a7a8b` |
| `tools/commit-changes.sh` | `edc11a741b10b3e707175550bc0e433ca3e85c07dbaa606ba4b4fd91c3a6be33` |
| `tools/create-branch-from-staging.sh` | `a2dbad01adbec9011cf749bee996077a68a66c5f06e2ad4bf4afd04106eb3da6` |
| `tools/create-branch.sh` | `cbf05f7cb63f32416f7e827afdbc281c327dbfa9131e42b3a60a375cf26dbf78` |
| `tools/create-empty-commit.sh` | `268632341863a6b954a1af1bf91b405d52ab08d7b8241f7f93039a9a7f47d4a9` |
| `tools/launch-push.sh` | `b0926ff8fe7ceb72f528237d8fa8e6f09562666573515e71edcee717d26d9c3e` |
| `tools/pull-changes.sh` | `54edd880a04821ed726f5b9fbaace0b2eff5cd0b3e56d4dbffd14ef9f4503cdd` |

## Hashes de adaptaciones permitidas

| Archivo | SHA-256 fuente | SHA-256 copia |
| --- | --- | --- |
| `agents/git-workflow-agent.md` | `5074a3f89c4e8a32de27a2ef29874262190b1e872f4fa89fcf129e8af5a7d060` | `3f00e61ea4bdb0698e833269f2583efefb981cb88c87e0df50042cc071903f99` |
| `skills/check-status/SKILL.md` | `cffc58ea09e56089e11635ede3ec471e9360bb31f8be379bcf3a364f7d6cb19b` | `7be2af6da83be35b056b1065acb91cdfeb702cde2aa9872067f353fa2c43d851` |
| `skills/commit-changes/SKILL.md` | `8878137c88a4c4952fa98effb5f39b7c05dfa25750975e1dfb0b3eb21f3d3e47` | `98dab700562388df10d0fe917b10058c1bab097d3ac01e34e0e6d98cc45d0d0f` |
| `skills/create-branch-from-staging/SKILL.md` | `1b639104dcbee347e3ff45095d159d28094b98e586d906cc8fa2851a70eb2fed` | `9cf1136a5ee1dd6cc9f12e394c394a0ec910f43bbb75da7512a60e741390fe19` |
| `skills/create-branch/SKILL.md` | `3e526cce52e09ee520829cba453676877f61e49823178d4418aeb8cba4c364e5` | `984851c043bdaa4a5939a180e4d217c5dd05bee2ce467ee806e737c2d26a5125` |
| `skills/create-empty-commit/SKILL.md` | `82d9317ea81b12fd5a03ed315b347046e10f2aad1105c90047b1b75e7792f37d` | `f3f5a67cd271914bc89c0c75ec97de6e0ef5be3ae5bc482302c23ca084205e88` |
| `skills/launch-push/SKILL.md` | `53636ea41c4e845d4049a0aa9f07ac285ad7d76b1094ea21f991ab5df13b730e` | `1d502a780ecc99502404d97377d536daddd079a8506f7ec62b6c9e86c1fdc95b` |
| `skills/pull-changes/SKILL.md` | `50dfb8b8093ddfb1a34d3657094ed48e1458213e673b334b56eb58cec716a487` | `1bfd588c87cc40d1d9d932b8d9b81c057513aef68e73810af70802a44efc96f9` |

## Diff exacto respecto del template: agentes y skills

Diff unificado sin contexto; son las únicas ocho adaptaciones. Los otros seis agentes y ocho skills coinciden byte a byte.

```diff
--- template/agents/git-workflow-agent.md
+++ AsistenciApp/agents/git-workflow-agent.md
@@ -1,0 +2,2 @@
+
+Lee [AGENTS.md](../AGENTS.md), [docs/CONSTITUTION.md](../docs/CONSTITUTION.md) y la [guía local](../docs/GIT-AUTOMATION.md). El SDD local de AsistenciApp prevalece sobre cualquier indicación del template de continuar automáticamente. Las rutas de agents y skills se resuelven dentro de esta aplicación.
--- template/skills/check-status/SKILL.md
+++ AsistenciApp/skills/check-status/SKILL.md
@@ -5 +5 @@
-- **Comando de Terminal**: `./tools/check-status.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/check-status.sh`
--- template/skills/commit-changes/SKILL.md
+++ AsistenciApp/skills/commit-changes/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`
--- template/skills/create-branch-from-staging/SKILL.md
+++ AsistenciApp/skills/create-branch-from-staging/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
--- template/skills/create-branch/SKILL.md
+++ AsistenciApp/skills/create-branch/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-branch.sh "[BASE]" "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/create-branch.sh "[BASE]" "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
--- template/skills/create-empty-commit/SKILL.md
+++ AsistenciApp/skills/create-empty-commit/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-empty-commit.sh "[NUMERO]"`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/create-empty-commit.sh "[NUMERO]"`
--- template/skills/launch-push/SKILL.md
+++ AsistenciApp/skills/launch-push/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/launch-push.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/launch-push.sh`
--- template/skills/pull-changes/SKILL.md
+++ AsistenciApp/skills/pull-changes/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/pull-changes.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/asistenciapp/tools/pull-changes.sh`
```

## Autorización de publicación de la corrección

Commit selectivo y push autorizados en la misma rama y PR #756. Antes del commit se comprobaron por relectura los siete modos Git 100755 y blobs idénticos a la fuente fijada, las ocho adaptaciones permitidas y las 48 rutas del alcance. Se usó un índice temporal con preparación nativa de los modos, sin modificar los scripts originales. Se actualizará la descripción distinguiendo estas pruebas Bash de la evidencia histórica PowerShell; los cinco problemas heredados no se presentan como resueltos. Sin respuestas ni resolución de comentarios, cambios de revisores o merge.

### Índice temporal comprobado antes del commit

| Script | Modo | Blob idéntico a la fuente |
| --- | --- | --- |
| `tools/check-status.sh` | `100755` | `24aa0a0065020c30f87fd72efcc99b23c4e812ab` |
| `tools/commit-changes.sh` | `100755` | `7f0ceccd327f97b449efcc20f8463d2f16aa7f44` |
| `tools/create-branch-from-staging.sh` | `100755` | `7191371511abffa9da3464741723594cd718c466` |
| `tools/create-branch.sh` | `100755` | `3a470d2eca7820c3bfea2d5418cd2fff6e3a3023` |
| `tools/create-empty-commit.sh` | `100755` | `d722f6cea85d6f3dbc6581bf39e5483ce3be8f3e` |
| `tools/launch-push.sh` | `100755` | `b5aeb3bf0c431ddcf269c27d15b315dbcc053426` |
| `tools/pull-changes.sh` | `100755` | `c5c6d09398e2efa97de231f42d99e2a5e4361b80` |
