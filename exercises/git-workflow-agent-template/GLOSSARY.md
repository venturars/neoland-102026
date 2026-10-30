# Git workflow

El paquete acompaña al alumno desde que piensa una tarea hasta que pide revisión, con un único camino de ramas, commits y pull requests.

## Momentos

**Momento**:
Cada punto del trabajo en el que el orquestador interviene. Hay cinco: pensar la tarea, dejarla escrita, empezar, guardar un trozo y que la revisen.
_Evitar_: paso, fase, etapa

**Pensar la tarea**:
Momento en que una entrevista afila la idea del alumno hasta que se puede dejar escrita.

**Dejarla escrita**:
Momento en que la tarea queda como issue en GitHub.

**Empezar**:
Momento en que se abre la rama de trabajo, su commit vacío y la pull request en draft enlazada a la issue.

**Guardar un trozo**:
Momento en que una parte del trabajo queda en un commit y en el remoto.

**Que la revisen**:
Momento en que la pull request recibe revisores y sale de draft.

## Piezas

**Orquestador**:
La pieza que reconoce el momento y llama a quien toca. No ejecuta git ni GitHub por su cuenta.
_Evitar_: agente principal, coordinador

**Trozo**:
Un conjunto pequeño de ficheros nombrados que se guarda en un solo commit.
_Evitar_: cambio, parte, chunk

**Rama base**:
La rama de la que salen las ramas de trabajo y contra la que se abren las pull requests.
_Evitar_: staging (cuando se habla en general), rama principal

**Rama de trabajo**:
La rama `número-tipo-descripcion` de una issue.
_Evitar_: feature branch

**Commit vacío**:
El primer commit de una rama de trabajo, `chore: open #N`, que permite abrir la pull request antes de tener cambios.
_Evitar_: commit inicial

**Entrevista**:
La conversación de una pregunta cada vez con la que se piensa la tarea. Hay dos: con el repositorio y libre.
_Evitar_: grill
