# Plan 012 · Alumnos y personajes en almacenamiento

Estado: aprobado por Miguel el 2026-10-27, incluido el ajuste del tratamiento de errores en el panel.
Fecha: 2026-10-27.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-10-27.
Issue: [#524](https://github.com/venturars/neoland-102026/issues/524).
PR: [#525](https://github.com/venturars/neoland-102026/pull/525), en draft y dirigida a `staging`.

## Objetivo y base revisada

Separar los datos concretos del grupo de las reglas del dominio. La aplicación utilizará un catálogo persistente para las carreras nuevas; cada carrera conservará los datos que ya guarda en sus plazas. No se añade administración de grupos ni se refactoriza el almacenamiento completo.

La base revisada contiene una lista `ROSTER` en `asistencia/domain/roster.py`. `usecases/races.prepare` la pasa a `storage/races.create`, que ya copia clave, nombre y personaje a `race_slots`. Las vistas del profesor, lobby y alumno leen esas plazas guardadas. En cambio, `join` y `release` todavía resuelven nombres contra la lista global. Esos dos puntos deben pasar a resolver contra las plazas de su carrera, no contra el catálogo actual.

La preparación general `attendance.prepare` crea el esquema existente y obtiene el token del profesor. Se conserva. El catálogo se prepara de forma diferida dentro de la primera operación de preparar una carrera nueva: no se escribe al importar módulos ni se modifica una carrera anterior al arrancar la app. Esto permite consultar y continuar carreras anteriores aunque el catálogo de carreras nuevas esté vacío o no disponible.

## Modelo mínimo y fuentes de datos

Se mantiene la base local existente. Se añade una tabla `students`:

| Campo | Uso y restricción |
| --- | --- |
| `roster_key` | Texto, clave primaria; conservar las claves actuales, sin regenerarlas a partir del nombre. |
| `display_name` | Texto no nulo: nombre que se presenta y copia al preparar una carrera. |
| `character_slug` | Texto no nulo: referencia al personaje existente. |
| `display_order` | Entero no negativo y único: orden del catálogo. |

El catálogo inicial se conserva en un único archivo de datos, `asistencia/storage/data/initial-students.csv`, con las quince correspondencias y su orden actual. No es una fuente de consultas en cada carrera: solo se lee durante la primera preparación. No contiene emails, secretos ni datos de asistencia. Los SVG y su presentación no cambian.

Se registra la preparación completada con la entrada `student_catalog_version = "1"` en la tabla `config` existente. Es un indicador de una preparación concreta, no un sistema genérico de migraciones. No se modifica ni sustituye `teacher_token`.

No se añaden claves externas desde carreras o plazas al catálogo. `sessions` y `race_slots` ya representan la clase concreta y sus participantes; el catálogo sirve para preparar nuevas plazas. Una modificación del catálogo no puede borrar, renombrar o reasignar las plazas de una carrera anterior ni sus permisos o envíos.

### Estados de preparación y lectura

| Situación observada | Acción |
| --- | --- |
| No existe `students` y no existe el indicador | Primera preparación, incluida una instalación anterior a 012: crear tabla, incorporar datos iniciales y guardar el indicador en la misma transacción. |
| Tabla e indicador `"1"` presentes, con datos válidos | Leer por `display_order`. No cargar el CSV, insertar, sustituir ni reparar filas. |
| Tabla e indicador `"1"` presentes, sin alumnos | Catálogo preparado vacío. Rechazar la carrera nueva con el error de catálogo vacío; no reponer los quince alumnos. |
| Solo existe la tabla o solo el indicador; indicador desconocido; esquema incompatible | Estado incoherente: rechazar sin crear o reparar datos. |
| Falla la consulta del estado, lectura de datos o preparación inicial | Rechazar sin interpretar el fallo como ausencia del catálogo. Revertir los cambios todavía no confirmados de esta operación. |

La ausencia simultánea de tabla e indicador es el estado observable de una instalación anterior; no permite detectar que alguien haya eliminado deliberadamente ambos desde fuera de la app. No se añade un sistema de auditoría para ese supuesto. Se distingue esa ausencia de un resultado de consulta fallido: no se usa un `except` que devuelva catálogo vacío o active la carga inicial. La preparación repetida de un catálogo inicializado tampoco valida su contenido contra el CSV ni lo restaura si difiere.

Los datos se validan como registros concretos antes de preparar plazas: claves, nombres y personajes no vacíos, claves únicas, nombres no ambiguos bajo `name_key` y referencias sin colisiones entre alumnos para la resolución existente. La misma validación se aplica al CSV inicial y al catálogo guardado: cada `display_order` debe ser un entero no negativo y único; no se exige que las posiciones sean consecutivas. Cada personaje debe corresponder a uno de los SVG locales que admite la presentación actual. El almacenamiento obtiene los slugs de los archivos `.svg` de `static/race-characters/`, mediante ruta relativa al proyecto; el caso de uso los pasa como datos explícitos al validador puro. No se construyen rutas desde el texto de un personaje ni se lee el sistema de archivos desde el dominio. Las pruebas comprueban que esos activos coinciden con los slugs admitidos por `race-renderer.js`, sin modificar la presentación ni añadir otro listado de alumnos. Un personaje desconocido o un orden inválido produce `catalog_unavailable`, sin corregir filas ni crear la carrera. Un catálogo vacío se trata por separado, no como un error de lectura. La validación no cambia la normalización de nombres ni permite nuevos tipos de entrada en las rutas.

La carga inicial valida las cuatro columnas esperadas, quince filas completas, posiciones enteras no negativas y distintas, y registros válidos. Las pruebas comparan nombres, claves, personajes y orden con una referencia independiente de la versión anterior; el código de producción no duplica las quince correspondencias para comprobarlas. Estas restricciones del archivo inicial no imponen quince alumnos como límite del catálogo persistente. Las pruebas deben demostrar que datos válidos distintos, incluidos un número diferente de alumnos, se consumen sin cambiar código del dominio.

## Transacciones y conservación

La preparación del catálogo se ejecutará dentro del `BEGIN IMMEDIATE` que `races.prepare` ya obtiene. Se comprueba el estado después de adquirir el bloqueo y antes de insertar la nueva sesión. Se usan sentencias `execute`/`executemany`, no `executescript`, para evitar confirmaciones implícitas dentro de esta transacción.

Crear tabla, incorporar el grupo inicial, guardar el indicador y crear la carrera con sus plazas se confirman juntos por el caso de uso existente. Las funciones de almacenamiento no abren conexiones ni hacen commits. Si falla un paso antes de confirmar, se revierte la transacción pendiente sin dejar tabla/filas/indicador parciales, sesiones vacías o cambios en carreras previas. Si el commit se completó pero después hubo un fallo o se perdió la respuesta, un rollback posterior no deshace lo confirmado. Se conserva ese estado íntegro y se comunica el fallo sin reconstrucción ni reintento automático. Ante un resultado incierto de la confirmación, la siguiente petición comprueba tabla e indicador desde una conexión nueva: usa el catálogo si quedó confirmado, inicia la primera preparación solo si ambos siguen ausentes y rechaza cualquier estado incoherente. Un error por sí solo nunca significa que la preparación no ocurrió. Esto no añade idempotencia a la creación de carreras: una nueva petición explícita puede crear otra carrera, igual que ahora; no se promete recuperar la respuesta perdida ni deduplicar sesiones en esta tarea.

Dos preparaciones concurrentes serializan su comprobación del estado. Solo una incorpora los datos iniciales; la siguiente lee el catálogo confirmado. Los bloqueos conservan el tratamiento acotado de ocupado existente. No se añaden reintentos automáticos ni reparaciones de datos.

Para una carrera nueva ya inicializada: leer y validar catálogo, rechazar si está vacío, leer el reloj después del bloqueo y de la preparación del catálogo, y continuar con la creación actual. Conservar duración, secretos, fases y número de oportunidades. No publicar el estado interno del catálogo ni datos nuevos en las respuestas de carrera.

No se modifican `race_slots`, `race_access`, `race_operations`, `checkins`, `sessions`, direcciones bloqueadas o intentos previos durante la preparación del catálogo. La única adición a `config` es el indicador. Al preparar una carrera nueva se siguen insertando sus filas normales; no se reconstruyen las anteriores. La limpieza vigente de temporales caducados se conserva y se prueba separadamente de esta preparación.

## Archivos y responsabilidades

Rutas relativas a `staff/miguel-rodriguez/asistenciapp/`:

| Archivo | Cambio previsto |
| --- | --- |
| `asistencia/domain/roster.py` | Retirar `ROSTER`; conservar resolución como función pura con datos explícitos y añadir validación concreta del catálogo. No leer archivos ni importar almacenamiento. |
| `asistencia/storage/roster.py` | Nuevo módulo de operaciones concretas: consultar indicador/tabla, crear catálogo, leer alumnos ordenados, insertar datos iniciales y registrar preparación. Leer el CSV inicial únicamente cuando lo pide el caso de uso y obtener las referencias de los SVG locales existentes. Conservar `display_order` en los datos leídos hasta validarlo. Sin commits, reglas HTTP ni lógica de asistencia. |
| `asistencia/storage/queries/roster/*.sql` | Nuevas consultas del catálogo, separadas: `read-state.sql`, `table-exists.sql`, `create-students.sql`, `insert-student.sql`, `mark-prepared.sql`, `list-students.sql`. Se cargan con rutas relativas al módulo; no se crea un ejecutor genérico. |
| `asistencia/storage/data/initial-students.csv` | Datos iniciales trasladados, una fila por alumno con posición, clave, nombre y personaje; única fuente inicial de producción. |
| `asistencia/usecases/roster.py` | Nueva coordinación concreta de preparación/lectura del catálogo sobre la conexión recibida. Decide los estados anteriores y traduce fallos esperados a errores de negocio. No maneja conexiones o transacciones paralelas. |
| `asistencia/usecases/races.py` | En `prepare`, obtener el catálogo dentro de su transacción y pasarlo a la creación existente. En `join`/`release`, resolver con las plazas ya guardadas en esa carrera. No tocar la reserva A, el permiso de un uso ni la confirmación B. |
| `asistencia/storage/races.py` | Solo actualizar el ejemplo de `create` que menciona la constante retirada. La creación ya recibe datos y guarda una instantánea; sus consultas y comportamiento permanecen. |
| `static/profesor.js` | En la acción de crear una carrera, mostrar mediante `showMessage` el mensaje de rechazo recibido de la API, como texto. Mantener el tratamiento actual de autenticación y errores de red/lectura de respuesta; no modificar el manejador global ni otras acciones. |
| `tests/browser/test-catalog-errors.mjs` | Probar la acción real del panel con respuestas controladas: catálogo vacío/no disponible, autenticación, fallo de red y creación satisfactoria. Sin dependencias nuevas. |
| `asistencia/race_http.py` | Añadir la traducción de los dos motivos de catálogo. Conservar rutas, autenticación, origen, CSRF, cookies, encabezados y respuestas satisfactorias. |
| `tests/test_roster_catalog.py`, `tests/test_roster_compatibility.py` | Nuevas pruebas de catálogo, primera preparación, fallos, persistencia y compatibilidad con estado anterior. |
| `tests/fixtures/012-original-roster.json`, `tests/fixtures/012-previous-state.sql` | Referencias independientes de la versión anterior y datos sintéticos. No contienen bases reales ni secretos de uso real. |
| `tests/test_race_domain.py`, `tests/test_race_concurrency.py`, `tests/test_race_live_http.py` | Sustituir imports del `ROSTER` retirado por datos explícitos de prueba o el grupo de la carrera. Conservar las aserciones de seguridad, concurrencia y resultados; no borrar ni rebajar casos para obtener verde. |
| `docs/ARCHITECTURE.md` | Reflejar catálogo/archivo inicial y fuente de plazas por carrera; retirar solo la corrección pendiente ya resuelta. Mantener pendiente la separación general del SQL anterior. |
| `README.md` | Explicar preparación única, conservación de datos y errores de catálogo vacío/no disponible, sin describir un panel de edición inexistente. |
| `AGENTS.md` | Añadir 012 y su fase a la tabla de estado, conservando instrucciones e historia de las demás specs. |
| `specs/012-alumnos-y-personajes-en-almacenamiento/` | Spec, plan, tareas y evidencia por criterio, sin atribuir aprobaciones o pruebas futuras. |

Se mantienen `storage/sqlite.py` y su esquema anterior, las consultas de asistencia/carreras existentes, los activos y el código de presentación salvo la acción de creación indicada en `static/profesor.js`, dependencias, configuración del entorno y specs históricas. La organización de archivos nueva se refleja en el árbol de arquitectura. No se crea un documento TREE paralelo, un panel, rutas nuevas de administración, un modelo multigrupo ni una API de edición de alumnos.

### Interfaces concretas

- `domain.roster.resolve_slot(value: object, roster: list[dict] | tuple[dict, ...]) -> dict | None`: misma resolución por clave exacta o nombre normalizado, con datos explícitos. Los llamantes internos y tests se actualizan; no se conserva una constante global de compatibilidad.
- `domain.roster.validate_roster(roster: list[dict], available_characters: set[str]) -> None`: comprobar registros, orden y referencias no ambiguas mediante funciones puras; los registros incluyen `display_order` hasta terminar esta validación. Comprobar personajes contra los slugs recibidos, sin acceder a archivos; lanzar `ValueError` si no permiten identificar de forma unívoca al alumno. Permitir lista vacía para que el caso de uso distinga ese estado.
- `usecases.roster.prepare_catalog(connection: sqlite3.Connection) -> list[dict]`: leer/preparar según el estado, devolver registros ordinarios `{key, name, character}` ordenados, o lanzar `RaceError` con el motivo correspondiente. Requiere la transacción del llamante; no confirma ni revierte por su cuenta.
- Almacenamiento: funciones concretas con conexión explícita para estado, existencia de tabla, creación, lectura, inserción e indicador. La lectura inicial del CSV no accede a una base ni lee archivos locales de trabajo. La lectura de activos solo obtiene los slugs del directorio de SVG de la aplicación, sin leer datos personales ni interpretar JavaScript. Los errores de lectura no se convierten en listas vacías.
- En `usecases/races.py`, una función interna concreta puede transformar las plazas de una carrera a `{key, name, character}` para resolver `join` y `release`. Se justifica por esos dos usos reales; no añade una capa ni un proveedor genérico. El ID y la conexión de carrera se reciben explícitamente.

Las funciones nuevas/modificadas llevan tipos y documentación en español conforme a AGENTS. Los nombres describen los pasos; se conservan expresiones breves comprensibles. No se crean clases de entidades, repositorios, resultados o servicios. Se reutiliza `RaceError`, permitido por las reglas existentes para identificar errores de negocio sin códigos HTTP.

## Errores y recorrido de la acción

| Situación | Motivo y mensaje de negocio | Traducción HTTP |
| --- | --- | --- |
| Catálogo preparado sin alumnos | `catalog_empty`: `No hay alumnos disponibles para preparar la carrera. Revisa el catálogo guardado.` | 409 |
| Estado incoherente, catálogo inválido o fallo de preparación/lectura | `catalog_unavailable`: `No se pudo cargar el catálogo de alumnos. Revisa los datos guardados antes de preparar otra carrera.` | 503 |
| Bloqueo al abrir la transacción | Conservar `storage_busy` y su mensaje existente. | 503 existente |

Recorrido: petición de profesor → comprobaciones HTTP actuales → transacción del caso de uso de carrera → preparación/lectura del catálogo → validación pura → creación actual de sesión/carrera/plazas → confirmación y respuesta actual.

Los fallos esperados de lectura del archivo inicial, formato de datos o almacenamiento se traducen en el caso de uso, sin mostrar rutas internas, SQL o contenido sensible. No se captura cualquier excepción para reconstruir datos. La excepción de catálogo vacío queda separada de los fallos técnicos. El adaptador HTTP solo traduce los motivos. El panel actual descarta los mensajes de rechazo al crear una clase y muestra un fallo genérico de conexión; por eso se ajusta únicamente la acción de creación de carreras. Tras recibir una respuesta JSON de error de la API, mostrará su campo `error` de tipo texto mediante `showMessage`, con mensaje seguro por defecto si falta o no es texto, y finalizará sin navegar ni crear otra petición. No se usa HTML ni se muestra `error.message` de excepciones arbitrarias. Los 401 siguen el tratamiento `AuthError` actual; fallos de red o de lectura de la respuesta conservan el mensaje de conexión. El botón se vuelve a habilitar mediante el `finally` existente. La creación de clases normales y las demás acciones conservan su comportamiento.

Las vistas y acciones sobre una carrera ya preparada siguen leyendo sus propias plazas. No llaman a `prepare_catalog`, no requieren el catálogo global y no lo reparan. Se conservan la validación de acceso y fase antes de resolver una selección, la recuperación con permiso existente, el reemplazo en lobby y el cierre de nuevas entradas después de Go.

## Comprobación de la constitución

| Regla | Cumplimiento previsto |
| --- | --- |
| P1 · Independencia | Sin plataformas externas, autenticación nueva ni integración de alumnado. |
| P2 · Simplicidad | Una tabla y un indicador en la configuración existente; funciones concretas, sin gestión multigrupo ni framework de migraciones. El alumno conserva el recorrido actual. |
| P3 · Dependencias | Biblioteca estándar y paquetes existentes. Sin paquetes nuevos ni actualizaciones; no se requiere una revisión Socket nueva para esta tarea Python. |
| P4 · Privacidad | Nombres/personajes locales permitidos; claves y orden necesarios para continuidad. Ninguna asociación nueva con IPs, emails o dispositivos. Accesos y temporales mantienen su caducidad. |
| P5 · Accesibilidad | Se conservan pantallas, controles y región de mensajes existente; los rechazos del catálogo se muestran como texto en la acción de creación de carreras. |
| P6 · Español | Mensajes, documentación y pruebas explicativas en español; nombres técnicos conforme al estilo del proyecto. |
| §5 · Calidad | Test automatizado por CA, suite pytest completa y evidencia de regresión; comprobación manual del recorrido visual conservado. |
| §6 · Seguridad | Plazas e intentos conservan claves por carrera; no se altera A/B, expiración, origen, bloqueo normal o presupuestos independientes. |
| §3, §4 y §7 | Stack y carpeta existentes; plan y tareas aprobados por Miguel; implementación autorizada tras estas aprobaciones. |

No se necesita enmendar la constitución: ya permite una referencia local de nombres/personajes y exige separar dominio y almacenamiento.

## Verificación por criterio

Primero guardar inventario y hashes del código propio y preparar una copia desechable sin `data/`, `.venv`, caches o instalaciones de trabajo. Levantar la versión anterior con datos sintéticos en esa copia para crear la referencia de compatibilidad antes de adaptar el código. No abrir bases reales ni importar código que use la ruta por defecto fuera de la copia. Preparar un entorno virtual desechable con los requisitos existentes.

| Criterio | Comprobaciones previstas |
| --- | --- |
| CA-01 | Comprobar que el dominio recibe datos explícitos, no importa almacenamiento ni tiene nombres concretos de producción. Probar resolución con listas sintéticas independientes del archivo inicial. |
| CA-02 | Base nueva y base anterior sin catálogo: preparar carrera y obtener los quince alumnos, claves, personajes y orden originales. Comparar con fixture independiente extraído de la referencia anterior. Verificar que la preparación del catálogo no añade asistencias ni ocupa plazas. |
| CA-03 | Reiniciar app y repetir preparación; comparar catálogo e indicador. Modificar datos sintéticos válidos y comprobar persistencia; vaciar catálogo manteniendo indicador y comprobar que no reaparece el grupo inicial. Probar un catálogo preparado con el archivo inicial ausente para acreditar que ya no depende de él. |
| CA-04 | Cambiar nombre/personaje/orden y usar un número distinto de alumnos en el catálogo sintético: la carrera nueva refleja esos valores. Las carreras anteriores mantienen su instantánea. |
| CA-05 | Misma clave y variantes de nombre, tildes, espacios y mayúsculas resuelven la misma plaza de su carrera. Cambiar catálogo después no afecta la selección o liberación en una carrera anterior. Referencias desconocidas/ambiguas y catálogos inválidos se rechazan sin crear una segunda plaza o presupuesto. |
| CA-06 | Fixture anterior con carreras en lobby, abiertas, cerradas y canceladas, asistencias y podio. Arrancar la versión nueva, preparar una carrera adicional y comparar las filas duraderas anteriores, claves y fechas; comparar `config` salvo la entrada nueva. Para accesos y operaciones todavía vigentes, mantener el reloj antes de su caducidad; probar la limpieza de los ya caducados por separado, sin exigir conservar secretos que las reglas ordenan eliminar. No tocar los fixtures históricos 011. |
| CA-07 | Preservar plazas ocupadas, hashes de acceso, reservas, resultados confirmados y tres oportunidades. Repetir operación tras reinicio y cambio del catálogo: mismo resultado/unconfirmed, sin nueva evaluación ni oportunidad. Expiración y limpieza conservadas; suite de seguridad, concurrencia, IP compartida y origen completa. |
| CA-08 | API satisfactoria con mismo esquema y orden; pruebas existentes de carrera. Prueba local en navegador del lobby, selección, Go, código y resultado/podio con el grupo inicial, sin instalar herramientas nuevas; registrar qué se probó manualmente. |
| CA-09 | Catálogo vacío no se repuebla ni crea sesión; tabla sin indicador, indicador sin tabla, versión desconocida, esquema incompatible, CSV ausente/inválido y fallo de consulta no activan reconstrucción. Rechazar personajes desconocidos y órdenes negativos, no enteros o repetidos tanto en carga inicial como en catálogo guardado; conservar los valores válidos con huecos en su orden. Contrastar los activos locales con los permitidos por el renderer. En la acción real del panel, verificar que los mensajes 409/503 se ven como texto, no hay navegación ni nueva petición y el botón se rehabilita. Incluir autenticación 401, fallo de red, JSON ilegible, error ausente/no textual y éxito; las clases normales mantienen su tratamiento anterior. Forzar fallos antes/después de insertar alumnos y antes de confirmar: rollback de tabla/datos/indicador y ausencia de sesiones parciales. Reintentar tras una preparación revertida permite primera preparación íntegra. Simular también commit completado seguido de excepción o respuesta perdida: comprobar desde otra conexión que catálogo, indicador y carrera quedaron íntegros, y que la siguiente preparación no lee el CSV ni duplica alumnos ni modifica carreras anteriores. No exigir que la nueva petición deduplique la carrera ya creada. |
| CA-10 | Verificar columnas y respuestas sin nuevos datos personales, vínculos a seguridad ni secretos; catálogo preparado no implica asistencia. Confirmar que no se añaden peticiones externas ni una nueva identificación del alumno. |
| CA-11 | Cada CA enlazado a sus tests en tareas, documentos y árbol coherentes, suite completa y evidencias del caso anterior y nuevo. |

Añadir prueba de preparación concurrente: misma primera base, dos llamadas con conexiones independientes; catálogo sin duplicados, indicador único y carreras confirmadas con su grupo completo. Una respuesta de ocupado sigue siendo un rechazo sin preparación parcial y puede repetirse después según las reglas existentes.

La referencia anterior se usa para generar fixtures sintéticos antes de cambiar el código. Se conservan el SQL de esquema y los valores necesarios como fixture de prueba, con credenciales claramente ficticias. No se copian bases locales ni se guardan secretos de una sesión real. Los tests anteriores que importaban `ROSTER` se adaptan sin quitar cobertura: los de concurrencia y HTTP obtienen el grupo real de la carrera; los de dominio utilizan listas explícitas de prueba. La comprobación de las quince correspondencias tiene su fixture independiente para no contrastar el archivo inicial consigo mismo.

Ejecutar `python -m pytest -q` y los ensayos HTTP/concurrencia existentes desde la copia con el entorno temporal. Ejecutar también `node --test tests/browser/test-catalog-errors.mjs` con el Node disponible en el proyecto: cargar el script real del panel con un DOM mínimo y `fetch` controlado mediante las herramientas estándar, sin copiar la lógica de la acción a la prueba. Estos casos comprueban el handler y el texto renderizado; la comprobación de navegador confirma además la región de mensajes visible. No instalar librerías ni crear una segunda implementación del panel. Toda prueba que arranque servidor o túnel lo detiene y comprueba que el puerto propio queda libre; no se paran procesos ajenos. Los recorridos de navegador se hacen contra el servidor local de la copia, con datos sintéticos y sin túnel público salvo autorización posterior.

Antes de incorporar, comparar hashes de archivos protegidos y estado local para no sobrescribir cambios ajenos. Incorporar únicamente archivos del plan, sin bases, entornos, cachés o temporales. Ejecutar pytest y revisar enlaces, rutas de datos/consultas y ausencia de dependencias nuevas. Registrar evidencia por CA y retirar los temporales propios cuando ya esté guardada. No dar por realizadas pruebas manuales, revisión de Miguel o pasos de Git al terminar pytest.

## Orden posterior a la aprobación del plan

Preparar tareas pequeñas con CA explícitos: referencia y tests; datos/consultas de catálogo; funciones de almacenamiento y dominio; coordinación de primera preparación; integración con carrera y errores HTTP; compatibilidad y seguridad; documentos; verificación y limpieza. Implementar solo después de aprobar esas tareas.

La tabla de estado de AGENTS registra la aprobación del plan actualizado y las tareas; durante la implementación se actualizará con las fases realmente completadas.

Las consultas nuevas se separan en esta entrega para cumplir las reglas vigentes; separar todas las consultas antiguas sigue siendo otra issue. Tampoco se completa aquí la administración de varios grupos que sugirió Ventura como evolución del modelo.

## Preguntas abiertas

Ninguna decisión de producto pendiente. La implementación concreta, incluidas las rutas, el indicador, la preparación diferida y los mensajes nuevos, queda aprobada por Miguel, incluido el ajuste del panel y sus pruebas; no se han creado tablas, datos iniciales, pruebas ni código de aplicación durante su redacción.
