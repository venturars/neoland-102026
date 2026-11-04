Issue: #945

# Plan de la extensión de Chrome

Estado: spec y plan aprobados para el cliente descrito y sus adaptaciones
indispensables al proyecto y a Windows. Las alertas Socket y la limitación
de campañas documentadas han sido aceptadas expresamente por la persona
que revisa. Las tareas han sido aprobadas y la implementación está
autorizada. Tras confirmar la prueba manual, la persona solicita continuar
el workflow para guardar y publicar la entrega en una PR draft. No se hace merge.

## Solución y límites

La raíz de trabajo es `staff/jimena-duran/first-app`.
Se escribirá una implementación propia siguiendo STYLE.md. El cliente HTTP
local en `src/clients/http/app.js` sirve para comprobar las firmas, rutas
y traducción de errores; no se copiarán sus archivos.

La API Fastify importará desde `../../logic/` los módulos `.js` de
`createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`.
Mantendrá `ORIGIN` en `http://127.0.0.1:3002` y escuchará en esa dirección.
No importará las operaciones de clasificación ni de búsqueda por nombre
o email. La base SQL sigue en 3000 y Express en 3001.

| Ruta | Llamada existente | Respuesta correcta |
| --- | --- | --- |
| POST /users | `createUser({ name, email })` | 201, usuario |
| GET /users | `listUsers()` | 200, lista |
| GET /users/:id | `findUserById(id)` | 200, usuario |
| PATCH /users/:id | `updateUser(id, changes)` | 200, usuario |
| DELETE /users/:id | `deleteUser(id)` | 204, sin cuerpo |

Fastify leerá JSON con su parser integrado. El id permanece como texto de
la ruta. PATCH incluye en `changes` solo las propiedades recibidas cuyo
valor no sea `undefined`. Las reglas permanecen en la lógica existente.
Una ruta desconocida devolverá 404 sin cuerpo.

| Mensaje | Estado |
| --- | --- |
| `Name is empty` | 400 |
| `Email is invalid` | 400 |
| `Email is already used` | 409 |
| `User not found` | 404 |
| `Could not create the user` | 500 |
| `Could not list the users` | 500 |
| `Could not find the user` | 500 |
| `Could not update the user` | 500 |
| `Could not delete the user` | 500 |

Los errores conocidos de cada acción se devolverán como JSON `{ message }`.
Una excepción inesperada de la operación se traducirá al `Could not ...`
correspondiente. No se añade validación en la API. Por ejemplo, crear con
JSON sin nombre acaba en 500 `Could not create the user`.
No se añaden firmas de lógica, SQL ni cliente de terminal: son operaciones
ya disponibles, accesibles desde otro cliente.

## Archivos y comportamiento de la extensión

Se crearán exactamente estos archivos de cliente:

- `src/clients/chrome/server.js`: API descrita arriba.
- `src/clients/chrome/manifest.json`: Manifest V3, nombre `Usuarios`, versión
  `0.0.0`, acción `default_popup: index.html` y permiso de host
  `http://127.0.0.1:3002/*`; sin content scripts.
- `src/clients/chrome/index.html`: pantalla en español con formularios de
  crear, consultar, modificar y borrar, lista y espacio para mensajes.
  Carga `./styles.css` y el módulo `./popup.js`.
- `src/clients/chrome/popup.js`: usa `fetch` a `ORIGIN`, sin imports de
  lógica ni otros clientes. Escribe los datos con `textContent`.
- `src/clients/chrome/styles.css`: presentación de la pantalla del popup.

La lista y la consulta muestran `id`, `name`, `email`, `createdAt` y
`updatedAt`. Crear envía nombre y email, incluidos los vacíos; modificar
solo envía los campos cuyo valor sea distinto de la cadena vacía.
Crear y modificar muestran el usuario y refrescan la lista. Borrar trata
el 204 sin leer JSON, limpia el usuario mostrado y refresca la lista.
Si la respuesta contiene `message`, se muestra su texto.

Se añadirá `fastify` exacto `5.12.8` en `dependencies` de `package.json`,
el script `chrome: node src/clients/chrome/server.js` y el glob
`src/clients/chrome/**/*.js` al script `format`. El lockfile se resolverá
con pnpm, conservando las versiones existentes. No se añade CORS: el
permiso del manifest permite el acceso desde la extensión.

