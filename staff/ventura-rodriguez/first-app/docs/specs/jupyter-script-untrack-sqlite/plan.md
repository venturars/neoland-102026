# Plan — script de Jupyter y base fuera de git

Issue: #392.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo.

La constitución y el código coinciden en la base: es `db/users.sqlite`.
El arranque pasa a `scripts/jupyter.sh`. Las specs `jupyter-client` y
`jupyter-cross-platform` no se modifican.

## Ficheros

Se crea:

- `scripts/jupyter.sh`

Se elimina:

- `scripts/start-jupyter.js`

Se tocan:

- `package.json`
- `.gitignore` de la raíz del repositorio
- `db/users.sqlite`, que deja de versionarse y sigue en el disco

Los notebooks de `clients/jupyter/` no se tocan.

No se tocan `docs/specs/jupyter-client/` ni `docs/specs/jupyter-cross-platform/`.

`db/connection.js` ya existe. La conexión abre `db/users.sqlite`.

## Arranque

`scripts/jupyter.sh` usa `#!/bin/sh`, entra en la raíz de first-app y se puede
ejecutar. Hace el arranque que hoy hace `scripts/start-jupyter.js`.

En Windows el Python del entorno es `.venv/Scripts/python.exe`. En Linux es
`.venv/bin/python`. Si no existe, busca Python 3: `python`, `py -3`, `python3`
en Windows; `python3`, `python` en Linux. Comprueba que sea Python 3 y crea
`.venv` con `-m venv`. Si no hay Python 3, muestra
`Python 3 is required to start Jupyter.` y termina con error.

Con el Python del entorno comprueba `notebook==7.6.3`. Si falta o es otra
versión, comprueba pip, lo prepara con `ensurepip` si falta e instala
`notebook==7.6.3`. Si ya está esa versión, no instala nada.

Arranca ese Python con `-m notebook clients/jupyter`, desde la raíz de la app,
con la entrada y la salida en la terminal y con `PYTHONUTF8=1`. Propaga el
código de salida. Un fallo de preparación o de arranque termina con error.

`package.json` conserva el script `jupyter` con el valor `sh scripts/jupyter.sh`.
El script `test` se queda. `pnpm run jupyter` lanza `scripts/jupyter.sh`.
`scripts/start-jupyter.js` no queda.

## Base

`db/users.sqlite` sale del índice de git y sigue en el disco.
El `.gitignore` de la raíz ignora
`staff/ventura-rodriguez/first-app/db/*.sqlite` y sus `journal`, `wal` y `shm`.
El comentario deja de decir que toda `*.sqlite` de first-app se versiona:
también queda fuera la base de Ventura.

## Contrato

Es un cambio de configuración. No hay función de `logic/`, firma pública ni SQL.

Los fallos de arranque siguen siendo los del lanzador actual. Si no encuentra
Python 3, muestra `Python 3 is required to start Jupyter.`.

## Comprobación

`pnpm run jupyter` lanza `scripts/jupyter.sh` y enseña los notebooks.
`scripts/start-jupyter.js` no existe.
`db/users.sqlite` no está en git y sigue en el disco.
