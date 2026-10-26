# Tareas — buscar usuarios por nombre

1. Abre `docs/CONSTITUTIONS.md`, en el árbol.
   Añade `logic/find-user-by-name.js`, `queries/queries/find-by-name.sql` y `clients/terminal/find-user-by-name.txt`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

2. Abre `docs/CONSTITUTIONS.md`, sección 6.
   Añade la fila `Could not find the user`: SQLite falla al leer los usuarios por nombre.
   La lista vacía no es este fallo. El resto de la tabla no cambia.
   Esa frase se lee en la tabla.

3. Abre `queries/queries/find-by-name.sql`.
   El texto es `SELECT * FROM users WHERE name = :name ORDER BY id`.
   El fichero no tiene más líneas.
   El SQL se lee en el fichero.

4. Abre `queries/users.js`.
   Lee `find-by-name.sql` igual que las otras queries.
   Exporta `findByName(name)` y ejecuta ese SQL con `.all({ name })`.
   La función queda junto a `findByEmail`.

5. Abre `logic/find-user-by-name.js`.
   Exporta `findUserByName(name)`. Comprueba el nombre con `validateName`.
   Llama a `findByName`. Si SQLite falla, lanza `Could not find the user`.
   Devuelve la lista saneada con `toUser`. Si no hay filas, devuelve `[]`.

6. Abre `clients/terminal/find-user-by-name.txt`.
   El comentario dice que se pega con el directorio actual en `first-app`.
   Importa `findUserByName` desde `./logic/find-user-by-name.js` y hace `console.log` de `findUserByName("Ada")`.
   El fichero se lee.

7. Pega `clients/terminal/find-user-by-name.txt` con el directorio actual en `first-app`.
   La salida es una lista.
   Cada elemento tiene `id`, `name`, `email`, `createdAt` y `updatedAt`.
   Si hay varias Ada, salen todas, de menor a mayor `id`.

8. Pega en la terminal la misma llamada con `""`.
   Se ve `Name is empty`.
   No se imprime una lista.
   El fichero del cliente sigue buscando `Ada`.

9. Pega en la terminal la misma llamada con un nombre que no está guardado.
   La salida es `[]`.
   No se ve `User not found`.
   El fichero del cliente sigue buscando `Ada`.
