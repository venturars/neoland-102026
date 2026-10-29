# Plan — subagentes antes de la spec

Issue: #575.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma. No hay SQL. No hay paquete de Node.

La issue #575 y el pedido de implementarla ya eligen el camino. El
orquestador va antes que la spec. El subagente del momento corre como
un agente aparte. Las paradas de «Orden» se quedan después de la issue.

## Ficheros

No se crean ficheros de código. Esta spec y este plan son los únicos
ficheros nuevos.

Se tocan:

- `AGENTS.md`
- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `docs/CONSTITUTIONS.md`
- `docs/ARCHITECTURE.md`

No se tocan `logic/`, `queries/`, `db/`, `clients/`, `package.json` ni
las specs ya escritas. La issue #574 se deja como está. No se mueve
`agents/` a otra carpeta. Esos ficheros siguen siendo el encargo del
subagente.

## Orden

En `AGENTS.md`, el párrafo de arriba sigue mandando seguir
`agents/git-workflow-agent.md`. «Orden» queda así.

```
Lo primero es el orquestador. Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea docs/specs/<nombre>/ antes de que exista el número de issue. <nombre> va en kebab-case.

Con la issue escrita, el proceso siguiente escribe spec.md y plan.md. La spec abre con Issue: #N. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay tasks.md.

Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe tasks.md. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta tasks.md y no inventa pasos.
```

La primera regla pasa de «empieza por `docs/specs/<nombre>/`» a
«empieza por el orquestador y sigue «Orden»». El resto de las reglas
no cambia.

## Llamar

En `agents/git-workflow-agent.md`, llamar es la herramienta Task. El
tipo es `generalPurpose`. La descripción es el nombre del subagente.
El encargo es la ruta del fichero de ese subagente y lo que pidió el
alumno. El padre espera y dice lo que el subagente devuelve. No llama
a la skill ni al MCP de ese momento.

Pensar la tarea llama a `agents/help-me-to-think.md`. Dejarla escrita
llama a `agents/create-issue.md`. Empezar, guardar un trozo y pedir
revisión siguen el orden que ese fichero ya tiene, cada paso con su
agente o su skill, también como agente aparte.

En `agents/help-me-to-think.md`, la entrevista sigue siendo una
pregunta cada vez. El subagente devuelve esa pregunta al orquestador.
No espera él la respuesta del alumno y no escribe ficheros.

## Guías

En `docs/CONSTITUTIONS.md`, la primera frase del desarrollo sigue
pasando por `spec.md`, `plan.md` y `tasks.md`, y un humano lee cada
uno antes de seguir. Se añade que antes está la issue, escrita por su
subagente, y que la spec abre con `Issue: #N`.

En `docs/ARCHITECTURE.md`, el punto de `agents/git-workflow-agent.md`
queda así. El resto no cambia.

```
agents/git-workflow-agent.md reconoce el momento y llama al subagente como un agente aparte. El padre no hace ese trabajo.
```

## Errores

No hay un mensaje nuevo.

| Fallo de la spec                         | Mensaje                                          |
| ---------------------------------------- | ------------------------------------------------ |
| La spec aparece antes de la tarea escrita | no es un fallo de la lista: el orden no está arreglado |
| El padre hace el trabajo del subagente   | no es un fallo de la lista: el orden no está arreglado |
| No se ve qué subagente ha corrido        | no es un fallo de la lista: el orden no está arreglado |

## Decisión

Se sigue la issue #575. No queda una pregunta abierta. Las tareas se
escriben cuando una persona haya leído esta spec y este plan.
