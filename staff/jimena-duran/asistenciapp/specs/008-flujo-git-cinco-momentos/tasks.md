Issue: #751

# Tareas de automatización y SDD

Spec, plan y T01–T55 aprobados. Implementación y enmienda 3.1 autorizadas y completadas; resultado pendiente de revisión en [verification.md](verification.md).

Rama: `751-chore-asistenciapp-git-five-stages`. Fuente fijada en `50094711`. Todas las rutas son relativas a AsistenciApp.

## Autorizaciones y conservación

Se autorizó crear commits y hacer push exclusivamente en repositorios temporales desechables con remoto local para probar esta automatización. Los ensayos se realizaron dentro de ese alcance.

La aplicación de la enmienda 3.1 se autorizó expresamente y está completada. También están autorizados el commit selectivo, push de la rama existente y PR draft contra staging; publicación pendiente. Sin revisores ni merge. Datos, pruebas funcionales, specs anteriores y trabajos ajenos se conservan; no se eliminaron ni saltaron comprobaciones para hacerlas pasar.

## Preparación de pruebas y herramientas

- [x] T01. Capturar estado y hashes del alcance protegido antes de implementar; resultado: referencia para comprobar que datos, aplicación, pruebas funcionales y specs anteriores no cambian. (CA-10)
- [x] T02. Ajustar solo las verificaciones de puertas y versión en `tests/test_sdd_rules.py`; resultado: cubren cinco momentos e invariantes conservadas, sin reducir cobertura ni modificar sus pruebas de ámbito e integridad. (CA-01–CA-05, CA-08–CA-09)
- [x] T03. Preparar `tools/tests/test-git-automation.ps1` con fixtures desechables y remoto local; resultado: rechaza destinos fuera de su carpeta temporal, el repositorio real y remotos de red antes de mutar. (CA-07, CA-10)
- [x] T04. Crear `tools/git-common.ps1`; resultado: controles compartidos de comandos nativos, referencias, rama autorizada, operaciones pendientes, índice, hooks y rutas, sin lista fija de tipos ni exigencia de plantillas. (CA-07)
- [x] T05. Crear `tools/check-status.ps1`; resultado: informa rama, remoto, índice y cambios sin mutarlos y distingue bloqueos de archivos sin seguimiento. (CA-07)
- [x] T06. Crear `tools/pull-changes.ps1`; resultado: adelanta staging solo por avance rápido, preserva la rama actual y se detiene ante divergencia, colisión u otro worktree. (CA-02, CA-07)
- [x] T07. Crear `tools/create-branch-from-staging.ps1`; resultado: crea o recupera la rama de staging actualizado sin sobrescribir trabajo local ni ramas existentes. (CA-02, CA-07)
- [x] T08. Crear `tools/create-branch.ps1`; resultado: usa únicamente otra base explícita autorizada, con validación de referencia y conservación de ramas existentes. (CA-07)
- [x] T09. Crear `tools/create-empty-commit.ps1`; resultado: commit de apertura solo en rama autorizada, sin incluir contenido del índice ajeno y con bloqueo ante hooks activos. (CA-02, CA-07)
- [x] T10. Crear `tools/commit-changes.ps1`; resultado: incluye solo archivos nombrados mediante índice temporal, rechaza ampliaciones de alcance y conserva el índice ajeno. (CA-05, CA-07)
- [x] T11. Crear `tools/launch-push.ps1`; resultado: publica únicamente la rama autorizada, bloquea main/staging y no admite fuerza ni oculta fallos. (CA-05, CA-07)

## Agentes

