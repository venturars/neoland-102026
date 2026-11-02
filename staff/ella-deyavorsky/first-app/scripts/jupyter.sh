#!/usr/bin/env bash
# Arranca Jupyter Notebook para los cuadernos de src/clients/jupyter.
# Crea .venv e instala notebook si faltan.

set -euo pipefail

# Va a la raíz del proyecto, esté donde esté quien lo lanza
cd "$(dirname "$0")/.."

if [[ ! -x .venv/bin/jupyter-notebook ]]; then
  # Crea el entorno solo si no existe
  [[ -d .venv ]] || python3 -m venv .venv
  .venv/bin/pip install notebook==7.6.3
fi

.venv/bin/jupyter notebook --ip=127.0.0.1 --port=8888 src/clients/jupyter
