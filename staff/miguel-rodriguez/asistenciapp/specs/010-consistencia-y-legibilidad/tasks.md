# Tareas 010 · Reglas de código consistente y legible

Estado: tareas aprobadas por Miguel el 2026-10-26; implementación documental completada, verificada y revisión final aprobada por Miguel el 2026-10-26.
Fecha: 2026-10-26. [Spec](spec.md), [plan](plan.md) y tareas aprobados por separado.

## Ejecución

Solo se modifican AGENTS.md, docs/ARCHITECTURE.md y los documentos de 010. No se modifica código, pruebas, datos, dependencias, constitución ni specs anteriores. Conservar los cambios locales ajenos. No crear issue, rama, commit o PR como parte de estas tareas documentales.

- [x] **T01 · Confirmar el punto de partida.** Leer el manual, constitución, arquitectura y documentos de 010; comprobar el estado del checkout y localizar los seis casos del plan. Registrar aquí la referencia de código examinada y los cambios ajenos que deben excluirse, sin copiar sus contenidos. **Resultado:** alcance y ejemplos identificados antes de editar. **CA-07, CA-09.**

- [x] **T02 · Organizar docs/ARCHITECTURE.md.** Trasladar el árbol de carpetas pertinente al documento de arquitectura y contrastarlo con la app. Añadir los límites de responsabilidad y una nota breve de correcciones pendientes: roster, SQL embebido y estados HTTP en errores de dominio. Conservar la descripción del comportamiento real y las garantías de seguridad, sin duplicar reglas de sintaxis ni los seis casos de diagnóstico. **Resultado:** arquitectura actual y límites futuros distinguibles; sin afirmar que la refactorización ya ocurrió. **CA-05, CA-07, CA-08.**

- [x] **T03 · Corregir navegación y duplicación en AGENTS.md.** Añadir arquitectura a la lectura inicial y sustituir el árbol de §3 por su enlace, conservando la convención de specs. Mantener el flujo SDD y sus aprobaciones. **Resultado:** un único árbol vigente y enlaces que llevan al documento correspondiente. **CA-07.**

- [x] **T04 · Reescribir las reglas de código en AGENTS.md §8.** Aplicar el estilo funcional a dominio y casos de uso, con la excepción limitada de errores sin HTTP. Especificar pasos claros, nombres descriptivos, una responsabilidad por función y abstracciones justificadas. Sustituir la política universal de docstrings por la política aprobada para funciones públicas e internas. Permitir db_path y cierre garantizado para la app concreta; rechazar proveedores hipotéticos. Incluir solo dos ejemplos reutilizables del plan y enlazar la seguridad vigente sin copiar sus umbrales. **Resultado:** reglas comprensibles y sin contradicciones entre las secciones del manual. **CA-01–CA-04, CA-06, CA-08.**

- [x] **T05 · Comprobar reglas y registrar evidencia en este archivo.** Completar las dos tablas inferiores mediante lectura de los documentos finales y contraste con los seis casos del código. Comprobar enlaces locales, un único árbol vigente y dos ejemplos en el manual. Para cada criterio, indicar sección concreta y resultado; para cada caso, explicar qué permite decidir la regla, sin presentarlo como código corregido. **Resultado:** nueve criterios comprobados y seis contrastes registrados, sin crear otro documento ni tests de texto. **CA-01–CA-09.**

- [x] **T06 · Ejecutar las pruebas existentes.** Desde la carpeta de la app, usar el Python del entorno existente y ejecutar una vez `python -m pytest -q`. Registrar intérprete, comando, resultado y cualquier fallo. Las pruebas usan sus datos temporales y gestionan sus propios servidores locales si los necesitan; no iniciar la app ni un túnel manualmente. No instalar dependencias, cambiar tests ni usar datos reales. Si falta el entorno o falla una prueba, registrar el bloqueo y no marcar esta tarea completa. **Resultado:** resultado real de regresión, separado de la evidencia documental. **CA-08, CA-09.**

- [x] **T07 · Revisar el alcance y cerrar el seguimiento de 010.** Revisar el diff y los archivos nuevos: solo los documentos autorizados pueden incluirse. Confirmar código, pruebas, constitución y documentos anteriores sin cambios de esta tarea. Añadir únicamente la fila de 010 a AGENTS.md §7 con el estado real y registrar aquí la revisión final. No marcar aprobaciones de Miguel o compañeros que no hayan ocurrido. **Resultado:** tarea documental implementada y verificada, pendiente de revisión final de Miguel; ninguna refactorización atribuida a 010. **CA-07, CA-09.**

## Evidencia por criterio

T05 completada el 2026-10-26 mediante lectura de los documentos finales, comprobación de enlaces locales y contraste con el código de referencia.

