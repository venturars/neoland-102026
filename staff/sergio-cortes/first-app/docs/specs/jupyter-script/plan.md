# Plan — script de Jupyter multiplataforma

Issue: #557.

No es una funcionalidad de dominio. No hay firma nueva en `logic/` ni SQL
nuevo. Sustituye el arranque inline del script `jupyter` en `package.json` por
`scripts/jupyter.sh`, manteniendo el mismo comportamiento visible: cuadernos en
`clients/jupyter/` y `notebook==7.6.3` en `.venv/`.

La spec `jupyter-client` sigue describiendo los cuadernos; este plan solo
cambia cómo se lanza Jupyter.

## Ficheros

Se crea:

- `scripts/jupyter.sh`

Se toca:

- `package.json` — el script `jupyter` pasa a `sh scripts/jupyter.sh`
- `docs/TREE.md` — entra `scripts/jupyter.sh`
- `docs/ARCHITECTURE.md` — el párrafo de `clients/jupyter/` menciona
  `scripts/jupyter.sh` en lugar del one-liner de shell en `package.json`
- `docs/specs/jupyter-client/plan.md` — el apartado de arranque apunta al
  script en `scripts/`

No se tocan los cuadernos de `clients/jupyter/`, `logic/`, ni las dependencias
de Node en `package.json`.

## Arranque

`scripts/jupyter.sh` usa `#!/bin/sh`, resuelve la raíz de first-app desde su
propia ruta y se ejecuta con `sh scripts/jupyter.sh` desde `package.json`.

Detecta Windows (`MINGW*`, `MSYS*`, `CYGWIN*` o `OS=Windows_NT`). En Windows
el Python del entorno es `.venv/Scripts/python.exe`; en Mac y Linux es
`.venv/bin/python`.

Si no existe ese intérprete, busca Python 3: en Windows prueba `python`, `py -3`
y `python3`; en Mac y Linux prueba `python3` y `python`. Comprueba que el
candidato sea Python 3 antes de crear `.venv` con `-m venv`. Si no hay Python 3,
muestra `Python 3 is required to start Jupyter.` y termina con error.

Con el Python del entorno comprueba `notebook==7.6.3`. Si falta o es otra versión,
comprueba pip, lo prepara con `ensurepip` si falta e instala
`notebook==7.6.3`. Si ya está esa versión, no instala nada.

Arranca ese Python con `-m notebook clients/jupyter`, desde la raíz de la app,
con entrada y salida en la terminal y con `PYTHONUTF8=1`. Propaga el código de
salida.

Un comentario breve en el script explica la diferencia de rutas entre Windows y
el resto de sistemas.

## Contrato

Cambio de configuración y arranque. Los errores de preparación pertenecen al
script.

## Comprobación

Desde la raíz de first-app:

- `pnpm run jupyter` (equivalente a `npm run jupyter`) lanza `scripts/jupyter.sh`
  y abre los cuadernos.
- En Mac, comprobar arranque real si hay entorno disponible.
- En Windows y Linux, comprobar arranque real cuando haya acceso; si no, dejar
  anotado qué falta validar.

Parar el servidor al terminar la prueba.
