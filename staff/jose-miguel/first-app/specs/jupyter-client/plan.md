# Plan · Cliente Jupyter

> Estado: **Aprobado** (2026-10-27) · Spec: [spec.md](spec.md) v1.0

## 1. Visión

Segundo cliente en `clients/jupyter/`. Un `.ipynb` por cada `clients/terminal/<nombre>.txt`. Se abre con `pnpm jupyter`. Notebook 7.6.3 en `.venv` local. No se toca `logic/`, `queries/` ni `db/`.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `scripts/jupyter.sh` |
| Crear | `.gitignore` (`.venv/`, `.ipynb_checkpoints/`, `node_modules/`) |
| Crear | `clients/jupyter/*.ipynb` (6) |
| Crear | esta carpeta `specs/jupyter-client/` |
| Tocar | `package.json` (script `jupyter`) |
| Tocar | `docs/CONSTITUTIONS.md` (árbol + frase del cliente) |
| Tocar | `AGENTS.md` (comando `pnpm jupyter`) |

## 3. Arranque

Script `jupyter` en `package.json`: `sh scripts/jupyter.sh`.

El shell (basado en el de Ventura):

1. Crea `.venv` si falta (Python 3 / `py -3` en Windows).
2. Instala `notebook==7.6.3` si hace falta.
3. Abre `python -m notebook clients/jupyter` (no Lab).

## 4. Notebooks

Cada notebook:

1. Markdown: mismo test que `clients/terminal/<nombre>.txt`.
2. Celda setup (Python): `chdir` a la raíz de `first-app` y un `pre_run_cell` que, si el código empieza por `node --input-type=module`, lo ejecuta con `subprocess` en ese cwd y cancela la ejecución Python.
3. Una celda de código por cada línea `node --input-type=module -e "..."` del `.txt`, **texto idéntico**.
4. Los `#` del `.txt` van en markdown, no en celdas de código.

Salida: stdout/stderr de Node, igual que en la terminal. Sin `cli-table3`.

## 5. Constitución

En el árbol: `clients/jupyter/`. Frase: un notebook por `.txt`, mismo comando `node`, se abre con `pnpm jupyter`.

## 6. Comprobación

| CA | Cómo |
| --- | --- |
| CA-01 | Existen los 6 `.ipynb` con los mismos nombres que los `.txt` |
| CA-02 | Diff visual: cada celda `node` coincide con el `.txt` |
| CA-03 | `pnpm jupyter` abre Notebook sobre `clients/jupyter/` |
| CA-04 | Ejecutar una celda = misma salida que la terminal |
| CA-05 | Primera vez crea `.venv`; `git status` no lo lista |
