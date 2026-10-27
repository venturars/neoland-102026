#!/bin/sh

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd) || exit 1
cd "$script_dir/.." || exit 1

notebook_version="7.6.3"
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

# Windows guarda Python en Scripts; Linux lo guarda en bin.
if [ "$is_windows" -eq 1 ]; then
  env_python=".venv/Scripts/python.exe"
else
  env_python=".venv/bin/python"
fi

python3_check='import sys; sys.exit(0 if sys.version_info.major == 3 else 1)'

if [ ! -e "$env_python" ]; then
  found=0
  status=1

  if [ "$is_windows" -eq 1 ]; then
    if python -c "$python3_check" >/dev/null 2>&1; then
      python -m venv .venv
      status=$?
      found=1
    elif py -3 -c "$python3_check" >/dev/null 2>&1; then
      py -3 -m venv .venv
      status=$?
      found=1
    elif python3 -c "$python3_check" >/dev/null 2>&1; then
      python3 -m venv .venv
      status=$?
      found=1
    fi
  else
    if python3 -c "$python3_check" >/dev/null 2>&1; then
      python3 -m venv .venv
      status=$?
      found=1
    elif python -c "$python3_check" >/dev/null 2>&1; then
      python -m venv .venv
      status=$?
      found=1
    fi
  fi

  if [ "$found" -eq 0 ]; then
    echo "Python 3 is required to start Jupyter." >&2
    exit 1
  fi

  if [ "$status" -ne 0 ]; then
    exit "$status"
  fi
fi

notebook_check="import sys; from importlib.metadata import version; sys.exit(0 if version('notebook') == '${notebook_version}' else 1)"

if ! "$env_python" -c "$notebook_check" >/dev/null 2>&1; then
  if ! "$env_python" -m pip --version >/dev/null 2>&1; then
    "$env_python" -m ensurepip --upgrade
    status=$?
    if [ "$status" -ne 0 ]; then
      exit "$status"
    fi
  fi

  "$env_python" -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org "notebook==${notebook_version}"
  status=$?
  if [ "$status" -ne 0 ]; then
    exit "$status"
  fi
fi

# Los kernels heredan UTF-8 para leer la salida de Node también en Windows.
PYTHONUTF8=1 exec "$env_python" -m notebook clients/jupyter
status=$?
exit "$status"
