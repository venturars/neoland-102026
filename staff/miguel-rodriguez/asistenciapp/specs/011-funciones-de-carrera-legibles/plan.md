# Plan 011 · Reglas y resultados de carrera legibles

Estado: revisado; ejecución completa autorizada por Miguel el 2026-10-26 al pedir terminar el trabajo pendiente y dejarlo para revisión.
Fecha: 2026-10-26. [Spec](spec.md) aprobada; tareas y ejecución registradas en [tasks.md](tasks.md).
Issue #363 · PR #364 en draft, destino staging; depende de #362.

## 1. Alcance y referencia

Referencia de comportamiento: `93c320005f18fb4a9f7ba7c940a0d4c43a435f40`, base revisada de 010. No se afirma que esté integrada en staging. Se aplican las reglas aprobadas de AGENTS.md §8 y la constitución 4.1.

Eliminar Outcome y _Execution, quitar decisiones HTTP del dominio y de los casos de uso y adaptar sus consumidores necesarios. No rediseñar la carrera ni reorganizar conexiones, roster o SQL. Conservar phase, valid_operation_id, constantes y demás funciones claras salvo documentación afectada. No crear módulos genéricos ni añadir dependencias.

## 2. Resultados y errores · CA-01–CA-03, CA-07

### domain/race.py

- Eliminar Outcome y su import de dataclass.
- Mantener un único error RaceError con `reason` y mensaje en español. Su constructor solo guarda el motivo; no ejecuta reglas ni contiene números HTTP. No crear una subclase por cada caso ni un catálogo extensible de errores.
- Usar motivos que describan lo ocurrido: `race_missing`, `access_denied`, `state_conflict`, `entry_closed`, `access_expired`, `invalid_input`, `attempts_exhausted`, `storage_busy` y `origin_unavailable`. Los rechazos exclusivos de la entrada HTTP pueden usar `payload_too_large` y `unsupported_content` en ese adaptador. No crear nombres como error_403.

### usecases/races.py y consumidor attendance.py

Las operaciones de consulta siguen devolviendo sus diccionarios actuales. Solo el resultado de un intento pasa de Outcome a una tupla `(data, result_kind)` concreta de carrera. No se añade una envoltura a todas las funciones ni un constructor genérico de resultados.

| result_kind | Significado | Traducción en race_http.py |
| --- | --- | --- |
| registered | Asistencia nueva confirmada. | 201 |
| already_registered | Recuperación de asistencia confirmada. | 200 |
| removed | Asistencia retirada por el profesor. | 200 |
| unconfirmed | Reserva gastada sin resultado confirmado. | 202 |
| invalid_operation | Identificador de envío no válido. | 400 |
| invalid_code | Código inválido o caducado. | 422 |
| not_processed | Reserva que ya no puede registrarse por el estado actual. | 409 |

Conservar los cuerpos, mensajes y la precedencia de _operation_result: retirado antes que reserva pendiente; recuperación de éxito con already y respuesta 200 aunque el registro original devolviera 201. No usar result_status para decidir en el caso de uso.

Cambiar los raises y comparaciones de `.status` por motivos. Los bloques de limpieza que ahora reaccionan a 410 siguen reaccionando a `access_expired` y `entry_closed`; la conversión de contención en resultado sin confirmar después de reservar sigue reaccionando únicamente a `storage_busy`. No ampliar los catch a cualquier error ni cambiar el orden de comprobaciones. En attendance.py solo se adapta el rechazo que impide registrar una carrera por el camino normal; las operaciones de clases normales quedan intactas.

### race_http.py

Adaptar answer para distinguir el diccionario de consulta de la tupla de intento y traducir result_kind a estado HTTP mediante una tabla local pequeña. Traducir RaceError.reason con otra tabla explícita: invalid_input→400, access_denied/origin_unavailable→403, race_missing→404, state_conflict→409, entry_closed/access_expired→410, payload_too_large→413, unsupported_content→415, attempts_exhausted→429 y storage_busy→503. La configuración de origen ausente conserva 503 mediante un motivo propio `origin_not_configured`, distinto de un origen de visitante no fiable.

Conservar Retry-After en 503, Cache-Control: no-store, cookies, cabeceras, JSON, autenticación y límites de cuerpo/origen. Cambiar las llamadas del adaptador al error para usar motivos; no mover reglas del transporte al dominio. Un motivo o resultado interno desconocido es un fallo técnico, nunca un éxito por defecto. No se registra su contenido ni datos secretos.

## 3. Permiso local de una evaluación · CA-01, CA-03–CA-06

