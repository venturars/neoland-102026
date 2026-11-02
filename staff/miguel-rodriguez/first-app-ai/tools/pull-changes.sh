#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

# Actualiza staging sin cambiar la rama de trabajo ni guardar cambios locales.
[[ $# -eq 0 ]] || { echo "Este script no recibe argumentos." >&2; exit 1; }
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

git fetch origin staging
if git show-ref --verify --quiet refs/heads/staging; then
  git merge-base --is-ancestor staging origin/staging || {
    echo "staging ha divergido: no se actualiza automáticamente." >&2; exit 1;
  }
  if [[ $(git symbolic-ref --quiet --short HEAD || true) == staging ]]; then
    git merge --ff-only origin/staging
  else
    # Git rechaza mover una rama abierta en otro worktree.
    git branch -f staging origin/staging
  fi
else
  git branch staging origin/staging
fi
echo "staging actualizado a $(git rev-parse --short staging)."
