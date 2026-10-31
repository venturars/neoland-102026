# Tasks: Flujo de git en first-app

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden**.

## Reglas de ejecución
- Se ejecutan todas seguidas y se enseña el resultado al final.
- No se tocan `logic/`, `queries/`, `db/`, `clients/` ni `docs/CONSTITUTIONS.md`.
- Las pruebas no crean issues, ramas, commits ni pull requests.
- Si el plan no cubre un caso, no se improvisa: se para y se pregunta.

## T1. Copiar la plantilla
- [ ] Copiar con git `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` de `exercises/git-workflow-agent-template` a la app.
- [ ] Comprobar que son 42 ficheros, idénticos a la plantilla, y que los 7 scripts tienen permiso `100755`.

## T2. Enlazar el flujo desde `AGENTS.md`
- [ ] Añadir la línea del plan después del título. El resto de `AGENTS.md` no cambia.

## T3. Probar los scripts
- [ ] Ejecutar `check-status.sh` y `pull-changes.sh` desde la app con Git Bash.
- [ ] Lanzar `create-branch-from-staging.sh`, `create-empty-commit.sh`, `commit-changes.sh` y `launch-push.sh` con datos que no valen y comprobar que se paran con su mensaje.
- [ ] Comprobar que la rama y los ficheros no han cambiado.

## T4. Probar el acceso a GitHub
- [ ] Pedir al MCP de GitHub el usuario autenticado.

## T5. Resumen
- [ ] Enseñar los ficheros añadidos y lo probado.
- [ ] Recordar que la prueba completa se hace con la siguiente tarea, cuando esta esté en `staging`.
