# Tareas 011 · Funciones y resultados de carrera legibles

Estado: ejecución completa autorizada por Miguel el 2026-10-26 al pedir terminar las tareas pendientes y dejarlas para revisión. La spec ya estaba aprobada; el plan y estas tareas se revisan dentro de esa autorización. La revisión de compañeros y el merge siguen pendientes.

Referencias: [spec](spec.md), [plan](plan.md), [manual](../../AGENTS.md), [constitución](../../docs/CONSTITUTION.md). Issue #363, PR #364; depende de #362.

- [x] **T01 · Leer contratos y conservar referencia.** Revisar reglas 010 y flujo completo A/B; generar datos ficticios con la implementación 010 para un éxito, un rechazo y una reserva sin resultado. Conservar sus respuestas recuperadas, esquema y datos como fixtures. Cubre CA-04–CA-09.
- [x] **T02 · Expresar errores por motivo.** Sustituir el estado HTTP de RaceError por reason; adaptar solo sus productores y consumidores necesarios, sin cambiar orden, mensajes o limpieza de caducados. Cubre CA-01–CA-03, CA-06–CA-07.
- [x] **T03 · Expresar resultados de intento con datos y significado.** Retirar Outcome; devolver la tupla concreta (data, result_kind). Traducir a HTTP únicamente en race_http.py y conservar result_status como codificación antigua en complete_operation. Cubre CA-01–CA-03, CA-07–CA-08.
- [x] **T04 · Sustituir el permiso interno.** Crear la clausura de un solo uso únicamente después del commit A, capturando sus datos de servidor; proteger su consumo con un Lock local. Mantener B y no devolver permisos tras fallos. Cubre CA-01, CA-03–CA-06.
- [x] **T05 · Adaptar tests del contrato interno.** Conservar escenarios y aserciones de comportamiento, cambiando solo acceso a la tupla, motivos y ejecución del permiso local. Mantener intactas las aserciones HTTP. Cubre CA-07, CA-09.
- [x] **T06 · Probar ejecución única y traducción.** Añadir pruebas de segundo uso secuencial y simultáneo, consumo antes de fallo y captura inmutable del código; comprobar la traducción HTTP y el rechazo técnico de motivos desconocidos. Cubre CA-02, CA-04–CA-07, CA-09.
- [x] **T07 · Probar datos anteriores.** Recuperar los tres estados generados por 010 sin evaluar de nuevo, conservar consumo, datos y esquema; rechazar recuperaciones caducadas. Cubre CA-05–CA-06, CA-08–CA-09.
- [x] **T08 · Leer y verificar el cambio completo.** Ejecutar la suite completa y revisar dominio, caso de uso, almacenamiento y borde HTTP; comprobar que A/B, precedencia y cierres no cambian. Cubre CA-01–CA-09.
- [x] **T09 · Actualizar documentación y entregar.** Ajustar solo la arquitectura afectada y seguimiento 011; registrar resultados reales, revisar diff exclusivo contra 010 y retirar temporales propios. Preparar commits, sin atribuir revisiones de compañeros ni autorización de merge. Cubre CA-03, CA-09.

## Evidencia

T01: fixtures `tests/fixtures/011-previous-race.sql` y `.json` generados antes de modificar código, mediante las operaciones de la referencia 010 (`93c3200`), con datos ficticios temporales. Recuperaciones previas: éxito 200, rechazo 422 y reserva 202. No se abrió ninguna base de trabajo.


## Verificación · 2026-10-26

Entorno existente: Python 3.14.8, Flask 3.1.3, pytest 9.1.1 y qrcode 8.2, sin instalar ni cambiar dependencias. Los tests crean bases temporales y cierran sus conexiones y servidores propios; no se arrancó un túnel ni se abrió la base de trabajo.

