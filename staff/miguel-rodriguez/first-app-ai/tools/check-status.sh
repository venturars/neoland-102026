#!/usr/bin/env bash
# Resume la rama, el remoto y los cambios locales.

set -euo pipefail
[[ $# -eq 0 ]] || { echo "Este script no recibe argumentos." >&2; exit 1; }

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2
  exit 1
}
cd "$root"

list_changes() {
  local changes=$1
  local status path rest label
  if [[ -z "$changes" ]]; then
    echo "  (ninguno)"
    return
  fi
  while IFS=$'\t' read -r status path rest; do
    case "$status" in
      M) label="modificado" ;;
      A) label="nuevo" ;;
      D) label="borrado" ;;
      T) label="tipo cambiado" ;;
      U) label="sin fusionar" ;;
      R*) label="renombrado" ;;
      C*) label="copiado" ;;
      *) label="$status" ;;
    esac
    if [[ -n "$rest" ]]; then
      echo "  ${label}  ${path} -> ${rest}"
    else
      echo "  ${label}  ${path}"
    fi
  done <<<"$changes"
}

branch=$(git rev-parse --abbrev-ref HEAD)

echo "Repositorio: ${root}"
echo "Rama: ${branch}"

if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null); then
  counts=$(git rev-list --left-right --count "HEAD...${upstream}")
  ahead=${counts%%[[:space:]]*}
  behind=${counts##*[[:space:]]}
  echo "Remoto: ${upstream} (${ahead} por subir, ${behind} por bajar)"
else
  echo "Remoto: esta rama no sigue a ninguna"
fi

if git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "Último commit: $(git log -1 --pretty=format:'%h %s')"
else
  echo "Último commit: todavía no hay commits"
fi

echo
echo "Preparados para el commit:"
list_changes "$(git diff --cached --name-status)"

echo "Modificados y sin preparar:"
list_changes "$(git diff --name-status)"

echo "Sin seguimiento:"
untracked=$(git ls-files --others --exclude-standard)
if [[ -z "$untracked" ]]; then
  echo "  (ninguno)"
else
  while IFS= read -r path; do
    echo "  ${path}"
  done <<<"$untracked"
fi