`server.js` declarará los globales `console` y `URL`, y `popup.js` los
globales `document` y `fetch`. ESLint ya cubre los archivos JavaScript.
Se actualizarán `docs/TREE.md` y `docs/ARCHITECTURE.md` para incluir los
cinco archivos y el flujo extensión → API Fastify → lógica → consultas →
servidor SQL. Se creará `README.md` con arranque y carga manual.

## Adaptaciones previstas para este proyecto

Las rutas de documentación y comandos apuntarán a la carpeta de Jimena.
Se conserva Electron y el resto de dependencias y scripts locales.
El README usará PowerShell: desde la raíz del repositorio,
`Set-Location staff/jimena-duran/first-app`; en dos terminales, ejecutar
`corepack pnpm server` y `corepack pnpm chrome` respectivamente.
Se cargará manualmente `src/clients/chrome` desde `chrome://extensions`,
con modo desarrollador y «Cargar extensión sin empaquetar».
No se añade un lanzador ni se modifica la automatización Git Bash.

El entorno comprobado tiene Node `24.22.0` y pnpm `12.14.0` mediante
Corepack. No se cambia la versión global del gestor. Los rangos transitivos
pueden resolver versiones distintas del inventario propuesto: cualquier
diferencia requiere revisión Socket antes de continuar, sin forzar el
lockfile ni instalar otra versión para ocultar la diferencia.

## Comprobaciones previstas tras autorizar la implementación

Ejecutar formato y lint; comprobar que no cambia lógica, consultas ni el
cliente HTTP. Comprobar arranque en 3000 y 3002, lista vacía, cinco
operaciones, cinco datos, modificación del nombre conservando id y email,
borrado 204, errores de validación, ids inexistentes, base inaccesible en
cada acción, cuerpo sin nombre y ruta desconocida. Repetir las acciones y
mensajes documentados en la extensión cargada manualmente en Chrome y
confirmar que solo consume 3002. El detalle se prepara en `tasks.md`, sin
añadir suites, investigaciones ni comprobaciones adicionales.
Resultados del 4 de noviembre de 2026:

- `corepack pnpm install` instaló Fastify 5.12.8. Las 48 versiones resueltas
  hasta tres capas coinciden con el inventario Socket; el lockfile conserva
  las versiones existentes y solo incorpora las entradas necesarias.
- `corepack pnpm format` y `corepack pnpm lint` terminaron correctamente.
  No hay cambios versionados en lógica, consultas, servidor SQL ni otros
  clientes. Las URLs de los archivos del cliente son texto normal.
- La API arrancó desde el proyecto con `corepack pnpm chrome`, en 3002.
  La comprobación posterior usó una copia temporal: el servidor de 3000
  ya estaba ocupado y no se detuvo. Solo en esa copia se dirigieron
  consultas y servidor SQL a 31000, con una base temporal vacía; la API
  permaneció en 3002. Los archivos entregados conservan la base en 3000.
- En la copia temporal pasaron las comprobaciones API de lista vacía,
  alta 201, cinco datos, listado, consulta, cambio de nombre conservando
  id/email, validaciones 400/400/409 sin nuevas altas, id inexistente en
  GET/PATCH/DELETE, borrado 204 vacío y lista vacía posterior. También
  pasaron ruta desconocida 404 vacía, POST sin nombre 500 y los cinco
  mensajes 500 al detener únicamente la base temporal.
- En Chrome 156.0.8078.80 para Windows se cargó la extensión sin empaquetar
  mediante el selector de carpeta de `chrome://extensions`. Se comprobó
  su estado habilitado y la apertura del popup. En su página de extensión
  pasaron lista vacía, creación y cinco datos, consulta, modificación del
  nombre omitiendo email, borrado y refresco, tres validaciones, id
  inexistente en las tres acciones y conservación del usuario existente.
  Solo se observaron solicitudes HTTP a 3002. Con la base temporal
  detenida se mostraron los cinco mensajes `Could not ...`.

