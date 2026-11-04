#!/usr/bin/env bash
# Crea una PR con base staging, en draft y asignada al usuario autenticado.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -ne 3 || -z "$1" || -z "$2" || -z "$3" ]]; then
  echo "Uso: create-pr-base-staging.sh RAMA TITULO CUERPO" >&2
  exit 1
fi

if [[ ! -f "$3" || ! -r "$3" ]]; then
  echo "El fichero del cuerpo debe existir y ser legible." >&2
  exit 1
fi

gh pr create --base staging --head "$1" --title "$2" --body-file "$3" --draft --assignee "@me"
