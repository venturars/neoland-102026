# first-app

Las guías están en [ARCHITECTURE.md](ARCHITECTURE.md), [TREE.md](TREE.md), [DATABASE.md](DATABASE.md), [ERRORS.md](ERRORS.md) y [STYLE.md](STYLE.md).

## Desarrollos

Un desarrollo nuevo no empieza en el código. El pedido entra primero por `agents/git-workflow-agent.md`. Si la tarea ya está en curso, el pedido sigue en su momento o en su fase. Se piensa la tarea solo si es nueva. Una pregunta sobre el proyecto, o un mensaje que no cambie el proyecto, no abre ese flujo.

Se escribe en `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. El desarrollo abierto es `docs/specs/chrome-extension-client/`.

Pedir el cambio no abre el código y no escribe `spec.md` como primera respuesta. Con la rama ya abierta, `spec.md` se escribe y una persona lo lee, antes de pedir revisión. Después `plan.md` y lo lee. Después `tasks.md` y lo lee. El código, `package.json` y el resto de ficheros de la app se tocan cuando esa persona pide ejecutar las tareas.

`spec.md` es el negocio: qué se pide, qué entra, qué sale y qué fallo se ve. No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica: qué ficheros se crean o se tocan, la firma, el SQL y cómo encaja en esta app.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas.

Es un SDD de iniciación. Una persona lee cada fichero antes del siguiente. No hay un bucle que los reescriba. El código empieza cuando esa persona pide ejecutar las tareas: se siguen y no se inventan pasos.

Si la constitución, el código y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay tareas.

## Paquetes

Un paquete de Node nuevo, o un cambio de su versión, se comprueba con Socket antes de aceptar el plan. El cómo está en `AGENTS.MD`.

## Pasos de funcionamiento

Crear, actualizar, eliminar, listar y buscar siguen el mismo camino.

1. Se pide una operación con los datos del usuario, llamando a la lógica, desde el cliente de terminal, desde Jupyter, desde las pantallas del navegador, desde la ventana Electron, desde el popup de Chrome o desde Postman. Las pantallas piden listar, modificar y eliminar. La ventana Electron y el popup de Chrome piden listar, crear, modificar y eliminar. Postman pide crear, actualizar, eliminar, listar y buscar. El cliente HTTP es `src/clients/http/app.js`, usa Express `5.3.0`, se arranca con `pnpm http` y responde en `127.0.0.1:3001`. La ventana es `src/clients/electron`, usa Electron `45.2.3` y se arranca con `pnpm electron`. El popup es `src/clients/chrome`, el manifiesto es `src/clients/chrome/manifest.json`, su programa usa Fastify `5.12.8`, escucha en `127.0.0.1:3002` y se arranca con `pnpm chrome`.
2. La lógica valida esos datos cuando la operación los lleva. Listar no lleva datos. Si no valen, lanza un `Error` y termina.
3. Las consultas crean la tabla si no existe y piden la ejecución a un programa local en `127.0.0.1:3000`. Ese programa solo ejecuta consultas. Se arranca con `pnpm server`. Las pantallas se abren con `pnpm browser`. La ventana se abre con `pnpm electron`. El programa del popup se arranca con `pnpm chrome`.
4. La base de datos guarda el cambio, lo rechaza si el email ya existe o el usuario no está, o devuelve las filas.
