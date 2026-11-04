# Sincronizar flujo git con la plantilla del curso

Issue: #932 · Plantilla @ `f832a367` (incl. protocolo entrevista #925). Los scripts se invocan desde la raíz del monorepo con rutas `staff/jose-miguel/first-app/tools/`.

Esta tarea continúa el mantenimiento de #858 (`665b92a5`): incorpora el script `create-pr-base-staging.sh`, el orquestador «issue escrita → Empezar» y la PR draft en una sola invocación.

## Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien construye con IA** | Reglas actuales del curso (rama + PR draft antes de cambiar código; issue clara antes de crearla; tras crear issue, Empezar si hay cambios). |
| **Quien revisa** | Ver que la copia local no se quedó atrás de la plantilla compartida. |

## Historias de usuario

- **HU-01**: Como quien construye, quiero que `agents/git-workflow-agent.md` y `agents/create-pr.md` coincidan con la plantilla, para aplicar las mismas reglas de momento y creación de PR.
- **HU-02**: Como quien construye, quiero ocho scripts en `tools/` y skills con rutas monorepo, para ejecutar `gh`-based PR desde la raíz del repositorio.
- **HU-03**: Como quien clona, quiero que el código de la app no cambie en este mantenimiento.

## Criterios de aceptación

- **CA-01**: **Dado** la plantilla en `0d548411`, **cuando** se compara `agents/git-workflow-agent.md` y `agents/create-pr.md`, **entonces** el texto es idéntico al de la plantilla.
- **CA-02**: **Dado** los ocho scripts en `tools/`, **cuando** se comparan con la plantilla, **entonces** el contenido es idéntico.
- **CA-03**: **Dado** las skills que llaman a `tools/`, **cuando** se leen, **entonces** el comando usa `staff/jose-miguel/first-app/tools/` (o `bash staff/.../create-pr-base-staging.sh`) y el resto coincide con la plantilla.
- **CA-04**: **Dado** `templates/`, **cuando** se revisa el diff de esta tarea, **entonces** no cambia.
- **CA-05**: **Dado** `src/`, `package.json` y `scripts/` de arranque, **cuando** se revisa el diff, **entonces** no cambian.
- **CA-06**: **Dado** `MCPS/socket-mcp/`, **cuando** se revisa el diff, **entonces** sigue intacto.

## Fuera de alcance

- Editar `exercises/git-workflow-agent-template`.
- Reescribir el historial de specs (#858 queda como registro de la sync anterior).
