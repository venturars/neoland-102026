#!/usr/bin/env bash
# Crea número-tipo-descripcion desde origin/staging.
# La rama nueva no queda siguiendo a staging.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

if [[ $# -ne 3 ]]; then
  echo "Uso: create-branch-from-staging.sh NUMERO TIPO DESCRIPCION" >&2
  exit 1
fi

enter_repo
refuse_merge_in_progress
validate_issue_number "$1"
validate_type "$2"
validate_slug "$3"

branch="${1}-${2}-${3}"

git fetch origin staging

if ! git show-ref --verify --quiet refs/remotes/origin/staging; then
  echo "No existe origin/staging." >&2
  exit 1
fi

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

switch_keep_ignored -c "$branch" origin/staging
drop_staging_upstream
echo "Rama ${branch} creada desde origin/staging."
