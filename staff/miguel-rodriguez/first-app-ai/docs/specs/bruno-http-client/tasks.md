# Tareas — colección Bruno de Express

Issue: [#1159](https://github.com/venturars/neoland-102026/issues/1159).
Referencias: [spec.md](spec.md) y [plan.md](plan.md), aprobados el 2026-11-06.
Estado: aprobadas por Miguel e implementadas el 2026-11-06; pendientes de revisión final.

- [x] T01 · Preparar una copia desechable excluyendo las bases SQLite y sus
  archivos auxiliares. Registrar el estado inicial del proyecto y de la base de
  trabajo. Elegir puertos libres y mantener separados los procesos de la demo;
  cualquier remapeo se hace solo en la copia y se registra.
- [x] T02 · Instalar en la copia con
  `pnpm add --save-dev --save-exact @usebruno/cli@4.3.0`. Cotejar los nombres,
  versiones y relaciones de las tres capas con las 137 versiones del plan.
  Conservar las versiones directas existentes, Babel y la configuración de
  scripts de instalación. Si cambia la resolución de esas capas, revisar las
  diferencias con Socket y actualizar la aprobación antes de ejecutar Bruno.
  Registrar el aviso del peer opcional y comprobar su efecto en T09.
- [x] T03 · Crear `bruno.json`, `collection.bru` y las dos carpetas del plan
  junto al cliente HTTP. Definir `baseUrl`, nombres y `seq` explícitos. Añadir
  `pnpm bruno` para ejecutar solo `01-sql-online`, con `-r --bail`; dejar el
  comando independiente de `02-sql-offline` también con `-r --bail`.
- [x] T04 · Crear las peticiones online 01–08: lista vacía, crear Ada y Grace,
  listar, consultar Ada, editar solo nombre, editar solo email y guardar la lista
  de referencia. Tomar los IDs de las respuestas y calcular el inexistente como
  el mayor ID más uno. Comprobar estados, exactamente cinco campos en cada
  contacto, valores, orden, fechas como cadenas, ID y `createdAt` conservados,
  campos omitidos y Grace intacta. Guardar copias de las respuestas para las
  comparaciones; no exigir que cambie `updatedAt` entre peticiones rápidas.
- [x] T05 · Crear las peticiones online 09–20: POST y PATCH con nombre `" "`,
  email `"invalid"` y email de Grace. Comprobar cada `400` o `409` y su cuerpo
  exacto. Después de cada rechazo, un GET compara todos los contactos y sus
  timestamps con la lista de referencia.
- [x] T06 · Crear las peticiones online 21–30: consultar, modificar y borrar
  el ID inexistente, con `404` y `User not found`. Cada rechazo tiene su GET
  posterior de conservación completa. Borrar Ada con `204` sin cuerpo, comprobar
  que queda solo Grace intacta, borrar Grace y comprobar `200` con `[]`.
- [x] T07 · Crear las cinco peticiones offline. Usar POST y GET de `/users`,
  y GET, PATCH y DELETE de `/users/999999`, con entradas válidas. Cada petición
  exige `500` y el cuerpo con el mensaje exacto de su operación. El grupo usa
  solo la configuración común y sus propios valores, sin variables del online.
- [x] T08 · Escribir `src/clients/http/bruno.md`: copia desechable, tabla vacía,
  arranque de datos e inicialización, arranque de Express, comando online,
  parada de solo datos y comando offline, resultados y limpieza. Actualizar
  README, TREE y la responsabilidad de Express en ARCHITECTURE con los archivos
  nuevos y el recorrido Bruno → Express → lógica → datos.
- [x] T09 · Arrancar el servicio de datos de la copia, inicializar la tabla
  ejecutando el ejemplo existente `create-users-table.txt` desde ella y arrancar
  Express. Ejecutar `pnpm bruno` dos veces completas. Resultado: 30 peticiones
  por recorrido, todas las aserciones pasan, código de salida 0 y tabla vacía;
  el segundo recorrido funciona con los nuevos IDs.
- [x] T10 · Detener únicamente el servicio de datos y ejecutar el comando
  offline. Resultado: cinco respuestas `500` con sus mensajes, todas las
  aserciones pasan y código de salida 0. Reiniciar datos y comprobar lista vacía.
- [x] T11 · En la copia, cambiar temporalmente la expectativa de estado de la
  primera petición online de `200` a `418`. Ejecutar el mismo comando: debe
  fallar, devolver código distinto de 0 y detenerse antes de crear contactos.
  Comprobar que la lista sigue vacía, restaurar el `.bru` y repetir el recorrido
  online correctamente. La expectativa incorrecta no entra en la entrega.
- [x] T12 · Detener los procesos de Express y datos usados para Bruno y
  comprobar que liberaron sus puertos. Ejecutar `pnpm format`, después
  `pnpm lint` y compilar con
  `pnpm exec babel src --out-dir dist --delete-dir-on-start` antes de ejecutar
  la suite existente con `node --test --test-concurrency=1 tests/*.test.js`.
  La compilación prepara los archivos `dist/` que importan las pruebas de Nest.
  Ejecutar estos comandos en la copia. Registrar
  comandos, códigos de salida y resultados reales, incluidos los remapeos
  necesarios para no interferir con la demo.
- [x] T13 · Revisar el diff contra issue, spec y plan. Incorporar únicamente
  los archivos de entrega verificados y el lockfile generado por pnpm; conservar
  los puertos originales si la copia usó otros. Confirmar que los comandos de la
  guía coinciden con los comprobados y que las dos colecciones están separadas.
  Detener procesos restantes, eliminar la copia y verificar que la base de
  trabajo permanece intacta. Registrar la evidencia en este documento.

## Revisión previa

Las tareas cubren el CRUD y los errores de la spec, la conservación de registros
tras cada rechazo, los dos sentidos de edición parcial y los dos grupos de Bruno.
El cotejo de dependencias precede a ejecutar el CLI. La prueba negativa comprueba
la parada temprana sin dejar datos de prueba ni expectativas incorrectas.
Los procesos de Bruno se detienen antes de la suite existente.

Si aparece un defecto de Express o la incompatibilidad del CLI impide ejecutar la
colección, se informa antes de ampliar el cambio, como establece el plan.

## Evidencia

Resultados del 2026-11-06:

- Copia desechable sin bases SQLite ni sus auxiliares. Los puertos 3000 y 3001
  estaban ocupados por la demo; se usaron 25300 para datos y 25301 para Express,
  y 25302 para las pruebas existentes de Fastify, solo en la copia.
- pnpm 12.15.0 instaló `@usebruno/cli@4.3.0` con
  `pnpm add --save-dev --save-exact @usebruno/cli@4.3.0 --ignore-scripts`.
  No se ejecutaron scripts de instalación. El lockfile coincide exactamente con
  el de la propuesta aprobada: SHA-256
  `47af6952b96c3ab2454e6a0e4cee9d57a12170d88e0404d180dfa53df8796c3c`.
  Las 137 versiones y relaciones revisadas se conservan, al igual que las
  versiones directas anteriores y `pnpm-workspace.yaml`.
- El CLI funciona con el sandbox seguro por defecto y Babel 8 existente.
  Se mantuvo el aviso del peer opcional ya aceptado, sin overrides.
- Se ejecutó el ejemplo `create-users-table.txt` contra la copia: mostró `users`.
  Se comprobó también el comando `sh` que aparece en la guía.
- `pnpm bruno`: 30 peticiones y 30 tests pasados, código 0. Segunda pasada:
  30 peticiones y 30 tests pasados, código 0, con IDs incrementados.
  Incluye los seis rechazos de validación/duplicado y los tres de ID inexistente,
  cada uno seguido de su comparación completa de contactos y timestamps.
- Con solo el servicio de datos detenido,
  `../../../../node_modules/.bin/bru run 02-sql-offline -r --bail`:
  cinco respuestas 500, cinco tests pasados y código 0. Tras reiniciar datos,
  la lista continuó vacía.
- Prueba negativa: expectativa 418 en la primera petición online; código 1,
  un test fallido y las otras 29 peticiones omitidas por `--bail`. La lista
  permaneció vacía. Se restauró 200 y la colección volvió a pasar completa:
  30 peticiones y 30 tests, código 0.
- `pnpm install --frozen-lockfile --ignore-scripts`, como indica la guía:
  código 0, resolución omitida por lockfile actualizado.
- `pnpm format` y después `pnpm lint`: ambos código 0. Babel compiló 33 archivos
  con `pnpm exec babel src --out-dir dist --delete-dir-on-start`.
  `node --test --test-concurrency=1 tests/*.test.js`: 35 pasadas, 0 fallos,
  0 canceladas y 0 omitidas, código 0.
- La entrega mantiene los puertos originales. Incluye solo la colección,
  su guía, la dependencia y el script, los documentos SDD y las actualizaciones
  de README, ARCHITECTURE y TREE. El adaptador Express, la lógica, las consultas,
  el servicio de datos, los tests existentes y la configuración de pnpm quedan
  sin cambios.
- Procesos de prueba detenidos, copia y base desechables eliminadas. El proyecto
  original no tenía archivos SQLite en `src/db/` y sigue sin ellos. No se hicieron commits, push ni cambios en
  GitHub durante esta implementación.
