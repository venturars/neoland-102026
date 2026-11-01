#!/usr/bin/env bash
# Sube HEAD a origin y fija el upstream. No admite force push.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

for arg in "$@"; do
  case "$arg" in
    -f|--force|--force-with-lease|--force-with-lease=*)
      echo "No se admite el force push." >&2
      exit 1
      ;;
    *)
      echo "launch-push.sh no recibe argumentos." >&2
      exit 1
      ;;
  esac
done

current=$(git symbolic-ref --quiet --short HEAD || echo HEAD)
case "$current" in
  main|staging|HEAD)
    echo "El push necesita una rama de trabajo; no se publica main, staging ni HEAD separado." >&2
    exit 1
    ;;
esac

git push -u origin HEAD
echo "Rama $(git rev-parse --abbrev-ref HEAD) subida a origin."
