# Tareas — adaptar el flujo de git

1. Copiar `agents/` de `exercises/git-workflow-agent-template` a
   `staff/sergio-cortes/first-app/agents`. Los siete ficheros del plan.
   El texto no cambia todavía.

2. Copiar `skills/` de la plantilla a `staff/sergio-cortes/first-app/skills`.
   Los ficheros del plan. El texto no cambia todavía.

3. Copiar `tools/` de la plantilla a `staff/sergio-cortes/first-app/tools`.
   Los siete scripts. Hacerlos ejecutables.

4. Copiar `templates/` de la plantilla a `staff/sergio-cortes/first-app/templates`.
   Los dos ficheros del plan.

5. Copiar `MCPS/` de la plantilla a `staff/sergio-cortes/first-app/MCPS`.
   El fichero `github-mcp-server/mcp.txt`.

6. Abrir las skills cuyo comando es `./tools/`.
   Cada `./tools/` pasa a `staff/sergio-cortes/first-app/tools/`.
   El resto de cada skill sigue igual.

7. `git mv` `AGENTS.MD` → `AGENTS.md` en first-app.
   Sustituir `AGENTS.MD` por `AGENTS.md` en el resto de first-app.

8. Abrir `AGENTS.md`. Cabecera, «Proyecto», «Orden» y primera regla
   como los apartados «AGENTS.md» y «Orden» del plan.
   Conservar Paquetes, Comandos y «Al terminar una tarea».

9. Abrir `agents/git-workflow-agent.md`, en «Procesamiento».
   Llamar queda como el apartado «Llamar» del plan (Task,
   `generalPurpose`).

10. Abrir `agents/help-me-to-think.md`, en «Procesamiento».
    Una pregunta cada vez; devuelve al orquestador; no espera al alumno
    ni escribe ficheros (texto como Ventura).

11. Abrir `docs/CONSTITUTIONS.md`, en el primer párrafo.
    Issue antes de spec; spec con `Issue: #N`; `AGENTS.md` en lugar de
    `AGENTS.MD` donde aplique.

12. Abrir `docs/TREE.md`.
    `AGENTS.md` en la raíz; las cinco carpetas antes de `docs/`.

13. Abrir `docs/ARCHITECTURE.md`.
    Añadir los puntos del apartado «Arquitectura» del plan.
    El punto de `git-workflow-agent` es el de subagente aparte.
    `AGENTS.md` en lugar de `AGENTS.MD`.

14. Comprobar.
    Desde la raíz, `staff/sergio-cortes/first-app/tools/check-status.sh`
    termina bien.
    `logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian.
