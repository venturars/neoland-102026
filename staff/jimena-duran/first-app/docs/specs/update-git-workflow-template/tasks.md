Issue: #741

# Tareas de actualización de la automatización

Spec, plan y T01–T12 aprobados; implementación y comprobaciones autorizadas y completadas. Resultados en [verification.md](verification.md).
Rama: `741-chore-update-git-workflow-template`. Rutas relativas a first-app.
Commit selectivo, push y PR draft contra staging autorizados; publicación pendiente. Sin revisores, merge ni mutaciones remotas de prueba.

- [x] T01. Contrastar el alcance con el template en `ddbf024a` y localizar referencias operativas a las dos plantillas genéricas.
      Resultado: inventario limitado a los archivos previstos en el plan, sin modificar specs anteriores ni evidencias históricas.
- [x] T02. Incorporar las seis plantillas de issue y las seis de PR desde la fuente fijada.
      Resultado: doce archivos para feat, fix, docs, refactor, test y chore, con el contenido y comentarios del template.
- [x] T03. Ajustar los agentes create-issue, create-pr y create-branch y sus skills indicadas en el plan.
      Resultado: seleccionan la plantilla del tipo o la más cercana, sin reglas nuevas de renombrado del tipo o la rama; las reglas editoriales remiten a las plantillas.
- [x] T04. Ajustar la referencia de plantilla en link-pr-to-issue y el tratamiento del marcador `Closes #` al preparar el draft.
      Resultado: create-pr deja Issue vacía y el orquestador añade una única referencia real, conservando cuerpo y Development.
- [x] T05. Eliminar la lista fija de tipos en `Get-TaskBranchName` de `tools/git-common.ps1`.
      Resultado: no se exige una plantilla existente; se conservan las validaciones de número, descripción, referencia Git, ramas protegidas y nombre explícito autorizado.
- [x] T06. Actualizar solo las referencias necesarias de `AGENTS.md`, `docs/GIT-AUTOMATION.md`, `docs/TREE.md` y `docs/ARCHITECTURE.md`.
      Resultado: describen las plantillas por tipo y su selección, conservando SDD, MCP con alternativa gh y la regla independiente de commits convencionales.
- [x] T07. Retirar las dos plantillas genéricas después de sustituir sus referencias operativas.
      Resultado: no existen `basic_issue.md` ni `basic-pull-request.md` en templates ni referencias a ellas en agentes, skills o guías operativas.
- [x] T08. Comparar las doce plantillas con la fuente y recorrer en lectura su selección para los seis tipos y para un tipo sin plantilla.
      Resultado: cada caso usa la plantilla correspondiente o la más cercana; se conservan secciones, título de issue y casillas sin marcar del draft.
- [x] T09. Comprobar localmente `Get-TaskBranchName` con un tipo sin plantilla, por ejemplo `maintenance`, y con un nombre explícito autorizado.
      Resultado: genera `741-maintenance-check-template-fallback` y respeta el nombre explícito, sin exigir plantillas ni crear ramas, commits o publicaciones.
- [x] T10. Comprobar en la misma función número y descripción inválidos, referencias Git inválidas y nombres protegidos `main`, `staging` y `HEAD`.
      Resultado: rechaza esas entradas; la revisión del diff confirma intactas las demás protecciones de Git, sin repetir suites históricas.
- [x] T11. Recorrer en lectura la retirada del marcador, el enlace posterior y las pausas humanas del flujo.
      Resultado: no quedan marcadores publicados ni referencias duplicadas; se conservan Development, condiciones de cierre, agentes reales y autorizaciones por operación.
- [x] T12. Analizar sintaxis PowerShell, revisar formato de archivos afectados, lint aplicable y `git diff --check`, incluidos los archivos nuevos.
      Resultado: comprobaciones y límites registrados para esta actualización; diff limitado al alcance, sin cambios en SQLite, ChromaDB, lógica, clientes o trabajos independientes.

Implementación completada. Publicación selectiva autorizada; conservar datos y cambios ajenos. El resultado permanecerá en draft para revisión, sin revisores ni merge.
