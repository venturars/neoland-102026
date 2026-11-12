# Tareas — alinear el código con las guías

Issue: #513.

1. Abrir [logic/create-user.js](../../../logic/create-user.js).
   La firma sigue siendo `createUser(input)`.
   Nombre y email quedan como dice «Validación de nombre» y «Validación de email».
   El orden de pasos de la constitución y los mensajes no cambian.

2. Abrir [logic/update-user.js](../../../logic/update-user.js).
   La firma sigue siendo `updateUser(input)`.
   Igual que el paso 1 para nombre y email.
   La comprobación de email en uso por otro usuario queda como dice «Crear y cambiar usuario».

3. Abrir [logic/find-user-by-email.js](../../../logic/find-user-by-email.js).
   La firma sigue siendo `findUserByEmail(email)`.
   El email queda como dice «Validación de email».
   El `findByEmail`, el `NotFoundError` y el `return` no cambian de comportamiento.

4. Abrir [logic/find-user-by-name.js](../../../logic/find-user-by-name.js).
   La firma sigue siendo `findUserByName(name)`.
   La validación del nombre queda como «Validación de nombre».
   El bucle que arma la lista de usuarios no cambia el resultado.

5. Abrir [logic/user-gender-count.js](../../../logic/user-gender-count.js).
   La firma sigue siendo `usersGenderCount()`.
   Los cambios son los de «Conteo por género».
   `MODEL`, el lote de 6 y la llamada a Ollama no cambian.

6. Abrir [queries/user.js](../../../queries/user.js).
   Cada `prepare` y su `get`, `all` o `run` quedan en dos líneas como dice «Queries».
   Las firmas y los argumentos nombrados no cambian.

7. Abrir [db/connections.js](../../../db/connections.js).
   La ruta a `users.sqlite` queda como dice «Conexión».
   Sigue exportando `db`.

8. Desde `first-app`, ejecutar `pnpm run format` y `pnpm run lint`.
   Corregir hasta que lint termine sin errores.

9. Comprobar comportamiento.
   Ejecutar los fragmentos de [clients/terminal/](../../../clients/terminal/) que ya existen.
   Los resultados y los mensajes de error deben coincidir con el comportamiento anterior al refactor.
