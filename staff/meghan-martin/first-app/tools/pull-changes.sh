#!/usr/bin/env bash
# Adelanta staging local a origin/staging solo en fast-forward.
# No cambia la rama en la que estás.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

if [[ $# -gt 0 ]]; then
  echo "pull-changes.sh no lleva argumentos." >&2
  exit 1
fi

enter_repo
refuse_merge_in_progress

current=$(git rev-parse --abbrev-ref HEAD)

git fetch origin staging

if ! git show-ref --verify --quiet refs/remotes/origin/staging; then
  echo "No existe origin/staging." >&2
  exit 1
fi

if git show-ref --verify --quiet refs/heads/staging; then
  if ! git merge-base --is-ancestor staging origin/staging; then
    echo "staging local no se puede adelantar. Solo fast-forward." >&2
    exit 1
  fi
  if [[ "$current" == "staging" ]]; then
    git merge --ff-only origin/staging
  else
    git branch -f staging origin/staging
  fi
else
  git branch staging origin/staging
fi

now=$(git rev-parse --abbrev-ref HEAD)
if [[ "$now" != "$current" ]]; then
  echo "La rama actual cambió. No debía." >&2
  exit 1
fi

echo "staging quedó en $(git rev-parse --short staging)."
