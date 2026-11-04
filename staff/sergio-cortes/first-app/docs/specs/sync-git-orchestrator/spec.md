# Sincronizar el orquestador git

Issue: #845.

El orquestador de git de esta app debe coincidir con el del ejercicio
del flujo de git en su versión actual. Ese fichero elige el momento,
valida si la tarea está lista antes de crear la issue, y en «Empezar»
exige rama desde `staging` y pull request en draft antes de cambios en
el proyecto. Las paradas del SDD de esta app no se quitan.

Lo usa quien construye la app con IA.

Entra una petición de trabajo git en first-app. Sale el mismo criterio
que en el ejercicio: estado real de la tarea, no solo las palabras del
prompt; entrevista solo si hay dudas; cambios de proyecto solo con rama
nueva y PR en draft ya abiertas.

Ejemplo: el alumno pide crear la issue con el alcance ya claro. El
orquestador la crea y explica por qué no hace falta entrevista. Si pide
implementar sin rama, el momento es «Empezar» antes de tocar specs o
código.

No hay un fallo de la lista «Errores». Si first-app sigue con la
validación antigua, si «Empezar» no deja escrito rama y draft antes de
cambios, o si desaparece una parada de «Orden», el orquestador no está
sincronizado.

Queda fuera cambiar las reglas de negocio, la base de datos, los
clientes, los paquetes, las plantillas por tipo ya alineadas (#737), las
rutas de script en skills (`staff/sergio-cortes/first-app/tools/`),
`AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md` y el contenido de
otras specs ya escritas.
