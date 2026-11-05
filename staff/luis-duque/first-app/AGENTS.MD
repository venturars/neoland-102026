# Instrucciones del agente

El flujo de trabajo de git de esta app es `agents/git-workflow-agent.md`, entero: pensar una tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión. Un pedido que cambie algo en este proyecto entra primero por ese flujo. Si ya nombra el momento, se usa ese. Si la tarea ya está en curso, el pedido sigue en su momento o en su fase. Se piensa la tarea solo si es nueva. Una pregunta sobre el proyecto, o un mensaje que no provoque un cambio, se responde y no abre el flujo. Ese flujo no quita las paradas de «Desarrollos». Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. La spec no espera a pedir revisión.

Trabajas en `staff/luis-duque/first-app`. Estas instrucciones son para ti. Léelas antes de cambiar código y síguelas. Escríbelas para que otro agente las entienda sin conocer el historial del chat. No escribas nombres de personas.

El proyecto gestiona usuarios: crear, actualizar, eliminar, listar, buscar por `id`, por email o por nombre, y contar el género de los nombres ya guardados. No hagas otra operación salvo que te la pidan.

Si el código y este archivo no coinciden, no cambies el estilo por tu cuenta. Pregunta a quien te encargó el cambio.

## Desarrollos

Un cambio nuevo es un desarrollo: una función, una dependencia, la configuración o la documentación de la app. Se escribe en `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. El detalle está en `docs/CONSTITUTIONS.MD`, sección «Desarrollos». Pedir el cambio no escribe `spec.md` como primera respuesta.

«Hazlo», «estandariza», «implementa» o «cámbialo» no abren el código. Una skill, una issue o un «no uses la skill» tampoco. Hasta que pidan ejecutar las tareas no toques código, `package.json`, `pnpm-lock.yaml`, `src/logic`, `src/queries`, `src/db` ni `src/clients`.

Con la rama ya abierta, `spec.md` se escribe y se para, antes de pedir revisión. Una persona lo lee. Luego `plan.md` y para. Si la constitución, el código y la spec dicen lo mismo, escribe `tasks.md` y para. Si no, la pregunta queda al final del plan y no hay tareas. En este proceso no toques ningún otro fichero.

El código empieza solo cuando los tres ficheros ya están escritos y esa persona pide ejecutar `tasks.md`. Ejecuta `tasks.md`. No inventes pasos. No vuelvas a escribir la spec, el plan ni las tareas en bucle.

Una operación que ya está en el código no se sustituye. La nueva es un fichero nuevo.

## Diseño web

`skills/frontend-design/SKILL.md` se tiene en cuenta solo cuando el trabajo es un diseño web. Si un desarrollo dice otra cosa, manda el desarrollo. No la uses en la terminal, en Jupyter, en la lógica, en las consultas ni en la base.

## Alcance

La pantalla es el cliente de `src/clients/browser`. El cliente HTTP es `src/clients/http/app.js`, con Express `5.3.0`: es la excepción ya aceptada a no añadir otro framework. La ventana Electron es `src/clients/electron`, con Electron `45.2.3`: es la otra excepción ya aceptada. El popup de Chrome es `src/clients/chrome`, con el manifiesto en `src/clients/chrome/manifest.json` y Fastify `5.12.8`: es la otra excepción ya aceptada. La vista de Visual Studio Code es `src/clients/vscode`, con el manifiesto en `src/clients/vscode/package.json`. `vscode` lo aporta el editor. `engines.vscode` queda en `^1.100.0`. El cliente NestJS es `src/clients/nest`, con NestJS `12.3.3`: es la otra excepción ya aceptada. El servidor es `src/db/server.js` y solo ejecuta consultas. No añadas otro framework. No añadas otro cliente salvo que te lo pidan.

No crees un `README`. La explicación para personas está en `docs/`.

No crees clases de error. Usa `Error`.

No crees consultas ni funciones que no te hayan pedido. Las operaciones que ya están en el código son crear, actualizar, eliminar, listar todos, buscar por `id`, buscar por email, buscar por nombre y contar el género con `usersGender`. Otra operación solo se añade con su desarrollo en `docs/specs/` y cuando una persona pide ejecutar las tareas.

No uses `try/catch` en `src/queries/users.js`. Si SQLite rechaza un email repetido, deja salir ese error.

`src/logic` llama a `src/queries`. `src/queries` pide la ejecución a `src/db/server.js`. Ese servidor abre la base.

## Dónde va cada cosa

Pon el servidor en `src/db/server.js`, junto a `users.sqlite`. No exporta la conexión. Pon el esquema en `src/queries/queries/create-table-users.js`.

Pon la validación y las operaciones en `src/logic`: `shared.js`, `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js`, `find-user-by-name.js` y `users-gender.js`. `shared.js` va dentro de `src/logic`, no en la raíz.

Pon el cliente de Jupyter en `src/clients/jupyter`: un `.ipynb` por acción, con el mismo nombre que el txt. El bloque importa la función de `src/logic` y muestra una tabla de `cli-table3` con el encabezado `["cyan", "bold"]`. No valida, no escribe SQL y no abre la base. El script `jupyter` está en `package.json`. Se arranca con `pnpm jupyter` desde `first-app`, que llama a `scripts/jupyter.sh`. Crea el `.venv` de la app si falta, instala `notebook` `7.6.3` si falta el ejecutable y abre `src/clients/jupyter` en `127.0.0.1`. En Windows usa `Scripts` y `py -3`. En Mac y Linux usa `bin` y `python3`. No usa el Jupyter del equipo. En Windows la salida de Node se lee en UTF-8. Con `pnpm server` en marcha, listar, modificar y eliminar siguen igual.

Pon el cliente del navegador en `src/clients/browser`: `index.html`, `app.js` y `styles.css`. `app.js` importa solo `listUsers`, `updateUser` y `deleteUser`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm browser` desde `first-app`, en Windows. El programa local se arranca con `pnpm server` y escucha en `127.0.0.1:3000`.

