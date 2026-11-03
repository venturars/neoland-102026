Issue: #759

# Verificación de la integración original

T01–T10 implementados y comprobados localmente. T10 y publicación selectiva autorizados: verificar antes del commit el índice, modos y blobs; después publicar la rama y abrir PR draft contra staging. Sin revisores ni merge.

## Fuente y comparación

Fuente fijada: exercises/git-workflow-agent-template en `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`. Rama `759-chore-restore-original-git-workflow` en el worktree aislado; durante la implementación se conservó HEAD.

Se compararon los 42 archivos: 34 contenidos Git coinciden y hay ocho adaptaciones exactas. Los siete scripts coinciden byte a byte con sus blobs y conservan LF. Se retiraron los ocho archivos PowerShell y los tres ensayos propios. No hay helpers ni ensayos permanentes nuevos.

| Grupo | Contenidos originales | Adaptaciones |
| --- | --- | --- |
| tools | 7 | 0 |
| agents | 6 | 1 |
| skills | 8 | 7 |
| templates | 12 | 0 |
| MCPS | 1 | 0 |

Las doce plantillas se conservaron sin editar: su representación local usa CRLF y su contenido Git, canonizado a LF solo en memoria para la comparación, coincide con los blobs originales. Por eso hay 22 coincidencias byte a byte y otras 12 coincidencias de contenido Git, además de los ocho archivos adaptados. Los hashes de la tabla corresponden al contenido Git comparado; no se presenta el hash local CRLF como igual al original LF.

Los siete modos de origen son 100755. T10 comprobado antes del commit: los siete modos del índice son 100755 y sus blobs coinciden con la fuente fijada.

## Comprobaciones ejecutadas

Windows y Git Bash 5.3.15 disponible, sin instalación de software.

- `bash --noprofile --norc -n <script>` sobre los siete archivos: siete comprobaciones satisfactorias.
- `check-status.sh` desde la raíz del worktree y un repositorio temporal con espacios: salida 0 y rama correcta. Es la única herramienta ejecutada sobre el worktree real y es de lectura.
- Ensayo nuevo de T08: otras 35 comprobaciones satisfactorias de estado y contratos; 42 comprobaciones en total contando sintaxis. Los commits y push se realizaron exclusivamente con usuarios y archivos ficticios en repositorios desechables con remoto bare local.
- La carpeta temporal `759 original gitflow bmhaurz8` conserva los registros `commands.json` y `result.json` para inspección. El arnés se conserva por separado en otra carpeta temporal, fuera de la entrega, y no modifica el código de los scripts.

Contratos comprobados:

1. Avance rápido de staging conservando la rama actual; divergencia rechazada sin alterar staging ni la rama actual.
2. Rama nueva desde origin/staging, recuperación local conservando commits y recuperación remota con upstream.
3. Otra base y un tipo sin plantilla (`maintenance`), sin cambiar el nombre de rama.
4. Apertura vacía con mensaje `chore: open #901`, árbol conservado y sin incluir el índice ajeno.
5. Commit selectivo de `named file.txt`, con espacio en su nombre, conservando lo preparado para otro archivo.
6. Push al bare local con SHA y upstream comprobados; rechazo sin avance rápido conservando el remoto local.
7. Rechazos propios del original: número y descripción inválidos, staging como base alternativa, apertura en staging, archivos omitidos y argumentos indebidos o de fuerza.

Antes de cada herramienta mutante se verificó que el directorio y origin pertenecían a la carpeta desechable y que el remoto era exclusivamente local. El arnés descartó el contexto Git heredado y usó configuración aislada; la confianza de lectura del worktree se limitó al entorno de ese proceso, sin cambiar configuración personal.

## Revisión estática y límites

El diff respecto de la fuente es exclusivamente el párrafo local del orquestador y siete rutas de comandos. La selección de las seis parejas de plantillas y la alternativa más cercana se recorrieron en lectura. Los otros agentes, skills y MCP mantienen el original. No se ejecutaron sus instrucciones de instalación o configuración.

AGENTS conserva su SDD palabra por palabra; únicamente cambia la referencia obsoleta a ensayos. Las guías TREE, ARCHITECTURE y GIT-AUTOMATION reflejan los originales Bash y sus límites. No se adoptaron cinco momentos ni nuevas pausas. No se modificó CONSTITUTIONS.md.

