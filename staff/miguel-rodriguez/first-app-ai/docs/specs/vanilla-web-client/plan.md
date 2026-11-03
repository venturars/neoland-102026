# Plan · Cliente web con datos compartidos

Issue: #760 · PR: #762, hacia staging.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-11-03.
Estado: implementación y publicación autorizadas por Miguel el 2026-11-03.

## Base y recorrido

Incorporar el staging actualizado, incluida #822, a la rama existente de #762.
Conservar sus cambios de servidor, consultas y clientes al resolver los documentos
compartidos. La publicación de la versión terminada precede a nuevas revisiones.

Navegador → logic → queries → servicio local → SQLite.
El navegador importa las operaciones compartidas como módulos JavaScript.

## Abrir la app · CA-01,06,08

Ampliar src/db/server.js para servir la página y los módulos necesarios con GET,
reutilizando el mismo proceso y puerto. GET / redirige a
/clients/web/index.html, manteniendo las rutas relativas de los archivos.

Servir únicamente una lista explícita de archivos de clients/web, las operaciones
utilizadas de logic y los módulos que importan de queries. Enviar el tipo de
contenido correcto para HTML, CSS y JavaScript; devolver 404 para otros archivos,
incluida la base de datos. Mantener POST /execute y su preflight existentes.
La tabla se prepara por separado con el ejemplo Terminal o el primer notebook.

Cambiar index.html a script type="module". Conservar el diseño y las tres
pantallas; retirar los textos de ejemplos y el botón para restablecerlos.

## Conectar las pantallas · CA-01 a CA-04,06,07

En src/clients/web/main.js, importar listUsers, findUserById, updateUser y
deleteUser desde logic. Retirar examples, storageKey, localStorage y la
validación de negocio duplicada, incluido checkValidity(). Mantener novalidate
para que las operaciones compartidas decidan qué entradas son válidas.

- Cargar la lista con await listUsers(). Consultar el ID al seleccionarlo para
  mostrar los datos guardados actuales; representar los datos como texto.
- Al guardar, enviar los campos escritos a updateUser(id, changes) y esperar su
  resultado. Mostrar el contacto devuelto, con su normalización, solo tras éxito.
- Presentar Email is invalid y Email is already used junto al email, con texto
  comprensible, foco y asociación accesible. Name is empty se muestra junto al
  nombre. Conservar los campos cuando falla el guardado.
- Al volver a la selección o pulsar Volver a cargar, consultar otra vez la lista.
  Distinguir una lista vacía de una carga fallida; no sustituir errores por datos.
- Durante una petición, indicar espera y bloquear las acciones incompatibles
  para evitar envíos repetidos o cambiar de contacto a mitad de una escritura.
  Restablecer los controles al terminar y manejar los rechazos en cada acción.

## Confirmar el borrado · CA-05,07

Añadir un bloque de confirmación dentro del editor, con email, Eliminar y
Cancelar, conservando las tres pantallas. Mostrar el email guardado del contacto,
no el campo de edición sin guardar. Comparar la confirmación con ese valor tras
trim y conversión a minúsculas; un vacío o diferencia muestra el error sin borrar.

Después de coincidir, esperar deleteUser(id) y volver a consultar la lista.
Tratar por separado el fallo del borrado y el de la recarga: si el borrado terminó
pero falla la lista, informar que se eliminó y ofrecer recargar la lista, sin
presentarlo como un borrado fallido. User not found permite volver a cargar.

## Guías y comprobaciones · CA-01 a CA-08

Actualizar README, ARCHITECTURE, TREE, la descripción del servicio en DATABASE
y la descripción del cliente en CONSTITUTIONS.
Documentar pnpm server, preparación explícita y la dirección local. Conservar los
comandos y contratos de Terminal/Jupyter, el esquema y las dependencias actuales.
Mantener el formato del cliente y combinar ESLint con la configuración de #822.

Añadir tests/web-client.test.js con las herramientas integradas de Node para los
archivos servidos, tipos de contenido y rutas excluidas. Ambas pruebas usan copias
desechables y el puerto 3000; ejecutarlas en serie:

```sh
node --test --test-concurrency=1 tests/serve-data-through-node.test.js tests/web-client.test.js
```

Probar en navegador selección, navegación, edición, errores de correo/nombre,
confirmación vacía/incorrecta/correcta y cancelaciones. Comprobar la misma
aceptación de correos que en las operaciones compartidas, incluidos casos que
HTML validaría de otra forma. Verificar cambios entre web, Terminal y Jupyter,
fechas conservadas en lecturas, otros contactos intactos y persistencia.
Cubrir lista vacía, contacto eliminado desde otro cliente, servicio detenido y
recarga fallida después de un borrado correcto. Revisar teclado y móvil.

Ejecutar pnpm format y después pnpm lint; formatear también las pruebas con el
Prettier existente. Registrar resultados reales y retirar procesos y temporales.
