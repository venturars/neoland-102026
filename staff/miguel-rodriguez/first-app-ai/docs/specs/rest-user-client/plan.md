# Plan — cliente REST de usuarios

Issue: #909 · PR: #912.
Spec: [spec.md](spec.md), aprobada el 2026-11-04.
Estado: aprobado por Miguel el 2026-11-04, incluidos los hallazgos y límites de Socket.

## Recorrido

Postman → cliente HTTP → operaciones asíncronas existentes → queries → servicio
de datos en http://127.0.0.1:3000 → SQLite.

Añadir un único adaptador en src/clients/http/app.js. Importa createUser,
listUsers, findUserById, updateUser y deleteUser; espera sus resultados y traduce
sus errores a HTTP. Las reglas permanecen en src/logic/.

El adaptador usa Express, escucha solo en http://127.0.0.1:3001 y se arranca con
pnpm http. El servicio de datos se arranca antes con pnpm server. Ctrl+C detiene
cada proceso desde su terminal; el cliente informa de su dirección al arrancar
y de un fallo de escucha si el puerto está ocupado.

## Peticiones y respuestas

| Método y ruta | Llamada | Éxito |
| --- | --- | --- |
| POST /users | createUser({ name, email }) | 201, usuario JSON |
| GET /users | listUsers() | 200, lista JSON |
| GET /users/:id | findUserById(id) | 200, usuario JSON |
| PATCH /users/:id | updateUser(id, changes) | 200, usuario JSON |
| DELETE /users/:id | deleteUser(id) | 204, cuerpo vacío |

Leer el cuerpo con express.json(). Tomar únicamente name y email en creación
y modificación. Los campos omitidos en PATCH siguen omitidos al llamar la lógica.
Convertir el texto del parámetro de ruta a número antes de llamar las operaciones,
como exige el contrato de nuestra app. Las pruebas de ID inexistente usan un
ID numérico sin registro. La lógica conserva su validación y orden actuales.

Los errores reconocidos devuelven { message }:

| Mensaje | Estado |
| --- | --- |
| Name is empty; Email is invalid | 400 |
| Email is already used | 409 |
| User not found | 404 |
| Could not create/list/find/update/delete the user(s), según operación | 500 |

Usar los textos exactos de docs/ERRORS.md para cada operación. Un error inesperado
en un manejador devuelve 500 con el mensaje genérico de esa operación. Una ruta
no atendida devuelve 404 vacío. Un cuerpo JSON mal formado devuelve 400 vacío,
mediante el manejo del error de lectura, sin presentarlo como error de negocio.
No añadir capas genéricas ni repetir validaciones; escribir pasos explícitos
según docs/STYLE.md.

## Archivos

- Crear src/clients/http/app.js.
- Actualizar package.json: Express exacto, script http y cobertura del nuevo
  directorio en format. pnpm mantiene pnpm-lock.yaml tras autorizar instalación.
- Actualizar README.md con arranque y recorrido Postman; docs/ARCHITECTURE.md y
  docs/TREE.md con el adaptador y esta documentación SDD.
- Actualizar docs/CONSTITUTIONS.md para describir el nuevo cliente y la dependencia
  aprobada, manteniendo los contratos de las operaciones.

Los tests existentes de datos/web se ejecutan en serie. La verificación nueva es
el recorrido real de Postman registrado en tasks.md, sin añadir un framework.

## Verificación de la entrega

Usar una copia sin base ni artefactos locales; preparar su tabla y ejecutar ambos
servicios desde esa copia. En Postman comprobar las cinco rutas, lista vacía,
cinco campos exactos, orden por ID, modificación de uno y ambos campos y borrado.
Crear un segundo contacto para comprobar conflicto de email y conservación de
registros ajenos. Comprobar nombre vacío, email inválido e ID inexistente con sus
mensajes y estados. Verificar persistencia desde otro cliente existente.

Detener únicamente el servicio de datos y comprobar las cinco respuestas 500 con
entradas válidas y sus mensajes exactos; reiniciarlo y comprobar recuperación.
Probar ruta desconocida y JSON mal formado. Registrar petición, respuesta y
resultado observado. Si Postman no está disponible, comunicar el bloqueo: una
prueba por curl no acredita el recorrido exigido en Postman.

Ejecutar pnpm format, pnpm lint y después los dos tests Node existentes en serie.
Revisar el diff completo, detener procesos propios y retirar la copia desechable.
Publicar solo después de la revisión final, conservando staging como base de #912.

## Dependencia propuesta y Socket · 2026-11-04

Propuesta: express@5.3.0. Registro consultado con pnpm view, sin instalación ni
ejecución de paquetes. API consultada: https://expressjs.com/en/5x/api/.
La documentación de clase se consultó como referencia de alcance, no como una
revisión de seguridad trasladable a esta resolución.

