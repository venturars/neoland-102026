#!/usr/bin/env bash
# Crea codex/número-tipo-descripcion desde origin/staging.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -ne 3 ]]; then
  echo "Uso: create-branch-from-staging.sh NUMERO TIPO DESCRIPCION" >&2
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

branch="codex/${number}-${type}-${description}"

# No trasladar cambios pendientes a otra rama al empezar una tarea.
current=$(git symbolic-ref --quiet --short HEAD || echo HEAD)
if [[ "$current" != "$branch" && -n $(git status --porcelain) ]]; then
  echo "Hay cambios locales pendientes; no se cambia de rama." >&2
  exit 1
fi

git fetch origin

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

git switch -c "$branch" origin/staging
echo "Rama ${branch} creada desde origin/staging."
