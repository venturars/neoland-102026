# Tareas — Swagger en Nest

Issue: [#1151](https://github.com/venturars/neoland-102026/issues/1151).
Referencias: [spec.md](spec.md) y [plan.md](plan.md), aprobados.
Estado: aprobadas por Miguel e implementadas el 2026-11-06; pendientes de revisión final.

- [x] T01 · Preparar una copia de comprobación excluyendo los archivos
  SQLite de trabajo y sus archivos auxiliares. Usar una base desechable y
  puertos libres. Registrar el estado inicial de los archivos afectados y
  conservar separados los procesos de la demo.
- [x] T02 · Añadir a `pnpm-workspace.yaml` la regla
  `allowBuilds: { '@scarf/scarf': false }` y comprobar su valor efectivo.
  Instalar `@nestjs/swagger@12.1.0` con pnpm y versión exacta, conservando
  bloqueado su postinstall. Registrar la salida y cotejar las tres capas
  del lockfile con las 21 versiones y relaciones del plan. Si difieren,
  revisar las diferencias con Socket y actualizar la aprobación antes de seguir.
- [x] T03 · Configurar `DocumentBuilder` y `SwaggerModule` en el arranque
  existente, antes de escuchar: título First app, versión 1.0.0 y página
  en `/`. Resultado: Swagger abre en el mismo Nest del puerto 3003.
- [x] T04 · Añadir `ApiBody` y `ApiParam` al controlador existente.
  Crear exige nombre y email; editar los deja opcionales; consultar,
  editar y borrar permiten introducir ID. Conservar servicio inyectado,
  rutas, conversiones, estados y mensajes actuales.
- [x] T05 · Añadir `tests/nest-swagger.test.js`: comprobar HTML y recursos
  de Swagger, las cinco operaciones del documento OpenAPI, cuerpos e IDs,
  campos opcionales al editar y respuesta 204 de borrado. Compilar con
  Babel y ejecutar también las pruebas existentes de Nest en serie.
- [x] T06 · Arrancar el servicio de datos de la copia e inicializar su
  tabla mediante el ejemplo existente `create-users-table.txt`, ejecutado
  desde esa copia. Arrancar su Nest y abrir Swagger UI. Comprobar primero
  que listar devuelve `200` y `[]`. Crear dos contactos; listar y consultar;
  editar solo nombre y solo email; borrar uno y consultar su ID eliminado.
  Verificar estados, cinco campos, orden, valores omitidos, ID y fecha de
  creación, y el otro contacto conservado.
- [x] T07 · Desde la página comprobar nombre vacío, email inválido y
  repetido, y contacto inexistente: mensajes y estados de la spec, con
  datos conservados en los rechazos por validación. Detener solo el servicio
  de datos de la copia y repetir las cinco operaciones con entradas válidas:
  cada una devuelve su mensaje 500 correspondiente.
- [x] T08 · Actualizar README con arranque de datos, inicialización,
  arranque de Nest y dirección de Swagger. Actualizar la responsabilidad
  de Nest en ARCHITECTURE y los documentos/prueba nuevos en TREE.
- [x] T09 · Ejecutar `pnpm format` y después `pnpm lint`. Revisar el diff
  contra spec y plan: integración estándar de Swagger y contratos conservados.
  Registrar comandos, resultados y comprobaciones pendientes en este documento;
  detener los procesos de prueba y eliminar su copia desechable.

## Revisión previa

Las tareas cubren la issue y la spec: cinco operaciones desde la página,
edición parcial, respuestas y errores existentes. La política de Scarf se
comprueba antes de instalar; el cotejo del lockfile precede al código.
La prueba automatizada del documento y la prueba real del navegador tienen
resultados separados. Los resultados se registrarán al ejecutarlos.

## Evidencia · 2026-11-06

- pnpm 12.15.0 instaló Swagger12.1.0 en la copia desechable con
  `--save-exact --ignore-scripts`. Scarf tenía allowBuilds=false;
  ningún script de instalación se ejecutó. El lockfile generado es
  idéntico al de la propuesta aprobada, incluidas las21 versiones revisadas.
- `pnpm format` y `pnpm lint`: código0. Babel compiló33 archivos.
- `node --test --test-concurrency=1 tests/nest-client.test.js tests/nest-swagger.test.js`:
  3 pruebas pasadas,0 fallos. Comprueba CRUD, inyección real, página,
  recursos CSS/JS, documento OpenAPI, cuerpos, IDs y estados.
- Suite completa `node --test --test-concurrency=1 tests/*.test.js`:
  35 pruebas pasadas,0 fallos ni omisiones. La primera ejecución tuvo
  3 fallos EADDRINUSE porque las pruebas antiguas usan3000, ocupado por
  la demo. Se remapearon3000–3002 a25300–25302 solo en la copia y se repitió.
  Los puertos de entrega permanecen3000 y3003.
- Navegador real mediante Playwright, Swagger en24303 y datos en24300:
  lista vacía200/[], crear Ada y Grace201 con cinco campos, listar ordenado,
  consultar200, modificar nombre y email por separado200, rechazos400/409,
  datos conservados tras rechazo, borrado204 vacío, consulta posterior404,
  segundo contacto intacto. Con datos detenidos, las cinco acciones dieron
  500 con sus mensajes existentes. La automatización necesitó corregir
  selectores de Try it out/Reset; no fue un defecto de la aplicación.
- Se detuvieron ambos procesos de prueba. La copia y sus datos se eliminaron.
  Se conservaron fuera del repositorio los metadatos y la resolución de la
  revisión Socket. No se han hecho commits, push, solicitudes de revisión,
  merges ni cierres de issues durante esta implementación.
