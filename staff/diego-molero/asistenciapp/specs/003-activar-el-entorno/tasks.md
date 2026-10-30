# Tareas 003 · Activar el entorno y arrancar la aplicación

> Estado: **Implementadas y comprobadas; entrega autorizada** · Versión: 1.1 · Creado: 2026-10-23 · Autorizado: 2026-10-23 · Implementado: 2026-10-23
>
> Spec: [spec.md](spec.md) v1.0 · Plan: [plan.md](plan.md) v1.0 · Tarea: [#255](https://github.com/venturars/neoland-102026/issues/255)

Estas tareas se redactan después del plan y antes de implementar, bajo la autorización anticipada de la persona responsable. Se marcarán al comprobar cada resultado; las pruebas constarán con su ejecutor real.

## 1. Implementación

- [x] **T01 · Separar activación y arranque en el README.**
  - Renombrar el apartado 2, añadir el apartado 3 con su separador, renumerar los siguientes y corregir la referencia a cerrar la aplicación en problemas frecuentes.
  - Conservar los comandos, rutas y demás instrucciones.
  - **Cubre:** CA-01, CA-02, CA-03 y CA-04; plan §1.
  - **Hecha cuando:** el diff del README contiene únicamente esos cambios y los apartados son coherentes.

## 2. Comprobaciones

- [x] **T02 · Revisar los cuatro criterios y la conservación del contenido.**
  - Leer los apartados de activación y arranque, comprobar la numeración del 1 al 8 y revisar la referencia interna al cierre.
  - Comparar los comandos, el contenido de los apartados y el resto de los archivos con `df9f760`; las specs 001 y 002, la constitución y el programa conservan su contenido.
  - Comprobar UTF-8, enlaces locales y espacios finales en el README y los tres documentos de esta spec. Repetir la comprobación documental después de la actualización de seguimiento del manual.
  - **Cubre:** CA-01 a CA-04; plan §2.
  - **Hecha cuando:** la revisión y las comparaciones confirman el alcance previsto; registrar la evidencia en resultados.

- [x] **T03 · Ejecutar las pruebas existentes.**
  - Ejecutar `.\.venv\Scripts\python.exe -X utf8 -m pytest` desde la carpeta de la aplicación y registrar ejecutor, fecha y resultado exacto.
  - **Cubre:** comprobación de regresión del plan §2 y calidad §5 de la constitución; complementa la conservación comprobada en CA-04.
  - **Hecha cuando:** la suite pasa y su salida real queda registrada.

## 3. Cierre y entrega

- [x] **T04 · Registrar la spec 003 en el manual.**
  - Añadir únicamente su fila de seguimiento en `AGENT.md`, con las verificaciones realizadas y las revisiones pendientes. Conservar el resto del manual y las filas anteriores.
  - **Cubre:** trazabilidad del plan §1 y §4.
  - **Hecha cuando:** el estado refleja las comprobaciones reales y la autorización de entrega, sin atribuir revisiones de compañeros pendientes.

- [x] **T05 · Registrar la implementación en la spec.**
  - Actualizar estado e historial de `spec.md` con la fecha real y los resultados; conservar la aprobación de la spec y la autorización anticipada de las fases.
  - **Cubre:** trazabilidad de CA-01 a CA-04 y entrega del plan §4.
  - **Hecha cuando:** la spec refleja la implementación comprobada y la entrega autorizada, con merge pendiente.

Después se ejecutarán el commit, el push, la actualización de la PR y la solicitud de revisión a las dos personas revisoras autorizadas, conforme a la autorización recibida. El merge queda fuera de esta entrega.

## 4. Resultados

| Comprobación | Estado | Evidencia |
| --- | --- | --- |
| CA-01 a CA-04 y contenido conservado | Comprobados por el agente, 2026-10-23 | Ocho apartados en orden; activación separada del arranque y dos modalidades conservadas. Todos los bloques de comandos coinciden con `df9f760`. Se conserva el resto del contenido, salvo títulos, separador, numeración y referencia al cierre. Los otros 30 archivos iniciales conservan su contenido; el manual solo permite su fila de seguimiento 003. |
| UTF-8, enlaces y formato | Comprobados por el agente, 2026-10-23 | Los cinco documentos se leen como UTF-8, sin espacios finales y con enlaces locales válidos; comprobación final realizada tras actualizar el seguimiento. |
| Suite existente | Comprobada por el agente, 2026-10-23 | Python 3.14.7 y pytest 9.1.1: `77 passed in 1.30s` con el comando de T03, ejecutado localmente fuera del aislamiento. |
| Autorización de las fases y de la entrega | Recibida, 2026-10-23 | La persona responsable aprobó la spec y autorizó las fases restantes, commit, push, actualización de PR y solicitud de revisión, sin nuevas confirmaciones. |
| Revisión de compañeros e incorporación a `staging` | Pendiente | Revisiones autorizadas a las dos personas revisoras autorizadas; sus aprobaciones y el merge requieren las condiciones del flujo de Git y autorización posterior para la incorporación. |

## 5. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Tareas redactadas bajo autorización anticipada | Desglosar el plan en cinco pasos verificables antes de implementar |
| 1.1 | 2026-10-23 | T01 a T05 realizadas y comprobadas | CA-01 a CA-04 verificados, comandos y contenido conservados, suite superada y entrega autorizada |
