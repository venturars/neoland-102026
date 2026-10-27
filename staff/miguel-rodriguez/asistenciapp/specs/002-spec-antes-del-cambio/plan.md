# Plan 002 · Spec aprobada antes de cualquier cambio

Estado: aprobado por Miguel el 2026-10-22.

Referencias: [spec aprobada](spec.md), [constitución actual](../../CONSTITUTION.md), [manual del agente](../../AGENT.md) e [issue #218](https://github.com/venturars/neoland-102026/issues/218).

## Archivos y alcance

Durante la implementación, modificar solo `AGENT.md` y `CONSTITUTION.md`. Actualizar el estado y los resultados de los documentos de esta spec según avance el proceso. Las comprobaciones nuevas serán temporales; no se crearán archivos de tests persistentes.

No tocar `README.md`, código de asistencia, datos, dependencias, configuración ni documentos históricos de `001-checkin-codigo`. No renombrar `AGENT.md` ni mover la constitución. Git y publicaciones los ejecuta Miguel.

## Manual del agente

En `AGENT.md`, ampliar el flujo de funcionalidades a cualquier cambio de código, pruebas, README o documentación de uso. Al comenzar un pedido sin spec aprobada, solo se crea su `spec.md` y se espera el sí explícito de Miguel. Plan, tareas e implementación tienen aprobaciones separadas.

Una issue, rama o PR no sustituye la spec. Si el pedido no está cubierto por la spec activa, abrir una nueva sin reescribir las terminadas. Una contradicción requiere detener el trabajo afectado y proponer su resolución.

Adaptar las referencias vigentes de carpeta y aprobación a `staff/miguel-rodriguez/asistenciapp/` y Miguel, incluidas las instrucciones de ejecución y cierre. Conservar el contenido histórico de la fila 001. Registrar la spec 002 con su estado real y dejar el bot de Discord como idea futura sin número, liberando el 002 que antes figuraba como ejemplo.

## Enmienda de la constitución

Proponer la versión 2.2, con fecha de implementación y aprobación de Miguel registrada en el historial, conservando las filas anteriores:

- §4: exigir spec aprobada para cualquier cambio de la app; expresar el orden y las aprobaciones separadas. Issue, rama y PR no autorizan a saltarlo. Un pedido no cubierto requiere otra spec.
- §7: fijar el ámbito de esta copia en `staff/miguel-rodriguez/asistenciapp/`.
- §8: Miguel aprueba las enmiendas de esta copia.

Actualizar la cabecera de versión y fecha. No alterar propósito, principios P1–P6, stack, privacidad ni seguridad. La aclaración aprobada por Miguel el 2026-10-22 añade una enmienda 2.3 de §5: para cambios exclusivamente documentales o de instrucciones, cada criterio puede verificarse documentalmente con procedimiento y evidencia registrados; para comportamiento se mantienen las pruebas automatizadas y la excepción visual existente. Conservar la entrada 2.2 y añadir la 2.3, sin reescribir resultados anteriores.

La aprobación de este plan autorizará esa enmienda concreta para la fase de implementación; antes solo se documenta la propuesta. Las restricciones heredadas que nombran al responsable anterior y su carpeta se adaptan por la decisión explícita de Miguel para su copia; no se reatribuyen aprobaciones históricas.

## Verificación

Ejecutar comprobaciones documentales temporales con la biblioteca estándar, sin añadir archivos a la suite. Revisar cobertura, orden y coherencia de las reglas; no dar por válido el contrato solo porque aparezcan ciertas palabras o una frase exacta. Conservar los resultados en `tasks.md`. Ejecutar también la suite pytest existente, sin modificarla.

Antes de la primera modificación, capturar fuera de la carpeta de trabajo un inventario de rutas y hashes SHA-256 de la spec 001 completa, `app.py`, `asistencia/`, `static/`, los tests existentes, `requirements.txt`, `pytest.ini` y los datos existentes, si los hay. Guardar además una copia de `AGENT.md` y `CONSTITUTION.md` para comparar sus secciones y las filas históricas. Tras el cambio, exigir igualdad del inventario protegido y de su contenido, y comprobar que las filas históricas anteriores y la fila 001 del manual siguen intactas. Solo se permiten los cambios previstos en las reglas vigentes, la nueva entrada de enmienda y el estado de la spec 002. No crear datos en el proyecto para esta comprobación. Eliminar la captura temporal al finalizar.

| Criterio | Comprobación prevista |
| --- | --- |
| CA-01, CA-02 | Manual y constitución cubren código, pruebas y documentación; el inicio solo permite spec y exige aprobación antes del plan. |
| CA-03, CA-04 | Orden de fases, aprobación entre fases y nueva spec para un pedido no cubierto; no se reutiliza una terminada. |
| CA-05 | Issue, rama y PR no sustituyen la spec aprobada. |
| CA-06 | Referencias vigentes de carpeta y responsable coinciden en ambos documentos. |
| CA-07 | Comparar con la captura previa: spec 001 completa y filas históricas sin cambios; el historial nuevo se añade sin sustituir el anterior. |
| CA-09 | Revisar §5 y su coherencia con la matriz y evidencia de tasks.md: verificación documental acotada, pruebas de comportamiento intactas y ninguna afirmación de seguimiento por otra sesión. |
| CA-08 | Comparar inventario y hashes con la captura previa de código, estáticos, tests, requisitos, configuración y datos; ejecutar la suite existente con bases temporales. |

Las comprobaciones documentales y la suite existente comprueban las reglas escritas y la ausencia de regresiones; no demuestran por sí solas el comportamiento de una sesión nueva de IA. La revisión humana comprobará además el recorrido ante pedidos de código, README y pruebas, incluyendo un pedido no cubierto, sin ejecutar esos cambios. Si no se realiza una prueba real en sesión nueva, se indicará expresamente.

Ejecutar las comprobaciones en una copia desechable con Python 3.13+ y un entorno virtual. Comprobar primero las herramientas y dependencias disponibles; si falta alguna, informar antes de instalar. No levantar servidor ni túnel. Por autorización de Miguel del 2026-10-22, conservar el `.venv` local con los requisitos existentes y usar su intérprete para verificar la copia desechable. El entorno no se sube a Git. Eliminar la copia y registrar comandos, versiones, resultados y bloqueos en `tasks.md` durante la implementación.

## Comprobación de la constitución

- **P1:** no se añaden integraciones ni se cambia el registro de asistencia.
- **P2:** cambios documentales y comprobaciones acotadas; sin capas ni automatizaciones adicionales.
- **P3 y §3:** solo biblioteca estándar, Flask y pytest existentes; sin dependencias nuevas.
- **P4:** sin nuevos datos, escrituras de asistencia ni servicios externos.
- **P5:** interfaz intacta.
- **P6:** documentos y mensajes de las comprobaciones en español.
- **§4:** se sigue spec → plan → tareas → implementación; cada fase requiere aprobación de Miguel.
- **§5:** aclaración 2.3 aprobada: comprobación documental con procedimiento y evidencia por criterio para cambios exclusivamente documentales; pruebas automatizadas para comportamiento. La suite debe seguir pasando.
- **§6:** las reglas de seguridad de asistencia no cambian.
- **§7–§8:** se enmiendan expresamente el ámbito y el responsable de esta copia; el resto se conserva.

## Conflictos y decisiones pendientes

No hay decisiones de negocio pendientes. La diferencia con el responsable y la carpeta heredados queda cubierta por la adaptación autorizada en la spec; el plan propone la enmienda explícita para no cambiar esas reglas silenciosamente. Una herramienta o dependencia ausente se comunicará como bloqueo, sin instalar ni sustituir nada por iniciativa propia.
