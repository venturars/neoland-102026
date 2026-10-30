# Tareas — una carpeta para el código

1. Mueve `db/` a `src/db/`.
   Entra `connection.js`. Si `users.sqlite` está al lado, entra con ella.
   El texto de `connection.js` no cambia.
   `src/db/connection.js` se puede leer.

2. Mueve `logic/` a `src/logic/`.
   Entran todos los `.js`. Los imports no cambian.
   Sigue importando `../queries/users.js`.
   Un `.js` de `src/logic/` se puede leer.

3. Mueve `queries/` a `src/queries/`.
   Entran `users.js` y la carpeta `queries/` de los `.sql`.
   `users.js` sigue importando `../db/connection.js` y leyendo los `.sql` de al lado.
   `src/queries/users.js` se puede leer.

4. Mueve `clients/` a `src/clients/`.
   Entran `terminal/` y `jupyter/`.
   El texto todavía no cambia.
   `src/clients/terminal/` y `src/clients/jupyter/` se pueden ver.

5. Abre cada `.txt` de `src/clients/terminal/`.
   El import pasa de `./staff/luis-duque/first-app/logic/...` a `./staff/luis-duque/first-app/src/logic/...`.
   Cada archivo sigue siendo una sola línea.
   Se tira desde la raíz del repositorio.

6. Abre cada `.ipynb` de `src/clients/jupyter/`.
   El import pasa de `./logic/...` a `./src/logic/...`.
   El bloque se sigue ejecutando desde `first-app`.
   Un documento se puede leer.

7. Abre `scripts/jupyter.sh`.
   El script se queda en `scripts/`.
   Abre `src/clients/jupyter` en vez de `clients/jupyter`.
   El fichero se puede leer.

8. Abre `package.json`.
   El script `format` da formato al JavaScript de `src/db`, `src/queries` y `src/logic`.
   No cambian las dependencias ni `pnpm-lock.yaml`.
   El script se puede leer.

9. Abre `AGENTS.MD`.
   Las rutas de `db`, `logic`, `queries` y `clients` llevan `src/` delante.
   El flujo de git y «Desarrollos» se quedan.
   El fichero se puede leer.

10. Abre `docs/TREE.md`.
    El árbol mete `db/`, `logic/`, `queries/` y `clients/` dentro de `src/`.
    No quita el resto.
    El fichero se puede leer.

11. Abre `docs/ARCHITECTURE.md`, `docs/DATABASE.md` y `docs/STYLE.md`.
    Donde nombran esas carpetas, la ruta lleva `src/` delante.
    El papel de cada una se queda.
    Los tres ficheros se pueden leer.

12. Lee `docs/CONSTITUTIONS.MD`, `eslint.config.js`, `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.
    Siguen igual. Las specs de desarrollos anteriores no se reescriben.
    No hay paquete nuevo.
    `pnpm-lock.yaml` sigue igual.
