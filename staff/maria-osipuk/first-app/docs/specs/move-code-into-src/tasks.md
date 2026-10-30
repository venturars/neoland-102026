# Tareas — Mover el código a src

Issue: #632.

## 1. Mover las carpetas

Crear `src/` en `first-app`.
Mover `logic/`, `queries/` y `clients/` con `git mv`. Mover `db/` con `git mv` para los ficheros de git y con `mv` para `users.sqlite`.
Comprobar que la raíz ya no tiene las cuatro carpetas y que `src/db/users.sqlite` existe.

## 2. Corregir los clientes de terminal

Abrir los ocho `.txt` de `src/clients/terminal/`.
Cada `./logic/` y cada `./queries/` pasa a `./src/logic/` y `./src/queries/`.
Cada fichero sigue con una sola línea.

## 3. Corregir el cliente de Jupyter

Abrir `src/clients/jupyter/run_logic.py`.
La raíz de la app pasa a `parents[3]`. Las ocho rutas de módulos empiezan por `src/`. Se actualizan los comentarios que citan las rutas antiguas.

## 4. Corregir scripts, .gitignore y comentarios

`scripts/jupyter.sh` abre `src/clients/jupyter`.
`.gitignore` ignora `src/db/*.sqlite*` y `src/clients/jupyter/jupyter-client.log`.
`src/db/connection.js` cambia solo los dos comentarios.

## 5. Actualizar las guías

`docs/TREE.md` dibuja `src/`.
`docs/ARCHITECTURE.md`, `docs/CONSTITUTION.md`, `docs/DATABASE.md`, `docs/ERRORS.md` y `AGENTS.md` cambian solo las rutas escritas.

## 6. Comprobar

Con una copia temporal de la base y `FIRST_APP_DATABASE_FILE`, lanzar un cliente de terminal con un caso correcto y ver el resultado.
Probar un caso incorrecto.
Probar `run_logic.py` con una función.
Ejecutar `git check-ignore src/db/users.sqlite`.
Ejecutar `pnpm format` y `pnpm lint` desde `first-app`.
Buscar con `grep` rutas antiguas que queden.
