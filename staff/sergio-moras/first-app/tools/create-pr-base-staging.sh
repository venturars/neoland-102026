#!/usr/bin/env bash
# Abre la pull request de una rama contra staging, en draft y asignada a quien tiene la sesión de gh.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}

if [[ $# -ne 3 || -z "$1" || -z "$2" || -z "$3" ]]; then
  echo "Uso: create-pr-base-staging.sh RAMA TITULO CUERPO" >&2
  exit 1
fi

branch=$1
title=$2
body_file=$3

if [[ ! -f "$body_file" || ! -r "$body_file" ]]; then
  echo "No se puede leer el fichero del cuerpo: $body_file" >&2
  exit 1
fi

# La ruta del cuerpo se guarda entera antes de ir a la raíz, para que una ruta relativa siga sirviendo.
body_path="$(cd "$(dirname "$body_file")" && pwd)/$(basename "$body_file")"

cd "$root"

gh pr create --base staging --head "$branch" --title "$title" --body-file "$body_path" --draft --assignee "@me"
