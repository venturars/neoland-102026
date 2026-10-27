# Tareas 005 · Separar documentos y responsabilidades

Estado: tareas aprobadas por Miguel el 2026-10-23. Implementada y verificada el 2026-10-23; revisión final aprobada por Miguel el 2026-10-23.

Referencias: [spec aprobada](spec.md), [plan aprobado](plan.md), [constitución vigente](../../docs/CONSTITUTION.md) y [manual vigente](../../AGENTS.md). Issue #281, PR #284. Tras los movimientos aprobados, las reglas vigentes estarán en docs/CONSTITUTION.md y AGENTS.md; las referencias históricas de specs 001–004 no se reescriben.

- [x] **T01 · Capturar la referencia previa.** Fuera del proyecto, guardar inventario de rutas y SHA-256, documentos, código y esquema según el plan. Identificar versiones del intérprete y paquetes existentes. Excluir entorno y cachés; no copiar bases de trabajo para ejecutar pruebas.
  Resultado: referencia completa anterior a cualquier edición, con archivos protegidos identificados. Cubre CA-07, CA-09, CA-10.

- [x] **T02 · Preparar la comparación funcional.** En una copia desechable de la versión anterior, ejecutar la suite existente y capturar respuestas de los escenarios del plan. Crear una base ficticia con token persistente, sesiones abiertas/cerradas y registros; guardar copias para probar la versión reorganizada con el mismo reloj y datos.
  Resultado: comportamiento y base previos disponibles, sin acceder a datos reales. Las comparaciones de sesiones nuevas comprobarán sus relaciones y formato sin exigir que dos identificadores aleatorios independientes coincidan. Cubre CA-07.

- [x] **T03 · Preparar las comprobaciones de arquitectura.** Crear tests/test_architecture.py con comprobaciones de ubicaciones, enlaces vigentes, pautas de funciones y dependencias entre capas mediante AST y revisión de llamadas. Cubrir imports absolutos y relativos. Ejecutarlos antes de reorganizar y registrar los fallos esperados.
  Resultado: comprobaciones vinculadas a los límites del spec, sin herramientas adicionales ni manifiestos de hashes. Cubre CA-01–CA-06, CA-08, CA-09.

- [x] **T04 · Reubicar y enmendar la constitución.** Mover CONSTITUTION.md a docs/CONSTITUTION.md y aplicar únicamente la enmienda 2.4 autorizada en el plan, con fecha real e historial añadido.
  Resultado: organización actualizada y secciones de principios, producto, privacidad, calidad, seguridad y aprobación conservadas. Cubre CA-01, CA-09.

- [x] **T05 · Actualizar el manual.** Renombrar AGENT.md a AGENTS.md; actualizar nombre, lectura inicial, enlaces, árbol y seguimiento de 005. Añadir las pautas de escritura del plan, manteniendo las reglas vigentes y estados históricos.
  Resultado: instrucciones actuales y guía de funciones coherentes con el spec y la constitución. Cubre CA-03, CA-08, CA-09.

- [x] **T06 · Documentar la arquitectura.** Crear docs/ARCHITECTURE.md con responsabilidades, dependencias, recorrido de un registro y ubicaciones de datos, exportación y túnel; explicar también la correspondencia de los nombres históricos.
  Resultado: descripción concreta de las piezas necesarias, sin capas genéricas ni herramientas nuevas. Cubre CA-02, CA-08.

- [x] **T07 · Actualizar enlaces del README.** Cambiar solo enlaces afectados y añadir el de arquitectura, conservando comandos, rutas genéricas, numeración y explicaciones restantes.
  Resultado: enlaces actuales válidos y contenido ajeno al cambio intacto. Cubre CA-08, CA-10.

- [x] **T08 · Separar las reglas de códigos.** Crear el paquete domain y mover codes.py, conservando algoritmo, firmas y mensajes; documentar las funciones modificadas según las pautas. Actualizar en este mismo paso sus imports en app.py y tests/test_codes.py, sin cambiar las aserciones ni adelantar la delegación de T21.
  Resultado: códigos y rotación independientes de HTTP y persistencia; la aplicación sigue siendo importable y sus pruebas de códigos pueden ejecutarse. Cubre CA-04, CA-07.

- [x] **T09 · Separar las reglas de nombres.** Mover names.py a domain, conservando validación, normalización y mensajes; documentar las funciones afectadas. Actualizar en este mismo paso sus imports en app.py y tests/test_names.py, sin cambiar las aserciones ni adelantar la delegación de T21.
  Resultado: mismo comportamiento de nombres sin almacenamiento ni respuestas HTTP; conftest.py puede seguir importando la aplicación para las pruebas de T10 y T13. Cubre CA-04, CA-07.

