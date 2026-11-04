# Plan — dejar el flujo de git al día

Issue: #940.

No es una funcionalidad nueva. No reemplaza ningún fichero de
`logic/`. No hay firma. No hay SQL. No hay paquete de Node. No
entra Socket.

## Ficheros

Se tocan:

- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `skills/grill-me/SKILL.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `docs/ARCHITECTURE.md`

No se toca `logic/`, `queries/`, `db/`, `clients/`, `package.json`
ni `MCPS/socket-mcp/`. Las skills cuya única diferencia con la
plantilla es la ruta del script no cambian.

## Texto

`agents/git-workflow-agent.md`, `agents/help-me-to-think.md`,
`skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`
quedan como la plantilla del curso, sin cambiarlos.

`skills/commit-changes/SKILL.md` queda como la plantilla del
curso. Cambia la ruta del comando.

## Rutas

El comando de `skills/commit-changes/SKILL.md` sigue siendo
`staff/ventura-rodriguez/first-app/tools/commit-changes.sh`.
No pasa a `./tools/`.

## Árbol

`docs/TREE.md` ya lista `agents/`, `skills/` y `docs/`. No se
añade ni se quita ningún fichero. El árbol no se modifica.

## Arquitectura

Se sustituyen estos puntos. El resto sigue igual.

- `agents/git-workflow-agent.md` reconoce el momento y llama al
  subagente como un agente aparte. Si la issue ya está escrita y
  el trabajo siguiente hace cambios, el momento es Empezar. Si no
  puede reanudar la entrevista, pasa el historial de preguntas y
  respuestas.
- `agents/help-me-to-think.md` hace las preguntas que hagan falta,
  cada una con su respuesta recomendada, y para. El orquestador
  espera y vuelve a llamar con las respuestas.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros
  nombrados. El mensaje nombra el fichero o la función y el
  cambio.

Los puntos de `skills/grill-me/SKILL.md` y de
`skills/grill-with-docs/SKILL.md` siguen igual.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».
