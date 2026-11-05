# Plan — el pedido entra por el flujo

Cumple `docs/specs/workflow-first/spec.md`. La spec está aceptada.

No hay función nueva, ni SQL, ni cliente. Las operaciones de los usuarios siguen igual. No se añade ningún paquete. Socket no aplica. Pasar el trabajo a staging queda fuera.

La constitución, el código y la spec dicen lo mismo: el pedido entra por el flujo de git, una pregunta no lo abre, y las paradas de la spec, el plan y las tareas siguen.

## Ficheros

Se toca `AGENTS.MD`. Al principio, un pedido que cambie este proyecto entra primero por `agents/git-workflow-agent.md`. Si ya nombra el momento, se usa ese. Si la tarea ya está en curso, el pedido sigue en su momento o en su fase. Se piensa la tarea solo si es nueva. Una pregunta sobre el proyecto, o un mensaje que no provoque un cambio, se responde y no abre el flujo. Ese flujo no quita las paradas de «Desarrollos». Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión.

En «Desarrollos», pedir el cambio no escribe `spec.md` como primera respuesta. Con la rama ya abierta, `spec.md` se escribe y se para, antes de pedir revisión. Luego `plan.md` y se para. Luego `tasks.md` y se para. El código sigue empezando solo cuando los tres ficheros están escritos y se pide ejecutar `tasks.md`.

Se toca `docs/CONSTITUTIONS.MD`, sección «Desarrollos». El pedido entra primero por `agents/git-workflow-agent.md`. Si la tarea ya está en curso, sigue en su fase. Se piensa la tarea solo si es nueva. Una pregunta, o un mensaje que no cambie el proyecto, no abre ese flujo. Pedir el cambio no abre el código y no escribe `spec.md` como primera respuesta. Con la rama abierta, siguen la lectura de `spec.md`, la de `plan.md` y la de `tasks.md`, antes de pedir revisión. El desarrollo abierto pasa a `docs/specs/workflow-first/`.

Se toca `agents/git-workflow-agent.md`, en «Cuándo actuar». Un pedido que cambie algo dentro de este proyecto entra en el flujo. Si nombra un momento, ese es el momento. Si la tarea ya está en curso, sigue en su fase. Se piensa la tarea solo si es nueva. Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión. Una pregunta, o un mensaje que no provoque un cambio, no entra. Sigue sin saltar la parada de la spec, la del plan ni la de las tareas, y sin pasar el trabajo a staging.

La misma regla en asistenciapp no se escribe desde este plan. Está en `staff/luis-duque/asistenciapp/specs/007-workflow-first/plan.md`.

No se toca `package.json`, `pnpm-lock.yaml`, `src/logic`, `src/queries`, `src/db` ni `src/clients`. No se toca el `AGENTS.md` de la raíz del repositorio.

## Firma

No hay función nueva.

## SQL

No hay SQL nuevo.

## Ya escrito

El texto de `AGENTS.MD`, `docs/CONSTITUTIONS.MD` y `agents/git-workflow-agent.md` ya está en la rama, salvo la frase del desarrollo abierto. Las tareas, cuando se pidan, lo comprueban y solo completan lo que falte.
