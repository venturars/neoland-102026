Issue: #1101

# Tareas de verificación de Bruno para Express

Spec y plan aprobados. Rama de ejecución: `1101-chore-bruno-express-users`,
en el worktree `.codex-bruno-1101`. El checkout de Swagger permanece separado.

Spec, plan y tareas aprobados; ejecución autorizada por la persona usuaria.
Posteriormente se autorizó un commit local de spec, plan y tareas.
El push sigue pendiente de autorización.

## Secuencia autorizada

1. [x] Contrastar la [colección existente](../express-rest-client/bruno/bruno.json)
       con los contratos del [plan](plan.md), sus variables y sus tests.
       Resultado: cobertura identificada de 25 peticiones online y cinco offline.
2. [x] Revisar la [guía Windows](../express-rest-client/bruno.md) contra el plan.
       Resultado: pasos reproducibles para PowerShell y Bruno en VS Code,
       reutilizando herramientas existentes, sin instalar paquetes ni modificar la API.
3. [x] Preparar la copia temporal descrita por la guía, sin SQLite personal.
       Resultado: ensayo con datos ficticios, SQL en 43100 y Express en 3001,
       puertos libres comprobados y procesos personales conservados.
4. [x] Ejecutar únicamente las 25 peticiones online en el runner de VS Code.
       Resultado: comprobaciones de operaciones, errores y conservación de usuarios
       registradas con sus resultados reales, incluida la lista final vacía.
5. [x] Detener solo el SQL del ensayo y ejecutar las cinco peticiones offline.
       Resultado: cinco respuestas 500 con los mensajes previstos comprobadas;
       ejecución completada y procesos del ensayo cerrados.
6. [x] Registrar en este documento fecha, entorno y resultados de esta ejecución.
       Resultado: evidencia nueva distinguida de la [evidencia histórica](../express-rest-client/verification.md),
       con fallos o limitaciones explícitos y sin atribuir ensayos no realizados.

## Condición de parada

Si se detecta una carencia, registrar el hallazgo y proponer el delta concreto
en el plan; detenerse antes de corregir la colección o la guía y solicitar
la aprobación correspondiente. No duplicar, trasladar ni ampliar el material.
Una propuesta que añada o elimine archivos incluirá su impacto en
[TREE.md](../../TREE.md) y [ARCHITECTURE.md](../../ARCHITECTURE.md).

## Evidencia nueva — 5 de noviembre de 2026

Registro inicial histórico, superado por las continuaciones y resultados
documentados más abajo.

Entorno: Windows/PowerShell, Node `v24.22.0`, extensión instalada
`bruno-api-client.bruno-6.0.0`. Rama `1101-chore-bruno-express-users`.

- Tarea 1: revisión estática de las 30 peticiones y del cliente Express.
  Se confirmaron 25 online y cinco offline, secuencia Ada/Grace, variables
  `userId`, `createdAt`, `otherId`, `otherUser` y `missingId`, cinco operaciones,
  PATCH parcial/completo/vacío, estados y mensajes, conservación del segundo
  usuario y lista final vacía. No se encontró una carencia que requiera cambios.
- Tarea 2: revisión estática de los pasos PowerShell y del runner de VS Code.
  La guía separa SQL de ensayo en 43100, mantiene Express en 3001, copia solo
  JavaScript y detiene únicamente procesos propios. La ejecución de la guía
  completa y sus resultados HTTP siguen pendientes; esta revisión no los acredita.
- Tarea 3: el chequeo previo de puertos abortó al intentar reservar 3001.
  Se confirmó `127.0.0.1:3001` en escucha, PID `37052`; 43100 no tenía listener.
  No se detuvo ese proceso, no se enviaron peticiones y no se creó una copia
  ni se arrancaron procesos de ensayo. El worktree no tiene `node_modules`;
  el checkout original sí conserva las dependencias instaladas. Para continuar
  sin instalar, la junction temporal puede apuntar a esas dependencias existentes.
- Tareas 4 y 5: no ejecutadas. Document Control devolvió cero sesiones
  conectadas y las herramientas disponibles no controlan el runner de la
  extensión en VS Code. No se instaló CLI ni se sustituyó por otro ejecutor.
- Tarea 6: evidencia registrada aquí. Se conservan API, colección, guía,
  manifiesto, lockfile y datos personales. No hubo commit ni push.