Siguen presentes en la fuente y no se corrigen localmente: directorios borrados que pueden seleccionar descendientes, fallo al sincronizar un borrado ya preparado, carrera al avanzar staging, etiquetas implícitas por push.followTags y orden de revisores/salida de draft. Las comprobaciones satisfactorias no acreditan que esos problemas estén resueltos ni controles que el original no contiene.

No se ejecutó el flujo integral de agentes con GitHub ni se realizaron escrituras remotas. No se repitieron pruebas funcionales o históricas ni se reutilizaron resultados PowerShell como prueba de Bash. No cambió JavaScript ni se ejecutaron comandos de formato o lint sobre la aplicación intacta.

## Conservación y revisión local

Diff final: 49 rutas de first-app (27 modificadas, 11 retiradas y 11 nuevas, incluidos los cuatro documentos de esta spec). `git diff --check` termina con código 0; espacios y referencias locales añadidas correctos. El índice está vacío.

Se conservaron los hashes de los 3.373 archivos protegidos del worktree y los 3.453 del checkout principal, incluidas ambas bases SQLite, AsistenciApp, lógica, clientes, dependencias, documentos históricos y evidencias anteriores. No se abrieron bases reales. ChromaDB mantiene sus 27.292 entradas, tamaños y fechas; el inventario no equivale a un hash de su contenido.

Durante la implementación se conservaron HEAD y las demás referencias. La publicación autorizada avanza únicamente la rama de esta entrega; staging, la entrega independiente y la rama pausada se conservan. #757 conserva `ba7b36490b3018c51353b6579383064df51aabff`; AsistenciApp conserva `9645cfcc4096c91d49220fa3bd0cdafb0330e325`. No se escribieron archivos en el checkout principal.

Las comprobaciones finales incluyen diff, espacios de archivos nuevos y existentes, enlaces locales de las referencias añadidas y alcance. Los procesos de ensayo terminaron y las carpetas temporales se conservan para inspección.

Publicación selectiva y T10 autorizados. Se comprobarán modos y contenido del índice antes del commit y se verificarán cuerpo, Development y SHA remoto por relectura. Sin revisores ni merge.

## Hashes de los 42 archivos

SHA-256 del contenido original y del contenido Git de la copia. Para las doce plantillas se normaliza CRLF a LF solo en memoria; los demás hashes se calculan sobre los bytes del archivo. Los blobs originales también se comprobaron contra el commit fijado.