- Comando desde la carpeta de la app: `/Users/miguelangelrodriguez/Documents/ChatGPT/NEOLAND/009-local-implementation/asistenciapp/.venv/bin/python -m pytest -q -p no:cacheprovider --tb=short`.
- Resultado completo: **250 pruebas pasan en 5,51 s**: 226 casos anteriores conservados y 24 nuevos de `test_race_refactor.py`.
- Los 226 casos anteriores conservan sus escenarios y aserciones externas. Solo se adaptaron los contratos internos en tres archivos: acceso a tuplas, motivos de error y llamada a la función reservada. Las pruebas HTTP, QR, exportación y clases normales conservan sus aserciones.
- Las 24 comprobaciones nuevas incluyen: consumo local secuencial y simultáneo, fallo de B sin reposición del permiso, captura del código antes de modificar el diccionario recibido, doce traducciones de motivos HTTP, fallos técnicos ante motivo o resultado desconocido, recuperación de los tres estados escritos por 010, caducidad y las cinco codificaciones antiguas de result_status.
- El fixture anterior se generó con la implementación de 010 antes de editar sus productores: tabla y asistencia de éxito, rechazo de código y reserva pendiente. Las recuperaciones HTTP coinciden exactamente con sus cuerpos y estados anteriores (200, 422, 202), incluidas las protecciones de la respuesta. El dump SQL completo no cambia al recuperar y el validador no se ejecuta. Al caducar, se rechazan incluso los éxitos anteriores, se limpian operaciones y se conserva la asistencia.
- La revisión del flujo comprobó que la clausura se construye después de salir de A, nunca en un retorno dentro de su transacción; consume su marca bajo Lock antes de entrar en B. Los fallos de commit A y B siguen cubiertos por los casos anteriores. La tercera reserva válida conserva su evaluación aunque el presupuesto libre sea cero.
- La traducción de HTTP queda en race_http.py. Dominio y casos de uso no contienen Outcome, _Execution, result_status ni decisiones por códigos HTTP. El almacenamiento conserva solo la codificación fija del formato anterior, sin migración ni cambios de consultas ajenas a complete_operation.
- `git diff --check` sin incidencias. Sin cambios en static/, requisitos, constitución, esquema ni specs históricas. El listado de alumnos y las consultas SQL siguen pendientes para otras tareas, según 010.

Durante la adaptación se corrigieron errores de la propia verificación: una ruta de ejecución inicial, un reemplazo que afectó temporalmente al nombre status_code en los tests y la elección del permiso en una prueba concurrente tras pasar el motivo de error de número a texto. No se relajaron las aserciones ni los límites. Las ejecuciones intermedias fallidas no se presentan como verificación final.

Las revisiones de compañeros y el merge siguen pendientes. La aplicación conserva su comportamiento; esta ejecución no atribuye una nueva prueba manual o aprobación final a Miguel.


## Revisión independiente de 011

Una segunda lectura encontró un fallo real en el tratamiento de un motivo de error desconocido: el acceso directo al diccionario de estados lanzaba KeyError dentro del propio handler, por lo que Flask podía registrar el mensaje original. Se sustituyó por una consulta explícita y la respuesta técnica ya sanitizada; el test comprueba también que ni el motivo ni el mensaje aparecen en los logs. Las 24 pruebas específicas pasan después de esta corrección. Las reglas A/B y la recuperación anterior se revisaron de nuevo; esta revisión técnica no se atribuye a un compañero del curso.


## Sincronización final de la entrega

La rama de 011 se sincronizó por merge normal con la base actualizada de 010, `57a7fb20398c5f773fadfabca80898ee08d1a2de`, que ya incorpora staging después de #284. No se cambió el destino de ninguna PR ni se publicó directamente en staging.

Verificación final después de esa sincronización y de la corrección del handler: **250 pruebas pasan en 5,59 s** con el mismo comando. El diff exclusivo contra esa base contiene 16 archivos de esta app, todos de 011; no incluye cambios en specs anteriores, pantallas, requisitos o esquema. La comprobación `git diff --check` de ese diff no encuentra incidencias. El whitespace heredado de archivos de otros alumnos no forma parte del cambio y no se modifica.


## Datos sintéticos del fixture · revisión de GitGuardian

GitGuardian señaló las tres credenciales aleatorias del fixture inicial como Generic High Entropy Secret. Esas cadenas se generaron durante T01 con las operaciones de 010 en una base nueva `old.sqlite` de un TemporaryDirectory `011-before-`; nunca procedieron de una base, servicio o acceso real. La base usó el token de profesor `fixture-teacher`, reloj fijo y las tres operaciones de prueba documentadas.

Para evitar cadenas ambiguas en las nuevas versiones se regeneraron ambos fixtures ejecutando el código archivado de 010 (`93c3200`), sustituyendo únicamente su fuente de aleatoriedad por valores sintéticos deterministas: identificador `fixture1`, credenciales de 43 caracteres con prefijo `test_fixture_` y relleno de ceros, y secreto de prueba de dieciséis bytes cero. El propio código anterior volvió a producir los hashes, CSRF, huellas y respuestas esperadas. No se alteraron validadores ni garantías de producción, aserciones, presupuestos o respuestas; los tres casos conservan 200/422/202.

Verificación posterior: **250 pruebas pasan en 7,81 s**, con el mismo comando y entorno. `git diff --check` sin incidencias. El commit de corrección es normal y conserva el historial; la clasificación de las tres alertas históricas como credenciales de prueba se gestiona en GitGuardian, sin desactivar reglas ni añadir exclusiones generales.