- [x] **T10 · Probar las reglas de sesión extraídas.** Crear tests/test_session.py para existencia, cierre y precedencia de nombre y código, usando datos ordinarios y sin base de datos.
  Resultado: casos que fallan antes de existir el módulo y expectativas derivadas del contrato anterior. Cubre CA-04, CA-07.

- [x] **T11 · Extraer las reglas de sesión.** Crear domain/session.py con funciones concretas y errores de dominio del plan. Conservar la precedencia actual y el resultado de la validación de nombres y códigos.
  Resultado: los tests de sesión pasan; ninguna dependencia de Flask, almacenamiento o casos de uso. Cubre CA-04, CA-07.

- [x] **T12 · Separar persistencia.** Crear el paquete storage y mover db.py a sqlite.py, conservando SQL, esquema, transacciones, identificadores, secretos y conversión de filas. Actualizar en este mismo paso su import en app.py a `from asistencia.storage import sqlite as db`, conservando las llamadas existentes hasta la delegación de T21. Documentar funciones afectadas sin introducir reglas de asistencia.
  Resultado: almacén concreto independiente de dominio y HTTP, esquema idéntico y aplicación importable para T13. No se conserva un db.py puente ni se duplica el almacén. Cubre CA-05, CA-07.

- [x] **T13 · Probar compatibilidad y cierre de conexiones.** Crear tests/test_attendance.py con casos de lectura de una base con el esquema anterior y cierre de conexión cuando una acción termina o falla. Usar datos ficticios y temporales; no relajar pruebas existentes.
  Resultado: expectativas de conservación y gestión de recursos preparadas antes de implementar las acciones. Cubre CA-06, CA-07.

- [x] **T14 · Implementar preparación de las acciones.** Crear el paquete usecases y attendance.prepare según el plan: inicialización y token, conexión propia con cierre garantizado.
  Resultado: se conserva el token suministrado o persistente sin dependencias HTTP. Cubre CA-06, CA-07.

- [x] **T15 · Implementar consultas de sesiones.** En attendance.py, añadir public_session, list_sessions y teacher_view. Coordinar almacén y dominio; devolver datos ordinarios sin URL HTTP.
  Resultado: campos, orden, totales, visibilidad del secreto y código de sesiones abiertas iguales a los contratos anteriores. Cubre CA-06, CA-07.

- [x] **T16 · Implementar creación de sesión.** En attendance.py, añadir create_session con limpieza de título, título por defecto y timestamps del plan.
  Resultado: misma creación y datos persistidos, sin cambios de reloj ni formato. Cubre CA-06, CA-07.

- [x] **T17 · Implementar registro.** En attendance.py, añadir check_in con existencia, cierre, nombre, código y resolución de duplicado en el orden aprobado. Mantener conexión propia y transacciones existentes.
  Resultado: registro nuevo o duplicado con los datos originales; errores sin escrituras indebidas y conexión cerrada. Cubre CA-04–CA-07.

- [x] **T18 · Implementar cierre de sesión.** En attendance.py, añadir close_session, comprobando existencia y conservando una fecha de cierre anterior.
  Resultado: una sesión cerrada no acepta registros y repetir el cierre no cambia su fecha. Cubre CA-06, CA-07.

- [x] **T19 · Implementar eliminación de registro.** En attendance.py, añadir remove_checkin con comprobación de sesión y pertenencia del registro.
  Resultado: solo se elimina el registro correspondiente; casos ausentes mantienen su resultado previo. Cubre CA-06, CA-07.

- [x] **T20 · Implementar consulta para exportación.** En attendance.py, añadir export_session, devolviendo sesión y registros para el formateador existente.
  Resultado: datos suficientes para conservar CSV y nombre de descarga, sin respuestas Flask. Cubre CA-06, CA-07.

- [x] **T21 · Delegar desde app.py.** Mantener create_app, rutas, verbos, autenticación, proxy, estáticos y arranque. Sustituir acceso directo a datos y reglas por las acciones; traducir errores al contrato HTTP anterior y construir URL y descarga en este borde. Retirar los imports directos de dominio y el import de storage introducido en T12, junto con la gestión de conexiones que ya corresponde a las acciones.
  Resultado: app.py sin gestión directa de almacenamiento, con mismos estados, mensajes y respuestas. Cubre CA-06, CA-07.