Pon el cliente HTTP en un solo fichero, `src/clients/http/app.js`. Ese fichero importa `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No importa `usersGender`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. `GET /users/email/:email` y `GET /users/name/:name` van antes de `GET /users/:id`. Se arranca con `pnpm http` desde `first-app` y escucha en `127.0.0.1:3001`. Express queda en `5.3.0`.

Pon el cliente Electron en `src/clients/electron`: `main.js`, `index.html`, `app.js` y `styles.css`. `app.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm electron` desde `first-app`. Electron queda en `45.2.3`.

Pon el popup de Chrome en `src/clients/chrome`: `manifest.json`, `index.html`, `app.js`, `styles.css` y `server.js`. `server.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Escucha en `127.0.0.1:3002` y se arranca con `pnpm chrome` desde `first-app`. `app.js` pide esas cuatro operaciones a ese origen. Fastify queda en `5.12.8`.

Pon la vista de Visual Studio Code en `src/clients/vscode`: `package.json`, `extension.js`, `index.html`, `app.js`, `styles.css` e `icon.svg`. `extension.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm vscode` desde `first-app`. `app.js` pide esas cuatro operaciones al proceso del editor y no importa la lógica. `vscode` lo aporta el editor. `engines.vscode` queda en `^1.100.0`.

Pon el cliente NestJS en `src/clients/nest`: `main.js`, `app.module.js`, `users.controller.js`, `users.service.js` y `http-exception.filter.js`. `users.service.js` importa `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No importa `usersGender`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm nest` desde `first-app`. El script `nest` de `package.json` borra `dist`, compila `src` a `dist` con Babel (`--delete-dir-on-start`) y ejecuta `dist/clients/nest/main.js`. Escucha en `127.0.0.1:3003`. NestJS queda en `12.3.3`. No crees `scripts/run-nest.js`. Node no ejecuta los decoradores de Nest en origen.

Pon la entrada por terminal en `src/clients/terminal`: `create-user.txt`, `update-user.txt`, `delete-user.txt`, `list-users.txt`, `find-user-by-id.txt`, `find-user-by-email.txt`, `find-user-by-name.txt` y `users-gender.txt`. Cada archivo contiene una sola línea, y esa línea es el comando de cmd. El comando llama a la función de `src/logic` de su acción con `node --input-type=module -e` y el `import` `./staff/luis-duque/first-app/src/logic/...`. No valida, no escribe SQL y no abre la base. Tira esa línea desde cmd, en la raíz del repositorio, porque Node resuelve el `import` desde la carpeta de trabajo. No uses PowerShell y no pases el archivo por la entrada estándar. `create-user.txt` lleva el nombre y el email al final del comando. `update-user.txt` lleva el id y después `name=...`, `email=...` o los dos. `delete-user.txt` lleva el id. `list-users.txt` no lleva argumentos. `find-user-by-id.txt` lleva el id. `find-user-by-email.txt` lleva el email. `find-user-by-name.txt` lleva el nombre: importa `findUserByName` y hace `console.log` del resultado. `users-gender.txt` no lleva argumentos: importa `usersGender` y hace `console.log` del recuento.

Pon la petición de todo el SQL en `src/queries/users.js`. Ese fichero pide `POST /execute` a `http://127.0.0.1:3000` y espera. No abre la base y no usa `try/catch`. Pon el texto de cada consulta en `src/queries/queries`, en `create-table-users.js`, `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js` y `find-user-by-name.js`. `src/db/server.js` es el único que abre `users.sqlite` y ejecuta SQL.