Sustituir _Execution por una función local de un solo uso, creada únicamente tras salir con éxito de la transacción de reserva A. Captura en el servidor los identificadores, el código ya validado y los datos necesarios para finalizar; no recibe datos nuevos del navegador al ejecutarse. No se persiste, serializa, devuelve por HTTP ni reconstruye desde una operación guardada.

_reserve devuelve un resultado de intento ya resuelto o esa función. attempt comprueba si recibió una función y la ejecuta una vez; de lo contrario devuelve el resultado recuperado. No hay registro global de permisos, generador de tokens nuevo ni segunda ruta de reanudación.

La función conserva una marca local `used`. Un Lock local de biblioteca estándar protege únicamente la comprobación y el cambio de esa marca; después se libera antes de acceder a la base. Un segundo uso lanza RuntimeError. La marca se consume antes de entrar en B y no se restablece si B falla. El cierre de esta función es la única entrada de producción a la evaluación de una reserva nueva.

Esta pequeña clausura conserva estado privado sin una clase propia; el Lock impide que dos llamadas simultáneas a la misma función pasen la comprobación. No reemplaza los bloqueos de la base ni cambia los presupuestos. Son los únicos mecanismos nuevos de esta sustitución; no se generalizan para otras operaciones.

_finalize recibe los datos capturados y conserva su transacción B, lecturas del reloj después de bloquear, comprobación de acceso, fase y operación reservada. El resultado, asistencia y posible cierre se confirman juntos. No se combina A con B ni se entrega una función si el commit de A falla o es incierto. Repetir la solicitud solo recupera el resultado guardado y nunca crea esta función.

Mantener la tercera reserva válida evaluable aunque queden cero oportunidades. Cierre, retirada, éxito previo, fallo de conexión y caducidad entre A y B conservan sus resultados y no abren una evaluación adicional.

## 4. Compatibilidad de operaciones guardadas · CA-02, CA-05–CA-09

Conservar tablas, restricciones, columnas y datos anteriores, incluida result_status. La versión anterior ya guarda result_kind; usarlo para reconstruir el resultado semántico sin volver a evaluar códigos. No se migran ni reescriben filas antiguas.

Modificar únicamente complete_operation en storage/races.py para que reciba el tipo de resultado y la asistencia opcional, sin un estado HTTP decidido por el caso de uso. Dentro del almacenamiento, una correspondencia fija conserva el formato antiguo de result_status: success→201, already→200, invalid_operation→400, invalid_code→422 y not_processed→409. Es una codificación de compatibilidad del esquema existente, no la política de respuesta al navegador ni un sistema de proveedores. La lectura mantiene las columnas anteriores; el caso de uso no utiliza el número heredado.

No confundir formatos: una fila success conserva 201 almacenado, pero repetir su solicitud responde 200; una fila reserved conserva sus campos de resultado vacíos y responde unconfirmed/202. Conservar los mensajes distintos que ya existen al recuperar una reserva y al encontrar contención durante B.

La compatibilidad se demuestra con los estados realmente producidos por la versión anterior. No se normalizan datos corruptos ni se inventan significados para tipos de resultado desconocidos. Adaptar los callers de complete_operation y sus tests, sin tocar las demás consultas, el esquema o la gestión de conexiones.

## 5. Archivos y orden de implementación

1. Preparar pruebas de equivalencia y datos ficticios anteriores antes de cambiar sus productores.
2. Cambiar domain/race.py y sus consumidores de errores como un conjunto coherente, manteniendo las pruebas del borde HTTP.
3. Sustituir Outcome en usecases/races.py y race_http.py; adaptar la codificación de compatibilidad de complete_operation.
4. Sustituir _Execution y adaptar sus pruebas, conservando A y B.
5. En funciones tocadas, usar nombres como connection, session_id, race, slot y operation_id; descomponer expresiones mezcladas y corregir comentarios poco claros. No reformatear módulos completos ni extraer helpers por cada línea.
6. Actualizar solo las secciones de arquitectura que describen los resultados y permisos cambiados, y la fila de seguimiento de 011 en AGENTS.md. Conservar como pendientes el roster y SQL embebido. Registrar evidencia en tasks.md cuando exista; no tocar specs históricas.

Archivos ejecutables previstos: asistencia/domain/race.py, asistencia/usecases/races.py, asistencia/usecases/attendance.py, asistencia/race_http.py y la función complete_operation de asistencia/storage/races.py. Tests afectados: los consumidores del contrato interno en test_race_domain, test_race_usecases, test_race_concurrency, test_race_review_regressions y test_race_storage. Las pruebas HTTP y QR conservan sus aserciones externas; solo se adapta cualquier import o comprobación interna que realmente cambie. Los escenarios nuevos se agrupan en tests/test_race_refactor.py, con un fixture de datos anteriores si hace falta, sin un framework de comparación.

