# Plan — cliente HTTP de Node con Jupyter

Issue: [#1167](https://github.com/venturars/neoland-102026/issues/1167).  
Spec: [spec.md](spec.md).  
Estado: aprobado por Miguel.

## API

Crear `src/clients/node-http/app.js` con `node:http` y escuchar en
`127.0.0.1:3004`. Añadir `pnpm node-http` para arrancar el cliente. El servicio
de datos sigue en el puerto 3000 y se arranca con `pnpm server`.

El cliente espera las funciones existentes de `src/logic/`. Convierte el ID de
la ruta a número antes de llamar a la lógica, cuyo contrato requiere IDs numéricos.
Para editar construye `changes` con los campos suministrados, incluido el caso
vacío. La lógica sigue a cargo de validaciones y acceso a datos.

| Petición | Función | Respuesta correcta |
| --- | --- | --- |
| `POST /users` | `createUser({ name, email })` | `201`, contacto |
| `GET /users` | `listUsers()` | `200`, lista |
| `GET /users/:id` | `findUserById(id)` | `200`, contacto |
| `PATCH /users/:id` | `updateUser(id, changes)` | `200`, contacto |
| `DELETE /users/:id` | `deleteUser(id)` | `204`, sin cuerpo |

Asignar los estados y mensajes de error de la spec a cada operación. JSON mal
formado en POST o PATCH responde `500` con el mensaje de fallo de la operación.
Una ruta no reconocida devuelve `404` sin cuerpo; un error inesperado devuelve
`500` con el mensaje de fallo de la operación correspondiente.

## Notebooks

Añadir cinco notebooks en `src/clients/node-http/jupyter/`, uno por operación.
Sus explicaciones estarán en español y sus peticiones irán por HTTP a la nueva
API. Como el kernel existente es Python, cada notebook lanza Node como
subproceso, siguiendo el patrón del cliente Jupyter actual. Node hace la petición
con `fetch` y presenta el resultado con `cli-table3`, ya instalado en el proyecto.
El subproceso trabaja desde la carpeta de la app para resolver sus dependencias;
los valores de entrada se pasan como datos, sin interpolarlos como código.
Los resultados con contactos incluyen los cinco campos; la lista vacía y el
borrado tienen una indicación clara. Los errores muestran el mensaje recibido
o el estado si no hay mensaje, sin mostrar tabla de datos.

Adaptar `scripts/jupyter.js` para seleccionar explícitamente la carpeta de estos
notebooks y añadir `pnpm jupyter-node-http`. La ejecución sin esa selección
mantiene la carpeta actual de `pnpm jupyter`, así como su preparación del entorno
local y su kernel. No se introducen dependencias ni cambios en el lockfile.

## Archivos y documentación

Actualizar `package.json` con los dos comandos y añadir el nuevo JavaScript al
comando de formato. Actualizar `README.md`, `docs/TREE.md` y
`docs/ARCHITECTURE.md` con los archivos, responsabilidades y arranque. No se
crea una operación de negocio, por lo que no se necesita un cliente de terminal
nuevo. Las reglas y errores de las operaciones permanecen en sus guías actuales.

## Comprobación

En una copia desechable, inicializar la tabla, arrancar ambos servicios y ejecutar
los notebooks. Comprobar las cinco operaciones y sus estados, orden y campos;
los cambios parciales y `{}`; errores de validación, duplicado, ID inexistente y
JSON mal formado en POST y PATCH. Comprobar que los rechazos por validación,
ID inexistente o JSON mal formado no cambian datos ni fechas.

Detener el servicio de datos y verificar los cinco mensajes de fallo desde los
notebooks con la API todavía abierta. Comprobar también ambos comandos de Jupyter,
una respuesta sin cuerpo y una respuesta de error sin mensaje. Ejecutar las
verificaciones pertinentes y `pnpm format` y `pnpm lint`; retirar procesos y copia
al terminar. Registrar los resultados reales en las tareas.