- [x] T12. Crear `agents/git-workflow-agent.md`; resultado: coordina cinco momentos separados, agentes reales y pausas, sin transformar autorizaciones limitadas en permisos generales. (CA-01–CA-05)
- [x] T13. Crear `agents/help-me-to-think.md`; resultado: concreta la tarea dentro del primer momento y devuelve preguntas al orquestador, sin avanzar de fase. (CA-01)
- [x] T14. Crear `agents/create-issue.md`; resultado: registra o reutiliza la tarea con plantilla del tipo o la más cercana, sin abrir rama ni publicar cambios de código. (CA-01, CA-06)
- [x] T15. Crear `agents/create-branch.md`; resultado: delega en la herramienta de la base autorizada y devuelve la rama real, sin reemplazarla ni resolver bloqueos automáticamente. (CA-02, CA-07)
- [x] T16. Crear `agents/create-commit.md`; resultado: ejecuta solo el commit explícitamente autorizado y los archivos indicados, sin push ni PR. (CA-02, CA-05, CA-07)
- [x] T17. Crear `agents/launch-push.md`; resultado: publica solo con autorización y devuelve SHA y upstream comprobados, sin commit, PR ni merge. (CA-02, CA-05, CA-07)
- [x] T18. Crear `agents/create-pr.md`; resultado: usa plantilla, título de issue, base staging, draft y casillas sin marcar; deja Issue vacía para el enlace posterior del orquestador. (CA-02, CA-06)

## Skills

- [x] T19. Crear `skills/assign-author/SKILL.md`; resultado: asigna la cuenta autenticada y comprobada preservando datos ajenos. (CA-02, CA-07)
- [x] T20. Crear `skills/assign-reviewers/SKILL.md`; resultado: valida solo las personas indicadas y cambia el draft únicamente al pedir revisión con autorización. (CA-05)
- [x] T21. Crear `skills/check-status/SKILL.md`; resultado: lectura explícita del estado antes de actuar, sin fetch ni mutaciones. (CA-07)
- [x] T22. Crear `skills/commit-changes/SKILL.md`; resultado: invocación PowerShell con array real de archivos y rama esperada, sin ampliar el permiso. (CA-05, CA-07)
- [x] T23. Crear `skills/create-branch/SKILL.md`; resultado: invoca la herramienta de otra base autorizada con argumentos separados. (CA-07)
- [x] T24. Crear `skills/create-branch-from-staging/SKILL.md`; resultado: exige actualización segura completada y conserva la rama existente. (CA-02, CA-07)
- [x] T25. Crear `skills/create-draft/SKILL.md`; resultado: comprueba o conserva el draft autorizado sin iniciar revisión ni crear otra PR. (CA-02, CA-05)
- [x] T26. Crear `skills/create-empty-commit/SKILL.md`; resultado: limita el commit de apertura al momento autorizado y evita duplicarlo. (CA-02, CA-07)
- [x] T27. Crear `skills/create-issue/SKILL.md`; resultado: selecciona plantilla o alternativa, comprueba identidad y duplicados y relee ante una respuesta incierta. (CA-01, CA-06–CA-07)
- [x] T28. Crear `skills/create-pr-base-staging/SKILL.md`; resultado: draft contra staging con plantilla o alternativa, sin marcador de cierre pendiente ni duplicación de PR. (CA-02, CA-06–CA-07)
- [x] T29. Crear `skills/grill-me/SKILL.md`; resultado: entrevista concreta sin inventar requisitos ni adelantar operaciones. (CA-01)
- [x] T30. Crear `skills/grill-with-docs/SKILL.md`; resultado: consulta las reglas vigentes y la spec aplicable antes de proponer cambios. (CA-03–CA-04, CA-08)
- [x] T31. Crear `skills/launch-push/SKILL.md`; resultado: invocación PowerShell con rama esperada, autorización y comprobación del remoto. (CA-05, CA-07)
- [x] T32. Crear `skills/link-pr-to-issue/SKILL.md`; resultado: una referencia real de cierre y verificación independiente de Development, conservando vínculos y sin mutaciones no soportadas. (CA-02, CA-07)
- [x] T33. Crear `skills/pull-changes/SKILL.md`; resultado: actualización por avance rápido sin autorizar commit, push ni integración forzada. (CA-02, CA-07)

## Plantillas y conexión

