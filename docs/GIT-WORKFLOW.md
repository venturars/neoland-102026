# Flujo de git

Una tarea es una issue, una rama y una pull request. Sale de `staging` y vuelve a `staging`. `main` queda fuera de este flujo.

La issue, la pull request y los mensajes de commit van en inglés. Los commits siguen la skill `git-commit`. Las skills están en `SKILL.md`, en la raíz. Cómo instalarlas está en el `README.md`.

## Cómo se pide

El alumno pide el trabajo con sus palabras. Cuenta qué quiere: dejar una tarea escrita, empezar a hacerla, guardar lo que acaba de hacer, que unos compañeros la miren, o pasarla a `staging`.

El agente reconoce a qué momento del camino se refiere y aplica las reglas de ese momento. Si la petición cabe en dos momentos, pregunta cuál es y espera la respuesta.

Puede pedir un momento o el camino entero. Antes de actuar, el agente enseña los datos de ese momento y espera el sí.

«Quiero agregar una funcionalidad a first-app: buscar un usuario por nombre» es dejar la tarea escrita. El `AGENTS.md` de esa app no se aplica todavía.

## El camino de una tarea

### 1. Dejar la tarea escrita

El alumno explica la tarea que va a hacer, o pide dejarla apuntada.

El agente usa la skill `github-issues`. Enseña el título, el autor, la persona asignada y la descripción. El autor y la persona asignada son el alumno. El título tiene menos de 72 caracteres. La descripción tiene dos partes, en inglés: qué hay que hacer y cómo lo prueba un compañero en su ordenador.

Si el alumno quiere pensar la tarea antes de dejarla escrita, el agente usa la skill `grill-me`. Es opcional. La issue aparece cuando el alumno pide dejarla escrita.

### 2. Empezar a trabajar

El alumno quiere ponerse con esa tarea.

La rama sale de `staging`. El nombre junta el número de la issue, el tipo de conventional commit y una descripción corta leída de la issue:

`184-feat-count-users-by-gender`

El agente enseña el nombre, que la base es `staging`, y el mensaje del commit vacío: `chore: open #184`.

Ese commit vacío existe para poder abrir la pull request antes de tener trabajo. Se sube la rama y se abre la pull request en draft.

### 3. La pull request

En el camino normal, la pull request en draft nace al empezar a trabajar. Si el alumno pide la pull request y todavía no existe, el agente la abre entonces.

Usa la skill `create-github-pull-request-from-specification`. El destino es `staging`. El título es el de la issue. El cuerpo sale de `.github/pull_request_template.md` e incluye `Closes #184`. La persona asignada es el alumno. La pull request se queda en draft.

El agente enseña el título, la rama, el destino, el `Closes` y la persona asignada.

### 4. Guardar un trozo de trabajo

El alumno ha avanzado y quiere guardar ese trozo.

El agente usa la skill `git-commit`. Un commit es un cambio pequeño. Enseña el mensaje y los ficheros. Con el sí, hace el commit y lo sube.

### 5. Que los compañeros la miren

El alumno da la funcionalidad por terminada y quiere que otras personas la revisen. Dice quiénes, con sus palabras.

Hacen falta 2 o más personas con acceso al repositorio. El autor de la pull request queda fuera de la lista. Un profesor con acceso cuenta si el alumno lo nombra.

El agente comprueba esa lista y la enseña. Con el sí, saca la pull request de draft y asigna a esas personas.

### 6. Pasarla a staging

Hay 2 o más Approve y el alumno quiere incorporar la tarea a `staging`.

El agente enseña la rama de origen y que el destino es `staging`. Si faltan Approve, se para y lo dice. El merge es un merge commit, así los commits pequeños siguen en el historial. GitHub cierra la issue por el `Closes`.

## Qué comprueba un revisor

Una revisión cuenta cuando el compañero hace estas cinco cosas:

- Prueba la tarea en su ordenador.
- Comprueba que el resultado hace lo que dice la issue.
- Comprueba que la issue y la pull request tienen bien las personas asignadas.
- Deja un comentario con lo que ha probado.
- Pulsa Approve en GitHub.

## Si piden cambios

Se sigue en la misma rama y en la misma pull request. El alumno guarda los trozos nuevos y pide que las vuelvan a mirar.

El agente pide la revisión otra vez. El merge espera 2 Approve hechos después del último push.

## Reglas del agente

El agente traduce lo que el alumno pide a un momento del camino. Antes de actuar, enseña los datos y espera el sí.

- **Dejar la tarea escrita.** Skill `github-issues`. Enseña título, autor, persona asignada y cuerpo.
- **Empezar a trabajar.** Enseña el nombre de la rama, la base `staging` y el mensaje `chore: open #<número>`. Hace el commit vacío, lo sube y abre la pull request en draft.
- **Abrir la pull request**, si al empezar no quedó abierta. Skill `create-github-pull-request-from-specification`. Enseña título, rama, destino `staging`, `Closes #<número>` y persona asignada. Si la rama ya tiene pull request, actualiza esa.
- **Guardar un trozo.** Skill `git-commit`. Enseña el mensaje y los ficheros. Después hace el commit y el push.
- **Que la miren, o que la vuelvan a mirar.** Enseña la lista de revisores. Luego saca la pull request de draft, si seguía en draft, y asigna a esas personas.
- **Pasarla a staging.** Enseña la rama de origen y el destino `staging`. Comprueba que hay 2 Approve después del último push. El merge es un merge commit.
- Un `AGENTS.md` dentro de `staff/` no abre otro primer paso. La funcionalidad nueva se deja escrita antes de seguir las reglas de esa app.

La tarea la explica el alumno. El agente redacta con eso. La pull request nace en draft: pasa a lista cuando el alumno quiere que la miren. La issue la cierra GitHub al mergear, por `Closes`. Cada momento espera el sí.

Las lecturas de GitHub pueden usar el MCP descrito en `MCP.md`. Las escrituras van con `gh` y la cuenta del alumno, para que el autor sea el alumno.

## El nombre de la rama

```
<número-de-issue>-<tipo>-<descripción-corta>
```

El número es el de la issue. El tipo es el de conventional commit de la tarea (`feat`, `fix`, `docs`, `chore`…). La descripción la lee el agente en la issue, en inglés, con pocas palabras y guiones.

Ejemplo: la issue 184, «Count users by gender», da la rama `184-feat-count-users-by-gender`.
