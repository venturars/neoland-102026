# Arquitectura

## Capas
El flujo es `clients → logic → queries → db`. Cada capa solo llama a la siguiente.

| Capa | Hace | No hace |
|---|---|---|
| `clients/` | Llama a una función de `logic/` con unos valores y muestra el resultado o el error | Validar, decidir mensajes ni tocar la base |
| `logic/` | Valida los datos, aplica las reglas, llama a `queries/` y devuelve el resultado o lanza un error de [ERRORS.md](ERRORS.md) | SQL, imprimir, leer `process.argv` ni llamar a `process.exit` |
| `queries/` | Ejecuta el SQL y devuelve las filas | Validar ni decidir mensajes |
| `db/` | Abre la base y crea la tabla si no existe | Reglas de negocio |

La base de datos está en [DATABASE.md](DATABASE.md). El árbol completo, en [TREE.md](TREE.md).

## Ficheros
- `db/connection.js`: la única conexión a `db/users.sqlite`. Crea la tabla `users` si no existe.
- `queries/users.js`: todo el SQL de la tabla `users`. Exporta `insertUser`, `selectUserByEmail`, `selectAllUsers`, `updateUserById` y `deleteUserById`.
- `logic/create-user.js`: crea un usuario.
- `logic/find-user-by-email.js`: busca un usuario por su email.
- `logic/list-users.js`: lista los usuarios por id.
- `logic/update-user.js`: cambia el nombre, el email o los dos de un usuario.
- `logic/delete-user.js`: borra un usuario.
- `logic/classify-gender.js`: cuenta hombres, mujeres y no definidos con un modelo de Ollama. Exporta también `countGenders`, que hace el conteo sobre una lista.
- `clients/terminal/<operación>.txt`: el comando que se pega en la terminal.
- `clients/jupyter/<operación>.ipynb`: el documento que se ejecuta en Jupyter.

## Una operación
Una operación tiene, con el mismo nombre:
1. Un fichero en `logic/` que exporta su función.
2. Una función en `queries/users.js`, si usa la base.
3. Un `.txt` en `clients/terminal/`.
4. Un `.ipynb` en `clients/jupyter/`.

Una operación nueva es un fichero nuevo en `logic/`. Un fichero de `logic/` ya creado no se reemplaza para encajar otra operación.

## Un fichero de `logic/`
- Exporta una función, con el nombre de la acción.
- Valida los parámetros, aplica las reglas de negocio y llama a `queries/`.
- Devuelve el resultado o lanza `throw new Error` con un mensaje de [ERRORS.md](ERRORS.md).
- No lee `process.argv`, no imprime y no llama a `process.exit`. Eso lo hace el cliente.

## Clientes

### Terminal
Cada `.txt` es un comando que se pega desde `first-app/`, en PowerShell o en Git Bash:
- `node --no-warnings --input-type=module -e "` en la primera línea, el código sangrado debajo y `"` sola en la última.
- El código importa la función de `logic/`, la llama dentro de un `try` y muestra el resultado. En el `catch` escribe `Error: <mensaje>` y termina con `process.exit(1)`.
- Dentro del código, solo comillas simples y sin `${...}`: una comilla doble cerraría el comando y Git Bash sustituiría `${...}`.

### Jupyter
Cada `.ipynb` tiene un bloque de texto (qué hace, qué pasa en la base, qué comando usa y anotaciones) y un bloque de Python que:
- sube de carpeta hasta la que contiene `logic/`, o se para con `App not found.`;
- lanza Node con el código de la operación y lee su salida en UTF-8;
- muestra el resultado en una tabla de `cli-table3` con el encabezado en color, o el `Error: <mensaje>`.
