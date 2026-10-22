# Tareas 002 · Spec aprobada antes de cualquier cambio

Estado: tareas aprobadas por Miguel el 2026-10-22. Implementación y verificación completadas; pendiente de revisión final de Miguel.

Referencias: [spec aprobada](spec.md), [plan aprobado](plan.md), [constitución](../../CONSTITUTION.md) y [manual del agente](../../AGENT.md). Issue #218, PR #220.

- [x] **T01 · Comprobar requisitos.** Revisar las reglas actuales y localizar Python 3.13+ con Flask y pytest disponibles en el `.venv` local autorizado, que se conserva fuera de Git.
  Resultado: versiones identificadas; si falta algo o surge una contradicción, informar antes de instalar o continuar el trabajo afectado. Cubre CA-08.

- [x] **T02 · Capturar el estado anterior.** Fuera del proyecto, guardar el inventario y hashes de los archivos protegidos definidos en el plan y copias del manual y la constitución.
  Resultado: referencia previa para comparar historial, código, tests, configuración y datos, sin crear datos de asistencia. Cubre CA-07, CA-08.

- [x] **T03 · Enmendar `CONSTITUTION.md`.** Aplicar únicamente la propuesta 2.2 del plan: §4, §7, §8, cabecera y nueva fila de enmienda aprobada por Miguel.
  Resultado: alcance y aprobaciones actuales correctos, todos los cambios sujetos a SDD y filas históricas intactas. Cubre CA-01–CA-07.

- [x] **T04 · Actualizar el flujo de `AGENT.md`.** Exigir spec como único primer documento, parada para aprobación y fases posteriores separadas; aclarar pedidos no cubiertos e issue/rama/PR.
  Resultado: un recorrido coherente con la constitución para código, pruebas y documentación. Cubre CA-01–CA-05.

- [x] **T05 · Adaptar las referencias vigentes de `AGENT.md`.** Usar la carpeta de Miguel y su aprobación, conservar la fila 001, registrar la 002 y dejar Discord como idea futura sin número.
  Resultado: ámbito y responsable correctos sin reescribir evidencia histórica ni adelantar 003–005. Cubre CA-06, CA-07.

- [x] **T06 · Verificar las reglas escritas.** En una copia desechable, ejecutar comprobaciones temporales y revisar la matriz de criterios del plan contra ambos documentos, registrando por criterio la sección y el resultado observado.
  Resultado: cobertura, orden, aprobaciones y coherencia verificados; sin tests persistentes nuevos ni comprobaciones basadas solo en palabras presentes. Cubre CA-01–CA-07.

- [x] **T07 · Revisar los escenarios del agente.** Recorrer pedidos de código, README y pruebas sin spec aprobada, y uno no cubierto por la spec activa, sin realizar esos cambios.
  Resultado: documentar el paso y la parada esperados; distinguir revisión de escenarios de una prueba real en sesión nueva e indicar si esta última no se ejecuta. Cubre CA-01–CA-05.

- [x] **T08 · Ejecutar regresiones y comparar.** En la copia desechable, usando el intérprete del `.venv` local, ejecutar la suite pytest existente con sus bases temporales; comparar el proyecto con la captura previa.
  Resultado: suite en verde y archivos protegidos, datos, filas históricas y spec 001 intactos; no arrancar servidor ni túnel. Cubre CA-07, CA-08.

- [x] **T09 · Cerrar la verificación.** Eliminar copias y capturas temporales, conservando el `.venv` local autorizado; registrar aquí comandos, versiones, resultados y bloqueos reales, y actualizar el estado de esta spec en sus documentos y manual.
  Resultado: evidencia legible y estado fiel a lo ejecutado, sin otros cambios de archivos. No declarar terminado si faltan comprobaciones obligatorias. Cubre CA-01–CA-08.

Git, commits, pushes y solicitudes de revisión los ejecuta Miguel. Las aprobaciones y merges de compañeros quedan para el final según lo acordado; no sustituyen las aprobaciones SDD.

## Resultados · 2026-10-22

Miguel autorizó conservar el entorno local y ajustar plan y tareas antes de implementar. Solo se modificaron el manual, la constitución y el plan y las tareas de 002. La spec aprobada permanece intacta.

### Comandos y entorno

