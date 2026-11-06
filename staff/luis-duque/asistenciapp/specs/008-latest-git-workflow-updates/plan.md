# Plan 008 · Lo último del flujo de git

Spec: [spec.md](spec.md), aceptada el 2026-11-06. Issue #1163. La misma issue cubre first-app; su plan está en `staff/luis-duque/first-app/docs/specs/latest-git-workflow-updates/plan.md`.

No hay código de aplicación nuevo, ni dependencia nueva, ni cambios en tests. El paso de lista no se toca. La constitución no se enmienda. Solo entra lo último de `exercises/git-workflow-agent-template` en `staging`. Los textos de «Cuándo actuar» y las paradas SDD se quedan.

Toda skill con comando apunta a `./staff/luis-duque/asistenciapp/tools/…`, no a `exercises/git-workflow-agent-template`. El archivo local de la caché sigue en la raíz del repositorio, ignorado.

## Ficheros

Se crea `tools/create-pr-base-staging.sh`, copiado del template. Abre la pull request contra `staging`, en draft y asignada a quien está autenticado, en una sola llamada a `gh`.

Se crea `tools/github-cache.mjs`, copiado del template. Se crea `skills/github-cache/SKILL.md`. El comando es `node ./staff/luis-duque/asistenciapp/tools/github-cache.mjs`.

Se crean `templates/issues/knowledge_issue.md` y `templates/pull-request/knowledge-pull-request.md`, copiados del template.

Se toca `skills/create-pr-base-staging/SKILL.md`. Una invocación deja la PR en draft y asignada. El comando apunta a `./staff/luis-duque/asistenciapp/tools/create-pr-base-staging.sh`. `assign-author` y `create-draft` siguen por si hay que actualizar una PR que ya existe.

Se toca `agents/create-pr.md`. Crear o actualizar usa esa skill. Pedir revisión resuelve nombres con `github-cache`, pide las revisiones con `assign-reviewers` y saca la PR de draft. No enlaza la issue.

Se toca `skills/assign-reviewers/SKILL.md`. Recibe logins ya resueltos. Comprueba en vivo que siguen siendo colaboradores. No inventa un login.

Se toca `agents/git-workflow-agent.md`. Se quedan «Cuándo actuar» y no saltar las paradas. Entra: si el problema, el resultado, el alcance y cómo comprobarlo ya están claros, se deja escrita la issue; si la issue ya está y hay cambios, el momento es Empezar; pedir revisión se delega en `create-pr`; se confirma cada paso antes del siguiente. Empezar llama a `create-pr` con `create-pr-base-staging`.

Se toca `agents/help-me-to-think.md`, `skills/grill-with-docs/SKILL.md` y `skills/grill-me/SKILL.md`. Las preguntas que hagan falta salen de una vez, cada una con una respuesta recomendada, y se espera.

Se toca `skills/commit-changes/SKILL.md`. El tipo `knowledge` entra. El mensaje puede llevar desglose y pie. El comando sigue siendo `./staff/luis-duque/asistenciapp/tools/commit-changes.sh`.

`tools/create-branch-from-staging.sh` y `skills/create-branch-from-staging/SKILL.md` ya admiten el tipo de la plantilla. No se reescriben.

Se toca `AGENTS.md` §7. Entra la fila de `008-latest-git-workflow-updates`. No se borra ninguna fila.

No se tocan `docs/CONSTITUTION.md`, `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt`, `pytest.ini` ni `README.md`. No se reescribe la spec 006 ni la 007. No se toca first-app desde este plan.

## Decisiones

1. Scripts y skills de asistenciapp llaman a `staff/luis-duque/asistenciapp/tools/`. No quedan rutas al template.
2. `github-cache.mjs` y `create-pr-base-staging.sh` se copian a `tools/` de asistenciapp.
3. No se sustituye el orquestador entero.

## Comprobación de la constitución

| Condición | Cómo lo cumple este plan |
| --- | --- |
| P1 Independiente de la plataforma | No toca el registro de asistencia ni integraciones. |
| P2 Simplicidad primero | Copia piezas nuevas del curso y mezcla textos. No añade capas de producto. |
| P3 Dependencias mínimas | No se añade ningún paquete. `requirements.txt` no se toca. La caché usa Node y `gh` del curso. |
| P4 Privacidad mínima | No se guarda ni se envía ningún dato de alumnos. La caché no guarda correos. |
| P5 Accesible en móvil | No cambia HTML, CSS ni JavaScript. |
| P6 Todo en español | Spec, plan y textos tocados van en español. |
| §5 Calidad | No hay comportamiento de producto. La verificación es leer ficheros (CA-01 a CA-07). `pytest` no aplica a este cambio. |
| §6 Seguridad | No se tocan códigos de asistencia ni validación de registros. |
| §4 SDD | La spec está aceptada. Este plan es el paso siguiente. Las tareas y la implementación esperan. |
| §7 Alcance | Este plan solo edita dentro de `staff/luis-duque/asistenciapp/`. first-app va en su plan. |

## Cómo se verifica

1. Al empezar un cambio, la PR nace en draft y asignada en un paso (CA-01).
2. Al pedir revisión, se reutilizan alias; un nombre ambiguo se pregunta (CA-02).
3. Hay plantillas `knowledge`. El commit admite ese tipo (CA-03, CA-04).
4. Las preguntas de pensar salen de una vez si hacen falta; si ya está claro, se deja escrita la issue (CA-05).
5. Los textos de pedido por el flujo y de paradas siguen (CA-06).
6. `app.py`, `asistencia/`, `static/`, `tests/` y `docs/CONSTITUTION.md` no cambian (CA-07).
