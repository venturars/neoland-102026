# Tareas — el pedido entra por el flujo

Plan aceptado. Cada paso comprueba el texto. Si ya está, no lo reescribe. Si falta, lo completa.

1. Abre `AGENTS.MD`.
   Un pedido que cambie el proyecto entra primero por el flujo de git. Si la tarea ya está en curso, sigue en su fase. Se piensa la tarea solo si es nueva. Una pregunta, o un mensaje que no cambie nada, no abre el flujo.
   Pedir el cambio no escribe `spec.md` como primera respuesta. Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión.
   El fichero se puede leer.

2. Abre `docs/CONSTITUTIONS.MD`, sección «Desarrollos».
   El pedido entra primero por `agents/git-workflow-agent.md`. Una pregunta no abre el flujo. Pedir el cambio no escribe `spec.md` como primera respuesta.
   El desarrollo abierto es `docs/specs/workflow-first/`. La lectura de la spec, del plan y de las tareas sigue.
   El fichero se puede leer.

3. Abre `agents/git-workflow-agent.md`.
   «Cuándo actuar» mete en el flujo un pedido que cambie el proyecto. Si la tarea ya está en curso, sigue en su fase. Se piensa la tarea solo si es nueva. Con la rama abierta, la fase siguiente es la spec. Una pregunta no entra.
   Sigue sin saltar la parada de la spec, la del plan ni la de las tareas, y sin pasar el trabajo a staging.
   El fichero se puede leer.

4. Lee `package.json`, `pnpm-lock.yaml`, `src/logic`, `src/queries`, `src/db`, `src/clients` y el `AGENTS.md` de la raíz del repositorio.
   Siguen igual que antes de estas tareas.
   No hay paquete nuevo ni SQL nuevo.
   Pasar el trabajo a staging queda fuera.
