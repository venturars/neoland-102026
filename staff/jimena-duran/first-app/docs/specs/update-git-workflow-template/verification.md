Issue: #741

# Verificación de la actualización

T01–T12 completadas en `741-chore-update-git-workflow-template`. Commit selectivo, push y PR draft contra staging autorizados; publicación pendiente. Sin revisores, merge ni mutaciones remotas de prueba. Fuente fijada en `ddbf024a`.

## Resultados

- Las doce plantillas coinciden byte a byte con sus blobs de la fuente: `git hash-object --no-filters` frente a `git rev-parse` de cada archivo fijado. Hay exactamente seis de issue y seis de PR.
- La búsqueda con `rg` no encuentra referencias a las plantillas genéricas en AGENTS, agentes, skills o guías operativas. Los dos archivos genéricos están retirados; los documentos anteriores se conservan.
- Las seis parejas contienen sus secciones esperadas. Cada PR tiene dos casillas sin marcar y un único marcador `Closes #`; la retirada local de esa línea deja Issue vacía.
- `Get-TaskBranchName`: 21 casos pasados. Genera nombres para los seis tipos con plantilla y para `maintenance`, que no tiene plantilla; devuelve `741-maintenance-check-template-fallback` y respeta `741-custom-name` cuando se pasa explícitamente.
- Rechaza números 0, negativos y no numéricos, descripción vacía o con mayúsculas, referencias con espacios, doble punto o sufijo `.lock`, nombre con prefijo de opción y nombres protegidos main, staging y HEAD.
- El parser de PowerShell acepta los 11 archivos `.ps1` de tools. La comparación del código ejecutable con la base `ddbf024a` confirma que solo se eliminaron las tres líneas de la lista fija de tipos; no se añadieron comprobaciones de plantillas ni se alteraron otras protecciones.
- Prettier local: formato aplicado a los Markdown afectados y comprobación final. ESLint local sobre first-app: salida 0. Se usaron los binarios ya instalados, sin instalar paquetes; `pnpm` no está en PATH. No se formateó código de aplicación ajeno al cambio.
- `git diff --check` y la comprobación `--no-index --check` frente a NUL para los archivos nuevos no detectan errores de espacios.

## Recorrido en lectura

| Tipo solicitado                                 | Plantilla de issue             | Plantilla de PR                       |
| ----------------------------------------------- | ------------------------------ | ------------------------------------- |
| feat                                            | feat_issue.md                  | feat-pull-request.md                  |
| fix                                             | fix_issue.md                   | fix-pull-request.md                   |
| docs                                            | docs_issue.md                  | docs-pull-request.md                  |
| refactor                                        | refactor_issue.md              | refactor-pull-request.md              |
| test                                            | test_issue.md                  | test-pull-request.md                  |
| chore                                           | chore_issue.md                 | chore-pull-request.md                 |
| maintenance, mantenimiento sin plantilla propia | chore_issue.md, la más cercana | chore-pull-request.md, la más cercana |

La lectura de los tres agentes y sus skills confirma la selección y alternativa. La elección de plantilla no introduce una regla de renombrado del tipo o la rama. La PR conserva el título de la issue; los comentarios de la plantilla determinan el resumen del draft, comprobaciones y casillas. La regla independiente de commits convencionales permanece intacta.

Create-pr retira el marcador antes del alta; el orquestador añade después una sola referencia real, preservando el cuerpo y verificando Development por separado. Se conservan la base staging, las condiciones de cierre, la delegación real, ambas pausas SDD y las autorizaciones por operación. Este recorrido es una revisión estática: no acredita una escritura remota ni la creación real de vínculos en GitHub.

## Conservación y límites

Al terminar las comprobaciones de implementación, HEAD seguía en `ddbf024a` y el índice estaba sin cambios preparados. El diff se limita a la automatización y documentos de esta actualización. SQLite conserva su SHA256; ChromaDB sigue sin seguimiento y su inventario de 27.292 archivos mantiene nombres, tamaños y fechas de modificación. Ese inventario no equivale a un hash del contenido de ChromaDB.

La primera invocación de la función quedó bloqueada por ExecutionPolicy; la comprobación pasó en un proceso PowerShell con `-NoProfile -ExecutionPolicy Bypass`, sin cambiar la política global. El primer control de formato señaló documentos pendientes y se corrigieron. No quedan fallos pendientes de estas comprobaciones.

No se ejecutaron suites históricas, ejemplos de usuarios, operaciones sobre datos locales ni pruebas remotas. Los resultados anteriores no acreditan una publicación. La autorización posterior permite publicar esta entrega real y releer la PR y Development, manteniendo separadas esas operaciones de las pruebas y de la revisión estática. No se repetirán comprobaciones satisfactorias salvo cambios que lo justifiquen.
