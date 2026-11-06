# Plan: Recoger los últimos cambios del flujo de git

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md). Sin cambios en la app ni en la tabla. Sin paquetes nuevos: el script usa GitHub CLI (`gh`), que ya está instalado (2.102.0) y con sesión iniciada, y no es una dependencia del proyecto. No hace falta Socket (principio 8).

## Ficheros
```
tools/create-pr-base-staging.sh        NUEVO: abre la pull request en un solo paso
skills/create-pr-base-staging/SKILL.md el script en vez del MCP
agents/create-pr.md                    un solo paso, y qué hacer si ya existe
skills/create-draft/SKILL.md           solo para una pull request que ya existe
agents/help-me-to-think.md             varias preguntas por ronda
skills/grill-me/SKILL.md               varias preguntas por ronda
skills/grill-with-docs/SKILL.md        varias preguntas por ronda
agents/git-workflow-agent.md           Empezar con la issue escrita, comprobar cada paso, historial al pensar
skills/commit-changes/SKILL.md         el mensaje técnico
```
`docs/TREE.md` no cambia: solo nombra la carpeta `tools/`.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Script | `tools/create-pr-base-staging.sh RAMA TITULO CUERPO`. Comprueba que está en un repositorio git, que llegan los tres argumentos sin estar vacíos y que `CUERPO` es un fichero que se puede leer. Luego `gh pr create --base staging --head RAMA --title TITULO --body-file CUERPO --draft --assignee "@me"` | Draft y asignación salen en la misma llamada. `@me` es quien tiene la sesión de `gh` |
| Ruta del cuerpo | El script guarda la ruta absoluta del fichero antes de ir a la raíz del repositorio | Como los demás scripts de `tools/`, trabaja desde la raíz. Así una ruta relativa sigue sirviendo |
| Errores | Mensaje en español a stderr y código 1, como los demás scripts. Si `gh` falla, sale con su código | El agente no inventa la URL |
| Comando en la skill | `./tools/create-pr-base-staging.sh "[RAMA]" "[TITULO]" "[CUERPO]"` | Las rutas de first-app son `./tools/...` |
| Pull request que ya existe | La skill mira antes si la rama ya tiene una hacia `staging`. Si la tiene, no llama al script: `create-pr` actualiza el cuerpo y usa `assign-author` y `create-draft` | `gh pr create` falla si ya existe |
| `assign-author` y `create-draft` | Se quedan, solo para ese caso. En el orquestador, el paso 5 de Empezar solo nombra `create-pr-base-staging` | Lo normal es un paso. Las dos skills arreglan una pull request que ya estaba |
| Rondas de preguntas | Cada subagente devuelve todas sus preguntas con su respuesta recomendada y se para. El orquestador espera y vuelve a llamarlo con las respuestas. Si no puede retomar el mismo, le pasa el historial entero | Un subagente no puede esperar al alumno. Así nadie pregunta dos veces lo mismo |
| Orquestador | En «Validación», dos frases más: issue escrita con cambios por hacer es Empezar, y para el resto de pasos se piden los datos que falten. «Dejarla escrita» sigue con Empezar si vienen cambios. El error de subagente o skill pasa a «Comprobación de pasos» | Lo que añade el curso. Lo que ya dice lo mismo no se reescribe |
| Mensaje de commit | Una regla más en `commit-changes/SKILL.md`. `tools/commit-changes.sh` no cambia | La regla es para quien escribe el mensaje, no para el script |
| Texto | Escrito para first-app, con sus nombres de agentes y skills | El flujo es el del curso; el texto es de este proyecto |

## Cómo se prueba
- **Script, sin crear nada:** sin argumentos, con un argumento vacío y con un cuerpo que no existe, termina con código 1, su mensaje y sin pull request nueva.
- **Script, de verdad:** una rama de prueba `959-chore-check-create-pr-script` desde `staging`, con el commit vacío `chore: open #959` y subida. El script abre la pull request con un cuerpo de prueba. Se comprueba con `gh pr view` que la base es `staging`, que está en draft y que está asignada a SergioMoras. Después se cierra con `gh pr close --delete-branch` y se borra la rama local. Será una pull request visible en el repo durante unos segundos, sin revisores.
- **Texto:** leer cada fichero y compararlo con la spec. Los agentes, skills y scripts que nombran existen.
- `git diff --stat` solo muestra los ficheros del plan.