Se consultaron metadatos del paquete, sus dependencias directas y las de estas,
incluidas las declaradas opcionales y peer. Las versiones siguientes son la
propuesta observada en el registro, no un lockfile generado. Tras instalar con
aprobación, cotejar las tres capas del lockfile con esta propuesta. Si aparece o
cambia un paquete o versión dentro de ellas, revisar la diferencia con Socket,
actualizar el plan y esperar la aprobación de Miguel del plan actualizado antes
de continuar. Si la resolución coincide, registrar el cotejo sin pedir otra
aprobación. No se excluyó ninguna plataforma en este recorrido de metadatos.

La API de Socket respondió HTTP 200 a POST
https://api.socket.dev/v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20
con las 47 versiones exactas. Se comprobó identidad por inputPurl, nombre y
versión: 47/47, sin pendientes, ausencias ni scores faltantes. Se consultaron
todas las alertas devueltas, incluidas las ignoradas y de severidad baja.

GET /v0/organizations respondió 200. GET /v0/orgs/neoland/alerts respondió 403:
falta alerts:list; no hay cobertura de alertas de organización. GET
/v0/orgs/neoland/threat-feed respondió 403: falta threat-feed:list. Este fallo
acredita falta de permiso del token, no ausencia de amenazas ni por sí solo una
restricción de plan. campaigns: coverage limited by the Socket plan; no se ha
obtenido cobertura completa de campañas. El MCP no está disponible y la búsqueda
de plugins no devolvió una conexión Socket adicional.

Resultados: ninguna de las cinco puntuaciones por debajo de 50. Se devolvieron
49 alertas: 2 high, 8 middle y 39 low. Las high son socketUpgradeAvailable en
es-define-property@1.0.1 y side-channel@1.1.1: proponen sustitutos @socketregistry,
no reportan por sí mismas una vulnerabilidad. No ejecutar socket optimize ni
sustituir dependencias como parte de esta tarea. Las restantes incluyen acceso
a red/archivos, variables de entorno, evaluación dinámica y mantenimiento.
Todas figuran con acción ignore por política de organización; eso no equivale
a aceptación de Miguel.

Se revisaron las notas de las dos gptAnomaly. En ipaddr.js@1.9.1, Socket describe
el fragmento como una biblioteca convencional de direcciones IP, sin indicadores
maliciosos detectados en ese fragmento; advierte de la interpretación octal de
números con ceros iniciales en validaciones sensibles. En send@1.2.1, describe
el fragmento como un componente convencional de archivos estáticos, sin señales
de comportamiento malicioso o fuga de datos en ese fragmento; advierte de
redirecciones construidas con entradas no fiables. Son observaciones del análisis
de esos fragmentos, no una garantía sobre todo el paquete. El cliente previsto
atiende las cinco rutas REST; no sirve archivos ni configura redirecciones.

Las alertas networkAccess y usesEval señalan capacidades: Express/router manejan
red y depd utiliza el constructor Function. Estas alertas no acreditan por sí
solas malware; su aceptación sigue siendo una decisión de Miguel para esta
propuesta y su cobertura declarada.

Miguel aceptó el 2026-11-04 los hallazgos de esta propuesta y la cobertura
incompleta de organización/campañas al aprobar el plan. Esta aceptación se aplica
a las versiones y cobertura aquí descritas; los cambios de resolución siguen
el cotejo y la aprobación definidos arriba. Credenciales fuera del repositorio.
La autenticación usada sigue https://docs.socket.dev/reference/authentication;
la referencia de consulta es https://docs.socket.dev/reference/batchpackagefetch.

### Resolución propuesta

47 versiones únicas; capas: paquete principal, 28 dependencias directas y 34 versiones en la tercera capa, con repeticiones entre capas.

