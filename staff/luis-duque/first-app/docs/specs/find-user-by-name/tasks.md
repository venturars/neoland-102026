# Tareas — buscar un usuario por nombre

1. Crea `queries/queries/find-user-by-name.sql`.
   El texto es `SELECT * FROM users WHERE name = ?`.
   No escribe en la base.
   El fichero se puede abrir y leer.

2. Abre `queries/users.js`.
   Lee `find-user-by-name.sql` y exporta `findUserByName`.
   La ejecuta con `.all()`. Cada fila queda en `{ id, name, email }`.
   No cambia las funciones que ya existen.

3. Crea `logic/find-user-by-name.js`.
   `findUserByName(name)` es `async` y valida con `validateNombre`.
   Importa `queries` como `import * as users` y llama a `users.findUserByName`.
   No toca `logic/shared.js`, `package.json` ni `db/connection.js`.

4. Si la consulta devuelve un usuario, la función devuelve `{ id, name, email }`.
   Si devuelve varios, devuelve la lista. Cada elemento lleva esos tres campos.
   Si no devuelve ninguno, lanza `User ${name} was not found` con el nombre recortado.
   No escribe en la base. `Ana` y `ana` siguen siendo distintos.

5. Crea `clients/terminal/find-user-by-name.txt`.
   Es una sola línea de cmd, como el resto de `clients/terminal`.
   Importa `findUserByName` y hace `console.log` del resultado. El nombre va al final.
   No valida, no escribe SQL y no abre la base.

6. En el mismo cambio, abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
   Dejan escrito `findUserByName`, `find-user-by-name.txt` y el error `User ${name} was not found`.
   No cambian las operaciones que ya existen.
   Los dos se leen y coinciden con el código.

7. Tira esa línea desde cmd, en la raíz del repositorio, con un nombre guardado.
   Si solo hay uno, se ve ese usuario: `id`, `name` y `email`.
   Si hay varios con ese nombre, se ve la lista.
   No se crea, no se actualiza y no se elimina nada.

8. Tira esa línea con un nombre que no está guardado.
   Se ve `User ${name} was not found`.
   Los usuarios guardados siguen igual.
   No se crea, no se actualiza y no se elimina nada.

9. Tira esa línea con un nombre vacío.
   Se rechaza con `Name is required`.
   Los usuarios guardados siguen igual.
   No se crea, no se actualiza y no se elimina nada.

10. Tira esa línea con un nombre de más de 100 caracteres.
    Se rechaza con `Name must be at most 100 characters`.
    Los usuarios guardados siguen igual.
    No se crea, no se actualiza y no se elimina nada.
