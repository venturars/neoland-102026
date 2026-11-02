# Tareas — capas dentro de src

1. Mover `clients/`, `db/`, `queries/` y `logic/` dentro de `src/`.
   Cada una conserva lo que ya tiene.
   `users.sqlite` se mueve con `db/` y sigue fuera de git.
   En la raíz de first-app ya no están esas cuatro carpetas.

2. Abrir los seis `.txt` de `src/clients/terminal/`.
   El comentario del directorio sigue igual.
   Cada uno importa desde `./src/logic/` con su fichero de ahora.

3. Abrir `scripts/jupyter.sh`.
   El arranque del notebook pasa a `src/clients/jupyter`.
   El resto del script no cambia.

4. Abrir `package.json`.
   `format` y `main` quedan bajo `src/`.
   `lint` no cambia.

5. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
   Las cuatro capas llevan el prefijo `src/`.

6. Comprobar.
   `clients`, `db`, `queries` y `logic` están en `src/` y no en la raíz.
   Pegar `src/clients/terminal/create-user.txt` con el directorio en first-app escribe el usuario.
   En first-app, `pnpm lint` termina sin errores.
