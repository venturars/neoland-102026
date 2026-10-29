#!/usr/bin/env bash
# Crea el commit vacío chore: open #N.
# No incluye lo que haya preparado en el índice.

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
base=$(detect_base 2>/dev/null) || base=""
for protected in "$base" staging main master; do
  if [[ -n "$protected" && "$current" == "$protected" ]]; then
    echo "El commit vacío no se hace en ${current}." >&2
    exit 1
  fi
done

tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git commit --allow-empty -m "chore: open #${number}"
echo "Commit vacío chore: open #${number} en ${current}."
