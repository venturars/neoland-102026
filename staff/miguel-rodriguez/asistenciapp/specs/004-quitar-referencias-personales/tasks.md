# Tareas 004 · Retirar referencias personales heredadas

Estado: tareas aprobadas por Miguel el 2026-10-23; implementación y verificación completadas. Revisión final aprobada por Miguel el 2026-10-23.

Referencias: [spec aprobada](spec.md), [plan aprobado](plan.md), [constitución 2.3](../../CONSTITUTION.md) y [manual](../../AGENT.md). Issue #251, PR #252.

- [x] **T01 · Capturar el estado previo.** Fuera del proyecto, guardar las copias e inventario de rutas y SHA-256 definidos en el plan; comprobar versiones del `.venv` existente sin instalar nada.
  Resultado: referencia previa completa y entorno identificado antes de editar. Cubre CA-03–CA-05.

- [x] **T02 · Cambiar las dos rutas de README.md.** Aplicar solo las dos sustituciones por `staff/<usuario>/asistenciapp` previstas en el plan.
  Resultado: ambas rutas genéricas; el resto del documento idéntico. Cubre CA-01, CA-02, CA-05.

- [x] **T03 · Neutralizar las dos atribuciones de la spec 001.** En `specs/001-checkin-codigo/spec.md`, aplicar las dos sustituciones exactas de la tabla del plan.
  Resultado: fechas, versiones, criterios y hecho detectado conservados. Cubre CA-02, CA-03.

- [x] **T04 · Neutralizar el título del plan 001.** En `specs/001-checkin-codigo/plan.md`, dejar «Decisiones tomadas» sin atribución personal.
  Resultado: las cinco decisiones numeradas permanecen idénticas. Cubre CA-02, CA-03.

- [x] **T05 · Neutralizar las notas de tareas 001.** En `specs/001-checkin-codigo/tasks.md`, retirar las cuatro atribuciones fechadas y neutralizar la frase del móvil según el plan.
  Resultado: mismas fechas y resultados sobre registro, panel, CSV, bloqueo y eliminación; ninguna verificación atribuida a Miguel. Cubre CA-02, CA-03.

- [x] **T06 · Neutralizar la referencia del plan 002.** En `specs/002-spec-antes-del-cambio/plan.md`, aplicar la única sustitución prevista sin alterar la decisión ni su aprobación.
  Resultado: referencia al responsable anterior sin nombre; evidencia de 002 intacta. Cubre CA-02, CA-03.

- [x] **T07 · Verificar la documentación.** Aplicar la matriz del plan con comprobaciones temporales y revisar el diff de los cinco documentos frente a las capturas; registrar evidencia por criterio aquí.
  Resultado: cero referencias heredadas fuera de 004, búsqueda independiente de mayúsculas/acentos, sustituciones reversibles a los bytes originales y hechos históricos conservados. Cubre CA-01–CA-03.

- [x] **T08 · Ejecutar la suite existente.** En una copia desechable, ejecutar pytest con el intérprete del `.venv` local, sin instalar, cambiar tests, arrancar la app ni abrir túneles.
  Resultado: comando, versiones y resultado real registrados; cualquier bloqueo identificado sin presentarlo como éxito. Cubre CA-05 y constitución §5.

- [x] **T09 · Registrar el estado de 004.** Actualizar únicamente su fila en la tabla de `AGENT.md` y los estados y resultados de sus documentos SDD.
  Resultado: implementación y verificación descritas fielmente, con revisión final aprobada por Miguel el 2026-10-23; reglas y filas anteriores del manual intactas. Cubre CA-04, CA-05.

- [x] **T10 · Comprobar conservación y limpiar.** Comparar el inventario final con la captura, permitiendo solo los cambios autorizados; comparar la constitución y reglas del manual. Eliminar copia y capturas temporales, conservando `.venv`.
  Resultado: archivos ajenos, código, pruebas, configuración y datos idénticos, sin altas o bajas imprevistas; limpieza y resultados registrados aquí. Cubre CA-04, CA-05.

Si aparece otro pasaje afectado o un impedimento, detener el trabajo correspondiente y revisar el plan antes de continuar. No crear tests persistentes, manifiestos, dependencias ni documentos adicionales. No iniciar 005. Git y publicaciones los ejecuta Miguel.

## Evidencia de ejecución · 2026-10-23

- T01: copias previas e inventario de rutas y SHA-256 capturados fuera del proyecto antes de editar.
- CA-01: exactamente dos rutas genéricas en el README; el resto de sus bytes se conserva.
- CA-02: revisados 12 documentos Markdown fuera de 004 y del entorno; cero referencias heredadas con búsqueda normalizada por acentos y mayúsculas.
- CA-03: los cinco documentos contienen únicamente las sustituciones aprobadas. Comparación con las capturas y reconstrucción de bytes originales correctas; fechas, identificadores, cinco decisiones y resultados históricos conservados. No se atribuyen a Miguel ni se presentan como pruebas nuevas.
- CA-04: constitución idéntica por SHA-256; manual idéntico salvo la fila nueva de seguimiento de 004. Responsabilidad, aprobaciones y ámbito de Miguel conservados.
- CA-05: inventario final sin altas ni bajas imprevistas; código, estáticos, tests, requisitos, configuración, datos y documentos ajenos idénticos por SHA-256.
- Suite: copia desechable; intérprete del `.venv` autorizado; comando `PYTHONDONTWRITEBYTECODE=1 <proyecto>/.venv/bin/python -m pytest -q -p no:cacheprovider`.
- Entorno: 3.14.8, Flask 3.1.3, pytest 9.1.1. Resultado real: 77 passed in 0.23s.
- Sin instalaciones, servidores, túneles, cambios de tests ni comandos Git. `.venv` conservado; copia, capturas y artefactos temporales eliminados al finalizar.
- Sin bloqueos. Revisión final aprobada por Miguel el 2026-10-23.
