# Comandos — ChromaDB

Ejecutar desde `staff/raul-santamaria/ChromaDB/` con el entorno virtual activo (`(.venv)` en el prompt).

## Entorno

### Windows (PowerShell)

```powershell
cd staff/raul-santamaria/ChromaDB
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Si PowerShell bloquea scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
cd staff/raul-santamaria/ChromaDB
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Crear el entorno la primera vez: `python3 -m venv .venv` (macOS) o `py -3 -m venv .venv` (Windows).

## Ollama

```bash
ollama pull qwen3-embedding:0.6b
ollama --version
```

Ollama debe estar en marcha (app / icono en bandeja) para indexar y para `search.py`.

## Pipeline de documentación Python

Versión de ejemplo `3.15`; sustituir por la deseada.

```bash
python scripts/download_docs.py 3.15
python scripts/convert_docs.py
python scripts/count_chunks.py
python scripts/build_index.py
```

## Consulta del índice

```bash
python scripts/search.py "read the contents of a text file"
python scripts/get_doc.py pathlib.Path.read_text
```

Si aparece `Index not found`, ejecutar `build_index.py`.

## ChromaDash (opcional)

Desde esta carpeta, con venv activo:

```bash
chroma run chromadash/chroma-cors.yaml
```

Abrir `chromadash/index.html` y conectar a `http://localhost:8000`. **Parar** el servidor (`Ctrl+C`) antes de scripts que escriben en `chroma_db/` (p. ej. `build_index.py`).

Comprobar que el puerto 8000 queda libre al terminar:

- Windows: `Get-NetTCPConnection -LocalPort 8000` no debe devolver nada.
- macOS/Linux: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada.

## Jupyter (CRUD usuarios)

Ver [JUPYTER.md](JUPYTER.md).

## Calidad de código (Black / Ruff)

Sobre un fichero o carpeta concreta (recomendado en cada task):

```bash
python -m black path/to/file.py
python -m black --check path/to/file.py
python -m ruff check path/to/file.py
```

Comprobar que las herramientas están instaladas:

```bash
python -m black --version
python -m ruff --version
```

## Tests automatizados

No hay suite pytest. Las comprobaciones viven en `docs/specs/<cambio>/spec.md` y las ejecuta el tester sobre `src/core` y `src/sdk` cuando aplica.
