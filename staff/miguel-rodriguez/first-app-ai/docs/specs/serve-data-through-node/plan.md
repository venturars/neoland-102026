# Plan · Acceso compartido a datos

Issue: #822 · PR: #823, draft hacia staging.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-11-03.
Estado: aprobado por Miguel el 2026-11-03.

## Recorrido

Cliente → logic → queries → servidor local Node → SQLite.

Esta entrega adapta el acceso a datos y los clientes Terminal/Jupyter.
La interfaz web se conectará en la siguiente entrega.

## Acceso a datos · CA-01,02,06

Sustituir src/db/connection.js por src/db/server.js. Este archivo abre la base
existente src/db/users.sqlite mediante una ruta relativa al módulo.
La inicialización de la tabla permanece explícita.

El servidor escucha en http://127.0.0.1:3000. POST /execute recibe la operación,
el SQL y sus parámetros, ejecuta exec/get/all/run y devuelve el resultado.
Comunica los fallos a queries y permite las peticiones de la futura página local.
Añadir pnpm server para arrancarlo.

## Consultas · CA-02,03,06

Convertir los ocho archivos src/queries/queries/*.sql en módulos .js que exportan
el mismo texto SQL, separado de su ejecución.

En src/queries/users.js, sustituir la lectura de archivos y el acceso directo a
SQLite por imports y fetch nativo. Un helper interno execute concentra el envío,
la comprobación de respuesta y su lectura. Las consultas pasan a ser async,
conservando parámetros y resultados. Las consultas de una fila convierten null
en undefined; las consultas de listas conservan [] cuando no hay coincidencias.

Añadir queries/list-tables.js y listTables() para la consulta de sqlite_master
que utiliza el ejemplo de inicialización.

## Lógica y clientes · CA-03 a CA-07

Declarar async las operaciones afectadas de logic y esperar sus consultas dentro
de los try/catch actuales para conservar el orden de validación y los errores.
En el clasificador, adaptar la espera de la lectura de contactos.

Actualizar los ejemplos Terminal y src/clients/jupyter/run-operation.js para
esperar antes de mostrar resultados. La inicialización utiliza createUsersTable()
y listTables() en lugar de acceder directamente a db.

En client.py, cambiar la comprobación de connection.js por server.js para que
siga reconociendo la app. Revisar los notebooks y ajustar las llamadas o
referencias afectadas.

## Documentación y configuración · CA-08

Actualizar README con el arranque y uso; DATABASE, ARCHITECTURE y TREE con el
nuevo acceso a datos; ERRORS con la traducción de fallos del servicio.
La constitución documentará los resultados asíncronos y la inicialización
mediante queries, conservando las reglas de negocio.

Reconocer fetch y URL en ESLint donde se utilicen. Mantener las dependencias.

## Verificación · CA-01 a CA-08

En una copia desechable, comparar el comportamiento anterior y el nuevo:
operaciones, validaciones, errores y conservación de datos. Usar las herramientas
de prueba integradas de Node; los escenarios se concretarán en las tareas.

Comprobar que Terminal y Jupyter ven los cambios del otro, que los datos
persisten tras reiniciar y que los fallos del servicio se manejan correctamente.
Registrar por separado la prueba del clasificador que requiere su modelo local.

Ejecutar pnpm format y pnpm lint, revisar el diff y retirar procesos y temporales
propios. Registrar los resultados y las comprobaciones pendientes.