- [x] T34. Incorporar `templates/issues/feat_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T35. Incorporar `templates/issues/fix_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T36. Incorporar `templates/issues/docs_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T37. Incorporar `templates/issues/refactor_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T38. Incorporar `templates/issues/test_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T39. Incorporar `templates/issues/chore_issue.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T40. Incorporar `templates/pull-request/feat-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T41. Incorporar `templates/pull-request/fix-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T42. Incorporar `templates/pull-request/docs-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T43. Incorporar `templates/pull-request/refactor-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T44. Incorporar `templates/pull-request/test-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T45. Incorporar `templates/pull-request/chore-pull-request.md`; resultado: idéntica a la fuente fijada. (CA-06)
- [x] T46. Crear `MCPS/github-mcp-server/mcp.txt`; resultado: referencia de capacidades y MCP con alternativa gh, sin tokens, cambios de configuración ni promesas de operaciones no comprobadas. (CA-07)

## Enmienda y documentación

- [x] T47. Solo con autorización expresa de aplicarla, modificar `docs/CONSTITUTION.md` según la enmienda propuesta 3.1; resultado: cinco momentos coherentes y P1–P6, seguridad y entradas anteriores intactos. (CA-08)
- [x] T48. Actualizar `AGENTS.md` de acuerdo con la enmienda autorizada; resultado: cinco momentos, lectura de reglas, tabla de estado y límites de publicación coherentes, sin perder reglas del producto o de código. (CA-01–CA-05, CA-08)
- [x] T49. Actualizar `docs/ARCHITECTURE.md`; resultado: árbol y responsabilidades de las carpetas nuevas, separadas de la aplicación existente. (CA-08, CA-10)
- [x] T50. Crear `docs/GIT-AUTOMATION.md`; resultado: guía breve de PowerShell, autorizaciones, conservación de datos y MCP con alternativa gh, sin modificar el README funcional. (CA-07–CA-08)

## Verificación y cierre local

- [x] T51. Ejecutar con el entorno existente las pruebas de puertas SDD y versión constitucional ajustadas; resultado: casos afectados en verde sin modificar ni repetir pruebas funcionales o históricas ajenas. (CA-01–CA-05, CA-08–CA-09)
- [x] T52. Analizar sintaxis de los `.ps1` y comprobar estado desde raíz, aplicación y una ruta con espacios; resultado: invocaciones compatibles sin abrir datos reales. (CA-07)
- [x] T53. Ejecutar `tools/tests/test-git-automation.ps1` exclusivamente en sus repositorios desechables con remoto local; resultado: pasan los casos detallados abajo, conservando datos e índice y sin tocar GitHub ni el repositorio de trabajo. (CA-07, CA-10)
- [x] T54. Contrastar las doce plantillas y recorrer agentes/skills en lectura para seis tipos y uno sin plantilla; resultado: selección y alternativa, pausas, casillas y enlace coherentes, sin referencias genéricas ni reglas editoriales duplicadas. (CA-01–CA-06, CA-08)
- [x] T55. Registrar resultados, límites y revisión final en `specs/008-flujo-git-cinco-momentos/verification.md`; resultado: evidencia propia, formato y espacios correctos, diff acotado y hashes protegidos conservados. (CA-09–CA-10)

### Casos obligatorios del ensayo T53

- Aislamiento: antes de mutar, comprobar las rutas absolutas del ensayo, que el remoto es exclusivamente local y que ningún destino coincide con el repositorio real o sus datos. Usar archivos ficticios y hooks inocuos; conservar los repositorios para inspección, sin limpieza recursiva automática.
- Ramas: nueva, existente local y remota, base distinta autorizada, tipo sin plantilla, nombre explícito e inputs inválidos; conservar commits existentes, rechazar referencias inseguras y ramas protegidas.
- Actualización: avance rápido con conservación de la rama actual; rechazar divergencia, operaciones pendientes y staging en otro worktree. Comprobar archivos sin seguimiento no colisionantes y bloqueo ante colisiones de archivos ignorados o sin seguimiento, conservando su contenido.
- Commits: apertura vacía y selectivo con rutas que incluyen espacios; verificar contenido del commit y conservación del índice ajeno. Rechazar directorios, comodines, opciones, rutas fuera del repositorio, rama inesperada y hooks activos, sin ejecutarlos ni desactivarlos.
- Publicación local: push y upstream correctos contra el remoto desechable; rechazo de rama inesperada, main/staging y publicación sin avance rápido, sin forzar ni reescribir historial. Comprobar códigos de salida y detención ante errores nativos.

Los ensayos se ejecutaron tras autorizar la implementación, incluidos sus commits y push locales. La relectura de cuerpos y Development y el recorrido de momentos se verifican en lectura; no se presentan como escrituras remotas ejecutadas.

Publicación selectiva autorizada y pendiente. Tras realizarla, releer cuerpo y Development y mantener la PR en draft para revisión, sin revisores ni merge.
