# Tareas — capas dentro de src

1. Crea `src/` en first-app.
   Mueve dentro `clients/`, `db/`, `queries/` y `logic/`, con lo que ya contienen.
   `users.sqlite` se mueve con `db/` y sigue sin estar en git.
   Esas cuatro carpetas ya no están en la raíz.

2. Abre los nueve `.txt` de `src/clients/terminal/`.
   El comentario sigue con el directorio actual en `first-app`.
   `create-users-table.txt` importa desde `./src/db/connection.js`.
   Los otros ocho importan desde `./src/logic/` con su fichero de ahora.

3. Abre los nueve `.ipynb` de `src/clients/jupyter/`.
   Node sigue con el directorio de trabajo en `first-app`, tres carpetas por encima del documento.
   Los imports pasan a `./src/logic/` y, en crear la tabla, a `./src/db/connection.js`.
   El texto de cada documento se queda.

4. Abre `scripts/jupyter.js`.
   Jupyter arranca sobre `src/clients/jupyter`.
   El resto del script no cambia.
   El archivo se lee.

5. Abre `docs/tree.md`.
   `db/`, `logic/`, `queries/` y `clients/` quedan dentro de `src/`.
   El resto del árbol no cambia.
   El archivo se lee.

6. Abre `docs/ARCHITECTURE.md`.
   Esas mismas rutas llevan el prefijo `src/`.
   La función de cada carpeta no cambia.
   El archivo se lee.

7. Abre `docs/database.md`.
   La base es `src/db/users.sqlite`. `src/db/connection.js` abre siempre ese archivo.
   `src/queries/users.js` lee los `.sql` de `src/queries/queries/`.
   El fichero no se reemplaza. El archivo se lee.

8. Abre `docs/style.md`.
   Los `.txt` quedan en `src/clients/terminal/`.
   La acción queda en `src/logic/` y el SQL en `src/queries/queries/`.
   El archivo se lee.

9. Abre `docs/CONSTITUTIONS.md`.
   El cliente queda en `src/clients/terminal/`.
   El parecido queda en `src/logic/`.
   El archivo se lee.

10. Abre `AGENTS.md` de first-app.
    Nombra `src/db/users.sqlite`, el cliente en `src/clients/terminal/` y la función de `src/logic/`.
    El resto no cambia.
    El archivo se lee.

11. Desde `first-app`, pega `src/clients/terminal/find-all.txt`.
    No se edita ese archivo.
    La lista es la de antes. Si no hay usuarios, sale vacía.
    Se ve en la terminal.

12. Desde `staff/esther-patino/first-app`, lanza `format` y `lint`.
    `format` escribe el formato estándar. `lint` avisa si hay un error de sintaxis o de reglas.
    No cambia lo que hace la app.
    Los dos resultados se ven en la terminal.