| Criterio | Sección final y comprobación | Resultado |
| --- | --- | --- |
| CA-01 | AGENTS.md §8 «Funciones y pasos claros»: dominio y casos de uso usan funciones; errores sin lógica ni HTTP como excepción; clases externas excluidas. | Verificado por lectura y contraste con Outcome y _Execution. |
| CA-02 | AGENTS.md §8: separar obtener, transformar y responder; segundo ejemplo con rows y checkins; conservar expresiones breves. | Verificado; sin helper por línea ni límite mecánico. |
| CA-03 | AGENTS.md §8: responsabilidad única y nombres session_id, connection y checkins frente a abreviaturas ambiguas. | Verificado en reglas y ejemplo de pasos. |
| CA-04 | AGENTS.md §8 «Documentación de funciones»: plantilla pública completa, explicación interna breve y tipos; prefijo interno como convención. | Verificado; sustituida la exigencia anterior, sin políticas duplicadas. |
| CA-05 | ARCHITECTURE.md «Responsabilidades» y «Correcciones pendientes del código»: datos, SQL y traducción HTTP separados. | Verificado; roster, consultas embebidas y RaceError.status siguen identificados como pendientes. |
| CA-06 | AGENTS.md §8 «Simplicidad y almacenamiento»: base SQLite concreta, db_path permitido, helpers justificados y gestión de recursos explícita. | Verificado; no exige eliminar context managers ni admite proveedores hipotéticos. |
| CA-07 | AGENTS.md §1 y §3; ARCHITECTURE.md «Estructura de carpetas». | Verificado: árbol solo en arquitectura, dos ejemplos solo en manual y enlaces locales resueltos; constitución y specs previas sin cambios. |
| CA-08 | AGENTS.md §8 «Seguridad al simplificar» enlaza constitución §6 y arquitectura «Reserva A y resultado B». | Verificado por lectura conjunta: conserva intentos, evaluación única, aislamiento, caducidad y transacciones; código intacto. |
| CA-09 | Esta matriz y los seis contrastes inferiores, referencia ca8684e. | Verificado documentalmente; no se atribuye una refactorización ni cumplimiento futuro automático de agentes. |

## Contraste con el código

Referencia examinada: ca8684e, conservada sin cambios de código. La tabla documenta el diagnóstico y la aplicación de las reglas; las funciones siguen pendientes de refactorización.

| Caso | Regla aplicable y conclusión |
| --- | --- |
| storage/races.py:ranking | CA-02 y CA-05: ejecutar y convertir filas son pasos distintos; SQL irá en archivo separado. El manual enseña el flujo genérico, sin introducir helpers ni corregir esta función. |
| domain/race.py:Outcome | CA-01: clase propia de resultado; su conversión a datos ordinarios queda para la refactorización posterior. |
| usecases/races.py:_Execution | CA-01 y CA-08: clase propia también cubierta en casos de uso; cualquier sustitución debe conservar el permiso de una sola evaluación. No se propone una sustitución sin pruebas. |
| domain/race.py:RaceError.status | CA-01 y CA-05: estado HTTP en dominio; distinguir el rechazo de su traducción en el adaptador, sin ocultarlo bajo otro nombre. |
| storage/races.py:count_operations | CA-04: la descripción «contador o identificador guardado» no es precisa; la función cuenta operaciones de una plaza. Docstring de código sin modificar. |
| usecases/races.py:_reading_connection(db) | CA-06: recibe una ruta local y garantiza el cierre; eso no demuestra soporte multimotor ni obliga a borrarlo. La regla exige justificar su utilidad real. |

## Pruebas y revisión final

- T01: referencia `ca8684e`, rama local `332-feat-refine-race-presentation`. Lectura de constitución 4.1, manual, arquitectura y documentos de 010 completada; seis casos del plan localizados. Se excluyen los archivos ajenos sin seguimiento `AGENTS 3.md`, `README 3.md`, `app 3.py`, `pytest 3.ini` y `requirements 3.txt`, presentes antes de esta ejecución.
- T06: Python 3.14.8 del entorno existente `/Users/miguelangelrodriguez/Documents/ChatGPT/NEOLAND/009-local-implementation/asistenciapp/.venv/bin/python`. Desde la app del checkout de publicación: `<intérprete> -m pytest -q`. Resultado del 2026-10-26: **226 passed in 5.27s**, salida 0. Sin instalaciones ni cambios de pruebas. Los servidores temporales pertenecen a los tests; no se inició la app ni un túnel manualmente.
- T07: diff revisado y `git diff --check` sin errores. Los únicos archivos previamente versionados modificados son AGENTS.md y docs/ARCHITECTURE.md; los tres documentos nuevos de 010 son spec.md, plan.md y tasks.md. Constitución, código, tests, requisitos, README y specs anteriores sin cambios. Archivos ajenos iniciales excluidos. Enlaces y anclas válidos; un árbol en arquitectura y dos ejemplos en el manual. Secciones de SDD, comandos, comportamiento y definición de terminado conservadas byte a byte; estados anteriores intactos, añadida solo la fila 010. Sin commits, pushes ni cambios de PRs.
- Revisión final de Miguel: aprobada expresamente el 2026-10-26.

## Publicación autorizada · 2026-10-26

Después de aprobar el resultado documental, Miguel autorizó crear la issue #361 y publicar la rama, los commits y la PR. Esta autorización sustituye para ese paso la restricción de publicación del alcance local anterior.

- Issue: [#361](https://github.com/venturars/neoland-102026/issues/361), asignada a mglnglxx.
- Rama: `361-docs-readable-code-rules`; conserva la base de código 009 revisada, con sus predecesoras todavía pendientes de integración.
- PR: [#362](https://github.com/venturars/neoland-102026/pull/362), destino staging, creada en draft. Depende de #356; la descripción explica el diff acumulado y enlaza la comparación exclusiva de 010 desde ca8684e.
- La aprobación local de Miguel no se presenta como aprobación de compañeros. No se fusionan PRs ni se modifican sus bases.
- La nota de T07 sin commits o pushes describe el estado al terminar la verificación local, anterior a esta publicación autorizada.