No se ejecutaron suites adicionales ni nuevas investigaciones Socket.
La evidencia de seguridad y su aceptación se conservan a continuación.
La persona que revisa confirmó su prueba manual y pidió continuar el workflow.

## Socket: consultas, resultados y límites de acceso

Consultas propias del 4 de noviembre de 2026 mediante MCP Socket.
Tras errores iniciales HTTP 429, se reintentaron las consultas con éxito.
`depscore` consultó los 48 paquetes/versiones del inventario propuesto
hasta tres capas, con versiones exactas y plataforma `win32-x64`.
Cada paquete/versión tiene cinco puntuaciones: son 240 puntuaciones en
total. Ninguna es inferior a 50; la mínima es 75. Estas puntuaciones no
enumeran alertas ni acreditan ausencia de campañas.
En el momento de las consultas Socket, el inventario aún no estaba
instalado ni resuelto en el lockfile local. La comprobación posterior de
instalación y coincidencia está registrada en los resultados anteriores.

| Consulta realizada | Resultado observado | Qué permite concluir |
| --- | --- | --- |
| `organizations` | Una organización: `neoland-grrl6` | Identifica la organización de esta cuenta. |
| `depscore`, lote de 48 paquetes/versiones | Cinco puntuaciones por entrada, recogidas abajo | Se comprobó el umbral de 50 para las 240 puntuaciones. |
| `alerts`, organización `neoland-grrl6`, `artifact_type: npm`, `status: open`, `per_page: 5000` | `items: []`, `endCursor: null` | La consulta completa no devolvió alertas abiertas monitorizadas por esa organización; no quedó otra página. No acredita análisis individual de estas versiones. |
| API PURL por versión, lote explícito de las 48 entradas de este plan, organización `neoland-grrl6`, `alerts=true&poll=false&summary=true` | HTTP 200; 48 registros de paquetes y un resumen: `purl_input: 48`, `resolved: 48`, cero errores de resolución | Hay respuesta con id, versión y campo `alerts` para cada entrada; ninguna indica `pendingScan` o `notFound`. Los resultados por versión se recogen abajo. |
| `threat_feed`, organización `neoland-grrl6`, `ecosystem: npm`, `name: fastify`, `version: 5.12.8` | HTTP 403, `threat_feed_not_entitled` | El servicio de campañas no está habilitado para la organización. No hay resultado sobre campañas. |

No se consultó `threat_feed` individualmente para las otras 47 entradas:
el rechazo corresponde al acceso al servicio de la organización, no a
Fastify. Repetirlo con cada paquete no solventaría esa limitación.
No se declara presencia ni ausencia de campañas para ninguna entrada.

No se realizaron consultas `alerts` filtradas por nombre. Están disponibles,
pero filtran el mismo inventario organizativo ya recorrido por completo;
no amplían su cobertura ni añaden un filtro por versión, que esa herramienta
no admite. La ausencia de evidencia individual de alertas no se atribuye
a un 403: es una limitación del alcance de esa consulta.

Las cinco puntuaciones de la tabla siguen el orden licencia/mantenimiento/
calidad/cadena de suministro/vulnerabilidades. «Sin evidencia por versión»
no equivale a «sin alertas». No se reutilizan resultados históricos.

La columna de alertas se actualiza con la respuesta PURL: 23 entradas con
alertas y 25 con `alerts: []`. En todas las alertas la acción devuelta es
`ignore`: representa la política de la organización, no aceptación humana
ni ausencia de riesgo. Se conservan los tipos y severidades literales
`low` y `middle`; ×N indica varias alertas del mismo tipo y severidad.
«Lista vacía en PURL» describe únicamente el resultado de esta consulta,
no una garantía de ausencia de problemas. La consulta no verifica campañas.

