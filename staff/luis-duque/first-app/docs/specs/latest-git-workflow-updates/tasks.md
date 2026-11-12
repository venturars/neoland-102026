# Tareas — lo último del flujo de git en first-app

Plan aceptado. Issue #1163. Cada paso hace una cosa. Las rutas de comando van a `staff/luis-duque/first-app/tools/`.

1. Crea `tools/create-pr-base-staging.sh`.
   Copia el del template. Abre la PR contra `staging`, en draft y asignada a `@me`, en una sola llamada.
   El fichero se puede leer.

2. Crea `tools/github-cache.mjs`.
   Copia el del template. No cambia el archivo de caché de la raíz.
   El fichero se puede leer.

3. Crea `skills/github-cache/SKILL.md`.
   Copia el del template. El comando es `node ./staff/luis-duque/first-app/tools/github-cache.mjs`.
   No apunta a `exercises/git-workflow-agent-template`. El fichero se puede leer.

4. Crea `templates/issues/knowledge_issue.md` y `templates/pull-request/knowledge-pull-request.md`.
   Copiados del template. El fichero se puede leer.

5. Abre `tools/create-branch-from-staging.sh`.
   Quita la lista cerrada de tipos para que quepa `knowledge`.
   El resto del script se queda. El fichero se puede leer.

6. Abre `skills/create-branch-from-staging/SKILL.md`.
   El tipo es el de la plantilla. El comando sigue `./staff/luis-duque/first-app/tools/create-branch-from-staging.sh`.
   El fichero se puede leer.

7. Abre `skills/create-pr-base-staging/SKILL.md`.
   Una invocación deja la PR en draft y asignada. El comando es `./staff/luis-duque/first-app/tools/create-pr-base-staging.sh`.
   `assign-author` y `create-draft` siguen para actualizar una PR ya existente. El fichero se puede leer.

8. Abre `agents/create-pr.md`.
   Crear usa `create-pr-base-staging`. Pedir revisión usa `github-cache` y `assign-reviewers` y saca la PR de draft.
   No enlaza la issue. El fichero se puede leer.

9. Abre `skills/assign-reviewers/SKILL.md`.
   Recibe logins ya resueltos. Comprueba en vivo que son colaboradores. No inventa un login.
   El fichero se puede leer.

10. Abre `agents/git-workflow-agent.md`.
    Se quedan «Cuándo actuar» y no saltar las paradas.
    Entra: issue clara se escribe; con issue y cambios, Empezar; revisión en `create-pr`; confirmar cada paso.
    Empezar llama a `create-pr` con `create-pr-base-staging`. El fichero se puede leer.

11. Abre `agents/help-me-to-think.md`, `skills/grill-with-docs/SKILL.md` y `skills/grill-me/SKILL.md`.
    Las preguntas que hagan falta salen de una vez, cada una con una respuesta recomendada, y se espera.
    Los tres se pueden leer.

12. Abre `skills/commit-changes/SKILL.md`.
    Entra el tipo `knowledge`, el desglose y el pie.
    El comando sigue `./staff/luis-duque/first-app/tools/commit-changes.sh`. El fichero se puede leer.

13. Abre `docs/CONSTITUTIONS.MD`.
    El desarrollo abierto pasa a `docs/specs/latest-git-workflow-updates/`.
    El fichero se puede leer.

14. Lee `src/`, `package.json`, `scripts/`, `skills/frontend-design` y el `.gitignore` de la raíz.
    Siguen igual. No hay paquete nuevo. Ninguna skill apunta a `exercises/git-workflow-agent-template`.