## 6. Verificación y evidencia

Usar el entorno existente, datos ficticios temporales y reloj fijo. Obtener una única copia temporal de referencia de la app desde el commit indicado; no clonar todo el repositorio ni abrir bases reales. Antes del cambio, generar allí éxitos, rechazos y reservas pendientes mediante la implementación anterior y conservar copias de esos datos para probar la versión nueva. No fabricar exclusivamente con código nuevo las filas que se presentan como antiguas.

Comparar las respuestas y efectos de ambas versiones sobre datos iniciales equivalentes. Compartir las mismas copias de datos semilla evita comparar secretos o identificadores aleatorios distintos; no eliminar campos de seguridad del contraste para hacerlo pasar. No crear manifiestos de hashes ni una plataforma de pruebas adicional. Registrar procedimiento, comandos y resultados, y retirar únicamente los temporales de esta tarea al terminar.

| Criterios | Comprobación |
| --- | --- |
| CA-01–CA-03 | Revisar los módulos afectados: sin Outcome/_Execution, sin números HTTP en decisiones de dominio/casos de uso, nombres y pasos legibles, sin capas nuevas. Leer el recorrido completo del intento, no solo buscar símbolos. |
| CA-04 | Contar llamadas al validador: una por función de ejecución nueva, cero por repetición o lectura. Segunda llamada secuencial o simultánea a la misma función rechazada; commit A fallido o incierto nunca entrega permiso. |
| CA-05–CA-06 | Conservar pruebas de concurrencia por plaza, tres intentos, tercera reserva válida, contenido distinto, respuesta perdida, fallo posterior a A, contención, retirada/cierre y caducidad durante esperas o carga de resultados. No relajar aserciones al adaptar el contrato interno. |
| CA-07 | Comprobar mismos cuerpos, estados y cabeceras en el recorrido y matriz de errores; incluir Retry-After, no-store, cookie, origen, JSON y ruta normal bloqueada para carreras. |
| CA-08–CA-09 | Abrir con la nueva versión copias de los datos anteriores y recuperar éxito, rechazo y reserva sin resultado; comprobar consumo, contador de evaluaciones, fechas, puestos y esquema intactos. Repetir en caducidad: no devolver éxitos antiguos. Verificar retirada, exportación y clases normales. |

Ejecutar `python -m pytest -q` con el intérprete existente después de los cambios coherentes y la suite completa antes de cerrar. No eliminar casos, aumentar presupuestos ni convertir fallos en éxitos. Si falla una comprobación, corregir la causa dentro de la spec; una necesidad de cambiar el contrato o las garantías requiere volver a revisar documentos.

No se cambia el frontend, así que no se repiten ensayos de diseño ni se añaden animaciones. La prueba HTTP existente usa sus servidores loopback temporales y debe cerrarlos. No publicar un túnel ni ejecutar scripts de ataque externos. Las pruebas de instrucciones o la revisión de lectura no se presentan como una aprobación nueva de Miguel o de compañeros.

## 7. Comprobación de la constitución

- **P1:** mismo registro independiente de plataformas.
- **P2:** funciones, una tupla concreta, motivos explícitos y un permiso local; sin proveedores, jerarquías o capas genéricas. La clausura de un uso resuelve la sustitución real de _Execution y conserva su garantía.
- **P3 y §3:** mismas dependencias y stack; Lock pertenece a la biblioteca estándar. Sin nuevos servicios ni herramientas.
- **P4:** mismos datos locales y caducidad; solo datos ficticios para pruebas, sin registrar permisos, códigos o secretos.
- **P5–P6:** pantallas y accesibilidad intactas, mensajes conservados en español y documentación clara.
- **§4:** spec aprobada; plan y tareas requieren aprobaciones separadas antes de implementar.
- **§5:** pruebas de comportamiento por criterio y lectura del flujo; resultados reales en la evidencia.
- **§6:** presupuesto, evaluación única, autorización, origen, recuperación y caducidad conservados; mismas fronteras transaccionales.
- **§7–§8:** solo esta app; no se modifica la constitución ni se necesita enmienda.

## 8. Cierre de la fase

Miguel autorizó el 2026-10-26 completar el trabajo pendiente y prepararlo para revisión. Las tareas y la evidencia distinguen esta autorización de las aprobaciones anteriores y de la revisión de compañeros aún pendiente. No se atribuyen pruebas nuevas a las ejecuciones anteriores de 010.
