# Tareas — cliente Jupyter

1. Abre `docs/CONSTITUTIONS.md`, en el árbol de `clients/`.
   Añade `clients/jupyter/` con los nueve documentos del plan.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

2. Abre `docs/CONSTITUTIONS.md`, en la frase que dice que la app se usa desde la terminal.
   Esa frase dice también que el CEO valida esas funcionalidades desde los documentos de Jupyter.
   El resto de la sección no cambia.
   La frase se lee.

3. Abre `package.json`.
   En `dependencies` quedan `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, versiones fijas.
   El script `jupyter` hace lo que dice el plan en Arranque.
   Se lanza con `pnpm jupyter` desde `first-app`.

4. Abre `clients/jupyter/create-users-table.ipynb`.
   El markdown lleva título, qué hace, qué pasa en la base de datos, qué acción usa y la anotación del plan.
   El bloque abre `db`, lo cierra y dibuja `No devuelve datos.`
   Node trabaja en la app, dos carpetas por encima del documento.

5. Abre `clients/jupyter/insert-user.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque llama a `insertUser({ name: "Ada", email: "ada@example.com" })` y dibuja las columnas de un usuario.
   Node trabaja en la app, dos carpetas por encima del documento.

6. Abre `clients/jupyter/find-all.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque llama a `findAll()` y dibuja una fila por usuario.
   Si no hay usuarios, se ven los encabezados y ninguna fila.

7. Abre `clients/jupyter/find-by-email.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque llama a `findByEmail("ada@example.com")` y dibuja las columnas de un usuario.
   Si no hay usuario, se ven los encabezados y ninguna fila.

8. Abre `clients/jupyter/find-by-id.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque llama a `findById(1)` y dibuja las columnas de un usuario.
   Si no hay usuario, se ven los encabezados y ninguna fila.

9. Abre `clients/jupyter/find-user-by-name.ipynb`.
   El markdown lleva las partes del plan para este documento.
   El bloque llama a `findUserByName("Ada")` y dibuja una fila por usuario.
   Si no hay ninguno, se ven los encabezados y ninguna fila.

10. Abre `clients/jupyter/update-user.ipynb`.
    El markdown lleva las partes del plan para este documento.
    El bloque llama a `updateUserQuery({ id: 1, name: "Ada Lovelace", email: "ada@example.com" })`.
    Dibuja las columnas de un usuario.

11. Abre `clients/jupyter/remove-user.ipynb`.
    El markdown lleva las partes del plan para este documento.
    El bloque llama a `removeUser(1)` y dibuja cuántas filas quitó.
    La anotación dice que esto borra al usuario 1.

12. Abre `clients/jupyter/users-gender-count.ipynb`.
    El markdown lleva las partes del plan para este documento.
    El bloque llama a `await usersGenderCount()` y dibuja `women`, `men` y `undefinedUser`.
    Node trabaja en la app, dos carpetas por encima del documento.

13. Instala las dependencias con pnpm desde `first-app`.
    Ejecuta el bloque de cada documento.
    La salida que queda guardada es la tabla, o el mensaje de error que haya salido.
    No se reescribe esa salida a mano.

14. Lanza `pnpm jupyter` desde `first-app`.
    El navegador muestra la lista de los nueve documentos.
    El programa es `.venv/Scripts/jupyter-notebook`.
    No se abre Lab.
