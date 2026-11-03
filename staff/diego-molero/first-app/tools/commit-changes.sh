#!/usr/bin/env bash
# Hace un commit solo con los ficheros nombrados.
# Lo demás que estuviera preparado sigue preparado.

set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

if [[ $# -lt 2 ]]; then
  echo "Uso: commit-changes.sh MENSAJE FICHERO [FICHERO...]" >&2
  exit 1
fi

message=$1
shift

current=$(git symbolic-ref --quiet --short HEAD || echo HEAD)
case "$current" in
  main|staging|HEAD)
    echo "El commit de trabajo necesita una rama distinta de main o staging." >&2
    exit 1
    ;;
esac

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
  if [[ ! -f "$path" && ! -L "$path" ]]; then
    tracked=$(GIT_LITERAL_PATHSPECS=1 git -c core.quotepath=false ls-files -- "$path")
    if [[ "$tracked" != "$path" ]]; then
      echo "No es un archivo existente ni un archivo seguido que se haya borrado: ${path}" >&2
      exit 1
    fi
  fi
done

tmp_index=$(mktemp)
cleanup() { rm -f "$tmp_index"; }
trap cleanup EXIT

GIT_INDEX_FILE=$tmp_index git read-tree HEAD
# Las rutas son literales: los corchetes no deben seleccionar otros archivos.
GIT_INDEX_FILE=$tmp_index GIT_LITERAL_PATHSPECS=1 git add -- "$@"
GIT_INDEX_FILE=$tmp_index git commit -m "$message"

GIT_LITERAL_PATHSPECS=1 git add -- "$@"

echo "Commit creado: ${message}"
echo "Ficheros:"
printf ' - %s\n' "$@"
