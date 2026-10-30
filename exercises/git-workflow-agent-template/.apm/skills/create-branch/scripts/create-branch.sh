#!/usr/bin/env bash
# Crea número-tipo-descripcion desde la rama base o desde la base indicada.

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

if [[ $# -lt 3 || $# -gt 4 ]]; then
  echo "Uso: create-branch.sh NUMERO TIPO DESCRIPCION [BASE]" >&2
  exit 1
fi

number=$1
type=$2
description=$3

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "El número de issue tiene que ser dígitos." >&2
  exit 1
fi

case "$type" in
  feat|fix|docs|refactor|test|chore) ;;
  *)
    echo "El tipo tiene que ser feat, fix, docs, refactor, test o chore." >&2
    exit 1
    ;;
esac

if [[ ! "$description" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "La descripción va en minúsculas y con guiones." >&2
  exit 1
fi

branch="${number}-${type}-${description}"

git fetch origin

if [[ $# -eq 4 ]]; then
  base=$4
  if [[ ! "$base" =~ ^[A-Za-z0-9._/-]+$ ]]; then
    echo "La base tiene que ser el nombre de una rama." >&2
    exit 1
  fi
else
  base=$(detect_base)
fi

if git show-ref --verify --quiet "refs/heads/${branch}"; then
  git switch "$branch"
  echo "La rama ${branch} ya existía. Sigues en ella."
  exit 0
fi

if git show-ref --verify --quiet "refs/remotes/origin/${branch}"; then
  git switch --track "origin/${branch}"
  echo "La rama ${branch} ya estaba en origin. Sigues en ella."
  exit 0
fi

start=""
if git show-ref --verify --quiet "refs/remotes/origin/${base}"; then
  start="origin/${base}"
elif git show-ref --verify --quiet "refs/remotes/${base}"; then
  start="$base"
elif git show-ref --verify --quiet "refs/heads/${base}"; then
  start="$base"
else
  echo "No existe la rama base ${base}." >&2
  exit 1
fi

git switch --no-track -c "$branch" "$start"
echo "Rama ${branch} creada desde ${start}."
