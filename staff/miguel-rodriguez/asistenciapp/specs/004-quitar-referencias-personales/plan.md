# Plan 004 · Retirar referencias heredadas conservando los hechos

Estado: aprobado por Miguel el 2026-10-23. Creado el 2026-10-23.

Referencias: [spec aprobada](spec.md), [constitución 2.3](../../CONSTITUTION.md), [manual](../../AGENT.md), [issue #251](https://github.com/venturars/neoland-102026/issues/251) y [PR #252](https://github.com/venturars/neoland-102026/pull/252).

## Archivos y cambios

Modificar solo los pasajes siguientes, los estados y resultados de los documentos de 004 y su fila de seguimiento en `AGENT.md`. No cambiar la constitución ni las reglas actuales del manual. Sin código, pruebas persistentes, dependencias, configuración, instalaciones ni cambios de arquitectura.

| Documento | Sustitución prevista | Criterios |
| --- | --- | --- |
| `README.md` | Las dos líneas `cd staff/victor-chang/asistenciapp` pasan a `cd staff/<usuario>/asistenciapp`. Resto del README idéntico. | CA-01, CA-02, CA-05 |
| `specs/001-checkin-codigo/spec.md` | «Victor aceptó las propuestas» pasa a «las propuestas quedaron aceptadas»; «Victor detecta» pasa a «se detecta». Mantener fechas, versiones, criterios y el hecho detectado. | CA-02, CA-03 |
| `specs/001-checkin-codigo/plan.md` | El título «Decisiones tomadas por Victor» pasa a «Decisiones tomadas». Las cinco decisiones numeradas quedan idénticas. | CA-02, CA-03 |
| `specs/001-checkin-codigo/tasks.md` | Retirar «Victor, » de las cuatro notas fechadas. Cambiar «Victor lo prueba con su móvil» por «Se prueba con un móvil». Mantener el registro con datos móviles, apertura del panel, CSV, bloqueo de segundo registro, eliminación y sus fechas/resultados. | CA-02, CA-03 |
| `specs/002-spec-antes-del-cambio/plan.md` | «Las restricciones heredadas que nombran a Victor y su carpeta» pasa a «Las restricciones heredadas que nombran al responsable anterior y su carpeta». Mantener el resto de la decisión y su aprobación. | CA-02, CA-03 |

`<usuario>` es un marcador documental, no un directorio literal para ejecutar durante las pruebas. No se sustituyen estas rutas por el nombre de Miguel. No modificar las referencias vigentes a Miguel ni su ámbito real de trabajo. No añadir resultados nuevos a los registros de 001–003.

Los documentos de 004 pueden nombrar la referencia retirada. Las herramientas instaladas, `.venv` y otras aplicaciones quedan fuera de la búsqueda y del cambio. Si aparecen más pasajes afectados, detener el trabajo correspondiente y revisar el plan antes de editarlos.

## Verificación

Antes de la primera edición, guardar fuera del proyecto copias de todos los documentos que se modificarán y un inventario SHA-256 de los archivos de la app, excluyendo `.venv`, cachés y artefactos de ejecución. Capturar también el conjunto de rutas para detectar archivos añadidos o eliminados fuera del alcance.

| Criterio | Procedimiento y evidencia a registrar en tasks.md |
| --- | --- |
| CA-01 | Leer ambas instrucciones y comprobar que las dos usan exactamente el marcador genérico. Al revertir únicamente esas dos sustituciones, el README debe recuperar sus bytes originales. |
| CA-02 | Buscar en los documentos Markdown de la app fuera de `specs/004-quitar-referencias-personales/`, ignorando mayúsculas y acentos mediante `unicodedata` de la biblioteca estándar. Registrar archivos revisados y cero referencias heredadas a Victor/Víctor o victor-chang. |
| CA-03 | Revisar el diff completo de los cinco documentos contra la captura y comprobar que solo contiene las sustituciones previstas. Deshacerlas en memoria debe recuperar cada documento original. Comparar además fechas, identificadores y las cinco decisiones del plan 001. Los resultados anteriores siguen siendo históricos. |
| CA-04 | Comparar la constitución completa y las reglas del manual con la captura: idénticas. El único cambio permitido en el manual es la fila de estado de 004. |
| CA-05 | Comparar rutas y hashes del resto de archivos: código, estáticos, tests, requisitos, configuración, datos y documentos no afectados idénticos. Ejecutar la suite existente una vez en una copia desechable, usando el intérprete del `.venv` local autorizado. |

Las comprobaciones documentales y de conservación serán temporales, con biblioteca estándar; sin tests persistentes ni manifiestos nuevos. Comparar con la captura de esta ejecución, sin hashes fijos dependientes de los saltos de línea o rutas del ordenador de otra persona.

No instalar paquetes, arrancar la aplicación ni abrir un túnel. Las bases de las pruebas se crean solo en la copia desechable. Registrar comando, versiones, resultado de pytest y cualquier bloqueo real; los resultados de 003 no sustituyen esta ejecución. Conservar `.venv`; eliminar capturas, copia y artefactos temporales al finalizar. No declarar verificado ningún criterio bloqueado.

Durante el cierre, registrar el estado real de 004 en sus documentos y en la tabla del manual, pendiente de revisión final de Miguel. Git y publicaciones los ejecuta Miguel; no modificar ramas ni PRs en esta implementación.

## Comprobación de la constitución

- **P1–P2:** limpieza documental acotada; asistencia e integraciones intactas.
- **P3 y §3:** stack y dependencias sin cambios; comprobaciones con biblioteca estándar y pytest existente.
- **P4:** datos de trabajo preservados; sin servicios externos ni nuevos datos personales.
- **P5:** interfaz sin cambios.
- **P6:** documentación en español.
- **§4:** spec aprobada; plan y tareas requieren aprobaciones separadas antes de implementar.
- **§5:** procedimiento y evidencia por criterio según la excepción documental de 2.3; suite existente en verde antes del cierre.
- **§6:** seguridad y reglas de asistencia sin cambios.
- **§7–§8:** trabajo solo en esta copia; no se propone otra enmienda constitucional.

## Conflictos y decisiones pendientes

La conservación de autores exigida por 002 se aplicó a aquella ejecución. La spec 004 autoriza expresamente retirar ahora esa atribución heredada conservando los hechos; no reescribe los resultados de verificación anteriores ni sus aprobaciones. Sin otros conflictos o decisiones pendientes identificados. La reorganización de documentos y arquitectura queda para 005.

## Estado de implementación

Implementada y verificada el 2026-10-23 tras la aprobación de las tareas por Miguel. Evidencia por criterio en [tasks.md](tasks.md). Revisión final aprobada por Miguel el 2026-10-23.
