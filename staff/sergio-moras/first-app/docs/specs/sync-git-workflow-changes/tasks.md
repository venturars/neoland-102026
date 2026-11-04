# Tasks: Recoger los últimos cambios del flujo de git

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El script
- [ ] Crear `tools/create-pr-base-staging.sh` con las comprobaciones y la llamada a `gh` del plan, ejecutable.
- [ ] Sin argumentos, con un argumento vacío y con un cuerpo que no existe: código 1 y su mensaje.

## T2. Abrir la pull request
- [ ] `skills/create-pr-base-staging/SKILL.md`: el comando del script, sus argumentos y qué hacer si la pull request ya existe.
- [ ] `agents/create-pr.md`: un solo paso con `create-pr-base-staging`; `assign-author` y `create-draft` para una que ya existe; el formateo con la persona asignada.
- [ ] `skills/create-draft/SKILL.md`: pasa a draft una pull request que ya existe.

## T3. Pensar la tarea
- [ ] `agents/help-me-to-think.md`: varias preguntas por ronda con su respuesta recomendada, se para y espera que lo vuelvan a llamar.
- [ ] `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`: lo mismo en «Cómo entrevistar».

## T4. Orquestador
- [ ] `agents/git-workflow-agent.md`: Empezar con la issue escrita, el historial al pensar, «Dejarla escrita» sigue con Empezar, el paso 5 solo con `create-pr-base-staging` y «Comprobación de pasos».

## T5. Commits
- [ ] `skills/commit-changes/SKILL.md`: la regla del mensaje técnico.

## T6. Comprobación
- [ ] La rama de prueba, la pull request del script con base `staging`, en draft y asignada a SergioMoras, y después cerrada con la rama borrada.
- [ ] Leer cada fichero y compararlo con la spec. Lo que nombran existe.
- [ ] `git diff --stat` solo muestra los ficheros del plan.
