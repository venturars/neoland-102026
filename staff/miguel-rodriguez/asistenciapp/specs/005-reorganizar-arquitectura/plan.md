# Plan 005 · Documentos y arquitectura por responsabilidades

Estado: aprobado por Miguel el 2026-10-23. Creado el 2026-10-23. Implementada y verificada el 2026-10-23; revisión final aprobada por Miguel el 2026-10-23.

Referencias: [spec aprobada](spec.md), [constitución vigente](../../docs/CONSTITUTION.md), [manual vigente](../../AGENTS.md), [issue #281](https://github.com/venturars/neoland-102026/issues/281) y [PR #284](https://github.com/venturars/neoland-102026/pull/284). La PR depende de #252; el destino final es staging.

## Alcance y organización

Implementación propia a partir de los contratos y código actuales de esta copia. La organización objetivo es:

```text
asistenciapp/
├── AGENTS.md
├── README.md
├── docs/
│   ├── CONSTITUTION.md
│   └── ARCHITECTURE.md
├── app.py
├── asistencia/
│   ├── __init__.py
│   ├── domain/
│   │   ├── __init__.py
│   │   ├── codes.py
│   │   ├── names.py
│   │   └── session.py
│   ├── usecases/
│   │   ├── __init__.py
│   │   └── attendance.py
│   ├── storage/
│   │   ├── __init__.py
│   │   └── sqlite.py
│   ├── export.py
│   ├── tunnel.py
│   └── hack-etico.sh
├── specs/005-reorganizar-arquitectura/
└── tests/
```

El árbol muestra los cambios relevantes; se conservan static/, specs 001–004, requirements.txt, pytest.ini, .venv y los datos existentes. No se ejecuta hack-etico.sh. Sin repositorios genéricos, interfaces de persistencia, nuevas aplicaciones de consola, dependencias o herramientas adicionales.

## Documentos y enmienda · CA-01–CA-03, CA-08–CA-10

- Mover CONSTITUTION.md a docs/CONSTITUTION.md. Proponer versión **2.4**, partiendo de nuestra 2.3, con fecha real de implementación y una fila nueva de historial. Cambiar únicamente las referencias a organización y ubicaciones: documentos en docs/, guía AGENTS.md y límites de las capas. Conservar íntegros propósito, principios P1–P6, stack, privacidad, seguridad, aprobaciones y excepción documental de §5. No copiar la numeración de otra aplicación.
- Renombrar AGENT.md a AGENTS.md. Actualizar lectura inicial, enlaces, árbol, nombre del propio manual y seguimiento de 005. Conservar las reglas actuales y los estados históricos. Añadir pautas de escritura: responsabilidad del módulo, tipos en las funciones modificadas, explicación de parámetros y resultado, y ejemplos breves de uso; una función se ocupa de una tarea. Las pautas nuevas se aplican al código creado o modificado en 005, sin reescribir módulos ajenos para añadir comentarios.
- Crear docs/ARCHITECTURE.md: responsabilidades, dirección de dependencias, flujo de un registro y ubicación de datos, exportación y túnel. Explicar la solución concreta, sin pedir herramientas que la app no utiliza.
- Actualizar en README.md solo los enlaces afectados por los documentos movidos o renombrados y añadir el enlace a arquitectura. Conservar comandos, rutas genéricas, numeración y demás explicaciones.
- Mantener los doce documentos de specs 001–004 byte a byte. Sus referencias a nombres antiguos son históricas; AGENTS.md y ARCHITECTURE.md indicarán dónde están ahora esos documentos. No alterar resultados ni pendientes históricos como si pertenecieran a esta ejecución.

La aprobación del plan autorizará esta enmienda concreta, pero solo se aplicará tras aprobar por separado las tareas. Hasta entonces no se modifica la constitución ni el manual.

## Reglas del producto · CA-04, CA-07

Mover asistencia/codes.py y asistencia/names.py a asistencia/domain/, conservando algoritmos, firmas y mensajes. Adaptar únicamente los imports que los utilizan y la documentación de funciones afectadas.

Crear domain/session.py para las decisiones de existencia y cierre de sesión y la validación de un registro usando las reglas existentes de nombres y códigos. No importa Flask, almacenamiento ni casos de uso. Las funciones reciben los datos necesarios; no abren archivos ni conexiones.

Los errores de sesión inexistente, sesión cerrada y código inválido se expresan mediante excepciones de dominio concretas, sin códigos HTTP. Se conserva ValueError para el nombre inválido. No introducir una jerarquía genérica de errores ni reglas nuevas.

Conservar la precedencia observable actual: sesión inexistente antes de comprobar cierre; cierre antes de validar nombre; nombre antes de código; el código se valida antes de resolver un duplicado. Un duplicado válido conserva su respuesta de éxito existente y no crea otro registro.

Corrección de revisión autorizada por Miguel el 2026-10-23: la entrada pasa los datos recibidos sin extraer nombre ni código. La acción obtiene la sesión y el dominio comprueba existencia y cierre antes de leer esos campos. Así se conserva también la precedencia anterior ante cuerpos JSON que no sean objetos. Se mantiene el comportamiento previo de los demás casos; no se añade una regla nueva de formato.

## Persistencia · CA-05, CA-07

Mover asistencia/db.py a asistencia/storage/sqlite.py. Conservar esquema, SQL, transacciones, generación de identificadores y secretos y conversión entre hexadecimal y bytes. No migrar, vaciar ni recrear datos. Mantener las tablas config, sessions y checkins y el token persistente del profesor.

Las funciones reciben una conexión y ejecutan operaciones concretas de datos como ahora. No importan domain, usecases ni Flask, ni deciden si un alumno puede registrarse. Las restricciones de integridad existentes siguen en el esquema.

La apertura y cierre de conexiones quedan fuera de app.py. Cada acción utiliza una conexión propia mediante connect() del almacén y cierre garantizado con contextlib.closing, incluso al lanzar una excepción. Los bloques transaccionales de escritura actuales se conservan. No añadir pools ni una conexión global compartida entre peticiones.

## Acciones y entrada · CA-06–CA-07

Crear asistencia/usecases/attendance.py con funciones concretas:

| Acción | Responsabilidad y resultado |
| --- | --- |
| prepare(db_path, token=None) | Inicializar como antes y devolver el token suministrado o persistente. |
| public_session(db_path, session_id) | Devolver solo título y estado abierto; sin lista ni secreto. |
| create_session(db_path, title, now) | Conservar limpieza del título y título por fecha cuando falta; devolver los datos de la sesión. |
| list_sessions(db_path) | Devolver sesiones en el orden y con los campos actuales. |
| check_in(db_path, session_id, fields, now) | Obtener sesión, aplicar reglas y persistir; devolver registro y si se creó. |
| teacher_view(db_path, session_id, now) | Preparar datos, total, registros y código cuando procede, sin construir una URL HTTP. |
| close_session(db_path, session_id, now) | Verificar existencia y cerrar sin cambiar una fecha de cierre ya guardada. |
| remove_checkin(db_path, session_id, checkin_id) | Verificar sesión y eliminar solo el registro que le pertenece; devolver si se eliminó. |
| export_session(db_path, session_id) | Obtener la sesión y sus registros para la exportación existente. |

Los casos de uso coordinan domain y storage y devuelven datos ordinarios o errores de dominio, sin respuestas Flask. El reloj sigue siendo un argumento, con el formato UTC de milisegundos actual para persistencia; se mantiene la hora local del título por defecto y del CSV.

app.py conserva create_app(db_path=DEFAULT_DB, token=None, now=time.time), las rutas, métodos, autenticación, tratamiento de errores HTTP, configuración del proxy, estáticos y arranque. Delega las acciones en attendance. Traduce errores de dominio a los mismos estados y mensajes: sesión inexistente 404, cerrada 409, nombre inválido 400 y código inválido 422. Conserva el registro nuevo 201, duplicado 200 y falta de token 401.

La URL pública del alumno se construye en el borde HTTP con request.host_url, como antes. La respuesta CSV conserva nombre de archivo, MIME, cabecera de descarga y contenido producido por export.py. No modificar export.py, tunnel.py ni static/. app.py no importa sqlite3 ni storage y deja de gestionar flask.g y conexiones.

## Pruebas y evidencia · CA-01–CA-10

Antes de editar, capturar fuera del proyecto inventario de rutas y SHA-256 de todos los archivos pertinentes, excluyendo .venv, cachés y artefactos de ejecución. Conservar copia de documentos, código y esquema previos. No copiar ni abrir bases de trabajo para los tests; si existen, comprobar sus bytes mediante hashes.

Usar el intérprete del .venv autorizado, sin instalaciones. Preparar dos copias desechables: referencia anterior y versión reorganizada. Crear únicamente datos ficticios temporales y un reloj fijo. Capturar en la referencia una base con token, sesiones abiertas y cerradas y registros; reutilizar copias de esa base en la versión nueva para verificar compatibilidad sin migración. No arrancar servidores ni túneles.

| Criterios | Verificación |
| --- | --- |
| CA-01–CA-03, CA-08–CA-09 | Comprobaciones documentales de ubicaciones, enlaces actuales, responsabilidades, pautas de funciones y enmienda 2.4. Comparar secciones protegidas e historial con la captura. |
| CA-04–CA-06 | Tests de imports mediante AST y revisión de llamadas: dominio sin Flask/storage/usecases; almacenamiento sin Flask/domain/usecases; app.py sin sqlite3/storage; acciones sin Flask. Verificar reglas de sesión sin base de datos. |
| CA-07 | Ejecutar los 77 tests existentes, cambiando solo imports necesarios de codes y names. No eliminar pruebas ni relajar aserciones. Añadir pruebas pertinentes para reglas extraídas, cierre de conexiones ante error y compatibilidad de datos previos. |
| CA-07 | Comparar mediante el cliente de pruebas las respuestas de ambas versiones con datos y reloj equivalentes: sesión pública, lista, vista del profesor, registro válido e inválido, duplicado, cierre, eliminación, exportación y autenticación. Conservar estados, campos, mensajes y datos; no fijar valores aleatorios como constantes esperadas. |
| CA-10 | Inventario y SHA-256 de specs 001–004, static/, export.py, tunnel.py, script, requisitos, configuración y datos de trabajo iguales al final; sin altas o bajas ajenas al alcance. |

Las pruebas nuevas serán locales a tests/, con biblioteca estándar y pytest existentes. No crear manifiestos de hashes dependientes del equipo ni invocar Git desde las pruebas. Las capturas de esta ejecución son temporales. El inventario distingue movimientos aprobados de modificaciones y comprueba también los archivos añadidos o eliminados.

Registrar en tasks.md el comando exacto, versiones, resultados por criterio y cualquier bloqueo. Los 77 resultados anteriores no sustituyen la ejecución de 005. El cliente de pruebas no demuestra por sí solo funcionamiento real del túnel o del navegador: el cambio no modifica esas piezas. Eliminar copias, bases de prueba y capturas; conservar .venv y datos de trabajo intactos.

## Comprobación de la constitución

- **P1:** no se añaden integraciones; asistencia independiente de plataforma.
- **P2:** módulos concretos por responsabilidad, sin abstracciones genéricas ni herramientas adicionales.
- **P3 y §3:** Python, biblioteca estándar, Flask y pytest existentes; sin nuevas dependencias ni cambio de stack.
- **P4:** mismos datos, esquema y almacenamiento local; sin nuevas capturas de IP u otros datos personales.
- **P5–P6:** pantallas intactas; documentos y mensajes en español.
- **§4:** spec aprobada; plan y tareas requieren aprobaciones separadas antes de implementar.
- **§5:** pruebas automatizadas para la reorganización del código y regresiones; verificación documental concreta para instrucciones, con evidencia diferenciada.
- **§6:** códigos, validaciones, duplicados, autenticación y cierre conservados; seguridad por IP fuera de 005.
- **§7–§8:** solo esta aplicación; enmienda limitada a organización, propuesta expresamente y pendiente de aprobación.

## Límites y cierre

No cambiar las specs cerradas ni corregir sus estados históricos en esta tarea. La aprobación final de 002 consta en su PR. Las autorizaciones actuales de Miguel para Git prevalecen sobre notas históricas de ejecución manual; se mantendrán commits pequeños y el alcance de 005, sin incluir archivos de otras aplicaciones.

Si aparecen contratos incompatibles, necesidad de migración o cambios no previstos, detener el trabajo afectado y revisar el plan antes de seguir. Tras aprobar el plan, preparar las tareas para otra revisión; no implementar antes de esa aprobación. El cierre final actualizará solo los documentos de 005 y su seguimiento vigente, con resultados reales y revisión final de Miguel pendiente.
