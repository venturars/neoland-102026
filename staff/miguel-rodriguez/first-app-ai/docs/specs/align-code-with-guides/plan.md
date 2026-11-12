# Plan para adaptar el código a las guías

Estado: aprobado por Miguel el 2026-10-27, tras la revisión de los casos de equivalencia.
Spec: [spec.md](spec.md), aprobada al solicitar este plan el 2026-10-27.
Tarea: [issue #517](https://github.com/venturars/neoland-102026/issues/517).
PR: [#518](https://github.com/venturars/neoland-102026/pull/518), en draft y dirigida a `staging`.

## Objetivo y límites

Aplicar las guías actuales a first-app-ai sin cambiar sus contratos. La referencia funcional será el código anterior a este desarrollo, contrastado con CONSTITUTIONS, ERRORS y DATABASE. Una discrepancia se documentará antes de tocar el comportamiento afectado.

La rama parte de `staging` posterior a #497. Este desarrollo no necesita otra PR pendiente, cambios de base, actualizaciones de dependencias ni nueva revisión Socket. Los paquetes, lockfile y configuración de formato y lint permanecen iguales. El procedimiento Socket sigue vigente si una necesidad posterior cambia esa decisión; no se instalará un paquete nuevo bajo este plan.

No se copia la implementación de Ventura. #412 establece el objetivo docente; nuestras guías y contratos determinan la adaptación concreta, incluidos los clientes adicionales de esta app.

## Revisión de los archivos actuales

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`.

| Archivos | Situación y adaptación prevista |
| --- | --- |
| `db/connection.js` | Separar la conversión de URL, obtención del directorio y construcción de la ruta antes de abrir la conexión. Conservar la única conexión exportada y la ubicación relativa al módulo. |
| `queries/users.js` | Separar construcción de rutas y lectura de SQL; separar preparación, ejecución y devolución de cada consulta. Mantener el módulo compartido y los nombres actuales de sus variables SQL. |
| `logic/create-user.js`, `logic/find-user-by-email.js` | Separar lectura, trim, minúsculas y comprobaciones de email. Nombrar condiciones y resultados; mantener el orden y los límites actuales. |
| `logic/update-user.js` | Explicitar la elección de campos preservados o suministrados y las comprobaciones de propiedad del email, sin leer al usuario ausente ni adelantar validaciones. |
| `logic/delete-user.js`, `logic/find-user-by-id.js`, `logic/find-user-by-name.js`, `logic/list-users.js` | Hacer explícitas las condiciones y la construcción de las salidas donde haya pasos combinados. Conservar búsqueda, orden, objetos ordinarios y ausencia de retorno en borrado. |
| `logic/users-gender-count.js` | Separar longitud, límites de lote, nombres, texto enviado, configuración de petición y lectura de respuesta. Mantener prompt, orden de solicitudes y reglas de conteo y error. |
| `clients/jupyter/run-operation.js` | Separar lectura de stdin y parseo, acceso a argumentos, filas y representación de tablas. Conservar despacho, errores, colores, columnas y mensajes. |
| `clients/jupyter/client.py` | Separar resolución de ruta, lectura/parseo del manifiesto y comprobaciones encadenadas. Mantener `runNode`, argumentos, proceso Node, directorio, entorno y presentación. Las convenciones ESM de JavaScript no se trasladan a Python. |
| `scripts/jupyter.js` | Separar rutas, comprobaciones de disponibilidad y decisiones antes de lanzar procesos. Conservar comandos, argumentos, precedencia, entorno, puertos y compatibilidad actual. No convertirlo a shell. |
| `clients/terminal/create-users-table.txt` | Separar preparación, ejecución y presentación de la consulta de inicialización, conservando el mismo SQL y resultado. |
| Los otros ocho ejemplos `.txt` y los nueve notebooks | Revisados: las llamadas actuales ya son pasos sencillos. Conservarlos byte por byte salvo conflicto concreto detectado y presentado antes de ampliar los cambios previstos. Ejecutarlos como parte de la comprobación de clientes. |
| `docs/TREE.md`, `docs/ARCHITECTURE.md` | Incorporar los documentos de este desarrollo. Actualizar responsabilidades solo si la entrega concreta lo requiere; no inventar capas ni trasladar contratos. |
| `docs/specs/align-code-with-guides/` | Mantener spec, plan, tareas y evidencia de ejecución. |

Se mantienen intactos los SQL de `queries/queries/`, esquema, README, requisitos Python, `.gitignore`, configuración ESLint, manifiesto, lockfile, guías de contratos/errores/base de datos/estilo, AGENTS y specs anteriores. Los archivos que ya cumplen una regla no se reescriben solo para producir un diff.

No se añaden módulos de producción ni funciones públicas. Las pruebas de esta adaptación serán comprobaciones temporales con herramientas existentes; no se añade un framework, un runner genérico ni una dependencia de pruebas.

## Forma de escribir los cambios

Usar variables locales descriptivas para cada valor obtenido o comprobado. Separar acceso, transformación y llamada encadenada cuando mezclen pasos. Mantener condiciones y lanzamientos de errores en líneas distintas; los nombres de condiciones deben expresar su significado y polaridad.

Conservar las firmas públicas actuales: `createUser(input)`, `listUsers()`, `updateUser(id, changes)`, `deleteUser(id)`, `findUserByName(name)`, `findUserByEmail(email)`, `findUserById(id)` y `usersGenderCount()`. Las siete primeras siguen síncronas; la última sigue siendo async. Conservar también las interfaces de las ocho consultas, el export `db`, el cliente Python y los puntos de entrada de los clientes.

Los resultados siguen siendo objetos y arrays ordinarios, con las mismas claves y orden de presentación. Se pueden construir registros y argumentos de biblioteca como objetos normales; no se crean envoltorios de resultados ni clases de negocio. Mantener callbacks locales sencillos cuando expresen un único paso; no sustituirlos por un sistema de helpers.

Las constantes de configuración conservan los valores actuales. `MODEL` ya cumple la convención. No convertir rutas derivadas ni nombres del texto SQL en una configuración nueva.

### Orden de evaluación y errores

- Mantener cada lectura y llamada dentro de la rama que la ejecutaba. Nombrar una condición no autoriza a evaluar por adelantado ambos lados de un cortocircuito o las dos alternativas de un condicional.
- En email, comprobar longitud y cantidad de partes antes de necesitar las partes que puedan faltar. No cambiar el criterio a una expresión regular ni añadir validación de tipos.
- En actualización, recuperar el contacto y resolver su ausencia antes de leer sus campos o validar cambios. Conservar la validación del email elegido incluso al cambiar solo el nombre o recibir `{}`.
- Comprobar que existe un propietario del email antes de acceder a su ID. Mantener la comparación con el ID del contacto recuperado y pasar ese ID a la consulta de actualización.
- Mantener las consultas dentro de sus `try/catch` actuales y las condiciones de negocio fuera. No ampliar esos bloques para ocultar errores de validación, importación o lectura de SQL.
- Conservar los mensajes exactos de ERRORS y los errores de cliente actuales. Los fallos de carga de módulos y el parseo inicial del runner no se convierten en errores nuevos de negocio.

### Clasificador

Conservar lote de seis, recorrido en el orden de los contactos, `MODEL`, URL local, clave existente, temperatura, ejemplos, instrucciones y esquema JSON. Separar `map` y `join` puede cambiar la forma del código, pero los mensajes y objetos enviados deben ser iguales para los mismos contactos.

La lectura opcional de `choices[0].message.content` conserva su tolerancia a valores ausentes. No acceder directamente a una propiedad que antes devolvía `undefined` mediante encadenamiento opcional. La comprobación de longitud de `genders` sigue ocurriendo después de confirmar que es un array.

Un lote con JSON ilegible, sin el array esperado o con longitud distinta sigue contando completo como indefinido. En un array de longitud correcta, cada valor no reconocido sigue siendo indefinido. Una excepción de petición, incluso después de un lote correcto, rechaza la operación completa con el error existente; no devuelve un conteo parcial. La tabla vacía sigue devolviendo tres ceros sin contactar con IA.

### Clientes y arranque

En el runner conservar JSON como entrada, lista de operaciones soportadas y llamadas await donde corresponda. La presentación de tablas, columnas, colores, salidas vacías, mensajes de inicialización/borrado y códigos de salida permanecen iguales.

En Python mantener el paso de datos mediante JSON y lista de argumentos del proceso, sin evaluar entradas como código ni introducir shell. Conservar los casos de app no encontrada y la impresión de stdout/stderr.

En el arranque mantener la instalación congelada ya existente cuando faltan dependencias, creación del entorno solo cuando falta, comprobación de las versiones Python actuales, registro del kernel y lanzamiento con loopback. Mantener las opciones Windows/POSIX y el orden de argumentos que impide sustituir el bind final. No introducir instalaciones nuevas como parte del refactor.

## Comprobación de equivalencia

Antes de cambiar código, guardar inventario y contenidos propios y crear dos copias desechables, referencia y candidata, sin bases locales, entornos, dependencias o cachés de trabajo. Los paquetes aprobados podrán disponerse usando el lockfile congelado; no se modificará su resolución. Nunca abrir ni copiar la base ajena `first-app/db/users.sqlite`.

Las copias usarán datos sintéticos equivalentes. Cada comprobación de error comparará mensaje y efecto sobre datos con la referencia; los resultados también se cotejarán con los contratos. Los timestamps no se comparan entre dos ejecuciones independientes como si ocurrieran en el mismo segundo: se comprueba su formato y sus reglas, que creación usa defaults, actualización conserva `createdAt` y modifica `updatedAt` según el SQL existente, y que lectura/fallos no cambian los registros de cada copia.

| Área | Casos necesarios |
| --- | --- |
| Conexión e inicialización | Ruta relativa al módulo desde otro directorio de ejecución; abrir conexión no crea tabla; inicialización explícita e idempotente sin perder registros. |
| Crear y email | Trim/minúsculas; nombre vacío; emails sin `@`, con varios, con lados vacíos; límites 64/65; duplicado tras normalización; cinco campos exactos y objeto ordinario. |
| Lecturas | Lista vacía y orden por ID; búsquedas por ID y email correctas y ausentes; nombre exacto con dos coincidencias y otro nombre más largo, trim, distinción de mayúsculas y ausencia. Buscar por nombre con `""` y `"   "` produce `Name is empty` antes de consultar: comprobar el error también sin tabla inicializada y, con un doble de consulta, confirmar que no se invoca. Ninguna lectura modifica registros o fechas. |
| Actualizar | ID ausente con cambios inválidos; campos omitidos; cambios vacíos; email propio permitido y ajeno rechazado; nombre/email inválidos; fixture de email almacenado inválido para un cambio solo de nombre. Verificar orden de error y conservación de datos en fallo. |
| Borrar | Contacto existente, retorno `undefined`, segundo borrado ausente y reutilización posterior del email. |
| Fallos de consulta | Tabla sin inicializar con entradas válidas para cada operación; fallo controlado de la consulta de escritura de crear/actualizar/borrar después de pasar las comprobaciones previas. En actualización, comprobar además el fallo de `findByEmail` tras recuperar un contacto existente y superar la validación de los cambios: debe producir `Could not update the user`, sin invocar `update` y dejando registros y timestamps intactos. Confirmar mensajes genéricos y ausencia de escrituras parciales. |
| Clasificación | Vacío sin petición; uno y varios lotes; respuestas válidas, valores no reconocidos, JSON inválido, contenido ausente y array ausente o de longitud incorrecta; fallo de petición inicial y después de un lote válido. Totales y datos conservados. |
| Clientes | Ejecutar los nueve ejemplos de terminal y las nueve secuencias de código de los notebooks con IDs/datos sintéticos preparados en la copia; comprobar runner y adaptador, presentación y errores. No guardar outputs de prueba en los notebooks de entrega. |
| Arranque | Comprobar decisiones con entorno disponible/faltante, argumentos y propagación de fallos mediante procesos simulados en pruebas temporales; probar arranque real local aislado sin abrir el navegador, detener solo ese servidor. Revisar las ramas Windows conservadas sin afirmar que se ejecutaron en Windows si no se dispone de ese sistema. |

### IA y fallos controlados

Usar dobles temporales para controlar respuestas de OpenAI y fallos de consultas sin modificar endpoints, inyectar parámetros de prueba en producción ni cambiar exports. Node 24.12.0 dispone de `--experimental-test-module-mocks`, comprobado al preparar este plan; sus mocks de módulo se limitarán al proceso de prueba y se cargarán antes de importar la operación. Cada caso usa una instancia/proceso aislado cuando lo requiera el estado del módulo.

Registrar y comparar los objetos completos de las peticiones al clasificador entre referencia y candidata. Las pruebas deterministas prueban equivalencia del código y se identificarán como simulaciones, no como una ejecución real de Ollama.

Además, realizar una prueba real breve del clasificador si el Ollama local y el modelo ya están disponibles, sin instalar modelos ni detener servicios ajenos. Si no lo están, registrar esa comprobación como pendiente y presentar la limitación antes de declarar cierre; la aprobación de este plan no autoriza afirmar que se ejecutó ni darla por completada. Si una comprobación necesaria no puede realizarse, el cierre espera su ejecución o una decisión expresa de Miguel sobre la evidencia alternativa. La equivalencia determinista no depende de que dos respuestas reales del modelo coincidan.

Para los clientes que invocan el clasificador, usar tabla vacía en la ejecución real sin IA y comprobar datos no vacíos con el doble controlado. Separar esa evidencia de una demostración completa con el servicio real.

## Herramientas, revisión final y evidencia

Mantener Node compatible con `node:sqlite`; usar el Node 24.12.0 disponible y pnpm 10.33.0 explícito, ya comprobados en #496, con `COREPACK_ENABLE_AUTO_PIN=0` para no añadir `packageManager`. No cambiar perfiles del shell ni la versión del proyecto. Si hace falta un entorno Python para la prueba real de Jupyter, usar uno desechable con los requisitos existentes; no reutilizar ni modificar el entorno de trabajo del usuario.

Al terminar cada bloque de cambios ejecutar `pnpm format` y `pnpm lint`. Comprobar también sintaxis del adaptador Python con las herramientas estándar, sin añadir un formateador o linter Python. Revisar manualmente las reglas de pasos y nombres que ESLint no acredita.

Antes de incorporar la candidata al proyecto de trabajo:

- Comparar con la referencia cada archivo cambiado, las firmas, mensajes y condiciones; comprobar SQL y archivos protegidos byte por byte.
- Confirmar que el código ya conforme se conserva y que no aparecieron dependencias, configuraciones, módulos de producción o cambios en otros proyectos.
- Actualizar TREE con los documentos de esta feature y ARCHITECTURE con su referencia y las responsabilidades reales. No cambiar contratos para hacer pasar las pruebas.
- Registrar en `tasks.md` comandos, resultados, casos comparados, simulaciones y pruebas reales o pendientes. Mantener los datos sintéticos y scripts de verificación fuera de la entrega y retirarlos tras registrar la evidencia.
- Incorporar solo los archivos previstos, repetir formato/lint y comprobar alcance y enlaces finales. No hacer commits, push, peticiones de review ni cambios de base de PR como parte de la implementación sin la instrucción correspondiente de Miguel.

Este plan no declara verificaciones ejecutadas durante su redacción. Su aprobación permitirá preparar las tareas para revisión independiente; la implementación esperará también la aprobación de esas tareas.

## Preguntas pendientes

No hay decisiones de alcance pendientes. La disponibilidad del servicio de IA, de Jupyter y de un sistema Windows se comprobará al verificar; cualquier limitación se identificará con su efecto sobre la evidencia, sin inventar resultados ni ampliar el alcance.