| Archivo | SHA-256 fuente | SHA-256 copia | Coincide |
| --- | --- | --- | --- |
| `MCPS/github-mcp-server/mcp.txt` | `1d35dd2b945863e2c9ac08c24850769f55bdd5df35d43b06384e2747af0dfffd` | `1d35dd2b945863e2c9ac08c24850769f55bdd5df35d43b06384e2747af0dfffd` | Sí |
| `agents/create-branch.md` | `b7c0d056483fabf19e02a5f1f659dac2b3791fe28c124886f09a3eb09a10be65` | `b7c0d056483fabf19e02a5f1f659dac2b3791fe28c124886f09a3eb09a10be65` | Sí |
| `agents/create-commit.md` | `43585e9db9f929088e9bdd5cad3010980515d8e84999598987bf9f51126ae2f1` | `43585e9db9f929088e9bdd5cad3010980515d8e84999598987bf9f51126ae2f1` | Sí |
| `agents/create-issue.md` | `8ceddc02f1f323b84a08ba004c490eb52eab3571343661d92b87263e42e79e48` | `8ceddc02f1f323b84a08ba004c490eb52eab3571343661d92b87263e42e79e48` | Sí |
| `agents/create-pr.md` | `a80ce883c4696364eb3eceb6d8a6589696f748f44ba0b454da0b02587bb2659c` | `a80ce883c4696364eb3eceb6d8a6589696f748f44ba0b454da0b02587bb2659c` | Sí |
| `agents/git-workflow-agent.md` | `5074a3f89c4e8a32de27a2ef29874262190b1e872f4fa89fcf129e8af5a7d060` | `73a4a104599f9b6f0a990a264df841a0960ed295e3100d251608b6be09a7933e` | Adaptación |
| `agents/help-me-to-think.md` | `f5d562ed04c7d1ad4f56b3dec47abc123f7f813a106a7e8f756376430e5e8322` | `f5d562ed04c7d1ad4f56b3dec47abc123f7f813a106a7e8f756376430e5e8322` | Sí |
| `agents/launch-push.md` | `4262dacbc3f9e4ccacf94b74526ab4cc92ce7ee0e8efa4069beb4d0a24118d66` | `4262dacbc3f9e4ccacf94b74526ab4cc92ce7ee0e8efa4069beb4d0a24118d66` | Sí |
| `skills/assign-author/SKILL.md` | `52f45de66d3b6c5fc6a7465721c77e1f55f984e0804953b2e94cab97efc778db` | `52f45de66d3b6c5fc6a7465721c77e1f55f984e0804953b2e94cab97efc778db` | Sí |
| `skills/assign-reviewers/SKILL.md` | `f09834491ac276a18b502da65e32c982b8cd737692f959460dd71904c2897eed` | `f09834491ac276a18b502da65e32c982b8cd737692f959460dd71904c2897eed` | Sí |
| `skills/check-status/SKILL.md` | `cffc58ea09e56089e11635ede3ec471e9360bb31f8be379bcf3a364f7d6cb19b` | `4400f2da5e55363b0fe04d8f4a17df7baeeeb7c606ef98b85334abe531643a1f` | Adaptación |
| `skills/commit-changes/SKILL.md` | `8878137c88a4c4952fa98effb5f39b7c05dfa25750975e1dfb0b3eb21f3d3e47` | `8200e0c1c7f89e4de25d28a19475ef33714716fd9fb0ed3a882af8a62bd7bf62` | Adaptación |
| `skills/create-branch-from-staging/SKILL.md` | `1b639104dcbee347e3ff45095d159d28094b98e586d906cc8fa2851a70eb2fed` | `e629c1ec4a3015b161ee77c6390b05d818fdf9f7a0b323b139c66bd291d4041b` | Adaptación |
| `skills/create-branch/SKILL.md` | `3e526cce52e09ee520829cba453676877f61e49823178d4418aeb8cba4c364e5` | `5be67bb9cdbd668693d041173ce8e9dba1ad0470f860dd759ee320011d85b75b` | Adaptación |
| `skills/create-draft/SKILL.md` | `d7ac36c107b4c23d811e196b113b23108d6df8f6357d2e78a4c8bda24f905bb8` | `d7ac36c107b4c23d811e196b113b23108d6df8f6357d2e78a4c8bda24f905bb8` | Sí |
| `skills/create-empty-commit/SKILL.md` | `82d9317ea81b12fd5a03ed315b347046e10f2aad1105c90047b1b75e7792f37d` | `82eb75f96e0d2b5b20ff8b09f8574be59453ba5768b14669603ee379e604c62c` | Adaptación |
| `skills/create-issue/SKILL.md` | `7642907ce21eca0beedee1722296ce721a005e28cbee914d2299632fcfbdc629` | `7642907ce21eca0beedee1722296ce721a005e28cbee914d2299632fcfbdc629` | Sí |
| `skills/create-pr-base-staging/SKILL.md` | `0adba118cb868dde02584d65f7749808d478d3fccdbee8d44ed5b31bb3b3ae3b` | `0adba118cb868dde02584d65f7749808d478d3fccdbee8d44ed5b31bb3b3ae3b` | Sí |
| `skills/grill-me/SKILL.md` | `7b9ffcfaa1c21544cb728c610a10bbc38a91f574ac7fc8d9c0fc904bedde7376` | `7b9ffcfaa1c21544cb728c610a10bbc38a91f574ac7fc8d9c0fc904bedde7376` | Sí |
| `skills/grill-with-docs/SKILL.md` | `0e23efaeb4ec0cc0ddc4b990a937846dafcbe1f9d6342d56a4c05f03fcabc0cc` | `0e23efaeb4ec0cc0ddc4b990a937846dafcbe1f9d6342d56a4c05f03fcabc0cc` | Sí |
| `skills/launch-push/SKILL.md` | `53636ea41c4e845d4049a0aa9f07ac285ad7d76b1094ea21f991ab5df13b730e` | `4aff4457cc154185ef13cef7fd24438bc17604c2f54a724a95cda0599709b784` | Adaptación |
| `skills/link-pr-to-issue/SKILL.md` | `93a06c0a096bf30b2b2b032874e2e738dea611815bb660605993ccaa900470fc` | `93a06c0a096bf30b2b2b032874e2e738dea611815bb660605993ccaa900470fc` | Sí |
| `skills/pull-changes/SKILL.md` | `50dfb8b8093ddfb1a34d3657094ed48e1458213e673b334b56eb58cec716a487` | `53f3a33ab80672c7cf6b352e2a082bf3339078e4619f95fb9475ca3561088b44` | Adaptación |
| `templates/issues/chore_issue.md` | `42902fbd091bd2a3da5e18fba2283c750ae831ad699a58f6f81447c17e9b3592` | `42902fbd091bd2a3da5e18fba2283c750ae831ad699a58f6f81447c17e9b3592` | Sí |
| `templates/issues/docs_issue.md` | `916e0089b4c38e4fd7fa5b9e11ab6c4c0cfefd0b1bd9539d51fdd14109181e0f` | `916e0089b4c38e4fd7fa5b9e11ab6c4c0cfefd0b1bd9539d51fdd14109181e0f` | Sí |
| `templates/issues/feat_issue.md` | `9733cadfddfe7a193b560b8192a343a0bb689873aef54243192b66c4ab14e129` | `9733cadfddfe7a193b560b8192a343a0bb689873aef54243192b66c4ab14e129` | Sí |
| `templates/issues/fix_issue.md` | `061060e0552c0410cdb0973b905026399c7e386522e059e0848c9188b882ca02` | `061060e0552c0410cdb0973b905026399c7e386522e059e0848c9188b882ca02` | Sí |
| `templates/issues/refactor_issue.md` | `84a9ea124d4254f1d3e3d37554d7441855bd7db2654c43a52bbe2910d6d34332` | `84a9ea124d4254f1d3e3d37554d7441855bd7db2654c43a52bbe2910d6d34332` | Sí |
| `templates/issues/test_issue.md` | `65f6c352588e2728a0e430227f653da85e1ac85799a448573cf4d4c85df09b8a` | `65f6c352588e2728a0e430227f653da85e1ac85799a448573cf4d4c85df09b8a` | Sí |
| `templates/pull-request/chore-pull-request.md` | `dd5a2cbbcccecdbef470dda5cfbc30168368723e51864addd9191734363887c3` | `dd5a2cbbcccecdbef470dda5cfbc30168368723e51864addd9191734363887c3` | Sí |
| `templates/pull-request/docs-pull-request.md` | `86ef508a593fbf8d672f27cacd701ba9c0dddd5fa8df96f1aab02c3d6102e90d` | `86ef508a593fbf8d672f27cacd701ba9c0dddd5fa8df96f1aab02c3d6102e90d` | Sí |
| `templates/pull-request/feat-pull-request.md` | `ec974ebfe8afb76f844322820569a990f2cad75d2571ef75867c1cc1722a37a9` | `ec974ebfe8afb76f844322820569a990f2cad75d2571ef75867c1cc1722a37a9` | Sí |
| `templates/pull-request/fix-pull-request.md` | `38e86dcfe3e054e6687aa391eebbb729f0afa4691ab8e462fb782bee5588440c` | `38e86dcfe3e054e6687aa391eebbb729f0afa4691ab8e462fb782bee5588440c` | Sí |
| `templates/pull-request/refactor-pull-request.md` | `35ed529ea97cbaf73b599ffcfab16199a29921f99914a75249960adc61425a4c` | `35ed529ea97cbaf73b599ffcfab16199a29921f99914a75249960adc61425a4c` | Sí |
| `templates/pull-request/test-pull-request.md` | `84822e45e59d08a66db665724ac9522ade623bc6c3b0a90f449f746a71a9260c` | `84822e45e59d08a66db665724ac9522ade623bc6c3b0a90f449f746a71a9260c` | Sí |
| `tools/check-status.sh` | `e41ce438c1966b272786643b332aefa2971b66d6b48fbf2f9dd588cc473a7a8b` | `e41ce438c1966b272786643b332aefa2971b66d6b48fbf2f9dd588cc473a7a8b` | Sí |
| `tools/commit-changes.sh` | `edc11a741b10b3e707175550bc0e433ca3e85c07dbaa606ba4b4fd91c3a6be33` | `edc11a741b10b3e707175550bc0e433ca3e85c07dbaa606ba4b4fd91c3a6be33` | Sí |
| `tools/create-branch-from-staging.sh` | `a2dbad01adbec9011cf749bee996077a68a66c5f06e2ad4bf4afd04106eb3da6` | `a2dbad01adbec9011cf749bee996077a68a66c5f06e2ad4bf4afd04106eb3da6` | Sí |
| `tools/create-branch.sh` | `cbf05f7cb63f32416f7e827afdbc281c327dbfa9131e42b3a60a375cf26dbf78` | `cbf05f7cb63f32416f7e827afdbc281c327dbfa9131e42b3a60a375cf26dbf78` | Sí |
| `tools/create-empty-commit.sh` | `268632341863a6b954a1af1bf91b405d52ab08d7b8241f7f93039a9a7f47d4a9` | `268632341863a6b954a1af1bf91b405d52ab08d7b8241f7f93039a9a7f47d4a9` | Sí |
| `tools/launch-push.sh` | `b0926ff8fe7ceb72f528237d8fa8e6f09562666573515e71edcee717d26d9c3e` | `b0926ff8fe7ceb72f528237d8fa8e6f09562666573515e71edcee717d26d9c3e` | Sí |
| `tools/pull-changes.sh` | `54edd880a04821ed726f5b9fbaace0b2eff5cd0b3e56d4dbffd14ef9f4503cdd` | `54edd880a04821ed726f5b9fbaace0b2eff5cd0b3e56d4dbffd14ef9f4503cdd` | Sí |

