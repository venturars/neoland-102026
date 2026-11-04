# Tareas · Acceso compartido a datos

Issue: #822 · PR: #823, draft hacia staging.
Referencias: [spec](spec.md) y [plan](plan.md), aprobados el 2026-11-03.
Estado: aprobadas por Miguel el 2026-11-03. Implementadas y verificadas localmente.

## Preparar la comprobación

- [x] **T01 · Registrar el comportamiento actual.** En una copia desechable sin
  base real, inicializar y capturar resultados de CRUD, búsquedas, duplicados,
  validaciones y precedencia. Incluir listas vacías, búsqueda por nombre sin
  coincidencias, usuario inexistente y actualización con campos omitidos.
  **Hecha cuando:** hay resultados previos comparables y constancia del estado
  del modelo local. **CA-01,03,04,05,07.**

## Adaptar el acceso a datos

- [x] **T02 · Convertir el texto de las consultas.** Crear los ocho módulos .js
  correspondientes a los .sql y retirar estos últimos. Añadir el módulo
  list-tables.js con la consulta de inicialización existente.
  **Hecha cuando:** las ocho sentencias son iguales a las originales y cada
  texto se importa de su módulo separado. **CA-02,03.**
- [x] **T03 · Preparar las pruebas del servicio.** Con node:test y assert, cubrir
  exec/get/all/run, ausencia de fila, lista vacía, errores de consulta y
  petición inválida. Comprobar también el preflight OPTIONS de /execute y las
  cabeceras que permiten POST con JSON desde la futura página local, tanto en
  respuestas correctas como de error. Usar un servidor hijo y base temporal; asegurar limpieza
  incluso al fallar. Si el puerto 3000 está ocupado, informar sin detener
  procesos ajenos.
  **Hecha cuando:** fallan por faltar el servidor previsto. **CA-01,02,06.**
- [x] **T04 · Implementar el servidor.** Sustituir connection.js por server.js
  según el plan y añadir el comando server en package.json. Reconocer URL
  en ESLint para ese módulo.
  **Hecha cuando:** pasan las pruebas del servicio, arrancar no crea la tabla y
  reiniciar conserva los datos. La ruta sigue siendo relativa al módulo,
  también al arrancar desde otro directorio. **CA-01,02,06.**
- [x] **T05 · Adaptar queries/users.js.** Importar los textos, enviar mediante
  execute, esperar respuestas y añadir listTables(). Reconocer fetch en ESLint
  para ese módulo. Conservar los contratos
  de cada consulta, incluidos undefined, listas y metadatos de borrado.
  **Hecha cuando:** pruebas de consultas verifican tipos/resultados y rechazos
  ante fallos del servicio; queries ya no depende de módulos exclusivos de Node.
  **CA-02,03,06.**

## Propagar la espera a lógica y clientes

- [x] **T06 · Preparar regresión de operaciones.** Trasladar los casos de T01 a
  pruebas asíncronas de las operaciones, incluyendo precedencia de errores,
  preservación de contactos ajenos y fechas en lecturas.
  **Hecha cuando:** las comprobaciones detectan las llamadas aún síncronas o sus
  resultados incorrectos. **CA-03,04,05,06.**
- [x] **T07 · Adaptar CRUD y búsquedas.** Añadir async y await en los siete módulos
  afectados de logic, conservando los try/catch y el orden actual.
  **Hecha cuando:** pasan las regresiones de T06 con los mismos resultados y
  mensajes que T01. **CA-03,04,05,06.**
- [x] **T08 · Adaptar el clasificador.** Esperar findAll() en su captura actual.
  **Hecha cuando:** base vacía devuelve ceros sin llamar al modelo y un fallo de
  recuperación produce su error actual. Verificar que prompt, configuración,
  lotes y tratamiento de respuestas permanecen iguales. **CA-07.**
- [x] **T09 · Adaptar los ejemplos Terminal.** Esperar las acciones y utilizar
  createUsersTable()/listTables() en la inicialización. Comprobar cómo muestran
  los errores asíncronos antes de dar por terminado cada ejemplo.
  **Hecha cuando:** los nueve ejemplos ejecutados en la copia muestran resultados
  o errores concretos; la prueba no vacía del clasificador se registra aparte
  si requiere el modelo. **CA-02,03,04,06,07.**
- [x] **T10 · Adaptar Jupyter.** Actualizar las esperas de run-operation.js y la
  comprobación de server.js en client.py. Revisar los nueve notebooks y ajustar
  sus referencias o llamadas afectadas.
  **Hecha cuando:** el adaptador real reconoce la copia, espera los resultados y
  presenta sus tablas/errores. Los notebooks modificados se ejecutan en la copia;
  no se incorporan outputs de prueba. **CA-02,03,06,07.**

## Verificar y documentar