- Preparación autorizada: `python3 -m venv .venv` y `.venv/bin/python -m pip install -r requirements.txt`.
- Python 3.14.8, Flask 3.1.3 y pytest 9.1.1. Se conserva `.venv`; no se incluye en Git.
- Con `python3` y biblioteca estándar: captura previa de inventario y SHA-256, copias documentales, copia desechable con `shutil.copytree`, comparación mediante `difflib.unified_diff` y aserciones de conservación.
- En la copia desechable, con el intérprete absoluto del `.venv` local: `python -m pytest -q -p no:cacheprovider`, con `PYTHONDONTWRITEBYTECODE=1`. Primer intento: 76 pasaron y una prueba de socket fue bloqueada por el sandbox. Repetición con permiso para el socket local efímero: **77 pasaron en 0,25 s**. No se arrancó la aplicación ni un túnel.

### Evidencia por criterio

| Criterio | Sección revisada y resultado |
| --- | --- |
| CA-01, CA-02 | Manual §2 y constitución §4.1: incluyen código, pruebas, README y documentación; sin cobertura aprobada solo permiten redactar y mostrar la spec, con parada antes del plan y las tareas. Coherentes entre sí. |
| CA-03 | Tabla de fases y apertura del manual §2, constitución §4.2: spec, plan y tareas tienen aprobación separada antes de avanzar. |
| CA-04 | Manual §2 y constitución §4.6: un pedido no cubierto requiere otra spec; no se amplía silenciosamente una terminada. |
| CA-05 | Manual §2 y constitución §4.6: issue, rama y PR no sustituyen la spec aprobada. El flujo compartido del repositorio sigue siendo previo. |
| CA-06 | Manual §§2, 4–6 y constitución §§7–8: responsable vigente Miguel y ámbito `staff/miguel-rodriguez/asistenciapp/`. |
| CA-07 | Aserciones sobre la captura previa: fila 001 del manual y cuatro filas históricas de la constitución idénticas; historial 2.2 añadido. Los tres documentos 001 conservan sus hashes. |
| CA-08 | Inventario y SHA-256 de los 26 archivos protegidos idénticos antes y después; no existía carpeta de datos y no se creó. Suite original: 77/77. |

### Escenarios revisados

Revisión documental del recorrido, sin ejecutar los cambios propuestos: un pedido de modificar código, otro de cambiar README y otro de añadir pruebas sin spec aprobada quedan en redactar y mostrar solo la spec. Un pedido ajeno a la spec activa inicia una nueva. Tener issue o PR no elimina esas paradas. Después se aprueban por separado plan y tareas antes de implementar.

Esta revisión y las comprobaciones de conservación no son una prueba de seguimiento por otro agente: **no se ejecutó una sesión nueva de IA**. La revisión final de Miguel sigue pendiente.

Se eliminaron la copia desechable, sus bases de prueba, las capturas y los resultados temporales. Se conserva únicamente el `.venv` autorizado. Sin comandos Git, cambios en código, README, requisitos, configuración o documentos 001. No se iniciaron 003–005.

## Aclaración de calidad aprobada · 2026-10-22

Miguel autorizó corregir la discrepancia entre §5 y la verificación documental de 002. La aprobación cubre CA-09, su plan y esta tarea adicional.

- [x] **T10 · Alinear la verificación documental.** Añadir CA-09 y su comprobación al plan; enmendar §5 a versión 2.3, conservando 2.2 e historial anterior. Resultado: revisión documental permitida solo para cambios exclusivamente documentales o de instrucciones, con procedimiento y evidencia por criterio; pruebas automatizadas de comportamiento intactas.

Comprobación de CA-09: lectura comparada de constitución §5, plan (enmienda, matriz y comprobación constitucional) y evidencia de T06–T08. La excepción está acotada y no atribuye seguimiento efectivo a otra sesión de IA. Las filas históricas 1.0–2.2 y todos los archivos fuera de los cuatro documentos de esta aclaración se compararon automáticamente antes y después: idénticos.

No se repitió pytest para esta aclaración exclusivamente documental: se conservan los 77 resultados anteriores como evidencia de aquella ejecución, sin presentarlos como pruebas de esta nueva regla. No se ejecutó una sesión nueva de IA. La revisión final de Miguel sigue pendiente. Estos cambios pertenecen a 002 / PR #220, no a 003.
