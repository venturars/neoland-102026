# Jupyter — CRUD de usuarios

Ejercicio aparte del RAG: SQLite en `src/`, sin ChromaDB ni Ollama. Capas en [ARCHITECTURE.md](ARCHITECTURE.md).

## Arrancar

Desde `staff/raul-santamaria/ChromaDB`, con el entorno virtual activo:

```bash
python -m jupyter notebook src/clients/jupyter
```

Los notebooks resuelven imports subiendo hasta `src/`. Ábrelos desde la lista de Jupyter.

## Notebooks

Uno por acción:

- `create_user`
- `read_users`
- `update_user`
- `delete_user`

En cada uno: ejecutar la celda «1. Prepara el notebook», luego editar datos en la celda de la acción y ejecutar.

`gender`: `male`, `female`, `undefined`.

## Base de datos

- Se crea en `src/db/users.sqlite` la primera vez.
- Reset (con Jupyter parado):

macOS:

```bash
rm src/db/users.sqlite
```

Windows (PowerShell):

```powershell
Remove-Item src/db/users.sqlite
```

## Cerrar

`Ctrl+C` en la terminal donde corre Jupyter.
