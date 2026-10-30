# Tareas — alinear el código con las guías

1. Abrir `logic/create-user.js`.
   La firma sigue siendo `createUser(input)`.
   Nombre, email y constantes quedan como dice el plan.
   El `findUserByEmail`, el `insertUser` y el `return` no cambian de mensaje.

2. Abrir `logic/update-user.js`.
   La firma sigue siendo `updateUser(id, changes)`.
   Id, nombre, email y el otro usuario quedan como dice el plan.
   Las queries y el `return` no cambian de mensaje.

3. Abrir `logic/find-user-by-email.js`.
   La firma sigue siendo `findUserByEmail(email)`.
   El email queda como dice el plan.
   El resto del fichero no cambia de mensaje.

4. Abrir `logic/delete-user.js`.
   La firma sigue siendo `deleteUser(id)`.
   La comprobación del id queda como dice el plan.
   El resto no cambia.

5. Abrir `logic/users-gender-count.js`.
   La firma sigue siendo `usersGenderCount(names)`.
   Los cambios son los de «Conteo por género».
   `MODEL`, `BATCH_SIZE` y la llamada a la IA no cambian.

6. Abrir `queries/users.js`.
   El directorio, las lecturas y las ejecuciones quedan como dice «Queries».
   Las firmas no cambian.

7. Abrir `db/connection.js`.
   El texto es el del apartado «Conexión».
   Sigue exportando `db`.

8. Abrir `docs/CONSTITUTIONS.md`.
   En «Un fichero de logic», la frase queda como dice «Firmas».

9. Comprobar.
   En `first-app`, `pnpm format` termina bien.
   `pnpm lint` termina bien.
   Los clients de terminal siguen devolviendo lo mismo.
