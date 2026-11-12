# Tareas — alinear el código con las guías

1. Abrir `logic/create-user.js`.
   La firma sigue siendo `createUser(input)`.
   El nombre y el email quedan como dice «Crear usuario».
   El `findByEmail`, el `insert` y el `return` no cambian.

2. Abrir `logic/update-user.js`.
   La firma sigue siendo `updateUser(id, changes)`.
   El nombre, el email y el otro usuario quedan como dice «Cambiar usuario».
   El `findById`, el `findByEmail`, el `update` y el `return` no cambian.

3. Abrir `logic/find-user-by-email.js`.
   La firma sigue siendo `findUserByEmail(email)`.
   El email queda como dice «Email».
   El resto del fichero no cambia.

4. Abrir `logic/users-gender-count.js`.
   La firma sigue siendo `usersGenderCount()`.
   Los cambios son los de «Conteo por género».
   La llamada a la IA, `MODEL` y el lote de 6 no cambian.

5. Abrir `queries/users.js`.
   El directorio, las lecturas y las ejecuciones quedan como dice «Queries».
   Las firmas no cambian.
   `createUsersTable` no cambia.

6. Abrir `db/connection.js`.
   El texto es el del apartado «Conexión».
   Sigue exportando `db`.
   Sigue abriendo `users.sqlite`.

7. Abrir `clients/terminal/create-users-table.txt`.
   `prepare` y `all` quedan como dice «Cliente de la tabla».
   Sigue creando la tabla.
   Sigue imprimiendo los nombres de `sqlite_master`.

8. Abrir `docs/CONSTITUTIONS.md`.
   En «Un fichero de logic», la frase queda como dice «Firmas».
   `createUser` recibe un objeto con `name` y `email`.
   `updateUser` recibe el `id` y un objeto con los cambios.

9. Comprobar.
   En `first-app`, `pnpm format` termina bien.
   `pnpm lint` termina bien.
   El resto de `clients/` no cambia.
