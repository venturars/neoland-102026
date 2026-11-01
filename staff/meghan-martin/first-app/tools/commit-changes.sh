#!/usr/bin/env bash
# Hace un commit solo con los ficheros nombrados.
# El resto del índice se queda como estaba.

set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
# shellcheck disable=SC1091
source "${here}/_common.sh"

if [[ $# -lt 2 ]]; then
  echo "Uso: commit-changes.sh MENSAJE FICHERO [FICHERO...]" >&2
  exit 1
fi

message=$1
shift

if [[ -z "$message" ]]; then
  echo "El mensaje del commit no puede ir vacío." >&2
  exit 1
fi

for path in "$@"; do
  case "$path" in
    -A|--all|.)
      echo "No se admite añadir todo el directorio." >&2
      exit 1
      ;;
  esac
  if [[ -d "$path" ]]; then
    echo "No se admite un directorio: ${path}" >&2
    exit 1
  fi
done

caller=$(pwd)
files=()
for path in "$@"; do
  if [[ "$path" = /* ]]; then
    files+=("$path")
  else
    files+=("${caller}/${path}")
  fi
done

enter_repo
refuse_detached
refuse_main_or_staging "un commit"
refuse_commit_hooks

current=$(git rev-parse --abbrev-ref HEAD)
tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git add -- "${files[@]}"
GIT_INDEX_FILE=$tmp_index git commit -m "$message"

git add -- "${files[@]}"

echo "Commit creado en ${current}: ${message}"
echo "Ficheros:"
printf ' - %s\n' "$@"
