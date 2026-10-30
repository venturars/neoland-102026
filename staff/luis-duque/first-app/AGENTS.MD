# Instrucciones del agente

Trabajas en `staff/luis-duque/first-app`. Estas instrucciones son para ti. Léelas antes de cambiar código y síguelas. Escríbelas para que otro agente las entienda sin conocer el historial del chat. No escribas nombres de personas.

El proyecto gestiona usuarios: crear, actualizar, eliminar, listar, buscar por `id`, por email o por nombre, y contar el género de los nombres ya guardados. No hagas otra operación salvo que te la pidan.

Si el código y este archivo no coinciden, no cambies el estilo por tu cuenta. Pregunta a quien te encargó el cambio.

## Desarrollos

Un cambio nuevo es un desarrollo: una función, una dependencia, la configuración o la documentación de la app. Empieza en `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. El detalle está en `docs/CONSTITUTIONS.MD`, sección «Desarrollos».

Pedir el cambio es pedir `spec.md`. «Hazlo», «estandariza», «implementa» o «cámbialo» no abren el código. Una skill, una issue o un «no uses la skill» tampoco. Hasta que pidan ejecutar las tareas no toques código, `package.json`, `pnpm-lock.yaml`, `logic`, `queries`, `db` ni `clients`.

Escribe `spec.md` y para. Una persona lo lee. Luego `plan.md` y para. Si la constitución, el código y la spec dicen lo mismo, escribe `tasks.md` y para. Si no, la pregunta queda al final del plan y no hay tareas. En este proceso no toques ningún otro fichero.

El código empieza solo cuando los tres ficheros ya están escritos y esa persona pide ejecutar `tasks.md`. Ejecuta `tasks.md`. No inventes pasos. No vuelvas a escribir la spec, el plan ni las tareas en bucle.

Una operación que ya está en el código no se sustituye. La nueva es un fichero nuevo.

## Alcance

No añadas pantalla, servidor ni framework. No añadas otro cliente salvo que te lo pidan.

No crees un `README`. La explicación para personas está en `docs/`.

No crees clases de error. Usa `Error`.

No crees consultas ni funciones que no te hayan pedido. Las operaciones que ya están en el código son crear, actualizar, eliminar, listar todos, buscar por `id`, buscar por email, buscar por nombre y contar el género con `usersGender`. Otra operación solo se añade con su desarrollo en `docs/specs/` y cuando una persona pide ejecutar las tareas.

No uses `try/catch` en `queries/users.js`. Si SQLite rechaza un email repetido, deja salir ese error.

No separes la lógica de la base de datos. `logic` llama a `queries`. `queries` usa la conexión de `db`.

## Dónde va cada cosa

Pon la conexión en `db`: `connection.js` y, cuando se abra la base, `users.sqlite`. Pon el esquema en `queries/queries/create-table-users.sql`.

Pon la validación y las operaciones en `logic`: `shared.js`, `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js`, `find-user-by-name.js` y `users-gender.js`. `shared.js` va dentro de `logic`, no en la raíz.

Pon el cliente de Jupyter en `clients/jupyter`: un `.ipynb` por acción, con el mismo nombre que el txt. El bloque importa la función de `logic` y muestra una tabla de `cli-table3` con el encabezado `["cyan", "bold"]`. No valida, no escribe SQL y no abre la base. El script `jupyter` está en `package.json`. Se arranca con `pnpm jupyter` desde `first-app`, que llama a `scripts/jupyter.sh`. Crea el `.venv` de la app si falta, instala `notebook` `7.6.3` si falta el ejecutable y abre `clients/jupyter` en `127.0.0.1`. En Windows usa `Scripts` y `py -3`. En Mac y Linux usa `bin` y `python3`. No usa el Jupyter del equipo. En Windows la salida de Node se lee en UTF-8.

Pon la entrada por terminal en `clients/terminal`: `create-user.txt`, `update-user.txt`, `delete-user.txt`, `list-users.txt`, `find-user-by-id.txt`, `find-user-by-email.txt`, `find-user-by-name.txt` y `users-gender.txt`. Cada archivo contiene una sola línea, y esa línea es el comando de cmd. El comando llama a la función de `logic` de su acción con `node --input-type=module -e` y el `import` `./staff/luis-duque/first-app/logic/...`. No valida, no escribe SQL y no abre la base. Tira esa línea desde cmd, en la raíz del repositorio, porque Node resuelve el `import` desde la carpeta de trabajo. No uses PowerShell y no pases el archivo por la entrada estándar. `create-user.txt` lleva el nombre y el email al final del comando. `update-user.txt` lleva el id y después `name=...`, `email=...` o los dos. `delete-user.txt` lleva el id. `list-users.txt` no lleva argumentos. `find-user-by-id.txt` lleva el id. `find-user-by-email.txt` lleva el email. `find-user-by-name.txt` lleva el nombre: importa `findUserByName` y hace `console.log` del resultado. `users-gender.txt` no lleva argumentos: importa `usersGender` y hace `console.log` del recuento.

Pon la ejecución de todo el SQL en `queries/users.js`, también `create-table-users.sql`. Pon el texto de cada consulta en `queries/queries`, en `create-table-users.sql`, `create-user.sql`, `update-user.sql`, `delete-user.sql`, `list-users.sql`, `find-user-by-id.sql`, `find-user-by-email.sql` y `find-user-by-name.sql`. `db/connection.js` no lee ni ejecuta ninguna consulta.

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
