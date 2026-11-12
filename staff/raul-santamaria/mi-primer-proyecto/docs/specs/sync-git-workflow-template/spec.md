# Sincronizar el flujo de git con la plantilla

Issue: #963.

Quien trabaja en esta app ya sigue el flujo de git del curso dentro de
`mi-primer-proyecto`. La plantilla oficial vive en
`exercises/git-workflow-agent-template` y en `staging` remoto hay cambios
nuevos que esta app aún no tiene.

Lo usa quien construye la app con IA.

Entra la plantilla al día en `staging`. Sale el stack de git de esta app
alineado con esa plantilla, con las dos excepciones de siempre: las rutas
de los scripts apuntan a
`staff/raul-santamaria/mi-primer-proyecto/tools/` y el orquestador
conserva las paradas de «Orden» de `AGENTS.md`.

Al empezar, si la issue ya está escrita y el siguiente paso es hacer
cambios, el momento es Empezar sin pedir otro sí. Al pensar la tarea,
`help-me-to-think` puede devolver varias preguntas con respuesta
recomendada; el orquestador espera al alumno y reanuda pasando el
historial si hace falta.

Al abrir la pull request, `create-pr` usa una sola invocación de
`create-pr-base-staging`: base `staging`, draft y asignación al usuario
autenticado con GitHub CLI y el script `create-pr-base-staging.sh`, no
con el MCP de GitHub. Si la pull request ya existe, se actualiza el
cuerpo conservando el enlace con la issue y se usan `assign-author` y
`create-draft` cuando toque. El orquestador ya no encadena
`assign-author` ni `create-draft` justo después de crear la PR.

Al guardar un trozo, `commit-changes` exige un conventional commit
técnico en una línea, como en la plantilla.

Las entrevistas `grill-me` y `grill-with-docs` devuelven todas las
preguntas que hagan falta, con la forma de la plantilla.

Ejemplo: en `staging` entra un ajuste en `create-pr-base-staging`. Se
copia a esta app, la skill apunta al script bajo
`staff/raul-santamaria/mi-primer-proyecto/tools/` y `agents/create-pr.md`
describe una sola llamada. `src/logic/` no cambia.

Aunque el flujo de git no pare, en esta app hay dos paradas. La primera
es antes de crear las tareas: una persona revisa la spec y el plan. La
segunda es al crear las tareas.

No hay un fallo de la lista «Errores». Si la PR se crea solo con MCP sin
el script, si el orquestador sigue encadenando tres skills para abrirla,
si `help-me-to-think` vuelve a una pregunta por turno sin el historial,
o si las rutas de los scripts vuelven a `./tools/`, el stack no está
sincronizado.

Queda fuera cambiar las reglas de negocio, la base de datos, los
clientes, `package.json`, `MCPS/socket-mcp/`, `templates/` que ya
coinciden con la plantilla, `skills/validate-node-package/` y el
contenido de otras specs salvo la documentación de arquitectura que
describa este stack.
