# Tareas — mover el código de la app a src

Issue: #598.

1. Desde `first-app`, mueve `db/`, `queries/`, `logic/` y `clients/` dentro de
   `src/`. El contenido de cada carpeta es el mismo. En la raíz ya no están
   esas cuatro carpetas.

2. Abre `src/logic/list-users.js`, `src/queries/user.js` y `src/db/connections.js`.
   Los `import` relativos y `users.sqlite` junto a `connections.js` siguen igual.
   No edites esos ficheros ni los `.sql`.

3. Abre cada `.txt` de [src/clients/terminal/](../../../src/clients/terminal/).
   Sustituye `./logic/` por `./src/logic/`. En `create-user-table.txt`,
   `./db/` pasa a `./src/db/` y `./queries/` a `./src/queries/`. El comentario
   del directorio actual no cambia.

4. Abre cada cuaderno de [src/clients/jupyter/](../../../src/clients/jupyter/).
   Deja el `import` del programa de Node igual que el `.txt` del mismo nombre.
   La tabla no cambia.

5. Abre [package.json](../../../package.json). El script `format` pasa a
   `prettier --write "src/db/**/*.js" "src/queries/**/*.js" "src/logic/**/*.js"`.
   `jupyter`, `lint` y `test` no cambian.

6. Abre [eslint.config.js](../../../eslint.config.js). El ignore
   `clients/jupyter/**` pasa a `src/clients/jupyter/**`. El resto no cambia.

7. Abre [scripts/jupyter.sh](../../../scripts/jupyter.sh). El arranque pasa de
   `clients/jupyter` a `src/clients/jupyter`. El `cd` a la raíz de first-app
   no cambia.

8. Abre [AGENTS.md](../../../AGENTS.md), en **## Al terminar una tarea**. El
   cliente pasa a `src/clients/terminal/` y el import a `src/logic/`. El
   directorio actual sigue siendo first-app.

9. Abre [docs/TREE.md](../../TREE.md). Anida `db/`, `queries/`, `logic/` y
   `clients/` bajo `src/`. El resto del árbol no se mueve.

10. Abre [docs/ARCHITECTURE.md](../../ARCHITECTURE.md). Las rutas de `db/`,
    `queries/`, `logic/`, `clients/` y el arranque de Jupyter pasan a llevar
    el prefijo `src/`.

11. Abre [docs/DATABASE.md](../../DATABASE.md). `db/users.sqlite`,
    `db/connections.js`, `queries/` y `queries/user.js` pasan a `src/`.

12. Abre [docs/ERRORS.md](../../ERRORS.md). `logic/errors.js` y «no sale de
    `logic/`» pasan a `src/`.

13. Abre [docs/STYLE.md](../../STYLE.md). El contrato de `logic/` y
    `logic/errors.js` pasan a `src/`.

14. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md). Estas tres rutas
    pasan a `src/`: un fichero nuevo en `logic/`, las reglas que no se mueven
    a `queries/` ni a `clients/`, y la llamada a `queries/user.js`.

15. Desde `first-app`, pega
    [src/clients/terminal/list-users.txt](../../../src/clients/terminal/list-users.txt).
    Sale la misma lista de usuarios que antes.

16. Desde `first-app`, ejecuta `pnpm run format` y `pnpm run lint`. Los dos
    terminan sin error.
