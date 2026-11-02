# Adaptar el flujo de git

Issue: #677.

Quien trabaja en ChromaDB usa el flujo de git del curso dentro de esta
app: pensar la tarea, dejarla escrita, empezarla, guardar un trozo y
pedir revisión. El stack vive en `staff/raul-santamaria/ChromaDB/`, no
en la raíz del monorepo.

La intervención humana explícita es al crear o aprobar la issue. La
issue dice que hay que implementar el cambio y que dos personas lo
revisan.

Con la issue ya creada, el agente escribe `docs/specs/<nombre>/spec.md`,
`plan.md` y `tasks.md`, avanza con git e implementación sin paradas de
revisión intermedia. El único corte automático es la llave en
implementación (developer/tester), por ejemplo fallo en la ronda 9 con
`report.md` y espera de la misma contraseña.

Antes de pedir revisión el flujo se para: no se asignan revisores ni se
quita el draft hasta que la persona lo pide. Tras pedir revisión, sin
corte por llave, la pull request queda abierta y lista, con dos
revisores según la issue.

Entra una tarea de esta app. Sale la issue con título en inglés y cuerpo
en español. Al empezar, la rama sale de `staging`. Al guardar, entra ese
trozo. Enlazar la pull request con la issue no cierra la issue por sí
solo. La spec abre con el número de issue.

Ejemplo: queda escrita la integración del stack git. La rama sale de
staging. Se copian agents, skills, tools, templates y MCPS. Se
reescribe `AGENTS.md` con git, implementación y parada antes de pedir
revisión. Se suben los cambios. El flujo se para. La persona pide
revisión nombrando a dos compañeros. La pull request deja de ser borrador
y lleva esos revisores.

No hay comprobación contra una lista «Errores». Si la rama no sale de
staging, si el stack queda fuera de esta carpeta, si la spec nace sin
issue, si se pide revisión sin parada previa, si se saltan las reglas de
llave en implementación, o si se copian las paradas de Orden de
mi-primer-proyecto, el flujo no está adaptado.

Queda fuera cambiar la lógica RAG, `src/`, los scripts de pipeline,
`chromadash/`, embeddings e índice, `requirements.txt` salvo
documentar rutas, las specs ya escritas y `skills/python-docs/`.