## Diff exacto de las ocho adaptaciones

Diff unificado sin contexto, frente a la fuente fijada:

```diff
--- template/agents/git-workflow-agent.md
+++ first-app/agents/git-workflow-agent.md
@@ -1,0 +2,2 @@
+
+Lee [AGENTS.md](../AGENTS.md), [CONSTITUTIONS.md](../docs/CONSTITUTIONS.md) y la [guía local](../docs/GIT-AUTOMATION.md). El SDD local de first-app prevalece sobre cualquier indicación del template de continuar automáticamente. Las rutas de agents y skills se resuelven dentro de first-app.
--- template/skills/check-status/SKILL.md
+++ first-app/skills/check-status/SKILL.md
@@ -5 +5 @@
-- **Comando de Terminal**: `./tools/check-status.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/check-status.sh`
--- template/skills/commit-changes/SKILL.md
+++ first-app/skills/commit-changes/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`
--- template/skills/create-branch-from-staging/SKILL.md
+++ first-app/skills/create-branch-from-staging/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
--- template/skills/create-branch/SKILL.md
+++ first-app/skills/create-branch/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-branch.sh "[BASE]" "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/create-branch.sh "[BASE]" "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`
--- template/skills/create-empty-commit/SKILL.md
+++ first-app/skills/create-empty-commit/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/create-empty-commit.sh "[NUMERO]"`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/create-empty-commit.sh "[NUMERO]"`
--- template/skills/launch-push/SKILL.md
+++ first-app/skills/launch-push/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/launch-push.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/launch-push.sh`
--- template/skills/pull-changes/SKILL.md
+++ first-app/skills/pull-changes/SKILL.md
@@ -4 +4 @@
-- **Comando de Terminal**: `./tools/pull-changes.sh`
+- **Comando de Terminal**: `./staff/jimena-duran/first-app/tools/pull-changes.sh`
```

## Preparación selectiva autorizada (T10)

Índice temporal releído antes del commit: solo los 49 archivos de esta entrega; 42 archivos de automatización contrastados, 34 originales y ocho adaptaciones exactas. Los siete scripts conservan LF, modo 100755 y los blobs originales siguientes. No se han repetido ensayos satisfactorios. Publicación autorizada; pendiente de registrar push y PR draft y de revisión humana.

| Script | Blob |
| --- | --- |
| tools/check-status.sh | 24aa0a0065020c30f87fd72efcc99b23c4e812ab |
| tools/commit-changes.sh | 7f0ceccd327f97b449efcc20f8463d2f16aa7f44 |
| tools/create-branch-from-staging.sh | 7191371511abffa9da3464741723594cd718c466 |
| tools/create-branch.sh | 3a470d2eca7820c3bfea2d5418cd2fff6e3a3023 |
| tools/create-empty-commit.sh | d722f6cea85d6f3dbc6581bf39e5483ce3be8f3e |
| tools/launch-push.sh | b5aeb3bf0c431ddcf269c27d15b315dbcc053426 |
| tools/pull-changes.sh | c5c6d09398e2efa97de231f42d99e2a5e4361b80 |