- [x] **T22 · Revisar la conservación de los tests existentes.** Comprobar que los imports de codes y names ya se adaptaron en T08 y T09. Comparar los tests existentes con la captura de T01: únicamente cambian esas rutas, sin eliminar casos ni modificar aserciones.
  Resultado: los 77 tests originales se conservan bajo la nueva ubicación de los módulos; esta tarea verifica los cambios anteriores y no retrasa la reparación de imports. Cubre CA-04, CA-07.

- [x] **T23 · Verificar regresiones y compatibilidad.** Ejecutar la suite completa en la copia desechable reorganizada con el intérprete existente; comparar escenarios y bases ficticias con la referencia de T02, según la matriz del plan. Reabrir la base anterior conservando token, sesiones, registros y esquema.
  Resultado: evidencia nueva y real para 005; diferencias o bloqueos identificados, sin presentar pruebas anteriores como éxitos actuales. Cubre CA-01–CA-09.

- [x] **T24 · Comprobar documentos y alcance.** Revisar enlaces actuales, límites de capas, pautas y enmienda. Comparar inventario con T01: solo movimientos, archivos y cambios previstos; specs 001–004, static/, export.py, tunnel.py, script, requisitos, configuración y datos de trabajo intactos.
  Resultado: criterios documentales y conservación acreditados con comparación de contenido y rutas, incluyendo altas y bajas. Cubre CA-01–CA-06, CA-08–CA-10.

- [x] **T25 · Registrar resultados y limpiar.** Anotar comandos, versiones y evidencia por criterio en este documento, actualizar estados de 005 y su fila en AGENTS.md y eliminar copias, capturas y bases temporales. Conservar .venv y datos de trabajo.
  Resultado: implementación y comprobaciones descritas fielmente, pendientes de revisión final de Miguel; sin servidores, túneles ni artefactos temporales. Cubre CA-01–CA-10.

## Orden de dependencias durante los movimientos

Cada movimiento de módulo incluye en la misma tarea la creación de su paquete y la actualización de todos sus consumidores actuales. Antes de cada movimiento, localizar esos consumidores; al terminar T08, T09 y T12, comprobar en la copia desechable que `import app` funciona sin crear una aplicación ni abrir una base de datos, y que los tests originales pueden recogerse. No posponer reparaciones de imports a una tarea posterior.

La dependencia directa que app.py ya tenía con la persistencia conserva su función durante T12; solo cambia su ubicación. T21 completa la separación retirándola. No añadir archivos puente, copias de módulos, modificaciones de sys.path ni capturas de ImportError para ocultar una dependencia pendiente.

Los tests nuevos de T03, T10 y T13 pueden fallar porque todavía falta su funcionalidad objetivo. Ejecutarlos de forma dirigida y distinguir esos fallos esperados de una regresión en la importación de app.py, conftest.py o los tests originales. No silenciar los fallos con skips ni relajar aserciones para hacer pasar una fase intermedia. La suite completa se exige en T23 tras completar la reorganización.

## Condiciones de ejecución

No comenzar hasta aprobar estas tareas. No instalar paquetes, cambiar servicios, ejecutar el script de ataque ni iniciar la funcionalidad de seguridad por IP. Las referencias y las pruebas se preparan con biblioteca estándar, Flask y pytest existentes. El trabajo se detiene ante una contradicción o cambio no previsto y se revisa el plan afectado.

No incluir otras aplicaciones en los commits. Los commits y publicaciones seguirán la autorización vigente de Miguel y el flujo de la PR #284; ninguna tarea autoriza a dar por aprobada su propia implementación ni a fusionarla sin las revisiones necesarias.


## Resultados de la verificación · 2026-10-23

Entorno existente: Python 3.14.8, Flask 3.1.3 y pytest 9.1.1. Ejecución en copias desechables, con datos ficticios y `PYTHONDONTWRITEBYTECODE=1`; intérprete `.venv/bin/python` de esta app. No se instalaron paquetes.

- Referencia anterior: `python -m pytest -q -p no:cacheprovider`, **77 pruebas aprobadas** (0,23 s).
- Pruebas nuevas antes de implementar: 8 fallos esperados de arquitectura, 7 de reglas de sesión y 12 de acciones. Tras implementar sus responsabilidades pasan; sin skips ni cambios de aserciones originales.
- Durante T08, T09 y T12: `python -c 'import app'` funciona sin crear una aplicación. `python -m pytest --collect-only -q -p no:cacheprovider` dirigido a los archivos originales recoge las 77 pruebas.
- Suite final: `python -m pytest -q -p no:cacheprovider`, **104 pruebas aprobadas** (0,71 s): las 77 originales y 27 nuevas.
- Comparación con la referencia: 22 escenarios mediante el cliente de pruebas de Flask, con el mismo reloj y copias de una base ficticia creada por la versión anterior. Coinciden estados, respuestas, cabeceras de contenido y descarga, CSV, token e inventario SQL tras las acciones. Incluye autenticación, proxy, consulta, registro, duplicados, errores, eliminación y cierre repetido. La creación de sesión nueva conserva campos, formato y relaciones sin comparar identificadores aleatorios independientes.