| Paquete y versión propuestos | Puntuaciones | Campañas | Alertas | Alguna <50 |
| --- | --- | --- | --- | --- |
| `fast-deep-equal@3.1.3` | 100/75/99/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `require-from-string@2.0.2` | 100/75/80/100/100 | No disponible | debugAccess (low); unmaintained (low); acción ignore | No |
| `dequal@2.0.3` | 100/79/100/100/100 | No disponible | Lista vacía en PURL | No |
| `fast-querystring@1.1.2` | 100/79/100/99/100 | No disponible | Lista vacía en PURL | No |
| `fast-decode-uri-component@1.0.1` | 100/75/81/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `split2@4.2.0` | 100/80/95/100/100 | No disponible | Lista vacía en PURL | No |
| `quick-format-unescaped@4.0.4` | 100/75/89/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `on-exit-leak-free@2.1.2` | 100/79/85/100/100 | No disponible | Lista vacía en PURL | No |
| `abstract-logging@2.0.1` | 100/75/77/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `ajv-formats@3.0.1` | 100/83/100/99/100 | No disponible | Lista vacía en PURL | No |
| `rfdc@1.4.1` | 100/81/100/100/100 | No disponible | Lista vacía en PURL | No |
| `safe-stable-stringify@2.5.0` | 100/84/100/100/100 | No disponible | Lista vacía en PURL | No |
| `reusify@1.1.0` | 100/79/100/100/100 | No disponible | Lista vacía en PURL | No |
| `pino-abstract-transport@3.0.0` | 100/81/100/100/100 | No disponible | newAuthor (low); acción ignore | No |
| `@pinojs/redact@0.4.0` | 100/81/100/100/100 | No disponible | Lista vacía en PURL | No |
| `pino-std-serializers@7.1.0` | 100/82/100/100/100 | No disponible | Lista vacía en PURL | No |
| `sonic-boom@4.2.1` | 100/88/100/100/100 | No disponible | filesystemAccess (low); acción ignore | No |
| `ajv@8.20.0` | 100/84/100/99/100 | No disponible | gptAnomaly ×3 (low); urlStrings (low); usesEval (middle); acción ignore | No |
| `cookie@2.0.1` | 100/85/100/100/100 | No disponible | Lista vacía en PURL | No |
| `toad-cache@3.7.4` | 100/81/100/100/100 | No disponible | Lista vacía en PURL | No |
| `ipaddr.js@2.5.0` | 100/82/100/100/100 | No disponible | Lista vacía en PURL | No |
| `fastq@1.20.3` | 100/82/100/100/100 | No disponible | Lista vacía en PURL | No |
| `pino@10.4.0` | 100/90/100/98/100 | No disponible | gptAnomaly (low); debugAccess ×2 (low); envVars ×4 (low); filesystemAccess (low); urlStrings (low); acción ignore | No |
| `light-my-request@6.8.0` | 100/89/100/99/100 | No disponible | networkAccess (middle); acción ignore | No |
| `@fastify/ajv-compiler@4.0.7` | 100/92/100/99/100 | No disponible | urlStrings (low); acción ignore | No |
| `avvio@9.3.1` | 100/91/100/100/100 | No disponible | Lista vacía en PURL | No |
| `find-my-way@9.10.0` | 100/89/100/99/100 | No disponible | urlStrings (low); usesEval ×5 (middle); acción ignore | No |
| `@fastify/fast-json-stringify-compiler@5.1.1` | 100/85/100/99/100 | No disponible | gptAnomaly (low); usesEval (middle); acción ignore | No |
| `@fastify/error@4.2.1` | 100/86/100/100/100 | No disponible | Lista vacía en PURL | No |
| `@fastify/proxy-addr@5.1.2` | 100/88/100/100/100 | No disponible | gptSecurity (middle); acción ignore | No |
| `@fastify/merge-json-schemas@0.2.2` | 100/86/100/100/100 | No disponible | Lista vacía en PURL | No |
| `json-schema-ref-resolver@3.0.1` | 100/88/100/100/100 | No disponible | Lista vacía en PURL | No |
| `safe-regex2@5.1.2` | 100/87/90/100/100 | No disponible | Lista vacía en PURL | No |
| `secure-json-parse@4.1.1` | 100/89/100/100/100 | No disponible | Lista vacía en PURL | No |
| `process-warning@5.1.1` | 100/89/100/100/100 | No disponible | Lista vacía en PURL | No |
| `ret@0.5.1` | 100/90/99/100/100 | No disponible | Lista vacía en PURL | No |
| `fast-uri@4.2.3` | 100/98/100/100/100 | No disponible | urlStrings (low); acción ignore | No |
| `fast-uri@3.1.9` | 100/98/100/100/100 | No disponible | urlStrings (low); acción ignore | No |
| `@fastify/forwarded@3.1.2` | 100/87/82/100/100 | No disponible | Lista vacía en PURL | No |
| `@fastify/deepmerge@3.2.4` | 100/86/100/100/100 | No disponible | Lista vacía en PURL | No |
| `set-cookie-parser@3.2.2` | 100/93/100/100/100 | No disponible | Lista vacía en PURL | No |
| `fast-json-stringify@7.2.1` | 100/96/100/99/100 | No disponible | gptSecurity (middle); urlStrings (low); usesEval ×2 (middle); acción ignore | No |
| `fastify@5.12.8` | 100/97/100/98/100 | No disponible | debugAccess ×5 (low); networkAccess ×6 (middle); urlStrings (low); acción ignore | No |
| `semver@7.8.6` | 100/95/100/100/100 | No disponible | envVars ×3 (low); urlStrings (low); acción ignore | No |
| `thread-stream@4.2.1` | 100/84/100/99/100 | No disponible | gptAnomaly (low); envVars ×2 (low); acción ignore | No |
| `json-schema-traverse@1.0.0` | 100/75/99/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `atomic-sleep@1.0.0` | 100/75/85/100/100 | No disponible | unmaintained (low); acción ignore | No |
| `real-require@1.0.0` | 100/83/75/99/100 | No disponible | dynamicRequire (low); newAuthor (low); trivialPackage (middle); usesEval (middle); acción ignore | No |

