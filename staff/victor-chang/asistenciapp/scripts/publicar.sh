#!/usr/bin/env bash
# Copia esta carpeta al repositorio público y, con una etiqueta, lanza su compilación
# (spec 007 · plan v1.2 §2.11, tarea T15; constitución §7).
#
# Uso, desde cualquier carpeta del repositorio del curso:
#   staff/victor-chang/asistenciapp/scripts/publicar.sh            # solo actualiza main (README, página)
#   staff/victor-chang/asistenciapp/scripts/publicar.sh v1.0.0     # además, publica esa versión
#
# La etiqueta debe coincidir con __version__ de attendance/__init__.py (vX.Y.Z, o vX.Y.Z-rcN para
# una versión de prueba). El flujo .github/workflows/publicar.yml lo vuelve a comprobar.

set -euo pipefail

REMOTE="https://github.com/ChangVictor/asistenciapp.git"
PREFIX="staff/victor-chang/asistenciapp"
SPLIT_BRANCH="asistenciapp-publica-tmp"
TAG="${1:-}"

cd "$(git rev-parse --show-toplevel)"

if [ -n "$TAG" ]; then
  version=$(sed -n 's/^__version__ = "\(.*\)"$/\1/p' "$PREFIX/attendance/__init__.py")
  if [ "${TAG#v}" != "$version" ] && [[ ! "${TAG#v}" =~ ^"$version"-rc[0-9]+$ ]]; then
    echo "Error: la etiqueta $TAG no coincide con __version__ = $version ($PREFIX/attendance/__init__.py)." >&2
    exit 1
  fi
fi

echo "Copiando $PREFIX (su historial) para el repositorio público…"
git branch -D "$SPLIT_BRANCH" >/dev/null 2>&1 || true
commit=$(git subtree split --prefix="$PREFIX" -b "$SPLIT_BRANCH" 2>/dev/null | tail -n 1)
trap 'git branch -D "$SPLIT_BRANCH" >/dev/null 2>&1 || true' EXIT

git push "$REMOTE" "$SPLIT_BRANCH:main"
if [ -n "$TAG" ]; then
  git push "$REMOTE" "$commit:refs/tags/$TAG"
  echo "Etiqueta $TAG subida: la compilación empieza en https://github.com/ChangVictor/asistenciapp/actions"
else
  echo "main actualizada (sin etiqueta: no se compila nada)."
fi
