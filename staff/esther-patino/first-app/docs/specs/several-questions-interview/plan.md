# Plan — entrevista con las preguntas que hagan falta

Issue: #928.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma. No hay parámetros. No hay salida. No hay SQL. No hay paquete de Node ni cambio de versión.

## Ficheros

Se crean:

- `docs/specs/several-questions-interview/spec.md`
- `docs/specs/several-questions-interview/plan.md`
- `docs/specs/several-questions-interview/tasks.md`

Se tocan:

- `agents/help-me-to-think.md`
- `agents/git-workflow-agent.md`, en la llamada a pensar la tarea
- `skills/grill-me/SKILL.md`
- `skills/grill-with-docs/SKILL.md`
- `docs/ARCHITECTURE.md`, en el punto de la entrevista

No se toca `agents/create-pr.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/create-draft/SKILL.md` ni `tools/create-pr-base-staging.sh`. No se toca `src/`, `package.json` ni `MCPS/socket-mcp/`.

## Entrevista

`agents/help-me-to-think.md` hace las preguntas que necesite, cada una con su respuesta recomendada, y se detiene. El orquestador espera al alumno y vuelve a llamar con las respuestas. Cuando ya no quedan dudas, devuelve el resumen final.

`skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md` devuelven las preguntas y no siguen hasta que las llamen con las respuestas.

En `agents/git-workflow-agent.md`, si no se puede reanudar el mismo subagente, se le pasa el historial completo de preguntas y respuestas en cada llamada.

## Errores

No hay fallo de la lista «Errores».

## Decisión

La constitución, el texto de la plantilla y esta spec dicen lo mismo. Hay `tasks.md`. No hay pregunta abierta. El trabajo sigue en la rama `928-docs-latest-pr-creation` y en la issue #928. La pull request #929 sigue abierta.