| Criterio | Evidencia |
| --- | --- |
| CA-01 | Constitución en docs/; ubicación y enlaces comprobados por tests y revisión documental. |
| CA-02 | ARCHITECTURE.md describe capas, recorrido y datos; comprobaciones de estructura e imports. |
| CA-03 | AGENTS.md sustituye al manual anterior e incluye pautas de funciones; lectura y enlaces revisados. |
| CA-04 | Reglas sin HTTP ni persistencia, comprobadas mediante AST y 7 pruebas de sesión; algoritmos movidos conservados. |
| CA-05 | Almacén sin dominio ni HTTP; SQL y cuerpos de operaciones conservados mediante comparación AST. |
| CA-06 | Acciones coordinan reglas y almacén; app.py delega. Pruebas de cierre de conexión en éxito, error de dominio y error de almacenamiento. |
| CA-07 | 104 pruebas y comparación de 22 escenarios; lectura del esquema anterior sin migración, con token y registros conservados. |
| CA-08 | Enlaces vigentes resueltos; README conserva su contenido salvo enlaces afectados y enlace de arquitectura. |
| CA-09 | Enmienda 2.4 limitada a organización e historial; secciones restantes y filas anteriores comparadas con la referencia. |
| CA-10 | 24 archivos protegidos idénticos, incluidos los 12 documentos de specs 001–004; tests originales conservados salvo dos imports. Inventario de altas y bajas conforme al plan. |

Las copias, capturas y bases temporales se eliminaron tras registrar los resultados. El entorno local y los datos de trabajo se conservan. Las comprobaciones HTTP usaron el cliente de pruebas; no se inició el servidor de la aplicación, un túnel ni el script de ataque. La prueba de puerto de la suite usa su socket temporal. Miguel aprobó la revisión final el 2026-10-23.


## Corrección tras la revisión final · 2026-10-23

La revisión encontró una regresión no cubierta por los 22 escenarios iniciales: extraer nombre y código en app.py antes de delegar producía 500 con un JSON no objeto, incluso cuando la clase no existía o estaba cerrada. La referencia respondía 404 y 409, respectivamente. Miguel autorizó corregirla.

Se ajustó el contrato interno de check_in para recibir los campos sin extraerlos: el dominio comprueba primero existencia y cierre, después lee nombre y código. Se adaptaron únicamente los tests nuevos de dominio y acciones; las aserciones de los 77 originales siguen intactas.

Se añadió tests/test_checkin_precedence.py con ocho casos: lista, texto, número y booleano ante clase inexistente y cerrada. Una primera ejecución detectó un error de recogida en el test nuevo (faltaba su parámetro payload); se corrigió antes de validar la regresión. Con la extracción prematura reproducida en una copia temporal, los ocho casos fallan (0,07 s); con la corrección, la suite completa pasa: **112 pruebas en 0,37 s**, sin skips, mediante `.venv/bin/python -m pytest -q -p no:cacheprovider`, con PYTHONDONTWRITEBYTECODE=1 y el entorno existente. Las 104 pruebas y los 22 escenarios anteriores son evidencia de la ejecución anterior; la suite final vigente es de 112 pruebas. CA-07 queda ampliado con la comprobación de esta precedencia.

Las copias de esta revisión se eliminaron. No se modificaron datos de trabajo, specs 001–004 ni archivos de otras apps. Miguel aprobó la revisión final el 2026-10-23.


## Revisión adicional y aprobación final · 2026-10-23

Se compararon otras 54 combinaciones de cuerpos JSON ante sesiones abiertas, cerradas e inexistentes contra la versión anterior: cero diferencias de estado, contenido o tipo de respuesta. Se comprobaron de nuevo por AST los cuerpos de las funciones movidas de códigos, nombres y almacenamiento, excluyendo solo documentación y anotaciones: sin cambios. Specs 001–004 intactas y `git diff --check` sin incidencias. Las copias temporales se eliminaron.

Miguel aprobó el resultado de 005 y autorizó preparar los commits, subirlos y actualizar la PR #284. Esta aprobación no sustituye las revisiones de compañeros ni autoriza el merge sin ellas.
