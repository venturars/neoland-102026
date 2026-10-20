AGENTS.md —

Proyecto

first-app es un manejo de usuarios con tres operaciones: crear, actualizar y eliminar. La lógica de negocio es agnóstica de la tecnología que la ejecute.

Node >= 22, ESM (`"type": "module"`). Gestor de paquetes: pnpm. Persistencia: el módulo integrado `node:sqlite`.

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
- El código tiene que leerse de arriba a abajo, con `if` y con nombres que digan qué hacen. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

Reglas

Lee docs/constitution.md y la spec activa antes de tocar código.

Si esos ficheros no existen, no los crees y sigue con este AGENTS.MD.

- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo cuando el usuario lo pida en esa tarea.
- Temperatura próxima a 0.
- Usar pnpm. No añadir un paquete de SQLite.

Al terminar cualquier tarea

- Al terminar una funcionalidad, crea su primer cliente en `clients/terminal/`. Es un `.txt` que se copia y se pega entero en la terminal, con el directorio actual en `first-app`. Empieza con el comentario de pegado y ejecuta `node --input-type=module` con un heredoc. Abre la base, llama a la lógica y, si el input es válido, llama a `queries/user.js`. Guarda el valor que se muestra en `result` y hace `console.log(result)`. Es el test manual básico.
- El orden de los tres pegados es crear, actualizar y borrar. Usan el mismo `db/users.sqlite`. Actualizar y borrar usan el `id` 1. Un segundo pegado de crear, con ese email todavía en la tabla, lanza `Email already exists`.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es pegar ese `.txt`. Crear y actualizar muestran la fila guardada, con `id` y las dos fechas puestas por la base. Borrar muestra el usuario que devolvió `deleteUser`.