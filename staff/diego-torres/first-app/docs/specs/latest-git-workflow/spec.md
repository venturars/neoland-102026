# Actualizar el flujo de git

Issue: #860.

Quien trabaja en esta app sigue el flujo de git del curso. Ese flujo queda como el último de la plantilla (`exercises/git-workflow-agent-template`): una plantilla por tipo, el cierre escrito en la pull request y la escritura directa en GitHub.

Lo usa quien construye la app con IA.

Entra una tarea de esta app. Antes de crear la issue, el orquestador mira si el problema, el resultado, el alcance y cómo comprobarlo están claros. Si lo están, la crea. Si no, llama a `help-me-to-think`. La tarea sale escrita con la plantilla de su tipo: feat, fix, docs, refactor, test o chore. Si el tipo no tiene plantilla, se usa la más cercana. El título, el tipo y la forma de la rama se leen en esa plantilla.

Al empezar, la rama sale de staging y la pull request se abre en draft antes de cambiar nada. Al guardar, entra ese trozo. Al pedir revisión, quien pide nombra a los revisores y la pull request deja de ser borrador.

Al enlazar, el cuerpo lleva `Closes #N` y la tarea queda en Development. Quien enlaza no la cierra. GitHub la cierra al fusionar esa pull request en la rama por defecto. Fusionar en staging no la cierra mientras la rama por defecto sea main.

Crear o editar una issue o una pull request escribe directo. Hace falta el header `X-MCP-Features: mcp_apps_disable_form_deferral` junto a Authorization. Sin él, el formulario no muestra el botón de enviar.

Ejemplo: se pide un cambio de tipo feat. La tarea usa la plantilla feat. La rama nueva sale de staging. La pull request lleva `Closes #N` y la tarea sigue abierta. Al fusionarla en la rama por defecto, la tarea se cierra. Fusionarla solo en staging la deja abierta.

Aunque el flujo de git no pare, en esta app hay dos paradas. La primera es antes de crear las tareas: una persona revisa la spec y el plan. La segunda es al crear las tareas.

No hay un fallo de la lista «Errores». Si sigue la plantilla única, si el cuerpo no lleva `Closes #N`, si quien enlaza cierra la tarea con la API, o si el formulario se queda sin botón de enviar, el flujo no está actualizado.

Queda fuera cambiar las reglas de negocio, la base de datos, los clientes, los paquetes, las rutas de los scripts de esta app y el MCP de Socket.
