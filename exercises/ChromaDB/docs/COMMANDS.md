# Comandos — ChromaDB

Se lanzan desde `exercises/ChromaDB`. Con el entorno activo, el prompt muestra `(.venv)`. La guía de la primera instalación, con macOS y Windows, está en `README.md`. Aquí está la lista.

## Entorno

macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows (PowerShell):

```powershell
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
```

Si PowerShell bloquea el script, en esa ventana:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.venv\Scripts\Activate.ps1
```

En el Símbolo del sistema el activador es `.venv\Scripts\activate.bat`.

Después, en los dos sistemas:

```bash
python -m pip install -r requirements.txt
ollama pull qwen3-embedding:0.6b
```

`ollama list` tiene que mostrar `qwen3-embedding:0.6b`. Ollama tiene que seguir en marcha.

## Documentación e índice

`3.15` es un ejemplo. Vale la versión que se quiera, como `3.14` o `3.13`. El parche no se escribe.

```bash
python scripts/download_docs.py 3.15
python scripts/convert_docs.py
python scripts/count_chunks.py
python scripts/build_index.py
```

`count_chunks.py` solo lee Markdown. `build_index.py` borra el índice anterior y lo crea de nuevo. Hace falta Ollama.

## Consultar

```bash
python scripts/search.py "read the contents of a text file"
python scripts/search.py "lazy imports" --kind whatsnew
python scripts/search.py "write json to a file" --module json -n 3
python scripts/get_doc.py pathlib.Path.read_text
```

`search.py` necesita Ollama. `get_doc.py` lee el índice en local. Si dicen `Index not found`, falta `build_index.py`.

## ChromaDash

Parar este servidor antes de un script que escriba en `chroma_db/`.

```bash
chroma run chromadash/chroma-cors.yaml
```

Abre `chromadash/index.html` y conecta a `http://localhost:8000`. Se para con `Ctrl+C`.

macOS: `open chromadash/index.html`. Windows (PowerShell): `Start-Process chromadash/index.html`.

## Jupyter

```bash
python -m jupyter notebook src/clients/jupyter
```

Se para con `Ctrl+C`. Borrar la base: `rm src/db/users.sqlite` en macOS, `Remove-Item src/db/users.sqlite` en PowerShell.

## Formato, lint y tests

```bash
python -m black scripts src tests
python -m black --check scripts src tests
python -m ruff check scripts src tests
python -m pytest
python -m pytest --version
```

`pytest` lee `tests/`. Hasta que haya tests, puede terminar sin recoger ninguno.
