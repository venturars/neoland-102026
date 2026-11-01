#!/usr/bin/env bash
# Hace un commit solo con los ficheros nombrados.
# Lo demás que estuviera preparado sigue preparado.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -lt 2 ]]; then
  echo "Uso: commit-changes.sh MENSAJE FICHERO [FICHERO...]" >&2
  exit 1
fi

message=$1
shift

for path in "$@"; do
  case "$path" in
    -A|--all|.)
      echo "No se admite añadir todo el directorio." >&2
      exit 1
      ;;
  esac
  if [[ -d "$path" ]]; then
    echo "No se admite un directorio: ${path}" >&2
    exit 1
  fi
done

tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git add -- "$@"
GIT_INDEX_FILE=$tmp_index git commit -m "$message"

git add -- "$@"

echo "Commit creado: ${message}"
echo "Ficheros:"
printf ' - %s\n' "$@"
