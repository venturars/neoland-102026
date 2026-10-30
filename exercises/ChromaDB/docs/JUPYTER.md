# Jupyter — ChromaDB

Los notebooks son la capa `clients` del CRUD. Viven en `src/clients/jupyter/`. Hay uno por acción: `create_user`, `read_users`, `update_user` y `delete_user`.

No usan Chroma ni Ollama. Solo importan `sdk`. No importan `core`, `storage` ni `db`.

## Cómo se abren

Desde `exercises/ChromaDB`, con el entorno activo:

```bash
python -m jupyter notebook src/clients/jupyter
```

Esa carpeta importa: los notebooks suben dos niveles hasta `src/` para encontrar el código. Se abren desde la lista que muestra Jupyter. `python -m jupyter` usa el Jupyter del entorno, igual en macOS y en Windows.

Cada notebook tiene pasos numerados. Primero se ejecuta la celda «1. Prepara el notebook». Después, en la celda de la acción, se cambian los datos y se ejecuta.

`gender` admite `male`, `female` y `undefined`. La edad, el nombre y el email los valida `core`.

## La base

Se crea sola la primera vez, en `src/db/users.sqlite`. No va a git. Para empezar de cero, se para Jupyter y se borra ese fichero.

macOS:

```bash
rm src/db/users.sqlite
```

Windows (PowerShell):

```powershell
Remove-Item src/db/users.sqlite
```

Al terminar, se para Jupyter con `Ctrl+C` en la terminal.

## Formato

Black no formatea estos notebooks y Ruff no los revisa. El código Python del CRUD sigue `docs/STYLE.md`.
