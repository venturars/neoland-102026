# Tareas — cliente REST de usuarios

Issue: #909 · PR: #912.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md), incluida la
aceptación de los hallazgos y límites de Socket el 2026-11-04.
Estado: aprobadas por Miguel el 2026-11-04.

- [x] **T01 · Confirmar el punto de partida.** Leer estado de rama y PR, issue,
  documentos aprobados y contratos actuales. Localizar Postman y comprobar que
  los puertos 3000 y 3001 pueden usarse sin detener procesos ajenos. Resultado:
  entorno identificado y bloqueos comunicados antes de afectar trabajo existente.
- [x] **T02 · Incorporar Express.** Ejecutar pnpm add --save-exact express@5.3.0.
  Cotejar las tres capas del lockfile con las 47 versiones propuestas en el plan,
  incluyendo dependencias opcionales y peer resueltas. Si hay diferencias,
  revisarlas con Socket, actualizar el plan y esperar su aprobación antes de
  continuar. Resultado: resolución real revisada y package.json/lockfile coherentes.
- [x] **T03 · Crear el adaptador HTTP.** En src/clients/http/app.js, añadir lectura
  JSON y las cinco rutas del plan. Llamar con await a las operaciones existentes,
  convertir el ID de ruta a número y conservar campos omitidos en PATCH.
  Resultado: POST 201; GET y PATCH 200 con datos JSON; DELETE 204 vacío.
- [x] **T04 · Mapear errores y arranque.** Devolver los mensajes exactos mediante
  { message }: 400 para nombre/email inválidos, 409 para email ocupado, 404 para
  usuario inexistente y 500 para fallos de la operación. Los errores inesperados
  del manejador usan su mensaje genérico de operación. Ruta desconocida: 404
  vacío; JSON mal formado: 400 vacío. Escuchar solo en 127.0.0.1:3001, mostrar la
  dirección y comunicar fallo de escucha. Resultado: reglas en lógica y SQL en
  el servicio existente, con respuestas HTTP según el plan.
- [x] **T05 · Integrar comandos y documentación.** Añadir pnpm http y la cobertura
  del adaptador en format. Actualizar README, arquitectura, árbol y constitución
  según el plan. Resultado: arranque y recorrido Postman reproducibles, inventario
  completo y contratos actuales conservados.
- [x] **T06 · Probar éxitos en Postman.** Preparar una copia sin base ni artefactos
  locales, instalar desde el lockfile revisado, inicializar tabla y arrancar ambos
  servicios desde esa copia. Probar lista vacía, creación, lista ordenada,
  consulta por ID, modificación de nombre, email y ambos, y eliminación.
  Comprobar los cinco campos exactos, campos omitidos, persistencia y un segundo
  contacto intacto. Verificar el cambio desde un cliente existente. Resultado:
  métodos, URL, estados, cuerpos y observaciones registrados aquí desde Postman.
- [x] **T07 · Probar fallos en Postman.** Probar nombre vacío, email inválido,
  email duplicado, ID numérico inexistente y prioridad de usuario inexistente
  frente a campos inválidos al modificar. Comprobar ruta desconocida y JSON mal
  formado. Detener el servicio de datos propio y comprobar las cinco respuestas
  500 con entradas válidas; reiniciarlo y verificar recuperación. Comprobar que
  los rechazos no cambian registros. Resultado: estados y mensajes del plan
  acreditados. Una prueba por curl no sustituye el recorrido de Postman.
- [x] **T08 · Revisar y limpiar.** Detener los dos servicios propios del recorrido
  manual y comprobar que el puerto 3000 está libre antes de ejecutar los tests,
  que arrancan su propio servidor. Ejecutar pnpm format, pnpm lint y los tests
  existentes, en serie: node --test --test-concurrency=1
  tests/serve-data-through-node.test.js tests/web-client.test.js. Revisar el diff
  completo contra issue, spec y plan; comprobar que datos y operaciones originales
  se conservan. Retirar la copia desechable y comprobar que no quedan procesos
  propios de prueba. Resultado: comandos, resultados y revisión final registrados,
  sin artefactos.
- [ ] **T09 · Publicar la entrega.** Tras la revisión final, crear commits pequeños
  y hacer push mediante el flujo delegado. Actualizar #912 con cambios y evidencia
  reales, verificar base staging y enlace con #909 en cuerpo y Development.
  Pedir revisión después del último push cuando Miguel nombre revisores.
  Resultado: entrega publicada y comprobada por lectura remota.

## Evidencia · 2026-11-04