| Paquete | Dependencias directas propuestas dentro de las tres capas |
| --- | --- |
| accepts@2.0.0 | mime-types@3.0.2, negotiator@1.1.0 |
| body-parser@2.4.0 | bytes@3.1.2, content-type@2.1.0, debug@4.4.3, http-errors@2.0.1, iconv-lite@0.7.3, on-finished@2.4.2, qs@6.17.1, raw-body@3.0.2, type-is@2.1.0 |
| debug@4.4.3 | ms@2.1.3 |
| express@5.3.0 | accepts@2.0.0, body-parser@2.4.0, content-disposition@2.0.1, content-type@2.1.0, cookie-signature@1.2.2, cookie@0.7.2, debug@4.4.3, depd@2.0.0, encodeurl@2.0.1, escape-html@1.0.3, etag@1.8.1, finalhandler@2.1.1, fresh@2.0.0, http-errors@2.0.1, merge-descriptors@2.0.0, mime-types@3.0.2, on-finished@2.4.2, once@1.4.0, parseurl@1.3.3, proxy-addr@2.0.8, qs@6.17.1, range-parser@1.3.0, router@2.2.0, send@1.2.1, serve-static@2.2.1, statuses@2.0.2, type-is@2.1.0, vary@1.1.2 |
| finalhandler@2.1.1 | debug@4.4.3, encodeurl@2.0.1, escape-html@1.0.3, on-finished@2.4.2, parseurl@1.3.3, statuses@2.0.2 |
| http-errors@2.0.1 | depd@2.0.0, inherits@2.0.4, setprototypeof@1.2.0, statuses@2.0.2, toidentifier@1.0.1 |
| mime-types@3.0.2 | mime-db@1.54.0 |
| on-finished@2.4.2 | ee-first@1.1.1 |
| once@1.4.0 | wrappy@1.0.2 |
| proxy-addr@2.0.8 | forwarded@0.2.0, ipaddr.js@1.9.1 |
| qs@6.17.1 | es-define-property@1.0.1, side-channel@1.1.1 |
| router@2.2.0 | debug@4.4.3, depd@2.0.0, is-promise@4.0.0, parseurl@1.3.3, path-to-regexp@8.4.2 |
| send@1.2.1 | debug@4.4.3, encodeurl@2.0.1, escape-html@1.0.3, etag@1.8.1, fresh@2.0.0, http-errors@2.0.1, mime-types@3.0.2, ms@2.1.3, on-finished@2.4.2, range-parser@1.3.0, statuses@2.0.2 |
| serve-static@2.2.1 | encodeurl@2.0.1, escape-html@1.0.3, parseurl@1.3.3, send@1.2.1 |
| type-is@2.1.0 | content-type@2.1.0, media-typer@1.1.1, mime-types@3.0.2 |

Versiones únicas consultadas: accepts@2.0.0, body-parser@2.4.0, bytes@3.1.2, content-disposition@2.0.1, content-type@2.1.0, cookie-signature@1.2.2, cookie@0.7.2, debug@4.4.3, depd@2.0.0, ee-first@1.1.1, encodeurl@2.0.1, es-define-property@1.0.1, escape-html@1.0.3, etag@1.8.1, express@5.3.0, finalhandler@2.1.1, forwarded@0.2.0, fresh@2.0.0, http-errors@2.0.1, iconv-lite@0.7.3, inherits@2.0.4, ipaddr.js@1.9.1, is-promise@4.0.0, media-typer@1.1.1, merge-descriptors@2.0.0, mime-db@1.54.0, mime-types@3.0.2, ms@2.1.3, negotiator@1.1.0, on-finished@2.4.2, once@1.4.0, parseurl@1.3.3, path-to-regexp@8.4.2, proxy-addr@2.0.8, qs@6.17.1, range-parser@1.3.0, raw-body@3.0.2, router@2.2.0, send@1.2.1, serve-static@2.2.1, setprototypeof@1.2.0, side-channel@1.1.1, statuses@2.0.2, toidentifier@1.0.1, type-is@2.1.0, vary@1.1.2, wrappy@1.0.2.

### Scores y alertas por versión

Scores de API 0–1 convertidos a 0–100. Columnas: supply chain, vulnerabilidad,
calidad, mantenimiento y licencia. Multiplicidad conservada por tipo/severidad.

