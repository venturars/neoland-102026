# Tareas — el código sigue las guías y la app hace lo mismo

1. Abre `logic/shared.js`.
   Las comprobaciones se leen con `if`, una cosa por línea.
   Las firmas y las frases no cambian. `toUser` se queda.
   El archivo se lee.

2. Abre `logic/create-user.js`.
   El dato que llega se lee sin `?.`. Guardar y dejar el usuario plano van en líneas distintas.
   Sigue exportado `insertUser`. `createUser` devuelve el usuario plano.
   El archivo se lee.

3. Abre `logic/list-users.js`.
   Leer la lista y dejarla plana van en líneas distintas.
   Sigue exportado `findAll`. Si no hay filas, devuelve `[]`.
   El archivo se lee.

4. Abre `logic/update-user.js`.
   El nombre y el email que no vienen se copian con `if`, no con `??`.
   Siguen exportados `findById` y `updateUserQuery`. Si no hay cambios, devuelve el usuario que ya estaba.
   El archivo se lee.

5. Abre `logic/users-gender-count.js`.
   Los valores fijos pasan al principio, en mayúsculas. La respuesta de la IA se lee con `if`.
   El modelo, la dirección local, los lotes de 6 y el texto de ejemplo se quedan.
   El archivo se lee.

6. Abre `queries/users.js`.
   Desaparece el helper que lee el SQL. Cada consulta lee su archivo, lo prepara y lo ejecuta.
   El orden de las funciones y los parámetros `:id`, `:name` y `:email` no cambian.
   El archivo se lee.

7. Abre `db/connection.js`.
   Los valores fijos pasan al principio, con el nombre en mayúsculas.
   Se sigue abriendo `db/users.sqlite` y se sigue creando la tabla al abrir.
   El archivo se lee.

8. Abre `scripts/jupyter.js`.
   Los valores fijos pasan al principio, con el nombre en mayúsculas.
   El código de salida vacío se lee con `if`. Jupyter sigue arrancando sobre `clients/jupyter/`.
   El archivo se lee.

9. Abre `logic/find-user-by-email.js`.
   Si ya cumple el orden y una línea hace una sola cosa, no se reescribe.
   Sigue exportado `findByEmail`. Si no hay fila, sigue `User not found`.
   El archivo se lee y se queda.

10. Abre `logic/find-user-by-id.js`.
    Si ya cumple el orden y una línea hace una sola cosa, no se reescribe.
    Sigue exportado `findById`. Si no hay fila, sigue `User not found`.
    El archivo se lee y se queda.

11. Abre `logic/find-user-by-name.js`.
    Si ya cumple el orden y una línea hace una sola cosa, no se reescribe.
    Si la lectura falla, sigue `Could not find the user`.
    El archivo se lee y se queda.

12. Abre `logic/delete-user.js`.
    Si ya cumple el orden y una línea hace una sola cosa, no se reescribe.
    Sigue exportado `removeUser`. Termina en `removeUser` y no devuelve el usuario.
    El archivo se lee y se queda.

13. Desde la raíz del repositorio, pega los `.txt` de `clients/terminal/`.
    No se editan esos archivos ni los de `clients/jupyter/`.
    El resultado es el de antes de este cambio.
    Se ve en la terminal.

14. Desde `staff/esther-patino/first-app`, lanza `format` y `lint`.
    `format` escribe el formato estándar. `lint` avisa si hay un error de sintaxis o de reglas.
    No cambia lo que hace la app.
    Los dos resultados se ven en la terminal.
