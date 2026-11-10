# Tareas — cliente HTTP de Node con Jupyter

Issue: [#1167](https://github.com/venturars/neoland-102026/issues/1167).  
[Spec](spec.md) y [plan](plan.md) aprobados.  
Estado: aprobadas por Miguel; implementación y comprobaciones realizadas.

- [x] Crear la API `node:http` en `src/clients/node-http/app.js`, con las cinco
  rutas del plan, IDs numéricos y llamadas a la lógica compartida. Mapear las
  respuestas y errores de la spec, incluido el `500` por JSON mal formado.
- [x] Añadir los cinco notebooks en `src/clients/node-http/jupyter/`. Ejecutar
  Node desde el kernel Python, pasar entradas como datos y presentar por HTTP los
  contactos, resultados vacíos y errores según el plan.
- [x] Adaptar `scripts/jupyter.js` y añadir los comandos de arranque en
  `package.json`, manteniendo el funcionamiento de `pnpm jupyter`. Incluir el
  nuevo cliente en el comando de formato.
- [x] Actualizar `README.md`, `docs/TREE.md` y `docs/ARCHITECTURE.md` para
  reflejar los archivos, las responsabilidades y cómo iniciar los servicios.
- [x] En una copia desechable con la tabla inicializada, probar las cinco
  operaciones desde las celdas de los notebooks: cinco campos, orden, lista vacía,
  edición de cada campo por separado y `{}`, conservación del ID y la fecha
  de creación al editar, y borrado sin cuerpo que deja intacto el otro contacto.
  Confirmar que listar y consultar conservan todos los registros y fechas.
  Comprobar los estados HTTP mediante peticiones directas a la API.
- [x] Comprobar nombre vacío, email inválido o duplicado, ID inexistente y JSON
  mal formado en POST y PATCH. Verificar que esos rechazos conservan registros
  y fechas. Comprobar una respuesta HTTP de error sin mensaje.
- [x] Con la API abierta y el servicio de datos detenido, comprobar desde los
  notebooks los cinco errores de datos. Verificar que ambos comandos de Jupyter
  abren las carpetas correspondientes.
- [x] Ejecutar `pnpm format` sobre los archivos de la entrega y revisar sus
  cambios. Ejecutar las pruebas pertinentes y `pnpm lint` en una copia
  desechable de esa entrega formateada; registrar comandos y resultados.
  Detener los procesos y eliminar la copia sin tocar los datos de trabajo.

## Resultados

En una copia desechable se ejecutaron las cinco celdas de los notebooks; las
comprobaciones de estados HTTP, edición parcial y conservación de datos se
hicieron con peticiones directas. Se verificaron los rechazos y los cinco
errores con el servicio de datos detenido y una respuesta sin mensaje. El
puerto de datos de la copia fue 13000 porque el 3000 ya estaba ocupado.

`pnpm jupyter` y `pnpm jupyter-node-http` abrieron sus respectivas carpetas.
Se ejecutó además el notebook de listado con el kernel real y se comprobó la
presentación de un error sin mensaje. `pnpm format` y `pnpm lint` pasaron en
la copia con las dependencias del lockfile; los archivos JavaScript formateados
coinciden con la entrega. Las celdas restantes se ejecutaron con Python desde
la carpeta de notebooks. Se detuvieron los procesos y se retiró la copia.

Tras la revisión se corrigió la lectura de UTF-8, se hicieron explícitas las
respuestas del servidor y se integraron los archivos nuevos en el árbol. En
otra copia se repitieron CRUD, validaciones y fallos con la base parada,
incluyendo una petición que divide los bytes de `ñ` entre fragmentos: correcto.
`pnpm format` y `pnpm lint` volvieron a pasar sobre el código corregido.

Después de aclarar la evidencia y ajustar el presentador, se probaron sus cinco
salidas con un servidor local simulado: contacto en tabla, lista vacía,
respuesta 204, error con mensaje y error sin mensaje. Todas fueron correctas.
En una copia con el lockfile instalado volvieron a pasar `pnpm format` y
`pnpm lint`; los archivos del cliente formateados coinciden con la entrega.