| Versión | SC | V | Q | M | L | Alertas (todas ignore por política) |
| --- | --- | --- | --- | --- | --- | --- |
| accepts@2.0.0 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor (low) |
| body-parser@2.4.0 | 99.0 | 100 | 100 | 93.0 | 100 | Sin alertas devueltas |
| bytes@3.1.2 | 100 | 100 | 99.0 | 81.0 | 100 | Sin alertas devueltas |
| content-disposition@2.0.1 | 100 | 100 | 100 | 86.0 | 100 | Sin alertas devueltas |
| content-type@2.1.0 | 100 | 100 | 90.0 | 88.0 | 100 | Sin alertas devueltas |
| cookie@0.7.2 | 100 | 100 | 99.0 | 85.0 | 100 | Sin alertas devueltas |
| cookie-signature@1.2.2 | 100 | 100 | 69.0 | 82.0 | 100 | Sin alertas devueltas |
| debug@4.4.3 | 99.0 | 100 | 100 | 81.0 | 100 | envVars (low) ×6 |
| depd@2.0.0 | 99.0 | 100 | 100 | 75.0 | 100 | envVars (low) ×2; unmaintained (low); usesEval (middle) |
| ee-first@1.1.1 | 100 | 100 | 92.0 | 75.0 | 100 | unmaintained (low) |
| encodeurl@2.0.1 | 100 | 100 | 99.0 | 90.0 | 100 | Sin alertas devueltas |
| es-define-property@1.0.1 | 66.0 | 100 | 81.0 | 53.0 | 100 | socketUpgradeAvailable (high) |
| escape-html@1.0.3 | 100 | 100 | 78.0 | 75.0 | 100 | unmaintained (low) |
| etag@1.8.1 | 100 | 100 | 99.0 | 75.0 | 100 | filesystemAccess (low); unmaintained (low) |
| express@5.3.0 | 97.0 | 100 | 100 | 92.0 | 100 | dynamicRequire (low); envVars (low); filesystemAccess (low); networkAccess (middle) ×5 |
| finalhandler@2.1.1 | 99.0 | 100 | 100 | 84.0 | 100 | envVars (low) |
| forwarded@0.2.0 | 100 | 100 | 83.0 | 75.0 | 100 | unmaintained (low) |
| fresh@2.0.0 | 100 | 100 | 99.0 | 83.0 | 100 | Sin alertas devueltas |
| http-errors@2.0.1 | 99.0 | 100 | 100 | 84.0 | 100 | newAuthor (low) |
| iconv-lite@0.7.3 | 100 | 100 | 100 | 93.0 | 100 | urlStrings (low) |
| inherits@2.0.4 | 100 | 100 | 76.0 | 75.0 | 100 | unmaintained (low) |
| ipaddr.js@1.9.1 | 100 | 100 | 100 | 82.0 | 100 | gptAnomaly (low) |
| is-promise@4.0.0 | 100 | 100 | 66.0 | 75.0 | 100 | unmaintained (low) |
| media-typer@1.1.1 | 100 | 100 | 98.0 | 84.0 | 100 | Sin alertas devueltas |
| merge-descriptors@2.0.0 | 100 | 100 | 80.0 | 79.0 | 100 | Sin alertas devueltas |
| mime-db@1.54.0 | 100 | 100 | 100 | 84.0 | 100 | Sin alertas devueltas |
| mime-types@3.0.2 | 100 | 100 | 100 | 85.0 | 100 | Sin alertas devueltas |
| ms@2.1.3 | 100 | 100 | 86.0 | 84.0 | 100 | Sin alertas devueltas |
| negotiator@1.1.0 | 100 | 100 | 100 | 85.0 | 100 | Sin alertas devueltas |
| on-finished@2.4.2 | 100 | 100 | 100 | 86.0 | 100 | debugAccess (low) |
| once@1.4.0 | 100 | 100 | 91.0 | 75.0 | 100 | unmaintained (low) |
| parseurl@1.3.3 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained (low) |
| path-to-regexp@8.4.2 | 100 | 100 | 100 | 91.0 | 100 | urlStrings (low) |
| proxy-addr@2.0.8 | 99.0 | 100 | 100 | 84.0 | 100 | Sin alertas devueltas |
| qs@6.17.1 | 99.0 | 100 | 100 | 97.0 | 100 | Sin alertas devueltas |
| range-parser@1.3.0 | 100 | 100 | 95.0 | 85.0 | 100 | newAuthor (low) |
| raw-body@3.0.2 | 99.0 | 100 | 100 | 86.0 | 100 | debugAccess (low) |
| router@2.2.0 | 99.0 | 100 | 100 | 83.0 | 100 | networkAccess (middle) ×2; newAuthor (low) |
| send@1.2.1 | 99.0 | 100 | 100 | 85.0 | 100 | filesystemAccess (low); gptAnomaly (low) |
| serve-static@2.2.1 | 99.0 | 100 | 99.0 | 84.0 | 100 | Sin alertas devueltas |
| setprototypeof@1.2.0 | 100 | 100 | 73.0 | 75.0 | 100 | unmaintained (low) |
| side-channel@1.1.1 | 66.0 | 100 | 87.0 | 53.0 | 100 | socketUpgradeAvailable (high) |
| statuses@2.0.2 | 100 | 100 | 99.0 | 83.0 | 100 | newAuthor (low) |
| toidentifier@1.0.1 | 100 | 100 | 82.0 | 83.0 | 100 | Sin alertas devueltas |
| type-is@2.1.0 | 99.0 | 100 | 100 | 87.0 | 100 | newAuthor (low) |
| vary@1.1.2 | 100 | 100 | 99.0 | 75.0 | 100 | unmaintained (low) |
| wrappy@1.0.2 | 100 | 100 | 73.0 | 75.0 | 100 | newAuthor (low); unmaintained (low) |
