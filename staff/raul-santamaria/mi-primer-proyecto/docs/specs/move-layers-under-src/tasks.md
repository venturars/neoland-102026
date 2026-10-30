# Tareas — capas dentro de src

- [x] 1. Mover `clients/`, `db/`, `queries/` y `logic/` dentro de `src/`. Cada una conserva lo que ya tiene. `users.sqlite` va con `db/` y sigue fuera de git. En la raíz ya no están esas cuatro carpetas.
- [x] 2. Abrir los cinco `.txt` de `src/clients/terminal/`. El comentario del directorio sigue igual. Cada import pasa a `./src/logic/` con el mismo fichero de ahora.
- [x] 3. Abrir `start-jupyter.js`. El arranque del notebook pasa a `src/clients/jupyter`. El resto del script no cambia.
- [x] 4. Abrir `package.json`. `format` apunta a `src/db/**/*.js`, `src/queries/**/*.js` y `src/logic/**/*.js`. `lint` no cambia.
- [x] 5. Abrir `docs/TREE.md`. Las cuatro capas quedan dentro de `src/`. El resto del árbol no cambia.
- [x] 6. Abrir `docs/ARCHITECTURE.md`. Las rutas de las cuatro capas llevan el prefijo `src/`. El resto del documento no cambia.
- [x] 7. Comprobar: `clients`, `db`, `queries` y `logic` están en `src/` y no en la raíz. Pegar `src/clients/terminal/create-user.txt` con el directorio en `mi-primer-proyecto` escribe el usuario. `pnpm lint` termina sin errores.