Pon la explicación general del proyecto en `docs/ARCHITECTURE.md`. El árbol está en `docs/TREE.md`. La base y las consultas están en `docs/DATABASE.md`. Los fallos están en `docs/ERRORS.md`.

## Estilo

Los nombres y cómo se escribe el código están en `docs/STYLE.md`.

## Datos

Un usuario tiene `id`, `name` y `email`.

Haz que `validateNombre` exija un texto, le quite los espacios de los extremos y rechace más de 100 caracteres.

Haz que `validateEmail` exija un texto, le quite los espacios, lo pase a minúsculas y compruebe que tenga forma de email.

Haz que `validateId` acepte un entero positivo. Un texto numérico como `"3"` vale y se convierte a número.

Deja que SQLite asigne el `id` al crear. No lo generes en la lógica.

Mantén el email único en la tabla. No añadas una consulta previa para comprobarlo.

Al actualizar, acepta solo el nombre, solo el email o los dos. Conserva el campo que no llega. Exige al menos uno. Si el `id` no existe, ninguna fila cambia y `logic` lanza un `Error`.

Al eliminar, si el `id` no existe, ninguna fila se borra y `logic` lanza un `Error`.

Al listar, `listUsers` devuelve todos los usuarios en una sola consulta: `SELECT * FROM users`. No filtres filas ni pongas `LIMIT`. Cada usuario lleva `id`, `name` y `email`. Si no hay ninguno, devuelve una lista vacía. No lances un `Error` por estar vacía. `listUsers` no recibe datos y no los valida.

Al buscar por `id`, `findUserById` valida el id y devuelve ese usuario. Si no existe, `logic` lanza un `Error`.

Al buscar por email, `findUserByEmail` valida el email y devuelve ese usuario. Si no existe, `logic` lanza un `Error`.

Al buscar por nombre, `findUserByName` valida el nombre con `validateNombre` y busca con `WHERE name = ?`. Si hay uno, devuelve `{ id, name, email }`. Si hay varios, devuelve la lista. Si no hay ninguno, lanza `User ${name} was not found` con el nombre ya recortado. No escribe en la base. `Ana` y `ana` no son el mismo nombre.

Al contar el género, `usersGender` llama a Ollama en `http://127.0.0.1:11434/v1/systemone` con el modelo `nimble-v3`. `nimble-v3` no acepta chat. Cada grupo de seis nombres va en `state`, uno por línea, y cada nombre es una pregunta `choice` con `women`, `man` y `undefined`. La respuesta se lee en `answers` y el valor elegido está en `choice`. Suma cada nombre y no escribe una línea por nombre. La terminal muestra solo el recuento completo `{ women, man, undefined }`. Si la llamada falla, lanza `no se han podido clasificar usuarios`.

## Qué documentos mantienes

Mantén la constitución, esta guía y las guías de `docs/` en el mismo cambio que provoque la novedad.

`docs/CONSTITUTIONS.MD` es para una persona. Se queda con las specs, los paquetes y los cuatro pasos. El estilo está en `docs/STYLE.md`. Actualízalo cuando cambie el comportamiento, la estructura o el papel de un componente. Tiene que coincidir con el código.

Este archivo, `AGENTS.MD`, es tu información de agente. Actualízalo cuando te den una regla, un estilo, un nombre o algo que haya que hacer o dejar de hacer. Sigue siendo concreto y legible. Conserva las reglas que sigan en vigor. Si una instrucción nueva anula otra, quédate solo con la nueva. No pongas nombres de personas.

## Paquetes

Antes de aceptar un plan que añade un paquete de Node o cambia su versión, comprueba ese paquete y esa versión con el MCP `socket-mcp`. El servidor es el de `MCP.md` en la raíz del repositorio.

Mira si una campaña lo afecta, si tiene alguna alerta y si alguna stat está por debajo de 50. Mira también las dependencias, hasta 3 capas, con los mismos criterios.

Comenta las alertas en el plan. Quien acepta el plan decide. No decidas tú.

El plan lleva un resumen antes de aceptarse: paquete, versión, capa, campaña, alertas y stats por debajo de 50. Si una comprobación no está disponible, dilo. No lo presentes como ausencia de avisos.

No compruebes un paquete que no es de Node, un paquete cuya versión no cambia, ni una dependencia más allá de la tercera capa.

## Git

`.cursor/` está en el `.gitignore` de la raíz del repositorio. No lo quites de ahí y no lo subas.

## Al terminar una tarea

Al terminar una tarea, lanza `pnpm format` y `pnpm lint` desde `first-app`.
