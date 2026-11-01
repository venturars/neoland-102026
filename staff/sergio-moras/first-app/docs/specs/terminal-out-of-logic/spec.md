# Spec: Sacar la terminal de `logic/`

Issue: #638.

## Qué queremos conseguir
Que cada archivo de `logic/` solo haga su trabajo: validar los datos, llamar a `queries/` y devolver el resultado o lanzar un error. Así cualquier cliente (terminal, Jupyter, tests) puede importar la función sin que se ejecute nada más.

Hoy cada archivo de `logic/` lleva además un bloque de terminal (`isRunFromTerminal`) que lee `process.argv`, imprime y llama a `process.exit`. Ese bloque rompe al importar la función desde un cliente que no es la terminal.

## Cómo se usa
- La persona abre un `.txt` de `terminal/`, copia el comando y lo pega en la terminal desde `first-app/`.
- El comando importa la función de `logic/`, la llama con los valores de ejemplo y muestra el resultado.
- Si la función lanza un error, se ve `Error: <mensaje>` y el comando termina con código 1.
- Los valores de ejemplo se cambian editando el comando.

## Reglas de negocio
- Ningún archivo de `logic/` lee `process.argv`, imprime ni llama a `process.exit`.
- Las funciones exportadas no cambian: mismo nombre, mismos parámetros, mismas validaciones, mismos mensajes de error y mismo valor devuelto.
- Cada `.txt` da la misma salida que el comando de antes:
  - `createUser`: `User created: <usuario>`.
  - `findUserByEmail`: `User found: <usuario>`.
  - `listUsers`: la tabla de usuarios, o `There are no users yet.`
  - `updateUser`: `User updated: <usuario>`.
  - `deleteUser`: `User deleted: id <id>`.
  - `classifyGender`: `Men: <n>`, `Women: <n>` y `Undefined: <n>`.
- El comando ocupa varias líneas, con el código sangrado como en un archivo `.js`, y funciona igual pegado en PowerShell y en Git Bash.
- `AGENTS.md` y `docs/CONSTITUTIONS.md` dicen lo mismo que el código.

## Casos a cubrir
- Cada `.txt` con datos correctos.
- Datos que faltan, email inválido o repetido.
- Id inexistente o no numérico.
- `classifyGender` con Ollama apagado.
- Importar cada función desde otro programa sin que se ejecute nada más.

## Fuera de alcance
- Mover `terminal/` a `clients/terminal/`: lo hace la issue #381.
- Renombrar archivos, cambiar mensajes de error o el formato de los datos devueltos.
- Cambiar `queries/` o `db/`.
- Crear el cliente Jupyter.
