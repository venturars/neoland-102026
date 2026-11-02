#!/usr/bin/env bash
# Crea número-tipo-descripcion desde la base indicada.
# Para salir de staging usa create-branch-from-staging.sh.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

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

enter_repo
refuse_merge_in_progress
validate_issue_number "$number"
validate_type "$type"
validate_slug "$description"

branch="${number}-${type}-${description}"

git fetch origin

if git show-ref --verify --quiet "refs/heads/${branch}"; then
  switch_keep_ignored "$branch"
  drop_staging_upstream
  echo "La rama ${branch} ya existía. Sigues en ella."
  exit 0
fi

if git show-ref --verify --quiet "refs/remotes/origin/${branch}"; then
  switch_keep_ignored --track "origin/${branch}"
  drop_staging_upstream
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

switch_keep_ignored -c "$branch" "$start"
drop_staging_upstream
echo "Rama ${branch} creada desde ${start}."
