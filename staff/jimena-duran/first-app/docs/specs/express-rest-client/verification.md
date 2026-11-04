# Comprobación — cliente REST de usuarios

Issue: #849.

Fecha de cierre local: 4 de noviembre de 2026.

Estado: implementado, instalado y comprobado localmente con HTTP y Bruno.
La entrega se incorpora a la rama existente mediante commit selectivo y push,
con la autorización final de publicación. La PR continúa en draft, sin
revisores ni merge. Se excluyen archivos temporales, dependencias instaladas,
datos y configuración personal.

## Referencia y alcance

Commit fijado: `02c6fa08bef40a0add29e99e8955eee9ce8f1ae5`.
Se revisaron completos código HTTP, manifiesto, lockfile, spec, plan,
tareas, arquitectura y árbol. `src/clients/http/app.js` coincide byte por
byte con el cliente de ese commit, también después de Prettier.

Se añaden el cliente HTTP, Express 5.3.0, el script http y su glob de
formato; se actualizan lockfile, arquitectura y árbol. Esta carpeta contiene
spec, plan, tareas, guía y colección Bruno. No cambian las reglas de negocio,
queries, servidor SQL ni clientes existentes.

## Socket y aceptación explícita

La evidencia conservada cubre 54 pares nombre/versión: Express, 28 paquetes
de primera capa, 18 de segunda y 7 de tercera. No hay respuestas incompletas
ni puntuaciones inferiores a 50. Se conservan las 54 alertas obtenidas:
3 altas, 8 medias y 43 bajas. El resumen por versión está en el plan.

El 4 de noviembre de 2026 se aceptaron explícitamente, para esta entrega
local, el riesgo residual reportado y las campañas no verificadas por
HTTP 403 threat_feed_not_entitled. La aceptación no deriva de action ignore.
No se repitieron consultas Socket satisfactorias ni se sustituyeron paquetes.
El límite de campañas sigue existiendo: no se afirma ausencia de campañas
ni una garantía de seguridad.

## Instalación

Ejecutado desde first-app: pnpm install --frozen-lockfile --ignore-scripts,
mediante Corepack instalado, pnpm 12.14.0. Terminó con código 0.
No se ejecutaron scripts de instalación.

Express quedó en 5.3.0. Las 54 versiones instaladas hasta tres capas
coinciden con las revisadas; se verificaron también sus profundidades.
No cambió el lockfile durante la instalación. SHA-256:
`690bede1524dac4e161115182db0585acec6b2b8f65e15c0acf62745f8bef6be`.
Los paquetes y snapshots anteriores permanecen intactos; las entradas
añadidas proceden del lockfile fijado.

## HTTP real, ejecutado con Node fetch

31 peticiones y 39 comprobaciones pasadas contra Express real en 3001.
Se comprobaron las cinco operaciones, estados 201/200/204, JSON con id,
nombre, email y fechas, 204 y ruta 404 con cuerpos vacíos, await y contratos.

Se comprobó modificar nombre, email, ambos y campos omitidos; conservar id,
fecha de creación y los campos no enviados; preservar el otro usuario y
no mutar datos ante errores. Se verificaron 400 Name is empty, 400 Email
is invalid, 409 Email is already used y 404 User not found donde corresponde,
500 al crear sin nombre y los cinco Could not ... con SQL detenido.

Esta ejecución es HTTP con Node, no se presenta como prueba de Bruno.

## Bruno real dentro de VS Code

Ejecutada la extensión Bruno 6.0.0 instalada en VS Code, con un perfil
temporal aislado, sin cambiar el perfil habitual ni instalar Bruno CLI.
El runner real de colección envió las peticiones y ejecutó sus tests:

- 25 peticiones online: 25 pasadas, 0 fallidas, 0 omitidas.
- 5 peticiones offline: 5 pasadas, 0 fallidas, 0 omitidas.

La carpeta online cubre éxitos, errores, campos omitidos, conservación del
otro usuario y limpieza de los dos usuarios ficticios. La offline comprueba
los cinco estados 500 con su mensaje exacto tras detener solo el SQL de ensayo.

Se usó Run Collection desde el árbol Bruno Collections y Configure requests
to run para separar ambas carpetas. El acceso desde el explorador abrió
Folder Runner pero devolvió Folder not found antes de enviar peticiones;
se evitó usando el runner de colección, sin modificar la extensión.

## Aislamiento y comprobaciones finales

El puerto 3000 ya estaba ocupado y se conservó su proceso. Solo las copias
temporales de servidor SQL y queries usaron 43100. El SQL y queries del
proyecto conservan 3000; el cliente HTTP probado conserva 3001. Se usó
únicamente SQLite ficticio en la copia de ensayo, sin copiar datos personales.
Solo se crearon Ada, Grace y direcciones example.com.

El hash de SQLite personal se conserva. Los servidores de ensayo se cerraron
al terminar. No se repitieron las baterías de componentes intactos; las 30
comprobaciones de lógica previas siguen siendo evidencia separada.

Sintaxis con node --check, 17 comprobaciones estáticas, formato, lint,
parseo de colección y peticiones con el parser Bruno instalado, y diff:
correctos. Formato y lint se ejecutaron con verifyDepsBeforeRun=false para
evitar instalaciones implícitas, sin modificar configuración persistente.

## Defectos y pendientes

No se detectaron defectos propios del cliente REST ni defectos nuevos
confirmados de comportamiento de la referencia en los casos comprobados.
No fue necesario cambiar su código. El error Folder not found corresponde
al acceso del runner en la herramienta, no al servidor REST, y se documenta
arriba con la ruta que permitió completar el ensayo.

No quedan pruebas HTTP o Bruno pendientes del alcance acordado. Permanece
el límite aceptado de campañas no verificadas. La publicación selectiva
no solicita revisión ni merge.

Pasos Windows para repetir: [bruno.md](bruno.md).

## Evidencia local

En .tmp/rest-client-849/, dentro de la raíz Git:

- install-results.json: versiones instaladas y hash del lockfile.
- http-results.json: 31 respuestas y 39 comprobaciones HTTP.
- bruno-online-results.txt y bruno-offline-results.txt: texto del runner.
- bruno-online.png y bruno-offline.png: capturas del runner dentro de VS Code.
- bruno-results.json: resumen de las 30 peticiones ejecutadas por Bruno.
- static-results.json y logic-results.json: comprobaciones separadas.
- socket-packages.json y socket-purl.ndjson: evidencia conservada, sin tokens.
- prepare-bruno-fixture.cjs, services.cjs y verify-http.mjs: ensayo reproducible.
