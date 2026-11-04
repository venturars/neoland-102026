# Spec: Recoger los últimos cambios del flujo de git

Issue: #959.

## Qué queremos conseguir
Que el flujo de git de first-app haga lo que hace ahora el del curso. Hoy abre la pull request en tres pasos, el agente que ayuda a pensar hace una sola pregunta cada vez, el orquestador no dice qué hacer con la issue ya escrita ni comprueba cada paso, y los mensajes de commit pueden ser vagos.

## Cómo se usa
- **Abrir la pull request:** `create-pr` la abre en un solo paso con un script de `tools/`. Sale con base `staging`, en draft y asignada a quien la abre. Si la pull request de la rama ya existe, no abre otra: actualiza el cuerpo y usa `assign-author` y `create-draft` si hace falta, sin tocar el enlace con la issue.
- **El script:** recibe la rama, el título y el fichero con el cuerpo. Si falta algo o el fichero no existe, termina con error y no crea nada.
- **Pensar la tarea:** `help-me-to-think`, `grill-me` y `grill-with-docs` hacen todas las preguntas que necesitan en una ronda, cada una con su respuesta recomendada, y se paran. El orquestador espera al alumno y vuelve a llamarlas con las respuestas. Si no puede retomar el mismo subagente, le pasa todas las preguntas y respuestas anteriores. Al final sale el mismo resumen que hoy.
- **Orquestador:** si la issue ya está escrita y lo siguiente hace cambios, el paso es Empezar. Después de crear la issue, si vienen cambios, sigue con Empezar. Antes de cada paso comprueba que el anterior salió bien. Si uno falla, dice qué falló y no sigue hasta que se resuelva.
- **Commits:** el mensaje es una sola línea que nombra el fichero o la función y el cambio, no un verbo suelto como `update files` o `fix bug`. El commit vacío sigue siendo `chore: open #N`.

## Ejemplo
- Al empezar la issue #N, `create-pr` llama al script con la rama `N-docs-...`, el título de la issue y un fichero temporal con el cuerpo. Devuelve la URL de una pull request hacia `staging`, en draft y asignada a quien la abre.
- Se pide «mejora los usuarios». `help-me-to-think` devuelve de una vez «¿qué operación?», «¿qué debería salir?» y «¿cómo se comprueba?», cada una con su respuesta recomendada. El orquestador se las enseña al alumno y espera.
- Un commit que cambia el mensaje de error de `src/logic/create-user.js` es `fix: show the email in the createUser duplicate error`, no `fix: bug`.

## Fuera de alcance
- La app: `src/`, sus guías y sus comandos.
- Los otros agentes, skills, scripts y plantillas, que ya coinciden con los del curso.
- La forma de escribir de `git-workflow-agent.md` donde ya dice lo mismo que el curso con otras palabras.
- Las rutas de las skills, que en first-app son `./tools/...`.
- El flujo de git de AsistenciApp.
