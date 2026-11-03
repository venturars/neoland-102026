#!/usr/bin/env bash
# Crea el commit vacío chore: open #N.
# No incluye lo que haya preparado en el índice.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -ne 1 ]]; then
  echo "Uso: create-empty-commit.sh NUMERO" >&2
  exit 1
fi

number=$1

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "El número de issue tiene que ser dígitos." >&2
  exit 1
fi

current=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current" == "staging" || "$current" == "main" ]]; then
  echo "El commit vacío no se hace en ${current}." >&2
  exit 1
fi

tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git commit --allow-empty -m "chore: open #${number}"
echo "Commit vacío chore: open #${number} en ${current}."
