#!/bin/sh

# 1. Move to the app folder, so the script works from any current folder
script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd) || exit 1
cd "$script_dir/.." || exit 1

NOTEBOOK_VERSION="7.6.3"

# 2. Windows keeps the Python of a venv in Scripts; macOS and Linux keep it in bin
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
  candidates="python py python3"
else
  env_python=".venv/bin/python"
  candidates="python3 python"
fi

# 3. Create .venv with the first Python 3 found
if [ ! -e "$env_python" ]; then
  python_cmd=""
  for candidate in $candidates; do
    if [ "$candidate" = "py" ]; then
      candidate="py -3"
    fi
    if $candidate -c "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)" >/dev/null 2>&1; then
      python_cmd=$candidate
      break
    fi
  done

  if [ -z "$python_cmd" ]; then
    echo "Python 3 is required to start Jupyter." >&2
    exit 1
  fi

  $python_cmd -m venv .venv || exit $?
fi

# 4. Install notebook at the exact version, only when it is missing or different
notebook_check="import sys; from importlib.metadata import version; sys.exit(0 if version('notebook') == '$NOTEBOOK_VERSION' else 1)"

if ! "$env_python" -c "$notebook_check" >/dev/null 2>&1; then
  if ! "$env_python" -m pip --version >/dev/null 2>&1; then
    "$env_python" -m ensurepip --upgrade || exit $?
  fi
  "$env_python" -m pip install "notebook==$NOTEBOOK_VERSION" || exit $?
fi

# 5. The kernels inherit UTF-8, so the Node output reads well on Windows too
PYTHONUTF8=1 exec "$env_python" -m notebook clients/jupyter
