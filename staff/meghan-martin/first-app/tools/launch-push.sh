#!/usr/bin/env bash
# Sube HEAD a origin y fija el upstream. No admite force push.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

for arg in "$@"; do
  case "$arg" in
    -f|--force|--force-with-lease|--force-with-lease=*|--force=*)
      echo "No hago force push." >&2
      exit 1
      ;;
    *)
      echo "launch-push.sh no lleva argumentos." >&2
      exit 1
      ;;
  esac
done

enter_repo
refuse_detached
refuse_main_or_staging "un push"

git push -u origin HEAD
echo "Rama $(git rev-parse --abbrev-ref HEAD) subida a origin."
