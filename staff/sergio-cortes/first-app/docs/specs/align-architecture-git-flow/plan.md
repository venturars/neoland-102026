# Plan — alinear la arquitectura con el flujo de git

Issue: #1147.

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. No hay
firma. No hay SQL. No hay paquete de Node, así que no hay sección de
Socket.

## Decisión

Es una corrección de texto. El flujo de git de
`exercises/git-workflow-agent-template` sigue siendo la fuente de verdad.
La documentación de arquitectura de first-app se corrige para decir lo
mismo que el ejercicio.

No se reescribe `docs/specs/per-type-templates/`. Su texto de
arquitectura es histórico, y esta spec es la que manda desde ahora.

## Ficheros

Se toca solo `docs/ARCHITECTURE.md`, en el bloque del flujo de git.

No se tocan `docs/TREE.md`, `docs/CONSTITUTIONS.md`, `AGENTS.md`, los
agentes, las skills, las plantillas, las herramientas ni el código.

## Cambios en el bloque

Sustituir esta línea:

- `templates/issues/` lleva seis plantillas (`feat`, `fix`, `docs`,
  `refactor`, `test`, `chore`). En el comentario HTML van la regla del
  título, el tipo y el nombre de rama.

Por esta:

- `templates/issues/` lleva siete plantillas (`feat`, `fix`, `docs`,
  `refactor`, `test`, `chore`, `knowledge`). En el comentario HTML van la
  regla del título, el tipo y el nombre de rama.

Sustituir esta línea:

- `templates/pull-request/` lleva seis plantillas del mismo tipo. El
  cuerpo comparte secciones; la lista de comprobación cambia por tipo. La
  sección Issue es `Closes #`.

Por esta:

- `templates/pull-request/` lleva siete plantillas del mismo tipo. El
  cuerpo comparte secciones; la lista de comprobación cambia por tipo. La
  sección Issue es `Closes #`.

Sustituir esta línea:

- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros
  nombrados; el mensaje nombra el fichero o la función y el cambio.

Por esta:

- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros
  nombrados; la primera línea del mensaje dice qué cambió, sin rutas de
  fichero, y el cuerpo nombra las funciones o ficheros implicados.

Las dos plantillas de `knowledge`, una de issue y otra de pull request,
ya existen en `templates/` y son iguales a las del ejercicio. Solo cambia
el texto de la arquitectura.

## Comprobación

- Contar `templates/issues/` y `templates/pull-request/`: siete en cada
  una, con `knowledge_issue.md` y `knowledge-pull-request.md`.
- Comparar la regla del mensaje con `skills/commit-changes/SKILL.md`: la
  misma.
- `pnpm run lint` y `pnpm run format` no aplican a un Markdown sin código,
  así que no se ejecutan para este cambio.

## Constitución y reglas de la carpeta

- Un desarrollo nuevo empieza por la issue: #1147.
- La spec abre con `Issue: #1147`, y la carpeta lleva nombre en kebab-case
  sin número.
- No hay código, paquetes, SQL ni `logic/`. Las reglas de implementación no
  aplican.
- Hay una parada tras la spec y el plan. No hay `tasks.md` hasta que una
  persona lo apruebe.
- No hay dos fuentes de verdad en conflicto: el ejercicio manda, y esta
  spec lo aplica. No hay pregunta abierta.
