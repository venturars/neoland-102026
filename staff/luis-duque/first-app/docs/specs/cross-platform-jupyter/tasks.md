# Tareas — Jupyter en Mac, Windows y Linux

1. Crea `scripts/jupyter.sh` con `#!/bin/sh`. Entra en `first-app` y separa Windows de Mac y Linux.
   Windows usa `.venv/Scripts` y `py -3`. Mac y Linux usan `.venv/bin` y `python3`. Si no hay Python 3, lo dice y termina.
   Si falta el ejecutable, instala `notebook` `7.6.3` y, si sigue faltando, lo reinstala sin dependencias. Lo abre en `clients/jupyter` en `127.0.0.1` con `PYTHONUTF8=1`.
   El fichero se puede leer.

2. Abre `package.json`.
   El script `jupyter` pasa a `sh scripts/jupyter.sh`.
   `format` y `lint` se quedan. No se tocan dependencias ni `pnpm-lock.yaml`.
   El script se puede leer.

3. Abre `AGENTS.MD`, en el párrafo del cliente de Jupyter.
   `pnpm jupyter` desde `first-app` llama a `scripts/jupyter.sh`.
   Crea el `.venv` si falta, instala `notebook` `7.6.3` si falta el ejecutable y abre `clients/jupyter` en `127.0.0.1`. Windows usa `Scripts` y `py -3`. Mac y Linux usan `bin` y `python3`. No usa el Jupyter del equipo.
   El párrafo se puede leer.

4. Abre `docs/TREE.md`.
   El árbol incluye `scripts/jupyter.sh`.
   No añade carpetas que no existan.
   El árbol se puede leer.

5. Lee `scripts/jupyter.sh`, `package.json`, `AGENTS.MD` y `docs/TREE.md`.
   `jupyter` llama a `sh scripts/jupyter.sh` y el script cubre Windows, Mac y Linux.
   El párrafo de Jupyter nombra `scripts/jupyter.sh`, `py -3` y `python3`.
   `logic`, `queries`, `db`, `clients`, `docs/CONSTITUTIONS.MD` y `docs/ARCHITECTURE.md` siguen igual.
