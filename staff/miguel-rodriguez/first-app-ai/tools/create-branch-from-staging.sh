#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

# Crea desde staging actualizado; reanuda sin reescribir una rama existente.
[[ $# -eq 3 ]] || { echo "Uso: NUMERO TIPO DESCRIPCION" >&2; exit 1; }
number=$1
type=$2
description=$3
[[ "$number" =~ ^[0-9]+$ ]] || { echo "Número de issue inválido." >&2; exit 1; }
case "$type" in feat|fix|docs|refactor|test|chore) ;; *) echo "Tipo inválido." >&2; exit 1;; esac
[[ "$description" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "Descripción inválida." >&2; exit 1; }
branch="${number}-${type}-${description}"
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

if git show-ref --verify --quiet "refs/heads/$branch"; then
  git switch "$branch"
  echo "Rama existente: $branch. No se ha actualizado su base."
else
  if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    git fetch origin "refs/heads/$branch:refs/remotes/origin/$branch"
    git switch --track "origin/$branch"
    echo "Rama remota existente: $branch. No se ha actualizado su base."
  else
    remote_status=$?
    [[ "$remote_status" -eq 2 ]] || {
      echo "No se pudo comprobar si la rama existe en origin." >&2; exit "$remote_status";
    }

    git fetch origin staging
    [[ $(git rev-parse staging) == $(git rev-parse origin/staging) ]] || {
      echo "Actualiza staging antes de abrir la rama." >&2; exit 1;
    }
    git switch -c "$branch" staging
    echo "Rama creada: $branch desde staging."
  fi
fi
