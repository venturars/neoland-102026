# Plan — una carpeta para el código

Cumple `docs/specs/source-folder/spec.md`.

No hay función nueva, ni SQL nuevo, ni cliente nuevo. Las operaciones de los usuarios siguen igual. No se añade ningún paquete. Socket no aplica.

## Ficheros

Se mueven, enteras, a `src/`:

- `db/`
- `logic/`
- `queries/`
- `clients/`

Dentro de esas cuatro, los imports no cambian. `logic` sigue importando `../queries/users.js`. `queries/users.js` sigue importando `../DB/connection.js` y lee los `.sql` de la carpeta `queries` que tiene al lado. `db/connection.js` sigue abriendo `users.sqlite` en su misma carpeta. Si ese archivo está ahí, se mueve con `db/`.

Se toca cada `.txt` de `src/clients/terminal/`. El import pasa de `./staff/luis-duque/first-app/logic/...` a `./staff/luis-duque/first-app/src/logic/...`. La línea sigue siendo una, y se tira desde la raíz del repositorio.

Se toca cada `.ipynb` de `src/clients/jupyter/`. El import pasa de `./logic/...` a `./src/logic/...`. El bloque se sigue ejecutando desde `first-app`.

Se toca `scripts/jupyter.sh`. El script se queda en `scripts/`. Abre `src/clients/jupyter` en vez de `clients/jupyter`.

Se toca `package.json`. El script `format` da formato al JavaScript de `src/db`, `src/queries` y `src/logic`. No cambian las dependencias ni `pnpm-lock.yaml`.

Se toca `AGENTS.MD`. Las rutas de `db`, `logic`, `queries` y `clients` llevan `src/` delante. El flujo de git y «Desarrollos» se quedan.

Se toca `docs/TREE.md`. El árbol mete `db/`, `logic/`, `queries/` y `clients/` dentro de `src/`. No quita el resto.

Se toca `docs/ARCHITECTURE.md`, `docs/DATABASE.md` y `docs/STYLE.md`. Donde nombran esas carpetas, la ruta lleva `src/` delante. El papel de cada una se queda.

No se reescriben las specs de desarrollos anteriores. No se toca `docs/CONSTITUTIONS.MD`. No se tocan `agents/`, `skills/`, `tools/`, `templates/` ni `MCPS/`. No se toca `eslint.config.js`.
