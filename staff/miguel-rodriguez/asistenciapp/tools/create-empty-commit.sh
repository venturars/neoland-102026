#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

# No incorpora los archivos preparados en el índice real.
[[ $# -eq 1 && "$1" =~ ^[0-9]+$ ]] || { echo "Uso: NUMERO" >&2; exit 1; }
number=$1
branch=$(git symbolic-ref --quiet --short HEAD) || {
  echo "HEAD separado: selecciona la rama de trabajo." >&2
  exit 1
}
if [[ ! "$branch" =~ ^[0-9]+-(feat|fix|docs|refactor|test|chore)-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Se requiere una rama de trabajo número-tipo-descripcion." >&2
  exit 1
fi
[[ "$branch" == "$number-"* ]] || { echo "La rama no corresponde a la issue." >&2; exit 1; }
if [[ -n $(git ls-files --unmerged) ]]; then
  echo "Hay conflictos sin resolver." >&2
  exit 1
fi
for operation in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
  if [[ -e $(git rev-parse --git-path "$operation") ]]; then
    echo "Hay una operación de git pendiente: ${operation}." >&2
    exit 1
  fi
done

tmp_index=$(mktemp)
trap 'rm -f "$tmp_index"' EXIT
GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git commit --allow-empty -m "chore: open #$number"
echo "Commit vacío creado para #$number."
