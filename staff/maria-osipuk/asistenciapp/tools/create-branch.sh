#!/usr/bin/env bash
# Crea la rama desde la base indicada.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -ne 4 ]]; then
  echo "Uso: create-branch.sh BASE NUMERO TIPO DESCRIPCION" >&2
  exit 1
fi

base=$1
number=$2
type=$3
description=$4

if [[ "$base" == "staging" || "$base" == "origin/staging" ]]; then
  echo "Para salir de staging usa create-branch-from-staging.sh." >&2
  exit 1
fi

if [[ ! "$base" =~ ^[A-Za-z0-9._/-]+$ ]]; then
  echo "La base tiene que ser el nombre de una rama." >&2
  exit 1
fi

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "El número de issue tiene que ser dígitos." >&2
  exit 1
fi

if [[ ! "$description" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "La descripción va en minúsculas y con guiones." >&2
  exit 1
fi

branch="${number}-${type}-${description}"

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

git switch -c "$branch" "$start"
echo "Rama ${branch} creada desde ${start}."
