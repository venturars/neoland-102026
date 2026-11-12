#!/bin/sh

# 1. Move to the app folder, so the page can import logic/ and node_modules/
script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd) || exit 1
cd "$script_dir/.." || exit 1

HOST="127.0.0.1"
PORT="8000"

# 2. Windows names Python python or py; macOS and Linux name it python3
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
  candidates="python py python3"
else
  candidates="python3 python"
fi

# 3. Use the first Python 3 found
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
  echo "Python 3 is required to start the web client." >&2
  exit 1
fi

# 4. Hand out the app's files, only to this computer
echo "Open http://$HOST:$PORT/clients/web/ in Chrome or Edge."
exec $python_cmd -m http.server "$PORT" --bind "$HOST"
