AGENTS.md —

Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Está en Node, con módulos ESM (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`) y pnpm como gestor de paquetes. La arquitectura y las reglas de base están en `docs/CONSTITUTIONS.md`.

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

-Lee docs/CONSTITUTIONS.md y la spec activa antes de tocar código.
-Si esos ficheros no existen, no los crees y sigue con este AGENTS.MD.
- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo cuando el usuario lo pida en esa tarea.
- Temperatura próxima a 0.
- Usar pnpm. No añadir un paquete de SQLite.
- En cada tarea: investiga antes de escribir, compara si la tarea tiene parentesco con otra ya resuelta, y sigue las convenciones y el estilo del código actual.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.

Al terminar cualquier tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.