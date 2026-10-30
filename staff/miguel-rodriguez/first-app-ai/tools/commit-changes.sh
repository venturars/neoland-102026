#!/usr/bin/env bash
set -euo pipefail

app=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "No es un repositorio git." >&2; exit 1;
}
cd "$root"
app_relative=${app#"$root/"}
[[ "$app_relative" != "$app" ]] || { echo "La app no pertenece al repositorio." >&2; exit 1; }

# Rutas literales desde la raíz del repo; cada argumento es un archivo.
[[ $# -ge 2 ]] || { echo "Uso: MENSAJE FICHERO [FICHERO...]" >&2; exit 1; }
message=$1
shift
[[ "$message" =~ ^(feat|fix|docs|refactor|test|chore)(\([a-z0-9-]+\))?:[[:space:]][^[:space:]].*$ ]] || {
  echo "Se requiere un conventional commit en inglés." >&2; exit 1;
}
branch=$(git symbolic-ref --quiet --short HEAD) || {
  echo "HEAD separado: selecciona la rama de trabajo." >&2
  exit 1
}
if [[ ! "$branch" =~ ^[0-9]+-(feat|fix|docs|refactor|test|chore)-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Se requiere una rama de trabajo número-tipo-descripcion." >&2
  exit 1
fi
if [[ -n $(git ls-files --unmerged) ]]; then
  echo "Hay conflictos sin resolver." >&2
  exit 1
fi
for operation in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
  if [[ -e $(git rev-parse --git-path "$operation") ]]; then
    echo "Hay una operación de git pendiente: ${operation}." >&2
    exit 1
  fi
done

for path in "$@"; do
  case "$path" in
    "$app_relative/"*) ;;
    *) echo "Archivo fuera de esta app: $path" >&2; exit 1;;
  esac
  case "/$path/" in
    *'/../'*|*'/./'*|*'//'*|*'*'*|*'?'*|*'['*|*']'*|*':'*)
      echo "Se requiere una ruta literal y normalizada: $path" >&2; exit 1;;
  esac
  [[ ! -d "$path" ]] || { echo "No se admiten directorios: $path" >&2; exit 1; }
  # Impide atravesar directorios simbólicos que salen de la app.
  parent=$(cd "$(dirname "$path")" && pwd -P) || exit 1
  case "$parent/" in "$app/"*) ;; *) echo "Ruta externa: $path" >&2; exit 1;; esac
  if [[ ! -e "$path" && ! -L "$path" ]]; then
    git cat-file -e "HEAD:$path" 2>/dev/null || {
      echo "No existe el archivo ni está guardado en HEAD: $path" >&2; exit 1;
    }
  fi
done
tmp_index=$(mktemp)
trap 'rm -f "$tmp_index"' EXIT
GIT_INDEX_FILE=$tmp_index git read-tree HEAD
GIT_INDEX_FILE=$tmp_index git --literal-pathspecs add -- "$@"
GIT_INDEX_FILE=$tmp_index git commit -m "$message"
git --literal-pathspecs reset -q HEAD -- "$@"
printf 'Commit creado: %s\n' "$message"
printf ' - %s\n' "$@"
