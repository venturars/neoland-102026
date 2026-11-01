#!/usr/bin/env bash
# Crea el commit vacío chore: open #N.
# No incluye lo que haya preparado en el índice.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

if [[ $# -ne 1 ]]; then
  echo "Uso: create-empty-commit.sh NUMERO" >&2
  exit 1
fi

enter_repo
validate_issue_number "$1"
refuse_detached
refuse_main_or_staging "un commit"
refuse_commit_hooks

number=$1
current=$(git rev-parse --abbrev-ref HEAD)
tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git commit --allow-empty -m "chore: open #${number}"
echo "Commit vacío chore: open #${number} en ${current}."
