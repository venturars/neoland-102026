# Tareas para adaptar first-app-ai a las guías

Estado: aprobadas por Miguel el 2026-10-27. Implementación completada y verificada; revisión final aprobada por Miguel el 2026-10-27.
Spec: [spec.md](spec.md), aprobada el 2026-10-27.
Plan: [plan.md](plan.md), aprobado por Miguel el 2026-10-27.
Tarea: [issue #517](https://github.com/venturars/neoland-102026/issues/517).
PR: [#518](https://github.com/venturars/neoland-102026/pull/518), en draft y dirigida a `staging`.

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`. Ejecutar en orden después de aprobar estas tareas. Marcar cada casilla solo tras comprobar su resultado. Los cambios ejecutables se hacen primero en la copia candidata.

## Preparación y referencia

- [x] T01 — Confirmar instrucciones, alcance y herramientas.
  - Releer spec, plan, AGENTS, CONSTITUTIONS y las guías de arquitectura, estilo, errores y base de datos. Confirmar la aprobación de estas tareas y la rama `517-refactor-align-code-with-guides`.
  - Comprobar Node 24.12.0 y pnpm 10.33.0 explícito mediante Corepack con `COREPACK_ENABLE_AUTO_PIN=0`. Registrar la disponibilidad de Python, Jupyter y Ollama/modelo sin instalar modelos ni modificar servicios ajenos, perfiles o versiones del proyecto.
  - Resultado: prerrequisitos y limitaciones identificados. No cambiar bases de PR ni otras ramas. Un conflicto con contratos aprobados detiene el punto afectado para decisión.

- [x] T02 — Guardar la referencia y preparar las dos copias.
  - Registrar rutas y SHA-256 de los archivos propios versionados y de los documentos actuales de esta feature. Identificar cambios locales ajenos y excluirlos.
  - Crear referencia y candidata desechables sin bases locales, `.venv`, dependencias o cachés de trabajo. No abrir ni copiar `first-app/db/users.sqlite` ni ninguna base local real.
  - Disponer de las dependencias aprobadas mediante instalación congelada en las copias cuando sea necesaria. Comprobar que manifiesto y lockfile permanecen idénticos. No añadir paquetes ni nuevas configuraciones.
  - Resultado: referencia de código inmutable y candidata independiente; solo las bases sintéticas de las copias podrán modificarse en las pruebas.

- [x] T03 — Preparar las comprobaciones y ejecutar la referencia.
  - Preparar datos sintéticos y comprobaciones temporales sencillas para la matriz de equivalencia del plan. Usar herramientas existentes y mocks de módulo de Node en procesos aislados, antes de importar las operaciones.
  - Ejecutar los casos de referencia antes de modificar la candidata. Registrar resultados, errores, peticiones al clasificador y estado de los datos; contrastarlos con los contratos. Reiniciar fixtures cuando un caso dependa de tabla vacía, tabla ausente o contactos concretos.
  - Comparar timestamps por sus reglas y dentro de cada copia, sin exigir igualdad de reloj entre ejecuciones. Para acreditar actualizaciones, usar un timestamp sintético anterior cuando haga falta distinguir segundos.
  - Resultado: resultados de referencia y casos reproducibles disponibles, sin framework, runner genérico, módulos de producción o datos de ensayo en la entrega. Los fallos de la referencia se investigan antes de atribuirlos al refactor.

## Adaptar y revisar por bloques

Después de cada bloque T04–T11 ejecutar `pnpm format` y `pnpm lint` en la candidata y las comprobaciones del área afectada. Revisar el diff de ese bloque antes de avanzar; un lint satisfactorio no sustituye la revisión del comportamiento. Conservar las firmas, llamadas con su objeto receptor, orden de evaluación, mensajes y límites de los `try/catch`.

- [x] T04 — Separar conexión y consultas.
  - En `db/connection.js`, separar conversión de URL, directorio y ruta de la apertura de la conexión; conservar `db`, su ubicación y la ausencia de inicialización automática.
  - En `queries/users.js`, separar rutas y lecturas de SQL y, por consulta, preparación, ejecución y retorno. Conservar el módulo agrupado, nombres de variables SQL, argumentos y retornos. La inicialización sigue devolviendo `undefined`; borrar sigue devolviendo la metadata de SQLite en la capa de consultas.
  - Resultado: mismo SQL, esquema e interfaces; comprobar desde otro directorio la ubicación relativa al módulo, tabla inicialmente ausente e inicialización explícita e idempotente sin perder registros.

- [x] T05 — Hacer explícitas creación y búsqueda por email.
  - Separar lecturas, trim, minúsculas y condiciones en `create-user.js` y `find-user-by-email.js`, con nombres descriptivos y comprobaciones en su orden actual. No añadir expresiones regulares ni validación de tipos.
  - Verificar nombre vacío, normalización, email sin `@`, varios `@`, lados vacíos, límites 64/65 y duplicado normalizado. Cubrir búsqueda por email existente y ausente y verificar las cinco claves exactas y objetos ordinarios.
  - Resultado: mismas salidas y errores; los casos fallidos no cambian registros ni timestamps y las consultas no se adelantan a la validación.

- [x] T06 — Hacer explícita la actualización conservando sus prioridades.
  - En `update-user.js`, mantener primero la búsqueda del ID y su error de ausencia. Separar la elección de campos suministrados/preservados y su normalización, sin evaluar alternativas que no correspondan. Comprobar existencia del propietario antes de leer su ID y conservar el ID recuperado en la escritura.
  - Probar ID ausente con cambios inválidos, campos omitidos, `{}`, email propio permitido, ajeno rechazado, nombre/email inválidos y email almacenado inválido al cambiar solo el nombre. Comprobar `createdAt` preservado y las reglas de `updatedAt`, también para `{}`.
  - Provocar fallo de `findByEmail` después de recuperar un contacto y validar los cambios: debe devolver `Could not update the user`, no llamar a `update` y conservar registros y timestamps.
  - Resultado: mismo orden de errores, consultas y efectos; ningún acceso a un usuario o propietario inexistente.

- [x] T07 — Adaptar las demás búsquedas, listado y borrado.
  - Revisar `find-user-by-id.js`, `find-user-by-name.js`, `list-users.js` y `delete-user.js`; separar condiciones y construcción de resultados donde corresponda, sin helpers compartidos nuevos ni cambios en firmas.
  - Probar lista vacía/orden por ID, ID existente/ausente y nombre completo con dos coincidencias y otro más largo, trim, mayúsculas, prefijo sin coincidencias y ausencia. Buscar `""` y `"   "` debe producir `Name is empty` aun sin tabla inicializada; confirmar con un doble que no se consulta.
  - Probar borrado existente, retorno público `undefined`, segundo borrado y reutilización del email. Comprobar que lecturas y fallos mantienen todos los registros y fechas.
  - Resultado: misma selección, orden, claves y tipo de resultados, errores y efectos del borrado.

- [x] T08 — Adaptar el clasificador y comprobar su equivalencia determinista.
  - En `users-gender-count.js`, separar longitud, límites de lote, extracción y unión de nombres, configuración de petición y lectura de respuesta, preservando lote de seis, orden, prompt, ejemplos, modelo, conexión, temperatura y esquema JSON.
  - Conservar acceso opcional a respuestas ausentes y comprobar array antes de su longitud. Mantener las reglas para lotes inválidos y para valores no reconocidos, así como el rechazo total cuando falla una petición.
  - Comparar peticiones completas y resultados de referencia/candidata con respuestas controladas: tabla vacía sin petición, uno y varios lotes con último lote parcial, respuestas válidas, valores desconocidos, JSON ilegible, contenido ausente, array ausente/longitud incorrecta y fallo inicial/después de un lote válido. Incluir fallo de lectura de contactos y comprobar datos intactos.
  - Resultado: mismas peticiones y agregados para los mismos datos/respuestas; sin conteos parciales en errores de petición. Identificar esta evidencia como simulada.

- [x] T09 — Adaptar el runner de Jupyter.
  - Separar lectura de stdin y parseo, accesos a argumentos, filas y presentación en `clients/jupyter/run-operation.js`. Mantener la lista de operaciones, await del clasificador, tablas, columnas, colores, mensajes y códigos de salida.
  - Comprobar salidas de lista vacía/contacto/lista/conteo, inicialización, borrado, error de negocio y operación desconocida. Mantener el comportamiento del parseo inicial y su ubicación fuera del bloque de errores actual.
  - Resultado: mismo despacho y presentación; ninguna regla de negocio trasladada al cliente ni método de biblioteca separado de su receptor.

- [x] T10 — Adaptar el cliente Python.
  - En `clients/jupyter/client.py`, separar rutas, lectura/parseo del manifiesto y comprobaciones encadenadas manteniendo su evaluación condicional. Conservar `runNode`, JSON, argumentos del subproceso, directorio, entorno, stdout y stderr.
  - Comprobar sintaxis con herramientas estándar sin instalar lint/formato Python. Probar app válida, manifiesto ausente o inválido, nombre distinto y archivos requeridos ausentes en fixtures aislados, manteniendo el mensaje de app no encontrada. Revisar que no aparezca shell ni evaluación de entradas como código.
  - Resultado: mismo adaptador y comunicación con Node; no imponer convenciones ESM a Python ni cambiar requisitos.

- [x] T11 — Adaptar el arranque y el ejemplo de inicialización.
  - En `scripts/jupyter.js`, separar rutas y comprobaciones manteniendo la instalación congelada existente, creación condicional del entorno, versiones Python, registro del kernel, mensajes, entorno y propagación de fallos.
  - Comparar con procesos simulados las ramas de entorno/dependencias presentes y ausentes, errores de lanzamiento, códigos de salida y argumentos Windows/POSIX. Preservar el loopback final y el orden de argumentos. No convertir el script a shell ni añadir instalaciones o versiones.
  - Separar la consulta encadenada en `clients/terminal/create-users-table.txt`, conservando el SQL y la salida. Los otros ocho ejemplos y los nueve notebooks permanecen idénticos.
  - Resultado: mismas decisiones y comandos; distinguir ramas simuladas de ejecuciones reales, sin atribuir una prueba real de Windows a una simulación.

## Verificación conjunta y entrega

- [x] T12 — Completar la matriz de operaciones y fallos de consulta.
  - Ejecutar contra referencia y candidata todos los casos de la matriz del plan, incluyendo los casos ya asociados a los bloques anteriores; conservar un registro de cobertura para que ninguno se omita.
  - Con tabla sin inicializar e inputs válidos, comprobar los errores genéricos de las ocho operaciones. Provocar por separado fallos de escritura de crear/actualizar/borrar después de pasar sus comprobaciones previas y confirmar ausencia de escrituras parciales.
  - Incluir el fallo intermedio de búsqueda del propietario del email de T06 y el nombre vacío sin consulta de T07. Comparar resultados, tipos y claves, mensajes, orden de consultas y efectos sobre registros/fechas, sin cambiar código productivo para facilitar las pruebas.
  - Resultado: equivalencia y contratos comprobados para todas las operaciones y fallos previstos; cualquier diferencia detiene el área afectada hasta resolverla.

- [x] T13 — Ejecutar clientes y comprobar los servicios reales disponibles.
  - Ejecutar los nueve ejemplos de terminal y las nueve secuencias de código de los notebooks en las copias, preparando los IDs/contactos sintéticos necesarios y evitando que un borrado altere el fixture de otra comprobación. Mantener las salidas de prueba fuera de los notebooks de entrega.
  - Probar arranque real de Jupyter en un entorno desechable con los requisitos existentes, sin abrir navegador; confirmar respuesta del servidor y raíz de notebooks, y detener solo ese servidor. Comprobar la comunicación Python→Node de los clientes; no presentar ejecutar celdas como si fuese una comprobación visual de la interfaz.
  - Ejecutar una prueba real breve con datos no vacíos si Ollama y el modelo ya están disponibles. Para los ejemplos reales sin IA usar tabla vacía y, por separado, probar clasificación no vacía con el doble controlado. No instalar modelos ni detener procesos ajenos.
  - Resultado: evidencia separada de clientes, arranque, simulaciones y servicio real. Si una comprobación necesaria no se puede realizar, registrar el bloqueo; el cierre espera su ejecución o decisión expresa de Miguel sobre evidencia alternativa. No exigir igualdad entre respuestas reales independientes del modelo.

- [x] T14 — Actualizar documentación y revisar archivos protegidos.
  - Añadir los documentos de esta feature a TREE y su referencia a ARCHITECTURE, manteniendo responsabilidades reales. No modificar contratos ni guías para acomodar desviaciones del código.
  - Comparar con T02 los SQL, manifiesto/lockfile, configuración ESLint, requisitos Python, README, `.gitignore`, AGENTS, guías protegidas, specs anteriores, los ocho ejemplos y nueve notebooks preservados. Revisar que no se añadan módulos productivos, dependencias o cambios ajenos a first-app-ai.
  - Revisar manualmente nombres y separación de pasos, firmas, contexto de llamadas de métodos, cortocircuitos, límites de captura de errores y prompt/peticiones del clasificador.
  - Resultado: diff limitado a los archivos previstos; documentación y enlaces coherentes; código ya conforme y archivos protegidos conservados.

- [x] T15 — Incorporar únicamente lo comprobado y verificar el proyecto final.
  - Antes de copiar, confirmar que los archivos del proyecto no han cambiado desde la referencia; si hay cambios ajenos nuevos, detener la incorporación afectada en lugar de sobrescribirlos.
  - Incorporar solo los archivos previstos y verificados, sin bases, entornos, dependencias, cachés, fixtures o scripts temporales.
  - Ejecutar `pnpm format` y `pnpm lint` en la entrega final, comprobar sintaxis Python sin dejar cachés de prueba en la entrega y verificar que no aparecen cambios nuevos respecto a la candidata. Revisar enlaces, árbol y alcance final.
  - Resultado: entrega local coherente con la candidata verificada, datos reales intactos y checks finales satisfactorios.

- [x] T16 — Registrar evidencia y retirar temporales propios.
  - Registrar aquí versiones, comandos, resultados, cobertura de la matriz, comparaciones de archivos/datos, peticiones del clasificador y qué pruebas usaron servicios reales o simulados. Anotar pruebas pendientes y decisiones expresas si las hubiera.
  - Retirar solo las copias, servidores, entornos y archivos temporales creados para esta tarea después de guardar la evidencia. No borrar bases ni instalaciones locales ajenas.
  - Resultado: tareas marcadas conforme a resultados reales y entrega lista para revisión final de Miguel únicamente cuando no queden comprobaciones necesarias pendientes sin decisión. Los commits, push, revisión de compañeros y merge no se consideran autorizados por completar estas tareas.

## Evidencia y decisiones

- 2026-10-27: spec aprobada al solicitar el plan; plan aprobado expresamente después de revisar los casos de equivalencia y añadir las dos comprobaciones señaladas.
- Se comprobó la disponibilidad del mecanismo de mocks de módulo de Node 24.12.0 en un proceso aislado, sin importar la aplicación. Esto no acredita las pruebas funcionales anteriores.
- Miguel aprobó estas tareas el 2026-10-27 y autorizó la implementación. Al registrar esta aprobación aún no se había implementado el refactor ni ejecutado sus pruebas de equivalencia.


### Resultados de ejecución — 2026-10-27

Entorno: Node `24.12.0`, pnpm `10.33.0` mediante Corepack con selección explícita y `COREPACK_ENABLE_AUTO_PIN=0`; Python `3.14.8`. Dos copias temporales con 73 archivos propios de referencia, sin bases locales ni entornos de trabajo. Instalación `pnpm install --frozen-lockfile --offline` satisfactoria en ambas, sin modificar manifiesto ni lockfile. Jupyter se instaló en un entorno temporal con los requisitos existentes, sin actualizar versiones.

| Comprobación | Resultado |
| --- | --- |
| T03, T04–T08 y T12: integración y errores controlados | 23 grupos de escenarios pasan en referencia y candidata. Sus resultados, mensajes, secuencias de consultas registradas y peticiones completas de IA coinciden. |
| Contratos públicos | Firmas, exports y carácter async comparados mediante AST; export de conexión e interfaces de consultas conservados. Firma del adaptador Python también conservada. |
| Datos y timestamps | Normalización, límites 64/65, claves y objetos ordinarios, orden, consultas vacías/ausentes, actualización, errores y borrado comprobados. Las lecturas y fallos conservan registros y fechas; se usaron fechas sintéticas antiguas para acreditar actualizaciones. |
| Nombre vacío | `""` y `"   "` producen `Name is empty` sin tabla inicializada; el doble de consulta confirma que no se invoca. |
| Fallo intermedio de actualización | `findByEmail` falla después de obtener el contacto y validar cambios: `Could not update the user`, ninguna llamada a `update` y datos intactos. |
| Fallos de escritura | Crear, actualizar y borrar conservan sus errores genéricos cuando falla la escritura después de las comprobaciones previas. |
| Clasificador simulado | Tabla vacía, lote único y varios con lote parcial, valores válidos/desconocidos, JSON inválido/nulo, respuesta nula, choices vacío, mensaje/contenido ausente, genders ausente/no array/longitud incorrecta, fallo de lectura y petición inicial/tardía. Totales, rechazo sin resultado parcial y peticiones idénticos a la referencia. |
| T09, T10 y T13: clientes | Nueve ejemplos de terminal y nueve secuencias de código de notebooks pasan en ambas copias. Coinciden sus salidas al normalizar únicamente timestamps entre ejecuciones; tres errores de runner y cinco fixtures de fallo del adaptador Python también coinciden. Los notebooks no reciben outputs de prueba. |
| T11: arranque simulado | Diez escenarios pasan y coinciden en comandos, argumentos, entorno controlado, mensajes y códigos de salida: listo, Windows listo, dependencias ausentes, solo OpenAI ausente, gestor ausente, entorno ausente POSIX/Windows, versiones Python incorrectas, error de lanzamiento y fallo de instalación. Windows fue simulado, no ejecutado en un ordenador Windows. |
| T13: Jupyter real | Referencia y candidata arrancan con respuesta HTTP 200 y los nueve notebooks en su raíz. El kernel registrado `first-app-ai` aparece en la API de kernelspecs de ambas copias. No se abre navegador; los servidores de prueba se detienen al terminar. |
| T13: Ollama real | `llama3.2` ya disponible. Dos contactos sintéticos, Ada y Kim: ambas ejecuciones devuelven `{ women: 0, men: 0, genderUndefined: 2 }`, suman dos y mantienen los registros y timestamps intactos. Esto acredita la conexión y ejecución existentes, no la corrección de una identidad de género. |
| Conexión desde otro directorio | Importación desde `/tmp` crea solo el archivo de la copia, sin inicializar tabla, en ambas versiones. |
| T14: alcance y documentos | Dieciséis archivos previstos de código/guías modificados. Cincuenta y cuatro archivos versionados protegidos conservan su contenido, incluidos ocho ejemplos de terminal, nueve notebooks, SQL, requisitos, configuración, manifiesto/lockfile, guías protegidas y specs anteriores. TREE contiene las 73 rutas propias; 41 enlaces locales y anclas válidos. |
| Formato y lint por bloque | `pnpm format` y `pnpm lint`, salida 0 tras cada bloque T04–T11 y tras la revisión de nombres. El adaptador Python compila con `compile` sin escribir cachés. |

Las comprobaciones temporales se ejecutaron con las herramientas estándar de Node y Python, sin añadir dependencias ni un sistema de pruebas al proyecto. Los scripts de verificación compararon referencia y candidata y sus resultados se registran aquí antes de retirar las copias.

Incidencias de la verificación resueltas, sin cambios adicionales de producto:

- La comparación inicial del arranque incluía variables heredadas de la sesión (`CODEX_TOOL_CALL_ID`, `SHLVL`). Se fijó el mismo entorno de prueba para ambas versiones; las diez comparaciones pasan.
- El primer arranque de referencia con un segundo `open_browser=False` fue rechazado por Jupyter por duplicar la opción ya presente. La prueba usa `--ServerApp.browser=/usr/bin/true`, un comando inocuo que no abre una GUI. No se modificó este comportamiento existente dentro del refactor.

Comandos de aplicación usados en las copias (con el pnpm explícito indicado):

```sh
pnpm install --frozen-lockfile --offline
pnpm format
pnpm lint
```

Las comprobaciones de operaciones usan `node --experimental-test-module-mocks` en procesos aislados. Las de clientes ejecutan los ejemplos con `bash` y el código de las celdas mediante Python en la copia. El arranque real usa `node scripts/jupyter.js --ServerApp.browser=/usr/bin/true --ServerApp.port=<puerto-temporal> --ServerApp.port_retries=0`; se verificó su API local con autenticación y sin guardar tokens en esta evidencia.

T15 y T16 completadas: antes de incorporar se cotejaron los 73 archivos de referencia con el proyecto para descartar cambios locales nuevos. Se copiaron únicamente los 16 archivos de código/guías previstos y este registro de tareas. En el proyecto final, `pnpm format` y `pnpm lint` terminaron con salida 0, el código quedó idéntico a la candidata, la sintaxis Python fue válida sin cachés y `git diff --check` no detectó errores. Los archivos protegidos conservaron sus hashes y no se creó una base de datos en el proyecto real.

Se retiraron las dos copias, el entorno Python, logs y scripts/fixtures de verificación propios. Los servidores temporales se habían detenido al terminar sus pruebas. No quedan comprobaciones necesarias pendientes; Windows solo se verificó mediante ramas simuladas, como prevé el plan. El servicio real de IA y el arranque local real sí se comprobaron. Al cerrar estas verificaciones aún no se habían realizado commits, push ni acciones de GitHub. Miguel aprobó la revisión final el 2026-10-27 y autorizó guardar los commits, subirlos y actualizar la descripción de #518; la PR conserva `staging` como destino.
