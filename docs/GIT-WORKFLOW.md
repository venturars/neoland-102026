# Flujo de git

Una tarea nueva es una issue, una rama y una pull request. La rama sale de `staging` y la pull request vuelve a `staging`. `main` no forma parte de este camino.

Las issues, las pull requests y los mensajes de commit van en inglés. Los commits siguen la skill `git-commit`. Las skills están en `SKILL.md`, en la raíz del repositorio.

La alumna pide el trabajo con sus palabras. El agente lo lleva a un solo momento de esta lista. Si la petición encaja en dos momentos, pregunta cuál es y espera. Antes de actuar, enseña los datos de ese momento y espera el sí.

## 1. Dejar la tarea escrita

El agente usa la skill `github-issues`. Enseña el título, el autor, la persona asignada y el cuerpo. El autor y la persona asignada son la alumna. El título tiene menos de 72 caracteres. El cuerpo, en inglés, tiene dos partes: qué hay que hacer y cómo lo prueba un compañero en su ordenador. En esta app, esa prueba es pegar el ejemplo de `clients/terminal/` con el directorio actual en `first-app`. No hay script de tests.

Si la alumna quiere afilar la tarea antes de escribirla, pide la skill `grill-me`. Esa entrevista no crea la issue.

## 2. Empezar el trabajo

El nombre de la rama junta el número de la issue, el tipo de conventional commit y una descripción corta en inglés:

`201-feat-save-a-person`

El agente enseña ese nombre, que la base es `staging`, y el mensaje del commit vacío: `chore: open #201`. Ese commit vacío existe para poder abrir la pull request antes de tener el trabajo. Se sube la rama y se abre la pull request en draft.

## 3. La pull request

El agente usa la skill `create-github-pull-request-from-specification`. La base es `staging`. El título es el de la issue. El cuerpo rellena `.github/pull_request_template.md` e incluye `Closes #<número>`. La persona asignada es la alumna. La pull request se queda en draft.

Si la alumna pide la pull request y todavía no existe, se abre entonces. Si la rama ya tiene una, se actualiza esa.

## 4. Guardar un trozo

El agente usa la skill `git-commit`. Un commit es un cambio pequeño. Enseña el mensaje y los ficheros. Con el sí, hace el commit y lo sube.

## 5. Pedir que la miren

La alumna dice quién. Hacen falta 2 personas o más con acceso al repositorio, y la autora de la pull request no entra en la lista. Un profesor cuenta solo si ella lo nombra.

El agente enseña la lista. Con el sí, saca la pull request de draft y pide la revisión a esas personas.

## 6. Pasarla a staging

Solo si la alumna lo pide y hay 2 Approvals o más hechos después del último push. El agente enseña la rama de origen y que el destino es `staging`. Si faltan Approvals, se para. El merge es un merge commit, así los commits pequeños siguen en el historial. GitHub cierra la issue por el `Closes`.

## Qué cuenta como revisión

La revisión vale cuando el compañero hace las cinco cosas:

- Prueba la tarea en su ordenador.
- Comprueba que el resultado hace lo que dice la issue.
- Comprueba las personas asignadas en la issue y en la pull request.
- Deja un comentario con lo que ha probado.
- Pulsa Approve.

## Si piden cambios

Se sigue en la misma rama y en la misma pull request. Se pide la revisión otra vez. El merge espera 2 Approvals hechos después del último push.

## Lecturas y escrituras

Las lecturas de GitHub pueden usar el MCP de GitHub. Las escrituras van con `gh` y la cuenta de la alumna, para que el autor sea ella.