T01: rama 909-feat-add-rest-user-client, apertura abb33b75; únicamente documentos
SDD locales al empezar. Puertos 3000 y 3001 libres. No se encontró Postman en
/Applications, ~/Applications, Spotlight ni CLI al empezar. Se instaló después
Postman 12.34.0 con brew install --cask postman para resolver ese bloqueo. La
comprobación HTTP inicial siguiente no acredita por sí sola uso de Postman.

T02: pnpm add --save-exact express@5.3.0 terminó con código 0. Se recorrieron
los manifiestos instalados de Express y dos niveles de dependencias, resolviendo
las rutas reales de los paquetes. Las 47 versiones coinciden con la propuesta de
Socket; ninguna añadida ni ausente. pnpm generó el lockfile.

T03–T05: adaptador HTTP, comando y documentación implementados. La lógica,
queries, servicio de datos y clientes anteriores permanecen sin cambios.

Comprobación complementaria: 22 peticiones HTTP reales mediante urllib en una
copia desechable. Pasaron lista vacía, creación normalizada y cinco campos,
consulta por ID, PATCH de nombre/email/ambos, conflicto, nombre vacío, email
inválido, prioridad del ID inexistente, ruta desconocida, JSON mal formado,
borrado 204, conservación del segundo contacto, cinco errores 500 con el servicio
de datos detenido y recuperación al reiniciarlo. Una llamada Node a listUsers
confirmó los mismos datos. Procesos propios detenidos y copia retirada.

pnpm format y pnpm lint: código 0. El primer lint señaló una variable catch sin
uso; se corrigió y repitieron ambos comandos. Tests existentes ejecutados en
serie con node --test --test-concurrency=1 tests/serve-data-through-node.test.js
tests/web-client.test.js: 2 pruebas correctas, 0 fallos.

### Recorrido con Postman

Se ejecutó el CLI oficial incluido en Postman.app sobre tres colecciones locales,
con --no-report-events, contra otra copia desechable. Se utilizó su runtime
Electron (POSTMAN_CLI_ELECTRON apuntando al ejecutable de Postman.app).
La primera ejecución con --output pidió login para exportar informes; se retiró
esa opción y se conservaron las salidas locales. No se inició sesión ni se
publicaron informes en Postman cloud. No se atribuye un recorrido de clics en GUI.

- up: 23 peticiones, 49 assertions, 0 fallos, salida 0.
- down: 5 peticiones, 10 assertions, 0 fallos, salida 0.
- recovery: 1 petición, 2 assertions, 0 fallos, salida 0.

POST /users: 201, Ada normalizada con los cinco campos. GET /users: 200, primero
[] y después IDs [1, 2]. GET /users/1: 200 con el usuario. PATCH /users/1:
200 al cambiar nombre, email y ambos; campos omitidos conservados. DELETE
/users/1: 204 vacío. Consulta posterior: 404, {"message":"User not found"}.
El segundo contacto se comparó con su objeto original completo y quedó intacto.

POST y PATCH con nombre vacío: 400, {"message":"Name is empty"}. Email inválido:
400, {"message":"Email is invalid"}. Email duplicado: 409,
{"message":"Email is already used"}. GET/PATCH/DELETE con ID 999999: 404,
{"message":"User not found"}; PATCH recibió además nombre vacío para comprobar
la prioridad. GET /unknown: 404 vacío. POST /users con {bad: 400 vacío.

Con los datos detenidos, POST/GET-lista/GET-ID/PATCH/DELETE devolvieron 500 con,
respectivamente, Could not create the user, Could not list the users, Could not
find the user, Could not update the user y Could not delete the user en message.
Al reiniciar, GET /users devolvió 200 con Grace persistida. La consulta Node
listUsers confirmó los mismos datos. Procesos detenidos y copia eliminada.

Los logs y las tres colecciones locales de prueba se guardaron fuera del repo.
Formato, lint y los dos tests existentes se repitieron tras Postman: correctos.
Revisión final: adaptador y documentación dentro del alcance, sin cambios en
lógica, queries, servidor SQL, clientes anteriores ni instrucciones personales.
Postman se repitió tras el ajuste de nombres de variables: las tres fases
terminaron con código 0. Puerto 3001 ocupado: el cliente terminó con código 1
y comunicó EADDRINUSE. T09 pendiente de publicación; sin revisores solicitados.


### Integración previa a revisión

Se integró origin/staging en 39d73763 antes de pedir revisores. Los conflictos en
package.json y TREE.md se resolvieron conservando REST y el cliente VS Code de
#906. Los archivos de src/clients/vscode coinciden con staging. Formato, lint,
los dos tests en serie y las tres colecciones Postman se repitieron correctamente
sobre el árbol integrado. La base de #912 sigue siendo staging.
