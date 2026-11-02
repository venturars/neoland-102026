Issue: #759

# Plan para incorporar el flujo original

Estado: spec y plan aprobados conjuntamente. T01–T10 aprobados; T01–T10 implementados y comprobados; resultados en [verification.md](verification.md), con T08 limitado a ensayos desechables con remoto local. T10 y publicación selectiva autorizados; sin revisores ni merge. Rutas relativas a first-app salvo la fuente y comandos indicados.

## Referencia y base

- Fuente: `exercises/git-workflow-agent-template` en `origin/staging`, commit `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`. Último cambio del template: `25208d23157626954906ffe7da32757c58d9a66e`.
- Rama independiente: `759-chore-restore-original-git-workflow`, creada en un worktree aislado desde staging actualizado por fast-forward al mismo commit. El checkout anterior y los trabajos independientes se conservan.
- Git Bash disponible: 5.3.15. Solo se comprobó su disponibilidad; no se instalaron herramientas ni se ejecutaron pruebas históricas.

## Comparación e inventario

La comparación de blobs Git identifica siete herramientas ausentes, siete agentes y quince skills reescritos, MCP diferente y doce plantillas idénticas.

| Archivos | Cambio previsto |
| --- | --- |
| `tools/{check-status,pull-changes,create-branch-from-staging,create-branch,create-empty-commit,commit-changes,launch-push}.sh` | Incorporar los siete blobs originales, LF y modo Git `100755`; sin editar código |
| Los mismos siete nombres con extensión `.ps1` y `tools/git-common.ps1` | Retirar los ocho archivos propios |
| `tools/tests/{test-git-workflow,test-git-safety,test-untracked-worktree}.ps1` | Retirar los tres ensayos propios, sin reemplazos permanentes |
| `agents/{git-workflow-agent,help-me-to-think,create-issue,create-branch,create-commit,launch-push,create-pr}.md` | Recuperar los siete originales; solo el orquestador recibe la referencia local indicada abajo |
| `skills/{assign-author,assign-reviewers,check-status,commit-changes,create-branch,create-branch-from-staging,create-draft,create-empty-commit,create-issue,create-pr-base-staging,grill-me,grill-with-docs,launch-push,link-pr-to-issue,pull-changes}/SKILL.md` | Recuperar las quince originales; cambiar únicamente las siete rutas indicadas abajo |
| `templates/issues/{feat,fix,docs,refactor,test,chore}_issue.md` y `templates/pull-request/{feat,fix,docs,refactor,test,chore}-pull-request.md` | Conservar las doce: sus blobs coinciden con la fuente |
| `MCPS/github-mcp-server/mcp.txt` | Restaurar el texto original; no ejecutar sus indicaciones de instalación o configuración |
| `AGENTS.md` | Conservar la referencia existente al gitflow y todo el SDD; actualizar solo las referencias obsoletas a herramientas y ensayos |
| `docs/GIT-AUTOMATION.md`, `docs/TREE.md`, `docs/ARCHITECTURE.md` | Describir Bash original, inventario real y límites, retirando la interfaz y garantías de la implementación sustituida |
| `docs/specs/restore-original-git-workflow/` | En esta preparación solo `spec.md` y `plan.md`; los documentos posteriores esperan su fase autorizada |

No cambia `docs/CONSTITUTIONS.md`, código de aplicación, clientes, SQLite, ChromaDB, paquetes, pruebas funcionales ni specs históricas.

## Diferencias exactas permitidas frente al template

En cada skill siguiente se sustituye solo el prefijo `./tools/` por `./staff/jimena-duran/first-app/tools/`, conservando argumentos y todo el texto restante:

| Skill | Comando resultante desde la raíz Git |
| --- | --- |
| check-status | `./staff/jimena-duran/first-app/tools/check-status.sh` |
| pull-changes | `./staff/jimena-duran/first-app/tools/pull-changes.sh` |
| create-branch-from-staging | `./staff/jimena-duran/first-app/tools/create-branch-from-staging.sh` |
| create-branch | `./staff/jimena-duran/first-app/tools/create-branch.sh` |
| create-empty-commit | `./staff/jimena-duran/first-app/tools/create-empty-commit.sh` |
| commit-changes | `./staff/jimena-duran/first-app/tools/commit-changes.sh` |
| launch-push | `./staff/jimena-duran/first-app/tools/launch-push.sh` |

En `agents/git-workflow-agent.md`, tras su título original, se añade únicamente este párrafo:

> Lee [AGENTS.md](../AGENTS.md), [CONSTITUTIONS.md](../docs/CONSTITUTIONS.md) y la [guía local](../docs/GIT-AUTOMATION.md). El SDD local de first-app prevalece sobre cualquier indicación del template de continuar automáticamente. Las rutas de agents y skills se resuelven dentro de first-app.

Resultado esperado: 34 de los 42 archivos de la fuente sin diferencias de contenido y ocho adaptaciones documentales. Las guías locales explican su ubicación y el SDD existente; no introducen reglas del flujo propias. Los ejemplos de instalación y configuración de la fuente son referencias, no autorización para ejecutarlos. Se conserva MCP con la alternativa gh ya documentada, sin editar conexiones, headers, tokens o configuración personal.

## Límites observados en la fuente

Se señalan en revisión estática, sin corrección local:

- `commit-changes.sh` puede aceptar un directorio ya borrado y seleccionar descendientes; su `git add` final puede fallar después de un borrado preparado.
- `pull-changes.sh` comprueba ascendencia con referencias y después mueve staging sin fijar los mismos SHA.
- `launch-push.sh` no desactiva `push.followTags`.
- `assign-reviewers` no establece expresamente salir de draft antes de solicitar revisores.

No se trasladan a los originales los controles de los sustitutos retirados ni se presentan esos problemas como resueltos.

## Comprobación prevista tras las aprobaciones

1. Leer los blobs fijados para evitar conversiones automáticas de finales de línea. Contrastar contenido y hashes, nombres, LF de los siete scripts y modo `100755` al prepararlos para una publicación autorizada. Para plantillas, verificar los blobs conservados.
2. Comparar los 42 archivos con la fuente y mostrar el diff exacto de las únicas ocho adaptaciones; recorrer selección y alternativa de plantillas en lectura.
3. Pasar `bash -n` y comprobar estado desde raíz y una copia con espacios. Los ensayos de contratos con commits o push solo se harán con autorización que los incluya, sobre repositorios desechables con remoto local.
4. Revisar enlaces, espacios, alcance, datos y archivos protegidos. Registrar resultados nuevos por separado; no reutilizar resultados PowerShell como prueba Bash ni repetir pruebas funcionales ajenas.

## SDD y pausa

Spec y plan se revisan juntos. Solo tras aprobarlos se crean tareas para otra revisión; después comienza la implementación autorizada. No se adoptan los cinco momentos de otro proyecto ni se encadenan las operaciones automáticas del template.

T01–T09 autorizados, incluidos commits y push exclusivamente en ensayos desechables con remoto local. T10 y publicación selectiva autorizados; sin revisores ni merge. Al terminar se presentan resultados y límites; commit selectivo, push y PR draft contra staging autorizados para esta entrega; sin revisores ni merge.
