# Tareas — cliente Jupyter

1. Abre `docs/CONSTITUTIONS.md`, en el árbol de `clients/`.
   La línea de `jupyter/` dice que se abre con el Jupyter de la app.
   El resto del árbol no cambia.
   Esa línea se lee en el árbol.

2. Abre `package.json`.
   En `dependencies` quedan `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, versiones fijas.
   El script `jupyter` crea `.venv` e instala `jupyterlab==4.6.4` solo si no existe `.venv/bin/jupyter`.
   Después arranca `.venv/bin/jupyter lab clients/jupyter`.

3. Abre `clients/jupyter/create-users-table.ipynb`.
   El markdown lleva título, qué hace, qué pasa en la base de datos, qué acción usa y las anotaciones del plan.
   El bloque ejecuta `createUsersTable`, dibuja la columna `name` y sube hasta la carpeta que contiene `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

4. Abre `clients/jupyter/create-user.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `createUser({ name: "Ada", email: "ada@example.com" })`, dibuja las columnas de un usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

5. Abre `clients/jupyter/list-users.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `listUsers()`, dibuja una fila por usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

6. Abre `clients/jupyter/find-user-by-name.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `findUserByName("Ada")`, dibuja una fila por usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

7. Abre `clients/jupyter/find-user-by-email.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `findUserByEmail("ada@example.com")`, dibuja las columnas de un usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

8. Abre `clients/jupyter/find-user-by-id.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `findUserById(3)`, dibuja las columnas de un usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

9. Abre `clients/jupyter/update-user.ipynb`.
   El markdown lleva las cuatro partes del plan para este documento.
   El bloque ejecuta `updateUser(1, { name: "Ada Lovelace" })`, dibuja las columnas de un usuario y sube hasta `logic/`.
   Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

10. Abre `clients/jupyter/delete-user.ipynb`.
    El markdown lleva las cuatro partes del plan para este documento.
    El bloque ejecuta `deleteUser(1)`, dibuja `No devuelve datos.` si no hay datos, y sube hasta `logic/`.
    Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

11. Abre `clients/jupyter/users-gender-count.ipynb`.
    El markdown lleva las cuatro partes del plan para este documento.
    El bloque ejecuta `await usersGenderCount()`, dibuja `women`, `men` y `genderUndefined`, y sube hasta `logic/`.
    Si no la encuentra, el texto es `No encuentro la app.` La anotación dice que se abre con `pnpm jupyter` desde la app.

12. Ejecuta el bloque de cada documento con el directorio en `clients/jupyter`.
    La salida que queda guardada es la tabla, la línea `No hay filas.`, o el mensaje de error que haya salido.
    No se reescribe esa salida a mano.
    El proceso que abre la lista es `.venv/bin/jupyter`.

13. Abre `package.json`.
    El script `jupyter` instala `notebook==7.6.3` si no existe `.venv/bin/jupyter-notebook`.
    Crea el `.venv` solo si falta.
    Después arranca `.venv/bin/jupyter notebook clients/jupyter`.

14. Lanza `pnpm jupyter` desde `first-app`.
    El navegador muestra la lista de los nueve documentos, en la interfaz de notebooks.
    El proceso es `.venv/bin/jupyter notebook`.
    No se abre Lab.