- [x] **T11 · Comprobar ambos clientes.** Crear desde Terminal y consultar desde
  Jupyter; modificar desde Jupyter y consultar desde Terminal. Probar también
  borrado, reinicio y servicio detenido, sin rechazos sin manejar ni éxitos falsos.
  **Hecha cuando:** los cambios son compartidos y las comprobaciones de datos,
  errores y persistencia pasan. **CA-01,03,04,05,06.**
- [x] **T12 · Comprobar el modelo local.** Si está disponible, ejecutar el
  clasificador con contactos y comprobar los tres recuentos, su total y que no
  modifica datos. Distinguir esa ejecución de pruebas controladas de fallos.
  **Hecha cuando:** existe evidencia de la ejecución real y sus comprobaciones
  pasan. Si el modelo no está disponible, dejar esta tarea pendiente y registrar
  el bloqueo.
  **CA-07.**
- [x] **T13 · Actualizar las guías.** README, DATABASE, ARCHITECTURE, TREE, ERRORS
  y la descripción limitada de los contratos asíncronos en CONSTITUTIONS.
  **Hecha cuando:** describen el código resultante y permiten arrancar el servicio,
  inicializar y usar los clientes, conservando las reglas aprobadas. **CA-08.**
- [x] **T14 · Revisar la entrega.** Ejecutar pnpm format y luego pnpm lint. Formatear también los archivos de prueba
  con el Prettier existente si quedan fuera del comando format. Ejecutar de nuevo
  las pruebas y revisar el diff frente al alcance aprobado.
  **Hecha cuando:** comandos correctos, dependencias intactas, evidencia por
  criterio y pendientes explícitos; procesos propios parados y temporales
  retirados. **CA-01 a CA-08.**

## Revisión previa

Las tareas cubren el plan aprobado y sus ocho criterios. Los casos de una fila y
listas se verifican por separado. Los cambios se comprueban en copias con datos
propios, conservando el proyecto de trabajo. Esta lista termina en la revisión
local; commits, push y solicitud de revisión requieren el momento Git solicitado.


## Evidencia · 2026-11-03

Verificación con Node 24.22.1 en copias desechables, sin abrir la base de trabajo.

- **T01, T06–T08 · CA-03,04,07:** 32 resultados de operaciones comparados con
  la implementación anterior: coincidieron, normalizando solo las fechas para
  esa comparación. Las regresiones comprueban también fechas completas,
  contactos ajenos, orden, cinco campos, duplicados y precedencia de errores.
- **T02 · CA-02,03:** los ocho textos SQL exportados coinciden byte por byte
  con los archivos originales. La consulta de tablas mantiene sqlite_master.
- **T03–T05 · CA-01,02,06:** `node --test tests/serve-data-through-node.test.js`
  pasa. Comprueba exec/get/all/run, fila ausente, listas, inicialización explícita,
  reinicio, ruta independiente del directorio actual, puerto ocupado,
  OPTIONS/CORS, peticiones inválidas, SQL inválido, servicio detenido y respuestas
  inutilizables. El servidor informa el puerto ocupado sin detener al primero.
  El contrato falló contra la copia anterior por faltar server.js y pasa contra
  la nueva. Se había preparado un prototipo antes de ejecutar esa comprobación;
  no se presenta como una secuencia TDD completa.
- **T09–T11 · CA-03,05,06:** se ejecutaron con Bash los nueve ejemplos Terminal,
  las nueve acciones del adaptador Python/Node y los nueve notebooks con nbclient
  y el kernel existente `first-app-ai`. Los IDs de ejemplo se sustituyeron solo
  en memoria para ejercitar actualización y borrado; no se guardaron outputs.
  Crear desde Terminal se ve en Jupyter; actualizar desde Jupyter se ve en
  Terminal. Borrado, reinicio y servicio detenido dieron los resultados previstos.
- **T12 · CA-07:** ejecución real con el Ollama y llama3.2 existentes, usando tres
  contactos ficticios. Resultado observado: women=1, men=1, genderUndefined=1.
  Se comprobaron claves, enteros no negativos, total=3 y contactos/fechas intactos.
  El caso vacío y el fallo de recuperación se comprobaron sin depender del modelo.
- **T13–T14 · CA-08:** guías actualizadas y diff revisado. `pnpm format`, Prettier
  sobre el test y `pnpm lint` pasan; la prueba de integración final también.
  En la copia con node_modules enlazado se utilizó
  `--config.verifyDepsBeforeRun=false` para evitar una instalación automática.
  No cambiaron dependencias, lockfile, prompt ni configuración del clasificador.

La revisión corrigió el manejo de una URL de petición inválida y añadió las
comprobaciones de puerto ocupado y respuestas inutilizables. Un error de nombre
local en el propio test se corrigió y la ejecución final pasó.
Los servidores de prueba se detuvieron y las copias temporales se retiraron;
el Ollama existente quedó en ejecución. Cambios locales pendientes de revisión,
sin commit ni push.
