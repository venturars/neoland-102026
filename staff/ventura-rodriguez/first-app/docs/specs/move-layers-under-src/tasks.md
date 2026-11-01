# Tareas — capas dentro de src

1. Mover `clients/`, `db/`, `queries/` y `logic/` dentro de `src/`.
   Cada una conserva lo que ya tiene.
   `users.sqlite` se mueve con `db/` y sigue fuera de git.
   En la raíz de first-app ya no están esas cuatro carpetas.

2. Abrir los nueve `.txt` de `src/clients/terminal/`.
   El comentario del directorio sigue igual.
   `create-users-table.txt` importa `./src/queries/users.js` y `./src/db/connection.js`.
   Los otros ocho importan desde `./src/logic/` con su fichero de ahora.

3. Abrir `scripts/jupyter.sh`.
   El arranque del notebook pasa a `src/clients/jupyter`.
   El resto del script no cambia.

4. Abrir `package.json`.
   `format` queda como dice «Formato».
   `lint` no cambia.

5. Abrir `docs/TREE.md`.
   El árbol queda como dice «Árbol».
   El resto no cambia.

6. Abrir `docs/ARCHITECTURE.md`.
   Las rutas de las cuatro capas quedan como dice «Arquitectura».
   El resto del documento no cambia.

7. Comprobar.
   `clients`, `db`, `queries` y `logic` están en `src/` y no en la raíz.
   Pegar `src/clients/terminal/create-user.txt` con el directorio en first-app escribe el usuario.
   En first-app, `pnpm lint` termina sin errores.
