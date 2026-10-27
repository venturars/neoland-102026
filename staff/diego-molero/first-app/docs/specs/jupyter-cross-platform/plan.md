# Plan — arranque de jupyter en windows y linux

El arranque único está en `scripts/jupyter.sh`. Detecta Windows, elige `.venv/Scripts/python.exe` o `.venv/bin/python`, busca Python 3 y crea el entorno si falta.

Comprueba pip y `notebook==7.6.3`, instala solo cuando hace falta y ejecuta Notebook sobre `clients/jupyter` con `PYTHONUTF8=1`. Conserva argumentos separados y códigos de salida. En Windows se utiliza el sh de Git for Windows.

Comprobar el primer arranque y el segundo en Windows, la lista de nueve documentos y un kernel real. Registrar aparte Linux y macOS si no están disponibles.
