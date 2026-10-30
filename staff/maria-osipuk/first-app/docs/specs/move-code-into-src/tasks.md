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

## 6. Mover el estilo y los comentarios

Abrir `AGENTS.md` y `docs/STYLE.md`.
Resumir «Nivel del código», «Estilo» y «Comentarios educativos en el código» dentro de `docs/STYLE.md`, sin perder ninguna regla.
Dejar en `AGENTS.md` solo un enlace a `docs/STYLE.md`.

## 7. Mover los tipos y formatos

Abrir `AGENTS.md` y `docs/DATABASE.md`.
Resumir «Tipos y formatos» como una sección de `docs/DATABASE.md`, con los límites de cada campo.
La frase «Las reglas de tipo, formato y validación están definidas en `AGENTS.md`» pasa a apuntar a esa sección.

## 8. Mover el contrato, la seguridad y la documentación

Abrir `AGENTS.md` y `docs/CONSTITUTION.md`.
Resumir en `docs/CONSTITUTION.md` los paquetes con Socket, el contrato de las funciones, las reglas de implementación y seguridad y la sincronización de la documentación.
Corregir las dos frases de la Constitución que remiten a `AGENTS.md`.

## 9. Recortar AGENTS.md

Dejar en `AGENTS.md` solo lo que decide cómo se trabaja: qué va primero, fuente de verdad, antes de editar, forma de trabajar, al terminar y verificación.
Comprobar con `grep` que ninguna guía remite a una sección que ya no está allí.

## 10. Comprobar

Con una copia temporal de la base y `FIRST_APP_DATABASE_FILE`, lanzar un cliente de terminal con un caso correcto y ver el resultado.
Probar un caso incorrecto.
Probar `run_logic.py` con una función.
Ejecutar `git check-ignore src/db/users.sqlite`.
Ejecutar `pnpm format` y `pnpm lint` desde `first-app`.
Buscar con `grep` rutas antiguas que queden.
Comparar la lista de reglas de `AGENTS.md` antes y después para confirmar que ninguna se perdió.
