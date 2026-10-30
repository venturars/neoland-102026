#!/usr/bin/env bash
# Adelanta la rama base local a su remoto solo en fast-forward.
# No cambia la rama en la que estás.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

# Rama base: GIT_WORKFLOW_BASE, staging si existe en origin, o la rama por defecto de origin.
detect_base() {
  local head candidate
  if [[ -n "${GIT_WORKFLOW_BASE:-}" ]]; then
    if [[ ! "$GIT_WORKFLOW_BASE" =~ ^[A-Za-z0-9._/-]+$ ]]; then
      echo "GIT_WORKFLOW_BASE tiene que ser el nombre de una rama." >&2
      return 1
    fi
    echo "${GIT_WORKFLOW_BASE#origin/}"
    return
  fi
  if git show-ref --verify --quiet refs/remotes/origin/staging; then
    echo "staging"
    return
  fi
  if head=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null); then
    echo "${head#origin/}"
    return
  fi
  for candidate in main master; do
    if git show-ref --verify --quiet "refs/remotes/origin/${candidate}"; then
      echo "$candidate"
      return
    fi
  done
  echo "No se pudo detectar la rama base. Defínela con GIT_WORKFLOW_BASE." >&2
  return 1
}

if [[ $# -gt 0 ]]; then
  echo "pull-changes.sh no recibe argumentos." >&2
  exit 1
fi

git fetch origin

base=$(detect_base)

if ! git show-ref --verify --quiet "refs/remotes/origin/${base}"; then
  echo "No existe origin/${base}." >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/${base}"; then
  if ! git merge-base --is-ancestor "$base" "origin/${base}"; then
    echo "${base} no se puede adelantar en fast-forward." >&2
    exit 1
  fi
  if [[ $(git rev-parse --abbrev-ref HEAD) == "$base" ]]; then
    git merge --ff-only "origin/${base}"
  else
    git branch -f "$base" "origin/${base}"
  fi
else
  git branch "$base" "origin/${base}"
fi

echo "${base} quedó en $(git rev-parse --short "$base")."
