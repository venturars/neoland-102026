AGENTS.md —

Proyecto

first-app es un manejo de usuarios con tres operaciones: crear, actualizar y eliminar. La lógica de negocio es agnóstica de la tecnología que la ejecute.

Node >= 22, ESM (`"type": "module"`). Gestor de paquetes: pnpm. Persistencia, cuando exista: el módulo integrado `node:sqlite`.

Carpetas, vacías en este corte:

- `logic`: lógica de negocio, sin SQL y sin `node:sqlite`.
- `queries/queries`: SQL, llamado desde `queries`.
- `queries`: funciones que llaman a ese SQL.
- `db`: `node:sqlite`.
- `clients`: clientes.

El enlace definido es que `queries` llama al SQL de `queries/queries`. Quien llama a `logic`, si `logic` llama a `queries`, y si `queries` usa `db`, queda sin definir.

Comandos

Ejecutar: no hay comando.
Tests: no hay. El script `test` de `package.json` termina en error. No se añaden tests ni se cambia ese script.
Lint/formato: Prettier por defecto. No hay `.prettierrc` ni script de formato.

Estilo y convenciones

El código se escribe en inglés y está pensado para alumnos hispanohablantes.

- Ficheros en kebab-case.
- Funciones en camelCase. El nombre es la acción. Una función, un propósito.
- Constante de fichero en mayúsculas con guion bajo (`const MODEL`).
- Comportamiento nuevo: función nueva. No se altera una función existente para meterlo y no se provoca un refactor en cascada.

Reglas

Lee docs/constitution.md y la spec activa antes de tocar código.

Si esos ficheros no existen, no los crees y sigue con este AGENTS.MD.

- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo cuando el usuario lo pida en esa tarea.
- Temperatura próxima a 0.
- Usar pnpm. No añadir un paquete de SQLite.

Al terminar cualquier tarea

- Al terminar una funcionalidad, crea su primer cliente: el de terminal. Es un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.