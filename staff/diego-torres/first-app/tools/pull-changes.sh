#!/usr/bin/env bash
# Adelanta staging local a origin/staging solo en fast-forward.
# No cambia la rama en la que estás.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -gt 0 ]]; then
  echo "pull-changes.sh no recibe argumentos." >&2
  exit 1
fi

git fetch origin staging

if ! git show-ref --verify --quiet refs/remotes/origin/staging; then
  echo "No existe origin/staging." >&2
  exit 1
fi

if git show-ref --verify --quiet refs/heads/staging; then
  if ! git merge-base --is-ancestor staging origin/staging; then
    echo "staging no se puede adelantar en fast-forward." >&2
    exit 1
  fi
  if [[ $(git rev-parse --abbrev-ref HEAD) == "staging" ]]; then
    git merge --ff-only origin/staging
  else
    git branch -f staging origin/staging
  fi
else
  git branch staging origin/staging
fi

echo "staging quedó en $(git rev-parse --short staging)."
