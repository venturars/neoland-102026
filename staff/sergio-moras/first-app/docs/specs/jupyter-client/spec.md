# Spec: Cliente Jupyter

## Qué queremos conseguir
Que una persona que no programa pueda usar la aplicación y comprobar que hace lo que debe. Abre un documento por cada funcionalidad, ejecuta el bloque y lee el resultado. No escribe código.

## Cómo se usa
- Hay seis documentos en `clients/jupyter/`, uno por cada `.txt` de `clients/terminal/`:
  - `createUser`
  - `findUserByEmail`
  - `listUsers`
  - `updateUser`
  - `deleteUser`
  - `classifyGender`
- La persona abre un documento, pulsa ejecutar en el bloque y debajo aparece el resultado.
- Cada documento hace lo mismo que su `.txt`: llama a la misma función de `logic/`, con los valores de ejemplo a la vista en el bloque.
- El resultado se muestra en una tabla con el encabezado en color: una fila por usuario. Si no hay usuarios, se ven los encabezados y el texto `There are no users yet.`
- Si la funcionalidad no devuelve datos (por ejemplo, borrar), la tabla lo dice con una sola fila.

## Qué trae cada documento
En este orden:
1. Título.
2. Qué hace.
3. Qué pasa en la base de datos.
4. Qué comando usa.
5. Anotaciones.
6. El bloque que lo ejecuta.
7. El resultado de esa ejecución.

## Reglas de negocio
- El cliente no cambia las funcionalidades. Cada documento llama a la misma `logic/` que el cliente de terminal.
- Si la funcionalidad falla, no sale la tabla. Se ve el mensaje que ya lanza esa `logic/`:
  - `Name is required.`
  - `Email is required.`
  - `Invalid email: <email>`
  - `Email already exists: <email>`
  - `User not found: <email>` o `User not found: id <id>`
  - `Invalid id: <id>`
  - `Provide a new name, a new email, or both.`
  - `Users could not be classified: <motivo>`
- El bloque busca la app subiendo de carpeta hasta la que contiene `logic/`. Si no la encuentra, se para y muestra `App not found.`
- Funciona en Windows: la salida del programa se lee siempre en UTF-8, para que los caracteres de la tabla no den error de codificación.
- Se abre con la extensión Jupyter de VS Code, o en el navegador con `python -m notebook clients/jupyter`. No hay script en `package.json`.
- Las anotaciones de `createUser`, `updateUser` y `deleteUser` avisan de que escriben de verdad en `db/users.sqlite`. La de `deleteUser` avisa de que borra el usuario indicado.
- La anotación de `classifyGender` avisa de que necesita Ollama en marcha.

## Casos a cubrir
- Cada documento con datos correctos.
- Datos que faltan, email inválido o repetido.
- Id inexistente o no numérico.
- Lista sin usuarios.
- `classifyGender` con Ollama apagado.
- Ejecutar un documento desde una carpeta donde no está la app.

## Fuera de alcance
- Cambiar `logic/`, `queries/` o `db/`.
- Añadir funcionalidades que el cliente de terminal no tiene.
- Cambiar el esquema de la tabla `users`.
- Abrir JupyterLab.
