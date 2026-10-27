# Plan — Alinear el código con las guías

## Recorrido

El cambio reescribe la forma de las líneas dentro de las capas actuales. No crea ni borra ficheros, no cambia el recorrido, no cambia SQL y no cambia el contrato de entrada y salida de `logic/`.

## Qué diferencia hay hoy con las guías

- **Una acción por línea.** `docs/STYLE.md` pide que `input.name` y `.trim()` vayan en líneas distintas. Hoy hay encadenados como `email.trim().toLowerCase()`, `changes.name.trim()` y `parts[0].length > 0` en `logic/create-user.js`, `logic/find-user-by-email.js` y `logic/update-user.js`.
- **Validación del `id`.** `AGENTS.md` la define como `Number.isInteger(id) && id > 0`. Hoy `logic/delete-user.js`, `logic/find-user-by-id.js` y `logic/update-user.js` escriben la negación con `||`.
- **Condiciones compuestas.** Las condiciones largas dentro de un `if` se pasan a un nombre antes del `if`, para que el `if` y su `throw new Error` queden cortos.
- **Operadores ternarios.** `logic/update-user.js` usa `hasName ? name : existing.name`. Se escribe con `if`, porque el código debe ser lineal.
- **Constantes.** En `logic/count-users-by-gender.js`, `batchSize` es un valor fijo y pasa a `BATCH_SIZE`.
- **Conexión.** `db/connection.js` mezcla una llamada y una comparación en una línea, y usa dos ternarios.

## Ficheros que se tocan

- `logic/create-user.js`, `logic/find-user-by-email.js`, `logic/find-user-by-id.js`, `logic/delete-user.js`, `logic/update-user.js`, `logic/list-users.js`.
- `logic/count-users-by-gender.js`, solo la función `countUsersByGender`.
- `db/connection.js`, solo las líneas con llamadas encadenadas y ternarios.

## Ficheros que no se tocan

- `classifyNames`, que está dentro de `logic/count-users-by-gender.js`.
- `queries/users.js`. Por eso `db/connection.js` conserva su `export default`: pasarlo a un export con nombre obligaría a cambiar el import de `queries/users.js`.
- Los SQL, los clientes de terminal, los cuadernos Jupyter y `run_logic.py`.

## Decisiones que quedan abiertas

- `docs/STYLE.md` pide una función por fichero y exports con nombre. `classifyNames` y el `export default` de la conexión no lo cumplen y se quedan así hasta una tarea posterior.
- `Unable to classify names` no está en la lista de referencia de `docs/ERRORS.md`. No se cambia aquí: la lista es de referencia y el código de `classifyNames` no se toca.
- Los comentarios se conservan. Si una línea se separa en varias, el comentario sigue explicando el bloque.

## Documentación

Como no se crean, borran ni mueven ficheros ni cambia el contrato, `docs/TREE.md`, `docs/ARCHITECTURE.md` y `docs/CONSTITUTION.md` no necesitan cambio. `docs/TREE.md` solo añade la carpeta de esta spec. Se revisa al terminar y se indica en el informe.

## Comprobación

- Antes de cambiar nada, se ejecuta cada caso de `clients/terminal/` sobre una copia temporal de la base (con `FIRST_APP_DATABASE_FILE`) y se guarda la salida.
- Después de cada fichero se repiten los mismos casos, más al menos un caso incorrecto por operación, y se comparan las salidas.
- `countUsersByGender` se comprueba con la tabla vacía, que no contacta con Ollama. Si Ollama está en marcha, también con filas.
- Al final, `pnpm format`, `pnpm lint`, `pnpm exec prettier --check .` y `git diff --check`.

No se añaden dependencias, así que no hace falta la revisión con Socket.
