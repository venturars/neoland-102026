# Plan 007 · El pedido entra por el flujo

Spec: [spec.md](spec.md), aceptada el 2026-11-05. Issue #1038.

No hay código de aplicación nuevo, ni dependencia nueva, ni cambios en tests. Las comprobaciones son leer ficheros. El paso de lista no se toca. La constitución no se enmienda.

## Ficheros

Se toca `AGENTS.md`.

Al inicio, un pedido que cambie este proyecto entra primero por `agents/git-workflow-agent.md`. Si ya nombra el momento, se usa ese. Si la tarea ya está en curso, el pedido sigue en su momento o en su fase. Se piensa la tarea solo si es nueva. Una pregunta sobre el proyecto, o un mensaje que no provoque un cambio, se responde y no abre el flujo. Ese flujo no quita las paradas del flujo SDD (§2). Pedir el cambio no escribe `spec.md` como primera respuesta. Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión.

En §1, la primera respuesta a un pedido que cambie el proyecto es un momento de ese flujo, no la lectura obligatoria y no `spec.md`. La lectura sigue cuando el flujo ya está en un momento y toca una fase.

En §2, las cuatro fases siguen en orden y no son la primera respuesta. Sin la fase en curso aprobada no se escribe el cambio.

En §7 entra una fila de `007-workflow-first`: fase 2, plan, pendiente de lectura. Issue #1038.

Se toca `agents/git-workflow-agent.md`, en «Cuándo actuar». Un pedido que cambie algo dentro de este proyecto entra en el flujo. Si nombra un momento, ese es el momento. Si la tarea ya está en curso, sigue en su fase. Se piensa la tarea solo si es nueva. Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión. Una pregunta, o un mensaje que no provoque un cambio, no entra. Sigue sin saltar la parada de la spec, la del plan ni la de las tareas, y sin hacer merge a `staging`.

No se toca `docs/CONSTITUTION.md`. No se tocan `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt`, `pytest.ini` ni `README.md`. No se reescribe la spec 006. No se toca el `AGENTS.md` de la raíz del repositorio.

## Decisiones

1. El flujo de git va antes de las fases SDD. No las sustituye. El orden spec, plan, tasks e implementación se queda.
2. Una pregunta y un mensaje que no cambia el proyecto se responden fuera del flujo.
3. La constitución y la spec dicen lo mismo: no hay implementación sin las paradas, y este cambio no enmienda los principios.

## Comprobación de la constitución

| Condición | Cómo lo cumple este plan |
| --- | --- |
| P1 Independiente de la plataforma | No toca el registro de asistencia ni integraciones. |
| P2 Simplicidad primero | Cambia dos textos de trabajo y añade esta spec. No añade capas. |
| P3 Dependencias mínimas | No se añade ningún paquete. `requirements.txt` no se toca. |
| P4 Privacidad mínima | No se guarda ni se envía ningún dato de alumnos. |
| P5 Accesible en móvil | No cambia HTML, CSS ni JavaScript. |
| P6 Todo en español | Spec, plan y textos tocados van en español. |
| §5 Calidad | No hay comportamiento de producto. La verificación es leer ficheros (CA-01 a CA-06). `pytest` no aplica a este cambio. |
| §6 Seguridad | No se tocan códigos de asistencia ni validación de registros. |
| §4 SDD | La spec está aceptada. Este plan es el paso siguiente. Las tareas y la implementación esperan. El flujo de git no salta esas paradas. |
| §7 Alcance | Solo se edita dentro de `staff/luis-duque/asistenciapp/`. |

## Cómo se verifica

1. Pedir un cambio. La primera respuesta es un momento del flujo de git y no crea `spec.md` (CA-01, CA-02).
2. Preguntar algo del proyecto, y mandar un mensaje que no lo cambie. Se responde, no arranca el flujo y no crea `spec.md` (CA-03, CA-04).
3. Leer `AGENTS.md` y `agents/git-workflow-agent.md`. Un cambio entra por el flujo y las paradas siguen (CA-05).
4. Confirmar que `requirements.txt`, `app.py`, `asistencia/`, `static/`, `tests/` y `docs/CONSTITUTION.md` no cambian por este plan (CA-06).

## Ya escrito

El texto de `AGENTS.md` y de `agents/git-workflow-agent.md` ya está en la rama, salvo la fila de §7. Las tareas, cuando se pidan, lo comprueban y solo completan lo que falte.
