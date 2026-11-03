# Spec: Flujo de git en first-app

Issue: #694.

## Qué queremos conseguir
Que el trabajo de git de esta app siga siempre el mismo flujo del curso, escrito dentro de la app. La persona dice con sus palabras qué quiere y el agente hace el momento que toca, sin que haya que explicarle cada vez la rama base, el borrador o el enlace con la issue.

## Cómo se usa
La persona dice qué quiere. El agente reconoce el momento:
- **Pensar la tarea**: hace preguntas, una cada vez, hasta que la tarea queda clara.
- **Dejarla escrita**: crea la issue con la plantilla de su tipo, asignada a quien está autenticado.
- **Empezarla**: adelanta `staging`, crea la rama desde `staging`, hace el commit vacío `chore: open #N`, sube la rama, abre la pull request en draft hacia `staging` y la enlaza con la issue.
- **Guardar un trozo**: hace el commit solo con los ficheros de ese trozo y lo sube.
- **Que la revisen**: asigna los revisores que nombre la persona y saca la pull request de draft.

El agente no espera un sí entre los pasos de un momento. Al terminar enseña lo que hizo: número de issue, rama, commit o URL de la pull request.

## Reglas de negocio
- El flujo es el de `exercises/git-workflow-agent-template`, sin cambios en su comportamiento.
- `AGENTS.md` de la app dice que el trabajo de git sigue ese flujo.
- El agente no hace el merge a `staging` ni cierra la issue. La issue se cierra con el merge, por la línea `Closes #N`.
- No se admite el force push ni añadir todo el directorio en un commit.
- Funciona en Windows con Git Bash.

## Casos a cubrir
- Cada script de `tools/` se ejecuta desde la app y responde.
- Un script con datos que no valen se para y dice por qué.
- El agente tiene acceso a GitHub.

## Fuera de alcance
- Cambiar el comportamiento de la plantilla.
- La regla de Socket para paquetes: es otra tarea.
- Cambiar el resto de `AGENTS.md`, la constitución o el código de la app.
- Llevar el flujo a AsistenciApp o a ChromaDB.
