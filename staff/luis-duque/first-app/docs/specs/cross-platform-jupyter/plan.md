# Plan — Jupyter en Mac, Windows y Linux

Cumple `docs/specs/cross-platform-jupyter/spec.md`.

No hay función nueva, ni SQL, ni cliente nuevo. Las operaciones de los usuarios siguen igual. `notebook` sigue en `7.6.3`. No se añade ningún paquete de Node ni se cambia su versión, así que no hay comprobación con Socket.

## Ficheros

Se crea `scripts/jupyter.sh`. Empieza por `#!/bin/sh`. Entra en la raíz de `first-app`, que es la carpeta padre de `scripts/`.

Distingue Windows del resto. Windows es `MINGW`, `MSYS`, `CYGWIN` o `OS=Windows_NT`. Mac y Linux son el resto.

En Windows el Python del entorno es `.venv/Scripts/python.exe`. En Mac y Linux es `.venv/bin/python`. Si ese fichero no existe, Windows crea el entorno con `py -3` y Mac y Linux lo crean con `python3`. Si ese Python 3 no está, el script lo dice y termina.

El ejecutable de Jupyter en Windows es `.venv/Scripts/jupyter-notebook.exe`. En Mac y Linux es `.venv/bin/jupyter-notebook`. Si no existe, el Python del entorno instala `notebook` `7.6.3`. Si sigue sin existir, lo reinstala sin dependencias. Luego lo ejecuta sobre `clients/jupyter` en `127.0.0.1`.

`PYTHONUTF8=1` queda puesto al ejecutarlo, para que en Windows la salida de Node se lea en UTF-8.

Se toca `package.json`. El script `jupyter` pasa a `sh scripts/jupyter.sh`. `format` y `lint` se quedan. No se tocan las dependencias ni `pnpm-lock.yaml`.

Se toca `AGENTS.MD`, en el párrafo del cliente de Jupyter. El arranque deja de ser solo de Windows. Dice que `pnpm jupyter` desde `first-app` llama a `scripts/jupyter.sh`, que crea el `.venv` de la app si falta, instala `notebook` `7.6.3` si falta el ejecutable y abre `clients/jupyter` en `127.0.0.1`. En Windows usa `Scripts` y `py -3`. En Mac y Linux usa `bin` y `python3`. Sigue sin usar el Jupyter del equipo.

Se toca `docs/TREE.md`. El árbol incluye `scripts/jupyter.sh`.

No se tocan `logic`, `queries`, `db` ni `clients`. No se tocan `docs/CONSTITUTIONS.MD` ni `docs/ARCHITECTURE.md`: el arranque sigue siendo `pnpm jupyter` desde `first-app`. No se toca el `AGENTS.md` de la raíz del repositorio.
