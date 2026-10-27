# Tasks — cliente Jupyter

1. Abre `package.json`.
   Añade `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`.
   Añade el script `jupyter`: si falta `.venv/bin/jupyter-notebook`, crea el `.venv` e instala `notebook` `7.6.3`; luego abre `clients/jupyter` con `jupyter notebook`.
   Hecho cuando `npm run jupyter` desde `first-app` prepara ese Jupyter y enseña la lista.

2. Abre `docs/CONSTITUTIONS.md`.
   En el árbol, `clients/jupyter/` lista los ocho documentos. Una línea dice que llaman a la misma acción que el `.txt` y que se abren con `npm run jupyter`.
   Hecho cuando el árbol nombra esos documentos.

3. Abre `AGENTS.md`.
   En comandos, añade `npm run jupyter`.
   Hecho cuando esa línea está.

4. Crea `clients/jupyter/create-users-table.ipynb`.
   El texto dice qué hace, que no guarda personas, que usa `createUsersTable` y que no borra filas.
   El bloque llama a `createUsersTable` y muestra los nombres de `sqlite_master`.
   Hecho cuando al ejecutarlo se ve la tabla `users`.

5. Crea `clients/jupyter/create-user.ipynb`.
   El texto dice que guarda a Ada, qué fila inserta y los avisos `Name is empty`, `Email is invalid` y `Email is already used`.
   El bloque llama a `createUser({ name: "Ada", email: "ada@example.com" })`.
   Hecho cuando al ejecutarlo se ve a Ada en la tabla.

6. Crea `clients/jupyter/list-users.ipynb`.
   El texto dice que solo lee, que usa `listUsers()` y que sin personas no hay filas.
   Hecho cuando una lista vacía muestra los encabezados y `No hay filas.`

7. Crea `clients/jupyter/find-user-by-email.ipynb`.
   El texto dice que solo lee, que usa `findUserByEmail("ada@example.com")` y los avisos `Email is invalid` y `User not found`.
   Hecho cuando al ejecutarlo se ve a Ada.

8. Crea `clients/jupyter/find-user-by-id.ipynb`.
   El texto dice que solo lee, que usa `findUserById(1)` y los avisos `Invalid id` y `User not found`.
   Hecho cuando al ejecutarlo se ve esa persona.

9. Crea `clients/jupyter/update-user.ipynb`.
   El texto dice que cambia el nombre, que el id no cambia y los avisos de esa acción.
   El bloque llama a `updateUser(1, { name: "Ada Lovelace" })`.
   Hecho cuando al ejecutarlo el nombre es Ada Lovelace.

10. Crea `clients/jupyter/delete-user.ipynb`.
    El texto dice que borra a la persona 1, que no devuelve datos y los avisos `User not found` e `Invalid id`.
    El bloque llama a `deleteUser(1)`.
    Hecho cuando al ejecutarlo se ve `No devuelve datos.`

11. Crea `clients/jupyter/users-gender-count.ipynb`.
    El texto dice que solo lee, que usa `usersGenderCount()`, que hace falta Ollama con `nimble-v3` y que si no responde se ve `Could not classify the users`.
    Hecho cuando al ejecutarlo se ven los tres números, o ese aviso si Ollama no está.