Para completar las tareas pendientes, dejar libre 3001 cuando corresponda,
seguir la guía con datos aislados y ejecutar desde Bruno en VS Code las
25 peticiones online; detener solo el SQL de ensayo, ejecutar las cinco
offline y cerrar los procesos del ensayo. Comunicar los dos resultados del
runner para registrar evidencia real. No hace falta aprobar otra vez estas tareas.

La evidencia histórica de 30 peticiones pasadas pertenece a la entrega anterior;
no es un resultado nuevo de esta rama. No se han marcado como realizadas
la preparación completa del ensayo ni las dos ejecuciones del runner.

## Continuación autorizada — 5 de noviembre de 2026

Se comprobaron libres y reservables 3001 y 43100 antes de preparar el ensayo.
La tarea 3 queda completada: copia aislada en
`E:/Users/987866/AppData/Local/Temp/first-app-rest-d2dd70c43184425aab188a2514694bc5`,
solo JavaScript y SQLite nueva, con junction a las dependencias existentes
del checkout original. Express 5.3.0 resuelve sin instalar paquetes.
Se creó la tabla `users` antes de arrancar HTTP. SQL en 43100, PID `32040`;
Express en 3001, PID `41780`. Ambos procesos siguen activos por petición
expresa de la persona usuaria, con logs `sql.stdout.log`, `sql.stderr.log`,
`http.stdout.log` y `http.stderr.log` dentro de la copia temporal.

La comprobación de arranque `GET http://127.0.0.1:3001/users` devolvió
HTTP 200 y `[]`. No se ejecutaron peticiones de la colección: tareas 4 y 5
siguen pendientes del runner de Bruno. La preparación pendiente descrita
en el registro anterior queda superada por esta continuación; su evidencia
histórica se conserva. No se modificaron API, colección, guía ni Swagger;
sin commit ni push.

## Resultado online aportado por la persona usuaria — 5 de noviembre de 2026

La persona usuaria ejecutó las 25 peticiones de `01-sql-online` en el runner
de Bruno en VS Code y aportó una captura con el resumen: **All 25, Passed 25,
Failed 0, Skipped 0**. Esta es evidencia observada en su captura, no una
ejecución realizada por el agente.

La captura muestra `delete-ada` con 204 y comprobaciones de estado y cuerpo
vacío correctas; `preserve-grace` con 200 y conservación correcta;
`delete-grace` con 204 y comprobaciones correctas; y `final-empty-list` con
200 y comprobaciones de estado y lista vacía correctas.

La tarea 4 queda completada. Este resultado supera el estado pendiente online
de los registros anteriores. La tarea 5 sigue pendiente: no hay evidencia
nueva de las cinco peticiones offline. No se modificaron procesos, API ni
otros archivos, y no hubo commit ni push.

## Resultado offline aportado por la persona usuaria — 5 de noviembre de 2026

La persona usuaria aportó una nueva captura del runner de Bruno en VS Code
con **All 5, Passed 5, Failed 0, Skipped 0** para `02-sql-offline`.
Se observan `list-sql-offline`, `find-sql-offline`, `update-sql-offline` y
`delete-sql-offline` con HTTP 500 y las comprobaciones de estado y mensaje
exacto correctas. `create-sql-offline` queda fuera de la vista; el resumen
acredita las cinco peticiones pasadas. La ejecución corresponde a la persona
usuaria, no al agente.

El total nuevo acreditado es **30 peticiones pasadas: 25 online y cinco
offline, sin fallidas ni omitidas**. La ejecución offline de la tarea 5 y
su registro en la tarea 6 quedan acreditados por esta captura; se supera
el estado pendiente offline de los registros anteriores.

La comprobación de procesos de solo lectura no encontró el PID SQL `32040`
y encontró el PID HTTP `41780` activo como `node`. No se detuvo ningún
proceso: en ese momento el cierre del HTTP de ensayo quedaba pendiente.
Ese estado quedó superado por la confirmación de cierre siguiente.
No se modificaron API, colección, guía, Swagger ni otros archivos;
sin commit ni push.

## Cierre del ensayo confirmado — 5 de noviembre de 2026

La persona usuaria confirmó el cierre de HTTP. La comprobación posterior
de solo lectura no encontró los PID `32040` y `41780` ni listeners en
los puertos 3001 y 43100. No se detuvieron ni iniciaron procesos.
La tarea 5 queda completada, incluido el cierre del ensayo, y las seis
tareas autorizadas están terminadas. Se conservan los resultados acreditados
por las capturas: 25 peticiones online y cinco offline pasadas, sin fallidas
ni omitidas. No hubo cambios en API o Swagger. El commit local de estos
tres documentos está autorizado; el push permanece pendiente.
