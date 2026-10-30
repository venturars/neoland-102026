#!/bin/sh

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd) || exit 1
cd "$script_dir/.." || exit 1

is_windows=0

case "$(uname -s 2>/dev/null)" in
  MINGW* | MSYS* | CYGWIN*)
    is_windows=1
    ;;
  *)
    if [ "${OS:-}" = "Windows_NT" ]; then
      is_windows=1
    fi
    ;;
esac

if [ "$is_windows" -eq 1 ]; then
  env_python=".venv/Scripts/python.exe"
  jupyter_exe=".venv/Scripts/jupyter-notebook.exe"
else
  env_python=".venv/bin/python"
  jupyter_exe=".venv/bin/jupyter-notebook"
fi

python3_check='import sys; raise SystemExit(0 if sys.version_info[0] == 3 else 1)'

if [ ! -e "$env_python" ]; then
  if [ "$is_windows" -eq 1 ]; then
    if ! py -3 -c "$python3_check" >/dev/null 2>&1; then
      echo "Hace falta Python 3 para arrancar Jupyter." >&2
      exit 1
    fi
    py -3 -m venv .venv || exit
  else
    if ! python3 -c "$python3_check" >/dev/null 2>&1; then
      echo "Hace falta Python 3 para arrancar Jupyter." >&2
      exit 1
    fi
    python3 -m venv .venv || exit
  fi
fi

if [ ! -e "$jupyter_exe" ]; then
  "$env_python" -m pip install "notebook==7.6.3" || exit
fi

if [ ! -e "$jupyter_exe" ]; then
  "$env_python" -m pip install --force-reinstall --no-deps "notebook==7.6.3" || exit
fi

PYTHONUTF8=1 exec "$jupyter_exe" clients/jupyter --ip=127.0.0.1
