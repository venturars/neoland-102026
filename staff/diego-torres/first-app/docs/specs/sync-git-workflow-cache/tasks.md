Issue: #1165

# Tareas — poner al día el flujo de git con la plantilla del curso

La plantilla es `exercises/git-workflow-agent-template`. Los ficheros de este cambio son documentos y una herramienta copiada, así que no se les añaden comentarios: tienen que quedar iguales que en la plantilla, salvo las rutas del plan.

1. Compara `exercises/git-workflow-agent-template` con `origin/staging`.
   Si ha cambiado desde `f12f1a0a`, para y avisa a Diego. No sincronices esa novedad en silencio.

2. Copia `tools/github-cache.mjs` de la plantilla, sin cambios.
   Desde la raíz del repo, `node staff/diego-torres/first-app/tools/github-cache.mjs alias get venturars/neoland-102026 "Prueba"` responde `null`, sin error.

3. Copia `skills/github-cache/SKILL.md` de la plantilla.
   Cambia la ruta del comando por `node staff/diego-torres/first-app/tools/github-cache.mjs`.

4. Copia `templates/issues/knowledge_issue.md` y `templates/pull-request/knowledge-pull-request.md` de la plantilla, sin cambios.
   Salen en sus carpetas, junto a las de los demás tipos.

5. Sustituye `agents/git-workflow-agent.md`, `agents/create-pr.md` y `agents/create-commit.md` por los de la plantilla.
   El orquestador delega la revisión en `create-pr`, y `create-pr` nombra `github-cache` y `assign-reviewers`.

6. Sustituye `skills/assign-reviewers/SKILL.md` por el de la plantilla.
   Pide comprobar en vivo que cada revisor colabora en el repositorio.

7. Sustituye `skills/commit-changes/SKILL.md` por el de la plantilla.
   Cambia la ruta del comando por `staff/diego-torres/first-app/tools/commit-changes.sh`. Pide asunto, desglose y pie, y admite el tipo `knowledge`.

8. Sustituye `skills/create-pr-base-staging/SKILL.md` por el de la plantilla.
   Cambia la ruta del comando por `bash staff/diego-torres/first-app/tools/create-pr-base-staging.sh`.

9. Lanza `diff -r --strip-trailing-cr` de `agents/`, `skills/`, `tools/` y `templates/` con la plantilla.
   Solo quedan las diferencias de ruta en las skills.

10. Busca `exercises/git-workflow-agent-template` en `agents/`, `skills/` y `tools/`.
    No aparece. Si aparece en un texto que la plantilla usa como referencia, para y avisa a Diego.

11. Con `alias set`, guarda un alias de prueba con un login real del repo. Consúltalo con `alias get` y bórralo con `alias remove`.
    `alias get` devuelve ese login y, después de borrarlo, `null`. `git status` no muestra `.git-workflow-cache.json` ni su `.lock`.

12. Lanza `pnpm lint` y `tools/check-status.sh`.
    Los dos funcionan. Si ESLint marca `tools/github-cache.mjs`, para y avisa a Diego: no cambies el script ni la configuración.

13. Lanza `git diff --stat staging`.
    Solo salen ficheros de `agents/`, `skills/`, `tools/`, `templates/` y `docs/specs/sync-git-workflow-cache/`.