## Resumen agrupado de alertas y procedencia de ignore

La consulta de detalle PURL confirmó en todas las alertas
`action: ignore`, `actionSource.type: org-policy` y un candidato
`org-policy` con `actionPolicyIndex: 0` y `repoLabelId: ""`.
Socket detecta las alertas y devuelve la acción efectiva; en este caso
la fuente de esa acción es la política de `neoland-grrl6`, no una
conclusión de seguridad tomada por este agente. La respuesta no identifica
quién configuró la política, su justificación humana ni si sus valores
fueron personalizados o heredados de un preset. El índice 0 no acredita
una regla específica ni su motivo. No se inventa una justificación
individual de ignore: ese motivo no se devuelve en los datos consultados.

Según la documentación oficial, ignore evita mostrar, notificar y bloquear
por esas alertas. Esto también explica que la lista organizativa de alertas
pueda estar vacía mientras PURL sí devuelve indicadores. No equivale a
resolver el indicador ni a aceptar el riesgo de este plan.
Fuentes: [acciones](https://docs.socket.dev/docs/security-policy-defaults)
y [políticas](https://docs.socket.dev/docs/policies).

La tabla agrupa ocurrencias por tipo y severidad, conservando las versiones.
La procedencia de ignore es la misma para todas las filas: `org-policy`;
la justificación particular de la regla no está disponible en la respuesta.

| Tipo y severidad literal | Paquetes/versiones y ocurrencias | Interpretación para este cliente |
| --- | --- | --- |
| `unmaintained`, low | `json-schema-traverse@1.0.0`, `fast-deep-equal@3.1.3`, `require-from-string@2.0.2`, `fast-decode-uri-component@1.0.1`, `atomic-sleep@1.0.0`, `quick-format-unescaped@4.0.4`, `abstract-logging@2.0.1`: una cada uno | Riesgo de mantenimiento por antigüedad de publicación; no demuestra un fallo actual, pero puede dificultar correcciones futuras. |
| `newAuthor`, low | `pino-abstract-transport@3.0.0`, `real-require@1.0.0`: una cada uno | Señal informativa de cambio de autor; no prueba compromiso ni ejecución maliciosa. |
| `urlStrings`, low | `ajv@8.20.0`, `pino@10.4.0`, `@fastify/ajv-compiler@4.0.7`, `find-my-way@9.10.0`, `fast-uri@4.2.3`, `fast-uri@3.1.9`, `fast-json-stringify@7.2.1`, `fastify@5.12.8`, `semver@7.8.6`: una cada uno | Presencia de URLs, incluidas referencias de esquemas y ejemplos. No demuestra conexiones ni exfiltración. |
| `debugAccess`, low | `require-from-string@2.0.2` ×1; `pino@10.4.0` ×2; `fastify@5.12.8` ×5 | Acceso a `module` o a módulos de diagnóstico, hooks y rendimiento. Indicador de capacidad, no prueba de depuración remota abierta. |
| `envVars`, low | `pino@10.4.0` ×4; `semver@7.8.6` ×3; `thread-stream@4.2.1` ×2 | Las ubicaciones identifican `NODE_OPTIONS`, `NODE_DEBUG` y `NODE_V8_COVERAGE`, respectivamente, además de accesos sin nombre concreto. No hay evidencia en estas alertas de lectura de la credencial Socket. |
| `filesystemAccess`, low | `sonic-boom@4.2.1`, `pino@10.4.0`: una cada uno | Acceso a `fs` en salida y transporte de logs. Puede importar si se habilitan destinos de archivo; no se proponen transportes ni destinos externos en este cliente. |
| `networkAccess`, middle | `light-my-request@6.8.0` ×1; `fastify@5.12.8` ×6 | Importaciones HTTP y, en Fastify, HTTPS/HTTP2/DNS. Es una capacidad esperable de una biblioteca de servidor; no demuestra envío de datos externo. El servidor propuesto escucha en 127.0.0.1:3002. |
| `dynamicRequire`, low | `real-require@1.0.0` ×1 | Carga de módulos elegidos en ejecución: riesgo si un tercero controla la ruta. El plan no expone rutas de módulos en el CRUD. |
| `trivialPackage`, middle | `real-require@1.0.0` ×1 | Aviso de paquete pequeño y dependencia adicional; no demuestra por sí solo una vulnerabilidad. Mantenerlo no supone cambiar el alcance ni añadir código para sustituirlo. |
| `usesEval`, middle | `real-require@1.0.0` ×1; `ajv@8.20.0` ×1; `find-my-way@9.10.0` ×5; `@fastify/fast-json-stringify-compiler@5.1.1` ×1; `fast-json-stringify@7.2.1` ×2 | Ejecución dinámica o compilación de código. Puede afectar si datos no confiables pasan a código, esquemas o configuración del router; el plan solo acepta datos de usuario y rutas fijas. No es una prueba de explotación. |
| `gptAnomaly`, low | `ajv@8.20.0` ×3; `pino@10.4.0` ×1; `@fastify/fast-json-stringify-compiler@5.1.1` ×1; `thread-stream@4.2.1` ×1 | Avisos heurísticos con contexto específico detallado abajo; no deben descartarse solo por tener severidad low. |
| `gptSecurity`, middle | `@fastify/proxy-addr@5.1.2`, `fast-json-stringify@7.2.1`: una cada uno | Avisos heurísticos de carga de código y generación de serializadores, detallados abajo; no son por sí solos CVE confirmadas. |

Los indicadores informativos de autor, URLs y diagnósticos no acreditan
un problema de comportamiento del cliente. Los accesos a red, archivos y
entorno son capacidades que requieren contexto; mantenimiento, carga de
módulos y evaluación de código sí representan riesgos que se deben valorar.
Esta clasificación es una interpretación del agente basada en las alertas
y la solución propuesta, no una reducción de severidad emitida por Socket.

Los avisos heurísticos con posible efecto tienen estos límites concretos:

- `ajv@8.20.0`: dos de las tres notas señalan generación y ejecución de
  código a partir de esquemas o keywords controlables; la tercera trata
  validación de timestamps y no describe actividad maliciosa en ese
  fragmento. El plan no incorpora esquemas externos, keywords ni modo
  standalone.
- `@fastify/fast-json-stringify-compiler@5.1.1`: la nota afecta a
  `package/standalone.js`, generación y ejecución con `new Function` desde
  esquemas/opciones. Ese modo no está previsto en la solución.
- `fast-json-stringify@7.2.1`: la nota en `package/index.js` plantea posible
  inyección mediante `patternProperties` y ejecución directa en `restore()`
  si se aceptan esquemas o código de un atacante. El CRUD no acepta esos
  parámetros ni propone llamar a `restore()`; la nota no demuestra que un
  nombre o email pueda alcanzar esos mecanismos.
- `pino@10.4.0` y `thread-stream@4.2.1`: las notas señalan carga dinámica
  de transportes mediante `target` o `workerData.filename`. No se propone
  configurar transportes ni aceptar esas rutas del usuario. La nota de
  thread-stream reconoce confianza reducida por un fragmento incompleto.
- `@fastify/proxy-addr@5.1.2`: el aviso está en
  `package/benchmark/index.js`, que ejecuta archivos JavaScript vecinos.
  No se propone ejecutar benchmarks; no es un hallazgo sobre la ruta
  normal de resolución de direcciones del cliente.

La API Node es la parte que incorpora estas dependencias; el popup no las
importa, solo utiliza fetch. Esto no demuestra que todas las rutas de las
dependencias sean inalcanzables. Las comprobaciones funcionales realizadas
se registran arriba; no se han auditado exhaustivamente las bibliotecas ni probado
explotaciones. La persona que revisa ha aceptado expresamente las alertas
documentadas y la falta de datos de campañas, sin solicitar nuevas
investigaciones ni cambios de versiones o alcance.

## Consulta PURL realizada y aceptación humana registrada

Se consultó la API documentada en `docs/SOCKET.md`, con autenticación
separada del MCP. La credencial se tomó de `SOCKET_API_TOKEN`, permaneció
en memoria y no se imprimió ni se guardó en archivos. Solo se registraron
los datos de paquetes y resultados necesarios para esta revisión.

El lote se construyó a partir de las 48 entradas de la tabla, no de las
dependencias directas del lockfile actual. Cada PURL incluye la versión
exacta y codifica el ámbito de los paquetes scoped como `%40`.
Se usó POST a
`https://api.socket.dev/v0/orgs/neoland-grrl6/purl?alerts=true&poll=false&summary=true`.

El primer intento falló con `System.Net.WebException`, sin respuesta HTTP
(código local 0; no es un estado HTTP del servicio). El reintento con
acceso de red autorizado respondió HTTP 200. Por tanto, ese fallo inicial
no demuestra un problema de credencial o de acceso a la cuenta.

Se recibieron 49 registros: 48 paquetes/versiones y un resumen. Los 48
registros coinciden con las entradas solicitadas y contienen id, versión
y campo `alerts`; no se observaron errores de resolución, `pendingScan`,
`notFound` ni entradas sin respuesta. El resumen declara 48 entradas y
48 resueltas, con cero errores `purl_malformed`,
`purl_ecosystem_not_enabled` y `package_not_found`. La cobertura no se
deduce solo del resumen: también se revisaron los registros individuales.
Las puntuaciones anteriores no se volvieron a consultar ni se modificaron.

Los tipos de alerta son indicadores devueltos por Socket; no acreditan
por sí solos una vulnerabilidad explotable ni justifican descartarlos.
La persona que aprueba el plan ha aceptado las alertas indicadas por
paquete y versión, incluidas las de severidad `middle`. Esta aceptación
humana es independiente de la acción `ignore` de la organización y no
transforma los indicadores en una garantía de ausencia de riesgo.

También ha aceptado expresamente la limitación sobre campañas:
`threat_feed` está deshabilitado para esta organización y no se ha
obtenido información de campañas. La consulta PURL no subsana ese límite.
No se exige habilitar un servicio de pago para obtener datos inaccesibles.

No queda pendiente la consulta PURL por versión. No se repitieron las
puntuaciones ni se realizaron consultas filtradas de alertas organizativas:
estas últimas no ampliarían la cobertura de la consulta organizativa
completa ya realizada. Con `poll=false` se revisan los datos disponibles
en el momento de la respuesta, no se garantiza su exhaustividad futura.
El inventario instalado coincide con el propuesto en estas 48 versiones;
no fue necesario resolver diferencias ni repetir las consultas Socket.

Las tareas y sus comprobaciones están terminadas y la prueba manual está
confirmada por la persona que revisa. Se continúa el workflow de commit,
push de la rama y PR draft contra staging. El merge queda fuera.
