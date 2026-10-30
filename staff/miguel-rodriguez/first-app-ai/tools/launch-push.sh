#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

# Publica únicamente HEAD sin aceptar argumentos de fuerza.
[[ $# -eq 0 ]] || { echo "Este script no recibe argumentos; no admite force push." >&2; exit 1; }
branch=$(git symbolic-ref --quiet --short HEAD) || {
  echo "HEAD separado: selecciona la rama de trabajo." >&2
  exit 1
}
if [[ ! "$branch" =~ ^[0-9]+-(feat|fix|docs|refactor|test|chore)-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Se requiere una rama de trabajo número-tipo-descripcion." >&2
  exit 1
fi
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

git push -u origin HEAD
echo "Rama publicada: $branch en origin."
